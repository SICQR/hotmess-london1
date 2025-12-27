/**
 * HOTMESS LONDON — Beacon Service
 * Complete beacon CRUD operations with Supabase backend
 * Handles: Create, Read, Update, Delete, Scan, Analytics
 */

import { supabase as supabaseClient } from '../supabase';

const supabase: any = supabaseClient;

export type BeaconCreateInput = {
  type: 'event' | 'ticket' | 'venue' | 'experience' | 'community';
  title: string;
  description?: string | null;
  city_id?: string;
  start_at?: string; // ISO timestamp
  end_at?: string; // ISO timestamp
  host_type?: 'admin' | 'venue' | 'approved_host';
};

export type BeaconUpdateInput = {
  title?: string;
  description?: string | null;
  type?: 'event' | 'ticket' | 'venue' | 'experience' | 'community';
  status?: 'draft' | 'pending_review' | 'live' | 'expired' | 'archived' | 'disabled';
  start_at?: string;
  end_at?: string;
};

export type BeaconFilters = {
  status?: string;
  type?: string;
  city_id?: string;
};

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Browser-safe random slug generator
 * Uses crypto.getRandomValues for cryptographic randomness
 */
function makeSlug(prefix: string, len = 8): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let code = '';
  for (let i = 0; i < len; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `${prefix}-${code}`.toLowerCase();
}

/**
 * Create a beacon with collision-safe slug generation
 * IMPORTANT: Requires UNIQUE constraint on beacons.slug
 * Retries up to 5 times on collision before failing
 */
export async function createBeacon(
  input: BeaconCreateInput
): Promise<{ ok: true; beacon: any } | { ok: false; error: string }> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { ok: false, error: 'You must be logged in to create a beacon' };
    }

    // Retry logic for unique slug generation
    const maxTries = 5;
    const slugPrefix = input.type;

    for (let attempt = 0; attempt < maxTries; attempt++) {
      const code = makeSlug(slugPrefix, 8);

      const payloadBase = {
        type: input.type,
        title: input.title,
        description: input.description ?? null,
        city_id: input.city_id || 'london',
        host_type: input.host_type || 'approved_host',
        start_at: input.start_at || null,
        end_at: input.end_at || null,
        status: 'draft',
        creator_id: user.id,
        created_by: user.id,
      };

      // Prefer modern/legacy beacon schemas that use `code`.
      // If the backend happens to use `slug`, fall back.
      let data: any = null;
      let error: any = null;
      {
        const res = await supabase
          .from('beacons')
          .insert({ ...payloadBase, code })
          .select('id, code, type, title, status, created_at')
          .single();
        data = res.data;
        error = res.error;
      }

      if (error?.message?.toLowerCase?.().includes('code')) {
        const res = await supabase
          .from('beacons')
          .insert({ ...payloadBase, slug: code })
          .select('id, slug, type, title, status, created_at')
          .single();
        data = res.data;
        error = res.error;
      }

      if (!error && data) {
        return { ok: true, beacon: data };
      }

      // Check if this is a unique constraint violation
      const msg = error?.message || '';
      const isUniqueCollision =
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('unique') ||
        msg.toLowerCase().includes('23505'); // PostgreSQL unique violation code

      if (!isUniqueCollision) {
        // Not a collision - this is a real error
        return { ok: false, error: msg || 'Create failed.' };
      }

      // Collision detected - retry with new slug
      if (import.meta.env.DEV) {
        console.log(`[BeaconService] Beacon slug collision on attempt ${attempt + 1}, retrying...`);
      }
    }

    return {
      ok: false,
      error: "Couldn't generate a unique slug after 5 attempts. Try again.",
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Failed to create beacon' };
  }
}

/**
 * Get a single beacon by ID or slug
 */
export async function getBeacon(
  idOrSlug: string
): Promise<{ ok: true; beacon: any } | { ok: false; error: string }> {
  try {
    // Try to fetch by code/slug, or by ID.
    let query = supabase.from('beacons').select('*');
    
    // Check if it's a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    if (isUUID) {
      query = query.eq('id', idOrSlug);
    } else {
      // Prefer `code` (beacon system), fall back to `slug` (legacy UI).
      query = query.eq('code', idOrSlug);
    }

    let { data, error } = await query.single();
    if (error?.message?.toLowerCase?.().includes('code') && !isUUID) {
      ({ data, error } = await supabase.from('beacons').select('*').eq('slug', idOrSlug).single());
    }

    if (error) {
      return { ok: false, error: error.message || 'Beacon not found' };
    }

    return { ok: true, beacon: data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Failed to fetch beacon' };
  }
}

/**
 * Get beacons with optional filters
 */
