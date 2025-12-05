/**
 * EARTH/GLOBE ROUTES
 * Backend endpoints for the 3D globe visualization
 * Powers /earth page with real-time beacon locations
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ============================================================================
// GET /earth/locations - Get all beacon locations for globe visualization
// ============================================================================
app.get('/make-server-a670c824/earth/locations', async (c) => {
  try {
    const { data: beacons, error } = await supabase
      .from('beacons')
      .select(`
        id,
        name,
        venue_type,
        location_lat,
        location_lng,
        city,
        country,
        scan_count,
        active,
        created_at,
        tier
      `)
      .eq('active', true)
      .order('scan_count', { ascending: false });

    if (error) {
      console.error('❌ Error fetching globe locations:', error);
      return c.json({ error: 'Failed to fetch locations', details: error.message }, 500);
    }

    // Transform to globe format
    const locations = beacons.map(beacon => ({
      id: beacon.id,
      name: beacon.name,
      venueType: beacon.venue_type,
      coordinates: [beacon.location_lng, beacon.location_lat], // [lng, lat] for GeoJSON
      city: beacon.city,
      country: beacon.country,
      activity: beacon.scan_count || 0,
      tier: beacon.tier || 'free',
      timestamp: beacon.created_at,
      // Calculate intensity for globe visualization (0-1 scale)
      intensity: Math.min((beacon.scan_count || 0) / 100, 1)
    }));

    // Group by country for statistics
    const countryStats = locations.reduce((acc, loc) => {
      if (!acc[loc.country]) {
        acc[loc.country] = {
          country: loc.country,
          beaconCount: 0,
          totalActivity: 0
        };
      }
      acc[loc.country].beaconCount++;
      acc[loc.country].totalActivity += loc.activity;
      return acc;
    }, {} as Record<string, any>);

    console.log(`✅ Fetched ${locations.length} globe locations from ${Object.keys(countryStats).length} countries`);

    return c.json({
      locations,
      stats: {
        total: locations.length,
        countries: Object.values(countryStats),
        totalActivity: locations.reduce((sum, loc) => sum + loc.activity, 0)
      }
    });
  } catch (error) {
    console.error('❌ Globe locations error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// ============================================================================
// GET /earth/beacons - Get filtered beacons for globe
// Query params: city, country, tier, limit
// ============================================================================
app.get('/make-server-a670c824/earth/beacons', async (c) => {
  try {
    const city = c.req.query('city');
    const country = c.req.query('country');
    const tier = c.req.query('tier');
    const limit = parseInt(c.req.query('limit') || '50');

    let query = supabase
      .from('beacons')
      .select(`
        id,
        name,
        venue_type,
        address,
        city,
        country,
        location_lat,
        location_lng,
        scan_count,
        active,
        tier,
        qr_code_url,
        created_at
      `)
      .eq('active', true);

    // Apply filters
    if (city) {
      query = query.eq('city', city);
    }
    if (country) {
      query = query.eq('country', country);
    }
    if (tier) {
      query = query.eq('tier', tier);
    }

    const { data: beacons, error } = await query
      .order('scan_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching beacons:', error);
      return c.json({ error: 'Failed to fetch beacons', details: error.message }, 500);
    }

    console.log(`✅ Fetched ${beacons.length} beacons (filters: ${JSON.stringify({ city, country, tier })})`);

    return c.json({
      beacons,
      count: beacons.length,
      filters: { city, country, tier, limit }
    });
  } catch (error) {
    console.error('❌ Beacons fetch error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// ============================================================================
// POST /earth/locations - Add new location (ADMIN ONLY)
// Body: { name, venueType, coordinates: [lng, lat], city, country, address, tier }
// ============================================================================
app.post('/make-server-a670c824/earth/locations', async (c) => {
  try {
    // Get auth header
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized - No auth header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('❌ Auth error:', authError);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      console.error('❌ Not admin:', user.id);
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    // Parse request body
    const body = await c.req.json();
    const { name, venueType, coordinates, city, country, address, tier } = body;

    // Validate required fields
    if (!name || !coordinates || !city || !country) {
      return c.json({ 
        error: 'Missing required fields',
        required: ['name', 'coordinates', 'city', 'country']
      }, 400);
    }

    // Validate coordinates
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return c.json({ 
        error: 'Invalid coordinates format',
        expected: '[longitude, latitude]'
      }, 400);
    }

    const [lng, lat] = coordinates;
    if (typeof lng !== 'number' || typeof lat !== 'number') {
      return c.json({ error: 'Coordinates must be numbers' }, 400);
    }
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return c.json({ error: 'Coordinates out of range' }, 400);
    }

    // Insert new beacon
    const { data: beacon, error: insertError } = await supabase
      .from('beacons')
      .insert({
        name,
        venue_type: venueType || 'club',
        location_lat: lat,
        location_lng: lng,
        city,
        country,
        address: address || null,
        tier: tier || 'free',
        active: true,
        scan_count: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return c.json({ error: 'Failed to create beacon', details: insertError.message }, 500);
    }

    console.log(`✅ Created beacon: ${beacon.name} at [${lng}, ${lat}]`);

    // Trigger Make.com webhook for new beacon
    const makeWebhook = Deno.env.get('MAKE_WEBHOOK_BEACON_CREATED');
    if (makeWebhook) {
      await fetch(makeWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beaconId: beacon.id,
          name: beacon.name,
          city: beacon.city,
          country: beacon.country,
          coordinates: [lng, lat],
          createdBy: user.id
        })
      }).catch(err => console.error('⚠️ Make.com webhook failed:', err));
    }

    return c.json({
      success: true,
      beacon,
      message: 'Beacon created successfully'
    }, 201);
  } catch (error) {
    console.error('❌ Create location error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// ============================================================================
// PUT /earth/locations/:id - Update location (ADMIN ONLY)
// Body: { name?, coordinates?, city?, country?, address?, tier?, active? }
// ============================================================================
app.put('/make-server-a670c824/earth/locations/:id', async (c) => {
  try {
    const beaconId = c.req.param('id');

    // Auth check
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const body = await c.req.json();
    const updates: any = {};

    // Build update object
    if (body.name) updates.name = body.name;
    if (body.city) updates.city = body.city;
    if (body.country) updates.country = body.country;
    if (body.address !== undefined) updates.address = body.address;
    if (body.tier) updates.tier = body.tier;
    if (body.active !== undefined) updates.active = body.active;
    if (body.coordinates && Array.isArray(body.coordinates)) {
      updates.location_lng = body.coordinates[0];
      updates.location_lat = body.coordinates[1];
    }

    if (Object.keys(updates).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    // Update beacon
    const { data: beacon, error: updateError } = await supabase
      .from('beacons')
      .update(updates)
      .eq('id', beaconId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update error:', updateError);
      return c.json({ error: 'Failed to update beacon', details: updateError.message }, 500);
    }

    console.log(`✅ Updated beacon ${beaconId}:`, updates);

    return c.json({
      success: true,
      beacon,
      message: 'Beacon updated successfully'
    });
  } catch (error) {
    console.error('❌ Update location error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// ============================================================================
// DELETE /earth/locations/:id - Delete location (ADMIN ONLY)
// Soft delete - sets active = false
// ============================================================================
app.delete('/make-server-a670c824/earth/locations/:id', async (c) => {
  try {
    const beaconId = c.req.param('id');

    // Auth check
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    // Soft delete (set active = false)
    const { data: beacon, error: deleteError } = await supabase
      .from('beacons')
      .update({ active: false })
      .eq('id', beaconId)
      .select()
      .single();

    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
      return c.json({ error: 'Failed to delete beacon', details: deleteError.message }, 500);
    }

    console.log(`✅ Deleted beacon ${beaconId}`);

    return c.json({
      success: true,
      message: 'Beacon deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete location error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// ============================================================================
// GET /earth/stats - Global statistics for globe
// ============================================================================
app.get('/make-server-a670c824/earth/stats', async (c) => {
  try {
    // Get total beacons by country
    const { data: beaconsByCountry, error: countryError } = await supabase
      .from('beacons')
      .select('country, scan_count')
      .eq('active', true);

    if (countryError) {
      console.error('❌ Stats error:', countryError);
      return c.json({ error: 'Failed to fetch stats' }, 500);
    }

    // Aggregate by country
    const countryStats = beaconsByCountry.reduce((acc, beacon) => {
      if (!acc[beacon.country]) {
        acc[beacon.country] = { country: beacon.country, beacons: 0, scans: 0 };
      }
      acc[beacon.country].beacons++;
      acc[beacon.country].scans += beacon.scan_count || 0;
      return acc;
    }, {} as Record<string, any>);

    // Get total scans
    const { data: totalScansData, error: scansError } = await supabase
      .from('scans')
      .select('id', { count: 'exact', head: true });

    const totalScans = totalScansData || 0;

    // Get active users (scanned in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: activeUsersData, error: usersError } = await supabase
      .from('scans')
      .select('user_id')
      .gte('scanned_at', sevenDaysAgo.toISOString());

    const activeUsers = new Set(activeUsersData?.map(s => s.user_id) || []).size;

    return c.json({
      global: {
        totalBeacons: beaconsByCountry.length,
        totalCountries: Object.keys(countryStats).length,
        totalScans,
        activeUsers
      },
      byCountry: Object.values(countryStats).sort((a: any, b: any) => b.scans - a.scans)
    });
  } catch (error) {
    console.error('❌ Stats error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
