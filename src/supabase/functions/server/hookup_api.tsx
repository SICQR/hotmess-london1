/**
 * HOOKUP / CHAT BEACON API
 * Handles consent-first hookup connections via QR/beacons
 * Two modes: room-based (group vibes) and 1:1 (direct connection)
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import telegramBot from './telegram_bot.tsx';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

/**
 * POST /hookup/beacon/create
 * Create a hookup beacon (room or 1:1)
 */
app.post('/beacon/create', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const {
      mode, // 'room' | '1to1'
      name,
      description,
      city,
      venue,
      zone, // e.g., 'basement', 'darkroom', 'main-floor'
      telegram_room_id, // for room mode
      target_user_id, // for 1to1 mode
      active_from,
      active_until,
      max_connections_per_hour, // rate limit for 1to1
      membership_required, // 'free' | 'pro' | 'elite'
    } = body;

    // Validation
    if (!mode || !name || !city) {
      return c.json({ error: 'Missing required fields: mode, name, city' }, 400);
    }

    if (mode === 'room' && !telegram_room_id) {
      return c.json({ error: 'telegram_room_id required for room mode' }, 400);
    }

    if (mode === '1to1' && !target_user_id) {
      return c.json({ error: 'target_user_id required for 1to1 mode' }, 400);
    }

    // Generate beacon code
    const beaconId = `hookup_${mode}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const beacon = {
      id: beaconId,
      type: 'hookup',
      mode,
      creator_id: user.id,
      name,
      description,
      city,
      venue: venue || null,
      zone: zone || null,
      telegram_room_id: telegram_room_id || null,
      target_user_id: target_user_id || null,
      active_from: active_from || new Date().toISOString(),
      active_until: active_until || null,
      max_connections_per_hour: max_connections_per_hour || 10,
      membership_required: membership_required || 'free',
      total_scans: 0,
      total_connections: 0,
      status: 'active',
      is_hookup: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(`beacon:${beaconId}`, beacon);
    await kv.set(`beacon_by_user:${user.id}:${beaconId}`, beacon);

    // Award XP for creating beacon
    const currentXP = await kv.get(`xp:${user.id}`) || { total: 0 };
    const xpReward = mode === '1to1' ? 50 : 100; // More XP for creating room-based
    await kv.set(`xp:${user.id}`, {
      ...currentXP,
      total: (currentXP.total || 0) + xpReward,
    });

    return c.json({
      success: true,
      beacon,
      xp_earned: xpReward,
      qr_url: `https://hotmessldn.com/?route=hookupScan&code=${beaconId}`,
    });
  } catch (error) {
    console.error('Error creating hookup beacon:', error);
    return c.json({ error: 'Failed to create beacon' }, 500);
  }
});

/**
 * GET /hookup/beacon/:beaconId
 * Get hookup beacon details
 */
app.get('/beacon/:beaconId', async (c) => {
  try {
    const beaconId = c.req.param('beaconId');
    const beacon = await kv.get(`beacon:${beaconId}`);

    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }

    // Increment view count
    beacon.total_scans = (beacon.total_scans || 0) + 1;
    beacon.updated_at = new Date().toISOString();
    await kv.set(`beacon:${beaconId}`, beacon);

    // Don't expose sensitive data for 1to1 beacons
    if (beacon.mode === '1to1') {
      // Get target user info
      const targetUser = await kv.get(`user_profile:${beacon.target_user_id}`);
      return c.json({
        beacon: {
          id: beacon.id,
          type: beacon.type,
          mode: beacon.mode,
          name: beacon.name,
          description: beacon.description,
          city: beacon.city,
          venue: beacon.venue,
          zone: beacon.zone,
          target_username: targetUser?.username || 'User',
          target_avatar: targetUser?.avatar_url || null,
          membership_required: beacon.membership_required,
          status: beacon.status,
        },
      });
    }

    return c.json({ beacon });
  } catch (error) {
    console.error('Error fetching hookup beacon:', error);
    return c.json({ error: 'Failed to fetch beacon' }, 500);
  }
});

/**
 * POST /hookup/scan
 * Scan a hookup beacon and get routing instructions
 */
