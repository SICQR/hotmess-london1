-- QR Login System Migration for HOTMESS LONDON
-- This adds secure QR code authentication via phone → desktop approval

-- QR Login Tokens Table
-- Stores pending QR login requests that expire in 90 seconds
create table if not exists qr_login_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  status text not null default 'pending', -- pending | approved | used | expired | cancelled
  requested_ip_hash text,
  user_agent text,
  approved_user_id uuid references auth.users(id) on delete set null,
  exchange_code_hash text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  
  -- Constraints
  constraint valid_status check (status in ('pending', 'approved', 'used', 'expired', 'cancelled'))
);

-- Indexes for fast lookups
create index if not exists idx_qr_tokens_hash on qr_login_tokens(token_hash);
create index if not exists idx_qr_tokens_status_expires on qr_login_tokens(status, expires_at);
create index if not exists idx_qr_tokens_approved_user on qr_login_tokens(approved_user_id);

-- Audit Events Table
-- Track security events for compliance and debugging
create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  meta jsonb default '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Index for audit queries
create index if not exists idx_audit_actor_created on audit_events(actor_user_id, created_at desc);
create index if not exists idx_audit_action_created on audit_events(action, created_at desc);

-- Row Level Security (RLS)
alter table qr_login_tokens enable row level security;
alter table audit_events enable row level security;

-- QR tokens: service role only (no public access)
create policy "Service role full access to qr_login_tokens"
  on qr_login_tokens
  for all
  using (auth.role() = 'service_role');

-- Audit events: users can read their own events
create policy "Users can read own audit events"
  on audit_events
  for select
  using (actor_user_id = auth.uid());

-- Service role has full access to audit
create policy "Service role full access to audit_events"
  on audit_events
  for all
  using (auth.role() = 'service_role');

-- Cleanup function for expired tokens (run daily via pg_cron or scheduled task)
create or replace function cleanup_expired_qr_tokens()
returns void
language plpgsql
security definer
as $$
begin
  -- Mark expired tokens
  update qr_login_tokens
  set status = 'expired'
  where status = 'pending'
    and expires_at < now();
  
  -- Delete tokens older than 24 hours
  delete from qr_login_tokens
  where created_at < now() - interval '24 hours';
end;
$$;

-- Grant execute to service role
grant execute on function cleanup_expired_qr_tokens() to service_role;

-- Comment for documentation
comment on table qr_login_tokens is 'Stores one-time QR login tokens for desktop ↔ phone authentication flow';
comment on table audit_events is 'Security and compliance audit log for all auth events';