export async function getBeacons(
  filters?: BeaconFilters
): Promise<{ ok: true; beacons: any[] } | { ok: false; error: string }> {
  try {
    let query = supabase.from('beacons').select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.city_id) {
      query = query.eq('city_id', filters.city_id);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return { ok: false, error: error.message || 'Failed to fetch beacons' };
    }

    return { ok: true, beacons: data || [] };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Failed to fetch beacons' };
  }
}

/**
 * Update a beacon
 */
export async function updateBeacon(
  idOrSlug: string,
  updates: BeaconUpdateInput
): Promise<{ ok: true; beacon: any } | { ok: false; error: string }> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { ok: false, error: 'You must be logged in to update a beacon' };
    }

    // Check if it's a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    };

    let query = supabase.from('beacons').update(payload).select();
    
    if (isUUID) {
      query = query.eq('id', idOrSlug);
    } else {
      // Prefer `code` (beacon system), fall back to `slug` (legacy UI).
      query = query.eq('code', idOrSlug);
    }

    let { data, error } = await query.single();
    if (error?.message?.toLowerCase?.().includes('code') && !isUUID) {
      ({ data, error } = await supabase.from('beacons').update(payload).select().eq('slug', idOrSlug).single());
    }

    if (error) {
      return { ok: false, error: error.message || 'Failed to update beacon' };
    }

    return { ok: true, beacon: data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Failed to update beacon' };
  }
}

/**
 * Delete a beacon (soft delete by setting status to 'archived')
 */
export async function deleteBeacon(
  idOrSlug: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { ok: false, error: 'You must be logged in to delete a beacon' };
    }

    // Soft delete: set status to 'archived'
    const result = await updateBeacon(idOrSlug, { status: 'archived' });
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Failed to delete beacon' };
  }
}

/**
 * Record a beacon scan
 */
export async function scanBeacon(
  beaconId: string,
  userId?: string
): Promise<{ ok: true; scan: any; xpAwarded: number } | { ok: false; error: string }> {
  try {
    // Get beacon first
    const beaconResult = await getBeacon(beaconId);
    if (!beaconResult.ok) {
      return { ok: false, error: 'Beacon not found' };
    }

    const beacon = beaconResult.beacon;

    // Check if beacon is active/live
    if (beacon.status !== 'live') {
      return { ok: false, error: 'This beacon is not currently active' };
    }

    // Get current user if not provided
    let scannerUserId = userId;
    if (!scannerUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      scannerUserId = user?.id;
    }

    // Create scan record
    const scanData = {
      beacon_id: beacon.id,
      token_hash: beacon.slug, // Using slug as token for now
      scanner_profile_id: scannerUserId || null,
      city_id: beacon.city_id,
      status: 'valid',
      scanned_at: new Date().toISOString(),
    };

    const { data: scan, error: scanError } = await supabase
      .from('beacon_scans')
      .insert(scanData)
      .select()
      .single();

    if (scanError) {
      return { ok: false, error: scanError.message || 'Failed to record scan' };
    }

    // Update beacon scan count
    const { error: updateError } = await supabase
      .from('beacons')
      .update({ 
        scan_count: (beacon.scan_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', beacon.id);

    if (updateError) {
      console.error('Failed to update beacon scan count:', updateError);
    }

    // Award XP if user is logged in
    let xpAwarded = 0;
    if (scannerUserId) {
      // Base XP for beacon scan
      const baseXP = 10;
      xpAwarded = baseXP;

      // Create XP event
      const { error: xpError } = await supabase
        .from('xp_events')
        .insert({
          actor_id: scannerUserId,
          event_type: 'beacon_scan',
          points: xpAwarded,
          metadata: {
            beacon_id: beacon.id,
            beacon_slug: beacon.slug,
            beacon_type: beacon.type,
          },
        });

      if (xpError) {
        console.error('Failed to award XP:', xpError);
      }
    }

    return { ok: true, scan, xpAwarded };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Failed to scan beacon' };
  }
}

/**
 * Get scan analytics for a beacon
 */
export async function getBeaconScans(
  beaconId: string
): Promise<{ ok: true; scans: any[]; totalScans: number } | { ok: false; error: string }> {
  try {
    // Get beacon first to verify access
    const beaconResult = await getBeacon(beaconId);
    if (!beaconResult.ok) {
      return { ok: false, error: 'Beacon not found' };
    }

    const beacon = beaconResult.beacon;

    // Fetch scans for this beacon
    const { data: scans, error } = await supabase
      .from('beacon_scans')
      .select('*')
      .eq('beacon_id', beacon.id)
      .order('scanned_at', { ascending: false });

    if (error) {
      return { ok: false, error: error.message || 'Failed to fetch scans' };
    }

    return {
      ok: true,
      scans: scans || [],
      totalScans: scans?.length || 0,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Failed to fetch beacon scans' };
  }
}
