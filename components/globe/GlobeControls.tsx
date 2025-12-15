/**
 * UNIFIED GLOBE CONTROLS
 * Shared UI controls for MapPage, NightPulse, and all globe-based pages
 */

import { Clock, TrendingUp, MapPin, Search, Filter, Eye, Users, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BeaconTypeFilter {
  checkin: boolean;
  ticket: boolean;
  product: boolean;
  drop: boolean;
  event: boolean;
  chat: boolean;
  vendor: boolean;
  reward: boolean;
  sponsor: boolean;
}

interface LayerToggles {
  pins: boolean;
  heat: boolean;
  trails: boolean;
  cities: boolean;
}

export interface GlobeControlsProps {
  // Page mode
  mode?: 'map' | 'nightpulse';
  
  // Time controls
  timeWindow: 'tonight' | 'weekend' | 'month' | 'live' | '10m' | '1h' | '24h';
  onTimeWindowChange: (window: any) => void;
  
  // Search
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: (query: string) => void;
  
  // Layer toggles
  layers: LayerToggles;
  onLayerToggle: (layer: keyof LayerToggles) => void;
  
  // Beacon type filters
  beaconFilters?: BeaconTypeFilter;
  onBeaconFilterToggle?: (type: keyof BeaconTypeFilter) => void;
  
  // UI toggles
  showFilters: boolean;
  onToggleFilters: () => void;
  showStats?: boolean;
  onToggleStats?: () => void;
  
  // View mode (2D/3D)
  viewMode?: '2d' | '3d';
  onViewModeChange?: (mode: '2d' | '3d') => void;
  
  // Global stats (optional)
  stats?: {
    activeBeacons?: number;
    scansToday?: number;
    totalXPAwarded?: number;
  };
}

const BEACON_TYPE_LABELS: Record<keyof BeaconTypeFilter, string> = {
  checkin: 'Check-ins',
  ticket: 'Tickets',
  product: 'Products',
  drop: 'Drops',
  event: 'Events',
  chat: 'Chat',
  vendor: 'Vendors',
  reward: 'Rewards',
  sponsor: 'Sponsors',
};

const BEACON_TYPE_COLORS: Record<keyof BeaconTypeFilter, string> = {
  checkin: '#FF1744',
  ticket: '#00BCD4',
  product: '#FFD600',
  drop: '#FF10F0',
  event: '#00E5FF',
  chat: '#00C853',
  vendor: '#7C4DFF',
  reward: '#FF6E40',
  sponsor: '#FFC107',
};

export function GlobeControls({
  mode = 'map',
  timeWindow,
  onTimeWindowChange,
  searchQuery = '',
  onSearchChange,
  onSearch,
  layers,
  onLayerToggle,
  beaconFilters,
  onBeaconFilterToggle,
  showFilters,
  onToggleFilters,
  showStats,
  onToggleStats,
  viewMode,
  onViewModeChange,
  stats,
}: GlobeControlsProps) {
  // Shared styles
  const chipOn = 'bg-[#ff1694] border-[#ff1694] text-white';
  const chipOff = 'bg-black/30 border-white/20 text-white/60 hover:border-white/40';
  const panel = 'bg-black/70 backdrop-blur-lg border border-white/10 rounded-xl';

  return (
    <>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4">
        <div className={`${panel} p-3`}>
          <div className="flex items-center gap-4 flex-wrap">
            {/* 2D/3D Toggle (Map mode only) */}
            {mode === 'map' && viewMode && onViewModeChange && (
              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                    viewMode === '2d' ? chipOn : chipOff
                  }`}
                  onClick={() => onViewModeChange('2d')}
                  type="button"
                >
                  2D
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                    viewMode === '3d' ? chipOn : chipOff
                  }`}
                  onClick={() => onViewModeChange('3d')}
                  type="button"
                >
                  3D
                </button>
              </div>
            )}

            {/* Time Window Selector */}
            <div className="flex items-center gap-2">
              {mode === 'nightpulse' ? (
                <>
                  <button
                    onClick={() => onTimeWindowChange('tonight')}
                    className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                      timeWindow === 'tonight' ? chipOn : chipOff
                    }`}
                  >
                    <Clock className="w-3 h-3 inline mr-2" />
                    TONIGHT
                  </button>
                  <button
                    onClick={() => onTimeWindowChange('weekend')}
                    className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                      timeWindow === 'weekend' ? chipOn : chipOff
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 inline mr-2" />
                    WEEKEND
                  </button>
                  <button
                    onClick={() => onTimeWindowChange('month')}
                    className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                      timeWindow === 'month' ? chipOn : chipOff
                    }`}
                  >
                    <MapPin className="w-3 h-3 inline mr-2" />
                    30 DAYS
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onTimeWindowChange('live')}
                    className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                      timeWindow === 'live' ? chipOn : chipOff
                    }`}
                  >
                    LIVE
                  </button>
                  <button
                    onClick={() => onTimeWindowChange('10m')}
                    className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                      timeWindow === '10m' ? chipOn : chipOff
                    }`}
                  >
                    10M
                  </button>
                  <button
                    onClick={() => onTimeWindowChange('1h')}
                    className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                      timeWindow === '1h' ? chipOn : chipOff
                    }`}
                  >
                    1H
                  </button>
                  <button
                    onClick={() => onTimeWindowChange('24h')}
                    className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                      timeWindow === '24h' ? chipOn : chipOff
                    }`}
                  >
                    24H
                  </button>
                </>
              )}
            </div>

            {/* Search (Map mode only) */}
            {mode === 'map' && onSearchChange && (
              <div className="flex-1 max-w-md relative">
                <Search size={16} className="text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  className="w-full bg-black/50 border border-white/15 focus:border-white/60 outline-none rounded-full pl-10 pr-3 py-2 text-sm tracking-wide placeholder:text-white/30"
                  placeholder="CITY / CODE / VENUE"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && onSearch) {
                      onSearch(searchQuery);
                    }
                  }}
                  style={{ fontWeight: 500, fontSize: '12px' }}
                />
              </div>
            )}

            {/* Stats Toggle */}
            {onToggleStats && (
              <button
                className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                  showStats ? chipOn : chipOff
                }`}
                type="button"
                onClick={onToggleStats}
              >
                <TrendingUp size={14} className="inline mr-1" />
                STATS
              </button>
            )}

            {/* Filter Toggle */}
            <button
              className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                showFilters ? chipOn : chipOff
              }`}
              type="button"
              onClick={onToggleFilters}
            >
              <Filter size={14} className="inline mr-1" />
              FILTER
            </button>
          </div>

          {/* Layer Controls Row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                layers.pins ? chipOn : chipOff
              }`}
              type="button"
              onClick={() => onLayerToggle('pins')}
            >
              PINS
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                layers.heat ? chipOn : chipOff
              }`}
              type="button"
              onClick={() => onLayerToggle('heat')}
            >
              HEAT
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                layers.trails ? chipOn : chipOff
              }`}
              type="button"
              onClick={() => onLayerToggle('trails')}
            >
              TRAILS
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                layers.cities ? chipOn : chipOff
              }`}
              type="button"
              onClick={() => onLayerToggle('cities')}
            >
              CITIES
            </button>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      {stats && (
        <AnimatePresence>
          {showStats && onToggleStats && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-32 left-4 z-20 w-[280px]"
            >
              <div className={`${panel} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] tracking-[0.38em] uppercase opacity-75">GLOBAL STATS</span>
                  <button onClick={onToggleStats} type="button">
                    <X size={16} className="text-white/60 hover:text-white" />
                  </button>
                </div>

                <div className="space-y-3">
                  {stats.activeBeacons !== undefined && (
                    <div>
                      <div className="text-white/50 text-[10px] tracking-[0.28em] uppercase mb-1">
                        Active Beacons
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '24px' }}>
                        {stats.activeBeacons.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {stats.scansToday !== undefined && (
                    <div>
                      <div className="text-white/50 text-[10px] tracking-[0.28em] uppercase mb-1">
                        Scans Today
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '24px' }}>
                        {stats.scansToday.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {stats.totalXPAwarded !== undefined && (
                    <div>
                      <div className="text-white/50 text-[10px] tracking-[0.28em] uppercase mb-1">
                        Total XP
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '24px' }}>
                        {stats.totalXPAwarded.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Beacon Type Filters Panel */}
      {beaconFilters && onBeaconFilterToggle && (
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-32 right-4 z-20 w-[280px]"
            >
              <div className={`${panel} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] tracking-[0.38em] uppercase opacity-75">BEACON TYPES</span>
                  <button onClick={onToggleFilters} type="button">
                    <X size={16} className="text-white/60 hover:text-white" />
                  </button>
                </div>

                <div className="space-y-2">
                  {(Object.keys(beaconFilters) as Array<keyof BeaconTypeFilter>).map((type) => (
                    <button
                      key={type}
                      onClick={() => onBeaconFilterToggle(type)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                        beaconFilters[type]
                          ? 'bg-white/10 border border-white/20'
                          : 'bg-black/30 border border-white/5'
                      }`}
                      type="button"
                    >
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>
                        {BEACON_TYPE_LABELS[type]}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BEACON_TYPE_COLORS[type] }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
