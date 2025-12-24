/**
 * HOTMESS LONDON SERVER
 * Hono web server for beacons, XP, marketplace, etc.
 * Version: 1.0.1 (beacon system active)
 */

import { Hono } from 'npm:hono@4.10.6';
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import qrAuthApp from "./qr-auth.tsx";
import * as beaconResolver from "./beacon_resolver.tsx";
import * as beaconStore from "./beacon_store.tsx";
import earthApp from "./earth-routes.ts";
import earthRoutesApp from "./earth_routes.tsx"; // NEW: Full Earth/Globe backend
import beaconApiApp from "./beacon_api.tsx";
import beaconRoutesApp from "./beacon_routes.tsx"; // NEW: Full Beacon scan system
import connectApiApp from "./connect_api.tsx";
import ticketsApiApp from "./tickets_api.tsx";
import ticketsC2CApiApp from "./tickets_c2c_api.tsx"; // NEW: C2C Tickets Marketplace
import stripeApiApp from "./stripe_api.tsx";
import beaconsApp from "./beacons.tsx"; // NEW: Beacon management
import xpApp from "./xp.tsx"; // NEW: XP system
import seedBeacons from "./seed-data.tsx"; // NEW: Data seeding
import messMarketApiApp from "./messmarket_api.tsx"; // NEW: MessMarket API
import marketApiApp from "./market_api.tsx"; // NEW: Marketplace Stripe Connect APIs
import sellerDashboardApiApp from "./seller_dashboard_api.tsx"; // NEW: Seller Dashboard Stats API
import recordsApiApp from "./records_api.tsx"; // NEW: Records API
import vendorApiApp from "./vendor_api.tsx"; // NEW: Vendor Applications API
import savedApiApp from "./saved_api.tsx"; // NEW: Saved Content API
import notificationsApiApp from "./notifications_api.tsx"; // NEW: Notifications API
import usersApiApp from "./users_api.tsx"; // NEW: User Profiles API
import searchApiApp from "./search_api.tsx"; // NEW: Global Search API
import dropsApiApp from "./drops_api.tsx"; // NEW: Bot-Powered Drops API
import membershipApiApp from "./membership_api.tsx"; // NEW: Tiered Membership API
import hookupApiApp from "./hookup_api.tsx"; // NEW: Hookup/Chat Beacon API
import telegramWebhookApp from "./telegram_webhook.tsx"; // NEW: Telegram Bot Webhook
import intelApiApp from "./intel_api.tsx"; // NEW: Auto-Intel Engine API
import mapApiApp from "./map_api.tsx"; // NEW: Map heat/trail data API
import * as makeIntegrations from "./make-integrations.ts"; // NEW: Make.com webhooks
import adminApiApp from "./admin_api.tsx"; // NEW: Admin Console API
import heatApiApp from "./heat_api.tsx"; // NEW: Night Pulse Heat Map API
import privacyApiApp from "./privacy_api.tsx"; // NEW: GDPR / DSAR Privacy API
import qrRoutesApp from "./routes/qr.ts"; // NEW: QR Code Generation
import lRoutesApp from "./routes/l.ts"; // NEW: Beacon Resolve (/l/:code)
import xRoutesApp from "./routes/x.ts"; // NEW: Signed Beacon Resolve (/x/:payload.:sig)

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

/**
 * ═══════════════════════════════════════════════════════════════════
 * AUTH STRATEGY
 * ═══════════════════════════════════════════════════════════════════
 * 
 * This function has verify_jwt=false in config.json, meaning:
 * - All routes are PUBLIC by default
 * - Protected routes MUST enforce auth in code using requireAuth()
 * 
 * PUBLIC ROUTES (no auth needed):
 * - /health - monitoring
 * - /qr/* - QR code generation
 * - /l/:code - beacon resolve (standard)
 * - /x/:payload - beacon resolve (signed, verified by HMAC)
 * - /auth/signup - user registration
 * 
 * PROTECTED ROUTES (require JWT in Authorization header):
 * - /marketplace/* - purchases, orders
 * - /user/* - profile, settings
 * - /admin/* - admin console
 * - Most other routes
 * 
 * To protect a route, import and use:
 *   import { requireAuth, requireAdmin } from './auth-middleware';
 *   app.use('/protected/*', requireAuth());
 * ═══════════════════════════════════════════════════════════════════
 */

