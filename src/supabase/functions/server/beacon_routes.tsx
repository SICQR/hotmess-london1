/**
 * BEACON SYSTEM ROUTES
 * Backend endpoints for beacon scanning, XP rewards, and gamification
 * Powers the core check-in and XP system
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
// POST /beacons/:id/scan - Scan beacon and award XP
// Body: { userId: string, timestamp?: string, location?: { lat, lng } }
// ============================================================================
app.post('/make-server-a670c824/beacons/:id/scan', async (c) => {
  try {
    const beaconId = c.req.param('id');
    const { userId, timestamp, location } = await c.req.json();

    // Validate inputs
    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    console.log(`📍 Beacon scan request: User ${userId} → Beacon ${beaconId}`);

    // 1. Check if beacon exists and is active
    const { data: beacon, error: beaconError } = await supabase
      .from('beacons')
      .select('*')
      .eq('id', beaconId)
      .single();

    if (beaconError || !beacon) {
      console.error('❌ Beacon not found:', beaconId);
      return c.json({ 
        error: 'Beacon not found',
        beaconId 
      }, 404);
    }

    if (!beacon.active) {
      return c.json({ 
        error: 'Beacon is inactive',
        beaconId 
      }, 403);
    }

    // 2. Check if user already scanned this beacon today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingScan, error: scanCheckError } = await supabase
      .from('scans')
      .select('id, scanned_at')
      .eq('beacon_id', beaconId)
      .eq('user_id', userId)
      .gte('scanned_at', `${today}T00:00:00Z`)
      .maybeSingle();

    if (scanCheckError) {
      console.error('❌ Scan check error:', scanCheckError);
    }

    if (existingScan) {
      const nextScanTime = new Date(existingScan.scanned_at);
      nextScanTime.setDate(nextScanTime.getDate() + 1);
      
      console.log(`⚠️ Already scanned today: ${userId} → ${beaconId}`);
      
      return c.json({ 
        error: 'Already scanned today',
        message: 'You can scan this beacon once per day',
        nextScanAvailable: nextScanTime.toISOString(),
        lastScan: existingScan.scanned_at
      }, 409);
    }

    // 3. Calculate XP reward based on beacon tier
    const xpRewards: Record<string, number> = {
      'free': 10,
      'starter': 15,
      'pro': 20,
      'elite': 30
    };
    const xpAwarded = xpRewards[beacon.tier || 'free'] || 10;

    // 4. Record the scan
    const scanTimestamp = timestamp || new Date().toISOString();
    const { data: scan, error: insertError } = await supabase
      .from('scans')
      .insert({
        beacon_id: beaconId,
        user_id: userId,
        scanned_at: scanTimestamp,
        xp_awarded: xpAwarded,
        location_lat: location?.lat || null,
        location_lng: location?.lng || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Failed to record scan:', insertError);
      return c.json({ 
        error: 'Failed to record scan',
        details: insertError.message 
      }, 500);
    }

    // 5. Update beacon scan count
    const { error: beaconUpdateError } = await supabase
      .from('beacons')
      .update({ 
        scan_count: (beacon.scan_count || 0) + 1,
        last_scanned_at: scanTimestamp
      })
      .eq('id', beaconId);

    if (beaconUpdateError) {
      console.error('⚠️ Failed to update beacon count:', beaconUpdateError);
    }

    // 6. Award XP to user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp, level, streak_count, last_scan_date')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('⚠️ Failed to get user profile:', profileError);
    }

    const currentXp = profile?.xp || 0;
    const newXp = currentXp + xpAwarded;
    const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level

    // Check streak
    const lastScanDate = profile?.last_scan_date ? new Date(profile.last_scan_date) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let newStreak = profile?.streak_count || 0;
    if (lastScanDate) {
      const lastScanStr = lastScanDate.toISOString().split('T')[0];
      if (lastScanStr === yesterdayStr) {
        // Scanned yesterday, continue streak
        newStreak += 1;
      } else if (lastScanStr !== today) {
        // Missed a day, reset streak
        newStreak = 1;
      }
      // If lastScanStr === today, keep current streak (already scanned today)
    } else {
      // First scan ever
      newStreak = 1;
    }

    const { error: xpUpdateError } = await supabase
      .from('profiles')
      .update({
        xp: newXp,
        level: newLevel,
        streak_count: newStreak,
        last_scan_date: today
      })
      .eq('id', userId);

    if (xpUpdateError) {
      console.error('⚠️ Failed to update user XP:', xpUpdateError);
    }

    console.log(`✅ Scan recorded: ${beacon.name} → +${xpAwarded} XP (Level ${newLevel}, Streak ${newStreak})`);

    // 7. Trigger Make.com webhook for rewards/notifications
    const makeWebhook = Deno.env.get('MAKE_WEBHOOK_BEACON_SCAN');
    if (makeWebhook) {
      fetch(makeWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          beaconId,
          beaconName: beacon.name,
          xpAwarded,
          newXp,
          newLevel,
          streak: newStreak,
          timestamp: scanTimestamp,
          city: beacon.city,
          country: beacon.country
        })
      }).catch(err => console.error('⚠️ Make.com webhook failed:', err));
    }

    // 8. Check for achievements
    const achievements = [];
    if (newStreak === 7) achievements.push('Week Warrior');
    if (newStreak === 30) achievements.push('Monthly Master');
    if (newLevel === 10) achievements.push('Rising Star');
    if (newLevel === 50) achievements.push('Nightlife Legend');

    return c.json({
      success: true,
      scan,
      rewards: {
        xpAwarded,
        totalXp: newXp,
        level: newLevel,
        levelUp: newLevel > (profile?.level || 1),
        streak: newStreak,
        achievements
      },
      beacon: {
        id: beacon.id,
        name: beacon.name,
        city: beacon.city,
        country: beacon.country,
        totalScans: (beacon.scan_count || 0) + 1
      },
      message: `+${xpAwarded} XP! You're now level ${newLevel} 🔥`
    }, 201);

  } catch (error) {
    console.error('❌ Beacon scan error:', error);
    return c.json({ 
      error: 'Failed to process scan',
      details: error.message 
    }, 500);
  }
});

// ============================================================================
// GET /beacons/nearby - Get beacons near user's location
// Query params: lat, lng, radius (meters, default 5000)
// ============================================================================
app.get('/make-server-a670c824/beacons/nearby', async (c) => {
  try {
    const lat = parseFloat(c.req.query('lat') || '0');
    const lng = parseFloat(c.req.query('lng') || '0');
    const radius = parseInt(c.req.query('radius') || '5000'); // meters

    if (!lat || !lng) {
      return c.json({ 
        error: 'Missing location parameters',
        required: ['lat', 'lng']
      }, 400);
    }

    console.log(`🗺️ Finding beacons near [${lat}, ${lng}] within ${radius}m`);

    // Use PostGIS function to find nearby beacons
    const { data: beacons, error } = await supabase
      .rpc('get_nearby_beacons', {
        user_lat: lat,
        user_lng: lng,
        radius_meters: radius
      });

    if (error) {
      console.error('❌ Nearby beacons error:', error);
      return c.json({ 
        error: 'Failed to find nearby beacons',
        details: error.message 
      }, 500);
    }

    console.log(`✅ Found ${beacons.length} beacons nearby`);

    return c.json({
      beacons,
      count: beacons.length,
      location: { lat, lng },
      radius
    });

  } catch (error) {
    console.error('❌ Nearby beacons error:', error);
    return c.json({ 
      error: 'Failed to find beacons',
      details: error.message 
    }, 500);
  }
});

// ============================================================================
// GET /beacons/:id - Get beacon details
// ============================================================================
app.get('/make-server-a670c824/beacons/:id', async (c) => {
  try {
    const beaconId = c.req.param('id');

    const { data: beacon, error } = await supabase
      .from('beacons')
      .select(`
        *,
        scans (
          id,
          scanned_at,
          user_id
        )
      `)
      .eq('id', beaconId)
      .single();

    if (error || !beacon) {
      console.error('❌ Beacon not found:', beaconId);
      return c.json({ error: 'Beacon not found' }, 404);
    }

    // Get recent scans
    const { data: recentScans } = await supabase
      .from('scans')
      .select('scanned_at, user_id')
      .eq('beacon_id', beaconId)
      .order('scanned_at', { ascending: false })
      .limit(10);

    return c.json({
      beacon,
      recentScans: recentScans || [],
      stats: {
        totalScans: beacon.scan_count || 0,
        lastScanned: beacon.last_scanned_at,
        active: beacon.active
      }
    });

  } catch (error) {
    console.error('❌ Get beacon error:', error);
    return c.json({ error: 'Failed to get beacon' }, 500);
  }
});

// ============================================================================
// GET /beacons/:id/stats - Get beacon statistics
// ============================================================================
app.get('/make-server-a670c824/beacons/:id/stats', async (c) => {
  try {
    const beaconId = c.req.param('id');
    const days = parseInt(c.req.query('days') || '30');

    // Get beacon
    const { data: beacon, error: beaconError } = await supabase
      .from('beacons')
      .select('*')
      .eq('id', beaconId)
      .single();

    if (beaconError || !beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }

    // Get scans for time period
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const { data: scans, error: scansError } = await supabase
      .from('scans')
      .select('scanned_at, xp_awarded, user_id')
      .eq('beacon_id', beaconId)
      .gte('scanned_at', sinceDate.toISOString());

    if (scansError) {
      console.error('❌ Scans query error:', scansError);
      return c.json({ error: 'Failed to get stats' }, 500);
    }

    // Calculate stats
    const uniqueUsers = new Set(scans.map(s => s.user_id)).size;
    const totalXpAwarded = scans.reduce((sum, s) => sum + (s.xp_awarded || 0), 0);

    // Group by day
    const scansByDay = scans.reduce((acc, scan) => {
      const day = scan.scanned_at.split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return c.json({
      beacon: {
        id: beacon.id,
        name: beacon.name,
        city: beacon.city
      },
      period: {
        days,
        from: sinceDate.toISOString(),
        to: new Date().toISOString()
      },
      stats: {
        totalScans: scans.length,
        uniqueUsers,
        totalXpAwarded,
        averageScansPerDay: scans.length / days,
        scansByDay
      }
    });

  } catch (error) {
    console.error('❌ Beacon stats error:', error);
    return c.json({ error: 'Failed to get stats' }, 500);
  }
});

// ============================================================================
// GET /users/:userId/scans - Get user's scan history
// ============================================================================
app.get('/make-server-a670c824/users/:userId/scans', async (c) => {
  try {
    const userId = c.req.param('userId');
    const limit = parseInt(c.req.query('limit') || '50');

    // Verify user is requesting their own data or is admin
    const authHeader = c.req.header('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user && user.id !== userId) {
        // Check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile?.role !== 'admin') {
          return c.json({ error: 'Forbidden - Can only view your own scans' }, 403);
        }
      }
    }

    const { data: scans, error } = await supabase
      .from('scans')
      .select(`
        *,
        beacons (
          id,
          name,
          venue_type,
          city,
          country,
          location_lat,
          location_lng
        )
      `)
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ User scans error:', error);
      return c.json({ error: 'Failed to get scans' }, 500);
    }

    // Calculate stats
    const totalXp = scans.reduce((sum, s) => sum + (s.xp_awarded || 0), 0);
    const uniqueBeacons = new Set(scans.map(s => s.beacon_id)).size;
    const uniqueCities = new Set(scans.map(s => s.beacons?.city).filter(Boolean)).size;
    const uniqueCountries = new Set(scans.map(s => s.beacons?.country).filter(Boolean)).size;

    return c.json({
      scans,
      count: scans.length,
      stats: {
        totalScans: scans.length,
        totalXp,
        uniqueBeacons,
        uniqueCities,
        uniqueCountries
      }
    });

  } catch (error) {
    console.error('❌ User scans error:', error);
    return c.json({ error: 'Failed to get scans' }, 500);
  }
});

// ============================================================================
// POST /beacons/:id/verify - Admin verification of beacon scan
// Body: { scanId: string, verified: boolean }
// ============================================================================
app.post('/make-server-a670c824/beacons/:id/verify', async (c) => {
  try {
    const beaconId = c.req.param('id');
    const { scanId, verified } = await c.req.json();

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

    // Update scan verification
    const { data: scan, error: updateError } = await supabase
      .from('scans')
      .update({ 
        verified,
        verified_by: user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', scanId)
      .eq('beacon_id', beaconId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Verification error:', updateError);
      return c.json({ error: 'Failed to verify scan' }, 500);
    }

    console.log(`✅ Scan ${scanId} verification: ${verified}`);

    return c.json({
      success: true,
      scan,
      message: verified ? 'Scan verified' : 'Scan flagged'
    });

  } catch (error) {
    console.error('❌ Verification error:', error);
    return c.json({ error: 'Failed to verify scan' }, 500);
  }
});

export default app;
