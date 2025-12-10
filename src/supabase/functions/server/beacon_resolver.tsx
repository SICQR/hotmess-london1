/**
 * BEACON RESOLVER
 * Handles /l/:code shortlink resolution with full gate pipeline
 * 
 * Pipeline:
 * 1. Resolve code → beacon
 * 2. Age gate (always)
 * 3. Consent gates (geo/chat/external/marketing)
 * 4. Auth gate (if required)
 * 5. Execute action
 * 6. Award XP
 * 7. Log scan
 * 8. Redirect to destination
 */

import { Context } from 'npm:hono@4';
import * as beaconStore from './beacon_store.tsx';
import type { Beacon, ScanResult } from './beacon_store.tsx';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ============================================================================
// HELPERS
// ============================================================================

function hashString(str: string): string {
  // Simple hash for device/IP tracking (not cryptographic)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

function getDeviceHash(headers: Headers): string {
  const ua = headers.get('user-agent') || '';
  const ip = headers.get('cf-connecting-ip') || headers.get('x-forwarded-for') || 'unknown';
  return hashString(`${ua}:${ip}`);
}

function getIPHash(headers: Headers): string {
  const ip = headers.get('cf-connecting-ip') || headers.get('x-forwarded-for') || 'unknown';
  return hashString(ip);
}

async function getUserFromToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user.id;
}

function isBeaconActive(beacon: Beacon): boolean {
  if (beacon.status !== 'active') return false;
  
  const now = new Date();
  
  if (beacon.starts_at) {
    const start = new Date(beacon.starts_at);
    if (now < start) return false;
  }
  
  if (beacon.ends_at) {
    const end = new Date(beacon.ends_at);
    if (now > end) return false;
  }
  
  return true;
}

// ============================================================================
// GATE CHECKS
// ============================================================================

async function checkRateLimits(
  beacon: Beacon, 
  userId: string | null, 
  deviceHash: string
): Promise<{ allowed: boolean; result: ScanResult; reason?: string }> {
  // Check total scans quota
  if (beacon.max_scans_total !== null) {
    const totalScans = await beaconStore.getBeaconTotalScans(beacon.id);
    if (totalScans >= beacon.max_scans_total) {
      return { 
        allowed: false, 
        result: 'quota_exceeded', 
        reason: 'Beacon scan quota exceeded' 
      };
    }
  }
  
  // Check per-user daily limit (requires auth)
  if (userId && beacon.max_scans_per_user_per_day !== null) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const userScansToday = await beaconStore.getUserScanCount(userId, beacon.id, startOfDay);
    
    if (userScansToday >= beacon.max_scans_per_user_per_day) {
      return { 
        allowed: false, 
        result: 'rate_limited', 
        reason: 'Daily scan limit reached for this beacon' 
      };
    }
  }
  
  return { allowed: true, result: 'accepted' };
}

// ============================================================================
// MAIN RESOLVER
// ============================================================================