// Health check endpoint (PUBLIC)
app.get("/make-server-a670c824/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: Date.now(), 
    version: "1.0.1",
    secrets: {
      BEACON_SECRET: !!Deno.env.get('BEACON_SECRET'),
      APP_BASE_URL: !!Deno.env.get('APP_BASE_URL'),
      SUPABASE_URL: !!Deno.env.get('SUPABASE_URL'),
      SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    }
  });
});

// Mount QR auth routes
app.route("/make-server-a670c824/auth", qrAuthApp);

// Privacy / DSAR routes
app.route("/make-server-a670c824/privacy", privacyApiApp);

app.post("/make-server-a670c824/auth/signup", async (c) => {
  return c.json(
    {
      error: 'This endpoint is deprecated. Use Supabase Auth client signUp + email confirmation.',
    },
    410,
  );
});

app.post("/make-server-a670c824/auth/confirm-email", async (c) => {
  return c.json(
    {
      error: 'This endpoint is deprecated. Use Supabase Auth email confirmation + resend confirmation email.',
    },
    410,
  );
});

// DEBUG: Check user status endpoint
app.post("/make-server-a670c824/auth/check-user", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: 'Email required' }, 400);
    }

    // Create Supabase admin client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.0');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    // Get user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('List users error:', listError);
      return c.json({ error: 'Failed to find user' }, 500);
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return c.json({ 
        exists: false,
        message: 'User not found. Please register first.' 
      });
    }

    return c.json({ 
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        emailConfirmed: !!user.email_confirmed_at,
        confirmedAt: user.email_confirmed_at,
        createdAt: user.created_at,
      }
    });
  } catch (error: any) {
    console.error('Check user error:', error);
    return c.json({ error: error.message || 'Failed to check user' }, 500);
  }
});

// Mount Google Earth routes
app.route("/make-server-a670c824/earth", earthApp);

// NEW: Mount full Earth/Globe backend routes
app.route("/", earthRoutesApp);

// Mount production beacon API routes
app.route("/make-server-a670c824/api/beacons", beaconApiApp);

