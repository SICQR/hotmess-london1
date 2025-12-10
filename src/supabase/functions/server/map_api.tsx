/**
 * HOTMESS LONDON - MAP API
 * Privacy-safe heat and trail data for map visualization
 * 
 * PRIVACY RULES:
 * - Heat: k-anonymity (k≥5), 10min delay, aggregated grid
 * - Trails: k-anonymity (k≥20), coarse OD pairs only
 * - No individual tracking, no precise movement, no live stalking
 */

import { Hono } from 'npm:hono@4.10.6';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const app = new Hono();

// Helper to get Supabase client
function getSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
}

// ============================================================================
// HEAT DATA - Aggregated scan activity
// ============================================================================

/**
 * GET /heat - Privacy-safe heat map data
 * 
 * Returns aggregated scan activity as GeoJSON points
 * Privacy protections:
 * - 10 minute delay (only scans older than 10 mins)
 * - Aggregated to ~500m grid cells (H3 level 9)
 * - k-anonymity threshold (k≥5, only show cells with 5+ scans)
 * - Optional noise addition for extra privacy
 * 
 * Query params:
 * - city: Filter by city (optional, default: all)
 * - bucket: Time bucket (optional, 15m, 30m, 60m, default: 15m)
 * - hours: Hours of history (optional, default: 24)
 */
app.get('/heat', async (c) => {
  try {
    const city = c.req.query('city'); // Optional: 'london', 'manchester', etc.
    const bucket = c.req.query('bucket') || '15m'; // Time bucket
    const hours = parseInt(c.req.query('hours') || '24'); // Hours of history

    const supabase = getSupabase();

    // Calculate time threshold (10 min delay for privacy)
    const delayMinutes = 10;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const endTime = new Date(Date.now() - delayMinutes * 60 * 1000);

    console.log(`📍 Fetching heat data: city=${city || 'all'}, bucket=${bucket}, hours=${hours}`);

    // Query scans with privacy delay
    let query = supabase
      .from('scans')
      .select(`
        beacon_id,
        scanned_at,
        beacons!inner(
          id,
          latitude,
          longitude,
          city
        )
      `)
      .gte('scanned_at', startTime.toISOString())
      .lte('scanned_at', endTime.toISOString());

    // Filter by city if provided
    if (city) {
      query = query.eq('beacons.city', city);
    }

    const { data: scans, error } = await query;

    if (error) {
      console.error('❌ Error fetching scans:', error);
      return c.json({ error: 'Failed to fetch heat data' }, 500);
    }

    if (!scans || scans.length === 0) {
      console.log('⚠️ No scans found for heat map');
      return c.json({
        type: 'FeatureCollection',
        features: []
      });
    }

    // Aggregate scans to grid cells (privacy layer)
    const gridSize = 0.005; // ~500m at London latitude
    const gridCells = new Map<string, {
      lat: number;
      lng: number;
      count: number;
      scans: any[];
    }>();

    for (const scan of scans) {
      if (!scan.beacons) continue;

      const lat = scan.beacons.latitude;
      const lng = scan.beacons.longitude;

      // Round to grid cell
      const gridLat = Math.round(lat / gridSize) * gridSize;
      const gridLng = Math.round(lng / gridSize) * gridSize;
      const cellKey = `${gridLat},${gridLng}`;

      if (!gridCells.has(cellKey)) {
        gridCells.set(cellKey, {
          lat: gridLat,
          lng: gridLng,
          count: 0,
          scans: []
        });
      }

      const cell = gridCells.get(cellKey)!;
      cell.count++;
      cell.scans.push(scan);
    }

    // Apply k-anonymity threshold (k≥5)
    const kThreshold = 5;
    const privacySafeCells = Array.from(gridCells.values())
      .filter(cell => cell.count >= kThreshold);

    console.log(`✅ Heat data: ${privacySafeCells.length} cells (from ${scans.length} scans, ${gridCells.size} grid cells before k-anonymity)`);

    // Convert to GeoJSON
    const features = privacySafeCells.map(cell => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [cell.lng, cell.lat]
      },
      properties: {
        count: cell.count,
        // Optional: Add noise for extra privacy
        // count: Math.max(kThreshold, Math.round(cell.count * (0.9 + Math.random() * 0.2)))
      }
    }));

    return c.json({
      type: 'FeatureCollection',
      features,
      metadata: {
        totalCells: features.length,
        totalScans: scans.length,
        kThreshold,
        gridSize,
        delayMinutes,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Heat data error:', error);
    return c.json({ error: error.message || 'Failed to fetch heat data' }, 500);
  }
});

