-- ============================================================================
-- NIGHT PULSE REAL-TIME INFRASTRUCTURE
-- ============================================================================
-- Real-time globe visualization with live activity updates
-- Privacy-first aggregation (hide if <5 beacons)
-- Auto-refresh materialized view + delta event stream
-- ============================================================================

-- ============================================================================
-- 1. CITIES REFERENCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  region TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timezone TEXT NOT NULL,
  population INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed major cities with gay nightlife scenes
INSERT INTO cities (id, name, country_code, region, latitude, longitude, timezone, population) VALUES
  ('london', 'London', 'GB', 'England', 51.5074, -0.1278, 'Europe/London', 9000000),
  ('berlin', 'Berlin', 'DE', 'Berlin', 52.5200, 13.4050, 'Europe/Berlin', 3700000),
  ('amsterdam', 'Amsterdam', 'NL', 'North Holland', 52.3676, 4.9041, 'Europe/Amsterdam', 870000),
  ('paris', 'Paris', 'FR', 'Île-de-France', 48.8566, 2.3522, 'Europe/Paris', 2200000),
  ('barcelona', 'Barcelona', 'ES', 'Catalonia', 41.3851, 2.1734, 'Europe/Madrid', 1600000),
  ('manchester', 'Manchester', 'GB', 'England', 53.4808, -2.2426, 'Europe/London', 550000),
  ('brighton', 'Brighton', 'GB', 'England', 50.8225, -0.1372, 'Europe/London', 280000),
  ('new-york', 'New York', 'US', 'New York', 40.7128, -74.0060, 'America/New_York', 8400000),
  ('san-francisco', 'San Francisco', 'US', 'California', 37.7749, -122.4194, 'America/Los_Angeles', 870000),
  ('los-angeles', 'Los Angeles', 'US', 'California', 34.0522, -118.2437, 'America/Los_Angeles', 4000000),
  ('sydney', 'Sydney', 'AU', 'New South Wales', -33.8688, 151.2093, 'Australia/Sydney', 5300000),
  ('melbourne', 'Melbourne', 'AU', 'Victoria', -37.8136, 144.9631, 'Australia/Melbourne', 5000000),
  ('madrid', 'Madrid', 'ES', 'Community of Madrid', 40.4168, -3.7038, 'Europe/Madrid', 3300000),
  ('lisbon', 'Lisbon', 'PT', 'Lisbon', 38.7223, -9.1393, 'Europe/Lisbon', 550000),
  ('tel-aviv', 'Tel Aviv', 'IL', 'Tel Aviv', 32.0853, 34.7818, 'Asia/Jerusalem', 460000),
  ('toronto', 'Toronto', 'CA', 'Ontario', 43.6532, -79.3832, 'America/Toronto', 2930000),
  ('montreal', 'Montreal', 'CA', 'Quebec', 45.5017, -73.5673, 'America/Montreal', 1780000),
  ('mexico-city', 'Mexico City', 'MX', 'Mexico City', 19.4326, -99.1332, 'America/Mexico_City', 9200000),
  ('sao-paulo', 'São Paulo', 'BR', 'São Paulo', -23.5505, -46.6333, 'America/Sao_Paulo', 12300000),
  ('bangkok', 'Bangkok', 'TH', 'Bangkok', 13.7563, 100.5018, 'Asia/Bangkok', 10500000),
  ('tokyo', 'Tokyo', 'JP', 'Tokyo', 35.6762, 139.6503, 'Asia/Tokyo', 14000000),
  ('cape-town', 'Cape Town', 'ZA', 'Western Cape', -33.9249, 18.4241, 'Africa/Johannesburg', 4300000),
  ('miami', 'Miami', 'US', 'Florida', 25.7617, -80.1918, 'America/New_York', 460000),
  ('chicago', 'Chicago', 'US', 'Illinois', 41.8781, -87.6298, 'America/Chicago', 2700000)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_cities_country_code ON cities(country_code);
CREATE INDEX IF NOT EXISTS idx_cities_population ON cities(population);

-- ============================================================================
-- 2. NIGHT PULSE EVENTS (Real-Time Delta Stream)
-- ============================================================================

