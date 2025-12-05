-- 061_admin_moderation_rpcs.sql
-- Admin RPCs for moderation actions

--------------------------------------------------------------------------------
-- RPC: Remove Message (Admin only)
--------------------------------------------------------------------------------

create or replace function public.admin_remove_message(
  p_mode text, 
  p_message_id uuid, 
  p_reason text default null
)
returns void
language plpgsql security definer as $$
declare
  v_admin uuid;
begin
  -- Check admin access
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  v_admin := auth.uid();

  -- Remove message based on mode
  if p_mode = 'connect' then
    update public.connect_messages
    set 
      is_removed = true, 
      removed_at = now(), 
      removed_reason = p_reason,
      removed_by = v_admin,
      body = '[removed]'
    where id = p_message_id;

    if not found then
      raise exception 'message_not_found';
    end if;

  elsif p_mode = 'tickets' then
    update public.ticket_messages
    set 
      is_removed = true, 
      removed_at = now(), 
      removed_reason = p_reason,
      removed_by = v_admin,
      body = '[removed]'
    where id = p_message_id;

    if not found then
      raise exception 'message_not_found';
    end if;

  else
    raise exception 'invalid_mode';
  end if;

  -- Log to audit
  insert into public.admin_audit_log(
    actor_user_id, 
    action, 
    target_type, 
    target_id, 
    metadata
  )
  values (
    v_admin, 
    'remove_message', 
    'message', 
    p_message_id, 
    jsonb_build_object(
      'mode', p_mode, 
      'reason', p_reason
    )
  );
end;
$$;

comment on function public.admin_remove_message(text, uuid, text) is 
  'Admin only: Soft-remove a message and log to audit trail.';

--------------------------------------------------------------------------------
-- RPC: Set Report Status (Admin only)
--------------------------------------------------------------------------------

create or replace function public.admin_set_report_status(
  p_report_id uuid, 
  p_status public.report_status, 
  p_note text default null
)
returns void
language plpgsql security definer as $$
declare
  v_admin uuid;
begin
  -- Check admin access
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  v_admin := auth.uid();

  -- Update report
  update public.reports
  set 
    status = p_status, 
    updated_at = now(), 
    triaged_by = v_admin,
    triaged_at = now(),
    resolution_note = p_note
  where id = p_report_id;

  if not found then
    raise exception 'report_not_found';
  end if;

  -- Update moderation queue status
  update public.moderation_queue
  set 
    status = case 
      when p_status in ('actioned', 'dismissed') then 'actioned'
      when p_status = 'triaged' then 'in_review'
      else status
    end,
    updated_at = now(),
    assigned_to = v_admin
  where item_type = 'report' 
    and item_id = p_report_id;

  -- Log to audit
  insert into public.admin_audit_log(
    actor_user_id, 
    action, 
    target_type, 
    target_id, 
    metadata
  )
  values (
    v_admin, 
    'set_report_status', 
    'report', 
    p_report_id, 
    jsonb_build_object(
      'status', p_status, 
      'note', p_note
    )
  );
end;
$$;

comment on function public.admin_set_report_status(uuid, public.report_status, text) is 
  'Admin only: Update report status and sync moderation queue.';

--------------------------------------------------------------------------------
-- RPC: Close Thread (Admin only)
--------------------------------------------------------------------------------

create or replace function public.admin_close_thread(
  p_mode text, 
  p_thread_id uuid, 
  p_reason text default null
)
returns void
language plpgsql security definer as $$
declare
  v_admin uuid;
begin
  -- Check admin access
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  v_admin := auth.uid();

  -- Close thread based on mode
  if p_mode = 'connect' then
    update public.connect_threads
    set status = 'closed'
    where id = p_thread_id;

    if not found then
      raise exception 'thread_not_found';
    end if;

  elsif p_mode = 'tickets' then
    update public.ticket_threads
    set status = 'closed'
    where id = p_thread_id;

    if not found then
      raise exception 'thread_not_found';
    end if;

  else
    raise exception 'invalid_mode';
  end if;

  -- Log to audit
  insert into public.admin_audit_log(
    actor_user_id, 
    action, 
    target_type, 
    target_id, 
    metadata
  )
  values (
    v_admin, 
    'close_thread', 
    'thread', 
    p_thread_id, 
    jsonb_build_object(
      'mode', p_mode, 
      'reason', p_reason
    )
  );
end;
$$;

comment on function public.admin_close_thread(text, uuid, text) is 
  'Admin only: Close a thread and log to audit trail.';

--------------------------------------------------------------------------------
-- RPC: Remove Beacon (Admin only)
--------------------------------------------------------------------------------

create or replace function public.admin_remove_beacon(
  p_beacon_id uuid, 
  p_reason text default null
)
returns void
language plpgsql security definer as $$
declare
  v_admin uuid;
begin
  -- Check admin access
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  v_admin := auth.uid();

  -- Set beacon to expired (soft-remove)
  update public.beacons
  set 
    status = 'expired',
    updated_at = now()
  where id = p_beacon_id;

  if not found then
    raise exception 'beacon_not_found';
  end if;

  -- Log to audit
  insert into public.admin_audit_log(
    actor_user_id, 
    action, 
    target_type, 
    target_id, 
    metadata
  )
  values (
    v_admin, 
    'remove_beacon', 
    'beacon', 
    p_beacon_id, 
    jsonb_build_object(
      'reason', p_reason
    )
  );
end;
$$;

comment on function public.admin_remove_beacon(uuid, text) is 
  'Admin only: Soft-remove a beacon by setting it to expired.';

--------------------------------------------------------------------------------
-- RPC: Remove Ticket Listing (Admin only)
--------------------------------------------------------------------------------

create or replace function public.admin_remove_ticket_listing(
  p_listing_id uuid, 
  p_reason text default null
)
returns void
language plpgsql security definer as $$
declare
  v_admin uuid;
begin
  -- Check admin access
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  v_admin := auth.uid();

  -- Set listing to sold (soft-remove)
  update public.ticket_listings
  set 
    status = 'sold',
    updated_at = now()
  where id = p_listing_id;

  if not found then
    raise exception 'listing_not_found';
  end if;

  -- Log to audit
  insert into public.admin_audit_log(
    actor_user_id, 
    action, 
    target_type, 
    target_id, 
    metadata
  )
  values (
    v_admin, 
    'remove_ticket_listing', 
    'ticket_listing', 
    p_listing_id, 
    jsonb_build_object(
      'reason', p_reason
    )
  );
end;
$$;

comment on function public.admin_remove_ticket_listing(uuid, text) is 
  'Admin only: Soft-remove a ticket listing by setting it to sold.';
