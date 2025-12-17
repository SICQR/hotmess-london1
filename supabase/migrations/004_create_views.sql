-- ============================================================================
-- HOTMESS OS - Safe Public Views (Canonical Architecture 2025-12-17)
-- ============================================================================
-- Migration 004: Aggregate-only views with no PII exposure
-- Compliance: Privacy-first - no user identities or coordinates exposed
-- ============================================================================

-- ============================================================================
-- XP BALANCES (Derived from xp_events ledger)
-- ============================================================================

CREATE OR REPLACE VIEW xp_balances AS
SELECT 
  actor_id,
  SUM(points) as balance,
  COUNT(*) as total_events,
  MAX(created_at) as last_activity
FROM xp_events
GROUP BY actor_id;

COMMENT ON VIEW xp_balances IS 'Derived XP balances from append-only ledger';

-- Allow authenticated users to view (RLS on underlying table controls access)
GRANT SELECT ON xp_balances TO authenticated;

-- ============================================================================
-- NIGHT PULSE - City Activity Aggregates (No PII)
-- ============================================================================

CREATE OR REPLACE VIEW night_pulse_city_stats AS
SELECT 
  city_id,
  DATE_TRUNC('hour', scanned_at) as hour,
  COUNT(*) as scan_count,
  COUNT(DISTINCT beacon_id) as unique_beacons
FROM beacon_scans
WHERE scanned_at > now() - INTERVAL '24 hours'
  AND status = 'valid'
GROUP BY city_id, DATE_TRUNC('hour', scanned_at);

COMMENT ON VIEW night_pulse_city_stats IS 'Hourly city activity - aggregate only, no user data';

-- Public can view these aggregates
GRANT SELECT ON night_pulse_city_stats TO anon, authenticated;

-- ============================================================================
-- BEACON STATS - Public aggregate metrics
-- ============================================================================

CREATE OR REPLACE VIEW beacon_stats AS
SELECT 
  b.id as beacon_id,
  b.slug,
  b.title,
  b.type,
  b.city_id,
  b.status,
  b.scan_count,
  b.view_count,
  COUNT(DISTINCT tl.id) as listing_count,
  COUNT(DISTINCT bp.id) as post_count
FROM beacons b
LEFT JOIN ticket_listings tl ON tl.beacon_id = b.id AND tl.status = 'live'
LEFT JOIN beacon_posts bp ON bp.beacon_id = b.id AND bp.status = 'visible'
WHERE b.status = 'live'
GROUP BY b.id, b.slug, b.title, b.type, b.city_id, b.status, b.scan_count, b.view_count;

COMMENT ON VIEW beacon_stats IS 'Public beacon statistics - no user identification';

GRANT SELECT ON beacon_stats TO anon, authenticated;

-- ============================================================================
-- POPULAR BEACONS - Trending content (privacy-safe)
-- ============================================================================

CREATE OR REPLACE VIEW popular_beacons AS
SELECT 
  b.id,
  b.slug,
  b.title,
  b.type,
  b.city_id,
  b.start_at,
  b.end_at,
  b.scan_count,
  COUNT(DISTINCT bs.id) as recent_scans
FROM beacons b
LEFT JOIN beacon_scans bs ON bs.beacon_id = b.id 
  AND bs.scanned_at > now() - INTERVAL '24 hours'
  AND bs.status = 'valid'
WHERE b.status = 'live'
  AND b.end_at > now()
GROUP BY b.id, b.slug, b.title, b.type, b.city_id, b.start_at, b.end_at, b.scan_count
ORDER BY recent_scans DESC, b.scan_count DESC
LIMIT 100;

COMMENT ON VIEW popular_beacons IS 'Trending beacons based on recent activity - no PII';

GRANT SELECT ON popular_beacons TO anon, authenticated;

-- ============================================================================
-- PRODUCT AVAILABILITY - Public shop view
-- ============================================================================

CREATE OR REPLACE VIEW products_available AS
SELECT 
  p.id,
  p.slug,
  p.name,
  p.description,
  p.collection,
  p.price,
  p.currency,
  p.stock_status,
  p.quantity_available,
  p.xp_reward,
  p.images,
  p.variants,
  p.limited_edition,
  d.name as drop_name,
  d.start_at as drop_start,
  d.end_at as drop_end
FROM products p
LEFT JOIN drops d ON d.id = p.drop_id AND d.status IN ('scheduled', 'live')
WHERE p.status = 'live'
  AND p.quantity_available > 0;

COMMENT ON VIEW products_available IS 'Available products for public shop';

GRANT SELECT ON products_available TO anon, authenticated;

-- ============================================================================
-- SELLER REPUTATION - Public seller metrics (no sensitive data)
-- ============================================================================

