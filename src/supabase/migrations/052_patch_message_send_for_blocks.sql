-- 052_patch_message_send_for_blocks.sql
-- Patch Connect and Tickets message send RPCs to respect blocks + mutes

--------------------------------------------------------------------------------
-- PATCH: connect_send_message
--------------------------------------------------------------------------------

create or replace function public.connect_send_message(
  p_thread_id uuid,
  p_body text
)
returns uuid
language plpgsql security definer as $$
declare
  v_user uuid;
  v_thread_status text;
  v_other_user uuid;
  v_message_id uuid;
begin
  v_user := public.require_authed();
  
  -- Check thread exists and is open
  select status into v_thread_status
  from public.connect_threads
  where id = p_thread_id;
  
  if not found then
    raise exception 'thread_not_found';
  end if;
  
  if v_thread_status != 'open' then
    raise exception 'thread_closed';
  end if;
  
  -- Check user is a member
  if not exists(
    select 1 
    from public.connect_thread_members 
    where thread_id = p_thread_id 
      and user_id = v_user
  ) then
    raise exception 'not_thread_member';
  end if;
  
  -- Get other user
  select user_id into v_other_user
  from public.connect_thread_members
  where thread_id = p_thread_id
    and user_id != v_user
  limit 1;
  
  -- NEW: Check if thread is muted by sender
  if exists(
    select 1 
    from public.thread_mutes 
    where user_id = v_user 
      and thread_type = 'connect' 
      and thread_id = p_thread_id 
      and muted_until > now()
  ) then
    raise exception 'thread_muted';
  end if;
  
  -- NEW: Check if either user has blocked the other
  if exists(
    select 1 
    from public.user_blocks 
    where (blocker_user_id = v_user and blocked_user_id = v_other_user)
       or (blocker_user_id = v_other_user and blocked_user_id = v_user)
  ) then
    raise exception 'blocked';
  end if;
  
  -- Validate body
  if trim(p_body) = '' or length(p_body) > 5000 then
    raise exception 'invalid_body';
  end if;
  
  -- Rate limit: max 30 messages per thread per hour
  if (
    select count(*) 
    from public.connect_messages 
    where thread_id = p_thread_id 
      and sender_user_id = v_user 
      and created_at > now() - interval '1 hour'
  ) >= 30 then
    raise exception 'rate_limited';
  end if;
  
  -- Insert message
  insert into public.connect_messages(thread_id, sender_user_id, body)
  values (p_thread_id, v_user, trim(p_body))
  returning id into v_message_id;
  
  -- Update thread timestamp
  update public.connect_threads
  set updated_at = now()
  where id = p_thread_id;
  
  return v_message_id;
end;
$$;

comment on function public.connect_send_message(uuid, text) is 
  'Send a Connect message. Checks blocks, mutes, membership, rate limits.';

--------------------------------------------------------------------------------
-- PATCH: ticket_send_message
--------------------------------------------------------------------------------

create or replace function public.ticket_send_message(
  p_thread_id uuid,
  p_body text
)
returns uuid
language plpgsql security definer as $$
declare
  v_user uuid;
  v_thread_status text;
  v_other_user uuid;
  v_message_id uuid;
begin
  v_user := public.require_authed();
  
  -- Check thread exists and is open
  select status into v_thread_status
  from public.ticket_threads
  where id = p_thread_id;
  
  if not found then
    raise exception 'thread_not_found';
  end if;
  
  if v_thread_status != 'open' then
    raise exception 'thread_closed';
  end if;
  
  -- Check user is a member
  if not exists(
    select 1 
    from public.ticket_thread_members 
    where thread_id = p_thread_id 
      and user_id = v_user
  ) then
    raise exception 'not_thread_member';
  end if;
  
  -- Get other user
  select user_id into v_other_user
  from public.ticket_thread_members
  where thread_id = p_thread_id
    and user_id != v_user
  limit 1;
  
  -- NEW: Check if thread is muted by sender
  if exists(
    select 1 
    from public.thread_mutes 
    where user_id = v_user 
      and thread_type = 'tickets' 
      and thread_id = p_thread_id 
      and muted_until > now()
  ) then
    raise exception 'thread_muted';
  end if;
  
  -- NEW: Check if either user has blocked the other
  if exists(
    select 1 
    from public.user_blocks 
    where (blocker_user_id = v_user and blocked_user_id = v_other_user)
       or (blocker_user_id = v_other_user and blocked_user_id = v_user)
  ) then
    raise exception 'blocked';
  end if;
  
  -- Validate body
  if trim(p_body) = '' or length(p_body) > 5000 then
    raise exception 'invalid_body';
  end if;
  
  -- Rate limit: max 30 messages per thread per hour
  if (
    select count(*) 
    from public.ticket_messages 
    where thread_id = p_thread_id 
      and sender_user_id = v_user 
      and created_at > now() - interval '1 hour'
  ) >= 30 then
    raise exception 'rate_limited';
  end if;
  
  -- Insert message
  insert into public.ticket_messages(thread_id, sender_user_id, body)
  values (p_thread_id, v_user, trim(p_body))
  returning id into v_message_id;
  
  -- Update thread timestamp
  update public.ticket_threads
  set updated_at = now()
  where id = p_thread_id;
  
  return v_message_id;
end;
$$;

comment on function public.ticket_send_message(uuid, text) is 
  'Send a Ticket message. Checks blocks, mutes, membership, rate limits.';
