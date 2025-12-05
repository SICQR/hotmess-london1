-- 051_trust_safety_rpcs.sql
-- RPCs for blocking, muting, reporting, saving beacons

--------------------------------------------------------------------------------
-- RPC: Block User
--------------------------------------------------------------------------------

create or replace function public.block_user(p_blocked_user uuid)
returns void
language plpgsql security definer as $$
declare 
  v_user uuid;
begin
  v_user := public.require_authed();
  
  -- Prevent self-blocking
  if v_user = p_blocked_user then
    raise exception 'cannot_block_self';
  end if;
  
  -- Insert block (idempotent)
  insert into public.user_blocks(blocker_user_id, blocked_user_id)
  values (v_user, p_blocked_user)
  on conflict do nothing;
  
  -- Close any existing Connect threads between these users
  update public.connect_threads
  set status = 'closed'
  where id in (
    select ct.id
    from public.connect_threads ct
    join public.connect_thread_members m1 on m1.thread_id = ct.id and m1.user_id = v_user
    join public.connect_thread_members m2 on m2.thread_id = ct.id and m2.user_id = p_blocked_user
  )
  and status = 'open';
  
  -- Close any Ticket threads between these users
  update public.ticket_threads
  set status = 'closed'
  where id in (
    select tt.id
    from public.ticket_threads tt
    join public.ticket_thread_members m1 on m1.thread_id = tt.id and m1.user_id = v_user
    join public.ticket_thread_members m2 on m2.thread_id = tt.id and m2.user_id = p_blocked_user
  )
  and status = 'open';
end;
$$;

comment on function public.block_user(uuid) is 
  'Block a user. Closes all threads between blocker and blocked. Idempotent.';

--------------------------------------------------------------------------------
-- RPC: Unblock User
--------------------------------------------------------------------------------

create or replace function public.unblock_user(p_blocked_user uuid)
returns void
language plpgsql security definer as $$
declare 
  v_user uuid;
begin
  v_user := public.require_authed();
  
  delete from public.user_blocks 
  where blocker_user_id = v_user 
    and blocked_user_id = p_blocked_user;
end;
$$;

comment on function public.unblock_user(uuid) is 
  'Unblock a user. Does not re-open threads.';

--------------------------------------------------------------------------------
-- RPC: Mute Thread
--------------------------------------------------------------------------------

create or replace function public.mute_thread(
  p_thread_type text, 
  p_thread_id uuid, 
  p_minutes int
)
returns void
language plpgsql security definer as $$
declare 
  v_user uuid;
begin
  v_user := public.require_authed();
  
  -- Validate thread type
  if p_thread_type not in ('connect', 'tickets') then
    raise exception 'invalid_thread_type';
  end if;
  
  -- Ensure minimum 1 minute
  if p_minutes < 1 then
    raise exception 'invalid_duration';
  end if;
  
  -- Upsert mute
  insert into public.thread_mutes(user_id, thread_type, thread_id, muted_until)
  values (
    v_user, 
    p_thread_type, 
    p_thread_id, 
    now() + make_interval(mins => p_minutes)
  )
  on conflict (user_id, thread_type, thread_id)
  do update set 
    muted_until = excluded.muted_until,
    created_at = now();
end;
$$;

comment on function public.mute_thread(text, uuid, int) is 
  'Mute a thread for N minutes. Prevents notifications. Upserts if already muted.';

--------------------------------------------------------------------------------
-- RPC: Unmute Thread
--------------------------------------------------------------------------------

create or replace function public.unmute_thread(
  p_thread_type text, 
  p_thread_id uuid
)
returns void
language plpgsql security definer as $$
declare 
  v_user uuid;
begin
  v_user := public.require_authed();
  
  delete from public.thread_mutes 
  where user_id = v_user 
    and thread_type = p_thread_type 
    and thread_id = p_thread_id;
end;
$$;

comment on function public.unmute_thread(text, uuid) is 
  'Unmute a thread immediately.';

--------------------------------------------------------------------------------
-- RPC: Create Report
--------------------------------------------------------------------------------

create or replace function public.create_report(
  p_target_type public.report_target_type,
  p_target_id uuid,
  p_reason_code text,
  p_details text default null
) 
returns uuid
language plpgsql security definer as $$
declare 
  v_user uuid; 
  v_report_id uuid;
  v_priority int;
