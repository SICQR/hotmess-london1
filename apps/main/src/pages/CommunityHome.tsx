// Community Homepage - Complete Section
// Following Phil's spec for Telegram room network

import { Users, Shield, Lock, ExternalLink, ChevronRight, MessageCircle } from 'lucide-react';
import { HotmessButton } from '../components/hotmess/Button';
import { RoomCard } from '../components/hotmess/RoomCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CommunityHomeProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

const hosts = [
  { username: '@alexldn', role: 'Events', avatar: '' },
  { username: '@careldn', role: 'Aftercare', avatar: '' },
  { username: '@dropsldn', role: 'Drops', avatar: '' },
];

const cityRooms = [
  {
    id: 'general',
    name: 'General Room',
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
  {
    id: 'social',
    name: 'Social Room',
    description: 'Casual chat and meetups',
    memberCount: 820,
    telegramLink: 'https://t.me/hotmessldn_social',
  },
  {
    id: 'kink',
    name: 'Kink Room',
    description: 'Open kink discussion',
    memberCount: 650,
    isLocked: true,
    requiredLevel: 3,
    telegramLink: 'https://t.me/hotmessldn_kink',
  },
  {
    id: 'artists',
    name: 'RAW CONVICT Artists',
    description: 'Label artists and music discussion',
    memberCount: 340,
    isLocked: true,
    requiredLevel: 5,
    telegramLink: 'https://t.me/hotmessldn_artists',
  },
];

export function CommunityHome({ onNavigate }: CommunityHomeProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000&q=80"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <Users size={40} className="text-hot" />
            <h1 className="text-5xl md:text-7xl glow-text uppercase">COMMUNITY</h1>
          </div>
          <p className="text-2xl md:text-3xl text-white/80 mb-8 max-w-2xl">
            "Your city, your men, your network."
          </p>
          <HotmessButton
            onClick={() => onNavigate('rooms')}
            icon={ChevronRight}
            iconPosition="right"
            className="h-14 w-fit px-8 text-lg"
          >
            ENTER ROOMS
          </HotmessButton>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
        {/* Why Rooms */}
        <section className="bg-neutral-900 rounded-3xl border border-white/10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="text-hot" size={32} />
            <h2 className="text-3xl md:text-4xl text-white uppercase">Why Rooms?</h2>
          </div>
          
          <p className="text-xl text-white/70 mb-8">
            HOTMESS runs on encrypted Telegram rooms.<br />
            Local men. Local events. Local info.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-black/50 rounded-2xl border border-white/5">
              <h3 className="text-white mb-2">Encrypted</h3>
              <p className="text-sm text-white/60">
                End-to-end encryption. Your conversations stay private.
              </p>
            </div>
            <div className="p-6 bg-black/50 rounded-2xl border border-white/5">
              <h3 className="text-white mb-2">No Algorithms</h3>
              <p className="text-sm text-white/60">
                No feed manipulation. Real conversations in real time.
              </p>
            </div>
            <div className="p-6 bg-black/50 rounded-2xl border border-white/5">
              <h3 className="text-white mb-2">City-Specific</h3>
              <p className="text-sm text-white/60">
                Connect with men in your city. Local intel only.
              </p>
            </div>
          </div>

          <HotmessButton
            onClick={() => onNavigate('communityWhyRooms')}
            variant="secondary"
            icon={ChevronRight}
            iconPosition="right"
          >
            LEARN WHY
          </HotmessButton>
        </section>

        {/* Host Team */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl text-white uppercase mb-2">Host Team</h2>
            <p className="text-white/60">Meet the official hosts in London.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {hosts.map((host) => (
              <div
                key={host.username}
                className="bg-neutral-900 rounded-2xl p-6 border border-white/10"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-hot to-purple-500 mb-4" />
                <h3 className="text-white text-lg mb-1">{host.username}</h3>
                <p className="text-sm text-white/60">{host.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* City Network */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl text-white uppercase mb-2">City Network</h2>
            <p className="text-white/60">Join the rooms that matter to you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {cityRooms.map((room) => (
              <RoomCard key={room.id} room={room} userLevel={4} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <HotmessButton
              onClick={() => onNavigate('rooms')}
              icon={ChevronRight}
              iconPosition="right"
            >
              VIEW ALL ROOMS
            </HotmessButton>
          </div>
        </section>

        {/* Safety & Care */}
        <section className="bg-gradient-to-br from-blue-900/20 to-black rounded-3xl border border-blue-500/20 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-blue-400" size={32} />
            <h2 className="text-3xl md:text-4xl text-white uppercase">Safety & Care</h2>
          </div>
          
          <p className="text-xl text-white/70 mb-8">
            Zero judgement. Zero tolerance.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-white mb-3">Our Standards</h3>
              <ul className="space-y-2 text-white/60">
                <li>• Respect all members</li>
                <li>• No harassment, ever</li>
                <li>• Consent is everything</li>
                <li>• Report concerns immediately</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white mb-3">If You Need Help</h3>
              <ul className="space-y-2 text-white/60">
                <li>• Contact hosts directly</li>
                <li>• Use /report command</li>
                <li>• Access aftercare room</li>
                <li>• 24/7 care resources</li>
              </ul>
            </div>
          </div>

          <HotmessButton onClick={() => onNavigate('legalSafety')} variant="secondary">
            VIEW SAFETY CENTER
          </HotmessButton>
        </section>
      </div>
    </div>
  );
}
