-- =====================================================
-- HOTMESS LONDON - CORE OPERATING SYSTEM SCHEMA
-- Auth + Membership + XP + RIGHT NOW + Party Beacons
-- =====================================================

-- =====================================================
-- 1. USERS & PROFILES
-- =====================================================

-- Extend auth.users with profile data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identity
  display_name TEXT,
  age INTEGER NOT NULL CHECK (age >= 18),
  gender_identity TEXT NOT NULL DEFAULT 'male' CHECK (gender_identity = 'male'),
  city TEXT NOT NULL,
  country TEXT DEFAULT 'UK',
  
  -- Location (coarse)
  geo_hash TEXT, -- h9 precision = ~5m x 5m, we'll use h6 = ~1.2km x 0.6km for privacy
  lat_bin NUMERIC(8,4), -- Rounded to ~100m
  lng_bin NUMERIC(8,4),
  location_consent BOOLEAN DEFAULT false,
  location_updated_at TIMESTAMPTZ,
  
  -- Consent & Gates
  age_verified BOOLEAN DEFAULT false,
  men_only_consent BOOLEAN DEFAULT false,
  behaviour_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  
  -- Profile
  bio TEXT,
  avatar_url TEXT,
  tags TEXT[], -- ['chill', 'kinky', 'sober', etc]
  
  -- Status
  online_status TEXT DEFAULT 'offline' CHECK (online_status IN ('online', 'away', 'invisible', 'offline')),
  last_seen_at TIMESTAMPTZ,
  
  -- Membership
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'hnh', 'vendor', 'sponsor', 'icon')),
  membership_expires_at TIMESTAMPTZ,
  
  -- XP
  xp_total INTEGER DEFAULT 0,
  xp_tier TEXT DEFAULT 'fresh' CHECK (xp_tier IN ('fresh', 'regular', 'sinner', 'icon')),
  
  -- Safety
  shadow_banned BOOLEAN DEFAULT false,
  shadow_ban_reason TEXT,
  shadow_banned_until TIMESTAMPTZ,
  trusted_contact_phone TEXT, -- For panic system
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- Soft delete for GDPR
);

-- Indexes for profiles
CREATE INDEX idx_profiles_city ON public.profiles(city) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_geo_hash ON public.profiles(geo_hash) WHERE deleted_at IS NULL AND location_consent = true;
CREATE INDEX idx_profiles_membership ON public.profiles(membership_tier) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_xp ON public.profiles(xp_total DESC) WHERE deleted_at IS NULL;

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND deleted_at IS NULL
    AND shadow_banned = false
  );

-- =====================================================
-- 2. XP SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Event
  event_type TEXT NOT NULL, -- 'post_right_now', 'scan_beacon', 'listen_radio', 'shop', 'attend_party', etc
  xp_amount INTEGER NOT NULL,
  multiplier NUMERIC(3,2) DEFAULT 1.0, -- Membership multiplier
  
  -- Context
  related_id UUID, -- ID of the thing that generated XP (post, beacon, etc)
  related_type TEXT, -- 'right_now_post', 'party_beacon', 'vendor_product', etc
  city TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_xp_events_user ON public.xp_events(user_id, created_at DESC);
CREATE INDEX idx_xp_events_type ON public.xp_events(event_type, created_at DESC);

-- Function to award XP and update user total
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_event_type TEXT,
  p_xp_amount INTEGER,
  p_related_id UUID DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_multiplier NUMERIC(3,2);
  v_actual_xp INTEGER;
  v_new_total INTEGER;
  v_new_tier TEXT;