// Global stats - MUST be before beaconRoutesApp to avoid matching "stats" as a beacon ID
app.get("/make-server-a670c824/beacons/stats", async (c) => {
  try {
    const stats = await beaconStore.getGlobalStats();
    return c.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// NEW: Mount full Beacon scan system routes
app.route("/", beaconRoutesApp);

// Mount Connect module routes
app.route("/make-server-a670c824/api/connect", connectApiApp);

// Mount Tickets module routes
app.route("/make-server-a670c824/api/tickets", ticketsApiApp);

// Mount C2C Tickets Marketplace routes
app.route("/make-server-a670c824/api/tickets-c2c", ticketsC2CApiApp);

// Mount Stripe API routes
app.route("/make-server-a670c824/stripe", stripeApiApp);

// Mount NEW Beacon management routes
app.route("/make-server-a670c824/v2/beacons", beaconsApp);

// Mount NEW XP system routes
app.route("/make-server-a670c824/v2/xp", xpApp);

// Seed data for beacons
app.get("/make-server-a670c824/seed/beacons", async (c) => {
  try {
    await seedBeacons();
    return c.json({ success: true, message: 'Beacons seeded successfully' });
  } catch (error) {
    console.error('Seed beacons error:', error);
    return c.json({ error: 'Failed to seed beacons' }, 500);
  }
});

// Mount NEW MessMarket API routes
app.route("/make-server-a670c824/api/messmarket", messMarketApiApp);

// Mount Stripe Connect marketplace routes
app.route("/make-server-a670c824/api/market", marketApiApp);

// Mount NEW Seller Dashboard Stats API routes
app.route("/make-server-a670c824/api/seller-dashboard", sellerDashboardApiApp);

// Mount NEW Records API routes
app.route("/make-server-a670c824/api/records", recordsApiApp);

// Mount NEW Vendor Applications API routes
app.route("/make-server-a670c824/api/vendor", vendorApiApp);

// Mount NEW Saved Content API routes
app.route("/make-server-a670c824/api/saved", savedApiApp);

// Mount NEW Notifications API routes
app.route("/make-server-a670c824/api/notifications", notificationsApiApp);

// Mount NEW User Profiles API routes
app.route("/make-server-a670c824/api/users", usersApiApp);

// Mount NEW Global Search API routes
app.route("/make-server-a670c824/api/search", searchApiApp);

// Mount NEW Drops API routes
app.route("/make-server-a670c824/api/drops", dropsApiApp);

// Mount NEW Membership API routes
app.route("/make-server-a670c824/api/membership", membershipApiApp);

// Mount NEW Hookup/Chat Beacon API routes
app.route("/make-server-a670c824/api/hookup", hookupApiApp);

// Mount Telegram Bot Webhook routes
app.route("/make-server-a670c824/api/telegram", telegramWebhookApp);

// Mount Auto-Intel Engine API routes
app.route("/make-server-a670c824/api/intel", intelApiApp);

// Mount Map API routes (heat/trail data)
app.route("/make-server-a670c824/api/map", mapApiApp);

// Mount Admin Console API routes
app.route("/make-server-a670c824/api/admin", adminApiApp);

// Mount Night Pulse Heat Map API routes
app.route("/make-server-a670c824/api/heat", heatApiApp);

// ============================================================================
// QR CODE & BEACON RESOLVE ROUTES (public shortlinks)
// ============================================================================

// Mount QR code generation routes
app.route("/make-server-a670c824", qrRoutesApp);

// Mount beacon resolve routes (public shortlinks)
app.route("", lRoutesApp); // /l/:code
app.route("", xRoutesApp); // /x/:payload.:sig

// ============================================================================
// BEACON ROUTES
// ============================================================================

// Shortlink resolver - /l/:code
app.get("/make-server-a670c824/l/:code", beaconResolver.resolveBeacon);

// List ALL beacons (for globe visualization)
app.get("/make-server-a670c824/beacons", async (c) => {
  try {
    const beacons = await beaconStore.listBeacons();
    return c.json(beacons);
  } catch (error) {
    console.error('Get all beacons error:', error);
    // If tables don't exist yet, return empty array with helpful message
    if (error.message?.includes('does not exist') || error.message?.includes('42P01')) {
      return c.json({
        error: 'Database not set up. Run /supabase/migrations/001_beacons_setup.sql in Supabase SQL Editor',
        beacons: [],
        tablesExist: false
      });
    }
    return c.json({ error: 'Failed to fetch beacons' }, 500);
  }
});

// List active beacons (for map)
app.get("/make-server-a670c824/beacons/active", async (c) => {
  try {
    const beacons = await beaconStore.getActiveBeaconsWithGeo();
    return c.json({ beacons });
  } catch (error) {
    console.error('Get active beacons error:', error);
    return c.json({ error: 'Failed to fetch beacons' }, 500);
  }
});

// Beacon info (preview without scanning) - Wildcard route, must be AFTER specific routes
app.get("/make-server-a670c824/beacons/:code/info", beaconResolver.getBeaconInfo);

// Create beacon (admin only - add auth check later)
app.post("/make-server-a670c824/beacons", async (c) => {
  try {
    const data = await c.req.json();
    const beacon = await beaconStore.createBeacon(data);
    return c.json({ beacon });
  } catch (error) {
    console.error('Create beacon error:', error);
    return c.json({ error: 'Failed to create beacon' }, 500);
  }
});

// Update beacon (admin only - add auth check later)
app.put("/make-server-a670c824/beacons/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const beacon = await beaconStore.updateBeacon(id, updates);
    return c.json({ beacon });
  } catch (error) {
    console.error('Update beacon error:', error);
    return c.json({ error: 'Failed to update beacon' }, 500);
  }
});

// Get beacon analytics
app.get("/make-server-a670c824/beacons/:id/stats", async (c) => {
  try {
    const id = c.req.param('id');
    const stats = await beaconStore.getBeaconStats(id);
    return c.json(stats);
  } catch (error) {
    console.error('Get beacon stats error:', error);
    return c.json({ error: 'Failed to fetch beacon stats' }, 500);
  }
});

// Get recent scans (admin only - add auth check later)
app.get("/make-server-a670c824/beacons/scans/recent", async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const scans = await beaconStore.getRecentScans(limit);
    return c.json({ scans });
  } catch (error) {
    console.error('Get recent scans error:', error);
    return c.json({ error: 'Failed to fetch scans' }, 500);
  }
});

