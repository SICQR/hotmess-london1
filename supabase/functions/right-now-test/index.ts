import { Hono } from 'npm:hono@4'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'

// ============================================================================
// RIGHT NOW TEST - Edge Function for E2E Testing
// ============================================================================
// Routes:
//   POST /right-now-test/create     - Create a test post (respects RLS)
//   POST /right-now-test/delete     - Soft-delete a post (set deleted_at)
//   POST /right-now-test/broadcast  - Send realtime broadcast to city channel
//   GET  /right-now-test/health     - Health check
// ============================================================================

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
app.use('*', logger(console.log))

// ============================================================================
// HELPERS
// ============================================================================

function getSupabaseClient(authHeader?: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  }

  // If auth header provided, use it; otherwise use anon key
  const options = authHeader
    ? { global: { headers: { Authorization: authHeader } } }
    : {}

  return createClient(supabaseUrl, supabaseKey, options)
}

function getCurrentUser(authHeader?: string) {
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  return token || null
}

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/right-now-test/health', (c) => {
  return c.json({
    status: 'LIVE',
    service: 'RIGHT NOW Test Suite',
    timestamp: new Date().toISOString(),
    routes: [
      'POST /right-now-test/create',
      'POST /right-now-test/delete',
      'POST /right-now-test/broadcast',
      'GET /right-now-test/health',
    ],
  })
})

// Create a test post
app.post('/right-now-test/create', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const supabase = getSupabaseClient(authHeader)

    // Get user ID from auth header (required for RLS)
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.error('Auth error in create:', authError)
      return c.json({
        error: 'Unauthorized - valid auth token required',
        details: authError?.message,
      }, 401)
    }

    // Parse request body
    const body = await c.req.json()
    const {
      mode = 'hookup',
      headline = 'Test post from Edge Function',
      body: postBody = null,
      city = 'London',
      country = 'UK',
      lat = 51.5074,
      lng = -0.1278,
      geo_bin = '9c2838b',
      heat_bin_id = '9c2838b',
      membership_tier = 'GOLD',
      xp_band = 'INSIDER',
      safety_flags = [],
      near_party = false,
      sponsored = false,
      is_beacon = true,
      expires_at = null,
    } = body

    // Calculate default expires_at (1 hour from now)
    const expiresAt = expires_at || new Date(Date.now() + 60 * 60 * 1000).toISOString()

    // Insert post
    const { data: post, error: insertError } = await supabase
      .from('right_now_posts')
      .insert({
        user_id: user.id,
        mode,
        headline,
        body: postBody,
        city,
        country,
        lat,
        lng,
        geo_bin,
        heat_bin_id,
        membership_tier,
        xp_band,
        safety_flags,
        near_party,
        sponsored,
        is_beacon,
        expires_at: expiresAt,
        score: 100, // Default score for test posts
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return c.json({
        error: 'Failed to create post',
        details: insertError.message,
        hint: 'Check RLS policies on right_now_posts table',
      }, 500)
    }

    console.log('✅ Created test post:', post.id)

    return c.json({
      success: true,
      post,
      message: 'Test post created successfully',
      expires_in: '1 hour',
    }, 201)

  } catch (err) {
    console.error('Create post error:', err)
    return c.json({
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    }, 500)
  }
})

// Soft-delete a post
app.post('/right-now-test/delete', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const supabase = getSupabaseClient(authHeader)

    // Get user ID from auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.error('Auth error in delete:', authError)
      return c.json({
        error: 'Unauthorized - valid auth token required',
        details: authError?.message,
      }, 401)
    }

    // Parse request body
    const body = await c.req.json()
    const { post_id } = body

    if (!post_id) {
      return c.json({
        error: 'Missing post_id in request body',
      }, 400)
    }

    // Soft delete (set deleted_at)
    const { data: post, error: updateError } = await supabase
      .from('right_now_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', post_id)
      .eq('user_id', user.id) // RLS: can only delete own posts
      .select()
      .single()

    if (updateError) {
      console.error('Delete error:', updateError)
      return c.json({
        error: 'Failed to delete post',
        details: updateError.message,
        hint: 'Post may not exist or you may not have permission',
      }, 500)
    }

    if (!post) {
      return c.json({
        error: 'Post not found or already deleted',
      }, 404)
    }

    console.log('🗑️  Soft-deleted post:', post_id)

    return c.json({
      success: true,
      post,
      message: 'Post soft-deleted successfully',
      deleted_at: post.deleted_at,
    })

  } catch (err) {
    console.error('Delete post error:', err)
    return c.json({
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    }, 500)
  }
})

// Send realtime broadcast to city channel
app.post('/right-now-test/broadcast', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    
    // For broadcast, we need service role key to send to all channels
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !serviceRoleKey) {
      return c.json({
        error: 'Service role key not configured',
        hint: 'SUPABASE_SERVICE_ROLE_KEY required for broadcasts',
      }, 500)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Parse request body
    const body = await c.req.json()
    const {
      city = 'London',
      event = 'test_broadcast',
      payload = { message: 'Test broadcast from Edge Function' },
    } = body

    const channel = `city:${city.toLowerCase()}`

    // Send broadcast
    const broadcastResult = await supabase.channel(channel).send({
      type: 'broadcast',
      event,
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
        source: 'right-now-test',
      },
    })

    console.log('📡 Sent broadcast to channel:', channel)

    return c.json({
      success: true,
      channel,
      event,
      payload,
      message: `Broadcast sent to ${channel}`,
      result: broadcastResult,
    })

  } catch (err) {
    console.error('Broadcast error:', err)
    return c.json({
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    }, 500)
  }
})

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not found',
    available_routes: [
      'POST /right-now-test/create',
      'POST /right-now-test/delete',
      'POST /right-now-test/broadcast',
      'GET /right-now-test/health',
    ],
  }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({
    error: 'Internal server error',
    details: err.message,
  }, 500)
})

// ============================================================================
// START SERVER
// ============================================================================

Deno.serve(app.fetch)

console.log('🔥 RIGHT NOW Test Suite running')
console.log('📡 Routes:')
console.log('   POST /right-now-test/create')
console.log('   POST /right-now-test/delete')
console.log('   POST /right-now-test/broadcast')
console.log('   GET  /right-now-test/health')
