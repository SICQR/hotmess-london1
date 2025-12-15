'use client'

import { useState, useEffect } from 'react'
import { projectId } from '@/utils/supabase/info'
import { CheckCircle, XCircle, Activity } from 'lucide-react'

interface TestStatusProps {
  compact?: boolean
}

export default function RightNowTestStatus({ compact = false }: TestStatusProps) {
  const [status, setStatus] = useState<'LIVE' | 'ERROR' | 'CHECKING'>('CHECKING')
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/right-now-test/health`)
        const data = await res.json()
        setStatus(data.status === 'LIVE' ? 'LIVE' : 'ERROR')
        setLastCheck(new Date())
      } catch (err) {
        setStatus('ERROR')
        setLastCheck(new Date())
      }
    }

    // Check immediately
    checkHealth()

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg">
        {status === 'LIVE' ? (
          <CheckCircle className="size-4 text-green-500" />
        ) : status === 'ERROR' ? (
          <XCircle className="size-4 text-red-500" />
        ) : (
          <Activity className="size-4 text-yellow-500 animate-pulse" />
        )}
        <span className="text-[10px] uppercase tracking-[0.16em] font-black">
          {status}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-3">
        {status === 'LIVE' ? (
          <CheckCircle className="size-6 text-green-500 shrink-0" />
        ) : status === 'ERROR' ? (
          <XCircle className="size-6 text-red-500 shrink-0" />
        ) : (
          <Activity className="size-6 text-yellow-500 animate-pulse shrink-0" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-black uppercase tracking-[0.16em]">
            {status === 'LIVE' ? (
              <span className="text-green-500">RIGHT NOW Test Suite</span>
            ) : status === 'ERROR' ? (
              <span className="text-red-500">Offline</span>
            ) : (
              <span className="text-yellow-500">Checking...</span>
            )}
          </div>
          {lastCheck && (
            <div className="text-[9px] text-white/60 mt-0.5">
              Last check: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>

        <a
          href="/right-now/test-dashboard"
          className="text-[9px] uppercase tracking-[0.16em] text-[#FF1744] hover:underline shrink-0"
        >
          Dashboard
        </a>
      </div>
    </div>
  )
}
