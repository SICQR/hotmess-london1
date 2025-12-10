/**
 * ADMIN WAR ROOM
 * Live incident timeline + panic monitoring + kill switches
 * Production-ready component with API hooks
 */

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Activity,
  Zap,
  Globe2,
  MapPin,
  Clock,
  AlertTriangle,
  Power,
  Radio,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

interface Incident {
  id: string;
  severity: IncidentSeverity;
  city: string;
  country?: string;
  created_at: string;
  description: string;
  source: 'panic' | 'report' | 'moderation' | 'system';
  resolved_at?: string | null;
}

type KillSwitchScope = 'global' | 'city' | 'feature' | 'vendor' | 'beacon';

interface KillSwitch {
  id: string;
  scope: KillSwitchScope;
  target: string; // e.g. "London", "RIGHT_NOW", "Vendor:123"
  active: boolean;
  reason: string;
  created_at: string;
  created_by: string;
}

interface WarRoomStats {
  livePanicLastHour: number;
  incidentsUnresolved: number;
  rightNowPostsLastHour: number;
  activeCities: number;
}

interface AdminWarRoomPageProps {
  onNavigate?: (route: string) => void;
}

const PANEL =
  'bg-black/90 border border-white/15 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-md';

const SEVERITY_COLORS: Record<IncidentSeverity, string> = {
  low: '#00E676',
  medium: '#FFD600',
  high: '#FF6E40',
  critical: '#FF1744',
};

