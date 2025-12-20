-- ============================================================================
-- HOTMESS BEACON SYSTEM - Complete Production Schema
-- ============================================================================
-- Single source of truth for beacons, scans, XP, notifications, and security.
-- This migration creates: tables + RLS + security-definer RPCs + helpers.
-- ============================================================================

-- Extensions
-- ============================================================================
create extension if not exists pgcrypto;

-- Enums
-- ============================================================================
do $$ begin
  create type beacon_status as enum ('draft','scheduled','live','paused','expired','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type beacon_type as enum ('checkin','connect','ticket','drop','content','radio','care','pulse');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gps_mode as enum ('off','soft','hard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notif_channel as enum ('in_app','push','email');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notif_category as enum ('nearby','drops','radio','content','tickets','care','saved_expiry','connect');
exception when duplicate_object then null; end $$;

do $$ begin
  create type xp_reason as enum ('scan','action','streak','bonus');
exception when duplicate_object then null; end $$;

-- Profiles & Roles
-- ============================================================================
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user', -- 'user' | 'creator' | 'admin'
  age18_confirmed boolean not null default false,
  consent_confirmed boolean not null default false,
  premium_tier text not null default 'free', -- 'free' | 'core' | 'plus' | 'vip'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_creator() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role in ('creator','admin')
  );
$$;

-- Beacons Table
-- ============================================================================
create table if not exists public.beacons (
  id uuid primary key default gen_random_uuid(),
  status beacon_status not null default 'draft',
  type beacon_type not null,
  title text not null,
  description text null,

  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  duration_preset_hours int not null check (duration_preset_hours in (3,6,9)),

  map_visibility boolean not null default true,
  preview_mode boolean not null default true,

  -- Requirements & Safety
  age18_required boolean not null default true,
  consent_required boolean not null default false,
  premium_required boolean not null default false,
  gps_mode gps_mode not null default 'off',
  gps_radius_m int not null default 200 check (gps_radius_m between 25 and 5000),

  -- Optional location target
  city text null,
  lat double precision null,
  lng double precision null,

  -- Sponsor disclosure
  is_sponsored boolean not null default false,
  sponsor_name text null,
  sponsor_disclosure text null,

  -- Action config (type modules)
  action_route text not null,
  action_config jsonb not null default '{}'::jsonb,
  
  -- XP rewards
  xp_scan int not null default 10 check (xp_scan between 0 and 1000),
  xp_action int not null default 25 check (xp_action between 0 and 1000),

  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists beacons_status_time_idx on public.beacons(status, starts_at, expires_at);
create index if not exists beacons_geo_idx on public.beacons(city);
create index if not exists beacons_type_idx on public.beacons(type);
create index if not exists beacons_creator_idx on public.beacons(created_by);

-- QR Keys (Hashed for Security)
-- ============================================================================
create table if not exists public.beacon_qr_keys (
  id uuid primary key default gen_random_uuid(),
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  qr_key_hash text not null unique,
  active boolean not null default true,
  rotated_from uuid null references public.beacon_qr_keys(id),
  created_at timestamptz not null default now()
);

create index if not exists beacon_qr_keys_beacon_idx on public.beacon_qr_keys(beacon_id, active);
create index if not exists beacon_qr_keys_hash_idx on public.beacon_qr_keys(qr_key_hash) where active = true;

-- Scan Events (Idempotent)
-- ============================================================================
create table if not exists public.scan_events (
  id uuid primary key default gen_random_uuid(),
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  user_id uuid null references auth.users(id) on delete set null,
  guest_id uuid null,
  source text not null default 'qr',
  created_at timestamptz not null default now(),
  ip_hash text null,
  device_hash text null
);

-- Idempotency: one scan per (beacon, user) OR (beacon, guest)
create unique index if not exists scan_unique_user
  on public.scan_events(beacon_id, user_id)
  where user_id is not null;

create unique index if not exists scan_unique_guest
  on public.scan_events(beacon_id, guest_id)
  where guest_id is not null;

create index if not exists scan_events_beacon_idx on public.scan_events(beacon_id, created_at desc);
create index if not exists scan_events_user_idx on public.scan_events(user_id, created_at desc);

-- XP Ledger (Immutable Log)
-- ============================================================================
create table if not exists public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  beacon_id uuid null references public.beacons(id) on delete set null,
  reason xp_reason not null,
  amount int not null check (amount between -100000 and 100000),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Prevent double-award for scan XP per beacon
create unique index if not exists xp_unique_scan
  on public.xp_ledger(user_id, beacon_id, reason)
  where reason = 'scan' and beacon_id is not null;

create index if not exists xp_ledger_user_idx on public.xp_ledger(user_id, created_at desc);

-- Gate Logs (Compliance Tracking)
-- ============================================================================
create table if not exists public.gate_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  guest_id uuid null,
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  step text not null,
  status text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists gate_logs_beacon_idx on public.gate_logs(beacon_id, created_at desc);
create index if not exists gate_logs_user_idx on public.gate_logs(user_id, created_at desc) where user_id is not null;

-- Scan Sessions (Short-lived Reveal Tokens)
-- ============================================================================
create table if not exists public.scan_sessions (
  token text primary key,
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  user_id uuid null references auth.users(id) on delete set null,
  guest_id uuid null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accessed_at timestamptz null
);

create index if not exists scan_sessions_exp_idx on public.scan_sessions(expires_at);
create index if not exists scan_sessions_beacon_idx on public.scan_sessions(beacon_id);

-- Notification Preferences
-- ============================================================================
create table if not exists public.notification_prefs (
  user_id uuid not null references auth.users(id) on delete cascade,
  category notif_category not null,
  in_app boolean not null default true,
  push boolean not null default false,
  email boolean not null default false,
  primary key (user_id, category)
);

-- Notification Queue (Outbox Pattern)
-- ============================================================================
create table if not exists public.notification_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  channel notif_channel not null,
  template_key text not null,
  payload jsonb not null default '{}'::jsonb,
  dedupe_key text not null unique,
  not_before timestamptz not null default now(),
  status text not null default 'queued',
  attempts int not null default 0,
  last_error text null,
  created_at timestamptz not null default now(),
  sent_at timestamptz null
);

