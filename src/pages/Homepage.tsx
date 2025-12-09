// HOTMESS LONDON - Homepage (Brutalist-Luxury Editorial with London Nightlife Imagery)

import { Play, Calendar, Radio, Heart, TrendingUp, ChevronRight, Scan, ArrowRight } from 'lucide-react';
import { EventCard } from '../components/hotmess/EventCard';
import { DropCard } from '../components/hotmess/DropCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomepageProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

// Mock data - replace with real API calls
const tonightEvents = [
  {
    id: 'evt-001',
    name: 'VOLTAGE',
    venue: 'E1',
    time: '23:00',
    date: 'Tonight',
    xp: 90,
    price: 15,
    image: 'https://images.unsplash.com/photo-1564748559966-780f157e0a05?w=800&q=80',
  },
  {
    id: 'evt-002',
    name: 'HAND N HAND Sunday',
    venue: 'The Glory',
    time: '21:00',
    date: 'Tonight',
    xp: 100,
    price: 12,
    image: 'https://images.unsplash.com/photo-1693463589542-67fd84c2aae8?w=800&q=80',
  },
  {
    id: 'evt-003',
    name: 'RAW Afterhours',
    venue: 'Dalston Superstore',
    time: '20:00',
    date: 'Tonight',
    xp: 80,
    price: 10,
    image: 'https://images.unsplash.com/photo-1744314080490-ed41f6319475?w=800&q=80',
  },
];

const cityDrops = [
  {
    id: 'drop-mesh-tank',
    name: 'Mesh Tank - RAW',
    price: 28,
    seller: '@kinkymerch',
    image: 'https://images.unsplash.com/photo-1621750627159-cf77b0b91aac?w=400&q=80',
    xp: 50,
    stock: 8,
    endsAt: '2h',
  },
  {
    id: 'drop-harness',
    name: 'Leather Harness',
    price: 45,
    seller: '@rawgear',
    image: 'https://images.unsplash.com/photo-1759354250893-1010d8da2078?w=400&q=80',
    xp: 75,
    stock: 3,
    endsAt: '5h',
  },
  {
    id: 'drop-crop',
    name: 'Graphic Crop Tee',
    price: 22,
    seller: '@hmcollective',
    image: 'https://images.unsplash.com/photo-1754475172820-6053bbed3b25?w=400&q=80',
    xp: 40,
    stock: 12,
    endsAt: '12h',
  },
  {
    id: 'drop-underwear',
    name: 'Designer Brief Set',
    price: 35,
    seller: '@brutaljewelry',
    image: 'https://images.unsplash.com/photo-1588358643351-ddef0543045d?w=400&q=80',
    xp: 60,
    stock: 5,
    endsAt: '8h',
  },
];

const leaderboard = [
  { rank: 1, username: '@rave_king', xp: 12450, level: 24 },
  { rank: 2, username: '@night_hawk', xp: 11200, level: 23 },
  { rank: 3, username: '@darkroom_dave', xp: 10800, level: 22 },
  { rank: 4, username: '@toxic_energy', xp: 9600, level: 21 },
  { rank: 5, username: '@afterhours', xp: 8900, level: 20 },
];

