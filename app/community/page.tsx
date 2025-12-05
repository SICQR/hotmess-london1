// app/community/page.tsx
// Community page

'use client';

import { ConsentGate } from '@/components/ConsentGate';

export default function CommunityPage() {
  return (
    <ConsentGate feature="Discovery Grid" requiredMode="approximate">
      <main className="mx-auto max-w-5xl p-6 space-y-6">
        <header className="space-y-2">
          <div className="text-sm opacity-80">Community</div>
          <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
            THE CREW
          </h1>
          <div className="text-sm opacity-80">Connect, share, support.</div>
        </header>

        <div className="rounded-3xl border p-12 text-center space-y-4">
          <div className="text-6xl">👥</div>
          <div className="text-xl font-bold">Community features launching soon</div>
          <div className="text-sm opacity-80 max-w-md mx-auto">
            Forums, events, meetups. Build connections that matter.
          </div>
        </div>
      </main>
    </ConsentGate>
  );
}