/**
 * HOTMESS LONDON - UNIFIED OS API
 * 
 * RIGHT NOW + Party Beacons + Heat Map + XP
 * Single endpoint that powers the entire platform
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// =====================================================
// HELPERS
// =====================================================

function getUserFromAuth(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  // In production, verify JWT here
  return token;
}

function binLocation(lat: number, lng: number, precision: number = 0.01): { lat_bin: number, lng_bin: number } {
  return {
    lat_bin: Math.round(lat / precision) * precision,
    lng_bin: Math.round(lng / precision) * precision,
  };
}

function geoHashFromCoords(lat: number, lng: number): string {
  // Simple geohash (in production use proper geohash library)
  const latBin = Math.floor((lat + 90) / 0.01);
  const lngBin = Math.floor((lng + 180) / 0.01);
  return `${latBin}_${lngBin}`;
}

// =====================================================
// RIGHT NOW ENDPOINTS
// =====================================================

async function getRightNowFeed(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get('city') || 'London';
  const mode = url.searchParams.get('mode'); // hookup, crowd, care, etc
  const radius_km = parseInt(url.searchParams.get('radius_km') || '10');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  
  let query = supabase
    .from('right_now_posts')
    .select(`
      *,
      user:profiles!user_id(
        display_name,
        xp_tier,
        membership_tier
      )
    `)
    .eq('city', city)
    .is('deleted_at', null)
    .gt('expires_at', new Date().toISOString())
    .in('moderation_status', ['pending', 'approved'])
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (mode) {
    query = query.eq('mode', mode);
  }
  
  const { data: posts, error } = await query;
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Calculate heat scores
  const enrichedPosts = posts.map(post => ({
    ...post,
    heat_score: 10 + (post.view_count || 0) + ((post.reply_count || 0) * 3),
    time_remaining_minutes: Math.max(0, Math.floor(
      (new Date(post.expires_at).getTime() - Date.now()) / 60000
    )),
  }));
  
  return new Response(JSON.stringify({
    posts: enrichedPosts,
    total: enrichedPosts.length,
    city,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createRightNowPost(req: Request) {
  const userId = getUserFromAuth(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const body = await req.json();
  const {
    mode,
    text,
    city,
    lat,
    lng,
    ttl_minutes = 30,
    visibility = 'near',
    show_in_globe = true,
    telegram_mirror = false,
  } = body;
  
  // Validation
  if (!mode || !text || !city) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  if (text.length > 120) {
    return new Response(JSON.stringify({ error: 'Text must be ≤120 characters' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Check user's post limit based on membership
  const { data: profile } = await supabase
    .from('profiles')
    .select('membership_tier, xp_tier')
    .eq('id', userId)
    .single();
  
  const postLimits: Record<string, number> = {
    free: 1,
    hnh: 2,
    vendor: 2,
    sponsor: 3,
    icon: 3,
  };
  
  const maxPosts = postLimits[profile?.membership_tier || 'free'];
  
  const { count: activePosts } = await supabase
    .from('right_now_posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('deleted_at', null)
    .gt('expires_at', new Date().toISOString());
  
  if ((activePosts || 0) >= maxPosts) {
    return new Response(JSON.stringify({ 
      error: `Post limit reached. ${profile?.membership_tier.toUpperCase()} members can have ${maxPosts} active post(s).`,
    }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Bin location for privacy
  const locationBins = lat && lng ? binLocation(lat, lng) : { lat_bin: null, lng_bin: null };
  const geoHash = lat && lng ? geoHashFromCoords(lat, lng) : null;
  
  // Calculate expiry
  const expiresAt = new Date(Date.now() + ttl_minutes * 60 * 1000).toISOString();
  
  // Check if near a party
  let nearParty = false;
  let partyBeaconId = null;
  
  if (lat && lng) {
    const { data: nearbyParties } = await supabase
      .from('party_beacons')
      .select('id')
      .eq('city', city)
      .is('deleted_at', null)
      .gt('end_time', new Date().toISOString())
      .limit(1);
    
    // Simple proximity check (in production use PostGIS)
    if (nearbyParties && nearbyParties.length > 0) {
      nearParty = true;
      partyBeaconId = nearbyParties[0].id;
    }
  }
  
  // Create post
  const { data: post, error } = await supabase
    .from('right_now_posts')
    .insert({
      user_id: userId,
      mode,
      text,
      city,
      geo_hash: geoHash,
      lat_bin: locationBins.lat_bin,
      lng_bin: locationBins.lng_bin,
      near_party: nearParty,
      party_beacon_id: partyBeaconId,
      ttl_minutes,
      expires_at: expiresAt,
      visibility,
      show_in_globe,
      telegram_mirrored: telegram_mirror,
    })
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Award XP
  const xpAmounts: Record<string, number> = {
    hookup: 15,
    crowd: 20,
    drop: 10,
    ticket: 10,
    radio: 15,
    care: 25, // Highest XP for care posts
  };
  
  await supabase.rpc('award_xp', {
    p_user_id: userId,
    p_event_type: 'post_right_now',
    p_xp_amount: xpAmounts[mode] || 15,
    p_related_id: post.id,
    p_related_type: 'right_now_post',
    p_city: city,
  });
  
  return new Response(JSON.stringify({
    post,
    xp_awarded: xpAmounts[mode] || 15,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function deleteRightNowPost(req: Request, postId: string) {
  const userId = getUserFromAuth(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const { error } = await supabase
    .from('right_now_posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', postId)
    .eq('user_id', userId);
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// =====================================================
// PARTY BEACON ENDPOINTS
// =====================================================

async function getPartyBeacons(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get('city') || 'London';
  const active_only = url.searchParams.get('active_only') === 'true';
  
  let query = supabase
    .from('party_beacons')
    .select(`
      *,
      host:profiles!host_id(
        display_name,
        xp_tier,
        membership_tier
      )
    `)
    .eq('city', city)
    .is('deleted_at', null)
    .order('start_time', { ascending: false });
  
  if (active_only) {
    query = query
      .lte('start_time', new Date().toISOString())
      .gte('end_time', new Date().toISOString());
  }
  
  const { data: beacons, error } = await query;
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({
    beacons,
    total: beacons.length,
    city,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createPartyBeacon(req: Request) {
  const userId = getUserFromAuth(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const body = await req.json();
  const {
    name,
    description,
    venue_name,
    venue_type = 'flat',
    city,
    lat,
    lng,
    start_time,
    end_time,
    capacity_max,
    rules,
    entry_requirements = ['18+', 'men-only'],
    visibility = 'public',
  } = body;
  
  // Generate QR code
  const qrCode = `party_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Bin location
  const locationBins = binLocation(lat, lng);
  const geoHash = geoHashFromCoords(lat, lng);
  
  const { data: beacon, error } = await supabase
    .from('party_beacons')
    .insert({
      host_id: userId,
      name,
      description,
      venue_name,
      venue_type,
      city,
      lat,
      lng,
      lat_bin: locationBins.lat_bin,
      lng_bin: locationBins.lng_bin,
      geo_hash: geoHash,
      start_time,
      end_time,
      capacity_max,
      rules,
      entry_requirements,
      visibility,
      qr_code: qrCode,
    })
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Award XP to host
  await supabase.rpc('award_xp', {
    p_user_id: userId,
    p_event_type: 'create_party_beacon',
    p_xp_amount: 100,
    p_related_id: beacon.id,
    p_related_type: 'party_beacon',
    p_city: city,
  });
  
  return new Response(JSON.stringify({
    beacon,
    qr_url: `${Deno.env.get('APP_BASE_URL') || 'https://hotmess.london'}/party/${qrCode}`,
    xp_awarded: 100,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function scanPartyBeacon(req: Request, qrCode: string) {
  const userId = getUserFromAuth(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Get beacon
  const { data: beacon, error: beaconError } = await supabase
    .from('party_beacons')
    .select('*')
    .eq('qr_code', qrCode)
    .single();
  
  if (beaconError || !beacon) {
    return new Response(JSON.stringify({ error: 'Beacon not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Check if party is active
  const now = new Date();
  const startTime = new Date(beacon.start_time);
  const endTime = new Date(beacon.end_time);
  
  if (now < startTime || now > endTime) {
    return new Response(JSON.stringify({ error: 'Party is not active' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Record scan
  const { data: scan, error: scanError } = await supabase
    .from('party_beacon_scans')
    .insert({
      beacon_id: beacon.id,
      user_id: userId,
      geo_hash: beacon.geo_hash,
    })
    .select()
    .single();
  
  if (scanError) {
    // Might be duplicate scan
    return new Response(JSON.stringify({ 
      error: 'Already scanned',
      beacon,
    }), {
      status: 200, // Not an error, just informational
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({
    scan,
    beacon,
    xp_awarded: beacon.xp_per_scan || 15,
    message: 'Scan successful! You\'re in.',
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// =====================================================
// HEAT MAP ENDPOINT
// =====================================================

async function getHeatMap(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get('city');
  const min_heat = parseInt(url.searchParams.get('min_heat') || '10');
  
  let query = supabase
    .from('heat_map_bins')
    .select('*')
    .gte('total_heat', min_heat)
    .order('total_heat', { ascending: false })
    .limit(500);
  
  if (city) {
    query = query.eq('city', city);
  }
  
  const { data: heatBins, error } = await query;
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({
    heat_bins: heatBins,
    total: heatBins.length,
    generated_at: new Date().toISOString(),
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// =====================================================
// MAIN HANDLER
// =====================================================

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  const url = new URL(req.url);
  const path = url.pathname.replace('/hotmess-os/', '');
  
  try {
    // RIGHT NOW routes
    if (path === 'right-now' && req.method === 'GET') {
      return await getRightNowFeed(req);
    }
    if (path === 'right-now' && req.method === 'POST') {
      return await createRightNowPost(req);
    }
    if (path.startsWith('right-now/') && req.method === 'DELETE') {
      const postId = path.split('/')[1];
      return await deleteRightNowPost(req, postId);
    }
    
    // Party beacon routes
    if (path === 'party-beacons' && req.method === 'GET') {
      return await getPartyBeacons(req);
    }
    if (path === 'party-beacons' && req.method === 'POST') {
      return await createPartyBeacon(req);
    }
    if (path.startsWith('party-beacons/scan/') && req.method === 'POST') {
      const qrCode = path.split('/')[2];
      return await scanPartyBeacon(req, qrCode);
    }
    
    // Heat map route
    if (path === 'heat-map' && req.method === 'GET') {
      return await getHeatMap(req);
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