app.post('/scan', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(accessToken);

    const body = await c.req.json();
    const { beacon_id, consent_confirmed } = body;

    if (!beacon_id) {
      return c.json({ error: 'beacon_id required' }, 400);
    }

    const beacon = await kv.get(`beacon:${beacon_id}`);

    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }

    if (beacon.status !== 'active') {
      return c.json({ error: 'Beacon is not active' }, 400);
    }

    // Check time bounds
    if (beacon.active_from && new Date(beacon.active_from) > new Date()) {
      return c.json({ error: 'Beacon not yet active' }, 400);
    }

    if (beacon.active_until && new Date(beacon.active_until) < new Date()) {
      return c.json({ error: 'Beacon has expired' }, 400);
    }

    // Check membership requirement
    if (user && beacon.membership_required !== 'free') {
      const membership = await kv.get(`membership:${user.id}`);
      const tierOrder = ['free', 'pro', 'elite'];
      const userTier = membership?.tier || 'free';
      const requiredTier = beacon.membership_required;

      if (tierOrder.indexOf(userTier) < tierOrder.indexOf(requiredTier)) {
        return c.json({
          error: 'Membership upgrade required',
          required_tier: requiredTier,
          current_tier: userTier,
        }, 403);
      }
    }

    // Check rate limiting for 1to1
    if (beacon.mode === '1to1' && user) {
      const rateLimitKey = `hookup_rate:${beacon_id}:${new Date().toISOString().split('T')[0]}`;
      const rateLimitData = await kv.get(rateLimitKey) || { count: 0 };

      if (rateLimitData.count >= (beacon.max_connections_per_hour || 10)) {
        return c.json({ error: 'Connection limit reached for this hour' }, 429);
      }
    }

    // If consent not confirmed, return consent flow
    if (!consent_confirmed) {
      return c.json({
        requires_consent: true,
        consent_message: beacon.mode === '1to1'
          ? `You're connecting with a member on HOTMESS. Before you continue:\n\n✓ I'm clear-minded and sober\n✓ I've thought about what I want\n✓ I'm okay to stop if it doesn't feel right\n✓ I won't screenshot or share without consent`
          : `You're entering a hook-up zone. Remember:\n\n✓ Respect boundaries and consent\n✓ No screenshots without permission\n✓ What happens here stays here\n✓ You can leave anytime`,
        beacon_info: {
          mode: beacon.mode,
          name: beacon.name,
          description: beacon.description,
          city: beacon.city,
          venue: beacon.venue,
          zone: beacon.zone,
        },
      });
    }

    // Consent confirmed - proceed with connection
    if (beacon.mode === 'room') {
      // Room-based: return Telegram room link
      const roomLink = `https://t.me/${beacon.telegram_room_id}`;

      // Award XP
      if (user) {
        const currentXP = await kv.get(`xp:${user.id}`) || { total: 0 };
        const xpReward = 15;
        await kv.set(`xp:${user.id}`, {
          ...currentXP,
          total: (currentXP.total || 0) + xpReward,
        });

        // Track connection
        const connectionId = `hookup_connection:${user.id}:${beacon_id}:${Date.now()}`;
        await kv.set(connectionId, {
          user_id: user.id,
          beacon_id: beacon_id,
          type: 'room',
          timestamp: new Date().toISOString(),
        });

        // Send Telegram notification to user (if they have Telegram connected)
        const userProfile = await kv.get(`user_profile:${user.id}`);
        if (userProfile?.telegram) {
          try {
            await telegramBot.notifyHookupConnection(userProfile.telegram, {
              type: 'room',
              beaconName: beacon.name,
              roomLink,
            });
          } catch (error) {
            console.error('Failed to send Telegram notification:', error);
            // Continue anyway - notification is not critical
          }
        }
      }

      // Increment connection count
      beacon.total_connections = (beacon.total_connections || 0) + 1;
      await kv.set(`beacon:${beacon_id}`, beacon);

      return c.json({
        success: true,
        mode: 'room',
        room_link: roomLink,
        room_id: beacon.telegram_room_id,
        xp_earned: user ? 15 : 0,
        message: `Welcome to ${beacon.name}. Check in with yourself. Stay safe. 🖤`,
        bot_notified: !!user,
      });
    }

    if (beacon.mode === '1to1') {
      // 1:1: create connection thread or return bot DM link
      if (!user) {
        return c.json({ error: 'Must be logged in for 1:1 connections' }, 401);
      }

      // Create connection record
      const connectionId = `hookup_connection:${user.id}:${beacon.target_user_id}:${Date.now()}`;
      await kv.set(connectionId, {
        scanner_id: user.id,
        target_id: beacon.target_user_id,
        beacon_id: beacon_id,
        type: '1to1',
        status: 'initiated',
        timestamp: new Date().toISOString(),
      });

      // Update rate limit
      const rateLimitKey = `hookup_rate:${beacon_id}:${new Date().toISOString().split('T')[0]}`;
      const rateLimitData = await kv.get(rateLimitKey) || { count: 0 };
      await kv.set(rateLimitKey, { count: rateLimitData.count + 1 });

      // Award XP
      const currentXP = await kv.get(`xp:${user.id}`) || { total: 0 };
      const xpReward = 10;
      await kv.set(`xp:${user.id}`, {
        ...currentXP,
        total: (currentXP.total || 0) + xpReward,
      });

      // Increment connection count
      beacon.total_connections = (beacon.total_connections || 0) + 1;
      await kv.set(`beacon:${beacon_id}`, beacon);

      // Send Telegram notifications to both users
      let notificationsSent = { scanner: false, target: false };

      // Notify scanner
      const scannerProfile = await kv.get(`user_profile:${user.id}`);
      if (scannerProfile?.telegram) {
        try {
          await telegramBot.sendMessage(
            scannerProfile.telegram,
            `🔥 *Connection Initiated*\n\nYou're connecting via *${beacon.name}*.\n\nWaiting for the other person to accept.\n\nConnection ID: \`${connectionId}\``,
            { parse_mode: 'Markdown' }
          );
          notificationsSent.scanner = true;
        } catch (error) {
          console.error('Failed to notify scanner:', error);
        }
      }

      // Notify target user
      const targetProfile = await kv.get(`user_profile:${beacon.target_user_id}`);
      if (targetProfile?.telegram) {
        try {
          await telegramBot.notifyHookupConnection(targetProfile.telegram, {
            type: '1to1',
            beaconName: beacon.name,
            fromUser: scannerProfile?.displayName || 'Someone',
            connectionId,
          });
          notificationsSent.target = true;
        } catch (error) {
          console.error('Failed to notify target:', error);
        }
      }

      return c.json({
        success: true,
        mode: '1to1',
        connection_id: connectionId,
        bot_message: notificationsSent.target
          ? `Connection request sent! They'll be notified via Telegram.`
          : `Connection created. Make sure both users have Telegram connected to receive notifications.`,
        xp_earned: 10,
        notifications_sent: notificationsSent,
        next_steps: [
          'Target user receives Telegram notification',
          'They can accept or decline',
          'If accepted, private thread is created',
          'Chat opens with safety reminder',
        ],
      });
    }

    return c.json({ error: 'Invalid beacon mode' }, 400);
  } catch (error) {
    console.error('Error scanning hookup beacon:', error);
    return c.json({ error: 'Failed to process scan' }, 500);
  }
});

