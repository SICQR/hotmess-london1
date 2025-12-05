-- 050_trust_safety.sql
-- Trust & Safety Layer: Reporting, Blocking, Muting, Moderation Queue, Audit Log, Saved Beacons

--------------------------------------------------------------------------------
-- ENUMS
--------------------------------------------------------------------------------

do $$ begin
  create type public.report_target_type as enum (
    'beacon',
    'ticket_listing',
    'connect_thread',
    'ticket_thread',
    'message'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status as enum (
    'open',
    'triaged',
    'actioned',
    'dismissed'
  );
exception when duplicate_object then null; end $$;

--------------------------------------------------------------------------------
-- TABLES: User Blocks
--------------------------------------------------------------------------------

create table if not exists public.user_blocks (
  blocker_user_id uuid not null references auth.users(id) on delete cascade,
  blocked_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_user_id, blocked_user_id),
  
  -- Prevent self-blocking
  constraint no_self_block check (blocker_user_id != blocked_user_id)
);

comment on table public.user_blocks is 
  'User blocking. Blocker hides blocked user from Connect, Tickets, and all threads.';

--------------------------------------------------------------------------------
-- TABLES: Thread Mutes
--------------------------------------------------------------------------------

create table if not exists public.thread_mutes (
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_type text not null check (thread_type in ('connect', 'tickets')),
  thread_id uuid not null,
  muted_until timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (user_id, thread_type, thread_id)
);

comment on table public.thread_mutes is 
  'Temporary thread mutes. User stops receiving notifications until muted_until expires.';

create index if not exists thread_mutes_expiry_idx 
  on public.thread_mutes(user_id, muted_until) 
  where muted_until > now();

--------------------------------------------------------------------------------
-- TABLES: Reports
--------------------------------------------------------------------------------

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references auth.users(id) on delete cascade,
  target_type public.report_target_type not null,
  target_id uuid not null,
  reason_code text not null,
  details text null,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  triaged_by uuid null references auth.users(id) on delete set null,
  triaged_at timestamptz null,
  resolution_note text null
);

comment on table public.reports is 
  'User reports for beacons, listings, threads, or messages. Fed into moderation queue.';

create index if not exists reports_status_idx 
  on public.reports(status, created_at desc);

create index if not exists reports_target_idx 
  on public.reports(target_type, target_id);

create index if not exists reports_reporter_idx 
  on public.reports(reporter_user_id, created_at desc);

--------------------------------------------------------------------------------
-- TABLES: Moderation Queue
--------------------------------------------------------------------------------

create table if not exists public.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  item_type text not null, -- 'report'|'ticket_listing'|'message'|'beacon'
  item_id uuid not null,
  priority int not null default 50,
  status text not null default 'open', -- 'open'|'in_review'|'actioned'|'dismissed'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  assigned_to uuid null references auth.users(id) on delete set null,
  notes text null
);

comment on table public.moderation_queue is 
  'Admin moderation queue. Reports and flagged content land here.';

create index if not exists moderation_queue_status_idx 
  on public.moderation_queue(status, priority desc, created_at desc);

create index if not exists moderation_queue_item_idx 
  on public.moderation_queue(item_type, item_id);

--------------------------------------------------------------------------------
-- TABLES: Admin Audit Log
--------------------------------------------------------------------------------

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid null references auth.users(id) on delete set null,
  action text not null, -- 'remove_listing'|'close_thread'|'ban_user'|'dismiss_report' etc.
  target_type text not null,
  target_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.admin_audit_log is 
  'Immutable audit log for admin actions. Keeps receipts for policy enforcement.';

create index if not exists admin_audit_log_created_idx 
  on public.admin_audit_log(created_at desc);

create index if not exists admin_audit_log_actor_idx 
  on public.admin_audit_log(actor_user_id, created_at desc);

create index if not exists admin_audit_log_target_idx 
  on public.admin_audit_log(target_type, target_id);

--------------------------------------------------------------------------------
-- TABLES: Saved Beacons
--------------------------------------------------------------------------------

create table if not exists public.saved_beacons (
  user_id uuid not null references auth.users(id) on delete cascade,
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  notify_before_minutes int not null default 30,
  notify_on_expiry boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, beacon_id)
);

comment on table public.saved_beacons is 
  'User saved beacons. Triggers expiry notifications via notification outbox.';

create index if not exists saved_beacons_beacon_idx 
  on public.saved_beacons(beacon_id);

create index if not exists saved_beacons_user_idx 
  on public.saved_beacons(user_id, created_at desc);

--------------------------------------------------------------------------------
-- RLS POLICIES
--------------------------------------------------------------------------------

alter table public.user_blocks enable row level security;
alter table public.thread_mutes enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_queue enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.saved_beacons enable row level security;

-- User Blocks: user can manage their own
create policy "blocks_own_all" on public.user_blocks
  for all to authenticated
  using (blocker_user_id = auth.uid())
  with check (blocker_user_id = auth.uid());

-- Thread Mutes: user can manage their own
create policy "mutes_own_all" on public.thread_mutes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Reports: user can create + view their own
create policy "reports_select_own" on public.reports
  for select to authenticated
  using (reporter_user_id = auth.uid());

create policy "reports_insert_own" on public.reports
  for insert to authenticated
  with check (reporter_user_id = auth.uid());

-- Reports: admins can view all + update
create policy "reports_admin_select" on public.reports
  for select to authenticated
  using (public.is_admin());

create policy "reports_admin_update" on public.reports
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Moderation Queue: admin only
create policy "modqueue_admin_only" on public.moderation_queue
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Audit Log: admin only (read-only for non-system)
create policy "audit_admin_select" on public.admin_audit_log
  for select to authenticated
  using (public.is_admin());

create policy "audit_admin_insert" on public.admin_audit_log
  for insert to authenticated
  with check (public.is_admin());

-- Saved Beacons: user owns
create policy "saved_beacons_own_all" on public.saved_beacons
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

--------------------------------------------------------------------------------
-- HELPER: Check if user is admin
-- (Create if not exists from beacon system)
--------------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language plpgsql stable security definer as $$
begin
  -- Check if user has admin role in app_metadata
  return coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
end;
$$;

comment on function public.is_admin() is 
  'Returns true if current user has admin role in app_metadata.';