BEGIN
  -- Get user's membership multiplier
  SELECT 
    CASE membership_tier
      WHEN 'free' THEN 1.0
      WHEN 'hnh' THEN 1.5
      WHEN 'vendor' THEN 1.5
      WHEN 'sponsor' THEN 1.75
      WHEN 'icon' THEN 2.0
      ELSE 1.0
    END INTO v_multiplier
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Calculate actual XP
  v_actual_xp := FLOOR(p_xp_amount * v_multiplier);
  
  -- Record event
  INSERT INTO public.xp_events (user_id, event_type, xp_amount, multiplier, related_id, related_type, city)
  VALUES (p_user_id, p_event_type, v_actual_xp, v_multiplier, p_related_id, p_related_type, p_city);
  
  -- Update user total
  UPDATE public.profiles
  SET 
    xp_total = xp_total + v_actual_xp,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp_total INTO v_new_total;
  
  -- Calculate new tier
  v_new_tier := CASE
    WHEN v_new_total < 500 THEN 'fresh'
    WHEN v_new_total < 2500 THEN 'regular'
    WHEN v_new_total < 10000 THEN 'sinner'
    ELSE 'icon'
  END;
  
  -- Update tier if changed
  UPDATE public.profiles
  SET xp_tier = v_new_tier
  WHERE id = p_user_id AND xp_tier != v_new_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. RIGHT NOW POSTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.right_now_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Content
  mode TEXT NOT NULL CHECK (mode IN ('hookup', 'crowd', 'drop', 'ticket', 'radio', 'care')),
  text TEXT NOT NULL CHECK (LENGTH(text) <= 120),
  
  -- Location (coarse for privacy)
  city TEXT NOT NULL,
  country TEXT DEFAULT 'UK',
  geo_hash TEXT, -- h6 precision for heat binning
  lat_bin NUMERIC(8,4), -- Rounded to ~100m
  lng_bin NUMERIC(8,4),
  near_party BOOLEAN DEFAULT false,
  party_beacon_id UUID, -- If posted from/near a party
  
  -- Timing
  ttl_minutes INTEGER DEFAULT 30 CHECK (ttl_minutes IN (15, 30, 45, 60, 90)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Visibility
  visibility TEXT DEFAULT 'local' CHECK (visibility IN ('local', 'near', 'city', 'global')),
  visibility_radius_km INTEGER DEFAULT 3,
  show_in_globe BOOLEAN DEFAULT true,
  
  -- Safety & Moderation
  safety_flags JSONB DEFAULT '[]'::jsonb,
  ai_safety_score NUMERIC(3,2), -- 0.0 = safe, 1.0 = unsafe
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'removed')),
  moderated_by UUID REFERENCES public.profiles(id),
  moderated_at TIMESTAMPTZ,
  
  -- Engagement
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  heat_score INTEGER DEFAULT 0, -- Calculated from engagement + proximity
  
  -- Membership Features
  sponsored BOOLEAN DEFAULT false,
  boosted_by UUID REFERENCES public.profiles(id),
  boosted_until TIMESTAMPTZ,
  
  -- Telegram
  telegram_mirrored BOOLEAN DEFAULT false,
  telegram_message_id TEXT,
  telegram_room_id TEXT,
  
  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for RIGHT NOW posts
CREATE INDEX idx_right_now_city_active ON public.right_now_posts(city, created_at DESC) 
  WHERE deleted_at IS NULL AND expires_at > NOW() AND moderation_status != 'removed';
  
CREATE INDEX idx_right_now_geo ON public.right_now_posts(geo_hash) 
  WHERE deleted_at IS NULL AND expires_at > NOW() AND show_in_globe = true;
  
CREATE INDEX idx_right_now_mode ON public.right_now_posts(mode, created_at DESC)
  WHERE deleted_at IS NULL AND expires_at > NOW();
  
CREATE INDEX idx_right_now_expires ON public.right_now_posts(expires_at)
  WHERE deleted_at IS NULL AND expires_at > NOW();

-- Trigger to auto-expire posts
CREATE OR REPLACE FUNCTION expire_right_now_posts() RETURNS void AS $$
BEGIN
  UPDATE public.right_now_posts
  SET deleted_at = NOW()
  WHERE expires_at < NOW() AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- RLS for RIGHT NOW posts
