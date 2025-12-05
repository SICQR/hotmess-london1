-- 103_records_rls.sql
-- Row Level Security policies

alter table public.record_assets enable row level security;
alter table public.record_releases enable row level security;
alter table public.record_tracks enable row level security;
alter table public.record_track_versions enable row level security;
alter table public.record_products enable row level security;
alter table public.record_orders enable row level security;
alter table public.record_entitlements enable row level security;
alter table public.record_library enable row level security;
alter table public.record_download_logs enable row level security;
alter table public.record_plays enable row level security;

-- Public read: only published releases + metadata
create policy "releases_public_read" on public.record_releases
for select using (is_published = true);

create policy "tracks_public_read" on public.record_tracks
for select using (exists (
  select 1 from public.record_releases r 
  where r.id = release_id and r.is_published = true
));

create policy "versions_public_read" on public.record_track_versions
for select using (exists (
  select 1
  from public.record_tracks t
  join public.record_releases r on r.id = t.release_id
  where t.id = track_id and r.is_published = true
));

create policy "products_public_read" on public.record_products
for select using (is_active = true and exists (
  select 1 from public.record_releases r 
  where r.id = release_id and r.is_published = true
));

-- Admin write (requires is_admin() function)
create policy "records_admin_write_releases" on public.record_releases
for all using (public.is_admin()) with check (public.is_admin());

create policy "records_admin_write_tracks" on public.record_tracks
for all using (public.is_admin()) with check (public.is_admin());

create policy "records_admin_write_versions" on public.record_track_versions
for all using (public.is_admin()) with check (public.is_admin());

create policy "records_admin_write_assets" on public.record_assets
for all using (public.is_admin()) with check (public.is_admin());

create policy "records_admin_write_products" on public.record_products
for all using (public.is_admin()) with check (public.is_admin());

-- User-owned reads
create policy "records_orders_own_read" on public.record_orders
for select using (user_id = auth.uid());

create policy "records_entitlements_own_read" on public.record_entitlements
for select using (user_id = auth.uid());

create policy "records_library_own_all" on public.record_library
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "records_download_logs_own_read" on public.record_download_logs
for select using (user_id = auth.uid());

-- Plays: anyone can insert (anon ok for preview tracking), only admin can read
create policy "records_plays_insert" on public.record_plays
for insert with check (true);

create policy "records_plays_admin_read" on public.record_plays
for select using (public.is_admin());
