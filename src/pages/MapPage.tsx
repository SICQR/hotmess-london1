import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Radio, Globe, Target, MapPin, Clock, Copy, Share2, X, Search, Filter, TrendingUp, Users, Calendar } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { WorldMap2D } from '../components/WorldMap2D';
import { UnifiedGlobe, type BeaconMarker } from '../components/globe/UnifiedGlobe';

type BeaconType = 'checkin' | 'ticket' | 'product' | 'drop' | 'event' | 'chat' | 'vendor' | 'reward' | 'sponsor';

interface LiveBeacon {
  id: string;
  code: string;
  type: BeaconType;
  title?: string;
  city?: string;
  xp?: number;
  sponsor?: string;
  sponsored?: boolean;
  startsAt?: string;
  endsAt?: string;
  lng: number;
  lat: number;
  status?: string;
  description?: string | null;
}

interface HeatBin {
  id: string;
  west: number;
  south: number;
  east: number;
  north: number;
  count: number;
}

interface GlobalStats {
  activeBeacons: number;
  scansToday: number;
  totalXPAwarded: number;
  tablesExist?: boolean;
}

type TimeMode = 'live' | '10m' | '1h' | '24h';

interface MapPageProps {
  onNavigate: (route: string) => void;
}

const BEACON_TYPE_COLORS: Record<string, string> = {
  checkin: '#FF1744',
  drop: '#FF10F0',
  event: '#00E5FF',
  product: '#FFD600',
  vendor: '#7C4DFF',
  chat: '#00C853',
  reward: '#FF6E40',
  sponsor: '#FFC107',
  ticket: '#00BCD4',
};

const BEACON_TYPE_LABELS: Record<string, string> = {
  checkin: 'CHECK-IN',
  drop: 'DROP',
  event: 'EVENT',
  product: 'SHOP',
  vendor: 'VENDOR',
  chat: 'CHAT',
  reward: 'REWARD',
  sponsor: 'SPONSOR',
  ticket: 'TICKET',
};

function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  
  return isMobile;
}

