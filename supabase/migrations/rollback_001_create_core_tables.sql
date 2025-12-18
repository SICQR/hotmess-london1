-- ============================================================================
-- ROLLBACK: 001_create_core_tables.sql
-- ============================================================================
-- Drops all tables created in migration 001 in reverse dependency order
-- Note: CASCADE will automatically drop dependent objects including:
--   - Foreign key constraints (including products.drop_id -> drops.id)
--   - Views that reference these tables
--   - Indexes
--   - RLS policies
-- ============================================================================

-- Drop tables in reverse order to handle foreign key dependencies

-- Music OS
DROP TABLE IF EXISTS records_releases CASCADE;
DROP TABLE IF EXISTS now_playing_overrides CASCADE;
DROP TABLE IF EXISTS schedule_blocks CASCADE;
DROP TABLE IF EXISTS radio_shows CASCADE;

-- Identity OS
DROP TABLE IF EXISTS xp_events CASCADE;

-- Commerce OS
DROP TABLE IF EXISTS market_listings CASCADE;
DROP TABLE IF EXISTS market_sellers CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS drops CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Safety OS
DROP TABLE IF EXISTS dsar_requests CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS moderation_actions CASCADE;
DROP TABLE IF EXISTS moderation_reports CASCADE;

-- Nightlife OS
DROP TABLE IF EXISTS ticket_listings CASCADE;
DROP TABLE IF EXISTS beacon_posts CASCADE;
DROP TABLE IF EXISTS evidence_events CASCADE;
DROP TABLE IF EXISTS beacon_scans CASCADE;
DROP TABLE IF EXISTS qr_tokens CASCADE;
DROP TABLE IF EXISTS beacons CASCADE;

-- Profiles
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop extensions (only if not used by other schemas)
-- DROP EXTENSION IF EXISTS "pgcrypto";
-- DROP EXTENSION IF EXISTS "uuid-ossp";
