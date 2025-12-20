/**
 * BEACON ENDPOINTS
 * Handles beacon scanning, creation, and management
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

/**
 * GET /beacons - List all beacons
 */
app.get('/', async (c) => {
  try {
    const { status, ownerType, city } = c.req.query();
    
    // Get beacons from KV store
    const beaconsData = await kv.getByPrefix('beacon:');
    const beacons = beaconsData.map(item => item.value);
    
    // Filter beacons
    let filtered = beacons;
    if (status) {
      filtered = filtered.filter((b: any) => b.status === status);
    }
    if (ownerType) {
      filtered = filtered.filter((b: any) => b.ownerType === ownerType);
    }
    if (city) {
      filtered = filtered.filter((b: any) => b.location?.city === city);
    }
    
    return c.json({ beacons: filtered });
  } catch (error) {
    console.error('Error fetching beacons:', error);
    return c.json({ error: 'Failed to fetch beacons' }, 500);
  }
});

/**
 * GET /beacons/:code - Get beacon by code
 */
app.get('/:code', async (c) => {
  try {
    const code = c.req.param('code');
    const beacon = await kv.get(`beacon:${code.toLowerCase()}`);
    
    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }
    
    return c.json({ beacon });
  } catch (error) {
    console.error('Error fetching beacon:', error);
    return c.json({ error: 'Failed to fetch beacon' }, 500);
  }
});

/**
 * POST /beacons - Create new beacon
 */
app.post('/', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const {
      code,
      type,
      name,
      description,
      imageUrl,
      targetId,
      targetType,
      targetUrl,
      xpReward,
      xpBonusMultiplier,
      scanLimit,
      location,
      activeFrom,
      activeUntil,
      requiresMembership,
      requiredTier,
    } = body;
    
    // Validate required fields
    if (!code || !type || !name || !xpReward) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Check if code already exists
    const existing = await kv.get(`beacon:${code.toLowerCase()}`);
    if (existing) {
      return c.json({ error: 'Beacon code already exists' }, 409);
    }
    
    const beacon = {
      id: crypto.randomUUID(),
      code,
      type,
      status: 'active',
      name,
      description,
      imageUrl,
      ownerId: user.id,
      ownerType: 'user',
      targetId,
      targetType,
      targetUrl,
      xpReward,
      xpBonusMultiplier: xpBonusMultiplier || 1.0,
      scanLimit,
      scanCount: 0,
      location,
      activeFrom: activeFrom ? new Date(activeFrom) : undefined,
      activeUntil: activeUntil ? new Date(activeUntil) : undefined,
      requiresMembership: requiresMembership || false,
      requiredTier,
      ageRestriction: 18,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store beacon
    await kv.set(`beacon:${code.toLowerCase()}`, beacon);
    
    // Also store by ID for quick lookup
    await kv.set(`beacon:id:${beacon.id}`, beacon);
    
    return c.json({ beacon }, 201);
  } catch (error) {
    console.error('Error creating beacon:', error);
    return c.json({ error: 'Failed to create beacon' }, 500);
  }
});

/**
 * POST /beacons/:code/scan - Scan a beacon
 */
