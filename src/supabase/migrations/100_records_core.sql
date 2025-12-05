-- 100_records_core.sql
-- RAW CONVICT RECORDS - Core schema

create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type public.release_access as enum ('public_preview','premium_early','purchase_required','public_hq');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.track_version_kind as enum ('hq','preview','club','extended','dub','instrumental','acapella');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.asset_kind as enum ('cover','audio','zip','artwork');
exception when duplicate_object then null; end $$;

-- Assets (covers, HQ audio, download zips)
create table if not exists public.record_assets (
  id uuid primary key default gen_random_uuid(),
  kind public.asset_kind not null,
  bucket text not null,
  path text not null,
  mime_type text not null,
  bytes bigint not null default 0,
  checksum_sha256 text null,
  created_at timestamptz not null default now()
);

-- Releases
create table if not exists public.record_releases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  artist_name text not null,
  release_type text not null check (release_type in ('single','ep','lp','compilation')),
  catalog_no text not null,
  release_date date not null,
  cover_asset_id uuid null references public.record_assets(id) on delete set null,
  access public.release_access not null default 'public_preview',
  premium_early_until timestamptz null,
  is_explicit boolean not null default false,
  blurb text not null default '',
  credits text not null default '',
  is_published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tracks
create table if not exists public.record_tracks (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.record_releases(id) on delete cascade,
  track_no int not null,
  title text not null,
  duration_sec int null,
  bpm int null,
  musical_key text null,
  created_at timestamptz not null default now(),
  unique (release_id, track_no)
);

-- Track versions (HQ, preview, remixes, etc.)
create table if not exists public.record_track_versions (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.record_tracks(id) on delete cascade,
  kind public.track_version_kind not null default 'hq',
  is_streamable boolean not null default true,
  is_downloadable boolean not null default false,
  audio_asset_id uuid null references public.record_assets(id) on delete set null,
  soundcloud_track_id bigint null,
  soundcloud_widget_url text null,
  duration_sec int null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists record_tracks_release_idx on public.record_tracks(release_id, track_no);
create index if not exists record_versions_track_idx on public.record_track_versions(track_id, kind);
create index if not exists record_releases_published_idx on public.record_releases(is_published, release_date desc);
