/**
 * BOT STATUS CARD — Real-time bot health monitoring
 */

import { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface BotStatusCardProps {
  name: string;
  icon: string;
  endpoint: string;
}

interface BotStats {
  status: 'active' | 'inactive' | 'error';
  messagesHandled: number;
  lastActivity: string;
  uptime: string;
}

export function BotStatusCard({ name, icon, endpoint }: BotStatusCardProps) {
  const [stats, setStats] = useState<BotStats>({
    status: 'active',
    messagesHandled: 0,
    lastActivity: 'Just now',
    uptime: '99.8%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch real stats from Supabase
    // For now, simulate data
    setTimeout(() => {
      setStats({
        status: 'active',
        messagesHandled: Math.floor(Math.random() * 1000) + 100,
        lastActivity: `${Math.floor(Math.random() * 10) + 1}m ago`,
        uptime: `${(99 + Math.random()).toFixed(1)}%`
      });
      setLoading(false);
    }, 500);
  }, [endpoint]);

  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const StatusIcon = stats.status === 'active' ? CheckCircle : stats.status === 'error' ? AlertCircle : Activity;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-xl uppercase tracking-tight">{name}</h3>
            <p className="text-xs text-zinc-500 mt-1">{endpoint}</p>
          </div>
        </div>
        <StatusIcon 
          size={20} 
          className={stats.status === 'active' ? 'text-green-500' : stats.status === 'error' ? 'text-red-500' : 'text-yellow-500'} 
        />
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-2 w-2 rounded-full ${statusColors[stats.status]} ${stats.status === 'active' ? 'animate-pulse' : ''}`} />
        <span className="text-sm text-zinc-400 uppercase tracking-wider">
          {stats.status}
        </span>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Messages:</span>
            <span className="text-white font-semibold">{stats.messagesHandled.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Last Activity:</span>
            <span className="text-white">{stats.lastActivity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Uptime:</span>
            <span className="text-green-400 font-semibold">{stats.uptime}</span>
          </div>
        </div>
      )}
    </div>
  );
}
