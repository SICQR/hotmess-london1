-- ============================================================================
-- ROLLBACK: 003_create_indexes.sql
-- ============================================================================
-- Drops all additional indexes created in migration 003
-- Note: Core indexes from 001 are dropped when tables are dropped
-- ============================================================================

-- Drop composite indexes
DROP INDEX IF EXISTS idx_beacons_status_city;
DROP INDEX IF EXISTS idx_beacons_active;
DROP INDEX IF EXISTS idx_beacon_scans_scanner_created;
DROP INDEX IF EXISTS idx_ticket_listings_beacon_status;
DROP INDEX IF EXISTS idx_moderation_reports_queue;
DROP INDEX IF EXISTS idx_orders_user_created;
DROP INDEX IF EXISTS idx_orders_payment_fulfilment;
DROP INDEX IF EXISTS idx_xp_events_actor_type;
DROP INDEX IF EXISTS idx_products_status_collection;
DROP INDEX IF EXISTS idx_market_listings_seller_status;
DROP INDEX IF EXISTS idx_evidence_events_beacon_type;
DROP INDEX IF EXISTS idx_beacon_posts_beacon_status;
DROP INDEX IF EXISTS idx_qr_tokens_cleanup;
DROP INDEX IF EXISTS idx_dsar_requests_queue;
DROP INDEX IF EXISTS idx_schedule_blocks_day_status;
DROP INDEX IF EXISTS idx_records_releases_upcoming;

-- Drop partial indexes
DROP INDEX IF EXISTS idx_beacons_live_only;
DROP INDEX IF EXISTS idx_beacon_posts_visible_only;
DROP INDEX IF EXISTS idx_products_live_only;
