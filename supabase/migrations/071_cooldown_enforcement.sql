-- 071_cooldown_enforcement.sql
-- Patch RPCs to enforce cooldowns

--------------------------------------------------------------------------------
-- Helper: Check if user has active cooldown
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
  'Raises exception if user has active cooldown. Call at top of high-risk RPCs.';

--------------------------------------------------------------------------------
-- Patch: connect_send_message (add cooldown check)
--------------------------------------------------------------------------------

-- We need to re-create the function with cooldown check
-- This assumes your existing function signature
-- Adjust if your actual signature differs

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
  
  -- NEW: Check cooldown
  perform public.enforce_not_cooled_down(v_user);
  
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
  
  -- Check if thread is muted by sender
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
  
  -- Check if either user has blocked the other
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

--------------------------------------------------------------------------------
-- Patch: ticket_send_message (add cooldown check)
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
  
  -- NEW: Check cooldown
  perform public.enforce_not_cooled_down(v_user);
  
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
  
  -- Check if thread is muted by sender
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
  
  -- Check if either user has blocked the other
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

--------------------------------------------------------------------------------
-- Add cooldown check to other high-risk RPCs (if they exist)
--------------------------------------------------------------------------------

-- If you have connect_opt_in, connect_create_intent, ticket_create_listing:
-- Add `perform public.enforce_not_cooled_down(v_user);` after require_authed()

-- Example for connect_opt_in (adjust to your actual function):
/*
create or replace function public.connect_opt_in(p_intent_id uuid)
returns uuid
language plpgsql security definer as $$
declare
  v_user uuid;
  -- ... rest of your variables
begin
  v_user := public.require_authed();
  
  -- NEW: Check cooldown
  perform public.enforce_not_cooled_down(v_user);
  
  -- ... rest of your function logic
end;
$$;
*/
