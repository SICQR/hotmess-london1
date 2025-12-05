-- 101_records_commerce.sql
-- Commerce, entitlements, library

do $$ begin
  create type public.entitlement_kind as enum ('premium','release_access','download_pack');
exception when duplicate_object then null; end $$;

-- Products (digital, studio packs)
create table if not exists public.record_products (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.record_releases(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('digital','studio_pack')),
  price_cents int not null,
  currency text not null default 'GBP',
  stripe_price_id text not null,
  grants jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Orders (Stripe checkout tracking)
create table if not exists public.record_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  stripe_customer_id text null,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  amount_total_cents int not null default 0,
  currency text not null default 'GBP',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Entitlements (premium, release access, download pack)
create table if not exists public.record_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind public.entitlement_kind not null,
  release_id uuid null references public.record_releases(id) on delete cascade,
  product_id uuid null references public.record_products(id) on delete set null,
  ends_at timestamptz null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, release_id)
);

-- Library (saved releases)
create table if not exists public.record_library (
  user_id uuid not null references auth.users(id) on delete cascade,
  release_id uuid not null references public.record_releases(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, release_id)
);

-- Download logs
create table if not exists public.record_download_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_id uuid not null references public.record_assets(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists record_entitlements_user_idx on public.record_entitlements(user_id, kind, ends_at);
