-- 102_records_analytics.sql
-- First-party analytics for preview + HQ plays

create table if not exists public.record_plays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  release_id uuid null references public.record_releases(id) on delete set null,
  track_version_id uuid null references public.record_track_versions(id) on delete set null,
  source text not null default 'site', -- 'site' | 'soundcloud_widget'
  event_type text not null, -- 'play' | 'pause' | 'finish' | 'progress'
  progress_ms int null,
  created_at timestamptz not null default now()
);

create index if not exists record_plays_release_idx on public.record_plays(release_id, created_at desc);
create index if not exists record_plays_user_idx on public.record_plays(user_id, created_at desc);
