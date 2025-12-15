'use client'

import { useState } from 'react'
import { Zap, X } from 'lucide-react'
import RightNowTestStatus from './RightNowTestStatus'

interface FloatingTestBadgeProps {
  showByDefault?: boolean
}

export default function FloatingTestBadge({ showByDefault = true }: FloatingTestBadgeProps) {
  const [isOpen, setIsOpen] = useState(showByDefault)
  const [isMinimized, setIsMinimized] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-[#FF1744] hover:bg-[#FF1744]/80 transition-all shadow-lg hover:shadow-xl flex items-center justify-center group"
        aria-label="Open test panel"
      >
        <Zap className="size-6 text-black group-hover:scale-110 transition-transform" />
      </button>
    )
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all hover:border-[#FF1744]/50"
        >
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-[#FF1744]" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-black">
              Test
            </span>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#FF1744]/10 border-b border-[#FF1744]/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-[#FF1744]" />
              <span className="text-[11px] font-black uppercase tracking-[0.16em]">
                RIGHT NOW Tests
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Minimize"
              >
                <div className="text-[18px] leading-none">−</div>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <RightNowTestStatus />

          {/* Quick Links */}
          <div className="space-y-2">
            <a
              href="/right-now/test-dashboard"
              className="block w-full text-center px-4 py-2.5 bg-[#FF1744] hover:bg-[#FF1744]/80 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.16em] text-black"
            >
              Test Dashboard
            </a>
            
            <a
              href="/right-now/test"
              className="block w-full text-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.16em]"
            >
              Test Panel
            </a>
            
            <a
              href="/right-now/testing-guide"
              className="block w-full text-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.16em]"
            >
              Testing Guide
            </a>
          </div>

          {/* Footer */}
          <div className="text-center text-[9px] uppercase tracking-[0.16em] text-white/40 pt-2 border-t border-white/10">
            E2E Testing Suite
          </div>
        </div>
      </div>
    </div>
  )
}