CREATE OR REPLACE VIEW seller_reputation AS
SELECT 
  ms.id as seller_id,
  ms.display_name,
  ms.bio,
  ms.verification_status,
  COUNT(DISTINCT ml.id) as total_listings,
  COUNT(DISTINCT CASE WHEN ml.status = 'live' THEN ml.id END) as active_listings,
  COUNT(DISTINCT oi.order_id) as total_sales
FROM market_sellers ms
LEFT JOIN market_listings ml ON ml.seller_id = ms.id
LEFT JOIN order_items oi ON oi.listing_id = ml.id
WHERE ms.verification_status = 'approved'
GROUP BY ms.id, ms.display_name, ms.bio, ms.verification_status;

COMMENT ON VIEW seller_reputation IS 'Public seller reputation metrics';

GRANT SELECT ON seller_reputation TO anon, authenticated;

-- ============================================================================
-- RADIO SCHEDULE - Current week's schedule
-- ============================================================================

CREATE OR REPLACE VIEW radio_schedule_this_week AS
SELECT 
  rs.id as show_id,
  rs.slug,
  rs.name,
  rs.description,
  rs.host,
  sb.day_of_week,
  sb.start_time,
  sb.end_time
FROM radio_shows rs
JOIN schedule_blocks sb ON sb.show_id = rs.id
WHERE rs.status = 'live'
  AND sb.status = 'live'
ORDER BY sb.day_of_week, sb.start_time;

COMMENT ON VIEW radio_schedule_this_week IS 'Current radio schedule';

GRANT SELECT ON radio_schedule_this_week TO anon, authenticated;

-- ============================================================================
-- UPCOMING RELEASES - Music catalog
-- ============================================================================

CREATE OR REPLACE VIEW upcoming_releases AS
SELECT 
  id,
  slug,
  title,
  artist,
  label,
  release_date,
  artwork_url,
  soundcloud_url,
  status
FROM records_releases
WHERE status IN ('scheduled', 'live')
  AND (release_date IS NULL OR release_date >= CURRENT_DATE - INTERVAL '30 days')
ORDER BY release_date DESC NULLS LAST;

COMMENT ON VIEW upcoming_releases IS 'Recent and upcoming music releases';

GRANT SELECT ON upcoming_releases TO anon, authenticated;

-- ============================================================================
-- MODERATION QUEUE - Admin view only
-- ============================================================================

CREATE OR REPLACE VIEW moderation_queue_summary AS
SELECT 
  target_type,
  status,
  COUNT(*) as count,
  MAX(created_at) as most_recent
FROM moderation_reports
WHERE status IN ('open', 'investigating')
GROUP BY target_type, status;

COMMENT ON VIEW moderation_queue_summary IS 'Moderation queue summary for admin dashboard';

-- Admin only (enforced by RLS on underlying table)
GRANT SELECT ON moderation_queue_summary TO authenticated;

-- ============================================================================
-- ORDER SUMMARY - User's own orders only
-- ============================================================================

CREATE OR REPLACE VIEW my_orders AS
SELECT 
  o.id,
  o.order_number,
  o.order_type,
  o.total,
  o.currency,
  o.fulfilment_status,
  o.payment_status,
  o.created_at,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = auth.uid()
GROUP BY o.id, o.order_number, o.order_type, o.total, o.currency, o.fulfilment_status, o.payment_status, o.created_at
ORDER BY o.created_at DESC;

COMMENT ON VIEW my_orders IS 'User can only see their own orders';

GRANT SELECT ON my_orders TO authenticated;

-- ============================================================================
-- CITY HEAT MAP - Geographic activity (no coordinates)
-- ============================================================================

CREATE OR REPLACE VIEW city_heat_map AS
SELECT 
  city_id,
  COUNT(DISTINCT id) as beacon_count,
  COUNT(DISTINCT CASE WHEN status = 'live' AND end_at > now() THEN id END) as active_beacon_count,
  MAX(created_at) as last_beacon_created
FROM beacons
WHERE status IN ('live', 'scheduled')
GROUP BY city_id
HAVING COUNT(*) > 0;

COMMENT ON VIEW city_heat_map IS 'City-level beacon activity - no precise coordinates';

GRANT SELECT ON city_heat_map TO anon, authenticated;

-- ============================================================================
-- XP LEADERBOARD - Top users (privacy-aware)
-- ============================================================================

CREATE OR REPLACE VIEW xp_leaderboard AS
SELECT 
  p.id as user_id,
  p.username,
  p.avatar_url,
  COALESCE(SUM(xe.points), 0) as total_xp,
  COUNT(xe.id) as total_events,
  MAX(xe.created_at) as last_activity
FROM profiles p
LEFT JOIN xp_events xe ON xe.actor_id = p.id
WHERE p.username IS NOT NULL -- Only include users with public usernames
GROUP BY p.id, p.username, p.avatar_url
ORDER BY total_xp DESC
LIMIT 100;

COMMENT ON VIEW xp_leaderboard IS 'Top 100 users by XP - only includes users with public usernames';

GRANT SELECT ON xp_leaderboard TO anon, authenticated;
