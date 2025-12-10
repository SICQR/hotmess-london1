'use client'

import { CheckCircle, Zap, Users, Droplet, Heart, Terminal, Globe, Radio, FileText, ArrowRight } from 'lucide-react'
import RightNowTestStatus from '@/components/RightNowTestStatus'

export default function TestingGuidePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-[48px] font-black tracking-[0.32em] uppercase">
            RIGHT NOW
          </h1>
          <p className="text-[13px] uppercase tracking-[0.24em] text-white/60">
            Complete Testing Guide
          </p>
          <div className="flex justify-center">
            <RightNowTestStatus />
          </div>
        </div>

        {/* Quick Start Steps */}
        <div className="space-y-6">
          <h2 className="text-[24px] font-black tracking-[0.24em] uppercase text-center">
            3 Steps to Start Testing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative">
              <div className="absolute -top-4 -left-4 size-12 rounded-full bg-[#FF1744] flex items-center justify-center text-[20px] font-black">
                1
              </div>
              <div className="space-y-3 pt-4">
                <CheckCircle className="size-10 text-[#FF1744]" />
                <h3 className="text-[13px] font-black uppercase tracking-[0.16em]">
                  Check Health
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Visit the Test Dashboard to verify the Edge Function is running and all endpoints are responding.
                </p>
                <a
                  href="/right-now/test-dashboard"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#FF1744] hover:underline"
                >
                  Open Dashboard <ArrowRight className="size-3" />
                </a>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative">
              <div className="absolute -top-4 -left-4 size-12 rounded-full bg-[#00E5FF] flex items-center justify-center text-[20px] font-black text-black">
                2
              </div>
              <div className="space-y-3 pt-4">
                <Terminal className="size-10 text-[#00E5FF]" />
                <h3 className="text-[13px] font-black uppercase tracking-[0.16em]">
                  Create Posts
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Use the interactive Test Panel to create posts in all 4 modes and watch realtime logs.
                </p>
                <a
                  href="/right-now/test"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#00E5FF] hover:underline"
                >
                  Open Test Panel <ArrowRight className="size-3" />
                </a>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative">
              <div className="absolute -top-4 -left-4 size-12 rounded-full bg-[#FF10F0] flex items-center justify-center text-[20px] font-black">
                3
              </div>
              <div className="space-y-3 pt-4">
                <Globe className="size-10 text-[#FF10F0]" />
                <h3 className="text-[13px] font-black uppercase tracking-[0.16em]">
                  See It Live
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Open the Live Feed to see your test posts appear instantly with the 3D globe visualization.
                </p>
                <a
                  href="/right-now/live"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#FF10F0] hover:underline"
                >
                  Open Live Feed <ArrowRight className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Post Modes */}
        <div className="space-y-6">
          <h2 className="text-[24px] font-black tracking-[0.24em] uppercase text-center">
            4 Post Modes
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { mode: 'hookup', icon: Zap, color: 'text-[#FF1744]', bg: 'bg-[#FF1744]/10', border: 'border-[#FF1744]/30' },
              { mode: 'crowd', icon: Users, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10', border: 'border-[#00E5FF]/30' },
              { mode: 'drop', icon: Droplet, color: 'text-[#FF10F0]', bg: 'bg-[#FF10F0]/10', border: 'border-[#FF10F0]/30' },
              { mode: 'care', icon: Heart, color: 'text-[#7C4DFF]', bg: 'bg-[#7C4DFF]/10', border: 'border-[#7C4DFF]/30' },
            ].map(({ mode, icon: Icon, color, bg, border }) => (
              <div
                key={mode}
                className={`${bg} border ${border} rounded-xl p-6 text-center`}
              >
                <Icon className={`size-12 ${color} mx-auto mb-3`} />
                <div className="text-[13px] font-black uppercase tracking-[0.16em]">
                  {mode}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Workflows */}
        <div className="space-y-6">
          <h2 className="text-[24px] font-black tracking-[0.24em] uppercase text-center">
            Test Workflows
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.16em] mb-3 text-[#FF1744]">
                Workflow 1: Basic Create & Delete
              </h3>
              <ol className="space-y-2 text-[11px] text-white/70">
                <li className="flex gap-3">
                  <span className="text-[#FF1744] shrink-0">1.</span>
                  <span>Open Test Panel</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF1744] shrink-0">2.</span>
                  <span>Select mode: <strong>hookup</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF1744] shrink-0">3.</span>
                  <span>Click <strong>Create</strong> → Note the Post ID</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF1744] shrink-0">4.</span>
                  <span>Click <strong>Delete</strong> → Verify success</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF1744] shrink-0">5.</span>
                  <span>Check logs for both operations</span>
                </li>
              </ol>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.16em] mb-3 text-[#00E5FF]">
                Workflow 2: Test All Modes
              </h3>
              <ol className="space-y-2 text-[11px] text-white/70">
                <li className="flex gap-3">
                  <span className="text-[#00E5FF] shrink-0">1.</span>
                  <span>Open Test Panel</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00E5FF] shrink-0">2.</span>
                  <span>Create one post for each mode: hookup, crowd, drop, care</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00E5FF] shrink-0">3.</span>
                  <span>Open Live Feed in new tab</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00E5FF] shrink-0">4.</span>
                  <span>Verify all 4 posts appear with correct styling</span>
                </li>
              </ol>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.16em] mb-3 text-[#FF10F0]">
                Workflow 3: Realtime Updates
              </h3>
              <ol className="space-y-2 text-[11px] text-white/70">
                <li className="flex gap-3">
                  <span className="text-[#FF10F0] shrink-0">1.</span>
                  <span>Open Live Feed in Tab 1</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF10F0] shrink-0">2.</span>
                  <span>Open Test Panel in Tab 2</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF10F0] shrink-0">3.</span>
                  <span>Create a post in Tab 2</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF10F0] shrink-0">4.</span>
                  <span>Watch it appear in Tab 1 <strong>instantly</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF10F0] shrink-0">5.</span>
                  <span>Delete the post in Tab 2</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF10F0] shrink-0">6.</span>
                  <span>Watch it disappear from Tab 1</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="space-y-6">
          <h2 className="text-[24px] font-black tracking-[0.24em] uppercase text-center">
            Quick Access
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/right-now/test-dashboard"
              className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-xl p-6 hover:bg-[#FF1744]/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <Zap className="size-10 text-[#FF1744] shrink-0" />
                <div className="flex-1">
                  <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1 group-hover:text-[#FF1744] transition-colors">
                    Test Dashboard
                  </div>
                  <div className="text-[10px] text-white/60">
                    System status & infrastructure overview
                  </div>
                </div>
                <ArrowRight className="size-6 text-[#FF1744] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </a>

            <a
              href="/right-now/test"
              className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl p-6 hover:bg-[#00E5FF]/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <Terminal className="size-10 text-[#00E5FF] shrink-0" />
                <div className="flex-1">
                  <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1 group-hover:text-[#00E5FF] transition-colors">
                    Test Panel
                  </div>
                  <div className="text-[10px] text-white/60">
                    Interactive testing with realtime logs
                  </div>
                </div>
                <ArrowRight className="size-6 text-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </a>

            <a
              href="/right-now/live"
              className="bg-[#FF10F0]/10 border border-[#FF10F0]/30 rounded-xl p-6 hover:bg-[#FF10F0]/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <Radio className="size-10 text-[#FF10F0] shrink-0" />
                <div className="flex-1">
                  <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1 group-hover:text-[#FF10F0] transition-colors">
                    Live Feed
                  </div>
                  <div className="text-[10px] text-white/60">
                    Production feed with 3D globe
                  </div>
                </div>
                <ArrowRight className="size-6 text-[#FF10F0] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </a>

            <a
              href="/right-now/demo"
              className="bg-[#7C4DFF]/10 border border-[#7C4DFF]/30 rounded-xl p-6 hover:bg-[#7C4DFF]/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <Globe className="size-10 text-[#7C4DFF] shrink-0" />
                <div className="flex-1">
                  <div className="text-[13px] font-black uppercase tracking-[0.16em] mb-1 group-hover:text-[#7C4DFF] transition-colors">
                    Demo Feed
                  </div>
                  <div className="text-[10px] text-white/60">
                    Demo version with mock data
                  </div>
                </div>
                <ArrowRight className="size-6 text-[#7C4DFF] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </a>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
          <FileText className="size-12 text-white/60 mx-auto mb-4" />
          <h3 className="text-[13px] font-black uppercase tracking-[0.16em] mb-2">
            Complete Documentation
          </h3>
          <p className="text-[11px] text-white/60 mb-4 max-w-md mx-auto">
            For detailed API docs, bash scripts, and troubleshooting, see the full E2E testing guide.
          </p>
          <a
            href="/docs/RIGHT_NOW_E2E_TESTING.md"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#FF1744] hover:underline"
          >
            View Full Docs <ArrowRight className="size-3" />
          </a>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="text-[10px] uppercase tracking-[0.24em] text-white/40">
            Ready to test. Drop it. Right now. 🔥
          </div>
          <a
            href="/"
            className="inline-block text-[9px] uppercase tracking-[0.16em] text-white/40 hover:text-white/60 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
