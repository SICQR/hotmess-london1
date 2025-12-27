import { useEffect, useState } from 'react';
import { Button } from '../components/design-system/Button';
import { Card } from '../components/design-system/Card';
import { ArrowLeft, Settings, Map, Radio, Calendar, MessageCircle, MapPin, TrendingUp } from 'lucide-react';

interface CityStats {
  beaconCount: number;
  scansPerDay: number;
}

interface Activity {
  id: string;
  type: 'event' | 'checkin' | 'listing';
  title: string;
  subtitle: string;
  icon: string;
  timestamp: string;
}

interface Venue {
  id: string;
  name: string;
  image: string;
  scansToday: number;
}

interface TelegramRoom {
  name: string;
  memberCount: number;
  icon: string;
}

interface CityHomeProps {
  onNavigate?: (route: string, params?: Record<string, string>) => void;
}

export default function CityHome({ onNavigate }: CityHomeProps) {
  const navigate = (route: string, params?: Record<string, string>) => onNavigate?.(route, params);
  const [stats, setStats] = useState<CityStats>({ beaconCount: 125, scansPerDay: 1200 });
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', type: 'event', title: 'Event at Fabric', subtitle: 'Techno night • 23:00', icon: '🎉', timestamp: 'Now' },
    { id: '2', type: 'checkin', title: 'Venue: Eagle London', subtitle: '150 scans today', icon: '📍', timestamp: '2h ago' },
    { id: '3', type: 'listing', title: 'New listing: Leather harness', subtitle: '£85 • @leatherguy', icon: '🛍️', timestamp: '5h ago' },
  ]);

  const [venues, setVenues] = useState<Venue[]>([
    { id: '1', name: 'Fabric', image: '', scansToday: 243 },
    { id: '2', name: 'Eagle London', image: '', scansToday: 150 },
    { id: '3', name: 'The Glory', image: '', scansToday: 89 },
  ]);

  const telegramRooms: TelegramRoom[] = [
    { name: 'London Main', memberCount: 2100, icon: '💬' },
    { name: 'London Marketplace', memberCount: 850, icon: '🛍️' },
    { name: 'London Tickets', memberCount: 420, icon: '🎫' },
  ];

  useEffect(() => {
    // In production, fetch real data from Supabase
    // For now using mock data
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('home')}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl uppercase tracking-wider">London</h1>
          <button
            onClick={() => navigate('settings')}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* City Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=400&fit=crop"
          alt="London cityscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* City Stats */}
      <div className="px-4 py-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-hot" />
          <span className="text-white/70">{stats.beaconCount} beacons</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-hot" />
          <span className="text-white/70">{stats.scansPerDay.toLocaleString()} scans/day</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4 grid grid-cols-3 gap-3">
        <Button
          onClick={() => navigate('map')}
          variant="outline"
          className="flex-col gap-2 h-auto py-4"
        >
          <Map className="w-6 h-6" />
          <span className="text-xs uppercase">Map</span>
        </Button>
        <Button
          onClick={() => navigate('beacons')}
          variant="outline"
          className="flex-col gap-2 h-auto py-4"
        >
          <Radio className="w-6 h-6" />
          <span className="text-xs uppercase">Beacons</span>
        </Button>
        <Button
          onClick={() => navigate('events')}
          variant="outline"
          className="flex-col gap-2 h-auto py-4"
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs uppercase">Events</span>
        </Button>
      </div>

      {/* Happening Now */}
      <section className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="text-sm uppercase tracking-wider text-white/70">Happening Now</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{activity.title}</h3>
                  <p className="text-sm text-white/60 truncate">{activity.subtitle}</p>
                </div>
                <span className="text-xs text-white/40 shrink-0">{activity.timestamp}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Clubs & Venues */}
      <section className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="text-sm uppercase tracking-wider text-white/70">Clubs & Venues</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {venues.map((venue) => (
            <div
              key={venue.id}
              onClick={() => navigate('map', { venueId: venue.id })}
              className="cursor-pointer group"
            >
              <div className="aspect-square bg-white/5 border border-white/10 rounded overflow-hidden mb-2 group-hover:border-hot transition-colors">
                <img
                  src={venue.image || `https://images.unsplash.com/photo-1571266028243-d220c6e2e6ca?w=300&h=300&fit=crop&sig=${venue.id}`}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-medium truncate">{venue.name}</h3>
              <p className="text-xs text-white/60">{venue.scansToday} scans</p>
            </div>
          ))}
        </div>
      </section>

      {/* Telegram Rooms */}
      <section className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="text-sm uppercase tracking-wider text-white/70">Telegram Rooms</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="space-y-3">
          {telegramRooms.map((room, index) => (
            <Card
              key={index}
              className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => {
                // Open Telegram room
                window.open(`https://t.me/hotmess_${room.name.toLowerCase().replace(' ', '_')}`, '_blank');
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{room.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-white/60">{room.memberCount.toLocaleString()} members</p>
                </div>
                <MessageCircle className="w-5 h-5 text-white/40" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
