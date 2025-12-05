// app/map/page.tsx
// Live city heatmap

'use client';

import { ConsentGate } from '@/components/ConsentGate';

export default function MapPage() {
  return (
    <ConsentGate feature="Heat Map" requiredMode="precise">
      <main className="mx-auto max-w-5xl p-6 space-y-6">
        <header className="space-y-2">
          <div className="text-sm opacity-80">Map</div>
          <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
            LIVE CITY HEATMAP
          </h1>
          <div className="text-sm opacity-80">See what's happening. Where's the energy.</div>
        </header>

        <div className="rounded-3xl border border-hot/30 bg-hot/5 p-6 space-y-2">
          <div className="font-bold text-hot flex items-center gap-2">
            <div className="w-2 h-2 bg-hot rounded-full animate-pulse" />
            LIVE DATA
          </div>
          <div className="text-sm opacity-90">
            Real-time beacon scans, event density, and community activity.
          </div>
        </div>

        <div className="rounded-3xl border p-12 text-center space-y-4">
          <div className="text-6xl">🗺️</div>
          <div className="text-xl font-bold">Interactive map launching soon</div>
          <div className="text-sm opacity-80 max-w-md mx-auto">
            Live heatmap showing beacons, events, and community activity across London.
          </div>
        </div>
      </main>
    </ConsentGate>
  );
}