// Get user XP
app.get("/make-server-a670c824/xp/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const total = await beaconStore.getUserXPTotal(userId);
    const history = await beaconStore.getUserXPHistory(userId, 50);
    return c.json({ total, history });
  } catch (error) {
    console.error('Get user XP error:', error);
    return c.json({ error: 'Failed to fetch XP' }, 500);
  }
});

// ============================================================================
// SCAN TO REVEAL ROUTES
// ============================================================================

// POST /api/beacons/:id/scan - Award XP_VIEW + log scan
app.post("/make-server-a670c824/api/beacons/:id/scan", async (c) => {
  try {
    const beaconId = c.req.param('id');
    const body = await c.req.json();
    const { userId, deviceHash, source, roomId, geo } = body;

    // Get beacon
    const beacon = await beaconStore.getBeaconById(beaconId);
    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }

    // Check if expired
    const now = new Date();
    if (new Date(beacon.ends_at) < now) {
      return c.json({ 
        error: 'expired',
        message: 'This beacon has expired',
        beacon: { id: beacon.id, code: beacon.code, type: beacon.type }
      }, 400);
    }

    // Check if not started
    if (new Date(beacon.starts_at) > now) {
      return c.json({ 
        error: 'not_started',
        message: 'This beacon is not active yet',
        startsAt: beacon.starts_at
      }, 400);
    }

    // GPS validation for physical beacons
    const requiresGPS = ['checkin', 'connect', 'ticket'].includes(beacon.type);
    if (requiresGPS && (!geo || !geo.lat || !geo.lng)) {
      return c.json({ 
        error: 'gps_required',
        message: 'Location permission required for this beacon type'
      }, 400);
    }

    // Check proximity if GPS provided
    if (requiresGPS && geo && beacon.geo_lat && beacon.geo_lng) {
      const distance = calculateDistance(
        geo.lat, geo.lng,
        beacon.geo_lat, beacon.geo_lng
      );
      const radiusMeters = beacon.geo_radius || 100;
      if (distance > radiusMeters) {
        return c.json({ 
          error: 'too_far',
          message: `You must be within ${radiusMeters}m of the beacon`,
          distance: Math.round(distance)
        }, 400);
      }
    }

    // Check XP deduplication (once per beacon per day per user/device)
    const identifier = userId || deviceHash;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const existingXP = await beaconStore.checkXPAwarded(
      beaconId,
      identifier,
      'view',
      todayStart.toISOString()
    );

    let xpAwarded = 0;
    if (!existingXP) {
      // Award XP_VIEW
      xpAwarded = beacon.xp_value || 10;
      await beaconStore.awardXP({
        beaconId,
        userId: userId || null,
        deviceHash: deviceHash || null,
        type: 'view',
        amount: xpAwarded,
        source: source || 'web'
      });
    }

    // Log the scan
    await beaconStore.logScan({
      beaconId,
      userId: userId || null,
      deviceHash: deviceHash || null,
      source: source || 'web',
      roomId: roomId || null,
      geoLat: geo?.lat || null,
      geoLng: geo?.lng || null,
      result: existingXP ? 'duplicate' : 'accepted'
    });

    // Return full beacon details (REVEALED)
  } catch (error) {
    console.error('Beacon scan error:', error);
    return c.json({ error: 'Failed to process scan' }, 500);
  }
});

