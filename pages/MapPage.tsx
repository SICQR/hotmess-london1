import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Radio, Globe, Target, MapPin, Clock, Copy, Share2, X, Search, Filter, TrendingUp, Users, Calendar } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { WorldMap2D } from '../components/WorldMap2D';
import { MapboxGlobe } from '../components/globe/MapboxGlobe';
import { GlobeControls } from '../components/globe/GlobeControls';

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
  const [beaconFilters, setBeaconFilters] = useState({
    checkin: true,
    ticket: true,
    product: true,
    drop: true,
    event: true,
    chat: true,
    vendor: true,
    reward: true,
    sponsor: true,
  });

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
    
    // Filter by beacon type
    result = result.filter(b => beaconFilters[b.type as keyof typeof beaconFilters]);
    
    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(b => 
        b.code.toLowerCase().includes(q) ||
        b.title?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [beacons, beaconFilters, searchQuery]);

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
          <MapboxGlobe
            timeWindow={timeMode === 'live' ? 'tonight' : timeMode === '24h' ? 'month' : 'weekend'}
            onCityClick={(city) => {
              // Find beacon in that city
              const beacon = filteredBeacons.find(b => 
                b.city?.toLowerCase() === city.city?.toLowerCase()
              );
              if (beacon) setSelectedId(beacon.id);
            }}
            onBeaconClick={setSelectedId}
            beacons={filteredBeacons}
            selectedBeaconId={selectedId}
            showHeat={layerHeat}
            showBeacons={layerPins}
            useLiveData={layerHeat}
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

      {/* Unified Globe Controls */}
      <GlobeControls
        mode="map"
        timeWindow={timeMode}
        onTimeWindowChange={setTimeMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        layers={{
          pins: layerPins,
          heat: layerHeat,
          trails: layerTrails,
          cities: layerCities,
        }}
        onLayerToggle={(layer) => {
          if (layer === 'pins') setLayerPins(v => !v);
          else if (layer === 'heat') setLayerHeat(v => !v);
          else if (layer === 'trails') {
            setLayerTrails(v => !v);
            if (!layerTrails) setTimeMode('24h');
          }
          else if (layer === 'cities') setLayerCities(v => !v);
        }}
        beaconFilters={beaconFilters}
        onBeaconFilterToggle={(type) => {
          setBeaconFilters(prev => ({ ...prev, [type]: !prev[type] }));
        }}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(v => !v)}
        showStats={showStats}
        onToggleStats={() => setShowStats(v => !v)}
        viewMode={mode3d ? '3d' : '2d'}
        onViewModeChange={(mode) => setMode3d(mode === '3d')}
        stats={{
          activeBeacons: activeCount,
          scansToday: totalScans,
          totalXPAwarded: totalXP,
        }}
      />

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