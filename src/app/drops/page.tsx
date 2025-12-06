// app/drops/page.tsx
// Exclusive drops - Connected to real backend

import { requireUser } from "@/lib/requireUser";
import { DropsClient } from "@/components/DropsClient";

export const metadata = {
  title: "Drops | HOTMESS",
  description: "Exclusive releases & perks",
};

export default async function DropsPage() {
  await requireUser();

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="opacity-80" style={{ fontSize: '14px' }}>Drops</div>
        <h1 className="uppercase tracking-tight" style={{ fontSize: '40px', fontWeight: 900 }}>
          EXCLUSIVE RELEASES
        </h1>
        <div className="opacity-80" style={{ fontSize: '14px' }}>
          Limited drops. Members only.
        </div>
      </header>

      <div className="rounded-3xl border border-hotmess-red/30 bg-hotmess-red/5 p-6 space-y-2">
        <div className="text-hotmess-red" style={{ fontWeight: 700 }}>🔥 MEMBERS ONLY</div>
        <div className="opacity-90" style={{ fontSize: '14px' }}>
          Exclusive merch, music releases, and event access for active community members.
        </div>
      </div>

      <DropsClient />
    </main>
  );
}