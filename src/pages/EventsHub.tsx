// Events UX - Complete Flow
// Following Phil's complete events spec

import { Calendar, Zap, Clock, MapPin, Users, MessageCircle, Heart } from 'lucide-react';
import { HotmessButton } from '../components/hotmess/Button';
import { EventCard } from '../components/hotmess/EventCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface EventsHubProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

const tonightEvents = [
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
];

const thisWeekEvents = [
  {
    id: 'evt-003',
    name: 'RAW Afterhours',
    venue: 'Dalston Superstore',
    time: '20:00',
    date: 'Tomorrow',
    xp: 80,
    price: 10,
    image: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&q=80',
  },
  {
    id: 'evt-004',
    name: 'HIGH Warehouse Party',
    venue: 'Secret Location',
    time: '22:00',
    date: 'Friday',
    xp: 120,
    price: 20,
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
  },
  {
    id: 'evt-005',
    name: 'HUNG Pool Party',
    venue: 'Rooftop Bar',
    time: '15:00',
    date: 'Saturday',
    xp: 95,
    price: 25,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  },
];

export function EventsHub({ onNavigate }: EventsHubProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=2000&q=80"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={36} className="text-hot" />
            <h1 className="text-5xl md:text-6xl glow-text uppercase">Events</h1>
          </div>
          <p className="text-xl text-white/70">Tonight's parties. This week's experiences.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
        {/* XP Per Event Info */}
        <section className="bg-gradient-to-br from-yellow-900/20 to-black rounded-3xl border border-yellow-400/20 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Zap size={32} className="text-yellow-400" />
            <h2 className="text-2xl md:text-3xl text-white uppercase">XP Per Event</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-black/50 rounded-2xl border border-yellow-400/10">
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center mb-3">
                <Zap size={24} className="text-yellow-400" />
              </div>
              <p className="text-2xl text-white mb-1">+40 XP</p>
              <p className="text-sm text-white/60">Buy ticket</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-black/50 rounded-2xl border border-yellow-400/10">
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center mb-3">
                <Zap size={24} className="text-yellow-400" />
              </div>
              <p className="text-2xl text-white mb-1">+50 XP</p>
              <p className="text-sm text-white/60">Scan at door</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-black/50 rounded-2xl border border-yellow-400/10">
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center mb-3">
                <Zap size={24} className="text-yellow-400" />
              </div>
              <p className="text-2xl text-white mb-1">+10 XP</p>
              <p className="text-sm text-white/60">Enter event room</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-black/50 rounded-2xl border border-yellow-400/10">
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center mb-3">
                <Zap size={24} className="text-yellow-400" />
              </div>
              <p className="text-2xl text-white mb-1">+2 XP</p>
              <p className="text-sm text-white/60">Posting inside</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
            <p className="text-center text-white/80">
              <strong>Total:</strong> Attend an event and earn up to <strong className="text-yellow-400">100+ XP</strong>
            </p>
          </div>
        </section>

        {/* Tonight */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={28} className="text-hot" />
              <h2 className="text-3xl md:text-4xl text-white uppercase">Tonight</h2>
            </div>
            <p className="text-white/60">Events happening now in London</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tonightEvents.map((event) => (
              <EventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* This Week */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={28} className="text-hot" />
              <h2 className="text-3xl md:text-4xl text-white uppercase">This Week</h2>
            </div>
            <p className="text-white/60">Upcoming events you don't want to miss</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thisWeekEvents.map((event) => (
              <EventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <HotmessButton onClick={() => onNavigate('events')} variant="secondary">
              VIEW ALL EVENTS
            </HotmessButton>
          </div>
        </section>

        {/* How Events Work */}
        <section className="bg-neutral-900 rounded-3xl border border-white/10 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl text-white uppercase mb-6">How Events Work</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-hot/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white">1</span>
              </div>
              <div>
                <h3 className="text-white mb-1">Browse & Buy Ticket</h3>
                <p className="text-sm text-white/60">
                  Find an event you like and buy your ticket. Instant QR code delivery via Telegram bot.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-hot/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white">2</span>
              </div>
              <div>
                <h3 className="text-white mb-1">Join Event Room</h3>
                <p className="text-sm text-white/60">
                  Connect with other attendees, get updates, and see set times in the event's Telegram room.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-hot/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white">3</span>
              </div>
              <div>
                <h3 className="text-white mb-1">Scan at Door</h3>
                <p className="text-sm text-white/60">
                  Show your QR code at the door. Instant verification + XP reward.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-hot/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white">4</span>
              </div>
              <div>
                <h3 className="text-white mb-1">Enjoy & Earn</h3>
                <p className="text-sm text-white/60">
                  Have a great night. Check in with aftercare if needed. Earn XP for participation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
