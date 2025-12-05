/**
 * hm/BeaconBadge — Beacon status indicator with 4 heat states
 */

import { MapPin } from 'lucide-react';

type HeatState = 'cold' | 'warm' | 'hot' | 'scorching';

interface HMBeaconBadgeProps {
  heat: HeatState;
  scans?: number;
  live?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HMBeaconBadge({ heat, scans, live = true, size = 'md' }: HMBeaconBadgeProps) {
  const heatConfig = {
    cold: {
      color: 'text-gray-500',
      bg: 'bg-gray-950/50',
      border: 'border-gray-700',
      label: 'Cold zone',
    },
    warm: {
      color: 'text-cyan-static',
      bg: 'bg-blue-950/50',
      border: 'border-cyan-static/50',
      label: 'Warming up',
    },
    hot: {
      color: 'text-heat',
      bg: 'bg-orange-950/50',
      border: 'border-heat',
      label: 'Getting hot',
    },
    scorching: {
      color: 'text-hot',
      bg: 'bg-red-950/50',
      border: 'border-hot',
      label: 'Zone boiling',
      pulse: true,
    },
  };

  const sizeConfig = {
    sm: { icon: 16, padding: 'px-2 py-1', text: 'text-xs' },
    md: { icon: 20, padding: 'px-3 py-1.5', text: 'text-sm' },
    lg: { icon: 24, padding: 'px-4 py-2', text: 'text-base' },
  };

  const config = heatConfig[heat];
  const sizing = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center gap-2 ${sizing.padding} ${config.bg} border ${config.border} ${sizing.text} uppercase tracking-wider ${
        config.pulse ? 'beacon-flare' : ''
      }`}
    >
      <div className="relative">
        <MapPin size={sizing.icon} className={config.color} />
        {live && heat !== 'cold' && (
          <div className={`absolute -top-1 -right-1 w-2 h-2 ${config.color.replace('text-', 'bg-')} rounded-full ${
            config.pulse ? 'beacon-flare' : 'animate-pulse'
          }`} />
        )}
      </div>
      
      <span className={config.color}>{config.label}</span>
      
      {scans !== undefined && (
        <>
          <span className="text-gray-600">·</span>
          <span className={config.color}>{scans}</span>
        </>
      )}
    </div>
  );
}

// Map Pin variants for map display
interface HMMapPinProps {
  heat: HeatState;
  active: boolean;
  onClick?: () => void;
}

export function HMMapPin({ heat, active, onClick }: HMMapPinProps) {
  const heatColors = {
    cold: 'text-gray-500',
    warm: 'text-cyan-static',
    hot: 'text-heat',
    scorching: 'text-hot',
  };

  return (
    <button
      onClick={onClick}
      className={`relative transition-transform hover:scale-125 ${active ? 'scale-125' : ''}`}
    >
      <MapPin
        size={32}
        className={`${heatColors[heat]} ${heat === 'scorching' ? 'beacon-flare' : ''} drop-shadow-lg`}
        fill="currentColor"
      />
      {active && (
        <div className="absolute inset-0 bg-hot/20 rounded-full blur-xl animate-pulse" />
      )}
    </button>
  );
}
