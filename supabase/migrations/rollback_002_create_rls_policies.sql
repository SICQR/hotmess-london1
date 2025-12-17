-- ============================================================================
-- ROLLBACK: 002_create_rls_policies.sql
-- ============================================================================
-- Drops all RLS policies and helper functions created in migration 002
-- ============================================================================

-- Drop all policies on all tables
-- ============================================================================

-- Profiles
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;

-- Beacons
DROP POLICY IF EXISTS "Public can view live beacons" ON beacons;
DROP POLICY IF EXISTS "Authenticated users can create beacons" ON beacons;
DROP POLICY IF EXISTS "Users can update own draft beacons" ON beacons;
DROP POLICY IF EXISTS "Admin can view all beacons" ON beacons;
DROP POLICY IF EXISTS "Admin can update any beacon" ON beacons;
DROP POLICY IF EXISTS "Admin can delete beacons" ON beacons;

-- QR Tokens
DROP POLICY IF EXISTS "Only admin can view QR tokens" ON qr_tokens;
DROP POLICY IF EXISTS "Only admin can create QR tokens" ON qr_tokens;
DROP POLICY IF EXISTS "Only admin can update QR tokens" ON qr_tokens;

-- Beacon Scans
DROP POLICY IF EXISTS "Only admin can view beacon scans" ON beacon_scans;
DROP POLICY IF EXISTS "Service can insert scans" ON beacon_scans;

-- Evidence Events
DROP POLICY IF EXISTS "Only admin can view evidence events" ON evidence_events;
DROP POLICY IF EXISTS "System can create evidence events" ON evidence_events;

-- Beacon Posts
DROP POLICY IF EXISTS "Public can view visible posts on live beacons" ON beacon_posts;
DROP POLICY IF EXISTS "Users can create posts" ON beacon_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON beacon_posts;
DROP POLICY IF EXISTS "Admin can view all posts" ON beacon_posts;
DROP POLICY IF EXISTS "Moderators can update any post" ON beacon_posts;

-- Ticket Listings
DROP POLICY IF EXISTS "Public can view live listings" ON ticket_listings;
DROP POLICY IF EXISTS "Users can view own listings" ON ticket_listings;
DROP POLICY IF EXISTS "Users can create own listings" ON ticket_listings;
DROP POLICY IF EXISTS "Users can update own draft listings" ON ticket_listings;
DROP POLICY IF EXISTS "Admin can view all listings" ON ticket_listings;
DROP POLICY IF EXISTS "Admin can update any listing" ON ticket_listings;

-- Moderation Reports
DROP POLICY IF EXISTS "Users can create reports" ON moderation_reports;
DROP POLICY IF EXISTS "Users can view own reports" ON moderation_reports;
DROP POLICY IF EXISTS "Moderators can view all reports" ON moderation_reports;
DROP POLICY IF EXISTS "Moderators can update reports" ON moderation_reports;

-- Moderation Actions
DROP POLICY IF EXISTS "Only admin can view moderation actions" ON moderation_actions;
DROP POLICY IF EXISTS "Only admin can create moderation actions" ON moderation_actions;

-- Audit Log
DROP POLICY IF EXISTS "Only admin can view audit log" ON audit_log;
DROP POLICY IF EXISTS "System can insert audit log entries" ON audit_log;

-- DSAR Requests
DROP POLICY IF EXISTS "Users can create own DSAR requests" ON dsar_requests;
DROP POLICY IF EXISTS "Users can view own DSAR requests" ON dsar_requests;
DROP POLICY IF EXISTS "Admin can view all DSAR requests" ON dsar_requests;
DROP POLICY IF EXISTS "Admin can update DSAR requests" ON dsar_requests;

-- Products
DROP POLICY IF EXISTS "Public can view live products" ON products;
DROP POLICY IF EXISTS "Admin can view all products" ON products;
DROP POLICY IF EXISTS "Admin can insert products" ON products;
DROP POLICY IF EXISTS "Admin can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;

-- Drops
DROP POLICY IF EXISTS "Public can view active drops" ON drops;
DROP POLICY IF EXISTS "Admin can view all drops" ON drops;
DROP POLICY IF EXISTS "Admin can insert drops" ON drops;
DROP POLICY IF EXISTS "Admin can update drops" ON drops;

-- Orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Admin can update orders" ON orders;

-- Order Items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "System can insert order items" ON order_items;
DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;

-- Market Sellers
DROP POLICY IF EXISTS "Public can view approved sellers" ON market_sellers;
DROP POLICY IF EXISTS "Users can view own seller account" ON market_sellers;
DROP POLICY IF EXISTS "Users can create own seller account" ON market_sellers;
DROP POLICY IF EXISTS "Sellers can update own account" ON market_sellers;
DROP POLICY IF EXISTS "Admin can view all sellers" ON market_sellers;
DROP POLICY IF EXISTS "Admin can update any seller" ON market_sellers;

-- Market Listings
DROP POLICY IF EXISTS "Public can view live market listings" ON market_listings;
DROP POLICY IF EXISTS "Sellers can view own listings" ON market_listings;
DROP POLICY IF EXISTS "Sellers can create listings" ON market_listings;
DROP POLICY IF EXISTS "Sellers can update own listings" ON market_listings;
DROP POLICY IF EXISTS "Admin can view all market listings" ON market_listings;
DROP POLICY IF EXISTS "Admin can update any market listing" ON market_listings;

-- XP Events
DROP POLICY IF EXISTS "Users can view own XP events" ON xp_events;
DROP POLICY IF EXISTS "System can create XP events" ON xp_events;
DROP POLICY IF EXISTS "Admin can view all XP events" ON xp_events;

-- Radio Shows
DROP POLICY IF EXISTS "Public can view live radio shows" ON radio_shows;
DROP POLICY IF EXISTS "Admin can view all radio shows" ON radio_shows;
DROP POLICY IF EXISTS "Admin can insert radio shows" ON radio_shows;
DROP POLICY IF EXISTS "Admin can update radio shows" ON radio_shows;

-- Schedule Blocks
DROP POLICY IF EXISTS "Public can view schedule blocks" ON schedule_blocks;
DROP POLICY IF EXISTS "Admin can view all schedule blocks" ON schedule_blocks;
DROP POLICY IF EXISTS "Admin can insert schedule blocks" ON schedule_blocks;
DROP POLICY IF EXISTS "Admin can update schedule blocks" ON schedule_blocks;

-- Now Playing Overrides
DROP POLICY IF EXISTS "Public can view active now playing" ON now_playing_overrides;
DROP POLICY IF EXISTS "Admin can insert now playing" ON now_playing_overrides;
DROP POLICY IF EXISTS "Admin can view all now playing" ON now_playing_overrides;

-- Records Releases
DROP POLICY IF EXISTS "Public can view live releases" ON records_releases;
DROP POLICY IF EXISTS "Admin can view all releases" ON records_releases;
DROP POLICY IF EXISTS "Admin can insert releases" ON records_releases;
DROP POLICY IF EXISTS "Admin can update releases" ON records_releases;

-- Drop helper functions
-- ============================================================================

DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_moderator();

-- Disable RLS on all tables (optional - only if you want to completely remove RLS)
-- ============================================================================

-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE beacons DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE qr_tokens DISABLE ROW LEVEL SECURITY;
-- ... etc
