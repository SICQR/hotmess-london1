// app/records/page.tsx
// RAW CONVICT RECORDS homepage

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "RAW CONVICT RECORDS | HOTMESS",
  description: "Releases. Drops. No filler.",
};

export default function RecordsPage() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      {/* Hero */}
      <section className="rounded-3xl border border-hotmess-red/30 bg-hotmess-red/5 p-12 text-center space-y-4">
        <h1 className="text-5xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
          RAW CONVICT RECORDS
        </h1>
        <div className="text-xl text-hotmess-red uppercase tracking-wider" style={{ fontWeight: 700 }}>
          Releases. Drops. No filler.
        </div>
        <p className="text-sm opacity-80 max-w-2xl mx-auto">
          Preview is SoundCloud. HQ listening and downloads live here.
        </p>
      </section>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href="/records/releases">Browse Releases</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href="/records/library">Your Library</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-2xl bg-hot text-white hover:bg-white hover:text-black">
          <Link href="/radio">Listen Now</Link>
        </Button>
      </div>

      {/* Info cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-3xl border p-6">
          <div className="text-xl font-bold mb-2">🎵 Preview</div>
          <div className="text-sm opacity-80">
            SoundCloud embeds for discovery. Full streaming stays on RAW.
          </div>
        </div>

        <div className="rounded-3xl border p-6">
          <div className="text-xl font-bold mb-2">🔊 HQ Audio</div>
          <div className="text-sm opacity-80">
            Lossless streaming + downloads for Premium members and purchases.
          </div>
        </div>

        <div className="rounded-3xl border p-6">
          <div className="text-xl font-bold mb-2">📦 Drops</div>
          <div className="text-sm opacity-80">
            Limited releases, exclusive packs, beacon-only unlocks.
          </div>
        </div>
      </div>

      {/* Microcopy */}
      <div className="text-xs opacity-70 text-center">
        18+ only. Preview via SoundCloud. HQ streaming and downloads delivered on this platform.
      </div>
    </main>
  );
}