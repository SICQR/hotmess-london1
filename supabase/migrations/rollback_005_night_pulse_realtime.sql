-- ============================================================================
-- ROLLBACK: Night Pulse Real-Time Infrastructure
-- ============================================================================
-- Rollback migration 005: Remove Night Pulse Globe feature
-- ============================================================================

BEGIN;

-- Drop triggers
DROP TRIGGER IF EXISTS scan_night_pulse_trigger ON beacon_scans;
DROP TRIGGER IF EXISTS beacon_night_pulse_trigger ON beacons;

-- Drop functions
DROP FUNCTION IF EXISTS emit_night_pulse_scan_event();
DROP FUNCTION IF EXISTS emit_night_pulse_beacon_event();
DROP FUNCTION IF EXISTS refresh_night_pulse();

-- Drop materialized view and its indexes
DROP MATERIALIZED VIEW IF EXISTS night_pulse_realtime;

-- Drop tables (in dependency order)
DROP TABLE IF EXISTS night_pulse_events;
DROP TABLE IF EXISTS cities;

-- Drop indexes on beacons
DROP INDEX IF EXISTS idx_beacons_city_active;
DROP INDEX IF EXISTS idx_beacons_active;

-- Drop columns from beacons
ALTER TABLE beacons DROP COLUMN IF EXISTS city;
ALTER TABLE beacons DROP COLUMN IF EXISTS active;

COMMIT;
