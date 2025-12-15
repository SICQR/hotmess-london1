'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { projectId } from '@/utils/supabase/info'
import { useRightNowRealtime } from '@/lib/useRightNowRealtime'
import { Zap, Users, Droplet, Heart, Trash2, Radio, CheckCircle, XCircle } from 'lucide-react'

type RightNowMode = 'hookup' | 'crowd' | 'drop' | 'care'

interface TestLog {
  id: string
  timestamp: string
  type: 'success' | 'error' | 'info'
  message: string
}

export default function RightNowTestPanel() {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<TestLog[]>([])
  const [lastPostId, setLastPostId] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<RightNowMode>('hookup')
  const [city, setCity] = useState('London')
  
  const addLog = (type: TestLog['type'], message: string) => {
    const log: TestLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    }
    setLogs(prev => [log, ...prev].slice(0, 50)) // Keep last 50 logs
  }

  // Subscribe to realtime updates
  useRightNowRealtime({
    city,
    onInsert: (post) => {
      addLog('success', `📥 Received new post: ${post.headline}`)
    },
    onUpdate: (post) => {
      addLog('info', `🔄 Post updated: ${post.id}`)
    },
    onDelete: (postId) => {
      addLog('info', `🗑️  Post deleted: ${postId}`)
    },
  })

  const getAccessToken = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      addLog('error', 'Not authenticated. Please sign in first.')
      return null
    }
    return session.access_token
  }

  const testHealth = async () => {
    setLoading(true)
    addLog('info', '🏥 Testing health endpoint...')
    
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now-test/health`)
      const data = await res.json()
      
      if (data.status === 'LIVE') {
        addLog('success', `✅ Health check passed: ${data.service}`)
      } else {
        addLog('error', '❌ Health check failed')
      }
    } catch (err) {
      addLog('error', `❌ Health check error: ${err instanceof Error ? err.message : 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }

  const testCreate = async () => {
    setLoading(true)
    addLog('info', `📝 Creating ${selectedMode} post...`)
    
    try {
      const token = await getAccessToken()
      if (!token) {
        setLoading(false)
        return
      }

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now-test/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: selectedMode,
          headline: `[TEST] ${selectedMode.toUpperCase()} post from frontend`,
          body: `Created at ${new Date().toLocaleTimeString()}`,
          city,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setLastPostId(data.post.id)
        addLog('success', `✅ Created post: ${data.post.id}`)
        addLog('info', `   Headline: ${data.post.headline}`)
      } else {
        addLog('error', `❌ Create failed: ${data.error}`)
      }
    } catch (err) {
      addLog('error', `❌ Create error: ${err instanceof Error ? err.message : 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }

  const testDelete = async () => {
    if (!lastPostId) {
      addLog('error', '❌ No post to delete. Create a post first.')
      return
    }

    setLoading(true)
    addLog('info', `🗑️  Deleting post ${lastPostId}...`)
    
    try {
      const token = await getAccessToken()
      if (!token) {
        setLoading(false)
        return
      }

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now-test/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: lastPostId }),
      })

      const data = await res.json()

      if (data.success) {
        addLog('success', `✅ Deleted post: ${lastPostId}`)
        setLastPostId(null)
      } else {
        addLog('error', `❌ Delete failed: ${data.error}`)
      }
    } catch (err) {
      addLog('error', `❌ Delete error: ${err instanceof Error ? err.message : 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }

  const testBroadcast = async () => {
    setLoading(true)
    addLog('info', `📡 Sending broadcast to city:${city.toLowerCase()}...`)
    
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now-test/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city,
          event: 'test_broadcast',
          payload: {
            message: 'Test broadcast from frontend',
            timestamp: new Date().toISOString(),
          },
        }),
      })

      const data = await res.json()

      if (data.success) {
        addLog('success', `✅ Broadcast sent to ${data.channel}`)
      } else {
        addLog('error', `❌ Broadcast failed: ${data.error}`)
      }
    } catch (err) {
      addLog('error', `❌ Broadcast error: ${err instanceof Error ? err.message : 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
    addLog('info', 'Logs cleared')
  }

  const modeIcons = {
    hookup: Zap,
    crowd: Users,
    drop: Droplet,
    care: Heart,
  }

  const modeColors = {
    hookup: 'text-[#FF1744]',
    crowd: 'text-[#00E5FF]',
    drop: 'text-[#FF10F0]',
    care: 'text-[#7C4DFF]',
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-black tracking-[0.32em] uppercase mb-2">
            RIGHT NOW
          </h1>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
            E2E Testing Panel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {/* Mode Selector */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.24em] mb-4">
                Post Mode
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(['hookup', 'crowd', 'drop', 'care'] as const).map((mode) => {
                  const Icon = modeIcons[mode]
                  return (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        selectedMode === mode
                          ? 'bg-white text-black'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <Icon className={`size-5 ${selectedMode === mode ? 'text-black' : modeColors[mode]}`} />
                      <span className="text-[11px] font-black uppercase tracking-[0.16em]">
                        {mode}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* City Input */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.24em] mb-4">
                City
              </h3>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#FF1744]"
                placeholder="London"
              />
            </div>

            {/* Actions */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.24em] mb-4">
                Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={testHealth}
                  disabled={loading}
                  className="px-4 py-3 bg-white/10 hover:bg-white hover:text-black rounded-xl transition-all disabled:opacity-50 text-[11px] font-black uppercase tracking-[0.16em]"
                >
                  🏥 Health
                </button>
                <button
                  onClick={testCreate}
                  disabled={loading}
                  className="px-4 py-3 bg-[#FF1744] hover:bg-[#FF1744]/80 rounded-xl transition-all disabled:opacity-50 text-[11px] font-black uppercase tracking-[0.16em]"
                >
                  📝 Create
                </button>
                <button
                  onClick={testDelete}
                  disabled={loading || !lastPostId}
                  className="px-4 py-3 bg-white/10 hover:bg-white hover:text-black rounded-xl transition-all disabled:opacity-50 text-[11px] font-black uppercase tracking-[0.16em]"
                >
                  🗑️  Delete
                </button>
                <button
                  onClick={testBroadcast}
                  disabled={loading}
                  className="px-4 py-3 bg-white/10 hover:bg-white hover:text-black rounded-xl transition-all disabled:opacity-50 text-[11px] font-black uppercase tracking-[0.16em]"
                >
                  📡 Broadcast
                </button>
              </div>
              
              {lastPostId && (
                <div className="mt-4 p-3 bg-white/5 rounded-xl">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/60 mb-1">
                    Last Post ID
                  </p>
                  <p className="text-[11px] font-mono">
                    {lastPostId.slice(0, 24)}...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Logs */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-black uppercase tracking-[0.24em]">
                Logs
              </h3>
              <button
                onClick={clearLogs}
                className="text-[10px] uppercase tracking-[0.16em] text-white/60 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {logs.length === 0 ? (
                <p className="text-[11px] text-white/40 italic">
                  No logs yet. Run a test to see output.
                </p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl ${
                      log.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20'
                        : log.type === 'error'
                        ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {log.type === 'success' ? (
                        <CheckCircle className="size-4 text-green-500 shrink-0 mt-0.5" />
                      ) : log.type === 'error' ? (
                        <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                      ) : (
                        <Radio className="size-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white/60 mb-1">
                          {log.timestamp}
                        </p>
                        <p className="text-[11px] break-words">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-[13px] font-black uppercase tracking-[0.24em] mb-4">
            Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
            <div>
              <p className="text-white/60 uppercase tracking-[0.16em] mb-1">
                Endpoint
              </p>
              <p className="font-mono text-[10px] break-all">
                /right-now-test
              </p>
            </div>
            <div>
              <p className="text-white/60 uppercase tracking-[0.16em] mb-1">
                Realtime Channel
              </p>
              <p className="font-mono text-[10px]">
                city:{city.toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-white/60 uppercase tracking-[0.16em] mb-1">
                Status
              </p>
              <p className={loading ? 'text-yellow-400' : 'text-green-400'}>
                {loading ? 'TESTING...' : 'READY'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