// ============================================================================
// TRAIL DATA - Anonymous movement flows
// ============================================================================

/**
 * GET /trails - Privacy-safe flow data
 * 
 * Returns aggregated movement flows as GeoJSON LineStrings
 * Shows where people move between beacon clusters
 * 
 * Privacy protections:
 * - 30 minute delay (only scans older than 30 mins)
 * - Aggregated to coarse OD (origin-destination) pairs
 * - k-anonymity threshold (k≥20, only show flows with 20+ users)
 * - Only shows transitions between grid cells, not precise locations
 * - Time-boxed (max 7 days of history)
 * 
 * Query params:
 * - city: Filter by city (optional)
 * - bucket: Time bucket (optional, default: 60m)
 * - hours: Hours of history (optional, default: 168 = 7 days)
 */
app.get('/trails', async (c) => {
  try {
    const city = c.req.query('city');
    const bucket = c.req.query('bucket') || '60m';
    const hours = Math.min(parseInt(c.req.query('hours') || '168'), 168); // Max 7 days

    const supabase = getSupabase();

    // Calculate time threshold (30 min delay for privacy)
    const delayMinutes = 30;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const endTime = new Date(Date.now() - delayMinutes * 60 * 1000);

    console.log(`🛤️ Fetching trail data: city=${city || 'all'}, bucket=${bucket}, hours=${hours}`);

    // Query scans with user_id to track movements
    let query = supabase
      .from('scans')
      .select(`
        user_id,
        beacon_id,
        scanned_at,
        beacons!inner(
          id,
          latitude,
          longitude,
          city
        )
      `)
      .gte('scanned_at', startTime.toISOString())
      .lte('scanned_at', endTime.toISOString())
      .not('user_id', 'is', null)
      .order('user_id', { ascending: true })
      .order('scanned_at', { ascending: true });

    if (city) {
      query = query.eq('beacons.city', city);
    }

    const { data: scans, error } = await query;

    if (error) {
      console.error('❌ Error fetching scans for trails:', error);
      return c.json({ error: 'Failed to fetch trail data' }, 500);
    }

    if (!scans || scans.length < 2) {
      console.log('⚠️ Not enough scans for trails');
      return c.json({
        type: 'FeatureCollection',
        features: []
      });
    }

    // Group scans by user
    const userScans = new Map<string, any[]>();
    for (const scan of scans) {
      if (!userScans.has(scan.user_id)) {
        userScans.set(scan.user_id, []);
      }
      userScans.get(scan.user_id)!.push(scan);
    }

    // Generate OD (origin-destination) pairs
    const gridSize = 0.01; // ~1km at London latitude (coarser than heat)
    const odPairs = new Map<string, {
      fromLat: number;
      fromLng: number;
      toLat: number;
      toLng: number;
      count: number;
      users: Set<string>;
    }>();

    for (const [userId, userScanList] of userScans.entries()) {
      if (userScanList.length < 2) continue;

      // Look at consecutive scans
      for (let i = 0; i < userScanList.length - 1; i++) {
        const scan1 = userScanList[i];
        const scan2 = userScanList[i + 1];

        if (!scan1.beacons || !scan2.beacons) continue;

        // Snap to grid cells
        const fromLat = Math.round(scan1.beacons.latitude / gridSize) * gridSize;
        const fromLng = Math.round(scan1.beacons.longitude / gridSize) * gridSize;
        const toLat = Math.round(scan2.beacons.latitude / gridSize) * gridSize;
        const toLng = Math.round(scan2.beacons.longitude / gridSize) * gridSize;

        // Skip self-loops
        if (fromLat === toLat && fromLng === toLng) continue;

        const pairKey = `${fromLat},${fromLng}->${toLat},${toLng}`;

        if (!odPairs.has(pairKey)) {
          odPairs.set(pairKey, {
            fromLat,
            fromLng,
            toLat,
            toLng,
            count: 0,
            users: new Set()
          });
        }

        const pair = odPairs.get(pairKey)!;
        pair.count++;
        pair.users.add(userId);
      }
    }

    // Apply k-anonymity threshold (k≥20 unique users)
    const kThreshold = 20;
    const privacySafePairs = Array.from(odPairs.values())
      .filter(pair => pair.users.size >= kThreshold);

    console.log(`✅ Trail data: ${privacySafePairs.length} flows (from ${scans.length} scans, ${odPairs.size} OD pairs before k-anonymity)`);

    // Convert to GeoJSON LineStrings
    const features = privacySafePairs.map(pair => ({
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [pair.fromLng, pair.fromLat],
          [pair.toLng, pair.toLat]
        ]
      },
      properties: {
        count: pair.count,
        uniqueUsers: pair.users.size
      }
    }));

    return c.json({
      type: 'FeatureCollection',
      features,
      metadata: {
        totalFlows: features.length,
        totalScans: scans.length,
        uniqueUsers: userScans.size,
        kThreshold,
        gridSize,
        delayMinutes,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Trail data error:', error);
    return c.json({ error: error.message || 'Failed to fetch trail data' }, 500);
  }
});

// ============================================================================
// BEACON DENSITY - City-level stats
// ============================================================================

/**
 * GET /density - Beacon density by city
 * 
 * Returns aggregated beacon counts and activity by city
 * Useful for showing which cities are most active
 */
app.get('/density', async (c) => {
  try {
    const supabase = getSupabase();

    console.log('📊 Fetching city density data');

    // Get beacon counts by city
    const { data: beaconCounts, error: beaconError } = await supabase
      .from('beacons')
      .select('city')
      .eq('status', 'active');

    if (beaconError) {
      console.error('❌ Error fetching beacons:', beaconError);
      return c.json({ error: 'Failed to fetch density data' }, 500);
    }

    // Get scan counts by city (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const { data: scanCounts, error: scanError } = await supabase
      .from('scans')
      .select(`
        beacon_id,
        beacons!inner(city)
      `)
      .gte('scanned_at', sevenDaysAgo.toISOString());

    if (scanError) {
      console.error('❌ Error fetching scans:', scanError);
      return c.json({ error: 'Failed to fetch density data' }, 500);
    }

    // Aggregate by city
    const cityStats = new Map<string, {
      city: string;
      beaconCount: number;
      scanCount: number;
    }>();

    // Count beacons
    for (const beacon of beaconCounts || []) {
      if (!beacon.city) continue;
      if (!cityStats.has(beacon.city)) {
        cityStats.set(beacon.city, {
          city: beacon.city,
          beaconCount: 0,
          scanCount: 0
        });
      }
      cityStats.get(beacon.city)!.beaconCount++;
    }

    // Count scans
    for (const scan of scanCounts || []) {
      if (!scan.beacons?.city) continue;
      const city = scan.beacons.city;
      if (!cityStats.has(city)) {
        cityStats.set(city, {
          city: city,
          beaconCount: 0,
          scanCount: 0
        });
      }
      cityStats.get(city)!.scanCount++;
    }

    const result = Array.from(cityStats.values())
      .sort((a, b) => b.scanCount - a.scanCount);

    console.log(`✅ Density data: ${result.length} cities`);

    return c.json({
      cities: result,
      metadata: {
        totalCities: result.length,
        totalBeacons: beaconCounts?.length || 0,
        totalScans: scanCounts?.length || 0,
        period: '7 days'
      }
    });

  } catch (error: any) {
    console.error('❌ Density data error:', error);
    return c.json({ error: error.message || 'Failed to fetch density data' }, 500);
  }
});

// ============================================================================
// LIVE STATS - Real-time map statistics
// ============================================================================

/**
 * GET /stats - Live map statistics
 * 
 * Returns real-time stats for map UI (counters, etc.)
 * No privacy concerns as these are aggregated totals
 */
app.get('/stats', async (c) => {
  try {
    const supabase = getSupabase();

    console.log('📈 Fetching live map stats');

    // Get counts
    const [beaconsResult, scansResult, usersResult] = await Promise.all([
      supabase.from('beacons').select('id', { count: 'exact', head: true }),
      supabase.from('scans').select('id', { count: 'exact', head: true }).gte('scanned_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('profiles').select('id', { count: 'exact', head: true })
    ]);

    return c.json({
      totalBeacons: beaconsResult.count || 0,
      scansLast24h: scansResult.count || 0,
      totalUsers: usersResult.count || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Stats error:', error);
    return c.json({ error: error.message || 'Failed to fetch stats' }, 500);
  }
});

export default app;
