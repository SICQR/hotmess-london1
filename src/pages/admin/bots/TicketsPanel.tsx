/**
 * TICKETS PANEL — Bot-driven ticket stats
 */

import { useEffect, useState } from 'react';
import { Ticket, TrendingUp } from 'lucide-react';

interface TicketStat {
  eventName: string;
  botSales: number;
  webSales: number;
  totalRevenue: number;
}

export function TicketsPanel() {
  const [stats, setStats] = useState<TicketStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from Supabase
    setTimeout(() => {
      setStats([
        { eventName: 'HAMMERSMITH CRUEL', botSales: 23, webSales: 45, totalRevenue: 816 },
        { eventName: 'HAND N HAND LIVE', botSales: 18, webSales: 32, totalRevenue: 500 },
        { eventName: 'RAW CONVICT LAUNCH', botSales: 34, webSales: 67, totalRevenue: 1515 }
      ]);
      setLoading(false);
    }, 900);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Ticket size={24} className="text-pink-500" />
          <h2 className="text-2xl uppercase tracking-tight">Tickets via Bots</h2>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold uppercase">{stat.eventName}</h3>
                <span className="text-green-400 font-bold">£{stat.totalRevenue}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-zinc-500">Bot Sales: </span>
                  <span className="text-white font-semibold">{stat.botSales}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Web Sales: </span>
                  <span className="text-white font-semibold">{stat.webSales}</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-green-400">
                  <TrendingUp size={16} />
                  <span className="font-semibold">{Math.round((stat.botSales / (stat.botSales + stat.webSales)) * 100)}% via bot</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