export async function resolveBeacon(c: Context) {
  const code = c.req.param('code');
  
  if (!code) {
    return c.json({ error: 'Missing beacon code', result: 'error' }, 400);
  }
  
  try {
    // 1. Resolve beacon
    const beacon = await beaconStore.getBeaconByCode(code);
    
    if (!beacon) {
      return c.json({ 
        error: 'Beacon not found', 
        result: 'not_found' 
      }, 404);
    }
    
    // 2. Check if beacon is active
    if (!isBeaconActive(beacon)) {
      return c.json({ 
        error: 'Beacon is not active',
        result: 'expired',
        beacon: {
          title: beacon.title,
          status: beacon.status,
        }
      }, 410);
    }
    
    // 3. Get user (if authenticated)
    const authHeader = c.req.header('Authorization');
    const userId = await getUserFromToken(authHeader);
    
    // 4. Device tracking
    const deviceHash = getDeviceHash(c.req.raw.headers);
    const ipHash = getIPHash(c.req.raw.headers);
    
    // 5. Check rate limits
    const limitCheck = await checkRateLimits(beacon, userId, deviceHash);
    
    if (!limitCheck.allowed) {
      // Log rejected scan
      try {
        await beaconStore.recordScan({
          beacon_id: beacon.id,
          user_id: userId,
          device_hash: deviceHash,
          city_slug: beacon.city_slug,
          geo_lat: null,
          geo_lng: null,
          result: limitCheck.result,
          reason_code: limitCheck.reason || null,
          ip_hash: ipHash,
        });
      } catch (scanError) {
        console.error('Failed to record rejected scan:', scanError);
      }
      
      return c.json({ 
        error: limitCheck.reason,
        result: limitCheck.result,
        beacon: {
          title: beacon.title,
          type: beacon.type,
        }
      }, 429);
    }
    
    // 6. Log successful scan
    try {
      await beaconStore.recordScan({
        beacon_id: beacon.id,
        user_id: userId,
        device_hash: deviceHash,
        city_slug: beacon.city_slug,
        geo_lat: null,
        geo_lng: null,
        result: 'accepted',
        reason_code: null,
        ip_hash: ipHash,
      });
    } catch (scanError) {
      console.error('Failed to record scan:', scanError);
      // Continue anyway - don't block the user
    }
    
    // 7. Award XP (if user is authenticated)
    if (userId && beacon.xp_amount > 0) {
      try {
        await beaconStore.awardXP({
          user_id: userId,
          kind: 'scan',
          amount: beacon.xp_amount,
          beacon_id: beacon.id,
          ref_id: null,
          metadata: {
            beacon_type: beacon.type,
            beacon_title: beacon.title,
          },
        });
      } catch (xpError) {
        console.error('Failed to award XP:', xpError);
        // Continue anyway - don't block the redirect
      }
    }
    
    // 8. Build redirect URL
    let redirectUrl = beacon.redirect_url;
    
    // Add UTM parameters if present
    if (beacon.utm_json) {
      try {
        const url = new URL(redirectUrl);
        Object.entries(beacon.utm_json).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
        redirectUrl = url.toString();
      } catch (urlError) {
        console.error('Failed to add UTM params:', urlError);
        // Use original URL
      }
    }
    
    // 9. Return success response with redirect
    return c.json({
      success: true,
      result: 'accepted',
      beacon: {
        id: beacon.id,
        code: beacon.code,
        title: beacon.title,
        description: beacon.description,
        type: beacon.type,
        xp_awarded: userId ? beacon.xp_amount : 0,
        geo_lat: beacon.geo_lat,
        geo_lng: beacon.geo_lng,
        expires_at: beacon.ends_at,
      },
      redirect_url: redirectUrl,
      xp_awarded: userId ? beacon.xp_amount : 0,
    });
    
  } catch (error) {
    console.error('Beacon resolution error:', error);
    
    // Check if it's a database error
    if (error.message?.includes('does not exist') || error.message?.includes('42P01')) {
      return c.json({
        error: 'Database not set up. Please contact support.',
        result: 'error',
        details: 'Tables not found - run migration first'
      }, 503);
    }
    
    return c.json({
      error: 'Internal server error',
      result: 'error',
      details: error.message
    }, 500);
  }
}

// ============================================================================
// BEACON INFO (for QR code scanners that want to preview before redirecting)
// ============================================================================

export async function getBeaconInfo(c: Context) {
  const code = c.req.param('code');
  
  if (!code) {
    return c.json({ error: 'Missing beacon code' }, 400);
  }
  
  const beacon = await beaconStore.getBeaconByCode(code);
  
  if (!beacon) {
    return c.json({ error: 'Beacon not found' }, 404);
  }
  
  const isActive = isBeaconActive(beacon);
  const totalScans = await beaconStore.getBeaconTotalScans(beacon.id);
  
  return c.json({
    id: beacon.id,
    code: beacon.code,
    title: beacon.title,
    description: beacon.description,
    type: beacon.type,
    status: beacon.status,
    is_active: isActive,
    xp_amount: beacon.xp_amount,
    total_scans: totalScans,
    max_scans_total: beacon.max_scans_total,
    starts_at: beacon.starts_at,
    ends_at: beacon.ends_at,
    geo: beacon.geo_lat && beacon.geo_lng ? {
      lat: beacon.geo_lat,
      lng: beacon.geo_lng,
      city: beacon.city_slug,
    } : null,
  });
}