-- ============================================================================
-- ROLLBACK: 004_create_views.sql
-- ============================================================================
-- Drops all views created in migration 004
-- ============================================================================

-- Drop all views
DROP VIEW IF EXISTS xp_leaderboard;
DROP VIEW IF EXISTS city_heat_map;
DROP VIEW IF EXISTS my_orders;
DROP VIEW IF EXISTS moderation_queue_summary;
DROP VIEW IF EXISTS upcoming_releases;
DROP VIEW IF EXISTS radio_schedule_this_week;
DROP VIEW IF EXISTS seller_reputation;
DROP VIEW IF EXISTS products_available;
DROP VIEW IF EXISTS popular_beacons;
DROP VIEW IF EXISTS beacon_stats;
DROP VIEW IF EXISTS night_pulse_city_stats;
DROP VIEW IF EXISTS xp_balances;