/**
 * GET /hookup/nearby
 * Get nearby hookup zones (room-based only, for map)
 */
app.get('/nearby', async (c) => {
  try {
    const { city, lat, lng, radius = 1000 } = c.req.query();

    const allBeacons = await kv.getByPrefix('beacon:');
    const hookupBeacons = allBeacons
      .map(item => item.value)
      .filter((b: any) =>
        b.type === 'hookup' &&
        b.mode === 'room' &&
        b.status === 'active' &&
        (!city || b.city === city)
      );

    // TODO: Add actual geo-filtering based on lat/lng/radius
    // For now, just return all active room-based hookup beacons in city

    return c.json({
      beacons: hookupBeacons.map((b: any) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        city: b.city,
        venue: b.venue,
        zone: b.zone,
        total_scans: b.total_scans,
        total_connections: b.total_connections,
        membership_required: b.membership_required,
      })),
    });
  } catch (error) {
    console.error('Error fetching nearby hookup beacons:', error);
    return c.json({ error: 'Failed to fetch beacons' }, 500);
  }
});

/**
 * GET /hookup/my-beacons
 * Get user's created hookup beacons
 */
app.get('/my-beacons', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userBeacons = await kv.getByPrefix(`beacon_by_user:${user.id}:`);
    const beacons = userBeacons
      .map(item => item.value)
      .filter((b: any) => b.type === 'hookup');

    return c.json({ beacons });
  } catch (error) {
    console.error('Error fetching user beacons:', error);
    return c.json({ error: 'Failed to fetch beacons' }, 500);
  }
});

/**
 * DELETE /hookup/beacon/:beaconId
 * Deactivate a hookup beacon
 */
app.delete('/beacon/:beaconId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const beaconId = c.req.param('beaconId');
    const beacon = await kv.get(`beacon:${beaconId}`);

    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }

    if (beacon.creator_id !== user.id) {
      return c.json({ error: 'Not authorized to delete this beacon' }, 403);
    }

    beacon.status = 'inactive';
    beacon.updated_at = new Date().toISOString();
    await kv.set(`beacon:${beaconId}`, beacon);

    return c.json({ success: true, message: 'Beacon deactivated' });
  } catch (error) {
    console.error('Error deleting beacon:', error);
    return c.json({ error: 'Failed to delete beacon' }, 500);
  }
});

/**
 * GET /hookup/stats/:beaconId
 * Get analytics for a hookup beacon (owner only)
 */
app.get('/stats/:beaconId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const beaconId = c.req.param('beaconId');
    const beacon = await kv.get(`beacon:${beaconId}`);

    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }

    if (beacon.creator_id !== user.id) {
      return c.json({ error: 'Not authorized' }, 403);
    }

    // Get connections
    const connections = await kv.getByPrefix(`hookup_connection:`);
    const beaconConnections = connections
      .map(item => item.value)
      .filter((c: any) => c.beacon_id === beaconId);

    const stats = {
      total_scans: beacon.total_scans || 0,
      total_connections: beacon.total_connections || 0,
      conversion_rate: beacon.total_scans > 0
        ? ((beacon.total_connections / beacon.total_scans) * 100).toFixed(1)
        : 0,
      recent_connections: beaconConnections
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10),
    };

    return c.json({ stats });
  } catch (error) {
    console.error('Error fetching beacon stats:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

export default app;