export function AdminWarRoom({ onNavigate }: AdminWarRoomPageProps) {
  const [stats, setStats] = useState<WarRoomStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [killSwitches, setKillSwitches] = useState<KillSwitch[]>([]);
  const [showResolved, setShowResolved] = useState(false);
  const [filterCity, setFilterCity] = useState<string | null>(null);

  // Fetch stats
  useEffect(() => {
    let alive = true;
    const loadStats = async () => {
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/war-room/stats`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        if (!res.ok) throw new Error('Stats error');
        const json = await res.json();
        if (!alive) return;
        setStats(json.stats);
      } catch (e) {
        console.error('War room stats error', e);
      }
    };
    loadStats();
    const t = window.setInterval(loadStats, 15000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  // Fetch incidents
  useEffect(() => {
    let alive = true;
    const loadIncidents = async () => {
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/incidents?limit=100`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        if (!res.ok) throw new Error('Incidents error');
        const json = await res.json();
        if (!alive) return;
        setIncidents(json.incidents ?? []);
      } catch (e) {
        console.error('Incidents error', e);
      }
    };
    loadIncidents();
    const t = window.setInterval(loadIncidents, 20000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  // Fetch kill switches
  useEffect(() => {
    let alive = true;
    const loadKillSwitches = async () => {
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/kill-switches`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        if (!res.ok) throw new Error('Kill switches error');
        const json = await res.json();
        if (!alive) return;
        setKillSwitches(json.killSwitches ?? []);
      } catch (e) {
        console.error('Kill switches error', e);
      }
    };
    loadKillSwitches();
    const t = window.setInterval(loadKillSwitches, 30000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((i) => {
      if (!showResolved && i.resolved_at) return false;
      if (filterCity && i.city.toLowerCase() !== filterCity.toLowerCase()) return false;
      return true;
    });
  }, [incidents, showResolved, filterCity]);

  const panicCritical = filteredIncidents.filter((i) => i.severity === 'critical').length;

  const toggleKillSwitch = async (id: string, active: boolean) => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/kill-switches/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ active }),
        }
      );
      if (!res.ok) throw new Error('Failed to update kill switch');
      setKillSwitches((prev) =>
        prev.map((k) => (k.id === id ? { ...k, active } : k))
      );
    } catch (e) {
      console.error('Toggle kill switch error', e);
      // In real UI, show toast
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,23,68,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_140%,rgba(0,0,0,0.9),rgba(0,0,0,1))]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-4 pb-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
            HOTMESS · ADMIN
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">WAR ROOM</h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE SAFETY
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-white/60 max-w-xl">
            Watch panic, RIGHT NOW heat and incidents in real time. This view is for internal team
            only.
          </p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-[11px] uppercase tracking-[0.24em] text-white/60 hover:text-white/90"
          >
            EXIT TO HOME
          </button>
        )}
      </header>

      {/* Main layout */}
      <main className="relative z-10 px-4 pb-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
          {/* Left: timeline + incidents */}
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={<ShieldAlert className="w-5 h-5 text-red-400" />}
                label="Panic last hour"
                value={stats?.livePanicLastHour ?? 0}
                tone="danger"
              />
              <StatCard
                icon={<AlertTriangle className="w-5 h-5 text-yellow-300" />}
                label="Incidents open"
                value={stats?.incidentsUnresolved ?? 0}
                tone="warn"
              />
              <StatCard
                icon={<Zap className="w-5 h-5 text-pink-300" />}
                label="RIGHT NOW posts / hr"
                value={stats?.rightNowPostsLastHour ?? 0}
              />
              <StatCard
                icon={<Globe2 className="w-5 h-5 text-blue-300" />}
                label="Cities active"
                value={stats?.activeCities ?? 0}
              />
            </div>

            {/* Timeline header */}
            <div className={`${PANEL} px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-white/70" />
                <div>
                  <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
                    INCIDENT TIMELINE
                  </div>
                  <div className="text-xs text-white/50">
                    Showing {filteredIncidents.length} signals
                    {filterCity && ` · ${filterCity}`}
                    {panicCritical > 0 && ` · ${panicCritical} CRITICAL`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] tracking-[0.22em]">
                <button
                  type="button"
                  onClick={() => setShowResolved((v) => !v)}
                  className="inline-flex items-center gap-1 border border-white/25 rounded-full px-2.5 py-1 text-white/70 hover:border-white/60"
                >
                  {showResolved ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      HIDE RESOLVED
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      SHOW RESOLVED
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 border border-white/25 rounded-full px-2.5 py-1 text-white/70 hover:border-white/60"
                >
                  <Filter className="w-3 h-3" />
                  FILTER
                </button>
              </div>
            </div>

            {/* Timeline list */}
            <div className={`${PANEL} px-4 py-4 max-h-[60vh] overflow-y-auto`}>
              {filteredIncidents.length === 0 ? (
                <div className="text-sm text-white/60">
                  No incidents matching filters. Good sign.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredIncidents.map((inc) => (
                    <IncidentRow
                      key={inc.id}
                      incident={inc}
                      onFilterCity={setFilterCity}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: kill switches / map context */}
          <div className="space-y-4">
            {/* Kill switches */}
            <div className={`${PANEL} px-4 py-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4 text-red-400" />
                  <div>
                    <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
                      KILL SWITCHES
                    </div>
                    <div className="text-xs text-white/50">
                      Global, city, feature, vendor and beacon scopes.
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {killSwitches.length === 0 && (
                  <div className="text-sm text-white/60">
                    No switches configured. System is fully live.
                  </div>
                )}
                {killSwitches.map((ks) => (
                  <KillSwitchRow
                    key={ks.id}
                    killSwitch={ks}
                    onToggle={toggleKillSwitch}
                  />
                ))}
              </div>
            </div>

            {/* Context panel */}
            <div className={`${PANEL} px-4 py-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-pink-300" />
                <div>
                  <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
                    CONTEXT GLANCE
                  </div>
                  <div className="text-xs text-white/50">
                    Use this when deciding to pull a switch.
                  </div>
                </div>
              </div>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Check last 60 minutes of panic vs RIGHT NOW posts in that city.</li>
                <li>• Look at the venue&apos;s incident history (Harassment / Consent / Substances).</li>
                <li>• If in doubt, soft-lock new RIGHT NOW posts before going global.</li>
                <li>• Always keep Hand N Hand visible, even when features are down.</li>
              </ul>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('map')}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/80 hover:border-white/70"
                >
                  <Globe2 className="w-4 h-4" />
                  OPEN GLOBE HEAT VIEW
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: 'danger' | 'warn';
}) {
  return (
    <div className={`${PANEL} px-3 py-3`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <div className="text-[10px] uppercase tracking-[0.26em] text-white/60">{label}</div>
      </div>
      <div
        className={`text-2xl font-black ${
          tone === 'danger'
            ? 'text-red-400'
            : tone === 'warn'
            ? 'text-yellow-300'
            : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function IncidentRow({
  incident,
  onFilterCity,
}: {
  incident: Incident;
  onFilterCity: (city: string | null) => void;
}) {
  const color = SEVERITY_COLORS[incident.severity];
  const date = new Date(incident.created_at);
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}88` }}
        />
        <span className="flex-1 w-px bg-white/10 mt-1" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] uppercase tracking-[0.26em]"
                style={{ color }}
              >
                {incident.severity.toUpperCase()}
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/50">
                {incident.source.toUpperCase()}
              </span>
            </div>
            <p className="mt-1 text-sm">{incident.description}</p>
            <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-white/60">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeLabel}
              </span>
              {incident.city && (
                <button
                  type="button"
                  onClick={() => onFilterCity(incident.city)}
                  className="inline-flex items-center gap-1 underline underline-offset-2 decoration-white/40"
                >
                  <MapPin className="w-3 h-3" />
                  {incident.city}
                </button>
              )}
              {incident.resolved_at && (
                <span className="inline-flex items-center gap-1 text-green-300">
                  <ShieldAlert className="w-3 h-3" />
                  RESOLVED
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KillSwitchRow({
  killSwitch,
  onToggle,
}: {
  killSwitch: KillSwitch;
  onToggle: (id: string, active: boolean) => void;
}) {
  const scopeLabel =
    killSwitch.scope === 'global'
      ? 'GLOBAL'
      : killSwitch.scope === 'city'
      ? 'CITY'
      : killSwitch.scope === 'feature'
      ? 'FEATURE'
      : killSwitch.scope === 'vendor'
      ? 'VENDOR'
      : 'BEACON';

  return (
    <div className="flex items-start justify-between gap-2 border border-white/12 rounded-xl px-3 py-2 bg-black/40">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] uppercase tracking-[0.26em] ${
              killSwitch.active ? 'text-red-400' : 'text-white/50'
            }`}
          >
            {scopeLabel}
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/60">
            {killSwitch.target}
          </span>
        </div>
        <p className="text-xs text-white/70">{killSwitch.reason}</p>
        <div className="mt-1 text-[10px] text-white/40">
          By {killSwitch.created_by} ·{' '}
          {new Date(killSwitch.created_at).toLocaleString(undefined, {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onToggle(killSwitch.id, !killSwitch.active)}
        className={`mt-1 inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em] border ${
          killSwitch.active
            ? 'bg-red-500 text-white border-red-400 hover:bg-red-600'
            : 'bg-white/5 text-white/80 border-white/25 hover:border-white/60'
        }`}
      >
        {killSwitch.active ? 'PULL' : 'ARM'}
      </button>
    </div>
  );
}
