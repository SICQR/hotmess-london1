/**
 * HOTMESS LONDON — Beacon Creation Service
 * Collision-safe code generation with retries + RLS-based inserts
 */

import { supabase } from '../supabase';

export type BeaconCreateInput = {
  type: string;
  title: string;
  description?: string | null;
  lat: number;
  lng: number;
  radius_m: number;
  starts_at: string; // ISO
  ends_at: string; // ISO
  requires_gps: boolean;
  premium_required: boolean;
  config: Record<string, any>;
};

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Browser-safe random code generator
 * Uses crypto.getRandomValues for cryptographic randomness
 */
function makeCode(len = 8): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < len; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/**
 * Create a beacon with collision-safe code generation
 * IMPORTANT: Requires UNIQUE constraint on beacons.code
 * Retries up to 5 times on collision before failing
 */
export async function createBeacon(
  input: BeaconCreateInput
): Promise<{ ok: true; beacon: any } | { ok: false; error: string }> {
  // Clamp radius to safe bounds
  const radius_m = Math.max(25, Math.min(5000, Math.round(input.radius_m || 150)));

  // Retry logic for unique code generation
  const maxTries = 5;

  for (let attempt = 0; attempt < maxTries; attempt++) {
    const code = makeCode(8);

    const payload = {
      code,
      type: input.type,
      title: input.title,
      description: input.description ?? null,
      geo_lat: input.lat,
      geo_lng: input.lng,
      radius_m,
      starts_at: input.starts_at,
      ends_at: input.ends_at,
      requires_gps: input.requires_gps,
      config: input.config ?? {},
      status: 'active',
      // owner_id is set by RLS/trigger - DO NOT set from client
      // xp_amount, max_scans_per_user_per_day can be added if your schema has them
    };

    const { data, error } = await supabase
      .from('beacons')
      .insert(payload)
      .select('id, code, type, title')
      .single();

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

    // Collision detected - retry with new code
    console.log(`Beacon code collision on attempt ${attempt + 1}, retrying...`);
  }

  return {
    ok: false,
    error: "Couldn't generate a unique code after 5 attempts. Try again.",
  };
}

/**
 * Optional: Edge Function version
 * Use this if you want server-side validation + owner_id injection
 * 
 * Example:
 * const { data, error } = await supabase.functions.invoke('make-server-a670c824/beacons/create', {
 *   body: input
 * });
 */
export async function createBeaconViaEdgeFunction(
  input: BeaconCreateInput
): Promise<{ ok: true; beacon: any } | { ok: false; error: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('make-server-a670c824', {
      body: {
        action: 'create-beacon',
        ...input,
      },
    });

    if (error) throw error;
    if (!data?.beacon) throw new Error('No beacon returned from server');

    return { ok: true, beacon: data.beacon };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Server error' };
  }
}
