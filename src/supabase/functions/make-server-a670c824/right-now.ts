/**
 * RIGHT NOW API - Matches frontend contract exactly
 * GET  /right-now/feed?mode=X&city=Y → { posts: RightNowPost[], serverTime: string }
 * POST /right-now → RightNowPost
 * DELETE /right-now/:id → void
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Types matching frontend exactly
type RightNowMode = 'hookup' | 'crowd' | 'drop' | 'ticket' | 'radio' | 'care';

interface RightNowPost {
  id: string;
  userId: string;
  mode: RightNowMode;
  city: string;
  geoBin?: string | null;
  headline: string;
  body?: string | null;
  distanceKm?: number | null;
  xpBoost?: number | null;
  sponsored?: boolean;
  nearParty?: boolean;
  expiresAt: string;
  createdAt: string;
  safetyFlags?: string[] | null;
  membershipTier?: 'FREE' | 'HNH' | 'ICON' | 'VENDOR' | 'SPONSOR';
}

interface RightNowFeedResponse {
  posts: RightNowPost[];
  serverTime: string;
}

interface CreateRightNowPayload {
  mode: RightNowMode;
  headline: string;
  body?: string;
  city: string;
}

// =====================================================
// HELPERS
// =====================================================

function getUserIdFromAuth(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  // For anon key, return a temporary ID
  // In production with real auth, decode JWT to get user_id
  if (token === Deno.env.get('SUPABASE_ANON_KEY')) {
    // Anon user - create temp ID from IP
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    return `anon_${ip.replace(/\./g, '_')}`;
  }
  
  // TODO: Decode JWT properly
  return token.substring(0, 36); // Temporary - use first 36 chars as mock user ID
}

function binLocation(lat: number, lng: number): string {
  // Bin to ~100m precision (0.001 degrees ≈ 111m)
  const latBin = Math.round(lat * 1000) / 1000;
  const lngBin = Math.round(lng * 1000) / 1000;
  return `${latBin},${lngBin}`;
}

function calculateExpiry(ttlMinutes: number = 30): string {
  return new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
}

// Map DB row to frontend type
function mapDbPostToFrontend(row: any): RightNowPost {
  return {
    id: row.id,
    userId: row.user_id,
    mode: row.mode as RightNowMode,
    city: row.city,
    geoBin: row.geo_hash,
    headline: row.text, // Map 'text' to 'headline'
    body: row.body || null,
    distanceKm: row.distance_km || null,
    xpBoost: row.xp_boost || null,
    sponsored: row.sponsored || false,
    nearParty: row.near_party || false,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    safetyFlags: row.safety_flags || null,
    membershipTier: mapMembershipTier(row.membership_tier),
  };
}

function mapMembershipTier(tier: string | null): 'FREE' | 'HNH' | 'ICON' | 'VENDOR' | 'SPONSOR' | undefined {
  if (!tier) return 'FREE';
  return tier.toUpperCase() as any;
}

// =====================================================
// GET /right-now/feed
// =====================================================

export async function handleGetFeed(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') as RightNowMode | 'all' | null;
  const city = url.searchParams.get('city') || 'London';
  
  try {
    // Build query
    let query = supabase
      .from('right_now_posts')
      .select(`
        *,
        profiles!user_id(membership_tier)
      `)
      .eq('city', city)
      .is('deleted_at', null)
      .gt('expires_at', new Date().toISOString())
      .in('moderation_status', ['pending', 'approved'])
      .order('created_at', { ascending: false })
      .limit(50);
    
    // Filter by mode if not 'all'
    if (mode && mode !== 'all') {
      query = query.eq('mode', mode);
    }
    
    const { data: rows, error } = await query;
    
    if (error) {
      console.error('Feed query error:', error);
      return Response.json(
        { posts: [], serverTime: new Date().toISOString() },
        { status: 200 } // Return empty feed instead of error
      );
    }
    
    // Map to frontend format
    const posts: RightNowPost[] = (rows || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      mode: row.mode as RightNowMode,
      city: row.city,
      geoBin: row.geo_hash,
      headline: row.text,
      body: null, // Not stored separately in our schema
      distanceKm: null, // Calculate in future with user location
      xpBoost: null,
      sponsored: row.sponsored || false,
      nearParty: row.near_party || false,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      safetyFlags: Array.isArray(row.safety_flags) ? row.safety_flags : null,
      membershipTier: row.profiles?.membership_tier?.toUpperCase() || 'FREE',
    }));
    
    const response: RightNowFeedResponse = {
      posts,
      serverTime: new Date().toISOString(),
    };
    
    return Response.json(response);
  } catch (err) {
    console.error('Feed error:', err);
    return Response.json(
      { posts: [], serverTime: new Date().toISOString() },
      { status: 200 }
    );
  }
}

// =====================================================
// POST /right-now
// =====================================================

export async function handleCreatePost(req: Request): Promise<Response> {
  const userId = getUserIdFromAuth(req);
  if (!userId) {
    return Response.json(
      { error: 'Unauthorized - sign in to post' },
      { status: 401 }
    );
  }
  
  try {
    const payload: CreateRightNowPayload = await req.json();
    const { mode, headline, body, city } = payload;
    
    // Validation
    if (!mode || !headline || !city) {
      return Response.json(
        { error: 'Missing required fields: mode, headline, city' },
        { status: 400 }
      );
    }
    
    if (headline.length > 80) {
      return Response.json(
        { error: 'Headline must be ≤80 characters' },
        { status: 400 }
      );
    }
    
    if (body && body.length > 280) {
      return Response.json(
        { error: 'Body must be ≤280 characters' },
        { status: 400 }
      );
    }
    
    // Check user's active post count (membership limits)
    const { data: profile } = await supabase
      .from('profiles')
      .select('membership_tier')
      .eq('id', userId)
      .single();
    
    const membershipTier = profile?.membership_tier || 'free';
    const postLimits: Record<string, number> = {
      free: 1,
      hnh: 2,
      vendor: 2,
      sponsor: 3,
      icon: 3,
    };
    
    const maxPosts = postLimits[membershipTier] || 1;
    
    const { count: activePosts } = await supabase
      .from('right_now_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('deleted_at', null)
      .gt('expires_at', new Date().toISOString());
    
    if ((activePosts || 0) >= maxPosts) {
      return Response.json({
        error: `Post limit reached. ${membershipTier.toUpperCase()} members can have ${maxPosts} active post(s). Upgrade or wait for your current posts to expire.`,
      }, { status: 403 });
    }
    
    // Calculate TTL based on membership (30-60 min)
    const ttlMinutes = membershipTier === 'free' ? 30 : 60;
    const expiresAt = calculateExpiry(ttlMinutes);
    
    // Create post
    const { data: post, error } = await supabase
      .from('right_now_posts')
      .insert({
        user_id: userId,
        mode,
        text: headline, // Store headline in 'text' field
        city,
        ttl_minutes: ttlMinutes,
        expires_at: expiresAt,
        visibility: 'near', // Default to 3km visibility
        show_in_globe: true,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Create post error:', error);
      return Response.json(
        { error: `Failed to create post: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Award XP
    const xpAmounts: Record<RightNowMode, number> = {
      hookup: 15,
      crowd: 20,
      drop: 10,
      ticket: 10,
      radio: 15,
      care: 25,
    };
    
    try {
      await supabase.rpc('award_xp', {
        p_user_id: userId,
        p_event_type: 'post_right_now',
        p_xp_amount: xpAmounts[mode],
        p_related_id: post.id,
        p_related_type: 'right_now_post',
        p_city: city,
      });
    } catch (xpError) {
      console.error('XP award error:', xpError);
      // Don't fail the post creation if XP fails
    }
    
    // Return mapped post
    const frontendPost: RightNowPost = {
      id: post.id,
      userId: post.user_id,
      mode: post.mode as RightNowMode,
      city: post.city,
      geoBin: post.geo_hash,
      headline: post.text,
      body: null,
      distanceKm: null,
      xpBoost: null,
      sponsored: false,
      nearParty: post.near_party || false,
      expiresAt: post.expires_at,
      createdAt: post.created_at,
      safetyFlags: null,
      membershipTier: membershipTier.toUpperCase() as any,
    };
    
    return Response.json(frontendPost, { status: 201 });
  } catch (err) {
    console.error('Create post error:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to create post' },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /right-now/:id
// =====================================================

export async function handleDeletePost(req: Request, postId: string): Promise<Response> {
  const userId = getUserIdFromAuth(req);
  if (!userId) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Soft delete
    const { error } = await supabase
      .from('right_now_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', postId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Delete error:', error);
      return Response.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }
    
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('Delete error:', err);
    return Response.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
