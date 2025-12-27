/**
 * BOT CONTROL CENTRE — Admin Dashboard
 * Central command for 6-bot network
 * Real-time analytics, moderation, XP triggers, broadcasts
 */

import { useEffect, useState } from 'react';
import { BotStatusCard } from './BotStatusCard';
import { ModQueue } from './ModQueue';
import { RoomsStats } from './RoomsStats';
import { XPStats } from './XPStats';
import { BotBroadcast } from './BotBroadcast';
import { TicketsPanel } from './TicketsPanel';
import { ArrowLeft } from 'lucide-react';
import { NavFunction } from '../../../lib/routes';

interface BotsDashboardProps {
  onNavigate: NavFunction;
}

export function BotsDashboard({ onNavigate }: BotsDashboardProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto mb-8">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          BACK TO ADMIN
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl uppercase tracking-tight mb-2">
              Bot Control Centre
            </h1>
            <p className="text-zinc-400">
              Central command for HOTMESS bot network
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-zinc-400">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Bot Status Grid */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BotStatusCard name="RadioBot" icon="📻" endpoint="/functions/v1/botRadio" key={`radio-${refreshKey}`} />
          <BotStatusCard name="RoomsBot" icon="🏠" endpoint="/functions/v1/botRooms" key={`rooms-${refreshKey}`} />
          <BotStatusCard name="CareBot" icon="❤️" endpoint="/functions/v1/botCare" key={`care-${refreshKey}`} />
          <BotStatusCard name="DropBot" icon="💸" endpoint="/functions/v1/botDrop" key={`drop-${refreshKey}`} />
          <BotStatusCard name="TicketsBot" icon="🎟️" endpoint="/functions/v1/botTickets" key={`tickets-${refreshKey}`} />
          <BotStatusCard name="AdminBot" icon="🔧" endpoint="/functions/v1/botAdmin" key={`admin-${refreshKey}`} />
        </div>

        {/* Stats & Controls */}
        <div className="space-y-6">
          <ModQueue key={`mod-${refreshKey}`} />
          <RoomsStats key={`rooms-${refreshKey}`} />
          <XPStats key={`xp-${refreshKey}`} />
          <TicketsPanel key={`tix-${refreshKey}`} />
          <BotBroadcast />
        </div>
      </div>
    </div>
  );
}