ALTER TABLE public.right_now_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active posts in their area"
  ON public.right_now_posts FOR SELECT
  USING (
    deleted_at IS NULL 
    AND expires_at > NOW()
    AND moderation_status IN ('pending', 'approved')
    AND (
      -- Global posts
      visibility = 'global'
      -- Or posts near user's city
      OR city = (SELECT city FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can create their own posts"
  ON public.right_now_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.right_now_posts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. PARTY BEACONS (QR SYSTEM)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.party_beacons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Host
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  host_verified BOOLEAN DEFAULT false,
  
  -- Party Details
  name TEXT NOT NULL,
  description TEXT,
  venue_name TEXT,
  venue_type TEXT CHECK (venue_type IN ('home', 'flat', 'club', 'sauna', 'bar', 'outdoor', 'other')),
  
  -- Location (exact for host, binned for guests)
  city TEXT NOT NULL,
  country TEXT DEFAULT 'UK',
  address_private TEXT, -- Only host sees this
  lat NUMERIC(10,6), -- Exact, private
  lng NUMERIC(10,6),
  geo_hash TEXT, -- h8 precision for clustering
  lat_bin NUMERIC(8,4), -- Public binned location
  lng_bin NUMERIC(8,4),
  
  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  
  -- Capacity & Rules
  capacity_max INTEGER,
  capacity_current INTEGER DEFAULT 0,
  rules TEXT, -- House rules, dress code, etc
  entry_requirements TEXT[], -- ['18+', 'men-only', 'invite-only', 'hnh-members']
  
  -- QR Code
  qr_code TEXT UNIQUE NOT NULL, -- Short code for URL
  qr_scans INTEGER DEFAULT 0,
  qr_image_url TEXT, -- Generated QR image
  
  -- Safety
  safety_verified BOOLEAN DEFAULT false,
  panic_incidents INTEGER DEFAULT 0,
  crowd_verified BOOLEAN DEFAULT false, -- True when ≥6 unique scans
  
  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'invite', 'private')),
  show_in_globe BOOLEAN DEFAULT true,
  
  -- XP Rewards
  xp_for_host INTEGER DEFAULT 100,
  xp_per_scan INTEGER DEFAULT 15,
  
  -- Telegram
  telegram_room_id TEXT,
  telegram_invite_link TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Party beacon scans (guests checking in)
CREATE TABLE IF NOT EXISTS public.party_beacon_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beacon_id UUID NOT NULL REFERENCES public.party_beacons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Scan details
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  geo_hash TEXT,
  
  -- Status
  checked_out_at TIMESTAMPTZ,
  
  UNIQUE(beacon_id, user_id, scanned_at::date) -- One scan per user per day
);

CREATE INDEX idx_party_scans_beacon ON public.party_beacon_scans(beacon_id, scanned_at DESC);
CREATE INDEX idx_party_scans_user ON public.party_beacon_scans(user_id, scanned_at DESC);

-- Trigger to update party capacity and verify crowd
CREATE OR REPLACE FUNCTION update_party_on_scan() RETURNS TRIGGER AS $$
DECLARE
  v_unique_scans INTEGER;
