-- ============================================================================
-- NIGHT PULSE MIGRATION VERIFICATION TESTS
-- ============================================================================
-- Run these tests after applying migration 005 to verify everything works
-- ============================================================================

-- Test 1: Verify new columns exist on beacons table
SELECT column_name, data_type, is_generated, generation_expression
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'beacons' 
  AND column_name IN ('active', 'city')
ORDER BY column_name;

-- Expected: 
-- active | boolean | NEVER | 
-- city   | text    | ALWAYS | city_id

-- Test 2: Verify cities table exists and has data
SELECT COUNT(*) as city_count FROM cities;

-- Expected: 24 cities

-- Test 3: Verify night_pulse_events table exists
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'night_pulse_events'
ORDER BY ordinal_position;

-- Test 4: Verify materialized view exists
SELECT 
  schemaname, 
  matviewname, 
  hasindexes
FROM pg_matviews 
WHERE schemaname = 'public' 
  AND matviewname = 'night_pulse_realtime';

-- Expected: 1 row with hasindexes = true

-- Test 5: Query the materialized view
SELECT 
  city_id, 
  city_name, 
  country_code, 
  active_beacons, 
  scans_last_hour,
  heat_intensity
FROM night_pulse_realtime 
ORDER BY heat_intensity DESC NULLS LAST
LIMIT 5;

-- Expected: List of cities (may be empty if no beacons exist yet)

-- Test 6: Verify indexes on beacons
SELECT 
  indexname, 
  indexdef
FROM pg_indexes
WHERE tablename = 'beacons' 
  AND indexname LIKE '%active%' OR indexname LIKE '%city%'
ORDER BY indexname;

-- Expected: idx_beacons_active, idx_beacons_city_active

-- Test 7: Verify unique index on materialized view
SELECT 
  indexname, 
  indexdef
FROM pg_indexes
WHERE tablename = 'night_pulse_realtime'
ORDER BY indexname;

-- Expected: idx_night_pulse_city (unique)

-- Test 8: Verify trigger functions exist
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE proname LIKE '%night_pulse%'
ORDER BY proname;

-- Expected: emit_night_pulse_beacon_event, emit_night_pulse_scan_event, refresh_night_pulse

-- Test 9: Verify triggers exist
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%night_pulse%'
ORDER BY trigger_name;

-- Expected: beacon_night_pulse_trigger, scan_night_pulse_trigger

-- Test 10: Verify RLS policies
SELECT 
  schemaname,
  tablename, 
  policyname, 
  permissive,
  cmd
FROM pg_policies
WHERE tablename IN ('cities', 'night_pulse_events')
ORDER BY tablename, policyname;

-- Expected: 
-- cities | cities_select_all | PERMISSIVE | SELECT
-- night_pulse_events | night_pulse_events_insert_system | PERMISSIVE | INSERT
-- night_pulse_events | night_pulse_events_select_all | PERMISSIVE | SELECT

-- Test 11: Test beacon insert triggers night_pulse_event (if auth user exists)
-- Note: This requires at least one user in auth.users
DO $$
DECLARE
  test_user_id UUID;
  test_beacon_id UUID;
  event_count INTEGER;
BEGIN
  -- Get a test user (or skip if none exist)
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Create a test beacon
    INSERT INTO beacons (slug, title, type, city_id, creator_id, status, active)
    VALUES ('test-night-pulse-' || gen_random_uuid(), 'Test Beacon', 'event', 'london', test_user_id, 'live', true)
    RETURNING id INTO test_beacon_id;
    
    -- Check if event was created
    SELECT COUNT(*) INTO event_count 
    FROM night_pulse_events 
    WHERE city_id = 'london' 
      AND event_type = 'beacon_live'
      AND created_at > now() - INTERVAL '10 seconds';
    
    IF event_count > 0 THEN
      RAISE NOTICE 'SUCCESS: Beacon trigger created night_pulse_event';
    ELSE
      RAISE WARNING 'FAILED: Beacon trigger did not create night_pulse_event';
    END IF;
    
    -- Clean up
    DELETE FROM beacons WHERE id = test_beacon_id;
  ELSE
    RAISE NOTICE 'SKIPPED: No auth users exist for testing';
  END IF;
END
$$;

-- Test 12: Test refresh function
SELECT refresh_night_pulse();

-- Expected: No errors, function completes successfully

-- Test 13: Verify materialized view was refreshed recently
SELECT 
  city_id,
  city_name,
  refreshed_at,
  now() - refreshed_at as age
FROM night_pulse_realtime
LIMIT 5;

-- Expected: refreshed_at should be very recent (within last minute)

-- ============================================================================
-- CLEANUP TEST DATA
-- ============================================================================

-- Remove any test events created
DELETE FROM night_pulse_events 
WHERE city_id = 'london' 
  AND created_at > now() - INTERVAL '1 hour'
  AND event_type IN ('beacon_live', 'beacon_expired');

-- ============================================================================
-- SUCCESS
-- ============================================================================

SELECT 'All Night Pulse migration verification tests completed!' as status;
