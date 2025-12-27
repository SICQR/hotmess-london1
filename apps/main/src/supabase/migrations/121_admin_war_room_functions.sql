-- ============================================================================
-- HOTMESS OS — ADMIN WAR ROOM SQL FUNCTIONS
-- ============================================================================
-- Supporting functions for the Admin War Room dashboard
-- - Ghost XP detection
-- - Venue activity analytics
-- - Fraud pattern detection
-- ============================================================================

-- ============================================================================
-- 1. DETECT SUSPICIOUS ACTIVITY (Ghost XP Farming)
-- ============================================================================
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  total_xp BIGINT,
  scans_today BIGINT,
  suspicious_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH user_activity AS (
    SELECT 
      xl.user_id,
      p.username,
      SUM(xl.amount) FILTER (WHERE xl.amount > 0) as total_xp,
      COUNT(*) FILTER (WHERE xl.reason = 'beacon_scan' AND xl.created_at > NOW() - interval '24 hours') as scans_today,
      COUNT(*) FILTER (WHERE xl.created_at > NOW() - interval '1 hour') as actions_last_hour,
      COUNT(DISTINCT xl.source_id) FILTER (WHERE xl.reason = 'beacon_scan' AND xl.created_at > NOW() - interval '24 hours') as unique_beacons_scanned
    FROM xp_ledger xl
    JOIN profiles p ON p.id = xl.user_id
    WHERE xl.created_at > NOW() - interval '30 days'
    GROUP BY xl.user_id, p.username
  )
  SELECT 
    ua.user_id,
    ua.username,
    ua.total_xp,
    ua.scans_today,
    -- Calculate suspicious score (0-100)
    LEAST(100, (
      -- High scan frequency (more than 50 scans/day)
      CASE WHEN ua.scans_today > 50 THEN 30 ELSE 0 END +
      -- Very high scan frequency (more than 100 scans/day)
      CASE WHEN ua.scans_today > 100 THEN 40 ELSE 0 END +
      -- High action frequency in last hour
      CASE WHEN ua.actions_last_hour > 20 THEN 20 ELSE 0 END +
      -- Low beacon diversity (scanning same beacon repeatedly)
      CASE WHEN ua.scans_today > 20 AND ua.unique_beacons_scanned < 3 THEN 30 ELSE 0 END +
      -- Rapid XP accumulation
      CASE WHEN ua.total_xp > 10000 AND ua.scans_today > 30 THEN 20 ELSE 0 END
    ))::INTEGER as suspicious_score
  FROM user_activity ua
  WHERE ua.total_xp > 0
  ORDER BY 
    -- High suspicious score first
    (
      CASE WHEN ua.scans_today > 50 THEN 30 ELSE 0 END +
      CASE WHEN ua.scans_today > 100 THEN 40 ELSE 0 END +
      CASE WHEN ua.actions_last_hour > 20 THEN 20 ELSE 0 END +
      CASE WHEN ua.scans_today > 20 AND ua.unique_beacons_scanned < 3 THEN 30 ELSE 0 END +
      CASE WHEN ua.total_xp > 10000 AND ua.scans_today > 30 THEN 20 ELSE 0 END
    ) DESC,
    ua.total_xp DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. GET VENUE ACTIVITY (For Bounty System)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_venue_activity(hours_ago INTEGER DEFAULT 24)
RETURNS TABLE (
  beacon_id UUID,
  title TEXT,
  lat NUMERIC,
  lng NUMERIC,
  recent_scans BIGINT,
  historical_average NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as beacon_id,
    b.title,
    b.lat,
    b.lng,
    COUNT(DISTINCT xl.id) FILTER (WHERE xl.created_at > NOW() - (hours_ago || ' hours')::INTERVAL) as recent_scans,
    COALESCE(
      (SELECT AVG(daily_scans) 
       FROM (
         SELECT COUNT(*) as daily_scans
         FROM xp_ledger xl2
         WHERE xl2.source_id = b.id::text
         AND xl2.reason = 'beacon_scan'
         AND xl2.created_at > NOW() - interval '30 days'
         GROUP BY DATE(xl2.created_at)
       ) daily_counts
      ), 
      0
    )::NUMERIC as historical_average
  FROM beacons b
  LEFT JOIN xp_ledger xl ON xl.source_id = b.id::text AND xl.reason = 'beacon_scan'
  WHERE b.active = true
  AND b.type IN ('checkin', 'event', 'venue')
  GROUP BY b.id, b.title, b.lat, b.lng;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. GET PLATFORM STATS (For Admin Dashboard)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_platform_stats(time_window TEXT DEFAULT 'today')
RETURNS TABLE (
  total_users BIGINT,
  active_users_today BIGINT,
  total_scans BIGINT,
  total_xp_awarded BIGINT,
  total_purchases BIGINT,
  active_wars BIGINT,
  crowned_kings BIGINT
) AS $$
DECLARE
  time_threshold TIMESTAMPTZ;
BEGIN
  -- Calculate time threshold
  time_threshold := CASE time_window
    WHEN 'today' THEN DATE_TRUNC('day', NOW())
    WHEN 'week' THEN DATE_TRUNC('week', NOW())
    WHEN 'month' THEN DATE_TRUNC('month', NOW())
    ELSE DATE_TRUNC('day', NOW())
  END;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM profiles)::BIGINT as total_users,
    (SELECT COUNT(DISTINCT user_id) FROM xp_ledger WHERE created_at >= time_threshold)::BIGINT as active_users_today,
    (SELECT COUNT(*) FROM xp_ledger WHERE reason = 'beacon_scan' AND created_at >= time_threshold)::BIGINT as total_scans,
    (SELECT COALESCE(SUM(amount), 0) FROM xp_ledger WHERE amount > 0 AND created_at >= time_threshold)::BIGINT as total_xp_awarded,
    (SELECT COUNT(*) FROM xp_ledger WHERE reason = 'purchase' AND created_at >= time_threshold)::BIGINT as total_purchases,
    (SELECT COUNT(*) FROM beacon_wars WHERE status = 'active' AND expires_at > NOW())::BIGINT as active_wars,
    (SELECT COUNT(DISTINCT king_user_id) FROM beacons WHERE king_user_id IS NOT NULL)::BIGINT as crowned_kings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. GET USER RISK PROFILE (Detailed Analysis)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_risk_profile(p_user_id UUID)