BEGIN
  -- Update capacity
  UPDATE public.party_beacons
  SET 
    qr_scans = qr_scans + 1,
    capacity_current = (
      SELECT COUNT(DISTINCT user_id)
      FROM public.party_beacon_scans
      WHERE beacon_id = NEW.beacon_id 
        AND checked_out_at IS NULL
        AND scanned_at > NOW() - INTERVAL '4 hours'
    )
  WHERE id = NEW.beacon_id;
  
  -- Check for crowd verification (≥6 unique scans in 30min)
  SELECT COUNT(DISTINCT user_id) INTO v_unique_scans
  FROM public.party_beacon_scans
  WHERE beacon_id = NEW.beacon_id
    AND scanned_at > NOW() - INTERVAL '30 minutes';
  
  IF v_unique_scans >= 6 THEN
    UPDATE public.party_beacons
    SET crowd_verified = true
    WHERE id = NEW.beacon_id;
  END IF;
  
  -- Award XP to guest
  PERFORM award_xp(
    NEW.user_id,
    'scan_party_beacon',
    (SELECT xp_per_scan FROM public.party_beacons WHERE id = NEW.beacon_id),
    NEW.beacon_id,
    'party_beacon',
    (SELECT city FROM public.party_beacons WHERE id = NEW.beacon_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_party_scan
AFTER INSERT ON public.party_beacon_scans
FOR EACH ROW EXECUTE FUNCTION update_party_on_scan();

-- RLS for party beacons
ALTER TABLE public.party_beacons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public beacons viewable by all"
  ON public.party_beacons FOR SELECT
  USING (
    visibility = 'public' 
    AND deleted_at IS NULL
    AND end_time > NOW()
  );

CREATE POLICY "Hosts can manage their beacons"
  ON public.party_beacons FOR ALL
  USING (auth.uid() = host_id);

-- =====================================================
-- 5. HEAT MAP DATA (AGGREGATED FOR GLOBE)
-- =====================================================

CREATE MATERIALIZED VIEW public.heat_map_bins AS
SELECT
  geo_hash,
  lat_bin,
  lng_bin,
  city,
  
  -- Heat sources
  COUNT(DISTINCT CASE WHEN source = 'right_now' THEN id END) as right_now_count,
  COUNT(DISTINCT CASE WHEN source = 'party' THEN id END) as party_count,
  COUNT(DISTINCT CASE WHEN source = 'scan' THEN id END) as scan_count,
  
  -- Total heat score
  SUM(heat_value) as total_heat,
  
  -- Dominant mode
  MODE() WITHIN GROUP (ORDER BY mode) as dominant_mode,
  
  updated_at
FROM (
  -- RIGHT NOW posts
  SELECT
    id,
    geo_hash,
    lat_bin,
    lng_bin,
    city,
    'right_now' as source,
    mode,
    10 + view_count + (reply_count * 3) as heat_value,
    updated_at
  FROM public.right_now_posts
  WHERE deleted_at IS NULL
    AND expires_at > NOW()
    AND show_in_globe = true
  
  UNION ALL
  
  -- Party beacons
  SELECT
    id,
    geo_hash,
    lat_bin,
    lng_bin,
    city,
    'party' as source,
    'crowd' as mode,
    50 + (capacity_current * 5) as heat_value,
    updated_at
  FROM public.party_beacons
  WHERE deleted_at IS NULL
    AND end_time > NOW()
    AND show_in_globe = true
  
  UNION ALL
  
  -- Recent beacon scans
  SELECT
    s.id,
    b.geo_hash,
    b.lat_bin,
    b.lng_bin,
    b.city,
    'scan' as source,
    'crowd' as mode,
    5 as heat_value,
    s.scanned_at as updated_at
  FROM public.party_beacon_scans s
  JOIN public.party_beacons b ON s.beacon_id = b.id
  WHERE s.scanned_at > NOW() - INTERVAL '2 hours'
    AND s.checked_out_at IS NULL
) heat_sources
GROUP BY geo_hash, lat_bin, lng_bin, city, updated_at;

CREATE INDEX idx_heat_map_city ON public.heat_map_bins(city, total_heat DESC);
CREATE INDEX idx_heat_map_geo ON public.heat_map_bins(geo_hash);

-- Function to refresh heat map (call every 5 minutes)
CREATE OR REPLACE FUNCTION refresh_heat_map() RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.heat_map_bins;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. SAFETY & MODERATION
-- =====================================================

CREATE TABLE IF NOT EXISTS public.safety_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reporter
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Target
  reported_type TEXT NOT NULL CHECK (reported_type IN ('user', 'right_now_post', 'party_beacon', 'message')),
  reported_id UUID NOT NULL,
  
  -- Report
  reason TEXT NOT NULL CHECK (reason IN ('harassment', 'underage', 'violence', 'spam', 'fake', 'unsafe', 'other')),
  description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  action_taken TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_safety_reports_status ON public.safety_reports(status, created_at DESC);
CREATE INDEX idx_safety_reports_severity ON public.safety_reports(severity, status);

-- Panic incidents (HNH system)
CREATE TABLE IF NOT EXISTS public.panic_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Location
  city TEXT NOT NULL,
  geo_hash TEXT,
  lat NUMERIC(10,6),
  lng NUMERIC(10,6),
  venue_name TEXT,
  party_beacon_id UUID REFERENCES public.party_beacons(id),
  
  -- Incident
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  trigger TEXT CHECK (trigger IN ('app', 'qr_bottle', 'qr_venue', 'telegram')),
  feeling TEXT CHECK (feeling IN ('unsafe', 'overwhelmed', 'unsure')),
  message TEXT,
  
  -- Response
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'responded', 'resolved', 'escalated')),
  care_room_id TEXT, -- Link to Hand N Hand chat
  responder_id UUID REFERENCES public.profiles(id),
  responded_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  -- Safety
  location_shared BOOLEAN DEFAULT false,
  location_share_until TIMESTAMPTZ, -- 30min consent window
  trusted_contact_notified BOOLEAN DEFAULT false,
  admin_notified BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_panic_city ON public.panic_incidents(city, created_at DESC);
CREATE INDEX idx_panic_status ON public.panic_incidents(status, severity);

-- Update party beacon panic count
CREATE OR REPLACE FUNCTION increment_party_panic() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.party_beacon_id IS NOT NULL THEN
    UPDATE public.party_beacons
    SET panic_incidents = panic_incidents + 1
    WHERE id = NEW.party_beacon_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_party_panic
AFTER INSERT ON public.panic_incidents
FOR EACH ROW EXECUTE FUNCTION increment_party_panic();

-- =====================================================
-- GRANTS
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
