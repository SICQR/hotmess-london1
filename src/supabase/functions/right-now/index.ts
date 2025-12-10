// supabase/functions/right-now/index.ts
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const RATE_LIMIT_HOURLY = 5  // free: 5 posts/hour
const RATE_LIMIT_DAILY  = 20 // free: 20 posts/day

type Mode = 'hookup' | 'crowd' | 'drop' | 'ticket' | 'radio' | 'care'

interface JwtUser {
  sub: string
  role?: string
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

function getAuthUser(req: Request): JwtUser | null {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice('Bearer '.length)
  
  try {
    const [, payloadB64] = token.split('.')
    const payload = JSON.parse(atob(payloadB64))
    return { sub: payload.sub, role: payload.role }
  } catch {
    return null
  }
}

// crude city normaliser
function normaliseCity(city: string | null | undefined) {
  if (!city) return null
  return city.trim().replace(/\s+/g, ' ')
}

// simple coarse geo bin
function calcGeoBin(lat?: number, lng?: number, sizeMeters = 250): string {
  if (lat == null || lng == null) return 'unknown'
  // 0.0025 ≈ 250m at equator, "good enough" for nightlife bins
  const step = 0.0025
  const latBin = Math.round(lat / step) * step
  const lngBin = Math.round(lng / step) * step
  return `${latBin.toFixed(4)}_${lngBin.toFixed(4)}_${sizeMeters}m`
}

// simple scoring
function computeScore(row: any): number {
  const createdAt = new Date(row.created_at).getTime()
  const ageHours = (Date.now() - createdAt) / (1000 * 60 * 60)

  let score = 0

  // membership
  const tier = row.membership_tier || 'free'
  if (tier === 'icon') score += 40
  else if (tier === 'sponsor') score += 30
  else if (tier === 'hnh') score += 20

  // xp band
  const xpBand = row.xp_band || 'fresh'
  if (xpBand === 'icon') score += 30
  else if (xpBand === 'sinner') score += 20
  else if (xpBand === 'regular') score += 10

  // safety bonus
  const flags: string[] = row.safety_flags || []
  if (flags.includes('verified_host')) score += 10

  // near party
  if (row.near_party) score += 15

  // decay with time
  score -= ageHours * 5

  return score
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  const url = new URL(req.url)
  const pathname = url.pathname.replace(/^\/functions\/v1\/right-now/, '') || '/'

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: req.headers.get('Authorization') || '' } },
  })

  const user = getAuthUser(req)

  // 1) GET /right-now (feed)
  if (req.method === 'GET' && pathname === '/') {
    const mode = url.searchParams.get('mode') as Mode | null
    const cityParam = normaliseCity(url.searchParams.get('city'))
    const safeOnly = url.searchParams.get('safeOnly') === 'true'

    console.log('[GET /right-now] Request received:', { mode, city: cityParam, safeOnly, hasUser: !!user })

    // derive city from profile if not passed
    let city = cityParam
    if (!city && user?.sub) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('home_city')
          .eq('id', user.sub)
          .maybeSingle()

        city = normaliseCity(profile?.home_city)
        console.log('[GET /right-now] Derived city from profile:', city)
      } catch (profileError) {
        console.error('[GET /right-now] Profile lookup failed (non-fatal):', profileError)
      }
    }

    // Try view first, fall back to table with filters
    let query = supabase
      .from('right_now_active')
      .select('*')
      .limit(200)

    if (city) {
      query = query.ilike('city', city)
    }

    if (mode) {
      query = query.eq('mode', mode)
    }

    if (safeOnly) {
      query = query.not('safety_flags', 'cs', '{high_risk}')
    }

    let { data, error } = await query

    // If view doesn't exist, fall back to table query
    if (error?.message?.includes('does not exist') || error?.code === '42P01') {
      console.log('[GET /right-now] View not found, querying table directly with filters')
      
      let fallbackQuery = supabase
        .from('right_now_posts')
        .select('*')
        .is('deleted_at', null)
        .gt('expires_at', new Date().toISOString())
        .limit(200)

      if (city) {
        fallbackQuery = fallbackQuery.ilike('city', city)
      }

      if (mode) {
        fallbackQuery = fallbackQuery.eq('mode', mode)
      }

      if (safeOnly) {
        fallbackQuery = fallbackQuery.not('safety_flags', 'cs', '{high_risk}')
      }

      const fallbackResult = await fallbackQuery
      data = fallbackResult.data
      error = fallbackResult.error
    }

    if (error) {
      console.error('[GET /right-now] Database error:', error)
      return json({ error: error.message }, 500)
    }

    console.log('[GET /right-now] Found posts:', data?.length || 0)

    const enriched = (data || []).map((row) => ({
      ...row,
      score: computeScore(row),
    }))
      .sort((a, b) => b.score - a.score)

    return json({ posts: enriched })
  }

  // 2) POST /right-now (create)
  if (req.method === 'POST' && pathname === '/') {
    if (!user?.sub) return json({ error: 'Unauthenticated' }, 401)

    const body = await req.json().catch(() => null)
    if (!body) return json({ error: 'Invalid JSON' }, 400)

    const { mode, headline, text, lat, lng } = body as {
      mode: Mode
      headline: string
      text?: string
      lat?: number
      lng?: number
    }

    if (!mode || !headline) {
      return json({ error: 'mode and headline required' }, 400)
    }

    // profile / gate checks
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('gender, dob, home_city, country, xp_band, membership_tier, shadow_banned')
      .eq('id', user.sub)
      .maybeSingle()

    if (profileErr) return json({ error: profileErr.message }, 500)
    if (!profile) return json({ error: 'Profile incomplete' }, 403)
    if (profile.gender !== 'man') return json({ error: 'Men-only feature' }, 403)
    if (profile.shadow_banned) return json({ error: 'Account restricted' }, 403)

    // age check
    if (profile.dob) {
      const dob = new Date(profile.dob)
      const ageYears = (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000)
      if (ageYears < 18) return json({ error: '18+ only' }, 403)
    }

    const city = normaliseCity(profile.home_city)
    if (!city) return json({ error: 'City required in profile' }, 400)

    // rate limiting (simple, per user)
    const now = new Date().toISOString()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { count: hourCount } = await supabase
      .from('right_now_posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.sub)
      .gte('created_at', oneHourAgo)

    const { count: dayCount } = await supabase
      .from('right_now_posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.sub)
      .gte('created_at', dayAgo)

    if ((hourCount ?? 0) >= RATE_LIMIT_HOURLY) {
      return json({ error: 'Too many posts this hour. Slow down or upgrade to HNH for higher limits.' }, 429)
    }
    if ((dayCount ?? 0) >= RATE_LIMIT_DAILY) {
      return json({ error: 'Too many posts today. Come back tomorrow or upgrade to HNH.' }, 429)
    }

    const geoBin = calcGeoBin(lat, lng)

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 60m TTL

    const { data: inserted, error: insertErr } = await supabase
      .from('right_now_posts')
      .insert({
        user_id: user.sub,
        mode,
        headline,
        body: text || null,
        city,
        country: profile.country || null,
        lat: lat ?? null,
        lng: lng ?? null,
        geo_bin: geoBin,
        membership_tier: profile.membership_tier || 'free',
        xp_band: profile.xp_band || 'fresh',
        expires_at: expiresAt,
      })
      .select('*')
      .maybeSingle()

    if (insertErr) return json({ error: insertErr.message }, 500)

    // CRITICAL: Broadcast to realtime channel for live updates
    try {
      await supabase
        .channel(`right_now:city:${city}`)
        .send({
          type: 'broadcast',
          event: 'post_created',
          payload: { post: inserted },
        })
      console.log(`[POST /right-now] Broadcast sent for city: ${city}`)
    } catch (broadcastError) {
      console.error('[POST /right-now] Broadcast failed (non-fatal):', broadcastError)
    }

    // Award XP via RPC (if exists)
    try {
      const xpAmounts: Record<Mode, number> = {
        hookup: 15,
        crowd: 20,
        drop: 10,
        ticket: 10,
        radio: 15,
        care: 25,
      }

      await supabase.rpc('award_xp', {
        p_user_id: user.sub,
        p_event_type: 'post_right_now',
        p_xp_amount: xpAmounts[mode],
        p_related_id: inserted?.id,
        p_related_type: 'right_now_post',
        p_city: city,
      })
    } catch (xpError) {
      console.error('XP award failed (non-fatal):', xpError)
    }

    // Increment heat bin
    try {
      await supabase.rpc('increment_heat_bin', {
        p_geo_bin: geoBin,
        p_source: 'right_now',
        p_city: city,
        p_lat: lat ?? null,
        p_lng: lng ?? null,
        p_heat_value: 10,
        p_ttl_hours: 2,
      })
    } catch (heatError) {
      console.error('Heat bin increment failed (non-fatal):', heatError)
    }

    return json({ post: inserted }, 201)
  }

  // 3) DELETE /right-now/:id
  if (req.method === 'DELETE' && pathname.startsWith('/')) {
    if (!user?.sub) return json({ error: 'Unauthenticated' }, 401)

    const postId = pathname.slice(1) // remove leading /

    const { error } = await supabase
      .from('right_now_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', postId)
      .eq('user_id', user.sub)

    if (error) return json({ error: error.message }, 500)

    return new Response(null, { 
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  return json({ error: 'Not found' }, 404)
})