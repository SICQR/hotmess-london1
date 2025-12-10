'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { projectId } from '@/utils/supabase/info'

export default function SimpleTestPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const log = (msg: string) => {
    console.log(msg)
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev])
  }

  // Test 1: Check if user is signed in
  const testAuth = async () => {
    setLoading(true)
    log('🔐 Checking auth...')
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      log(`❌ Auth error: ${error.message}`)
    } else if (!session) {
      log('⚠️  Not signed in')
    } else {
      log(`✅ Signed in as: ${session.user.email}`)
      log(`   Access token: ${session.access_token.substring(0, 20)}...`)
    }
    
    setLoading(false)
  }

  // Test 2: Fetch RIGHT NOW feed
  const testFetchFeed = async () => {
    setLoading(true)
    log('📡 Fetching RIGHT NOW feed...')
    
    const { data: { session } } = await supabase.auth.getSession()
    
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now?city=London`, {
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
      })
      
      const data = await res.json()
      
      if (res.ok) {
        log(`✅ Feed loaded: ${data.posts?.length || 0} posts`)
        if (data.posts?.length > 0) {
          log(`   First post: "${data.posts[0].headline}"`)
        }
      } else {
        log(`❌ Feed error: ${data.error || res.statusText}`)
      }
    } catch (err: any) {
      log(`❌ Fetch error: ${err.message}`)
    }
    
    setLoading(false)
  }

  // Test 3: Create a post
  const testCreatePost = async () => {
    setLoading(true)
    log('📝 Creating test post...')
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (!session) {
      log('❌ Must be signed in to create posts')
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          mode: 'hookup',
          headline: `Test post ${new Date().toLocaleTimeString()}`,
          text: 'This is a test post from the simple test page',
          lat: 51.5074,
          lng: -0.1278,
        }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        log(`✅ Post created: ${data.post.id}`)
        log(`   Headline: "${data.post.headline}"`)
      } else {
        log(`❌ Create error: ${data.error}`)
      }
    } catch (err: any) {
      log(`❌ Create error: ${err.message}`)
    }
    
    setLoading(false)
  }

  // Test 4: Query database directly
  const testDatabase = async () => {
    setLoading(true)
    log('🗄️  Querying database directly...')
    
    try {
      const { data, error } = await supabase
        .from('right_now_posts')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false })
      
      if (error) {
        log(`❌ Database error: ${error.message}`)
      } else {
        log(`✅ Found ${data?.length || 0} posts in database`)
        if (data && data.length > 0) {
          log(`   Latest: "${data[0].headline}" (${data[0].mode})`)
        }
      }
    } catch (err: any) {
      log(`❌ Database error: ${err.message}`)
    }
    
    setLoading(false)
  }

  // Test 5: Test RIGHT NOW Edge Function health
  const testEdgeFunction = async () => {
    setLoading(true)
    log('🏥 Testing RIGHT NOW Edge Function...')
    
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now`)
      const data = await res.json()
      
      if (res.ok) {
        log(`✅ Edge Function responded: ${data.posts?.length || 0} posts`)
      } else {
        log(`⚠️  Edge Function returned ${res.status}: ${data.error || 'Unknown'}`)
      }
    } catch (err: any) {
      log(`❌ Edge Function error: ${err.message}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-[32px] font-black tracking-[0.32em] uppercase">
            RIGHT NOW
          </h1>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
            Simple Connection Test
          </p>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={testAuth}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-left transition disabled:opacity-50"
          >
            <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1">
              1. Test Auth
            </div>
            <div className="text-[10px] text-white/60">
              Check if signed in
            </div>
          </button>

          <button
            onClick={testEdgeFunction}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-left transition disabled:opacity-50"
          >
            <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1">
              2. Test Edge Function
            </div>
            <div className="text-[10px] text-white/60">
              Ping RIGHT NOW API
            </div>
          </button>

          <button
            onClick={testDatabase}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-left transition disabled:opacity-50"
          >
            <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1">
              3. Test Database
            </div>
            <div className="text-[10px] text-white/60">
              Query posts table
            </div>
          </button>

          <button
            onClick={testFetchFeed}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-left transition disabled:opacity-50"
          >
            <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1">
              4. Fetch Feed
            </div>
            <div className="text-[10px] text-white/60">
              Load London posts
            </div>
          </button>

          <button
            onClick={testCreatePost}
            disabled={loading}
            className="bg-[#FF1744]/20 hover:bg-[#FF1744]/30 border border-[#FF1744]/50 rounded-xl p-4 text-left transition disabled:opacity-50"
          >
            <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1 text-[#FF1744]">
              5. Create Post
            </div>
            <div className="text-[10px] text-white/60">
              Test post creation
            </div>
          </button>

          <button
            onClick={() => setLogs([])}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition"
          >
            <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1">
              Clear Logs
            </div>
            <div className="text-[10px] text-white/60">
              Reset output
            </div>
          </button>
        </div>

        {/* Logs */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-[13px] font-black uppercase tracking-[0.24em] mb-4">
            Test Logs
          </h2>
          
          {logs.length === 0 ? (
            <div className="text-center py-12 text-white/40 text-[11px]">
              No tests run yet. Click a button above to start.
            </div>
          ) : (
            <div className="space-y-2 font-mono text-[11px] max-h-[400px] overflow-y-auto">
              {logs.map((log, i) => (
                <div 
                  key={i} 
                  className={`${
                    log.includes('✅') ? 'text-green-400' :
                    log.includes('❌') ? 'text-red-400' :
                    log.includes('⚠️') ? 'text-yellow-400' :
                    'text-white/70'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="text-center text-[10px] text-white/40">
          <div>Project ID: {projectId}</div>
          <div>Edge Function: /functions/v1/right-now</div>
        </div>
      </div>
    </div>
  )
}
