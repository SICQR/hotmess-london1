/**
 * ROOMS STATS — Live room membership & activity
 */

import { useEffect, useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';

interface RoomStat {
  id: string;
  name: string;
  city: string;
  members: number;
  active: number;
  trend: 'up' | 'down' | 'stable';
}

export function RoomsStats() {
  const [rooms, setRooms] = useState<RoomStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from Supabase
    setTimeout(() => {
      setRooms([
        { id: '1', name: 'London Aftercare', city: 'London', members: 257, active: 43, trend: 'up' },
        { id: '2', name: 'Berlin Club Tips', city: 'Berlin', members: 143, active: 21, trend: 'stable' },
        { id: '3', name: 'NYC Hosts Network', city: 'NYC', members: 89, active: 12, trend: 'up' },
        { id: '4', name: 'Paris Care Hub', city: 'Paris', members: 76, active: 8, trend: 'down' }
      ]);
      setLoading(false);
    }, 700);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-blue-500" />
          <h2 className="text-2xl uppercase tracking-tight">Rooms Stats</h2>
        </div>
        <span className="text-sm text-zinc-500">
          {rooms.reduce((sum, r) => sum + r.members, 0)} total members
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map(room => (
            <div 
              key={room.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{room.name}</h3>
                    <span className="text-xs text-zinc-500 uppercase">{room.city}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span>{room.members} members</span>
                    <span className="text-green-400">{room.active} active now</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp 
                    size={20} 
                    className={
                      room.trend === 'up' ? 'text-green-500' : 
                      room.trend === 'down' ? 'text-red-500 rotate-180' : 
                      'text-zinc-500'
                    } 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
