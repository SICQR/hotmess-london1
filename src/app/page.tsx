// app/page.tsx
// HOTMESS LONDON Homepage - Complete Bot Integration Layer

import { spacing, typography, grids, hero } from "@/lib/design-system";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/seo";
import { BrutalistCard } from "@/components/layouts/BrutalistCard";
import { ArrowRight, Radio, Heart, ShoppingBag, Music, Ticket, Scan, Users, Zap, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = genMeta({
  title: 'HOTMESS LONDON',
  description: 'Men-only. 18+. The nightlife OS built for real connection. Radio, events, beacons, marketplace, and community for queer men.',
  keywords: ['queer nightlife london', 'gay events', 'mens only events', 'kink community', 'nightlife os'],
  url: '/',
});

// Telegram bot deep links
const BOT_LINKS = {
  rooms: "https://t.me/HotmessRoomsBot?start=london",
  care: "https://t.me/HotmessCareBot",
  tickets: "https://t.me/HotmessTicketsBot",
  drops: "https://t.me/HotmessDropBot",
  radio: "https://t.me/HotmessRadioBot",
};

// Mock data - replace with real API calls
const tonightEvents = [
  { id: 1, name: "RAW CONVICT @ Fabric", time: "23:00", venue: "Fabric" },
  { id: 2, name: "HAND N HAND Sunday", time: "21:00", venue: "The Glory" },
  { id: 3, name: "Kink Social", time: "20:00", venue: "Eagle London" },
];

const cityDrops = [
  { id: 1, title: "HNH MESS Limited Edition", price: "£18" },
  { id: 2, title: "HOTMESS Tee - Black", price: "£32" },
];

const leaderboard = [
  { rank: 1, username: "@wolf_ldn", xp: 12830 },
  { rank: 2, username: "@bearking", xp: 11200 },
  { rank: 3, username: "@nightowl", xp: 10900 },
];

export default function HomePage() {
  return (
    <main className={spacing.pageContainer + " " + spacing.sectionVertical}>
      {/* Hero */}
      <section className={hero.neon}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={hero.gradientOverlay}
        />
        
        <div className="relative p-8 md:p-16 text-center space-y-5">
          <h1 className={typography.displayLarge + " text-hot"}>
            HOTMESS LONDON
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
            Men-only. 18+.<br />
            The nightlife OS built for real connection.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <a
              href={BOT_LINKS.rooms}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm inline-flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Enter City Rooms
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/?route=radio"
              className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all text-sm inline-flex items-center gap-2"
            >
              <Radio className="h-4 w-4" />
              Listen Live
            </a>
          </div>
        </div>
      </section>

      {/* Tonight in London */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>Tonight in London</h2>
          <a
            href="/?route=tickets"
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            View All <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        
        <div className={grids.threeCol}>
          {tonightEvents.map((event) => (
            <a
              key={event.id}
              href={`/?route=ticketDetail&eventId=${event.id}`}
              className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 hover:border-white/20 hover:bg-black/30 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Ticket className="h-6 w-6 text-hot" />
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="space-y-1">
                  <div className="font-bold tracking-tight group-hover:text-hot transition-colors">
                    {event.name}
                  </div>
                  <div className="text-sm opacity-70">
                    {event.time} · {event.venue}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* City Drops */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>City Drops</h2>
          <a
            href="/?route=messmarket"
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            Browse Drops <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        
        <p className="text-sm opacity-70">
          New releases. Limited. No restocks.
        </p>
        
        <div className={grids.twoCol}>
          {cityDrops.map((drop) => (
            <a
              key={drop.id}
              href={`/?route=marketListing&listingId=${drop.id}`}
              className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 hover:border-white/20 hover:bg-black/30 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Package className="h-6 w-6 text-hot" />
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="space-y-1">
                  <div className="font-bold tracking-tight group-hover:text-hot transition-colors">
                    {drop.title}
                  </div>
                  <div className="text-sm opacity-70">
                    {drop.price}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* HOTMESS Radio */}
      <BrutalistCard variant="section">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Radio className="h-8 w-8 text-hot" />
              <h2 className={typography.h2}>HOTMESS Radio</h2>
            </div>
            <p className="text-sm opacity-70">
              Live 24/7 — track IDs, set lists, HAND N HAND Sundays.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/?route=radio"
              className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Radio className="h-4 w-4" />
              Listen Now
            </a>
            <a
              href={BOT_LINKS.radio}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Get Updates
            </a>
          </div>
        </div>
      </BrutalistCard>

      {/* HNH MESS */}
      <BrutalistCard variant="section">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Heart className="h-8 w-8 text-hot" />
              <h2 className={typography.h2}>HNH MESS</h2>
            </div>
            <p className="text-sm opacity-70">
              The stigma-smashing lube for men.
            </p>
            <p className="text-xs opacity-50">
              QR → Community Room + Aftercare + HAND N HAND
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/?route=shop"
              className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <ShoppingBag className="h-4 w-4" />
              Buy
            </a>
            <a
              href={BOT_LINKS.rooms}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Scan className="h-4 w-4" />
              Scan
            </a>
          </div>
        </div>
      </BrutalistCard>

      {/* Care */}
      <section className="space-y-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className={typography.h2}>Care</h2>
          <p className="text-sm opacity-70">
            Private aftercare check-in. Men only.
          </p>
          <a
            href={BOT_LINKS.care}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm"
          >
            <Heart className="h-4 w-4" />
            Open Check-In
          </a>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>Leaderboard</h2>
          <a
            href="/?route=xpProfile"
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            View Full <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        
        <p className="text-sm opacity-70">
          Top men in London this month.
        </p>
        
        <BrutalistCard variant="section">
          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-hot w-8">
                    {entry.rank}
                  </div>
                  <div className="font-bold">
                    {entry.username}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Zap className="h-4 w-4 text-hot" />
                  {entry.xp.toLocaleString()} XP
                </div>
              </div>
            ))}
          </div>
        </BrutalistCard>
      </section>

      {/* Age Verification Footer */}
      <BrutalistCard variant="section">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="space-y-2">
            <div className={typography.displaySmall + " text-hot"}>
              18+
            </div>
            <div className={typography.metadata}>
              Age verified
            </div>
          </div>
          
          <div className="space-y-2">
            <div className={typography.displaySmall + " text-hot"}>
              24/7
            </div>
            <div className={typography.metadata}>
              Radio live
            </div>
          </div>
          
          <div className="space-y-2">
            <div className={typography.displaySmall + " text-hot"}>
              100%
            </div>
            <div className={typography.metadata}>
              Care first
            </div>
          </div>
        </div>
      </BrutalistCard>

      {/* Microcopy */}
      <div className="text-xs opacity-50 text-center uppercase tracking-widest font-bold">
        Your city, your men, your network.
      </div>
    </main>
  );
}