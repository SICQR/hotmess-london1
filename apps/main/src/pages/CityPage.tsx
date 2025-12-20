// City Page - Local nightlife dashboard for each city

import { Users, Calendar, Map, Package, TrendingUp, Radio, Heart, Building2, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrutalistCard } from "@/components/layouts/BrutalistCard";
import { typography, spacing } from "@/lib/design-system";

interface CityPageProps {
  cityId?: string;
  onNavigate: (route: string) => void;
}

// Mock city data - replace with real API
const cityData = {
  name: "London",
  id: "london",
  roomsLink: "https://t.me/HotmessRoomsBot?start=london",
};

const todayEvents = [
  { id: 1, name: "RAW CONVICT @ Fabric", time: "23:00", venue: "Fabric" },
  { id: 2, name: "HAND N HAND Sunday", time: "21:00", venue: "The Glory" },
];

const cityDrops = [
  { id: 1, title: "HNH MESS Limited Edition", seller: "@lubeking", price: "£18" },
  { id: 2, title: "HOTMESS Tee - Black", seller: "@merchqueen", price: "£32" },
];

const topSellers = [
  { id: 1, username: "@lubeking", rating: 4.9, listings: 12 },
  { id: 2, username: "@merchqueen", rating: 4.8, listings: 8 },
  { id: 3, username: "@gearmaster", rating: 4.7, listings: 15 },
];

const leaderboard = [
  { rank: 1, username: "@wolf_ldn", xp: 12830 },
  { rank: 2, username: "@bearking", xp: 11200 },
  { rank: 3, username: "@nightowl", xp: 10900 },
];

const clubPartners = [
  { id: 1, name: "Fabric", type: "Club" },
  { id: 2, name: "The Glory", type: "Bar" },
  { id: 3, name: "Eagle London", type: "Bar" },
];

export default function CityPage({ cityId = "london", onNavigate }: CityPageProps) {
  return (
    <main className={spacing.pageContainer + " " + spacing.sectionVertical}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className={typography.h1 + " text-hot"}>HOTMESS {cityData.name.toUpperCase()}</h1>
        <p className="text-sm opacity-70">
          Your city network. Real men. Real places.
        </p>
      </div>

      {/* Primary CTA */}
      <div className="flex justify-center">
        <a
          href={cityData.roomsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-8 py-4 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all inline-flex items-center gap-2"
        >
          <Users className="h-5 w-5" />
          Enter City Rooms
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>

      {/* Today / Tonight */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>Today / Tonight</h2>
          <button
            onClick={() => onNavigate("/?route=tickets")}
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {todayEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => onNavigate(`/?route=ticketDetail&eventId=${event.id}`)}
              className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 hover:border-white/20 hover:bg-black/30 transition-all group text-left w-full"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Calendar className="h-6 w-6 text-hot" />
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
            </button>
          ))}
        </div>
      </section>

      {/* Beacon Map */}
      <BrutalistCard variant="section">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Map className="h-8 w-8 text-hot" />
              <h2 className={typography.h2}>Beacon Map</h2>
            </div>
            <p className="text-sm opacity-70">
              Real-time hotspots from beacon scans.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-hot/50 bg-hot/10 text-hot hover:bg-hot hover:text-black"
            onClick={() => onNavigate("/?route=map")}
          >
            <Map className="h-4 w-4 mr-2" />
            Open City Map
          </Button>
        </div>
      </BrutalistCard>

      {/* City Drops */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>City Drops</h2>
          <button
            onClick={() => onNavigate("/?route=messmarket")}
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            View Drops <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <p className="text-sm opacity-70">
          Latest from MessMarket + RAW CONVICT
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {cityDrops.map((drop) => (
            <button
              key={drop.id}
              onClick={() => onNavigate(`/?route=marketListing&listingId=${drop.id}`)}
              className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 hover:border-white/20 hover:bg-black/30 transition-all group text-left w-full"
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
                    by {drop.seller} · {drop.price}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Market Sellers */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>Market Sellers in {cityData.name}</h2>
          <button
            onClick={() => onNavigate("/?route=messmarket")}
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            Browse Market <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <p className="text-sm opacity-70">
          Top sellers → ratings → listings
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {topSellers.map((seller) => (
            <BrutalistCard key={seller.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold">{seller.username}</div>
                  <div className="flex items-center gap-1 text-sm text-hot">
                    ⭐ {seller.rating}
                  </div>
                </div>
                <div className="text-xs opacity-70">
                  {seller.listings} listings
                </div>
              </div>
            </BrutalistCard>
          ))}
        </div>
      </section>

      {/* City Leaderboard */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>City Leaderboard</h2>
          <button
            onClick={() => onNavigate("/?route=xpProfile")}
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            View Full <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <p className="text-sm opacity-70">
          Top 30 men this month
        </p>
        <BrutalistCard>
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

      {/* Radio Schedule */}
      <BrutalistCard variant="section">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Radio className="h-8 w-8 text-hot" />
              <h2 className={typography.h2}>Radio Schedule</h2>
            </div>
            <p className="text-sm opacity-70">
              {cityData.name} DJs + HAND N HAND
            </p>
          </div>
          <Button
            variant="outline"
            className="border-hot/50 bg-hot/10 text-hot hover:bg-hot hover:text-black"
            onClick={() => onNavigate("/?route=radio")}
          >
            <Radio className="h-4 w-4 mr-2" />
            Listen Live
          </Button>
        </div>
      </BrutalistCard>

      {/* Care & Aftercare */}
      <section className="space-y-6">
        <h2 className={typography.h2}>Care & Aftercare</h2>
        <BrutalistCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-hot" />
              <h3 className={typography.h3}>Private check-in. Men only.</h3>
            </div>
            <p className="text-sm opacity-70">
              If something happens, we're here. Zero judgement. Zero tolerance.
            </p>
            <a
              href="https://t.me/HotmessCareBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm"
            >
              <Heart className="h-4 w-4" />
              Open Check-In
            </a>
          </div>
        </BrutalistCard>
      </section>

      {/* Club Partners */}
      <section className="space-y-6">
        <h2 className={typography.h2}>Club Partners</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {clubPartners.map((club) => (
            <div
              key={club.id}
              className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-5"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-hot" />
                  <div className="font-bold">{club.name}</div>
                </div>
                <div className="text-xs opacity-70">{club.type}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
