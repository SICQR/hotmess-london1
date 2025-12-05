-- supabase/migrations/108_thread_attachments_proof.sql
-- Thread Attachments + Proof Upload System
-- Adds support for file uploads in both Connect and Ticket threads

-- 1) Add message kind enum (text, system, proof)
do $$ begin
  create type public.thread_message_kind as enum ('text', 'system', 'proof');
exception when duplicate_object then null;
end $$;

-- 2) Add kind column to both message tables
alter table public.connect_messages
  add column if not exists kind public.thread_message_kind not null default 'text';

alter table public.ticket_messages
  add column if not exists kind public.thread_message_kind not null default 'text';

-- 3) Create unified thread_attachments table
-- Works with both connect_messages and ticket_messages
create table if not exists public.thread_attachments (
  id uuid primary key default gen_random_uuid(),
  
  -- Thread context (determines if connect or ticket)
  thread_type text not null check (thread_type in ('connect', 'ticket')),
  thread_id uuid not null,
  
  -- Message link (nullable because upload might happen before message created)
  message_id uuid null,
  
  -- Uploader
  uploader_id uuid not null references auth.users(id) on delete restrict,
  
  -- Storage details
  storage_bucket text not null default 'thread-attachments',
  storage_path text not null,
  filename text not null,
  mime_type text not null,
  bytes int not null check (bytes > 0 and bytes <= 12582912), -- 12MB max
  
  -- Proof marker (for filtering)
  is_proof boolean not null default false,
  
  -- Metadata
  created_at timestamptz not null default now(),
  
  -- Constraints
  constraint valid_thread_type check (thread_type in ('connect', 'ticket')),
  constraint valid_mime_type check (
    mime_type in ('image/jpeg', 'image/png', 'application/pdf')
  )
);

-- 4) Indexes for performance
create index if not exists thread_attachments_thread_idx 
  on public.thread_attachments(thread_type, thread_id);

create index if not exists thread_attachments_message_idx 
  on public.thread_attachments(message_id) where message_id is not null;

create index if not exists thread_attachments_uploader_idx 
  on public.thread_attachments(uploader_id);

create index if not exists thread_attachments_proof_idx 
  on public.thread_attachments(thread_type, thread_id, is_proof) where is_proof = true;

-- 5) Enable RLS
alter table public.thread_attachments enable row level security;

-- 6) RLS Policies for Connect threads
-- Read: Members of connect thread can see attachments
create policy "connect_attachments_read_members" on public.thread_attachments
  for select using (
    thread_type = 'connect'
    and exists(
      select 1 from public.connect_thread_members tm
      where tm.thread_id = thread_attachments.thread_id
        and tm.user_id = auth.uid()
    )
  );

-- Insert: Connect thread members can upload
create policy "connect_attachments_insert_member" on public.thread_attachments
  for insert with check (
    thread_type = 'connect'
    and uploader_id = auth.uid()
    and exists(
      select 1 from public.connect_thread_members tm
      where tm.thread_id = thread_attachments.thread_id
        and tm.user_id = auth.uid()
    )
  );

-- 7) RLS Policies for Ticket threads
-- Read: Members of ticket thread can see attachments
create policy "ticket_attachments_read_members" on public.thread_attachments
  for select using (
    thread_type = 'ticket'
    and exists(
      select 1 from public.ticket_thread_members tm
      where tm.thread_id = thread_attachments.thread_id
        and tm.user_id = auth.uid()
    )
  );

-- Insert: Ticket thread members can upload
create policy "ticket_attachments_insert_member" on public.thread_attachments
  for insert with check (
    thread_type = 'ticket'
    and uploader_id = auth.uid()
    and exists(
      select 1 from public.ticket_thread_members tm
      where tm.thread_id = thread_attachments.thread_id
        and tm.user_id = auth.uid()
    )
  );

-- 8) Owner update/delete (both types)
create policy "thread_attachments_owner_update" on public.thread_attachments
  for update using (uploader_id = auth.uid())
  with check (uploader_id = auth.uid());

create policy "thread_attachments_owner_delete" on public.thread_attachments
  for delete using (uploader_id = auth.uid());

-- 9) Indexes on message tables for kind filtering
create index if not exists connect_messages_kind_idx 
  on public.connect_messages(kind) where kind != 'text';

create index if not exists ticket_messages_kind_idx 
  on public.ticket_messages(kind) where kind != 'text';

-- 10) Comment for documentation
comment on table public.thread_attachments is 
  'File attachments for both Connect and Ticket threads. Stores metadata; actual files in Supabase Storage.';

comment on column public.thread_attachments.is_proof is 
  'True if this attachment was uploaded as proof (ticket threads). Used for filtering and moderation.';

comment on column public.thread_attachments.thread_type is 
  'Discriminator: connect or ticket. Determines which thread_members table to check for RLS.';