CREATE TABLE IF NOT EXISTS night_pulse_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'beacon_live', 'beacon_expired', 'scan_recorded', 'listing_created', 'listing_sold'
  )),
  city_id TEXT NOT NULL REFERENCES cities(id),
  delta_beacons INTEGER DEFAULT 0,
  delta_scans INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_night_pulse_events_city_time ON night_pulse_events(city_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_night_pulse_events_cleanup ON night_pulse_events(created_at);
CREATE INDEX IF NOT EXISTS idx_night_pulse_events_type ON night_pulse_events(event_type);

-- Enable Realtime for night_pulse_events
ALTER PUBLICATION supabase_realtime ADD TABLE night_pulse_events;

-- ============================================================================
-- 3. MATERIALIZED VIEW (Fast Initial Load)
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS night_pulse_realtime AS
SELECT 
  c.id as city_id,
  c.name as city_name,
  c.country_code,
  c.latitude,
  c.longitude,
  
  -- Aggregate beacon counts (privacy: hide if <5)
  CASE 
    WHEN COUNT(DISTINCT b.id) FILTER (WHERE b.active = true) < 5 THEN NULL
    ELSE COUNT(DISTINCT b.id) FILTER (WHERE b.active = true)
  END as active_beacons,
  
  -- Aggregate scan activity (last hour)
  COUNT(DISTINCT s.id) FILTER (
    WHERE s.scanned_at > now() - INTERVAL '1 hour'
  ) as scans_last_hour,
  
  -- Heat intensity (0-100 scale)
  LEAST(100, (
    COUNT(DISTINCT s.id) FILTER (WHERE s.scanned_at > now() - INTERVAL '1 hour') * 10
  ))::INTEGER as heat_intensity,
  
  -- Last activity timestamp
  GREATEST(
    MAX(b.created_at),
    MAX(s.scanned_at)
  ) as last_activity_at,
  
  now() as refreshed_at
  
FROM cities c
LEFT JOIN beacons b ON b.city = c.id 
  AND b.active = true
LEFT JOIN beacon_scans s ON s.beacon_id = b.id
GROUP BY c.id, c.name, c.country_code, c.latitude, c.longitude
HAVING 
  -- Only show cities with activity OR major cities (always visible)
  COUNT(DISTINCT b.id) FILTER (WHERE b.active = true) > 0
  OR c.population > 500000;

-- Create unique index for fast queries
CREATE UNIQUE INDEX IF NOT EXISTS idx_night_pulse_city ON night_pulse_realtime(city_id);

-- ============================================================================
-- 4. DATABASE TRIGGERS (Auto-Emit Events)
-- ============================================================================

-- Trigger on beacon status change
CREATE OR REPLACE FUNCTION emit_night_pulse_beacon_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Only emit if beacon has a valid city
  IF NEW.city IS NOT NULL THEN
    IF NEW.active = true AND (OLD.active IS NULL OR OLD.active = false) THEN
      INSERT INTO night_pulse_events (event_type, city_id, delta_beacons)
      VALUES ('beacon_live', NEW.city, 1);
    ELSIF NEW.active = false AND OLD.active = true THEN
      INSERT INTO night_pulse_events (event_type, city_id, delta_beacons)
      VALUES ('beacon_expired', NEW.city, -1);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS beacon_night_pulse_trigger ON beacons;
CREATE TRIGGER beacon_night_pulse_trigger
AFTER INSERT OR UPDATE ON beacons
FOR EACH ROW
EXECUTE FUNCTION emit_night_pulse_beacon_event();

-- Trigger on scan creation
CREATE OR REPLACE FUNCTION emit_night_pulse_scan_event()
RETURNS TRIGGER AS $$
DECLARE
  beacon_city TEXT;
BEGIN
  -- Get the city from the beacon
  SELECT city INTO beacon_city FROM beacons WHERE id = NEW.beacon_id;
  
  IF beacon_city IS NOT NULL THEN
    INSERT INTO night_pulse_events (event_type, city_id, delta_scans)
    VALUES ('scan_recorded', beacon_city, 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS scan_night_pulse_trigger ON beacon_scans;
CREATE TRIGGER scan_night_pulse_trigger
AFTER INSERT ON beacon_scans
FOR EACH ROW
EXECUTE FUNCTION emit_night_pulse_scan_event();

-- ============================================================================
-- 5. REFRESH FUNCTION (Manual or Scheduled)
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_night_pulse()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY night_pulse_realtime;
  
  -- Clean up old events (keep last 24 hours only)
  DELETE FROM night_pulse_events 
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================================

-- Cities are public
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY cities_select_all ON cities FOR SELECT USING (true);

-- Night pulse events are read-only for authenticated users
ALTER TABLE night_pulse_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY night_pulse_events_select_all ON night_pulse_events FOR SELECT USING (true);
CREATE POLICY night_pulse_events_insert_system ON night_pulse_events FOR INSERT WITH CHECK (false);

-- Materialized view is public (accessed via SELECT on the view)
-- No RLS needed as it's a view, not a table

-- ============================================================================
-- NOTES FOR USAGE
-- ============================================================================
-- 
-- 1. Initial Load:
--    SELECT * FROM night_pulse_realtime ORDER BY heat_intensity DESC;
--
-- 2. Real-time Subscription:
--    supabase.channel('night_pulse_updates')
--      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'night_pulse_events' }, callback)
--      .subscribe();
--
-- 3. Manual Refresh (call from admin panel or cron):
--    SELECT refresh_night_pulse();
--
-- 4. Scheduled Refresh (if pg_cron is available):
--    SELECT cron.schedule('refresh-night-pulse', '30 seconds', 'SELECT refresh_night_pulse();');
--
-- ============================================================================
