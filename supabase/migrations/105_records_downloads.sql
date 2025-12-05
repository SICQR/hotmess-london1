-- 105_records_downloads.sql
-- Downloadable pack linking (digital/studio zip assets)

do $$ begin
  create type public.download_kind as enum ('digital','studio_pack');
exception when duplicate_object then null; end $$;

create table if not exists public.record_release_downloads (
  release_id uuid not null references public.record_releases(id) on delete cascade,
  kind public.download_kind not null,
  asset_id uuid not null references public.record_assets(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (release_id, kind)
);

alter table public.record_release_downloads enable row level security;

create policy "downloads_admin_write" on public.record_release_downloads
for all using (public.is_admin()) with check (public.is_admin());

create policy "downloads_public_read_published" on public.record_release_downloads
for select using (exists (
  select 1 from public.record_releases r 
  where r.id = release_id and r.is_published = true
));
