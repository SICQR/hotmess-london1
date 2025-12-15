-- RIGHT NOW Unified Engine – Complete Schema
-- HOTMESS LONDON – Masculine nightlife OS for queer men 18+
-- Created: 2024-12-09

-- ============================================================================
-- RIGHT NOW POSTS TABLE
-- ============================================================================

create table if not exists right_now_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- Content
  intent text not null check (intent in ('hookup', 'crowd', 'drop', 'ticket', 'radio', 'care')),
  text text not null check (char_length(text) >= 3 and char_length(text) <= 600),
  media_url text,
  safe_tags text[] default '{}',
  
  -- Location
  city text not null,
  country text,
  lat double precision,
  lng double precision,
  beacon_id uuid references beacons(id),
  
  -- Lifecycle
  status text not null default 'active' check (status in ('active', 'deleted', 'removed')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Engagement
  view_count integer not null default 0,
  reply_count integer not null default 0,
  report_count integer not null default 0,
  
  -- Features
  show_on_globe boolean not null default true,
  share_to_telegram boolean not null default false,
  telegram_mirrored boolean not null default false,
  crowd_verified boolean not null default false,
  crowd_count integer check (crowd_count is null or crowd_count >= 2),
  heat_score integer not null default 0 check (heat_score >= 0 and heat_score <= 100),
  
  -- Metadata
  source text not null default 'app' check (source in ('app', 'telegram', 'web')),
  
  -- Constraints
  constraint valid_expires check (expires_at > created_at)
);

-- Indexes for performance
create index if not exists idx_right_now_posts_user on right_now_posts(user_id);
create index if not exists idx_right_now_posts_city on right_now_posts(city);
create index if not exists idx_right_now_posts_intent on right_now_posts(intent);
create index if not exists idx_right_now_posts_expires on right_now_posts(expires_at desc);
create index if not exists idx_right_now_posts_created on right_now_posts(created_at desc);
create index if not exists idx_right_now_posts_status on right_now_posts(status) where status = 'active';
create index if not exists idx_right_now_posts_location on right_now_posts(lat, lng) where lat is not null and lng is not null;
create index if not exists idx_right_now_posts_globe on right_now_posts(show_on_globe, expires_at) where show_on_globe = true and status = 'active';

-- Updated at trigger
create or replace function update_right_now_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger right_now_posts_updated_at
  before update on right_now_posts
  for each row
  execute function update_right_now_posts_updated_at();

-- ============================================================================
-- RIGHT NOW REPORTS TABLE
-- ============================================================================

create table if not exists right_now_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references right_now_posts(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) >= 3 and char_length(reason) <= 500),
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'actioned', 'dismissed')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  
  -- Prevent duplicate reports
  constraint unique_user_post_report unique (reporter_id, post_id)
);

create index if not exists idx_right_now_reports_post on right_now_reports(post_id);
create index if not exists idx_right_now_reports_status on right_now_reports(status) where status = 'pending';
create index if not exists idx_right_now_reports_created on right_now_reports(created_at desc);

-- ============================================================================
-- RPC FUNCTIONS
-- ============================================================================

-- Increment post report count
create or replace function increment_post_report_count(
  p_post_id uuid
) returns void as $$
begin
  update right_now_posts
  set report_count = report_count + 1
  where id = p_post_id;
  
  -- Auto-flag if report count >= 3
  update right_now_posts
  set status = 'removed'
  where id = p_post_id
    and report_count >= 3
    and status = 'active';
end;
$$ language plpgsql security definer;

-- Get active posts for feed
create or replace function get_right_now_feed(
  p_city text default null,
  p_intent text default null,
  p_limit integer default 50,
  p_offset integer default 0,
  p_crowd_verified_only boolean default false,
  p_aftercare_only boolean default false
) returns setof right_now_posts as $$
begin
  return query
  select *
  from right_now_posts
  where status = 'active'
    and expires_at > now()
    and (p_city is null or city ilike '%' || p_city || '%')
    and (p_intent is null or intent = p_intent)
    and (not p_crowd_verified_only or crowd_verified = true)
    and (not p_aftercare_only or 'aftercare' = any(safe_tags))
  order by created_at desc
  limit p_limit
  offset p_offset;
