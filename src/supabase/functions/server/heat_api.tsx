/**
 * NIGHT PULSE HEAT API
 * Aggregate beacon scan data for heat map visualization
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.tsx';

const app = new Hono();
app.use('*', cors());

/**
 * GET /heat?window=tonight|weekend|month
 * Returns GeoJSON FeatureCollection of beacon scan heat data
 */
app.get('/heat', async (c) => {
  try {
    const window = c.req.query('window') || 'tonight';
    
    // Get all beacons
    const beacons = await kv.getByPrefix('beacon:');
    
    if (!beacons || beacons.length === 0) {
      return c.json({
        type: 'FeatureCollection',
        features: [],
      });
    }

    // Calculate time window
    const now = Date.now();
    let cutoffTime: number;
    
    switch (window) {
      case 'tonight':
        // Last 12 hours
        cutoffTime = now - (12 * 60 * 60 * 1000);
        break;
      case 'weekend':
        // Last 3 days
        cutoffTime = now - (3 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        // Last 30 days
        cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = now - (12 * 60 * 60 * 1000);
    }

    // Aggregate by city/coordinates
    const cityAggregates = new Map<string, {
      scans: number;
      city: string;
      country: string;
      lat: number;
      lng: number;
      beaconId: string;
    }>();

    for (const beacon of beacons) {
      if (!beacon.latitude || !beacon.longitude) continue;

      // Get scan count from scans KV
      const scanKey = `beacon:scans:${beacon.id}`;
      const scanData = await kv.get(scanKey) || { count: 0, lastScan: 0 };
      
      // Filter by time window
      if (scanData.lastScan && scanData.lastScan < cutoffTime) {
        continue;
      }

      const cityKey = `${beacon.city || 'Unknown'}-${beacon.country || 'Unknown'}`;
      
      if (cityAggregates.has(cityKey)) {
        const existing = cityAggregates.get(cityKey)!;
        existing.scans += scanData.count || 0;
      } else {
        cityAggregates.set(cityKey, {
          scans: scanData.count || 0,
          city: beacon.city || 'Unknown',
          country: beacon.country || 'Unknown',
          lat: beacon.latitude,
          lng: beacon.longitude,
          beaconId: beacon.id,
        });
      }
    }

    // Convert to GeoJSON features
    const features = Array.from(cityAggregates.values())
      .filter(city => city.scans > 0)
      .map(city => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [city.lng, city.lat],
        },
        properties: {
          scans: city.scans,
          city: city.city,
          country: city.country,
          beaconId: city.beaconId,
        },
      }));

    return c.json({
      type: 'FeatureCollection',
      features,
      metadata: {
        window,
        totalCities: features.length,
        totalScans: features.reduce((sum, f) => sum + f.properties.scans, 0),
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('❌ Error generating heat data:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /city/:slug
 * Returns detailed stats for a specific city
 */
app.get('/city/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const window = c.req.query('window') || 'tonight';
    
    // Parse city slug (format: "city-name-country")
    const parts = slug.split('-');
    const country = parts.pop();
    const city = parts.join('-');

    // Get all beacons in this city
    const allBeacons = await kv.getByPrefix('beacon:');
    const cityBeacons = allBeacons.filter(b => 
      b.city?.toLowerCase().replace(/\s+/g, '-') === city &&
      b.country?.toLowerCase().replace(/\s+/g, '-') === country
    );

    if (cityBeacons.length === 0) {
      return c.json({ error: 'City not found' }, 404);
    }

    // Calculate stats
    let totalScans = 0;
    let activeBeacons = 0;
    const now = Date.now();
    const recentThreshold = now - (24 * 60 * 60 * 1000); // 24 hours

    for (const beacon of cityBeacons) {
      const scanKey = `beacon:scans:${beacon.id}`;
      const scanData = await kv.get(scanKey) || { count: 0, lastScan: 0 };
      
      totalScans += scanData.count || 0;
      
      if (scanData.lastScan && scanData.lastScan > recentThreshold) {
        activeBeacons++;
      }
    }

    // Estimate listeners (30% of scans)
    const estimatedListeners = Math.floor(totalScans * 0.3);

    return c.json({
      city: cityBeacons[0].city,
      country: cityBeacons[0].country,
      scans: totalScans,
      listeners: estimatedListeners,
      activeBeacons,
      totalBeacons: cityBeacons.length,
      coordinates: [
        cityBeacons[0].longitude,
        cityBeacons[0].latitude,
      ],
      topEvents: [], // TODO: Integrate with events API
      nowPlaying: null, // TODO: Integrate with radio API
    });

  } catch (error: any) {
    console.error('❌ Error fetching city stats:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /ping
 * Record a beacon scan (updates heat data)
 */
app.post('/ping', async (c) => {
  try {
    const body = await c.req.json();
    const { beaconId } = body;

    if (!beaconId) {
      return c.json({ error: 'beaconId required' }, 400);
    }

    // Update scan counter
    const scanKey = `beacon:scans:${beaconId}`;
    const scanData = await kv.get(scanKey) || { count: 0, scans: [] };
    
    scanData.count = (scanData.count || 0) + 1;
    scanData.lastScan = Date.now();
    
    // Keep last 100 scans with timestamps
    if (!scanData.scans) scanData.scans = [];
    scanData.scans.push({
      timestamp: Date.now(),
      sessionId: crypto.randomUUID(),
    });
    
    // Trim to last 100
    if (scanData.scans.length > 100) {
      scanData.scans = scanData.scans.slice(-100);
    }

    await kv.set(scanKey, scanData);

    console.log(`✅ Beacon scan recorded: ${beaconId} (total: ${scanData.count})`);

    return c.json({
      success: true,
      scans: scanData.count,
      timestamp: scanData.lastScan,
    });

  } catch (error: any) {
    console.error('❌ Error recording beacon ping:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
