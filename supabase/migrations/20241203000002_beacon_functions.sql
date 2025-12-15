-- ============================================================================
-- BEACON SYSTEM SQL FUNCTIONS
-- Support functions for beacon scanning, XP, and geospatial queries
-- ============================================================================

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- FUNCTION: get_nearby_beacons
-- Find beacons within a radius of user's location
-- Uses PostGIS geography type for accurate distance calculation
-- ============================================================================
CREATE OR REPLACE FUNCTION get_nearby_beacons(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 5000
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  venue_type TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  distance_meters DOUBLE PRECISION,
  scan_count INTEGER,
  tier TEXT,
  qr_code_url TEXT,
  active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.venue_type,
    b.address,
    b.city,
    b.country,
    b.location_lat,
    b.location_lng,
    ST_Distance(
      ST_MakePoint(b.location_lng, b.location_lat)::geography,
      ST_MakePoint(user_lng, user_lat)::geography
    ) as distance_meters,
    b.scan_count,
    b.tier,
    b.qr_code_url,
    b.active
  FROM beacons b
  WHERE ST_DWithin(
    ST_MakePoint(b.location_lng, b.location_lat)::geography,
    ST_MakePoint(user_lng, user_lat)::geography,
    radius_meters
  )
  AND b.active = true
  ORDER BY distance_meters ASC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add comment
COMMENT ON FUNCTION get_nearby_beacons IS 'Find active beacons within specified radius of user location';

-- ============================================================================
-- FUNCTION: increment_beacon_scans
-- Atomically increment beacon scan count
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_beacon_scans(beacon_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE beacons 
  SET 
    scan_count = COALESCE(scan_count, 0) + 1,
    last_scanned_at = NOW()
  WHERE id = beacon_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

COMMENT ON FUNCTION increment_beacon_scans IS 'Increment scan count for a beacon';

-- ============================================================================
-- FUNCTION: add_user_xp
-- Add XP to user and recalculate level
-- Level formula: level = floor(xp / 100) + 1
-- ============================================================================
CREATE OR REPLACE FUNCTION add_user_xp(
  user_id UUID,
  xp_amount INTEGER
)
RETURNS TABLE (
  new_xp INTEGER,
  new_level INTEGER,
  leveled_up BOOLEAN
) AS $$
DECLARE
  current_xp INTEGER;
  current_level INTEGER;
  calculated_xp INTEGER;
  calculated_level INTEGER;
BEGIN
  -- Get current stats
  SELECT xp, level INTO current_xp, current_level
  FROM profiles
  WHERE id = user_id;
  
  -- Calculate new values
  calculated_xp := COALESCE(current_xp, 0) + xp_amount;
  calculated_level := FLOOR(calculated_xp::DECIMAL / 100) + 1;
  
  -- Update profile
  UPDATE profiles 
  SET 
    xp = calculated_xp,
    level = calculated_level,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Return results
  RETURN QUERY
  SELECT 
    calculated_xp,
    calculated_level,
    (calculated_level > COALESCE(current_level, 1)) as leveled_up;
END;
$$ LANGUAGE plpgsql VOLATILE;

COMMENT ON FUNCTION add_user_xp IS 'Add XP to user and recalculate level (100 XP per level)';

-- ============================================================================
-- FUNCTION: calculate_user_streak
-- Calculate user's current scan streak
-- Streak continues if user scanned yesterday, resets if missed a day
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_user_streak(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  last_scan_date DATE;
  yesterday DATE;
  streak_count INTEGER;
BEGIN
  -- Get user's last scan date and current streak
  SELECT last_scan_date, streak_count INTO last_scan_date, streak_count
  FROM profiles
  WHERE id = user_id;
  
  -- If no previous scans, start at 1
  IF last_scan_date IS NULL THEN
    RETURN 1;
  END IF;
  
  -- Calculate yesterday
  yesterday := CURRENT_DATE - INTERVAL '1 day';
  
  -- If last scan was yesterday, increment streak
  IF last_scan_date = yesterday THEN
    RETURN COALESCE(streak_count, 0) + 1;
  -- If last scan was today, keep current streak
  ELSIF last_scan_date = CURRENT_DATE THEN
    RETURN COALESCE(streak_count, 1);
  -- Otherwise, reset to 1
  ELSE
    RETURN 1;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION calculate_user_streak IS 'Calculate user scan streak based on last scan date';

-- ============================================================================
-- FUNCTION: get_user_stats
-- Get comprehensive user statistics
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE (
  total_scans BIGINT,
  total_xp INTEGER,
  current_level INTEGER,
  current_streak INTEGER,
  unique_beacons BIGINT,
  unique_cities BIGINT,
  unique_countries BIGINT,
  total_distance_km DOUBLE PRECISION,
  first_scan_date TIMESTAMPTZ,
  last_scan_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  WITH user_scans AS (
    SELECT 
      s.*,
      b.city,
      b.country,
      b.location_lat,
      b.location_lng
    FROM scans s
    JOIN beacons b ON s.beacon_id = b.id
    WHERE s.user_id = get_user_stats.user_id
  ),
  user_profile AS (
    SELECT xp, level, streak_count
    FROM profiles
    WHERE id = get_user_stats.user_id
  )
  SELECT 
    COUNT(*)::BIGINT as total_scans,
    COALESCE((SELECT xp FROM user_profile), 0) as total_xp,
    COALESCE((SELECT level FROM user_profile), 1) as current_level,
    COALESCE((SELECT streak_count FROM user_profile), 0) as current_streak,
    COUNT(DISTINCT beacon_id)::BIGINT as unique_beacons,
    COUNT(DISTINCT city)::BIGINT as unique_cities,
    COUNT(DISTINCT country)::BIGINT as unique_countries,
    0::DOUBLE PRECISION as total_distance_km, -- TODO: Calculate actual distance
    MIN(scanned_at) as first_scan_date,
    MAX(scanned_at) as last_scan_date
  FROM user_scans;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_user_stats IS 'Get comprehensive statistics for a user';

-- ============================================================================
-- FUNCTION: get_leaderboard
-- Get top users by XP
-- ============================================================================
CREATE OR REPLACE FUNCTION get_leaderboard(
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  xp INTEGER,
  level INTEGER,
  scan_count BIGINT,
  streak_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY p.xp DESC) as rank,
    p.id as user_id,
    p.username,
    p.avatar_url,
    p.xp,
    p.level,
    COUNT(s.id)::BIGINT as scan_count,
    p.streak_count
  FROM profiles p
  LEFT JOIN scans s ON s.user_id = p.id
  WHERE p.xp > 0
  GROUP BY p.id, p.username, p.avatar_url, p.xp, p.level, p.streak_count
  ORDER BY p.xp DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_leaderboard IS 'Get leaderboard of top users by XP';

-- ============================================================================
-- FUNCTION: get_beacon_leaderboard
-- Get top beacons by scan count
-- ============================================================================
CREATE OR REPLACE FUNCTION get_beacon_leaderboard(
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  rank BIGINT,
  beacon_id BIGINT,
  name TEXT,
  city TEXT,
  country TEXT,
  scan_count INTEGER,
  unique_users BIGINT,
  tier TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY b.scan_count DESC NULLS LAST) as rank,
    b.id as beacon_id,
    b.name,
    b.city,
    b.country,
    COALESCE(b.scan_count, 0) as scan_count,
    COUNT(DISTINCT s.user_id)::BIGINT as unique_users,
    b.tier
  FROM beacons b
  LEFT JOIN scans s ON s.beacon_id = b.id
  WHERE b.active = true
  GROUP BY b.id, b.name, b.city, b.country, b.scan_count, b.tier
  ORDER BY b.scan_count DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_beacon_leaderboard IS 'Get leaderboard of top beacons by scan count';

-- ============================================================================
-- INDEXES for performance
-- ============================================================================

-- Geospatial index for location queries
CREATE INDEX IF NOT EXISTS idx_beacons_location 
ON beacons USING GIST (ST_MakePoint(location_lng, location_lat)::geography);

-- Scan lookups
CREATE INDEX IF NOT EXISTS idx_scans_user_date 
ON scans (user_id, scanned_at DESC);

CREATE INDEX IF NOT EXISTS idx_scans_beacon_date 
ON scans (beacon_id, scanned_at DESC);

CREATE INDEX IF NOT EXISTS idx_scans_date 
ON scans (scanned_at DESC);

-- Beacon lookups
CREATE INDEX IF NOT EXISTS idx_beacons_active 
ON beacons (active) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_beacons_city_country 
ON beacons (city, country) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_beacons_scan_count 
ON beacons (scan_count DESC NULLS LAST) WHERE active = true;

-- Profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_xp 
ON profiles (xp DESC) WHERE xp > 0;

CREATE INDEX IF NOT EXISTS idx_profiles_level 
ON profiles (level DESC);

-- ============================================================================
-- RLS POLICIES
-- Ensure proper row-level security for scan data
-- ============================================================================

-- Users can view their own scans
DROP POLICY IF EXISTS "Users can view own scans" ON scans;
CREATE POLICY "Users can view own scans"
  ON scans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create scans for themselves
DROP POLICY IF EXISTS "Users can create own scans" ON scans;
CREATE POLICY "Users can create own scans"
  ON scans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all scans
DROP POLICY IF EXISTS "Admins can view all scans" ON scans;
CREATE POLICY "Admins can view all scans"
  ON scans
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Service role can do everything
DROP POLICY IF EXISTS "Service role full access to scans" ON scans;
CREATE POLICY "Service role full access to scans"
  ON scans
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- GRANT permissions
-- ============================================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_nearby_beacons TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_beacon_scans TO service_role;
GRANT EXECUTE ON FUNCTION add_user_xp TO service_role;
GRANT EXECUTE ON FUNCTION calculate_user_streak TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_user_stats TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_leaderboard TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION get_beacon_leaderboard TO authenticated, anon, service_role;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Beacon system functions created successfully!';
  RAISE NOTICE '   - get_nearby_beacons: Find beacons within radius';
  RAISE NOTICE '   - increment_beacon_scans: Update scan count';
  RAISE NOTICE '   - add_user_xp: Award XP and calculate level';
  RAISE NOTICE '   - calculate_user_streak: Track daily streaks';
  RAISE NOTICE '   - get_user_stats: Comprehensive user stats';
  RAISE NOTICE '   - get_leaderboard: Top users by XP';
  RAISE NOTICE '   - get_beacon_leaderboard: Top beacons by scans';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Geospatial indexes created for performance';
  RAISE NOTICE '🔒 RLS policies configured for data security';
END $$;
