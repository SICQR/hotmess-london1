-- 070_admin_actions.sql
-- User cooldowns + thread close/remove + preset admin actions

--------------------------------------------------------------------------------
-- TABLE: User Cooldowns
--------------------------------------------------------------------------------

create table if not exists public.user_cooldowns (
  user_id uuid primary key references auth.users(id) on delete cascade,
  ends_at timestamptz not null,
  reason text null,
  source_report_id uuid null references public.reports(id) on delete set null,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.user_cooldowns is 
  'Admin-imposed cooldowns. Users cannot perform high-risk actions while cooled down.';

alter table public.user_cooldowns enable row level security;

create policy "cooldowns_admin_only" on public.user_cooldowns
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists user_cooldowns_active_idx 
  on public.user_cooldowns(user_id, ends_at) 
  where ends_at > now();

--------------------------------------------------------------------------------
-- TABLE: Thread Status Columns (if not exists)
--------------------------------------------------------------------------------

-- Connect threads
alter table public.connect_threads
add column if not exists status text not null default 'open',
add column if not exists closed_at timestamptz null,
add column if not exists closed_reason text null;

alter table public.connect_threads
drop constraint if exists connect_threads_status_check;

alter table public.connect_threads
add constraint connect_threads_status_check check (status in ('open', 'closed'));

-- Ticket threads
alter table public.ticket_threads
add column if not exists status text not null default 'open',
add column if not exists closed_at timestamptz null,
add column if not exists closed_reason text null;

alter table public.ticket_threads
drop constraint if exists ticket_threads_status_check;

alter table public.ticket_threads
add constraint ticket_threads_status_check check (status in ('open', 'closed'));

--------------------------------------------------------------------------------
-- TABLE: Ticket Listing Soft-Remove Columns
--------------------------------------------------------------------------------

alter table public.ticket_listings
add column if not exists is_removed boolean not null default false,
add column if not exists removed_at timestamptz null,
add column if not exists removed_reason text null,
add column if not exists removed_by uuid null references auth.users(id) on delete set null;

create index if not exists ticket_listings_removed_idx 
  on public.ticket_listings(is_removed, removed_at desc) 
  where is_removed = true;

create index if not exists ticket_listings_beacon_removed_idx
  on public.ticket_listings(beacon_id, is_removed, created_at desc);

--------------------------------------------------------------------------------
-- FUNCTION: Enforce Cooldown Check
--------------------------------------------------------------------------------

create or replace function public.enforce_not_cooled_down(p_user uuid)
returns void
language plpgsql security definer as $$
begin
  if exists (
    select 1 
    from public.user_cooldowns
    where user_id = p_user 
      and ends_at > now()
  ) then
    raise exception 'cooldown_active';
  end if;
end;
$$;

comment on function public.enforce_not_cooled_down(uuid) is 
  'Raises exception if user is currently cooled down. Call in high-risk RPCs.';

--------------------------------------------------------------------------------
-- FUNCTION: Close Thread From Report
--------------------------------------------------------------------------------

create or replace function public.admin_close_thread_from_report(
  p_report_id uuid,
  p_note text default null
) 
returns void
language plpgsql security definer as $$
declare 
  r record;
begin
  if not public.is_admin() then 
    raise exception 'not_authorized'; 
  end if;

  select * into r from public.reports where id = p_report_id;
  
  if r is null then 
    raise exception 'report_not_found'; 
  end if;

  if r.target_type = 'connect_thread' then
    update public.connect_threads
    set 
      status = 'closed', 
      closed_at = now(), 
      closed_reason = p_note
    where id = r.target_id;

  elsif r.target_type = 'ticket_thread' then
    update public.ticket_threads
    set 
      status = 'closed', 
      closed_at = now(), 
      closed_reason = p_note
    where id = r.target_id;

  else
    raise exception 'invalid_target_type_for_close';
  end if;

  insert into public.admin_audit_log(
    actor_user_id, 
    action, 
    target_type, 
    target_id, 
    metadata
  )
  values (
    auth.uid(),
    'close_thread',
    r.target_type::text,
    r.target_id,
    jsonb_build_object('report_id', p_report_id, 'note', p_note)
  );
end;
$$;

comment on function public.admin_close_thread_from_report(uuid, text) is 
  'Admin only: Close thread referenced by report. Logs to audit.';

--------------------------------------------------------------------------------
-- FUNCTION: Remove Ticket Listing From Report
--------------------------------------------------------------------------------

create or replace function public.admin_remove_ticket_listing_from_report(
  p_report_id uuid,
  p_note text default null
) 
returns void
language plpgsql security definer as $$
declare 
  r record;
begin
  if not public.is_admin() then 
    raise exception 'not_authorized'; 
  end if;

  select * into r from public.reports where id = p_report_id;
  
  if r is null then 
    raise exception 'report_not_found'; 
  end if;

  if r.target_type <> 'ticket_listing' then
    raise exception 'invalid_target_type_for_listing_remove';
  end if;

  update public.ticket_listings
  set 
    is_removed = true, 
    removed_at = now(), 
    removed_reason = p_note,
    removed_by = auth.uid()
  where id = r.target_id;

  insert into public.admin_audit_log(
    actor_user_id, 
    action, 
    target_type, 
    target_id, 
    metadata
  )
  values (
    auth.uid(),
    'remove_ticket_listing',
    'ticket_listing',
    r.target_id,
    jsonb_build_object('report_id', p_report_id, 'note', p_note)
  );
end;
$$;

comment on function public.admin_remove_ticket_listing_from_report(uuid, text) is 
  'Admin only: Soft-remove ticket listing referenced by report.';

--------------------------------------------------------------------------------
-- FUNCTION: Cooldown 24h From Report (Smart Offender Resolution)
--------------------------------------------------------------------------------

create or replace function public.admin_cooldown_24h_from_report(
  p_report_id uuid,
  p_note text default null
) 
returns int
language plpgsql security definer as $$
declare
  r record;
  affected int := 0;
  offender uuid;
begin
  if not public.is_admin() then 
    raise exception 'not_authorized'; 
  end if;

  select * into r from public.reports where id = p_report_id;
  
  if r is null then 
    raise exception 'report_not_found'; 
  end if;

  -- MESSAGE: try connect first, then tickets
  if r.target_type = 'message' then
    select sender_user_id into offender 
    from public.connect_messages 
    where id = r.target_id;
    
    if offender is null then
      select sender_user_id into offender 
      from public.ticket_messages 
      where id = r.target_id;
    end if;

    if offender is null then 
      raise exception 'message_not_found'; 
    end if;

    insert into public.user_cooldowns(
      user_id, 
      ends_at, 
      reason, 
      source_report_id, 
      created_by
    )
    values (
      offender, 
      now() + interval '24 hours', 
      p_note, 
      p_report_id, 
      auth.uid()
    )
    on conflict (user_id) do update
    set 
      ends_at = excluded.ends_at, 
      reason = excluded.reason, 
      source_report_id = excluded.source_report_id, 
      created_by = excluded.created_by;

    affected := 1;

  -- LISTING: cooldown seller
  elsif r.target_type = 'ticket_listing' then
    select seller_user_id into offender 
    from public.ticket_listings 
    where id = r.target_id;
    
    if offender is null then 
      raise exception 'listing_not_found'; 
    end if;

    insert into public.user_cooldowns(
      user_id, 
      ends_at, 
      reason, 
      source_report_id, 
      created_by
    )
    values (
      offender, 
      now() + interval '24 hours', 
      p_note, 
      p_report_id, 
      auth.uid()
    )
    on conflict (user_id) do update
    set 
      ends_at = excluded.ends_at, 
      reason = excluded.reason, 
      source_report_id = excluded.source_report_id, 
      created_by = excluded.created_by;

    affected := 1;

  -- CONNECT THREAD: cooldown other participants (not the reporter)
  elsif r.target_type = 'connect_thread' then
    insert into public.user_cooldowns(
      user_id, 
      ends_at, 
      reason, 
      source_report_id, 
      created_by
    )
    select 
      m.user_id, 
      now() + interval '24 hours', 
      p_note, 
      p_report_id, 
      auth.uid()
    from public.connect_thread_members m
    where m.thread_id = r.target_id 
      and m.user_id <> r.reporter_user_id
    on conflict (user_id) do update
    set 
      ends_at = excluded.ends_at, 
      reason = excluded.reason, 
      source_report_id = excluded.source_report_id, 
      created_by = excluded.created_by;

    get diagnostics affected = row_count;

  -- TICKET THREAD: cooldown other participants (not the reporter)
  elsif r.target_type = 'ticket_thread' then
    insert into public.user_cooldowns(
      user_id, 
      ends_at, 
      reason, 
      source_report_id, 
      created_by
    )
    select 
      m.user_id, 
      now() + interval '24 hours', 
      p_note, 
      p_report_id, 
      auth.uid()
    from public.ticket_thread_members m
    where m.thread_id = r.target_id 
      and m.user_id <> r.reporter_user_id
    on conflict (user_id) do update
    set 
      ends_at = excluded.ends_at, 
      reason = excluded.reason, 
      source_report_id = excluded.source_report_id, 
      created_by = excluded.created_by;

    get diagnostics affected = row_count;

  -- BEACON: cooldown creator (if beacons.created_by exists)
  elsif r.target_type = 'beacon' then
    select created_by into offender 
    from public.beacons 
    where id = r.target_id;
    
    if offender is null then 
      raise exception 'beacon_not_found'; 
    end if;

    insert into public.user_cooldowns(
      user_id, 
      ends_at, 
      reason, 
      source_report_id, 
      created_by
    )
    values (
      offender, 
      now() + interval '24 hours', 
      p_note, 
      p_report_id, 
      auth.uid()
    )
    on conflict (user_id) do update
    set 
      ends_at = excluded.ends_at, 
      reason = excluded.reason, 
      source_report_id = excluded.source_report_id, 
      created_by = excluded.created_by;

    affected := 1;

  else
    raise exception 'unsupported_target_type';
  end if;

  insert into public.admin_audit_log(
    actor_user_id, 
    action, 
    target_type, 
    target_id, 
    metadata
  )
  values (
    auth.uid(),
    'cooldown_24h',
    r.target_type::text,
    r.target_id,
    jsonb_build_object('report_id', p_report_id, 'note', p_note, 'affected', affected)
  );

  return affected;
end;
$$;

comment on function public.admin_cooldown_24h_from_report(uuid, text) is 
  'Admin only: Apply 24h cooldown to offender(s) based on report target type.';
