// app/radio/page.tsx
// 24/7 Radio - Brutalist × Luxury

import { spacing, typography } from "@/lib/design-system";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BrutalistCard } from "@/components/layouts/BrutalistCard";
import { Radio, PlayCircle } from "lucide-react";

export const metadata = {
  title: "Radio | HOTMESS",
  description: "24/7 live radio",
};

export default function RadioPage() {
  return (
    <main className={spacing.pageContainer + " " + spacing.sectionVertical}>
      <PageHeader
        label="RADIO"
        title="24/7 LIVE RADIO"
        subtitle="Non-stop. Raw energy. Pure beats. No interruptions."
      />

      {/* Live status */}
      <BrutalistCard variant="error">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-hot rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-hot rounded-full animate-ping opacity-75" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-hot uppercase tracking-wide text-sm">
              LIVE NOW
            </div>
            <div className="text-xs opacity-70 mt-0.5">
              Broadcasting 24/7. No interruptions. Pure beats.
            </div>
          </div>
        </div>
      </BrutalistCard>

      {/* Coming soon */}
      <BrutalistCard variant="section">
        <div className="text-center space-y-6 py-12">
          <Radio className="h-20 w-20 mx-auto text-hot" />
          <div className="space-y-3">
            <div className={typography.h2}>
              Radio launching soon
            </div>
            <p className="text-sm md:text-base opacity-70 max-w-md mx-auto leading-relaxed">
              24/7 live radio with DJ sets, mixes, and exclusive shows.
              Broadcasting the sound of London's queer nightlife.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              disabled
              className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              Listen Live
            </button>
            <a
              href="/records"
              className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all text-sm"
            >
              Browse Records
            </a>
          </div>
        </div>
      </BrutalistCard>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4">
        <BrutalistCard variant="base">
          <div className="space-y-2">
            <div className="text-hot font-bold uppercase tracking-wide text-xs">
              24/7
            </div>
            <div className="font-bold tracking-tight">
              Always On
            </div>
            <div className="text-sm opacity-70">
              Non-stop broadcasting. Tune in anytime.
            </div>
          </div>
        </BrutalistCard>

        <BrutalistCard variant="base">
          <div className="space-y-2">
            <div className="text-hot font-bold uppercase tracking-wide text-xs">
              DJ Sets
            </div>
            <div className="font-bold tracking-tight">
              Live Mixes
            </div>
            <div className="text-sm opacity-70">
              Guest DJs and exclusive sessions.
            </div>
          </div>
        </BrutalistCard>

        <BrutalistCard variant="base">
          <div className="space-y-2">
            <div className="text-hot font-bold uppercase tracking-wide text-xs">
              Archive
            </div>
            <div className="font-bold tracking-tight">
              On Demand
            </div>
            <div className="text-sm opacity-70">
              Catch up on past shows anytime.
            </div>
          </div>
        </BrutalistCard>
      </div>

      {/* Microcopy */}
      <div className={typography.microcopy + " text-center"}>
        The sound of London's queer nightlife. 24/7.
      </div>
    </main>
  );
}