end;
$$ language plpgsql security definer;

-- Get user's post count (for rate limiting)
create or replace function get_user_post_count(
  p_user_id uuid,
  p_hours integer default 24
) returns integer as $$
declare
  v_count integer;
begin
  select count(*)
  into v_count
  from right_now_posts
  where user_id = p_user_id
    and created_at >= now() - (p_hours || ' hours')::interval;
  
  return v_count;
end;
$$ language plpgsql security definer;

-- Cleanup expired posts (cron job)
create or replace function cleanup_expired_right_now_posts()
returns integer as $$
declare
  v_count integer;
begin
  update right_now_posts
  set status = 'expired'
  where status = 'active'
    and expires_at <= now();
  
  get diagnostics v_count = row_count;
  
  return v_count;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table right_now_posts enable row level security;
alter table right_now_reports enable row level security;

-- RIGHT NOW POSTS POLICIES

-- Anyone authenticated can view active posts
create policy "Anyone can view active posts"
  on right_now_posts for select
  using (
    auth.role() = 'authenticated'
    and status = 'active'
    and expires_at > now()
  );

-- Users can insert their own posts (enforced in edge function)
create policy "Users can create posts"
  on right_now_posts for insert
  with check (
    auth.uid() = user_id
  );

-- Users can update their own posts (limited fields)
create policy "Users can update own posts"
  on right_now_posts for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and status in ('active', 'deleted')
  );

-- Users can delete their own posts
create policy "Users can delete own posts"
  on right_now_posts for delete
  using (auth.uid() = user_id);

-- Service role can do anything (for edge function)
create policy "Service role full access"
  on right_now_posts for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- RIGHT NOW REPORTS POLICIES

-- Users can view their own reports
create policy "Users can view own reports"
  on right_now_reports for select
  using (auth.uid() = reporter_id);

-- Users can create reports
create policy "Users can create reports"
  on right_now_reports for insert
  with check (auth.uid() = reporter_id);

-- Service role full access
create policy "Service role full reports access"
  on right_now_reports for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- REALTIME PUBLICATION
-- ============================================================================

-- Enable realtime for RIGHT NOW posts
alter publication supabase_realtime add table right_now_posts;

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================

-- Insert sample posts (only if table is empty)
do $$
begin
  if not exists (select 1 from right_now_posts limit 1) then
    -- Create a test user first (assumes you have one with this ID, or adjust)
    -- This is just for local dev/testing
    insert into right_now_posts (user_id, intent, text, city, country, expires_at, show_on_globe, status, source)
    select
      gen_random_uuid(),
      'hookup',
      'Sample RIGHT NOW post - looking for vibes in Vauxhall, muscle preferred, next 60min',
      'London',
      'United Kingdom',
      now() + interval '60 minutes',
      true,
      'active',
      'app'
    where (select count(*) from right_now_posts) = 0;
  end if;
end $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table right_now_posts is 'Live RIGHT NOW posts - hookup, crowd, care, etc. Expires after TTL.';
comment on table right_now_reports is 'User-submitted reports for moderation.';
comment on function increment_post_report_count is 'Increments report count and auto-flags posts with ≥3 reports.';
comment on function get_right_now_feed is 'Fetch active RIGHT NOW posts with filters.';
comment on function get_user_post_count is 'Count user posts in last N hours for rate limiting.';
comment on function cleanup_expired_right_now_posts is 'Mark expired posts as expired (run via cron).';

-- ============================================================================
-- COMPLETE
-- ============================================================================

-- Verify setup
do $$
begin
  raise notice 'RIGHT NOW Unified Engine schema deployed successfully! ✅';
  raise notice 'Tables: right_now_posts, right_now_reports';
  raise notice 'Functions: increment_post_report_count, get_right_now_feed, get_user_post_count, cleanup_expired_right_now_posts';
  raise notice 'RLS: Enabled with policies';
  raise notice 'Realtime: Enabled for right_now_posts';
end $$;