export function MapPage({ onNavigate }: MapPageProps) {
  const isMobile = useIsMobile();

  // UI state
  const [mode3d, setMode3d] = useState(true);
  const [layerPins, setLayerPins] = useState(true);
  const [layerHeat, setLayerHeat] = useState(false);
  const [layerTrails, setLayerTrails] = useState(false);
  const [layerCities, setLayerCities] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [timeMode, setTimeMode] = useState<TimeMode>('live');
  const [playbackOn, setPlaybackOn] = useState(false);
  const [scrub01, setScrub01] = useState(1);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<BeaconType | null>(null);

  // Data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [beacons, setBeacons] = useState<LiveBeacon[]>([]);
  const [heatBins, setHeatBins] = useState<HeatBin[]>([]);
  const [trails, setTrails] = useState<any[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);

  // Fetch live map data (preferred endpoint)
  useEffect(() => {
    let alive = true;

    async function loadData() {
      try {
        setError(null);
        
        // Try new /map/live endpoint first
        const mapRes = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/map/live`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        
        if (mapRes.ok) {
          const json = await mapRes.json();
          if (!alive) return;
          setBeacons(json.beacons || []);
          setHeatBins(json.heatBins || []);
          setLoading(false);
          return;
        }

        // Fallback to old /beacons/active endpoint
        const beaconsRes = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/beacons/active`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );

        if (beaconsRes.ok) {
          const data = await beaconsRes.json();
          if (!alive) return;
          setBeacons(data.beacons || []);
        }

        setLoading(false);
      } catch (e: any) {
        if (!alive) return;
        setLoading(false);
        setError(e?.message || 'Failed to load map data');
      }
    }

    loadData();
    const t = window.setInterval(loadData, 15000);
    
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  // Fetch stats
  useEffect(() => {
    let alive = true;

    async function loadStats() {
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/beacons/stats`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        
        if (res.ok) {
          const data = await res.json();
          if (!alive) return;
          setStats(data);
        }
      } catch {
        // Stats optional
      }
    }

    loadStats();
    const t = window.setInterval(loadStats, 30000);
    
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  // Load trails when needed
  useEffect(() => {
    if (!layerTrails && timeMode !== '24h') return;

    let alive = true;
    async function loadTrails() {
      try {
        const window = timeMode === '10m' ? '10m' : timeMode === '1h' ? '1h' : '24h';
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/map/trails?window=${window}`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        
        if (!alive) return;
        setTrails(json.trails || []);
      } catch {
        // Trails optional
      }
    }
    
    loadTrails();
    return () => {
      alive = false;
    };
  }, [layerTrails, timeMode]);

  // Filtered beacons
  const filteredBeacons = useMemo(() => {
    let result = beacons;
    
    if (filterType) {
      result = result.filter(b => b.type === filterType);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(b => 
        b.code.toLowerCase().includes(q) ||
        b.title?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [beacons, filterType, searchQuery]);

  // Convert LiveBeacon to BeaconMarker for UnifiedGlobe
  const beaconMarkers: BeaconMarker[] = useMemo(() => {
    return filteredBeacons.map(beacon => ({
      id: beacon.id,
      title: beacon.title,
      lat: beacon.lat,
      lng: beacon.lng,
      city: beacon.city,
      kind: beacon.type as any, // BeaconType maps to kind
      intensity: 0.5, // Default intensity, could be calculated from scans or other metrics
      sponsored: beacon.sponsored || false,
      scans: beacon.xp, // Using xp as proxy for activity
    }));
  }, [filteredBeacons]);

  // Selection
  const selectedBeacon = useMemo(
    () => beacons.find(b => b.id === selectedId) ?? null,
    [beacons, selectedId]
  );

  // Countdown for selected beacon
  const [countdownText, setCountdownText] = useState<string | null>(null);
  
  useEffect(() => {
    if (!selectedBeacon?.endsAt) {
      setCountdownText(null);
      return;
    }
    
    const updateCountdown = () => {
      const ms = new Date(selectedBeacon.endsAt!).getTime() - Date.now();
      setCountdownText(formatCountdown(ms));
    };
    
    updateCountdown();
    const t = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(t);
  }, [selectedBeacon?.endsAt]);

  // Copy to clipboard
  const doCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Silent fail
    }
  }, []);

  // Open beacon
  const openBeacon = useCallback((code: string) => {
    onNavigate(`/l/${encodeURIComponent(code)}`);
  }, [onNavigate]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    // If it looks like a beacon code, open it
    if (/^[a-z0-9_-]{4,}$/i.test(trimmed)) {
      openBeacon(trimmed);
      return;
    }

    // Otherwise, just filter the list
    setSearchQuery(trimmed);
  }, [openBeacon]);

  // Derived stats
  const totalScans = stats?.scansToday ?? 0;
  const totalXP = stats?.totalXPAwarded ?? 0;
  const activeCount = stats?.activeBeacons ?? filteredBeacons.length;

  // CSS helpers
  const chip = 'px-3 py-1.5 rounded-full border text-xs tracking-widest uppercase select-none transition';
  const chipOn = 'bg-white text-black border-white';
  const chipOff = 'bg-transparent text-white border-white/25 hover:border-white/60';
  const btn = 'px-4 py-2 rounded-xl text-sm tracking-widest uppercase border transition active:scale-[0.99]';
  const btnPrimary = 'bg-white text-black border-white hover:opacity-90';
  const btnGhost = 'bg-transparent text-white border-white/25 hover:border-white/60';
  const panel = 'bg-black/90 border border-white/15 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-md';

  // Live badge
  const liveBadge = timeMode === '24h' && playbackOn ? 'PLAYBACK' : 'LIVE / NO MERCY';

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className={`${panel} p-4`}>
          <div className="text-[11px] tracking-[0.38em] uppercase opacity-70">
            RESOLVING LIVE DATA…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center p-4">
        <div className={`${panel} p-5 w-[min(520px,100%)]`}>
          <div className="text-[11px] tracking-[0.38em] uppercase opacity-75">MAP FAILED.</div>
          <div className="mt-2 text-sm opacity-85 leading-relaxed">{error}</div>
          <div className="mt-4 flex gap-2">
            <button
              className={`${btn} ${btnPrimary} w-full`}
              type="button"
              onClick={() => window.location.reload()}
            >
              RETRY
            </button>
            <button
              className={`${btn} ${btnGhost} w-full`}
              type="button"
              onClick={() => onNavigate('home')}
            >
              GO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Map Visualization Background */}
      <div className="absolute inset-0">
        {mode3d ? (
          <UnifiedGlobe
            beacons={beaconMarkers}
            showBeacons={layerPins}
            showHeat={layerHeat}
            showCities={layerCities}
            showTrails={layerTrails}
            showTickets={false}
            onMarkerClick={(marker) => {
              // Find the original beacon by id to set selectedId
              const beacon = filteredBeacons.find(b => b.id === marker.id);
              if (beacon) {
                setSelectedId(beacon.id);
              }
            }}
            mode3d={true}
          />
        ) : (
          <WorldMap2D
            beacons={filteredBeacons}
            onBeaconClick={setSelectedId}
            selectedId={selectedId}
            showHeat={layerHeat}
            heatBins={heatBins}
          />
        )}
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4">
        <div className={`${panel} p-3`}>
          <div className="flex items-center gap-4 flex-wrap">
            {/* 2D/3D Toggle */}
            <div className="flex items-center gap-2">
              <button
                className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                  !mode3d ? chipOn : chipOff
                }`}
                onClick={() => setMode3d(false)}
                type="button"
              >
                2D
              </button>
              <button
                className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                  mode3d ? chipOn : chipOff
                }`}
                onClick={() => setMode3d(true)}
                type="button"
              >
                3D
              </button>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] tracking-[0.32em] uppercase opacity-80">HOTMESS MAP</span>
              <span className="px-3 py-1 rounded-full border border-white/30 text-[11px] tracking-[0.32em] uppercase">
                {liveBadge}
              </span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search size={16} className="text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                className="w-full bg-black/50 border border-white/15 focus:border-white/60 outline-none rounded-full pl-10 pr-3 py-2 text-sm tracking-wide placeholder:text-white/30"
                placeholder="CITY / CODE / VENUE"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
              />
            </div>

            {/* Stats Toggle */}
            {!isMobile && (
              <button
                className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                  showStats ? chipOn : chipOff
                }`}
                type="button"
                onClick={() => setShowStats(v => !v)}
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
              onClick={() => setShowFilters(v => !v)}
            >
              <Filter size={14} className="inline mr-1" />
              FILTER
            </button>
          </div>

          {/* Layer Controls Row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                layerPins ? chipOn : chipOff
              }`}
              type="button"
              onClick={() => setLayerPins(v => !v)}
            >
              PINS
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                layerHeat ? chipOn : chipOff
              }`}
              type="button"
              onClick={() => setLayerHeat(v => !v)}
            >
              HEAT
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                layerTrails ? chipOn : chipOff
              }`}
              type="button"
              onClick={() => {
                setLayerTrails(v => !v);
                if (!layerTrails) setTimeMode('24h');
              }}
            >
              TRAILS
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                layerCities ? chipOn : chipOff
              }`}
              type="button"
              onClick={() => setLayerCities(v => !v)}
            >
              CITIES
            </button>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-32 left-4 z-20 w-[280px]"
          >
            <div className={`${panel} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] tracking-[0.38em] uppercase opacity-75">GLOBAL STATS</span>
                <button onClick={() => setShowStats(false)} type="button">
                  <X size={16} className="text-white/60 hover:text-white" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-white/15 bg-black/40">
                  <div className="text-[11px] tracking-[0.32em] uppercase opacity-75">ACTIVE BEACONS</div>
                  <div className="mt-1 text-2xl tracking-wide">{activeCount}</div>
                </div>
                <div className="p-3 rounded-xl border border-white/15 bg-black/40">
                  <div className="text-[11px] tracking-[0.32em] uppercase opacity-75">SCANS TODAY</div>
                  <div className="mt-1 text-2xl tracking-wide">{totalScans.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-xl border border-white/15 bg-black/40">
                  <div className="text-[11px] tracking-[0.32em] uppercase opacity-75">XP AWARDED</div>
                  <div className="mt-1 text-2xl tracking-wide">{totalXP.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute ${isMobile ? 'top-32' : 'top-32'} ${isMobile ? 'left-4 right-4' : 'right-4'} z-20 w-[min(380px,calc(100%-32px))]`}
          >
            <div className={`${panel} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] tracking-[0.38em] uppercase opacity-75">FILTER BEACONS</span>
                <button onClick={() => setShowFilters(false)} type="button">
                  <X size={16} className="text-white/60 hover:text-white" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                    filterType === null ? chipOn : chipOff
                  }`}
                  type="button"
                  onClick={() => setFilterType(null)}
                >
                  ALL
                </button>
                {Object.keys(BEACON_TYPE_LABELS).map((t) => (
                  <button
                    key={t}
                    className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition ${
                      filterType === t ? chipOn : chipOff
                    }`}
                    type="button"
                    onClick={() => setFilterType(t as BeaconType)}
                    style={{
                      borderColor: filterType === t ? BEACON_TYPE_COLORS[t] : undefined,
                      backgroundColor: filterType === t ? BEACON_TYPE_COLORS[t] : undefined,
                      color: filterType === t ? '#000' : undefined,
                    }}
                  >
                    {BEACON_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>

              {filterType && (
                <div className="mt-3 text-xs tracking-wide opacity-75">
                  Showing {filteredBeacons.length} of {beacons.length} beacons
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Timeline */}
      <div className="absolute left-4 right-4 bottom-4 z-20">
        <div className={`${panel} p-3`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {(['live', '10m', '1h', '24h'] as TimeMode[]).map((m) => (
                <button
                  key={m}
                  className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                    timeMode === m ? chipOn : chipOff
                  }`}
                  type="button"
                  onClick={() => {
                    setTimeMode(m);
                    if (m !== '24h') setPlaybackOn(false);
                  }}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition ${
                  timeMode === '24h' && playbackOn ? chipOn : chipOff
                }`}
                type="button"
                onClick={() => {
                  if (timeMode !== '24h') setTimeMode('24h');
                  setPlaybackOn(v => !v);
                }}
                disabled={timeMode !== '24h' && !layerTrails}
              >
                {playbackOn ? 'PAUSE' : 'PLAY'}
              </button>

              {!isMobile && (
                <div className="text-[11px] tracking-[0.32em] uppercase opacity-80">
                  {timeMode === '24h'
                    ? `LAST 24H — ${Math.round(scrub01 * 24)}H`
                    : 'LIVE WINDOW'}
                </div>
              )}
            </div>
          </div>

          {/* Scrub bar */}
          {timeMode === '24h' && (
            <div className="mt-3 flex items-center gap-3">
              <input
                className="w-full accent-white"
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={scrub01}
                onChange={(e) => setScrub01(parseFloat(e.target.value))}
              />
              <div className="min-w-[96px] text-right text-sm tracking-wider">
                -{formatCountdown((1 - scrub01) * 24 * 3600 * 1000)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer / Bottom Sheet for Selected Beacon */}
      <AnimatePresence>
        {selectedBeacon && (
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 100 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isMobile ? 100 : 20 }}
            className={`absolute z-30 ${
              isMobile
                ? 'left-4 right-4 bottom-20'
                : 'top-4 bottom-4 right-4 w-[380px] max-h-[calc(100vh-32px)] overflow-y-auto'
            }`}
          >
            <div className={`${panel} p-4`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[11px] tracking-[0.38em] uppercase opacity-75">
                    BEACON ACTIVE
                  </div>
                  <div className="mt-1 text-xl tracking-wide">
                    {selectedBeacon.title ?? selectedBeacon.code}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span 
                      className="px-3 py-1 rounded-full border text-xs tracking-widest uppercase"
                      style={{
                        borderColor: BEACON_TYPE_COLORS[selectedBeacon.type],
                        color: BEACON_TYPE_COLORS[selectedBeacon.type],
                      }}
                    >
                      {BEACON_TYPE_LABELS[selectedBeacon.type] || selectedBeacon.type.toUpperCase()}
                    </span>
                    {selectedBeacon.sponsored && (
                      <span className="px-3 py-1 rounded-full border border-white text-xs tracking-widest uppercase">
                        SPONSORED
                      </span>
                    )}
                    {selectedBeacon.city && (
                      <span className="px-3 py-1 rounded-full border border-white/25 text-xs tracking-widest uppercase">
                        {selectedBeacon.city}
                      </span>
                    )}
                  </div>

                  {selectedBeacon.description && (
                    <div className="mt-3 text-sm opacity-85 leading-relaxed">
                      {selectedBeacon.description}
                    </div>
                  )}
                </div>

                <button
                  className="text-white/60 hover:text-white transition"
                  type="button"
                  onClick={() => setSelectedId(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-white/15 bg-black/40">
                  <div className="text-[11px] tracking-[0.32em] uppercase opacity-75">XP</div>
                  <div className="mt-1 text-lg tracking-wide">{selectedBeacon.xp ?? 0}</div>
                </div>
                <div className="p-3 rounded-xl border border-white/15 bg-black/40">
                  <div className="text-[11px] tracking-[0.32em] uppercase opacity-75">
                    {countdownText ? 'ENDS IN' : 'STATUS'}
                  </div>
                  <div className="mt-1 text-lg tracking-wide">
                    {countdownText ?? selectedBeacon.status?.toUpperCase() ?? 'ACTIVE'}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  className={`${btn} ${btnPrimary}`}
                  type="button"
                  onClick={() => openBeacon(selectedBeacon.code)}
                >
                  OPEN BEACON
                </button>

                <div className="flex gap-2">
                  <button
                    className={`${btn} ${btnGhost} w-full text-xs`}
                    type="button"
                    onClick={() =>
                      doCopy(
                        `${window.location.origin}/l/${encodeURIComponent(selectedBeacon.code)}`
                      )
                    }
                  >
                    <Copy size={14} className="inline mr-1" />
                    COPY LINK
                  </button>
                  <button
                    className={`${btn} ${btnGhost} w-full text-xs`}
                    type="button"
                    onClick={() => doCopy(selectedBeacon.code)}
                  >
                    <Share2 size={14} className="inline mr-1" />
                    SHARE
                  </button>
                </div>

                {selectedBeacon.sponsored && (
                  <button
                    className={`${btn} ${btnGhost} text-xs`}
                    type="button"
                    onClick={() => onNavigate('sponsorship')}
                  >
                    SPONSORED → DISCLOSURE
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}