create index if not exists notification_queue_status_idx on public.notification_queue(status, not_before);
create index if not exists notification_queue_user_idx on public.notification_queue(user_id, created_at desc);

-- Rate Limiting
-- ============================================================================
create table if not exists public.rate_limits (
  key text primary key,
  count int not null default 1,
  window_start timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists rate_limits_exp_idx on public.rate_limits(expires_at);

-- Security Helpers
-- ============================================================================
create or replace function public.sha256_hex(input text) returns text
language sql immutable as $$
  select encode(digest(input, 'sha256'), 'hex');
$$;

create or replace function public.random_token(len_bytes int default 24) returns text
language sql volatile as $$
  select translate(encode(gen_random_bytes(len_bytes), 'base64'), '+/=', '-_');
$$;

-- Rate Limiting Helper
-- ============================================================================
create or replace function public.check_rate_limit(
  p_key text,
  p_max_count int,
  p_window_seconds int
) returns boolean
language plpgsql security definer as $$
declare
  v_record record;
  v_now timestamptz := now();
  v_window_start timestamptz := v_now - make_interval(secs => p_window_seconds);
begin
  -- Cleanup expired entries
  delete from public.rate_limits where expires_at <= v_now;

  -- Check existing rate limit
  select * into v_record from public.rate_limits where key = p_key limit 1;

  if v_record is null then
    -- First request in window
    insert into public.rate_limits(key, count, window_start, expires_at)
    values (p_key, 1, v_now, v_now + make_interval(secs => p_window_seconds));
    return true;
  elsif v_record.window_start < v_window_start then
    -- Window expired, reset
    update public.rate_limits
    set count = 1, window_start = v_now, expires_at = v_now + make_interval(secs => p_window_seconds)
    where key = p_key;
    return true;
  elsif v_record.count >= p_max_count then
    -- Rate limit exceeded
    return false;
  else
    -- Increment counter
    update public.rate_limits
    set count = count + 1
    where key = p_key;
    return true;
  end if;
end;
$$;

-- Creator RPC: Create Beacon + Generate QR Key
-- ============================================================================
create or replace function public.create_beacon(
  p_type beacon_type,
  p_title text,
  p_description text,
  p_duration_hours int,
  p_starts_at timestamptz,
  p_city text default null,
  p_lat double precision default null,
  p_lng double precision default null,
  p_map_visibility boolean default true,
  p_preview_mode boolean default true,
  p_consent_required boolean default false,
  p_premium_required boolean default false,
  p_gps_mode gps_mode default 'off',
  p_gps_radius_m int default 200,
  p_is_sponsored boolean default false,
  p_sponsor_name text default null,
  p_sponsor_disclosure text default null,
  p_action_route text default '/beacons',
  p_action_config jsonb default '{}'::jsonb,
  p_xp_scan int default 10,
  p_xp_action int default 25,
  p_publish_now boolean default false
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_beacon_id uuid;
  v_qr_key text;
  v_qr_hash text;
  v_expires_at timestamptz;
  v_status beacon_status;
begin
  if not public.is_creator() then
    raise exception 'not_authorized';
  end if;

  if p_duration_hours not in (3,6,9) then
    raise exception 'invalid_duration';
  end if;

  v_expires_at := p_starts_at + make_interval(hours => p_duration_hours);
  v_status := case when p_publish_now then 'live' else 'scheduled' end;

  insert into public.beacons (
    status,type,title,description,starts_at,expires_at,duration_preset_hours,
    map_visibility,preview_mode,
    consent_required,premium_required,gps_mode,gps_radius_m,
    city,lat,lng,
    is_sponsored,sponsor_name,sponsor_disclosure,
    action_route,action_config,
    xp_scan,xp_action,
    created_by
  ) values (
    v_status,p_type,p_title,p_description,p_starts_at,v_expires_at,p_duration_hours,
    p_map_visibility, p_preview_mode,
    p_consent_required, p_premium_required, p_gps_mode, p_gps_radius_m,
    p_city,p_lat,p_lng,
    p_is_sponsored, p_sponsor_name, p_sponsor_disclosure,
    p_action_route, p_action_config,
    p_xp_scan, p_xp_action,
    auth.uid()
  ) returning id into v_beacon_id;

  -- Generate unguessable QR key (256-bit)
  v_qr_key := public.random_token(32);
  v_qr_hash := public.sha256_hex(v_qr_key);

  insert into public.beacon_qr_keys(beacon_id, qr_key_hash, active)
  values (v_beacon_id, v_qr_hash, true);

  return jsonb_build_object(
    'beaconId', v_beacon_id,
    'status', v_status,
    'startsAt', p_starts_at,
    'expiresAt', v_expires_at,
    'qrKey', v_qr_key
  );
end;
$$;

-- Creator RPC: Rotate QR Key (Revoke Leaked Key)
-- ============================================================================
create or replace function public.rotate_beacon_qr(p_beacon_id uuid) returns jsonb
language plpgsql security definer as $$
declare
  v_new_key text;
  v_new_hash text;
  v_old_id uuid;
  v_creator_id uuid;
begin
  -- Check ownership
  select created_by into v_creator_id from public.beacons where id = p_beacon_id limit 1;
  
  if v_creator_id is null or (v_creator_id != auth.uid() and not public.is_admin()) then
    raise exception 'not_authorized';
  end if;

  -- Deactivate old key
  select id into v_old_id
  from public.beacon_qr_keys
  where beacon_id = p_beacon_id and active = true
  order by created_at desc
  limit 1;

  if v_old_id is not null then
    update public.beacon_qr_keys set active = false where id = v_old_id;
  end if;

  -- Generate new key
  v_new_key := public.random_token(32);
  v_new_hash := public.sha256_hex(v_new_key);

  insert into public.beacon_qr_keys(beacon_id, qr_key_hash, active, rotated_from)
  values (p_beacon_id, v_new_hash, true, v_old_id);

  return jsonb_build_object('beaconId', p_beacon_id, 'qrKey', v_new_key);
end;
$$;

-- Core RPC: Redeem Scan (Server-Side XP Award)
-- ============================================================================
create or replace function public.redeem_scan(
  p_qr_key text,
  p_source text default 'qr',
  p_guest_id uuid default null,
  p_device_hash text default null,
  p_ip_hash text default null
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_hash text;
  v_beacon_id uuid;
  v_user_id uuid;
  v_now timestamptz := now();
  v_token text;
  v_expires timestamptz := v_now + interval '15 minutes';
  v_xp_awarded int := 0;
  v_beacon record;
  v_rate_key text;
  v_rate_ok boolean;
begin
  v_user_id := auth.uid();
  if v_user_id is null and p_guest_id is null then
    raise exception 'guest_id_required';
  end if;

  -- Rate limiting (10 scans per device per 10 minutes)
  if p_device_hash is not null then
    v_rate_key := 'scan:' || p_device_hash;
    v_rate_ok := public.check_rate_limit(v_rate_key, 10, 600);
    if not v_rate_ok then
      raise exception 'rate_limit_exceeded';
    end if;
  end if;

  -- Hash and lookup QR key
  v_hash := public.sha256_hex(p_qr_key);

  select b.* into v_beacon
  from public.beacon_qr_keys k
  join public.beacons b on b.id = k.beacon_id
  where k.qr_key_hash = v_hash and k.active = true
  limit 1;

  if not found then
    raise exception 'invalid_qr';
  end if;

  v_beacon_id := v_beacon.id;

  -- Auto-expire if time passed
  if v_beacon.status = 'live' and v_beacon.expires_at <= v_now then
    update public.beacons set status='expired', updated_at=v_now where id=v_beacon_id;
    v_beacon.status := 'expired';
  end if;

  -- Check if beacon is scannable
  if v_beacon.status not in ('live', 'scheduled') then
    raise exception 'beacon_not_active';
  end if;

  if v_beacon.status = 'scheduled' and v_beacon.starts_at > v_now then
    raise exception 'beacon_not_started';
  end if;

  -- Log scan (idempotent by unique indexes)
  insert into public.scan_events(beacon_id, user_id, guest_id, source, device_hash, ip_hash)
  values (v_beacon_id, v_user_id, p_guest_id, coalesce(p_source,'qr'), p_device_hash, p_ip_hash)
  on conflict do nothing;

  -- Award XP only to authenticated users
  if v_user_id is not null then
    begin
      insert into public.xp_ledger(user_id, beacon_id, reason, amount)
      values (v_user_id, v_beacon_id, 'scan', v_beacon.xp_scan)
      on conflict do nothing;

      -- Check if XP was awarded (new scan)
      if found then
        v_xp_awarded := v_beacon.xp_scan;
      end if;
    exception when others then
      v_xp_awarded := 0;
    end;
  end if;

  -- Create session token
  v_token := public.random_token(24);
  insert into public.scan_sessions(token, beacon_id, user_id, guest_id, expires_at)
  values (v_token, v_beacon_id, v_user_id, p_guest_id, v_expires);

  return jsonb_build_object(
    'sessionToken', v_token,
    'xpAwarded', v_xp_awarded,
    'beacon', jsonb_build_object(
      'id', v_beacon.id,
      'status', v_beacon.status,
      'type', v_beacon.type,
      'title', v_beacon.title,
      'description', v_beacon.description,
      'startsAt', v_beacon.starts_at,
      'expiresAt', v_beacon.expires_at,
      'durationHours', v_beacon.duration_preset_hours,
      'isSponsored', v_beacon.is_sponsored,
      'sponsorName', v_beacon.sponsor_name,
      'sponsorDisclosure', v_beacon.sponsor_disclosure,
      'requirements', jsonb_build_object(
        'age18', v_beacon.age18_required,
        'consent', v_beacon.consent_required,
        'premium', v_beacon.premium_required,
        'gpsMode', v_beacon.gps_mode,
        'gpsRadiusM', v_beacon.gps_radius_m
      ),
      'xp', jsonb_build_object(
        'scan', v_beacon.xp_scan,
        'action', v_beacon.xp_action
      ),
      'actionRoute', v_beacon.action_route,
      'actionConfig', v_beacon.action_config
    )
  );
end;
$$;

-- Fetch Scan Session (Reveal Payload)
-- ============================================================================
create or replace function public.get_scan_session(p_token text) returns jsonb
language plpgsql
security definer
as $$
declare
  v_s record;
  v_b record;
begin
  select * into v_s from public.scan_sessions
  where token = p_token and expires_at > now()
  limit 1;

  if not found then
    raise exception 'session_expired';
  end if;

  -- Update accessed_at
  update public.scan_sessions set accessed_at = now() where token = p_token;

  select * into v_b from public.beacons where id = v_s.beacon_id limit 1;

  return jsonb_build_object(
    'token', v_s.token,
    'beacon', jsonb_build_object(
      'id', v_b.id,
      'status', v_b.status,
      'type', v_b.type,
      'title', v_b.title,
      'description', v_b.description,
      'startsAt', v_b.starts_at,
      'expiresAt', v_b.expires_at,
      'durationHours', v_b.duration_preset_hours,
      'isSponsored', v_b.is_sponsored,
      'sponsorName', v_b.sponsor_name,
      'sponsorDisclosure', v_b.sponsor_disclosure,
      'requirements', jsonb_build_object(
        'age18', v_b.age18_required,
        'consent', v_b.consent_required,
        'premium', v_b.premium_required,
        'gpsMode', v_b.gps_mode,
        'gpsRadiusM', v_b.gps_radius_m
      ),
      'xp', jsonb_build_object(
        'scan', v_b.xp_scan,
        'action', v_b.xp_action
      ),
      'actionRoute', v_b.action_route,
      'actionConfig', v_b.action_config,
      'city', v_b.city,
      'lat', v_b.lat,
      'lng', v_b.lng
    )
  );
end;
$$;

-- GPS Verification RPC (Hard Requirement)
-- ============================================================================
create or replace function public.verify_proximity(
  p_beacon_id uuid,
  p_user_lat double precision,
  p_user_lng double precision
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_beacon record;
  v_distance_m double precision;
  v_passed boolean := false;
begin
  select * into v_beacon from public.beacons where id = p_beacon_id limit 1;

  if not found then
    raise exception 'beacon_not_found';
  end if;

  if v_beacon.gps_mode = 'off' then
    return jsonb_build_object('passed', true, 'distance', null, 'required', false);
  end if;

  if v_beacon.lat is null or v_beacon.lng is null then
    -- No anchor point set, pass by default
    return jsonb_build_object('passed', true, 'distance', null, 'required', true, 'reason', 'no_anchor');
  end if;

  -- Haversine distance calculation (approximate meters)
  v_distance_m := 6371000 * acos(
    cos(radians(p_user_lat)) * cos(radians(v_beacon.lat)) *
    cos(radians(v_beacon.lng) - radians(p_user_lng)) +
    sin(radians(p_user_lat)) * sin(radians(v_beacon.lat))
  );

  v_passed := v_distance_m <= v_beacon.gps_radius_m;

  -- Log gate check
  insert into public.gate_logs(user_id, beacon_id, step, status, meta)
  values (
    auth.uid(),
    p_beacon_id,
    'GPS',
    case when v_passed then 'completed' else 'failed' end,
    jsonb_build_object('distance', v_distance_m, 'required', v_beacon.gps_radius_m)
  );

  return jsonb_build_object(
    'passed', v_passed,
    'distance', round(v_distance_m::numeric, 1),
    'required', v_beacon.gps_radius_m,
    'mode', v_beacon.gps_mode
  );
end;
$$;

-- Notification Enqueue Helper
-- ============================================================================
create or replace function public.enqueue_notification(
  p_user_id uuid,
  p_channel notif_channel,
  p_template_key text,
  p_payload jsonb,
  p_dedupe_key text,
  p_not_before timestamptz default now()
) returns void
language plpgsql security definer as $$
begin
  insert into public.notification_queue(user_id, channel, template_key, payload, dedupe_key, not_before)
  values (p_user_id, p_channel, p_template_key, coalesce(p_payload,'{}'::jsonb), p_dedupe_key, p_not_before)
  on conflict (dedupe_key) do nothing;
end;
$$;

-- Cron Helpers
-- ============================================================================
create or replace function public.cleanup_scan_sessions() returns void
language sql security definer as $$
  delete from public.scan_sessions where expires_at <= now();
$$;

create or replace function public.expire_beacons() returns void
language sql security definer as $$
  update public.beacons
  set status = 'expired', updated_at = now()
  where status = 'live' and expires_at <= now();
$$;

create or replace function public.cleanup_rate_limits() returns void
language sql security definer as $$
  delete from public.rate_limits where expires_at <= now();
$$;

-- RLS Policies
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.beacons enable row level security;
alter table public.beacon_qr_keys enable row level security;
alter table public.scan_events enable row level security;
alter table public.xp_ledger enable row level security;
alter table public.gate_logs enable row level security;
alter table public.scan_sessions enable row level security;
alter table public.notification_prefs enable row level security;
alter table public.notification_queue enable row level security;
alter table public.rate_limits enable row level security;

-- Profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update to authenticated
using (user_id = auth.uid());

-- Beacons (public can see live via map, creators manage own)
drop policy if exists "beacons_select_live" on public.beacons;
create policy "beacons_select_live" on public.beacons
for select to anon, authenticated
using (status = 'live' and map_visibility = true);

drop policy if exists "beacons_creator_select" on public.beacons;
create policy "beacons_creator_select" on public.beacons
for select to authenticated
using (created_by = auth.uid());

drop policy if exists "beacons_creator_update" on public.beacons;
create policy "beacons_creator_update" on public.beacons
for update to authenticated
using (created_by = auth.uid() and public.is_creator());

-- QR Keys (no direct access, use RPCs only)
drop policy if exists "qr_keys_no_access" on public.beacon_qr_keys;
create policy "qr_keys_no_access" on public.beacon_qr_keys
for select to anon, authenticated
using (false);

-- Scan Events (users can read own)
drop policy if exists "scan_select_own" on public.scan_events;
create policy "scan_select_own" on public.scan_events
for select to authenticated
using (user_id = auth.uid());

-- XP Ledger (users can read own)
drop policy if exists "xp_select_own" on public.xp_ledger;
create policy "xp_select_own" on public.xp_ledger
for select to authenticated
using (user_id = auth.uid());

-- Gate Logs (users can read own)
drop policy if exists "gate_logs_select_own" on public.gate_logs;
create policy "gate_logs_select_own" on public.gate_logs
for select to authenticated
using (user_id = auth.uid());

-- Scan Sessions (no direct access, use get_scan_session RPC)
drop policy if exists "scan_sessions_no_access" on public.scan_sessions;
create policy "scan_sessions_no_access" on public.scan_sessions
for select to anon, authenticated
using (false);

-- Notification Prefs (users manage own)
drop policy if exists "notif_prefs_own" on public.notification_prefs;
create policy "notif_prefs_own" on public.notification_prefs
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Notification Queue (users can read own)
drop policy if exists "notif_queue_own_select" on public.notification_queue;
create policy "notif_queue_own_select" on public.notification_queue
for select to authenticated
using (user_id = auth.uid());

-- Rate Limits (no direct access)
drop policy if exists "rate_limits_no_access" on public.rate_limits;
create policy "rate_limits_no_access" on public.rate_limits
for all to anon, authenticated
using (false);
