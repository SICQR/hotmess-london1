-- 107_records_polish_pack.sql
-- Release page polish: images, opt-ins, referrals, audit

-- Types
do $$ begin
  create type public.release_image_kind as enum ('cover','hero','story','poster');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.optin_tag as enum ('records_drop_alerts','release_drop_alerts','premium_offers');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.ref_event as enum ('view','preview_play','unlock_click','checkout_start','purchase_complete','download');
exception when duplicate_object then null; end $$;

-- Release images (multiple crops: cover/hero/story/poster)
create table if not exists public.record_release_images (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.record_releases(id) on delete cascade,
  kind public.release_image_kind not null,
  asset_id uuid not null references public.record_assets(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (release_id, kind)
);

-- Email opt-ins (drop alerts, premium offers)
create table if not exists public.record_optins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  email text not null,
  tag public.optin_tag not null,
  release_id uuid null references public.record_releases(id) on delete set null,
  consent_text text not null,
  consented_at timestamptz not null default now(),
  source text not null default 'site',
  user_agent text null,
  unique (email, tag, release_id)
);

-- Referral tracking (UTMs, QR drops, conversion funnel)
create table if not exists public.record_referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  release_id uuid null references public.record_releases(id) on delete set null,
  event public.ref_event not null,
  source text not null default 'site', -- 'qr'|'ig'|'sc'|'site'|'telegram'
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_content text null,
  utm_term text null,
  drop_id text null,
  created_at timestamptz not null default now()
);

-- Admin audit log (publish/unpublish/critical actions)
create table if not exists public.record_admin_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  release_id uuid null references public.record_releases(id) on delete set null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.record_release_images enable row level security;
alter table public.record_optins enable row level security;
alter table public.record_referrals enable row level security;
alter table public.record_admin_audit enable row level security;

-- Policies: Images (public read for published, admin write)
create policy "release_images_public_read" on public.record_release_images
for select using (
  exists(
    select 1 from public.record_releases r 
    where r.id = release_id and r.is_published = true
  )
);

create policy "release_images_admin_write" on public.record_release_images
for all using (public.is_admin()) with check (public.is_admin());

-- Policies: Opt-ins (insert allowed for everyone, read own/admin)
create policy "optins_insert_any" on public.record_optins
for insert with check (true);

create policy "optins_own_read" on public.record_optins
for select using (user_id = auth.uid());

create policy "optins_admin_read" on public.record_optins
for select using (public.is_admin());

-- Policies: Referrals (insert allowed for everyone, admin read)
create policy "referrals_insert_any" on public.record_referrals
for insert with check (true);

create policy "referrals_admin_read" on public.record_referrals
for select using (public.is_admin());

-- Policies: Audit (admin only)
create policy "audit_admin_all" on public.record_admin_audit
for all using (public.is_admin()) with check (public.is_admin());

-- Indexes
create index if not exists record_optins_email_idx on public.record_optins(email);
create index if not exists record_referrals_release_idx on public.record_referrals(release_id);
create index if not exists record_referrals_event_idx on public.record_referrals(event);
create index if not exists record_referrals_created_idx on public.record_referrals(created_at desc);
create index if not exists record_admin_audit_actor_idx on public.record_admin_audit(actor_id);
create index if not exists record_admin_audit_release_idx on public.record_admin_audit(release_id);
