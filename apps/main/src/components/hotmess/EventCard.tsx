// Event Card Component - Editorial Brutal Luxury

import { MapPin, Clock, Zap } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    venue: string;
    time: string;
    date: string;
    xp: number;
    image?: string;
    price?: number;
  };
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function EventCard({ event, onNavigate }: EventCardProps) {
  return (
    <div className="group border border-brutal hover:border-brutal-strong transition-all hover-lift cursor-pointer" onClick={() => onNavigate('eventDetail', { eventId: event.id })}>
      {event.image && (
        <div className="aspect-[4/3] w-full bg-mono-900 overflow-hidden">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl text-white mb-3 uppercase tracking-tight">{event.name}</h3>
          
          <div className="flex flex-col gap-2 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.5} />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} strokeWidth={1.5} />
              <span>{event.date} • {event.time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-brutal">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-hotmess-red" strokeWidth={1.5} />
            <span className="text-sm text-white/70">+{event.xp} XP</span>
          </div>
          
          {event.price && (
            <span className="text-lg text-white">£{event.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}