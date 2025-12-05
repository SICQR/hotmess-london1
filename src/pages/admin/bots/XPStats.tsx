/**
 * XP STATS — Real-time XP distribution & leaderboard
 */

import { useEffect, useState } from 'react';
import { Zap, Award } from 'lucide-react';

interface XPEvent {
  id: string;
  user: string;
  amount: number;
  reason: string;
  timestamp: string;
}

interface LeaderboardEntry {
  rank: number;
  user: string;
  totalXP: number;
}

export function XPStats() {
  const [recentEvents, setRecentEvents] = useState<XPEvent[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalXPToday, setTotalXPToday] = useState(0);

  useEffect(() => {
    // In production, fetch from Supabase
    setTimeout(() => {
      setRecentEvents([
        { id: '1', user: 'User #8421', amount: 50, reason: 'Scanned beacon', timestamp: '2m ago' },
        { id: '2', user: 'User #3421', amount: 100, reason: 'Purchased ticket', timestamp: '5m ago' },
        { id: '3', user: 'User #9234', amount: 25, reason: 'Joined room', timestamp: '8m ago' },
        { id: '4', user: 'User #4812', amount: 75, reason: 'Attended event', timestamp: '12m ago' }
      ]);
      setLeaderboard([
        { rank: 1, user: 'User #4821', totalXP: 2450 },
        { rank: 2, user: 'User #9234', totalXP: 2120 },
        { rank: 3, user: 'User #3421', totalXP: 1890 }
      ]);
      setTotalXPToday(3842);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap size={24} className="text-yellow-500" />
          <h2 className="text-2xl uppercase tracking-tight">XP Engine</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Today</p>
          <p className="text-2xl text-yellow-400 font-bold">{totalXPToday.toLocaleString()} XP</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-32 bg-zinc-800 rounded-lg animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">Recent XP Events</h3>
            <div className="space-y-2">
              {recentEvents.map(event => (
                <div 
                  key={event.id}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold">{event.user}</span>
                    <span className="text-yellow-400 font-bold">+{event.amount} XP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">{event.reason}</span>
                    <span className="text-zinc-500">{event.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
              <Award size={16} />
              Top Users This Week
            </h3>
            <div className="space-y-2">
              {leaderboard.map(entry => (
                <div 
                  key={entry.rank}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' : 
                        entry.rank === 2 ? 'bg-zinc-400/20 text-zinc-300' : 
                        'bg-orange-500/20 text-orange-400'}
                    `}>
                      {entry.rank}
                    </div>
                    <span className="text-white">{entry.user}</span>
                  </div>
                  <span className="text-yellow-400 font-bold">{entry.totalXP.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