// POST /api/beacons/:id/action - Validate premium/GPS + award XP_ACTION
app.post("/make-server-a670c824/api/beacons/:id/action", async (c) => {
  try {
    const beaconId = c.req.param('id');
    const body = await c.req.json();
    const { userId, deviceHash, userTier, geo } = body;

    // Get beacon
    const beacon = await beaconStore.getBeaconById(beaconId);
    if (!beacon) {
      return c.json({ error: 'Beacon not found' }, 404);
    }

    // Check if expired
    const now = new Date();
    if (new Date(beacon.ends_at) < now) {
      return c.json({ error: 'This beacon has expired' }, 400);
    }

    // Premium tier validation
    const tier = userTier || 'free';
    const requiredTier = beacon.required_tier || 'free';
    
    const tierHierarchy = { free: 0, starter: 1, pro: 2, elite: 3 };
    if (tierHierarchy[tier] < tierHierarchy[requiredTier]) {
      return c.json({ 
        error: 'premium_required',
        message: `This action requires ${requiredTier} tier or higher`,
        requiredTier
      }, 403);
    }

    // GPS validation for action (if needed)
    const requiresGPS = ['checkin', 'connect'].includes(beacon.type);
    if (requiresGPS && (!geo || !geo.lat || !geo.lng)) {
      return c.json({ 
        error: 'gps_required',
        message: 'Location required to complete this action'
      }, 400);
    }

    // Check if action XP already awarded
    const identifier = userId || deviceHash;
    const existingXP = await beaconStore.checkXPAwarded(
      beaconId,
      identifier,
      'action',
      null // No time limit for action XP - once per beacon ever
    );

    let xpAwarded = 0;
    if (!existingXP) {
      // Award XP_ACTION (typically higher than view)
      xpAwarded = (beacon.xp_value || 10) * 3;
      await beaconStore.awardXP({
        beaconId,
        userId: userId || null,
        deviceHash: deviceHash || null,
        type: 'action',
        amount: xpAwarded,
        source: 'action'
      });
    }

    return c.json({
      success: true,
      xpAwarded,
      duplicate: !!existingXP,
      redirectUrl: beacon.cta_url
    });
  } catch (error) {
    console.error('Beacon action error:', error);
    return c.json({ error: 'Failed to process action' }, 500);
  }
});

