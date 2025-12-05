import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const earth = new Hono();

interface CustomLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  notes?: string;
  createdAt: string;
  color?: string;
}

// GET all locations
earth.get('/locations', async (c) => {
  try {
    const locations = await kv.getByPrefix('earth:location:');
    
    return c.json({
      locations: locations.map((loc) => loc.value),
      count: locations.length,
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return c.json({ error: 'Failed to fetch locations' }, 500);
  }
});

// GET single location
earth.get('/locations/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const location = await kv.get(`earth:location:${id}`);
    
    if (!location) {
      return c.json({ error: 'Location not found' }, 404);
    }
    
    return c.json({ location });
  } catch (error) {
    console.error('Error fetching location:', error);
    return c.json({ error: 'Failed to fetch location' }, 500);
  }
});

// POST create location
earth.post('/locations', async (c) => {
  try {
    const body = await c.req.json();
    const { name, address, lat, lng, notes, color } = body;

    if (!name || !address || lat === undefined || lng === undefined) {
      return c.json({ error: 'Missing required fields: name, address, lat, lng' }, 400);
    }

    const id = `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const location: CustomLocation = {
      id,
      name,
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      notes: notes || '',
      color: color || '#FF1744',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`earth:location:${id}`, location);

    return c.json({ location, message: 'Location created successfully' }, 201);
  } catch (error) {
    console.error('Error creating location:', error);
    return c.json({ error: 'Failed to create location' }, 500);
  }
});

// PUT update location
earth.put('/locations/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { name, address, lat, lng, notes, color } = body;

    const existing = await kv.get(`earth:location:${id}`);
    if (!existing) {
      return c.json({ error: 'Location not found' }, 404);
    }

    const location: CustomLocation = {
      ...(existing as CustomLocation),
      name: name || (existing as CustomLocation).name,
      address: address || (existing as CustomLocation).address,
      lat: lat !== undefined ? parseFloat(lat) : (existing as CustomLocation).lat,
      lng: lng !== undefined ? parseFloat(lng) : (existing as CustomLocation).lng,
      notes: notes !== undefined ? notes : (existing as CustomLocation).notes,
      color: color || (existing as CustomLocation).color,
    };

    await kv.set(`earth:location:${id}`, location);

    return c.json({ location, message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    return c.json({ error: 'Failed to update location' }, 500);
  }
});

// DELETE location
earth.delete('/locations/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const existing = await kv.get(`earth:location:${id}`);
    if (!existing) {
      return c.json({ error: 'Location not found' }, 404);
    }

    await kv.del(`earth:location:${id}`);

    return c.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    return c.json({ error: 'Failed to delete location' }, 500);
  }
});

// GET beacons with geo data for map visualization
earth.get('/beacons', async (c) => {
  try {
    // Get all beacons from KV store
    const beaconData = await kv.getByPrefix('beacon:');
    
    // Filter and format beacons with geo data
    const beacons = beaconData
      .map((item) => item.value)
      .filter((beacon: any) => beacon.lat && beacon.lng)
      .map((beacon: any) => ({
        id: beacon.id,
        code: beacon.code,
        title: beacon.title,
        kind: beacon.kind,
        lat: beacon.lat,
        lng: beacon.lng,
        city: beacon.city,
        active: beacon.active,
        scans: beacon.stats?.totalScans || 0,
        intensity: Math.min((beacon.stats?.totalScans || 0) / 100, 1),
      }));
    
    return c.json({
      beacons,
      count: beacons.length,
    });
  } catch (error) {
    console.error('Error fetching beacons for Earth view:', error);
    return c.json({ error: 'Failed to fetch beacons', beacons: [] }, 500);
  }
});

export default earth;