export function Homepage({ onNavigate }: HomepageProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Dark Club Aesthetic with London Nightlife */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1695128912450-fd020c29bb8f?w=2000&q=80"
            alt="HOTMESS LONDON"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-6xl">
            <h1 className="mb-4 sm:mb-6">
              HOTMESS<br />LONDON
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 mb-6 sm:mb-8 md:mb-10 max-w-2xl text-editorial">
              Men-only nightlife OS. Real connection. Real heat. 18+.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('nightPulse')}
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 h-14 sm:h-16 px-6 sm:px-8 md:px-10 bg-gradient-to-r from-[#ff1694] to-[#ff0080] text-white hover:from-white hover:to-[#ff1694] hover:text-black transition-all text-base sm:text-lg uppercase tracking-wider font-semibold shadow-[0_0_40px_rgba(255,22,148,0.6)] hover:shadow-[0_0_60px_rgba(255,22,148,0.9)] w-full sm:w-auto"
              >
                <span className="text-xl sm:text-2xl">🌍</span>
                <span className="text-sm sm:text-base md:text-lg">NIGHT PULSE GLOBE</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <button
                onClick={() => onNavigate('rooms')}
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 h-14 sm:h-16 px-6 sm:px-8 md:px-10 bg-white text-black hover:bg-white/90 transition-all text-base sm:text-lg uppercase tracking-wider font-semibold w-full sm:w-auto"
              >
                <span className="text-sm sm:text-base md:text-lg">Enter City Rooms</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-24 space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-32">
        {/* Tonight in London - Editorial Grid */}
        <section>
          <div className="flex flex-col sm:flex-row items-start justify-between mb-8 sm:mb-10 md:mb-12 pb-4 sm:pb-5 md:pb-6 border-b border-brutal gap-4">
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-1 h-6 sm:h-8 bg-hotmess-red" />
                <h2 className="uppercase">
                  Tonight in London
                </h2>
              </div>
              <p className="text-white/60 text-sm sm:text-base md:text-lg">Live events. Real connections. Real XP.</p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="group text-white/50 hover:text-white transition-colors flex items-center gap-2 text-label mt-0 sm:mt-2"
            >
              View All
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {tonightEvents.map((event) => (
              <EventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* City Drops - Minimal Grid */}
        <section>
          <div className="flex flex-col sm:flex-row items-start justify-between mb-8 sm:mb-10 md:mb-12 pb-4 sm:pb-5 md:pb-6 border-b border-brutal gap-4">
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-1 h-6 sm:h-8 bg-hotmess-red" />
                <h2 className="uppercase">
                  City Drops
                </h2>
              </div>
              <p className="text-white/60 text-sm sm:text-base md:text-lg">New releases. Limited. No restocks.</p>
            </div>
            <button
              onClick={() => onNavigate('drops')}
              className="group text-white/50 hover:text-white transition-colors flex items-center gap-2 text-label mt-0 sm:mt-2"
            >
              Browse Drops
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {cityDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* HOTMESS Radio - Featured with Club Interior */}
        <section className="relative overflow-hidden border border-brutal hover-lift">
          <div className="absolute inset-0 opacity-30">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1740432271705-e45aeb5c4ec2?w=1200&q=80"
              alt="Radio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative p-6 sm:p-8 md:p-12 lg:p-16 bg-gradient-to-r from-black via-black/95 to-black/80">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Radio className="text-white" size={24} strokeWidth={1.5} />
                <h2 className="uppercase">HOTMESS Radio</h2>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-white/60 mb-6 sm:mb-8 text-editorial">
                Live 24/7 — track IDs, set lists, HAND N HAND Sundays.
              </p>
              <button
                onClick={() => onNavigate('radio')}
                className="group inline-flex items-center gap-2 sm:gap-3 h-12 sm:h-14 px-6 sm:px-8 bg-white text-black hover:bg-white/90 transition-all uppercase tracking-wider font-semibold text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                Listen Now
                <Play className="group-hover:scale-110 transition-transform" size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* HNH MESS Product - Split Layout with Masculine Body Imagery */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center border border-brutal p-6 sm:p-8 md:p-12 lg:p-16 hover-lift">
          <div>
            <h2 className="uppercase mb-4 sm:mb-6">
              HNH MESS
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 text-editorial">
              The stigma-smashing lube for men.<br />
              QR → Community Room + Aftercare + HAND N HAND
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('scan')}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 px-6 sm:px-8 bg-white text-black hover:bg-white/90 transition-all uppercase tracking-wider font-semibold text-sm sm:text-base"
              >
                <Scan size={16} />
                Scan
              </button>
              <button
                onClick={() => onNavigate('shopProduct', { slug: 'hnh-mess' })}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 px-6 sm:px-8 border border-brutal hover:bg-white/5 transition-all uppercase tracking-wider font-semibold text-white text-sm sm:text-base"
              >
                Buy
              </button>
            </div>
          </div>
          <div className="aspect-square overflow-hidden border border-brutal bg-mono-900 flex items-center justify-center order-first md:order-last">
            {/* TODO: Replace with actual HNH MESS bottle image from figma:asset */}
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1621750627159-cf77b0b91aac?w=800&q=80"
              alt="HNH MESS Bottle"
              className="w-full h-full object-cover opacity-70"
            />
          </div>
        </section>

        {/* Care - Clean Module */}
        <section className="border border-brutal p-6 sm:p-8 md:p-12 lg:p-16 hover-lift">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Heart className="text-white" size={24} strokeWidth={1.5} />
            <h2 className="uppercase">Care</h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/60 mb-6 sm:mb-8 text-editorial max-w-2xl">
            Private aftercare check-in. Men only.
          </p>
          <button
            onClick={() => onNavigate('care')}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 px-6 sm:px-8 border border-brutal hover:bg-white/5 transition-all uppercase tracking-wider font-semibold text-white text-sm sm:text-base w-full sm:w-auto"
          >
            Open Check-In
          </button>
        </section>

        {/* Leaderboard - Minimal Table */}
        <section>
          <div className="flex flex-col sm:flex-row items-start justify-between mb-8 sm:mb-10 md:mb-12 pb-4 sm:pb-5 md:pb-6 border-b border-brutal gap-4">
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-1 h-6 sm:h-8 bg-hotmess-red" />
                <h2 className="uppercase">
                  Leaderboard
                </h2>
              </div>
              <p className="text-white/60 text-sm sm:text-base md:text-lg">Top men in London this month.</p>
            </div>
            <button
              onClick={() => onNavigate('xpProfile')}
              className="group text-white/50 hover:text-white transition-colors flex items-center gap-2 text-label mt-0 sm:mt-2"
            >
              View Full
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>

          <div className="border border-brutal">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.username}
                className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-brutal last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                  <div className="w-8 sm:w-10 md:w-12 text-center flex-shrink-0">
                    <span className={`text-lg sm:text-xl md:text-2xl ${index < 3 ? 'text-white' : 'text-white/40'}`}>
                      {entry.rank}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base md:text-lg text-white mb-0.5 sm:mb-1">{entry.username}</p>
                    <p className="text-xs sm:text-sm text-white/40 text-label">Level {entry.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base sm:text-lg md:text-xl text-white">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-white/40 text-label">XP</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}