RETURNS TABLE (
  total_xp BIGINT,
  scans_24h BIGINT,
  scans_7d BIGINT,
  unique_beacons_24h BIGINT,
  avg_time_between_scans INTERVAL,
  suspicious_patterns TEXT[],
  risk_level TEXT
) AS $$
DECLARE
  v_suspicious_patterns TEXT[] := ARRAY[]::TEXT[];
  v_risk_level TEXT;
  v_scans_24h BIGINT;
  v_unique_beacons BIGINT;
BEGIN
  -- Get basic stats
  SELECT 
    COUNT(*) FILTER (WHERE reason = 'beacon_scan' AND created_at > NOW() - interval '24 hours'),
    COUNT(DISTINCT source_id) FILTER (WHERE reason = 'beacon_scan' AND created_at > NOW() - interval '24 hours')
  INTO v_scans_24h, v_unique_beacons
  FROM xp_ledger
  WHERE user_id = p_user_id;

  -- Check for suspicious patterns
  IF v_scans_24h > 50 THEN
    v_suspicious_patterns := array_append(v_suspicious_patterns, 'High scan frequency (>50/day)');
  END IF;

  IF v_scans_24h > 20 AND v_unique_beacons < 3 THEN
    v_suspicious_patterns := array_append(v_suspicious_patterns, 'Low beacon diversity');
  END IF;

  -- Determine risk level
  IF array_length(v_suspicious_patterns, 1) >= 3 THEN
    v_risk_level := 'HIGH';
  ELSIF array_length(v_suspicious_patterns, 1) >= 2 THEN
    v_risk_level := 'MEDIUM';
  ELSIF array_length(v_suspicious_patterns, 1) >= 1 THEN
    v_risk_level := 'LOW';
  ELSE
    v_risk_level := 'CLEAN';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(SUM(xl.amount) FILTER (WHERE xl.amount > 0), 0)::BIGINT as total_xp,
    COUNT(*) FILTER (WHERE xl.reason = 'beacon_scan' AND xl.created_at > NOW() - interval '24 hours')::BIGINT as scans_24h,
    COUNT(*) FILTER (WHERE xl.reason = 'beacon_scan' AND xl.created_at > NOW() - interval '7 days')::BIGINT as scans_7d,
    COUNT(DISTINCT xl.source_id) FILTER (WHERE xl.reason = 'beacon_scan' AND xl.created_at > NOW() - interval '24 hours')::BIGINT as unique_beacons_24h,
    CASE 
      WHEN COUNT(*) FILTER (WHERE xl.reason = 'beacon_scan' AND xl.created_at > NOW() - interval '24 hours') > 1 
      THEN (interval '24 hours' / COUNT(*) FILTER (WHERE xl.reason = 'beacon_scan' AND xl.created_at > NOW() - interval '24 hours'))
      ELSE interval '0'
    END as avg_time_between_scans,
    v_suspicious_patterns as suspicious_patterns,
    v_risk_level as risk_level
  FROM xp_ledger xl
  WHERE xl.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION detect_suspicious_activity() IS 'Identifies users with suspicious XP farming patterns';
COMMENT ON FUNCTION get_venue_activity(INTEGER) IS 'Returns venue activity statistics for bounty system';
COMMENT ON FUNCTION get_platform_stats(TEXT) IS 'Returns overall platform metrics for admin dashboard';
COMMENT ON FUNCTION get_user_risk_profile(UUID) IS 'Detailed risk analysis for a specific user';
