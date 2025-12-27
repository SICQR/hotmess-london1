/**
 * ADMIN WAR ROOM — PULSE MONITOR
 * 
 * Real-time dashboard showing:
 * - All scans, listens, and purchases across the platform
 * - Ghost XP detection (suspicious activity patterns)
 * - Fraud indicators
 * - Live activity feed
 */

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Activity, AlertTriangle, DollarSign, Radio, QrCode, TrendingUp } from 'lucide-react';

interface ActivityEvent {
  id: string;
  user_id: string;
  type: 'scan' | 'listen' | 'purchase' | 'xp_award';
  amount?: number;
  reason?: string;
  metadata?: any;
  created_at: string;
  username?: string;
}

interface UserStats {
  user_id: string;
  username: string;
  total_xp: number;
  scans_today: number;
  suspicious_score: number;
}

export const PulseMonitor = () => {
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [suspiciousUsers, setSuspiciousUsers] = useState<UserStats[]>([]);
  const [stats, setStats] = useState({
    scansToday: 0,
    listensToday: 0,
    purchasesToday: 0,
    xpAwarded: 0,
  });

  useEffect(() => {
    // Fetch initial data
    fetchRecentActivity();
    fetchSuspiciousUsers();
    fetchStats();

    // Subscribe to real-time updates
    const activityChannel = supabase
      .channel('admin-pulse-monitor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'xp_ledger',
        },
        (payload) => {
          const newEvent = payload.new as ActivityEvent;
          setRecentActivity((prev) => [newEvent, ...prev].slice(0, 50));
          
          // Update stats
          if (newEvent.reason === 'beacon_scan') {
            setStats((s) => ({ ...s, scansToday: s.scansToday + 1 }));
          }
          setStats((s) => ({ ...s, xpAwarded: s.xpAwarded + (newEvent.amount || 0) }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
    };
  }, []);

  const fetchRecentActivity = async () => {
    const { data, error } = await supabase
      .from('xp_ledger')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setRecentActivity(data);
    }
  };

  const fetchSuspiciousUsers = async () => {
    // Users with abnormally high XP gain in short time
    const { data, error } = await supabase.rpc('detect_suspicious_activity');

    if (!error && data) {
      setSuspiciousUsers(data);
    }
  };

  const fetchStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count scans today
    const { count: scansCount } = await supabase
      .from('xp_ledger')
      .select('*', { count: 'exact', head: true })
      .eq('reason', 'beacon_scan')
      .gte('created_at', today.toISOString());

    // Count listens today
    const { count: listensCount } = await supabase
      .from('xp_ledger')
      .select('*', { count: 'exact', head: true })
      .eq('reason', 'radio_listen')
      .gte('created_at', today.toISOString());

    // Count purchases today
    const { count: purchasesCount } = await supabase
      .from('xp_ledger')
      .select('*', { count: 'exact', head: true })
      .eq('reason', 'purchase')
      .gte('created_at', today.toISOString());

    // Total XP awarded today
    const { data: xpData } = await supabase
      .from('xp_ledger')
      .select('amount')
      .gte('created_at', today.toISOString())
      .gt('amount', 0);

    const totalXP = xpData?.reduce((sum, row) => sum + row.amount, 0) || 0;

    setStats({
      scansToday: scansCount || 0,
      listensToday: listensCount || 0,
      purchasesToday: purchasesCount || 0,
      xpAwarded: totalXP,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <header className="mb-8 border-b border-red-500/30 pb-4">
        <h1 className="text-3xl font-black italic text-red-500 uppercase">
          ⚠️ Admin War Room — Pulse Monitor
        </h1>
        <p className="text-xs text-white/50 uppercase tracking-wide">
          LIVE ACTIVITY SURVEILLANCE // FRAUD DETECTION ACTIVE
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<QrCode size={16} />}
          label="Scans Today"
          value={stats.scansToday}
          color="border-green-500"
        />
        <StatCard
          icon={<Radio size={16} />}
          label="Listens Today"
          value={stats.listensToday}
          color="border-blue-500"
        />
        <StatCard
          icon={<DollarSign size={16} />}
          label="Purchases Today"
          value={stats.purchasesToday}
          color="border-purple-500"
        />
        <StatCard
          icon={<TrendingUp size={16} />}
          label="XP Awarded"
          value={stats.xpAwarded}
          color="border-gold"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-2 border border-white/10 p-6 bg-white/5">
          <h2 className="text-xs font-black uppercase mb-4 flex items-center gap-2">
            <Activity size={12} className="text-green-500" />
            Live Activity Feed
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {recentActivity.map((event) => (
              <ActivityRow key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Suspicious Users */}
        <div className="border border-red-500/50 p-6 bg-red-500/5">
          <h2 className="text-xs font-black uppercase mb-4 flex items-center gap-2">
            <AlertTriangle size={12} className="text-red-500" />
            Ghost XP Detection
          </h2>
          <div className="space-y-3">
            {suspiciousUsers.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-8">
                NO SUSPICIOUS ACTIVITY DETECTED
              </p>
            ) : (
              suspiciousUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="p-3 border border-red-500/30 bg-black/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold">{user.username}</span>
                    <span className="text-xs bg-red-500 text-black px-2 py-1 font-bold">
                      RISK: {user.suspicious_score}%
                    </span>
                  </div>
                  <div className="text-[10px] text-white/50 space-y-1">
                    <div>Total XP: {user.total_xp}</div>
                    <div>Scans Today: {user.scans_today}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className={`border ${color} p-4 bg-black`}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-black uppercase opacity-50">{label}</span>
      {icon}
    </div>
    <span className="text-2xl font-black italic">{value.toLocaleString()}</span>
  </div>
);

const ActivityRow = ({ event }: { event: ActivityEvent }) => {
  const getIcon = () => {
    switch (event.reason) {
      case 'beacon_scan':
        return <QrCode size={10} className="text-green-500" />;
      case 'radio_listen':
        return <Radio size={10} className="text-blue-500" />;
      case 'purchase':
        return <DollarSign size={10} className="text-purple-500" />;
      default:
        return <Activity size={10} className="text-white/50" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <div className="flex items-center gap-3 text-[10px] border-l-2 border-white/10 pl-3 py-2 hover:border-white/30 transition-colors">
      {getIcon()}
      <span className="flex-1 font-mono">
        {event.username || 'Anonymous'} • {event.reason}
      </span>
      <span className="font-bold text-gold">
        {event.amount > 0 ? `+${event.amount}` : event.amount} XP
      </span>
      <span className="text-white/30">{formatTime(event.created_at)}</span>
    </div>
  );
};
