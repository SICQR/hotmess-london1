// Community Overview - Main community hub page

import { Users, Heart, Shield, ArrowRight, Radio, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrutalistCard } from "@/components/layouts/BrutalistCard";
import { typography, spacing } from "@/lib/design-system";

interface CommunityOverviewProps {
  onNavigate: (route: string) => void;
}

const ROOMS_BOT = "https://t.me/HotmessRoomsBot?start=london";

// Mock hosts - replace with real API
const hosts = [
  { username: "@wolfldn", role: "Events", city: "London" },
  { username: "@bearking", role: "Aftercare", city: "London" },
  { username: "@nightowl", role: "Drops", city: "London" },
];

const networkRooms = [
  { id: "general", name: "General Room", description: "Updates, meetups, city info" },
  { id: "events", name: "Events Room", description: "Tonight's events + set times" },
  { id: "aftercare", name: "Aftercare Room", description: "Private check-ins, care resources" },
  { id: "social", name: "Social Room", description: "Connect with men in London" },
  { id: "kink", name: "Kink Room", description: "Safe space for kink discussion" },
  { id: "artists", name: "RAW CONVICT Artists", description: "Music, sets, production" },
];

export default function CommunityOverview({ onNavigate }: CommunityOverviewProps) {
  return (
    <main className={spacing.pageContainer + " " + spacing.sectionVertical}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className={typography.h1 + " text-hot"}>Community</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          "Your city, your men, your network."
        </p>
      </div>

      {/* Primary CTA */}
      <div className="flex justify-center">
        <a
          href={ROOMS_BOT}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-8 py-4 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all inline-flex items-center gap-2"
        >
          <Users className="h-5 w-5" />
          Enter Rooms
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>

      {/* Why Rooms */}
      <BrutalistCard variant="section">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={typography.h2}>Why Rooms?</h2>
            <button
              onClick={() => onNavigate("/?route=communityWhyRooms")}
              className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
            >
              Learn Why <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            HOTMESS runs on encrypted Telegram rooms. Local men. Local events. Local info. 
            No feed algorithms. No ads. No noise. Just real connection in real places.
          </p>
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-black/10">
              <Shield className="h-6 w-6 text-hot" />
              <div className="font-bold">Encrypted</div>
              <div className="text-xs opacity-70">Private & secure</div>
            </div>
            <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-black/10">
              <Zap className="h-6 w-6 text-hot" />
              <div className="font-bold">Fast</div>
              <div className="text-xs opacity-70">Real-time updates</div>
            </div>
            <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-black/10">
              <Users className="h-6 w-6 text-hot" />
              <div className="font-bold">Local</div>
              <div className="text-xs opacity-70">Men in your city</div>
            </div>
          </div>
        </div>
      </BrutalistCard>

      {/* Host Team */}
      <section className="space-y-6">
        <h2 className={typography.h2}>Host Team</h2>
        <p className="text-sm opacity-70">
          Meet the official hosts in London.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {hosts.map((host) => (
            <BrutalistCard key={host.username}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-hot" />
                  <div>
                    <div className="font-bold">{host.username}</div>
                    <div className="text-xs opacity-70">{host.role}</div>
                  </div>
                </div>
              </div>
            </BrutalistCard>
          ))}
        </div>
      </section>

      {/* City Network */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>City Network</h2>
          <button
            onClick={() => onNavigate("/?route=rooms")}
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            View All Rooms <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {networkRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-5"
            >
              <div className="space-y-2">
                <div className="font-bold">{room.name}</div>
                <div className="text-sm opacity-70">{room.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-4">
          <a
            href={ROOMS_BOT}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm inline-flex items-center gap-2"
          >
            Enter Rooms
          </a>
        </div>
      </section>

      {/* Weekly Rituals */}
      <BrutalistCard variant="section">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Radio className="h-8 w-8 text-hot" />
            <h2 className={typography.h2}>Weekly Rituals</h2>
          </div>
          <h3 className={typography.h3 + " text-hot"}>HAND N HAND</h3>
          <p className="text-sm opacity-70 max-w-2xl mx-auto">
            Every Sunday. Live radio show bringing care-first principles to nightlife. 
            Set lists, guest DJs, aftercare check-ins, and community rituals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate("/?route=radio")}
              className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm inline-flex items-center justify-center gap-2"
            >
              <Radio className="h-4 w-4" />
              Listen Live
            </button>
            <button
              onClick={() => onNavigate("/?route=care")}
              className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all text-sm inline-flex items-center justify-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Aftercare
            </button>
          </div>
        </div>
      </BrutalistCard>

      {/* Safety & Care */}
      <section className="space-y-6">
        <h2 className={typography.h2}>Safety & Care</h2>
        <BrutalistCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-hot" />
              <h3 className={typography.h3}>Zero judgement. Zero tolerance.</h3>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              HOTMESS is built care-first. If something happens, we're here. Private aftercare check-ins. 
              Crisis resources. Safe space moderation. Men-only. Confidential.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => onNavigate("/?route=care")}
                className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm inline-flex items-center justify-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Care Hub
              </button>
              <button
                onClick={() => onNavigate("/?route=legalGuidelines")}
                className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all text-sm inline-flex items-center justify-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Guidelines
              </button>
            </div>
          </div>
        </BrutalistCard>
      </section>
    </main>
  );
}
