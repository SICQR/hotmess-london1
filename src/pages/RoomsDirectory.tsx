// Rooms Directory - Web → Telegram Bridge
// Following Phil's spec for complete room ecosystem

import { Users, Lock, Zap, Shield, Star } from 'lucide-react';
import { RoomCard } from '../components/hotmess/RoomCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface RoomsDirectoryProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

const rooms = {
  core: [
    {
      id: 'general',
      name: 'General',
      description: 'Updates, meetups, info',
      memberCount: 1240,
      telegramLink: 'https://t.me/hotmessldn_general',
    },
    {
      id: 'events',
      name: 'Events Room',
      description: "Tonight's events + set times",
      memberCount: 980,
      telegramLink: 'https://t.me/hotmessldn_events',
    },
    {
      id: 'aftercare',
      name: 'Aftercare Room',
      description: 'Private, calm, no judgement',
      memberCount: 450,
      telegramLink: 'https://t.me/hotmessldn_aftercare',
    },
  ],
  interest: [
    {
      id: 'social',
      name: 'Social',
      description: 'Casual chat and meetups',
      memberCount: 820,
      telegramLink: 'https://t.me/hotmessldn_social',
    },
    {
      id: 'kink',
      name: 'Kink',
      description: 'Open kink discussion',
      memberCount: 650,
      isLocked: true,
      requiredLevel: 3,
      telegramLink: 'https://t.me/hotmessldn_kink',
    },
    {
      id: 'djs',
      name: 'DJs',
      description: 'Music production and mixing',
      memberCount: 280,
      isLocked: true,
      requiredLevel: 4,
      telegramLink: 'https://t.me/hotmessldn_djs',
    },
    {
      id: 'training',
      name: 'Training',
      description: 'Fitness and gym buddies',
      memberCount: 540,
      isLocked: true,
      requiredLevel: 3,
      telegramLink: 'https://t.me/hotmessldn_training',
    },
  ],
  seller: [
    {
      id: 'sellers',
      name: 'Seller Room',
      description: 'Sell to men in London',
      memberCount: 180,
      isLocked: true,
      requiredLevel: 5,
      telegramLink: 'https://t.me/hotmessldn_sellers',
    },
  ],
  elite: [
    {
      id: 'elite',
      name: 'Elite Room',
      description: 'City leaders only',
      memberCount: 45,
      isLocked: true,
      requiredLevel: 10,
      telegramLink: 'https://t.me/hotmessldn_elite',
    },
  ],
};

export default function RoomsDirectory({ onNavigate }: RoomsDirectoryProps) {
  // Mock user level - replace with real auth context
  const userLevel = 4;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=2000&q=80"
            alt="Rooms"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users size={36} className="text-hot" />
            <h1 className="text-5xl md:text-6xl glow-text uppercase">City Rooms</h1>
          </div>
          <p className="text-xl text-white/70">Join the men in London.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
        {/* Your Level */}
        <section className="bg-gradient-to-br from-purple-900/20 to-black rounded-2xl border border-white/10 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Your Level</p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl text-white">Level {userLevel}</h2>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="text-sm text-yellow-400">
                    {userLevel < 3 ? '3 rooms unlocked' : userLevel < 5 ? '7 rooms unlocked' : 'All rooms unlocked'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('xpProfile')}
              className="text-white/60 hover:text-white transition text-sm"
            >
              View XP →
            </button>
          </div>
        </section>

        {/* Core Rooms (Always Unlocked) */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl text-white uppercase mb-2">Core Rooms</h2>
            <p className="text-white/60">Open to all members</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.core.map((room) => (
              <RoomCard key={room.id} room={room} userLevel={userLevel} />
            ))}
          </div>
        </section>

        {/* Interest Rooms */}
        <section>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl text-white uppercase">Interest Rooms</h2>
              <Lock size={20} className="text-yellow-400" />
            </div>
            <p className="text-white/60">Level 3+ required</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {rooms.interest.map((room) => (
              <RoomCard key={room.id} room={room} userLevel={userLevel} />
            ))}
          </div>
        </section>

        {/* Seller Room */}
        <section>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl text-white uppercase">Seller Room</h2>
              <Lock size={20} className="text-yellow-400" />
            </div>
            <p className="text-white/60">Level 5+ • Sell to men in London</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {rooms.seller.map((room) => (
              <RoomCard key={room.id} room={room} userLevel={userLevel} />
            ))}
          </div>
        </section>

        {/* Elite Room */}
        <section className="bg-gradient-to-br from-yellow-400/10 via-black to-black rounded-3xl border border-yellow-400/20 p-8 md:p-12">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Star size={32} className="text-yellow-400" />
              <h2 className="text-2xl md:text-3xl text-white uppercase">Elite Room</h2>
            </div>
            <p className="text-white/60">Level 10+ • City leaders only</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {rooms.elite.map((room) => (
              <RoomCard key={room.id} room={room} userLevel={userLevel} />
            ))}
          </div>

          {userLevel < 10 && (
            <div className="mt-8 p-6 bg-black/50 rounded-2xl border border-yellow-400/20">
              <h3 className="text-white mb-2">Unlock Elite Room</h3>
              <p className="text-sm text-white/60 mb-4">
                Reach Level 10 to join the most active members in your city. 
                Elite members get early event access, drop priority, and exclusive perks.
              </p>
              <button
                onClick={() => onNavigate('xpProfile')}
                className="text-yellow-400 hover:text-yellow-300 transition text-sm"
              >
                View your XP progress →
              </button>
            </div>
          )}
        </section>

        {/* How to Earn XP */}
        <section className="bg-neutral-900 rounded-2xl border border-white/10 p-8">
          <h3 className="text-xl text-white mb-4">How to Unlock More Rooms</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white/80 mb-2">Earn XP by:</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• Buying tickets (+40 XP)</li>
                <li>• Scanning at events (+50 XP)</li>
                <li>• Posting in rooms (+2 XP)</li>
                <li>• Purchasing from MessMarket (+15 XP)</li>
                <li>• Attending events (+100 XP total)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white/80 mb-2">Room Unlock Levels:</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• Level 1-2: Core rooms only (3 rooms)</li>
                <li>• Level 3+: Interest rooms unlocked (+4 rooms)</li>
                <li>• Level 5+: Seller room unlocked</li>
                <li>• Level 10+: Elite room unlocked</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
