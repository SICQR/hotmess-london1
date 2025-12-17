-- ============================================================================
-- HOTMESS OS - Additional Indexes (Canonical Architecture 2025-12-17)
-- ============================================================================
-- Migration 003: Performance indexes for common query patterns
-- Note: Core indexes are already created in 001_create_core_tables.sql
-- ============================================================================

-- Additional composite indexes for common queries
-- ============================================================================

-- Beacons: Combined status + city for location-based live beacon queries
CREATE INDEX IF NOT EXISTS idx_beacons_status_city ON beacons(status, city_id) WHERE status = 'live';

-- Beacons: Active beacons (status + end_at) for cleanup queries
CREATE INDEX IF NOT EXISTS idx_beacons_active ON beacons(status, end_at) WHERE end_at > now();

-- Beacon Scans: Scanner + created for user scan history
CREATE INDEX IF NOT EXISTS idx_beacon_scans_scanner_created ON beacon_scans(scanner_profile_id, created_at) WHERE scanner_profile_id IS NOT NULL;

-- Ticket Listings: Beacon + status for beacon page listings
CREATE INDEX IF NOT EXISTS idx_ticket_listings_beacon_status ON ticket_listings(beacon_id, status) WHERE status = 'live';

-- Moderation Reports: Status + created for queue ordering
CREATE INDEX IF NOT EXISTS idx_moderation_reports_queue ON moderation_reports(status, created_at) WHERE status IN ('open', 'investigating');

-- Orders: User + created for user order history
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);

-- Orders: Payment + fulfilment status for admin dashboard
CREATE INDEX IF NOT EXISTS idx_orders_payment_fulfilment ON orders(payment_status, fulfilment_status);

-- XP Events: Actor + type for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_xp_events_actor_type ON xp_events(actor_id, event_type);

-- Products: Status + collection for shop filtering
CREATE INDEX IF NOT EXISTS idx_products_status_collection ON products(status, collection) WHERE status = 'live';

-- Market Listings: Status + seller for seller dashboard
CREATE INDEX IF NOT EXISTS idx_market_listings_seller_status ON market_listings(seller_id, status);

-- Evidence Events: Beacon + type for evidence chain queries
CREATE INDEX IF NOT EXISTS idx_evidence_events_beacon_type ON evidence_events(beacon_id, type);

-- Beacon Posts: Beacon + status for thread display
CREATE INDEX IF NOT EXISTS idx_beacon_posts_beacon_status ON beacon_posts(beacon_id, status, created_at) WHERE status = 'visible';

-- QR Tokens: Expires + status for cleanup queries
CREATE INDEX IF NOT EXISTS idx_qr_tokens_cleanup ON qr_tokens(expires_at, status) WHERE status = 'active';

-- DSAR Requests: Status + created for admin queue
CREATE INDEX IF NOT EXISTS idx_dsar_requests_queue ON dsar_requests(status, created_at) WHERE status IN ('received', 'verifying', 'processing');

-- Schedule Blocks: Day + status for current day lookup
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_day_status ON schedule_blocks(day_of_week, status) WHERE status = 'live';

-- Records Releases: Status + date for upcoming releases
CREATE INDEX IF NOT EXISTS idx_records_releases_upcoming ON records_releases(status, release_date) WHERE status IN ('scheduled', 'live');

-- Partial indexes for active/visible content
-- ============================================================================

-- Only index live beacons for public queries
CREATE INDEX IF NOT EXISTS idx_beacons_live_only ON beacons(city_id, end_at) WHERE status = 'live';

-- Only index visible posts
CREATE INDEX IF NOT EXISTS idx_beacon_posts_visible_only ON beacon_posts(beacon_id, created_at) WHERE status = 'visible';

-- Only index live products
CREATE INDEX IF NOT EXISTS idx_products_live_only ON products(collection, created_at) WHERE status = 'live';

-- ============================================================================
-- Full-text search indexes (if needed for title/description searches)
-- ============================================================================

-- Note: These can be added later if full-text search is required
-- For now, using basic text pattern matching which works with standard indexes