begin
  v_user := public.require_authed();
  
  -- Prevent spam: max 10 reports per user per hour
  if (
    select count(*) 
    from public.reports 
    where reporter_user_id = v_user 
      and created_at > now() - interval '1 hour'
  ) >= 10 then
    raise exception 'rate_limited';
  end if;
  
  -- Determine priority based on reason code
  v_priority := case p_reason_code
    when 'illegal_content' then 100
    when 'csam' then 100
    when 'violence' then 90
    when 'harassment' then 80
    when 'spam' then 50
    when 'misinformation' then 40
    else 60
  end;
  
  -- Create report
  insert into public.reports(
    reporter_user_id, 
    target_type, 
    target_id, 
    reason_code, 
    details
  )
  values (v_user, p_target_type, p_target_id, p_reason_code, p_details)
  returning id into v_report_id;
  
  -- Add to moderation queue
  insert into public.moderation_queue(item_type, item_id, priority)
  values ('report', v_report_id, v_priority);
  
  return v_report_id;
end;
$$;

comment on function public.create_report(public.report_target_type, uuid, text, text) is 
  'Create a report. Auto-queues to moderation. Rate-limited to 10/hour per user.';

--------------------------------------------------------------------------------
-- RPC: Save Beacon
--------------------------------------------------------------------------------

create or replace function public.save_beacon(
  p_beacon_id uuid, 
  p_notify_before_minutes int default 30, 
  p_notify_on_expiry boolean default true
)
returns void
language plpgsql security definer as $$
declare 
  v_user uuid;
begin
  v_user := public.require_authed();
  
  -- Ensure beacon exists and is live
  if not exists(
    select 1 
    from public.beacons 
    where id = p_beacon_id 
      and status = 'live' 
      and expires_at > now()
  ) then
    raise exception 'beacon_not_live';
  end if;
  
  -- Ensure minimum 5 minutes before expiry
  insert into public.saved_beacons(
    user_id, 
    beacon_id, 
    notify_before_minutes, 
    notify_on_expiry
  )
  values (
    v_user, 
    p_beacon_id, 
    greatest(5, p_notify_before_minutes), 
    p_notify_on_expiry
  )
  on conflict (user_id, beacon_id)
  do update set 
    notify_before_minutes = excluded.notify_before_minutes,
    notify_on_expiry = excluded.notify_on_expiry,
    created_at = now();
end;
$$;

comment on function public.save_beacon(uuid, int, boolean) is 
  'Save a beacon. Triggers expiry notifications. Min 5 minutes before expiry.';

--------------------------------------------------------------------------------
-- RPC: Unsave Beacon
--------------------------------------------------------------------------------

create or replace function public.unsave_beacon(p_beacon_id uuid)
returns void
language plpgsql security definer as $$
declare 
  v_user uuid;
begin
  v_user := public.require_authed();
  
  delete from public.saved_beacons 
  where user_id = v_user 
    and beacon_id = p_beacon_id;
end;
$$;

comment on function public.unsave_beacon(uuid) is 
  'Unsave a beacon. Cancels future expiry notifications.';

--------------------------------------------------------------------------------
-- HELPER: Check if user has blocked another user
--------------------------------------------------------------------------------

create or replace function public.is_user_blocked(
  p_user_a uuid, 
  p_user_b uuid
)
returns boolean
language plpgsql stable security definer as $$
begin
  return exists(
    select 1 
    from public.user_blocks 
    where (blocker_user_id = p_user_a and blocked_user_id = p_user_b)
       or (blocker_user_id = p_user_b and blocked_user_id = p_user_a)
  );
end;
$$;

comment on function public.is_user_blocked(uuid, uuid) is 
  'Returns true if either user has blocked the other.';

--------------------------------------------------------------------------------
-- HELPER: Check if thread is muted
--------------------------------------------------------------------------------

create or replace function public.is_thread_muted(
  p_user_id uuid,
  p_thread_type text, 
  p_thread_id uuid
)
returns boolean
language plpgsql stable security definer as $$
begin
  return exists(
    select 1 
    from public.thread_mutes 
    where user_id = p_user_id
      and thread_type = p_thread_type 
      and thread_id = p_thread_id 
      and muted_until > now()
  );
end;
$$;

comment on function public.is_thread_muted(uuid, text, uuid) is 
  'Returns true if user has muted this thread and mute is still active.';
