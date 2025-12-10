/**
 * RIGHT NOW LIVE PAGE
 * Feed + Globe integration
 * Shows live pulses from men with heat visualization
 */

import { useState } from "react";
import { RightNowFeed } from "../components/rightnow/RightNowFeed";
import { MessConciergeWidget } from "../components/ai/MessConciergeWidget";
import { ChevronLeft, Plus } from "lucide-react";
import { projectId } from "../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1`;

interface RightNowLivePageProps {
  onNavigate: (route: string) => void;
}

export function RightNowLivePage({ onNavigate }: RightNowLivePageProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 hotmess-bg" />

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/10">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.24em] text-white/60 hover:text-white/90"
        >
          <ChevronLeft className="w-4 h-4" />
          BACK
        </button>

        <div className="text-center flex-1">
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
            RIGHT NOW · LIVE FEED
          </div>
          <div className="text-xs text-white/60">
            Men-only, 18+. Real-time pulses from the global queer nightlife.
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("rightNowCreatePage")}
          className="inline-flex items-center gap-1 rounded-full bg-white text-black px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          POST
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-4 py-6 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Feed */}
            <div className="flex flex-col">
              <RightNowFeed
                apiBase={API_BASE}
                defaultCity={selectedCity || ""}
                onOpenOnMap={(item) => {
                  setSelectedCity(item.city);
                  // TODO: Wire to globe when integrated
                  console.log("Open on map:", item);
                }}
              />
            </div>

            {/* RIGHT: Globe placeholder / integration point */}
            <div className="flex flex-col">
              <div className="hm-panel px-4 py-4 md:px-6 md:py-6">
                <div className="hm-label">HEAT MAP</div>
                <div className="mt-1 text-xl md:text-2xl font-black tracking-tight">
                  Global pulse visualization
                </div>
                <p className="mt-1 text-xs md:text-sm text-white/60">
                  See where the heat is. Click a city to filter the feed.
                </p>

                <div className="mt-4 aspect-square rounded-xl border border-white/15 bg-black/40 flex items-center justify-center text-white/40">
                  {/* TODO: Replace with actual globe component */}
                  <div className="text-center">
                    <div className="text-sm uppercase tracking-wider">
                      GLOBE INTEGRATION
                    </div>
                    <div className="mt-2 text-xs">
                      Wire MapboxGlobe component here
                    </div>
                    <div className="mt-4 text-[10px] text-white/30">
                      Heat data from right_now_posts + heat_events
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-[11px] uppercase tracking-wider text-white/60">
                    INTEGRATION NOTES:
                  </div>
                  <div className="text-xs text-white/50 space-y-1">
                    <p>
                      • Import MapboxGlobe from /components/globe/MapboxGlobe
                    </p>
                    <p>
                      • Pass selectedCity state to sync filter
                    </p>
                    <p>
                      • Use onCityClick to update feed city filter
                    </p>
                    <p>
                      • Heat data comes from heat_events table
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("rightNowPagePro")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 text-[11px] uppercase tracking-[0.24em] px-4 py-2 text-white/80 hover:border-white/70"
            >
              ADVANCED VIEW
            </button>
            <button
              type="button"
              onClick={() => onNavigate("map")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 text-[11px] uppercase tracking-[0.24em] px-4 py-2 text-white/80 hover:border-white/70"
            >
              FULL MAP
            </button>
            <button
              type="button"
              onClick={() => onNavigate("hnhMess")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 text-[11px] uppercase tracking-[0.24em] px-4 py-2 text-white/80 hover:border-white/70"
            >
              HAND N HAND
            </button>
          </div>
        </div>
      </main>

      {/* AI Concierge – floats above everything */}
      <MessConciergeWidget
        apiBase={API_BASE}
        city={selectedCity || undefined}
        xpTier="fresh"
        membership="free"
      />
    </div>
  );
}