/**
 * BEACON STORE
 * Database helpers for beacon system + XP ledger + scan tracking
 * 
 * Tables (create via Supabase UI or SQL):
 * - beacons
 * - beacon_scans
 * - xp_ledger
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Export supabase client for use in helper functions
export function getSupabaseClient() {
  return supabase;
}

// ============================================================================
// TYPES
// ============================================================================

export type BeaconType = 
  | 'checkin' 
  | 'ticket' 
  | 'product' 
  | 'drop' 
  | 'event' 
  | 'chat' 
  | 'vendor' 
  | 'reward' 
  | 'sponsor';

export type BeaconStatus = 'draft' | 'active' | 'paused' | 'expired';

export interface Beacon {
  id: string;
  code: string; // short unique code
  type: BeaconType;
  owner_id: string | null;
  status: BeaconStatus;
  title: string;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
  
  // Geo
  geo_lat: number | null;
  geo_lng: number | null;
  city_slug: string | null;
  
  // Limits & XP
  xp_amount: number;
  max_scans_total: number | null;
  max_scans_per_user_per_day: number | null;
  
  // References
  sponsor_id: string | null;
  chat_room_id: string | null;
  
  // Routing
  redirect_url: string;
  redirect_fallback: string | null;
  utm_json: Record<string, string> | null;
  
  created_at: string;
  updated_at: string;
}

export type ScanResult = 
  | 'accepted' 
  | 'rejected' 
  | 'duplicate' 
  | 'expired' 
  | 'rate_limited' 
  | 'quota_exceeded';

export interface BeaconScan {
  id: string;
  beacon_id: string;
  user_id: string | null;
  device_hash: string;
  city_slug: string | null;
  geo_lat: number | null;
  geo_lng: number | null;
  scanned_at: string;
  result: ScanResult;
  reason_code: string | null;
  ip_hash: string | null;
}

export type XPKind = 
  | 'scan' 
  | 'purchase' 
  | 'post' 
  | 'referral' 
  | 'bonus' 
  | 'admin_adjustment';

export interface XPEntry {
  id: string;
  user_id: string;
  kind: XPKind;
  amount: number;
  beacon_id: string | null;
  ref_id: string | null; // order_id / listing_id / post_id
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ============================================================================
// BEACON CRUD
// ============================================================================

export async function createBeacon(data: Omit<Beacon, 'id' | 'created_at' | 'updated_at'>) {
  const { data: beacon, error } = await supabase
    .from('beacons')
    .insert({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw new Error(`Create beacon failed: ${error.message}`);
  return beacon as Beacon;
}

export async function getBeaconByCode(code: string): Promise<Beacon | null> {
  const { data, error } = await supabase
    .from('beacons')
    .select('*')
    .eq('code', code)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Get beacon failed: ${error.message}`);
  }
  
  return data as Beacon;
}

export async function getBeaconById(id: string): Promise<Beacon | null> {
  const { data, error } = await supabase
    .from('beacons')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Get beacon failed: ${error.message}`);
  }
  
  return data as Beacon;
}

export async function updateBeacon(id: string, updates: Partial<Beacon>) {
  const { data, error } = await supabase
    .from('beacons')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(`Update beacon failed: ${error.message}`);
  return data as Beacon;
}

export async function listBeacons(filters?: {
  status?: BeaconStatus;
  type?: BeaconType;
  owner_id?: string;
  city_slug?: string;
  limit?: number;
}): Promise<Beacon[]> {
  let query = supabase
    .from('beacons')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.owner_id) query = query.eq('owner_id', filters.owner_id);
  if (filters?.city_slug) query = query.eq('city_slug', filters.city_slug);
  if (filters?.limit) query = query.limit(filters.limit);
  
  const { data, error } = await query;
  
  if (error) throw new Error(`List beacons failed: ${error.message}`);
  return (data as Beacon[]) || [];
}

export async function getActiveBeaconsWithGeo(): Promise<Beacon[]> {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('beacons')
    .select('*')
    .eq('status', 'active')
    .not('geo_lat', 'is', null)
    .not('geo_lng', 'is', null)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`);
  
  if (error) {
    // Gracefully handle missing table (migration not run yet)
    if (error.code === '42P01') {
      console.log('Beacons table does not exist yet - run migration first');
      return [];
    }
    throw new Error(`Get active beacons failed: ${error.message}`);
  }
  return (data as Beacon[]) || [];
}

// ============================================================================
// SCAN TRACKING
// ============================================================================

export async function recordScan(scan: Omit<BeaconScan, 'id'>) {
  const { data, error } = await supabase
    .from('beacon_scans')
    .insert({
      ...scan,
      scanned_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw new Error(`Record scan failed: ${error.message}`);
  return data as BeaconScan;
}

export async function getUserScanCount(userId: string, beaconId: string, since: Date): Promise<number> {
  const { count, error } = await supabase
    .from('beacon_scans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('beacon_id', beaconId)
    .eq('result', 'accepted')
    .gte('scanned_at', since.toISOString());
  
  if (error) throw new Error(`Get scan count failed: ${error.message}`);
  return count || 0;
}

export async function getBeaconTotalScans(beaconId: string): Promise<number> {
  const { count, error } = await supabase
    .from('beacon_scans')
    .select('*', { count: 'exact', head: true })
    .eq('beacon_id', beaconId)
    .eq('result', 'accepted');
  
  if (error) throw new Error(`Get total scans failed: ${error.message}`);
  return count || 0;
}

export async function getRecentScans(limit = 50): Promise<BeaconScan[]> {
  const { data, error } = await supabase
    .from('beacon_scans')
    .select('*')
    .order('scanned_at', { ascending: false })
    .limit(limit);
  
  if (error) throw new Error(`Get recent scans failed: ${error.message}`);
  return (data as BeaconScan[]) || [];
}

// ============================================================================
// XP LEDGER
// ============================================================================

export async function awardXP(entry: Omit<XPEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('xp_ledger')
    .insert({
      ...entry,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw new Error(`Award XP failed: ${error.message}`);
  return data as XPEntry;
}

export async function getUserXPTotal(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('xp_ledger')
    .select('amount')
    .eq('user_id', userId);
  
  if (error) throw new Error(`Get XP total failed: ${error.message}`);
  
  return (data || []).reduce((sum, entry) => sum + entry.amount, 0);
}

export async function getUserXPHistory(userId: string, limit = 50): Promise<XPEntry[]> {
  const { data, error } = await supabase
    .from('xp_ledger')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw new Error(`Get XP history failed: ${error.message}`);
  return (data as XPEntry[]) || [];
}

// Check if XP was already awarded (for deduplication)
export async function checkXPAwarded(
  beaconId: string,
  identifier: string, // userId or deviceHash
  type: 'view' | 'action',
  sinceDate: string | null // null = no time limit (action), date = since date (view)
): Promise<boolean> {
  let query = supabase
    .from('xp_ledger')
    .select('id')
    .eq('beacon_id', beaconId)
    .eq('type', type);

  // Check by userId OR deviceHash
  query = query.or(`user_id.eq.${identifier},device_hash.eq.${identifier}`);

  // If time limit specified, check since date
  if (sinceDate) {
    query = query.gte('created_at', sinceDate);
  }

  const { data, error } = await query.limit(1);

  if (error) {
    console.error('Check XP awarded error:', error);
    return false;
  }

  return (data && data.length > 0);
}

// Log a beacon scan (for analytics + tracking)
export async function logScan(entry: {
  beaconId: string;
  userId: string | null;
  deviceHash: string | null;
  source: string;
  roomId: string | null;
  geoLat: number | null;
  geoLng: number | null;
  result: string;
}) {
  const { error } = await supabase
    .from('beacon_scans')
    .insert({
      beacon_id: entry.beaconId,
      user_id: entry.userId,
      device_hash: entry.deviceHash,
      source: entry.source,
      room_id: entry.roomId,
      geo_lat: entry.geoLat,
      geo_lng: entry.geoLng,
      result: entry.result,
      scanned_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Log scan error:', error);
    throw new Error(`Log scan failed: ${error.message}`);
  }
}

// ============================================================================
// ANALYTICS
// ============================================================================

export async function getBeaconStats(beaconId: string) {
  const beacon = await getBeaconById(beaconId);
  if (!beacon) throw new Error('Beacon not found');
  
  const totalScans = await getBeaconTotalScans(beaconId);
  
  const { data: uniqueUsers, error: uniqueError } = await supabase
    .from('beacon_scans')
    .select('user_id')
    .eq('beacon_id', beaconId)
    .eq('result', 'accepted')
    .not('user_id', 'is', null);
  
  if (uniqueError) throw new Error(`Get unique users failed: ${uniqueError.message}`);
  
  const uniqueUserCount = new Set((uniqueUsers || []).map(s => s.user_id)).size;
  
  const { data: xpAwarded, error: xpError } = await supabase
    .from('xp_ledger')
    .select('amount')
    .eq('beacon_id', beaconId);
  
  if (xpError) throw new Error(`Get XP awarded failed: ${xpError.message}`);
  
  const totalXP = (xpAwarded || []).reduce((sum, entry) => sum + entry.amount, 0);
  
  return {
    beacon,
    totalScans,
    uniqueUsers: uniqueUserCount,
    totalXPAwarded: totalXP,
  };
}

export async function getGlobalStats() {
  try {
    // Active beacons
    const { count: activeBeacons, error: beaconError } = await supabase
      .from('beacons')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (beaconError && beaconError.code !== '42P01') {
      throw new Error(`Get active beacons failed: ${beaconError.message}`);
    }
    
    // Today's scans
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: todayScans, error: scanError } = await supabase
      .from('beacon_scans')
      .select('*', { count: 'exact', head: true })
      .eq('result', 'accepted')
      .gte('scanned_at', today.toISOString());
    
    if (scanError && scanError.code !== '42P01') {
      throw new Error(`Get today scans failed: ${scanError.message}`);
    }
    
    // Total XP awarded
    const { data: xpData, error: xpError } = await supabase
      .from('xp_ledger')
      .select('amount');
    
    if (xpError && xpError.code !== '42P01') {
      throw new Error(`Get total XP failed: ${xpError.message}`);
    }
    
    const totalXP = (xpData || []).reduce((sum, entry) => sum + entry.amount, 0);
    
    return {
      activeBeacons: activeBeacons || 0,
      scansToday: todayScans || 0,
      totalXPAwarded: totalXP,
      tablesExist: !beaconError,
    };
  } catch (error) {
    // If tables don't exist, return zeros with flag
    console.log('Tables not set up yet:', error);
    return {
      activeBeacons: 0,
      scansToday: 0,
      totalXPAwarded: 0,
      tablesExist: false,
    };
  }
}