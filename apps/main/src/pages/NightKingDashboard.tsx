/**
 * NIGHT KING DASHBOARD — Territorial Command Center
 * 
 * Allows rulers to:
 * - Monitor their empire (owned venues)
 * - Track passive XP royalties in real-time
 * - Detect incoming war threats
 * - View vassal scan activity
 */

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useHotmessStore } from '../store/useHotmessStore';
import { Crown, ShieldAlert, Zap, Users, TrendingUp, Swords } from 'lucide-react';

interface VenueStats {
  beacon_id: string;
  venue_name: string;
  king_user_id: string;
  king_since: string;
  weekly_scan_count: number;
  bounty_multiplier: number;
  total_royalties_earned: number;
  active_threats: number;
}

interface RoyaltyEvent {
  id: string;
  king_id: string;
  venue_id: string;
  amount_xp: number;
  scanned_by: string;
  created_at: string;
}

export const NightKingDashboard = () => {
  const { user } = useHotmessStore();
  const [stats, setStats] = useState<VenueStats[]>([]);
  const [recentTax, setRecentTax] = useState<RoyaltyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 1. Initial Fetch of Owned Venues
    const fetchStats = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('night_king_stats')
        .select('*')
        .eq('king_user_id', user.id);
      
      if (!error && data) {
        setStats(data);
      }
      setIsLoading(false);
    };

    // 2. Real-time Subscription to Royalties (The "Ping")
    const taxChannel = supabase
      .channel('royalties_ping')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'king_royalties',
          filter: `king_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('[NIGHT KING] New tax received:', payload);
          setRecentTax((prev) => [payload.new as RoyaltyEvent, ...prev].slice(0, 10));
          fetchStats(); // Refresh aggregates
        }
      )
      .subscribe();

    fetchStats();

    return () => {
      supabase.removeChannel(taxChannel);
    };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/50">You must be signed in to view your empire.</p>
      </div>
    );
  }

  const totalVenues = stats.length;
  const totalRoyalties = stats.reduce((acc, curr) => acc + curr.total_royalties_earned, 0);
  const activeWars = stats.reduce((acc, curr) => acc + curr.active_threats, 0);
  const hasThreats = activeWars > 0;

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24 font-mono selection:bg-gold">
      {/* Header */}
      <header className="mb-10 border-b-2 border-gold/30 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-gold">
            Territorial Command
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold/50 mt-1">
            User ID: {user.username} // Night King Status
          </p>
        </div>
        <Crown className="text-gold animate-pulse" size={32} />
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin text-gold">
            <Crown size={48} />
          </div>
        </div>
      ) : stats.length === 0 ? (
        <div className="border-2 border-white/10 p-12 text-center">
          <Crown className="mx-auto mb-4 text-white/20" size={64} />
          <h2 className="text-2xl font-black italic mb-2">No Territories Claimed</h2>
          <p className="text-sm text-white/50 mb-6">
            You need to dominate a venue by scanning more than anyone else for 7 days.
          </p>
          <button className="px-6 py-3 bg-gold text-black font-black uppercase text-xs hover:bg-gold/80 transition-colors">
            View Globe
          </button>
        </div>
      ) : (
        <>
          {/* Empire Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard
              label="Venues Owned"
              value={totalVenues}
              icon={<Crown size={16} />}
              color="border-gold"
            />
            <MetricCard
              label="Passive XP Flow"
              value={totalRoyalties}
              icon={<Zap size={16} />}
              color="border-hot-pink"
            />
            <MetricCard
              label="Active Threats"
              value={activeWars}
              icon={<ShieldAlert size={16} />}
              color={hasThreats ? 'border-red-500 animate-pulse' : 'border-white/20'}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Real-Time Vassal Feed */}
            <section className="border border-white/10 bg-white/5 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50 flex items-center gap-2">
                <Users size={12} /> Recent Vassal Scans (Tax)
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentTax.length === 0 && (
                  <p className="text-[10px] italic opacity-30 text-center py-8">
                    NO LIVE PULSE DETECTED...
                  </p>
                )}
                {recentTax.map((tax) => (
                  <div
                    key={tax.id}
                    className="flex justify-between items-center text-[10px] border-l-2 border-gold pl-3 py-1 bg-gold/5 animate-fadeIn"
                  >
                    <span className="uppercase font-mono">
                      Vassal @ {tax.venue_id.slice(0, 8)}...
                    </span>
                    <span className="font-black text-gold">+{tax.amount_xp} XP ROYALTY</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Venue Defense Status */}
            <section className="border border-white/10 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50 flex items-center gap-2">
                <TrendingUp size={12} /> Venue Integrity
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {stats.map((venue) => (
                  <div
                    key={venue.beacon_id}
                    className="p-4 border border-white/10 hover:border-gold/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-black italic uppercase text-sm">
                        {venue.venue_name || 'Unknown Venue'}
                      </h3>
                      {venue.active_threats > 0 && (
                        <div className="flex items-center gap-1">
                          <Swords size={12} className="text-red-500" />
                          <span className="bg-red-500 text-black text-[8px] px-2 font-bold animate-bounce">
                            UNDER ATTACK
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[10px] text-white/50">
                      <div>
                        <div className="opacity-50 mb-1">Weekly Scans</div>
                        <div className="font-bold text-white">{venue.weekly_scan_count}</div>
                      </div>
                      <div>
                        <div className="opacity-50 mb-1">Total Tax</div>
                        <div className="font-bold text-gold">{venue.total_royalties_earned} XP</div>
                      </div>
                      <div>
                        <div className="opacity-50 mb-1">XP Multiplier</div>
                        <div className={`font-bold ${venue.bounty_multiplier > 1 ? 'text-red-500' : 'text-white'}`}>
                          {venue.bounty_multiplier}x
                        </div>
                      </div>
                      <div>
                        <div className="opacity-50 mb-1">Crowned</div>
                        <div className="font-bold text-white text-[9px]">
                          {new Date(venue.king_since).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ label, value, icon, color }: MetricCardProps) => (
  <div className={`p-6 border-2 ${color} bg-black flex flex-col justify-between h-32`}>
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{label}</span>
      {icon}
    </div>
    <span className="text-4xl font-black italic">{value}</span>
  </div>
);