// POST /api/notify/subscribe - Subscribe to beacon notifications
app.post("/make-server-a670c824/api/notify/subscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, email, beaconId, city, notifType } = body;

    // Store subscription in KV
    const key = `notify:${notifType}:${userId || email}:${beaconId || city || 'all'}`;
    await kv.set(key, {
      userId,
      email,
      beaconId,
      city,
      type: notifType,
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

// Helper: Calculate distance between two lat/lng points (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// ============================================================================
// MAP / GLOBE ROUTES
// ============================================================================

// Live map data (beacons + heat bins)
app.get("/make-server-a670c824/map/live", async (c) => {
  try {
    // Get active beacons with geo
    const beacons = await beaconStore.getActiveBeaconsWithGeo();
    
    // Generate heat bins (simple grid aggregation - can upgrade to H3 later)
    const heatBins = await generateHeatBins();
    
    return c.json({ 
      beacons: beacons.map(b => ({
        id: b.id,
        code: b.code,
        type: b.type,
        title: b.title,
        city: b.city || null,
        xp: b.xp_value,
        sponsor: b.sponsor_name || null,
        sponsored: !!b.sponsor_name,
        startsAt: b.starts_at,
        endsAt: b.ends_at,
        lng: b.geo_lng,
        lat: b.geo_lat,
      })),
      heatBins 
    });
  } catch (error) {
    console.error('Map live data error:', error);
    return c.json({ error: 'Failed to fetch map data', beacons: [], heatBins: [] }, 500);
  }
});

// Trails data (24h scan aggregation)
app.get("/make-server-a670c824/map/trails", async (c) => {
  try {
    const window = c.req.query('window') || '24h';
    
    // Parse window (supports: 10m, 1h, 24h)
    let hoursBack = 24;
    if (window === '10m') hoursBack = 10 / 60;
    else if (window === '1h') hoursBack = 1;
    else if (window === '24h') hoursBack = 24;
    
    const trails = await generateTrails(hoursBack);
    
    return c.json({ trails });
  } catch (error) {
    console.error('Map trails error:', error);
    return c.json({ error: 'Failed to fetch trails', trails: [] }, 500);
  }
});

// ============================================================================
// HELPER FUNCTIONS FOR MAP DATA
// ============================================================================

async function generateHeatBins(): Promise<any[]> {
  try {
    // Simple grid-based aggregation (0.1 degree squares ~10km)
    // Later: upgrade to H3 hexagons for proper geospatial indexing
    
    const supabase = beaconStore.getSupabaseClient();
    
    // Try RPC if it exists (won't exist yet, so skip for now)
    // const { data, error } = await supabase.rpc('get_heat_bins', {});
    
    // Manual aggregation (works without RPC)
    const { data: scans } = await supabase
      .from('beacon_scans')
      .select(`
        id,
        beacon_id,
        scanned_at
      `)
      .gte('scanned_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(10000);
    
    if (!scans || scans.length === 0) return [];
    
    // Get unique beacon IDs and their geo data
    const beaconIds = [...new Set(scans.map(s => s.beacon_id))];
    const { data: beacons } = await supabase
      .from('beacons')
      .select('id, geo_lat, geo_lng')
      .in('id', beaconIds)
      .not('geo_lat', 'is', null)
      .not('geo_lng', 'is', null);
    
    if (!beacons || beacons.length === 0) return [];
    
    // Create beacon lookup map
    const beaconMap = new Map(beacons.map(b => [b.id, { lat: b.geo_lat!, lng: b.geo_lng! }]));
    
    // Group by grid squares
    const grid: Record<string, { count: number; lat: number; lng: number }> = {};
    
    for (const scan of scans) {
      const beacon = beaconMap.get(scan.beacon_id);
      if (!beacon) continue;
      
      const lat = beacon.lat;
      const lng = beacon.lng;
      
      // Round to 0.1 degree grid
      const gridLat = Math.floor(lat / 0.1) * 0.1;
      const gridLng = Math.floor(lng / 0.1) * 0.1;
      const key = `${gridLat},${gridLng}`;
      
      if (!grid[key]) {
        grid[key] = { count: 0, lat: gridLat, lng: gridLng };
      }
      grid[key].count++;
    }
    
    // Convert to heat bins (rectangles)
    return Object.entries(grid).map(([key, g]) => ({
      id: `heat-${key}`,
      west: g.lng,
      south: g.lat,
      east: g.lng + 0.1,
      north: g.lat + 0.1,
      count: g.count,
    }));
  } catch (error) {
    console.error('Generate heat bins error:', error);
    return [];
  }
}

async function generateTrails(hoursBack: number): Promise<any[]> {
  try {
    const supabase = beaconStore.getSupabaseClient();
    
    // Get scans with beacon IDs, ordered by time
    const { data: scans } = await supabase
      .from('beacon_scans')
      .select('id, beacon_id, scanned_at')
      .gte('scanned_at', new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString())
      .order('scanned_at', { ascending: true })
      .limit(5000);
    
    if (!scans || scans.length === 0) return [];
    
    // Get unique beacon IDs and their geo data
    const beaconIds = [...new Set(scans.map(s => s.beacon_id))];
    const { data: beacons } = await supabase
      .from('beacons')
      .select('id, geo_lat, geo_lng')
      .in('id', beaconIds)
      .not('geo_lat', 'is', null)
      .not('geo_lng', 'is', null);
    
    if (!beacons || beacons.length === 0) return [];
    
    // Create beacon lookup map
    const beaconMap = new Map(beacons.map(b => [b.id, { lat: b.geo_lat!, lng: b.geo_lng! }]));
    
    // Aggregate scans into trails (connect sequential scans)
    // For MVP: create one big trail showing all activity flow
    const points = scans
      .map(s => {
        const beacon = beaconMap.get(s.beacon_id);
        if (!beacon) return null;
        return {
          lng: beacon.lng,
          lat: beacon.lat,
        };
      })
      .filter((p): p is { lng: number; lat: number } => p !== null);
    
    if (points.length === 0) return [];
    
    // Create single aggregated trail
    return [{
      id: 'trail-global',
      points,
      intensity: 0.7,
    }];
  } catch (error) {
    console.error('Generate trails error:', error);
    return [];
  }
}

Deno.serve(app.fetch);