app.post('/:code/scan', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const code = c.req.param('code');
    const body = await c.req.json();
    const { location, userAgent } = body;
    
    // Get beacon
    const beacon = await kv.get(`beacon:${code.toLowerCase()}`);
    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }
    
    // Check if beacon is active
    const now = new Date();
    if (beacon.status !== 'active') {
      return c.json({ error: 'Beacon is not active' }, 400);
    }
    if (beacon.activeFrom && now < new Date(beacon.activeFrom)) {
      return c.json({ error: 'Beacon not yet active' }, 400);
    }
    if (beacon.activeUntil && now > new Date(beacon.activeUntil)) {
      return c.json({ error: 'Beacon has expired' }, 400);
    }
    if (beacon.scanLimit && beacon.scanCount >= beacon.scanLimit) {
      return c.json({ error: 'Beacon scan limit reached' }, 400);
    }
    
    // Get user's membership tier and calculate XP
    const userProfile = await kv.get(`user:${user.id}:profile`);
    const membershipTier = userProfile?.membershipTier || 'free';
    const multipliers = { free: 1, member: 2, plus: 3, pro: 5 };
    const userMultiplier = multipliers[membershipTier as keyof typeof multipliers];
    
    // Check scan limits for free/member tiers
    if (membershipTier === 'free' || membershipTier === 'member') {
      const scanLimits = { free: 10, member: 100 };
      const limit = scanLimits[membershipTier as keyof typeof scanLimits];
      
      // Get scans this month
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const scansThisMonth = await kv.get(`user:${user.id}:scans:${monthKey}`) || 0;
      
      if (scansThisMonth >= limit) {
        return c.json({ 
          error: 'Monthly scan limit reached',
          details: `Upgrade to PLUS for unlimited scans`,
          limit,
          used: scansThisMonth,
        }, 403);
      }
      
      // Increment monthly scan count
      await kv.set(`user:${user.id}:scans:${monthKey}`, scansThisMonth + 1);
    }
    
    const baseXP = beacon.xpReward;
    const bonusMultiplier = beacon.xpBonusMultiplier || 1.0;
    const xpAwarded = Math.round(baseXP * bonusMultiplier * userMultiplier);
    
    // Record scan
    const scan = {
      id: crypto.randomUUID(),
      beaconId: beacon.id,
      beaconCode: beacon.code,
      userId: user.id,
      scannedAt: new Date(),
      location,
      userAgent,
      xpAwarded,
      xpMultiplier: userMultiplier,
    };
    
    // Store scan
    await kv.set(`scan:${scan.id}`, scan);
    
    // Update beacon scan count
    beacon.scanCount++;
    beacon.lastScannedAt = new Date();
    beacon.updatedAt = new Date();
    await kv.set(`beacon:${code.toLowerCase()}`, beacon);
    await kv.set(`beacon:id:${beacon.id}`, beacon);
    
    // Award XP
    const xpEntry = {
      id: crypto.randomUUID(),
      userId: user.id,
      amount: xpAwarded,
      source: 'beacon-scan',
      sourceId: beacon.id,
      multiplier: userMultiplier,
      membershipTier,
      timestamp: new Date(),
      metadata: {
        beaconCode: beacon.code,
        beaconName: beacon.name,
        beaconType: beacon.type,
      },
    };
    
    await kv.set(`xp:${xpEntry.id}`, xpEntry);
    
    // Update user's total XP
    const userXP = await kv.get(`user:${user.id}:xp`) || {
      userId: user.id,
      totalXP: 0,
      availableXP: 0,
      membershipTier,
      currentMultiplier: userMultiplier,
      level: 1,
      rewardsRedeemed: 0,
      streakDays: 1,
      lastActivityAt: new Date(),
    };
    
    userXP.totalXP += xpAwarded;
    userXP.availableXP += xpAwarded;
    userXP.level = Math.floor(Math.sqrt(userXP.totalXP / 100));
    userXP.lastActivityAt = new Date();
    
    await kv.set(`user:${user.id}:xp`, userXP);
    
    // Return scan result with routing info
    return c.json({
      success: true,
      scan,
      beacon,
      xpAwarded,
      userXP,
      route: getBeaconRoute(beacon),
    }, 201);
  } catch (error) {
    console.error('Error scanning beacon:', error);
    return c.json({ error: 'Failed to scan beacon' }, 500);
  }
});

/**
 * PATCH /beacons/:code - Update beacon
 */
app.patch('/:code', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const code = c.req.param('code');
    const beacon = await kv.get(`beacon:${code.toLowerCase()}`);
    
    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }
    
    // Check ownership
    if (beacon.ownerId !== user.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    
    const updates = await c.req.json();
    const updated = {
      ...beacon,
      ...updates,
      updatedAt: new Date(),
    };
    
    await kv.set(`beacon:${code.toLowerCase()}`, updated);
    await kv.set(`beacon:id:${beacon.id}`, updated);
    
    return c.json({ beacon: updated });
  } catch (error) {
    console.error('Error updating beacon:', error);
    return c.json({ error: 'Failed to update beacon' }, 500);
  }
});

/**
 * DELETE /beacons/:code - Delete beacon
 */
app.delete('/:code', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const code = c.req.param('code');
    const beacon = await kv.get(`beacon:${code.toLowerCase()}`);
    
    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }
    
    // Check ownership
    if (beacon.ownerId !== user.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    
    await kv.del(`beacon:${code.toLowerCase()}`);
    await kv.del(`beacon:id:${beacon.id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting beacon:', error);
    return c.json({ error: 'Failed to delete beacon' }, 500);
  }
});

/**
 * Helper: Get beacon route
 */
function getBeaconRoute(beacon: any) {
  switch (beacon.type) {
    case 'checkin':
      return { type: 'modal', destination: 'checkin-success' };
    case 'event':
      return { type: 'page', destination: 'tickets', params: { eventId: beacon.targetId } };
    case 'ticket':
      return { type: 'page', destination: 'ticketsBeacon', params: { beaconId: beacon.id } };
    case 'product':
      return { type: 'page', destination: 'shopProduct', params: { slug: beacon.targetId } };
    case 'drop':
      return { type: 'page', destination: 'drops', params: { dropId: beacon.targetId } };
    case 'music':
      return { type: 'page', destination: 'recordsRelease', params: { slug: beacon.targetId } };
    case 'quest':
      return { type: 'page', destination: 'xpProfile', params: { tab: 'quests' } };
    case 'scan-to-join':
      return { type: 'external', destination: beacon.targetUrl };
    default:
      return { type: 'modal', destination: 'beacon-success' };
  }
}

export default app;
