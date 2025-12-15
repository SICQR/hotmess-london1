'use client'

import { useState, useEffect } from 'react'
import { projectId } from '@/utils/supabase/info'
import { Zap, CheckCircle, XCircle, Activity, Users, Droplet, Heart, Radio, Terminal, FileText, Globe } from 'lucide-react'

interface HealthStatus {
  status: 'LIVE' | 'ERROR' | 'CHECKING'
  timestamp?: string
  routes?: string[]
}

export default function RightNowTestDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({ status: 'CHECKING' })
  const [checking, setChecking] = useState(false)

  const checkHealth = async () => {
    setChecking(true)
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now-test/health`)
      const data = await res.json()
      
      if (data.status === 'LIVE') {
        setHealthStatus({
          status: 'LIVE',
          timestamp: data.timestamp,
          routes: data.routes,
        })
      } else {
        setHealthStatus({ status: 'ERROR' })
      }
    } catch (err) {
      console.error('Health check failed:', err)
      setHealthStatus({ status: 'ERROR' })
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const testRoutes = [
    {
      name: 'Test Panel',
      path: '/right-now/test',
      icon: Terminal,
      description: 'Interactive testing interface with realtime logs',
      color: 'text-[#FF1744]',
    },
    {
      name: 'Live Feed',
      path: '/right-now/live',
      icon: Radio,
      description: 'Production RIGHT NOW feed with 3D globe',
      color: 'text-[#00E5FF]',
    },
    {
      name: 'Demo Feed',
      path: '/right-now/demo',
      icon: Activity,
      description: 'Demo version with mock data',
      color: 'text-[#FF10F0]',
    },
    {
      name: 'Globe View',
      path: '/right-now/globe',
      icon: Globe,
      description: '3D globe visualization with heat clusters',
      color: 'text-[#7C4DFF]',
    },
  ]

  const postModes = [
    { mode: 'hookup', icon: Zap, color: 'text-[#FF1744]', description: 'Hookup posts' },
    { mode: 'crowd', icon: Users, color: 'text-[#00E5FF]', description: 'Crowd verification' },
    { mode: 'drop', icon: Droplet, color: 'text-[#FF10F0]', description: 'Drop announcements' },
    { mode: 'care', icon: Heart, color: 'text-[#7C4DFF]', description: 'Care check-ins' },
  ]

  const apiEndpoints = [
    { method: 'GET', path: '/health', auth: false, description: 'Health check' },
    { method: 'POST', path: '/create', auth: true, description: 'Create test post' },
    { method: 'POST', path: '/delete', auth: true, description: 'Soft-delete post' },
    { method: 'POST', path: '/broadcast', auth: false, description: 'Send realtime broadcast' },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-[32px] font-black tracking-[0.32em] uppercase">
            RIGHT NOW
          </h1>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
            Complete Testing Infrastructure
          </p>
        </div>

        {/* Health Status */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-black uppercase tracking-[0.24em]">
              System Status
            </h2>
            <button
              onClick={checkHealth}
              disabled={checking}
              className="text-[10px] uppercase tracking-[0.16em] px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
            >
              {checking ? 'Checking...' : 'Refresh'}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {healthStatus.status === 'LIVE' ? (
              <CheckCircle className="size-8 text-green-500" />
            ) : healthStatus.status === 'ERROR' ? (
              <XCircle className="size-8 text-red-500" />
            ) : (
              <Activity className="size-8 text-yellow-500 animate-pulse" />
            )}
            
            <div className="flex-1">
              <div className="text-[14px] font-black uppercase tracking-[0.16em]">
                {healthStatus.status === 'LIVE' ? (
                  <span className="text-green-500">LIVE</span>
                ) : healthStatus.status === 'ERROR' ? (
                  <span className="text-red-500">ERROR</span>
                ) : (
                  <span className="text-yellow-500">CHECKING...</span>
                )}
              </div>
              {healthStatus.timestamp && (
                <div className="text-[10px] text-white/60 mt-1">
                  Last check: {new Date(healthStatus.timestamp).toLocaleString()}
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/60 mb-1">
                Edge Function
              </div>
              <div className="text-[11px] font-mono">
                right-now-test
              </div>
            </div>
          </div>
        </div>

        {/* Test Routes */}
        <div className="space-y-4">
          <h2 className="text-[13px] font-black uppercase tracking-[0.24em]">
            Test Routes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testRoutes.map((route) => {
              const Icon = route.icon
              return (
                <a
                  key={route.path}
                  href={route.path}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <Icon className={`size-8 ${route.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1 group-hover:text-[#FF1744] transition-colors">
                        {route.name}
                      </div>
                      <div className="text-[11px] text-white/60">
                        {route.description}
                      </div>
                      <div className="text-[10px] font-mono text-white/40 mt-2">
                        {route.path}
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Post Modes */}
        <div className="space-y-4">
          <h2 className="text-[13px] font-black uppercase tracking-[0.24em]">
            Post Modes
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {postModes.map((mode) => {
              const Icon = mode.icon
              return (
                <div
                  key={mode.mode}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center"
                >
                  <Icon className={`size-8 ${mode.color} mx-auto mb-2`} />
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] mb-1">
                    {mode.mode}
                  </div>
                  <div className="text-[10px] text-white/60">
                    {mode.description}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="space-y-4">
          <h2 className="text-[13px] font-black uppercase tracking-[0.24em]">
            API Endpoints
          </h2>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {apiEndpoints.map((endpoint, i) => (
                <div key={i} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-[0.16em] px-2 py-1 rounded ${
                          endpoint.method === 'GET' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {endpoint.method}
                        </span>
                        <span className="text-[11px] font-mono">
                          /right-now-test{endpoint.path}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/60">
                        {endpoint.description}
                      </div>
                    </div>
                    {endpoint.auth && (
                      <div className="text-[10px] uppercase tracking-[0.16em] text-yellow-500">
                        AUTH
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="space-y-4">
          <h2 className="text-[13px] font-black uppercase tracking-[0.24em]">
            Documentation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://github.com/yourusername/hotmess-london/blob/main/docs/RIGHT_NOW_E2E_TESTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/10 transition-all"
            >
              <FileText className="size-6 text-[#FF1744] mb-2" />
              <div className="text-[11px] font-black uppercase tracking-[0.16em] mb-1">
                Testing Guide
              </div>
              <div className="text-[10px] text-white/60">
                Complete E2E testing documentation
              </div>
            </a>

            <a
              href="https://github.com/yourusername/hotmess-london/blob/main/supabase/migrations/302_right_now_test_seed.sql"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/10 transition-all"
            >
              <FileText className="size-6 text-[#00E5FF] mb-2" />
              <div className="text-[11px] font-black uppercase tracking-[0.16em] mb-1">
                Seed Data
              </div>
              <div className="text-[10px] text-white/60">
                SQL migration with test posts
              </div>
            </a>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <Terminal className="size-6 text-[#FF10F0] mb-2" />
              <div className="text-[11px] font-black uppercase tracking-[0.16em] mb-1">
                Bash Script
              </div>
              <div className="text-[10px] text-white/60">
                ./scripts/test-right-now.sh
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-[13px] font-black uppercase tracking-[0.24em] mb-4">
            Infrastructure Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-[24px] font-black text-[#FF1744]">
                4
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                API Endpoints
              </div>
            </div>
            
            <div>
              <div className="text-[24px] font-black text-[#00E5FF]">
                4
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                Post Modes
              </div>
            </div>
            
            <div>
              <div className="text-[24px] font-black text-[#FF10F0]">
                8
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                Seed Posts
              </div>
            </div>
            
            <div>
              <div className="text-[24px] font-black text-[#7C4DFF]">
                100%
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                Ready
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] uppercase tracking-[0.24em] text-white/40">
          RIGHT NOW Testing Infrastructure • Production Ready
        </div>
      </div>
    </div>
  )
}
