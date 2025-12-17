# Night Pulse Real-Time Migration Guide

## Overview
This migration adds real-time Night Pulse infrastructure to HOTMESS, enabling live city-level activity visualization on a 3D globe with privacy-first aggregation.

## Migration File
`src/supabase/migrations/night_pulse_realtime.sql`

## What It Does

### 1. Cities Reference Table
- Seeds 24 major cities with gay nightlife scenes
- Stores coordinates, timezone, and population data
- Used for globe visualization and aggregation

### 2. Night Pulse Events Table
- Tracks real-time delta events (beacon_live, beacon_expired, scan_recorded, etc.)
- Enables incremental updates without full reloads
- Auto-cleanup keeps only last 24 hours

### 3. Materialized View
- Pre-aggregated city statistics for fast initial load
- Includes privacy filtering (hides if <5 beacons)
- Calculates heat intensity (0-100 scale)
- Shows scans from last hour

### 4. Database Triggers
- Auto-emits events when beacons go live/expire
- Auto-emits events when scans are recorded
- Ensures real-time data stream without manual intervention

### 5. Realtime Publication
- Enables Supabase Realtime on night_pulse_events table
- Allows frontend to subscribe to live updates

## How to Run

### In Supabase Dashboard:
1. Go to SQL Editor
2. Create new query
3. Paste contents of `night_pulse_realtime.sql`
4. Run query
5. Verify tables created successfully

### Via CLI (if using Supabase CLI):
```bash
supabase db push
```

## Post-Migration Setup

### 1. Enable Realtime
In your Supabase project:
- Go to Database → Replication
- Ensure `night_pulse_events` table has Realtime enabled
- If not, run: `ALTER PUBLICATION supabase_realtime ADD TABLE night_pulse_events;`

### 2. Set Up Refresh Schedule (Optional)
For materialized view refresh, you can:

**Option A: Manual refresh via admin panel**
```sql
SELECT refresh_night_pulse();
```

**Option B: pg_cron (if available)**
```sql
SELECT cron.schedule(
  'refresh-night-pulse', 
  '30 seconds', 
  'SELECT refresh_night_pulse();'
);
```

**Option C: Edge Function**
Create a scheduled edge function to call `refresh_night_pulse()` every 30 seconds.

### 3. Update Beacons Table
Ensure your `beacons` table has a `city` column that references `cities.id`:

```sql
-- Check if column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'beacons' AND column_name = 'city';

-- If it doesn't exist or isn't TEXT, you may need to add/modify it
-- This is likely already in your schema, but verify the type is TEXT
```

### 4. Verify beacon_scans Table
Ensure beacon_scans has the required structure:
```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'beacon_scans';
```

## Testing

### 1. Test Data Load
```sql
-- Check cities loaded
SELECT COUNT(*) FROM cities; -- Should return 24

-- Check materialized view
SELECT * FROM night_pulse_realtime ORDER BY heat_intensity DESC;
```

### 2. Test Triggers
```sql
-- Create a test beacon
INSERT INTO beacons (code, type, title, city, active) 
VALUES ('TEST-001', 'checkin', 'Test Beacon', 'london', true);

-- Check event was created
SELECT * FROM night_pulse_events ORDER BY created_at DESC LIMIT 1;
-- Should show 'beacon_live' event

-- Deactivate beacon
UPDATE beacons SET active = false WHERE code = 'TEST-001';

-- Check event was created
SELECT * FROM night_pulse_events ORDER BY created_at DESC LIMIT 1;
-- Should show 'beacon_expired' event

-- Clean up
DELETE FROM beacons WHERE code = 'TEST-001';
```

### 3. Test Realtime Subscription
In your frontend console:
```javascript
const { createClient } = require('./utils/supabase/client');
const supabase = createClient();

supabase
  .channel('test_pulse')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'night_pulse_events'
  }, (payload) => {
    console.log('Real-time event received:', payload);
  })
  .subscribe();

// Then trigger a beacon change in Supabase dashboard
// You should see the event in console
```

## Troubleshooting

### Events Not Appearing
1. Check triggers are enabled:
```sql
SELECT tgname, tgenabled FROM pg_trigger WHERE tgrelid = 'beacons'::regclass;
SELECT tgname, tgenabled FROM pg_trigger WHERE tgrelid = 'beacon_scans'::regclass;
```

2. Check RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename IN ('cities', 'night_pulse_events');
```

### Realtime Not Working
1. Verify publication:
```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
-- Should include night_pulse_events
```

2. Check Supabase dashboard → Database → Replication

### Materialized View Empty
1. Refresh manually:
```sql
REFRESH MATERIALIZED VIEW night_pulse_realtime;
SELECT * FROM night_pulse_realtime;
```

2. Check if you have beacons with city IDs matching cities table:
```sql
SELECT b.city, COUNT(*) 
FROM beacons b 
WHERE b.active = true 
GROUP BY b.city;
```

## Performance Notes

- Materialized view refresh is CONCURRENT (non-blocking)
- Indexes on city_id and created_at ensure fast queries
- Old events auto-deleted via refresh function (keeps 24h)
- Privacy filtering happens at view level (efficient aggregation)

## Next Steps

After migration:
1. Test the Night Pulse globe UI in dev
2. Monitor event stream for 24 hours
3. Set up automated refresh schedule
4. Add monitoring/alerts for event stream health
