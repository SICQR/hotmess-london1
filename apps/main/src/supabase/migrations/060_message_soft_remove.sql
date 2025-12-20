-- 060_message_soft_remove.sql
-- Add soft-removal columns to message tables for moderation

--------------------------------------------------------------------------------
-- Add removal columns to Connect messages
--------------------------------------------------------------------------------

alter table public.connect_messages
add column if not exists is_removed boolean not null default false,
add column if not exists removed_at timestamptz null,
add column if not exists removed_reason text null,
add column if not exists removed_by uuid null references auth.users(id) on delete set null;

comment on column public.connect_messages.is_removed is 
  'True if message has been removed by moderation. RLS should hide these from non-admins.';

comment on column public.connect_messages.removed_at is 
  'Timestamp when message was removed.';

comment on column public.connect_messages.removed_reason is 
  'Reason for removal (from report or admin action).';

comment on column public.connect_messages.removed_by is 
  'Admin user ID who removed the message.';

create index if not exists connect_messages_removed_idx 
  on public.connect_messages(is_removed, removed_at desc) 
  where is_removed = true;

--------------------------------------------------------------------------------
-- Add removal columns to Ticket messages
--------------------------------------------------------------------------------

alter table public.ticket_messages
add column if not exists is_removed boolean not null default false,
add column if not exists removed_at timestamptz null,
add column if not exists removed_reason text null,
add column if not exists removed_by uuid null references auth.users(id) on delete set null;

comment on column public.ticket_messages.is_removed is 
  'True if message has been removed by moderation. RLS should hide these from non-admins.';

comment on column public.ticket_messages.removed_at is 
  'Timestamp when message was removed.';

comment on column public.ticket_messages.removed_reason is 
  'Reason for removal (from report or admin action).';

comment on column public.ticket_messages.removed_by is 
  'Admin user ID who removed the message.';

create index if not exists ticket_messages_removed_idx 
  on public.ticket_messages(is_removed, removed_at desc) 
  where is_removed = true;

--------------------------------------------------------------------------------
-- Update RLS policies to hide removed messages from non-admins
--------------------------------------------------------------------------------

-- Drop existing select policies if they exist
drop policy if exists "messages_select_members" on public.connect_messages;
drop policy if exists "ticket_messages_select_members" on public.ticket_messages;

-- Connect messages: members can see non-removed messages, admins see all
create policy "messages_select_members" on public.connect_messages
  for select to authenticated
  using (
    -- Admin sees everything
    public.is_admin()
    or
    -- Members see non-removed messages
    (
      exists(
        select 1 
        from public.connect_thread_members 
        where thread_id = connect_messages.thread_id 
          and user_id = auth.uid()
      )
      and not is_removed
    )
  );

-- Ticket messages: members can see non-removed messages, admins see all
create policy "ticket_messages_select_members" on public.ticket_messages
  for select to authenticated
  using (
    -- Admin sees everything
    public.is_admin()
    or
    -- Members see non-removed messages
    (
      exists(
        select 1 
        from public.ticket_thread_members 
        where thread_id = ticket_messages.thread_id 
          and user_id = auth.uid()
      )
      and not is_removed
    )
  );
