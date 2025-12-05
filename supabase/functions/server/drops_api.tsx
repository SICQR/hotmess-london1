/**
 * HOTMESS LONDON - DROPS API
 * Bot-powered product drops system
 * Handles instant, timed, location, and dual drops
 */

import { Hono } from 'npm:hono@4.10.6';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Helper to get Supabase client
function getSupabase(authToken?: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    authToken ? Deno.env.get('SUPABASE_ANON_KEY') || '' : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
  return supabase;
}

// Helper to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const supabase = getSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// ============================================================================
// CREATE DROP
// ============================================================================

app.post('/create', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const {
      title,
      description,
      price,
      quantity,
      images,
      type,
      scheduled_at,
      ends_at,
      beacon_id,
      release_id,
      category,
      tags,
      city,
      xp_reward,
    } = body;

    if (!title || !price || !quantity || !type || !category || !city) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate drop ID
    const dropId = `drop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Determine status
    let status = 'live';
    if (type === 'timed' && scheduled_at) {
      status = new Date(scheduled_at) > new Date() ? 'scheduled' : 'live';
    }

    // Get user profile for seller info
    const profileData = await kv.get(`profile:${user.id}`);
    const profile = profileData ? JSON.parse(profileData) : null;

    // Create drop object
    const drop = {
      id: dropId,
      seller_id: user.id,
      seller_username: profile?.username || user.email?.split('@')[0] || 'Anonymous',
      seller_avatar: profile?.avatar_url,
      title,
      description,
      price,
      currency: 'GBP',
      quantity,
      quantity_sold: 0,
      images: images || [],
      type,
      status,
      scheduled_at: scheduled_at || null,
      ends_at: ends_at || null,
      live_at: status === 'live' ? new Date().toISOString() : null,
      beacon_id: beacon_id || null,
      beacon_code: null,
      beacon_name: null,
      location: null,
      release_id: release_id || null,
      release_title: null,
      category,
      tags: tags || [],
      views: 0,
      saves: 0,
      xp_reward: xp_reward || Math.floor(price * 2), // Default: 2 XP per £
      announced_in_rooms: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      qr_code_url: null,
    };

    // If beacon drop, get beacon info
    if (beacon_id) {
      const beaconData = await kv.get(`beacon:${beacon_id}`);
      if (beaconData) {
        const beacon = JSON.parse(beaconData);
        drop.beacon_code = beacon.code;
        drop.beacon_name = beacon.name;
        drop.location = {
          lat: beacon.latitude,
          lng: beacon.longitude,
          city: beacon.city || city,
          venue: beacon.venue,
        };
      }
    }

    // If dual drop with release, get release info
    if (release_id) {
      const releaseData = await kv.get(`release:${release_id}`);
      if (releaseData) {
        const release = JSON.parse(releaseData);
        drop.release_title = release.title;
      }
    }

    // Save drop
    await kv.set(`drop:${dropId}`, JSON.stringify(drop));

    // Add to seller's drops list
    const sellerDropsKey = `seller:${user.id}:drops`;
    const sellerDropsData = await kv.get(sellerDropsKey);
    const sellerDrops = sellerDropsData ? JSON.parse(sellerDropsData) : [];
    sellerDrops.unshift(dropId);
    await kv.set(sellerDropsKey, JSON.stringify(sellerDrops));

    // Add to city drops index
    const cityDropsKey = `city:${city.toLowerCase()}:drops`;
    const cityDropsData = await kv.get(cityDropsKey);
    const cityDrops = cityDropsData ? JSON.parse(cityDropsData) : [];
    cityDrops.unshift(dropId);
    await kv.set(cityDropsKey, JSON.stringify(cityDrops));

    // Add to global drops index
    const allDropsKey = 'drops:all';
    const allDropsData = await kv.get(allDropsKey);
    const allDrops = allDropsData ? JSON.parse(allDropsData) : [];
    allDrops.unshift(dropId);
    await kv.set(allDropsKey, JSON.stringify(allDrops.slice(0, 1000))); // Keep last 1000

    // If timed drop, create schedule
    if (type === 'timed' && scheduled_at) {
      const scheduleId = `schedule_${dropId}`;
      const schedule = {
        id: scheduleId,
        drop_id: dropId,
        scheduled_for: scheduled_at,
        announcement_sent: false,
        radio_bot_notified: false,
        rooms_notified: [],
      };
      await kv.set(`drop_schedule:${scheduleId}`, JSON.stringify(schedule));
    }

    // Award seller XP for creating drop
    const xpKey = `xp:${user.id}`;
    const xpData = await kv.get(xpKey);
    const xp = xpData ? JSON.parse(xpData) : { total: 0, level: 1 };
    xp.total += 50; // 50 XP for creating a drop
    xp.level = Math.floor(xp.total / 100) + 1;
    await kv.set(xpKey, JSON.stringify(xp));

    console.log(`✅ Drop created: ${dropId} by ${drop.seller_username}`);

    // Trigger Make.com webhook for drop release
    const makeWebhook = Deno.env.get('MAKE_WEBHOOK_DROP_RELEASE');
    if (makeWebhook && status === 'live') {
      fetch(makeWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'drop.released',
          timestamp: new Date().toISOString(),
          dropId: dropId,
          title: title,
          description: description,
          price: price,
          quantity: quantity,
          dropTime: scheduled_at || new Date().toISOString(),
          imageUrl: images?.[0] || null,
          beaconId: beacon_id || null,
          type: type,
          category: category,
          city: city,
          sellerId: user.id,
          sellerName: drop.seller_username
        })
      }).catch(err => console.error('Make.com webhook error:', err));
    }

    return c.json({
      success: true,
      drop,
      xp_earned: 50,
    });
  } catch (error: any) {
    console.error('Error creating drop:', error);
    return c.json({ error: error.message || 'Failed to create drop' }, 500);
  }
});

// ============================================================================
// GET DROPS (Browse)
// ============================================================================

app.get('/browse', async (c) => {
  try {
    const city = c.req.query('city');
    const type = c.req.query('type');
    const status = c.req.query('status') || 'live';
    const limit = parseInt(c.req.query('limit') || '20');

    let dropIds: string[] = [];

    // Get drops by city or all
    if (city) {
      const cityDropsKey = `city:${city.toLowerCase()}:drops`;
      const cityDropsData = await kv.get(cityDropsKey);
      dropIds = cityDropsData ? JSON.parse(cityDropsData) : [];
    } else {
      const allDropsData = await kv.get('drops:all');
      dropIds = allDropsData ? JSON.parse(allDropsData) : [];
    }

    // Fetch drop data
    const drops = [];
    for (const dropId of dropIds.slice(0, limit)) {
      const dropData = await kv.get(`drop:${dropId}`);
      if (dropData) {
        const drop = JSON.parse(dropData);
        
        // Filter by type if specified
        if (type && drop.type !== type) continue;
        
        // Filter by status if specified
        if (status && drop.status !== status) continue;
        
        drops.push(drop);
      }
    }

    return c.json({ drops });
  } catch (error: any) {
    console.error('Error browsing drops:', error);
    return c.json({ error: error.message || 'Failed to browse drops' }, 500);
  }
});

// ============================================================================
// GET DROP BY ID
// ============================================================================

app.get('/:dropId', async (c) => {
  try {
    const dropId = c.param('dropId');
    
    const dropData = await kv.get(`drop:${dropId}`);
    if (!dropData) {
      return c.json({ error: 'Drop not found' }, 404);
    }

    const drop = JSON.parse(dropData);

    // Increment view count
    drop.views = (drop.views || 0) + 1;
    await kv.set(`drop:${dropId}`, JSON.stringify(drop));

    return c.json({ drop });
  } catch (error: any) {
    console.error('Error fetching drop:', error);
    return c.json({ error: error.message || 'Failed to fetch drop' }, 500);
  }
});

// ============================================================================
// UPDATE DROP
// ============================================================================

app.put('/:dropId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dropId = c.param('dropId');
    const dropData = await kv.get(`drop:${dropId}`);
    
    if (!dropData) {
      return c.json({ error: 'Drop not found' }, 404);
    }

    const drop = JSON.parse(dropData);

    // Verify ownership
    if (drop.seller_id !== user.id) {
      return c.json({ error: 'Not authorized to update this drop' }, 403);
    }

    const updates = await c.req.json();

    // Update allowed fields
    const allowedFields = ['title', 'description', 'price', 'quantity', 'ends_at', 'status'];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        drop[field] = updates[field];
      }
    }

    drop.updated_at = new Date().toISOString();

    await kv.set(`drop:${dropId}`, JSON.stringify(drop));

    return c.json({ success: true, drop });
  } catch (error: any) {
    console.error('Error updating drop:', error);
    return c.json({ error: error.message || 'Failed to update drop' }, 500);
  }
});

// ============================================================================
// DELETE DROP
// ============================================================================

app.delete('/:dropId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dropId = c.param('dropId');
    const dropData = await kv.get(`drop:${dropId}`);
    
    if (!dropData) {
      return c.json({ error: 'Drop not found' }, 404);
    }

    const drop = JSON.parse(dropData);

    // Verify ownership
    if (drop.seller_id !== user.id) {
      return c.json({ error: 'Not authorized to delete this drop' }, 403);
    }

    // Can only delete if no sales
    if (drop.quantity_sold > 0) {
      return c.json({ error: 'Cannot delete drop with existing sales' }, 400);
    }

    // Mark as cancelled instead of deleting
    drop.status = 'cancelled';
    drop.updated_at = new Date().toISOString();
    await kv.set(`drop:${dropId}`, JSON.stringify(drop));

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting drop:', error);
    return c.json({ error: error.message || 'Failed to delete drop' }, 500);
  }
});

// ============================================================================
// GET SELLER DROPS
// ============================================================================

app.get('/seller/:sellerId', async (c) => {
  try {
    const sellerId = c.param('sellerId');
    
    const sellerDropsKey = `seller:${sellerId}:drops`;
    const sellerDropsData = await kv.get(sellerDropsKey);
    const dropIds = sellerDropsData ? JSON.parse(sellerDropsData) : [];

    const drops = [];
    for (const dropId of dropIds) {
      const dropData = await kv.get(`drop:${dropId}`);
      if (dropData) {
        drops.push(JSON.parse(dropData));
      }
    }

    return c.json({ drops });
  } catch (error: any) {
    console.error('Error fetching seller drops:', error);
    return c.json({ error: error.message || 'Failed to fetch seller drops' }, 500);
  }
});

// ============================================================================
// GET DROP ANALYTICS
// ============================================================================

app.get('/:dropId/analytics', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dropId = c.param('dropId');
    const dropData = await kv.get(`drop:${dropId}`);
    
    if (!dropData) {
      return c.json({ error: 'Drop not found' }, 404);
    }

    const drop = JSON.parse(dropData);

    // Verify ownership
    if (drop.seller_id !== user.id) {
      return c.json({ error: 'Not authorized to view analytics' }, 403);
    }

    // Get analytics data (simplified - in production would track more)
    const analytics = {
      drop_id: dropId,
      period: 'all_time',
      views: drop.views || 0,
      unique_viewers: Math.floor((drop.views || 0) * 0.7), // Estimate
      saves: drop.saves || 0,
      shares: 0,
      revenue: drop.price * drop.quantity_sold,
      units_sold: drop.quantity_sold,
      conversion_rate: drop.views > 0 ? (drop.quantity_sold / drop.views * 100).toFixed(2) : 0,
      sources: {
        rooms: 0,
        qr_scans: 0,
        beacons: 0,
        direct: 0,
        referrals: 0,
      },
      xp_earned: drop.quantity_sold * 10, // Seller earns XP per sale
      xp_distributed_to_buyers: drop.quantity_sold * (drop.xp_reward || 0),
      hourly_sales: [],
    };

    return c.json({ analytics });
  } catch (error: any) {
    console.error('Error fetching drop analytics:', error);
    return c.json({ error: error.message || 'Failed to fetch analytics' }, 500);
  }
});

// ============================================================================
// SAVE/UNSAVE DROP
// ============================================================================

app.post('/:dropId/save', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dropId = c.param('dropId');
    const dropData = await kv.get(`drop:${dropId}`);
    
    if (!dropData) {
      return c.json({ error: 'Drop not found' }, 404);
    }

    const drop = JSON.parse(dropData);

    // Add to user's saved drops
    const savedKey = `user:${user.id}:saved_drops`;
    const savedData = await kv.get(savedKey);
    const saved = savedData ? JSON.parse(savedData) : [];
    
    if (!saved.includes(dropId)) {
      saved.unshift(dropId);
      await kv.set(savedKey, JSON.stringify(saved));

      // Increment save count on drop
      drop.saves = (drop.saves || 0) + 1;
      await kv.set(`drop:${dropId}`, JSON.stringify(drop));
    }

    return c.json({ success: true, saved: true });
  } catch (error: any) {
    console.error('Error saving drop:', error);
    return c.json({ error: error.message || 'Failed to save drop' }, 500);
  }
});

app.delete('/:dropId/save', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dropId = c.param('dropId');

    // Remove from user's saved drops
    const savedKey = `user:${user.id}:saved_drops`;
    const savedData = await kv.get(savedKey);
    const saved = savedData ? JSON.parse(savedData) : [];
    
    const index = saved.indexOf(dropId);
    if (index > -1) {
      saved.splice(index, 1);
      await kv.set(savedKey, JSON.stringify(saved));

      // Decrement save count on drop
      const dropData = await kv.get(`drop:${dropId}`);
      if (dropData) {
        const drop = JSON.parse(dropData);
        drop.saves = Math.max(0, (drop.saves || 0) - 1);
        await kv.set(`drop:${dropId}`, JSON.stringify(drop));
      }
    }

    return c.json({ success: true, saved: false });
  } catch (error: any) {
    console.error('Error unsaving drop:', error);
    return c.json({ error: error.message || 'Failed to unsave drop' }, 500);
  }
});

export default app;
