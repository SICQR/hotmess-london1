// City Page - Complete Blueprint
// Following Phil's spec for city-specific nightlife dashboard

import { Calendar, Map, ShoppingBag, Radio, Heart, TrendingUp, ChevronRight, Users } from 'lucide-react';
import { HotmessButton } from '../components/hotmess/Button';
import { EventCard } from '../components/hotmess/EventCard';
import { DropCard } from '../components/hotmess/DropCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CityPageProps {
  cityId?: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

// Mock data
const getCityData = (cityId: string) => {
  const cities: Record<string, any> = {
    london: {
      name: 'London',
      tagline: 'Your city, your men, your network',
      events: [
        {
          id: 'evt-001',
          name: 'VOLTAGE',
          venue: 'E1',
          time: '23:00',
          date: 'Tonight',
          xp: 90,
          price: 15,
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        },
        {
          id: 'evt-002',
          name: 'HAND N HAND Sunday',
          venue: 'The Glory',
          time: '21:00',
          date: 'Tonight',
          xp: 100,
          price: 12,
          image: 'https://images.unsplash.com/photo-1571266028243-d220e2f4e5fa?w=800&q=80',
        },
      ],
      drops: [
        {
          id: 'drop-001',
          name: 'Mesh Tank - RAW',
          price: 45,
          seller: 'NightWear Collective',
          image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
          xp: 25,
          stock: 8,
        },
      ],
      sellers: [
        { id: '1', name: 'NightWear Collective', rating: 4.9, listings: 24, sales: 340 },
        { id: '2', name: 'Voltage Apparel', rating: 4.8, listings: 18, sales: 220 },
        { id: '3', name: 'RAW Threads', rating: 4.7, listings: 32, sales: 410 },
      ],
      leaderboard: [
        { rank: 1, username: '@alexldn', xp: 12830, level: 8 },
        { rank: 2, username: '@jakevoltage', xp: 11200, level: 7 },
        { rank: 3, username: '@marcraw', xp: 10900, level: 7 },
      ],
      clubs: [
        { name: 'E1', type: 'Club', area: 'East London' },
        { name: 'The Glory', type: 'Bar', area: 'Haggerston' },
        { name: 'Dalston Superstore', type: 'Club', area: 'Dalston' },
      ],
    },
  };

  return cities[cityId] || cities.london;
};

export function CityPageNew({ cityId = 'london', onNavigate }: CityPageProps) {
  const city = getCityData(cityId);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=2000&q=80"
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16">
          <h1 className="text-5xl md:text-7xl mb-4 glow-text uppercase">
            HOTMESS {city.name.toUpperCase()}
          </h1>
          <p className="text-xl text-white/70 mb-8">{city.tagline}</p>
          <HotmessButton
            onClick={() => onNavigate('rooms')}
            icon={ChevronRight}
            iconPosition="right"
            className="h-12 w-fit"
          >
            ENTER CITY ROOMS
          </HotmessButton>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
        {/* Today / Tonight */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-hot" size={28} />
                <h2 className="text-3xl text-white uppercase">Today / Tonight</h2>
              </div>
              <p className="text-white/60">Live events happening now</p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-white/60 hover:text-white transition flex items-center gap-2"
            >
              View All <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {city.events.map((event: any) => (
              <EventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* Beacon Map */}
        <section className="bg-neutral-900 rounded-3xl border border-white/10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <Map className="text-hot" size={28} />
            <h2 className="text-3xl text-white uppercase">Beacon Map</h2>
          </div>
          <p className="text-white/60 mb-6">Real-time hotspots from beacon scans.</p>
          
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-hot/10 via-black to-purple-500/10 border border-white/10 flex items-center justify-center mb-6">
            <p className="text-white/40">Interactive map loading...</p>
          </div>

          <HotmessButton onClick={() => onNavigate('map')} variant="secondary">
            OPEN CITY MAP
          </HotmessButton>
        </section>

        {/* City Drops */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl text-white uppercase mb-2">City Drops</h2>
              <p className="text-white/60">Latest from MessMarket + RAW CONVICT</p>
            </div>
            <button
              onClick={() => onNavigate('drops')}
              className="text-white/60 hover:text-white transition flex items-center gap-2"
            >
              View Drops <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {city.drops.map((drop: any) => (
              <DropCard key={drop.id} drop={drop} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* Market Sellers */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="text-hot" size={28} />
                <h2 className="text-3xl text-white uppercase">Market Sellers in {city.name}</h2>
              </div>
              <p className="text-white/60">Top sellers → ratings → listings</p>
            </div>
            <button
              onClick={() => onNavigate('messmarket')}
              className="text-white/60 hover:text-white transition flex items-center gap-2"
            >
              Browse Market <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid gap-4">
            {city.sellers.map((seller: any) => (
              <div
                key={seller.id}
                className="bg-neutral-900 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => onNavigate('vendorProfile', { vendorId: seller.id })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg mb-1">{seller.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>⭐ {seller.rating}</span>
                      <span>{seller.listings} listings</span>
                      <span>{seller.sales} sales</span>
                    </div>
                  </div>
                  <ChevronRight className="text-white/40" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* City Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-hot" size={28} />
                <h2 className="text-3xl text-white uppercase">City Leaderboard</h2>
              </div>
              <p className="text-white/60">Top 30 men this month</p>
            </div>
            <button
              onClick={() => onNavigate('xpProfile')}
              className="text-white/60 hover:text-white transition flex items-center gap-2"
            >
              View Full <ChevronRight size={18} />
            </button>
          </div>

          <div className="bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden">
            {city.leaderboard.map((entry: any, index: number) => (
              <div
                key={entry.username}
                className="flex items-center justify-between p-5 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      index === 0
                        ? 'bg-yellow-400 text-black'
                        : index === 1
                        ? 'bg-gray-300 text-black'
                        : index === 2
                        ? 'bg-amber-600 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <div>
                    <p className="text-white">{entry.username}</p>
                    <p className="text-sm text-white/60">Level {entry.level}</p>
                  </div>
                </div>
                <p className="text-white">{entry.xp.toLocaleString()} XP</p>
              </div>
            ))}
          </div>
        </section>

        {/* Radio Schedule */}
        <section className="bg-gradient-to-br from-purple-900/20 to-black rounded-3xl border border-white/10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <Radio className="text-hot" size={28} />
            <h2 className="text-3xl text-white uppercase">Radio Schedule</h2>
          </div>
          <p className="text-white/60 mb-6">{city.name} DJs + HAND N HAND</p>
          <HotmessButton onClick={() => onNavigate('radioSchedule')} icon={ChevronRight} iconPosition="right">
            LISTEN LIVE
          </HotmessButton>
        </section>

        {/* Care & Aftercare */}
        <section className="bg-gradient-to-br from-blue-900/20 to-black rounded-3xl border border-blue-500/20 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-blue-400" size={28} />
            <h2 className="text-3xl text-white uppercase">Care & Aftercare</h2>
          </div>
          <p className="text-white/60 mb-6">Private check-in. Men only.</p>
          <HotmessButton onClick={() => onNavigate('care')} variant="secondary">
            OPEN CHECK-IN
          </HotmessButton>
        </section>

        {/* Club Partners */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-hot" size={28} />
                <h2 className="text-3xl text-white uppercase">Club Partners</h2>
              </div>
              <p className="text-white/60">Official HOTMESS venues</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {city.clubs.map((club: any, index: number) => (
              <div
                key={index}
                className="bg-neutral-900 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <h3 className="text-white text-lg mb-2">{club.name}</h3>
                <div className="text-sm text-white/60">
                  <p>{club.type}</p>
                  <p>{club.area}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
