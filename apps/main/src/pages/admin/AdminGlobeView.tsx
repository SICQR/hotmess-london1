import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { Globe, MapPin, Filter, Search, Eye, Edit } from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AdminGlobeViewProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Beacon {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  scans: number;
  created_at: string;
  owner_id: string;
  owner_name: string;
}

interface GlobeStats {
  total_beacons: number;
  active_beacons: number;
  total_scans: number;
  countries: number;
  cities: number;
}

export function AdminGlobeView({ onNavigate }: AdminGlobeViewProps) {
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [stats, setStats] = useState<GlobeStats>({
    total_beacons: 0,
    active_beacons: 0,
    total_scans: 0,
    countries: 0,
    cities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBeacon, setSelectedBeacon] = useState<Beacon | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadBeacons();
  }, []);

  useEffect(() => {
    if (beacons.length > 0 && canvasRef.current) {
      renderGlobe();
    }
  }, [beacons, filterType]);

  const loadBeacons = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/admin`;
      const response = await fetch(`${API_BASE}/beacons/all`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load beacons');
      }

      const data = await response.json();
      setBeacons(data.beacons || []);
      setStats(data.stats || stats);
      setLoading(false);

    } catch (err) {
      console.error('Error loading beacons:', err);
      setError(err instanceof Error ? err.message : 'Failed to load beacons');
      setLoading(false);
    }
  };

  const renderGlobe = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw globe outline
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) / 2 - 20, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw latitude/longitude lines
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Longitude lines
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * Math.cos(angle), radius, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Latitude lines
    for (let i = 1; i < 6; i++) {
      const latRadius = radius * Math.sin((i * 30 * Math.PI) / 180);
      const yOffset = radius * Math.cos((i * 30 * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - yOffset, latRadius, latRadius / 3, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + yOffset, latRadius, latRadius / 3, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Plot beacons
    const filteredBeacons = beacons.filter(b => {
      if (filterType === 'active') return b.status === 'active';
      if (filterType === 'inactive') return b.status === 'inactive';
      return true;
    });

    filteredBeacons.forEach(beacon => {
      // Convert lat/long to canvas coordinates (simplified projection)
      const x = centerX + (beacon.longitude / 180) * radius;
      const y = centerY - (beacon.latitude / 90) * radius;

      // Draw beacon marker
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = beacon.status === 'active' ? '#e70f3c' : 'rgba(255, 255, 255, 0.3)';
      ctx.fill();

      // Draw pulse effect for active beacons
      if (beacon.status === 'active') {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(231, 15, 60, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  const filteredBeacons = beacons.filter(beacon => {
    const matchesFilter = filterType === 'all' || beacon.status === filterType;
    const matchesSearch = searchQuery === '' || 
      beacon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beacon.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beacon.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout currentRoute="adminGlobeView" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentRoute="adminGlobeView" onNavigate={onNavigate}>
        <ErrorState message={error} onRetry={loadBeacons} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentRoute="adminGlobeView" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-white uppercase mb-2"
            style={{ fontWeight: 900, fontSize: '48px', lineHeight: '1', letterSpacing: '-0.02em' }}
          >
            Globe View
          </h1>
          <p 
            className="text-white/60 uppercase"
            style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em' }}
          >
            View beacons on 3D globe
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-white/60 uppercase mb-2" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
              Total Beacons
            </p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.total_beacons}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-white/60 uppercase mb-2" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
              Active
            </p>
            <p className="text-hot" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.active_beacons}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-white/60 uppercase mb-2" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
              Total Scans
            </p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.total_scans}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-white/60 uppercase mb-2" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
              Countries
            </p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.countries}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-white/60 uppercase mb-2" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
              Cities
            </p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.cities}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 uppercase transition-all ${
              filterType === 'all'
                ? 'bg-hot text-black'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
            style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}
          >
            All Beacons
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`px-4 py-2 uppercase transition-all ${
              filterType === 'active'
                ? 'bg-hot text-black'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
            style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}
          >
            Active Only
          </button>
          <button
            onClick={() => setFilterType('inactive')}
            className={`px-4 py-2 uppercase transition-all ${
              filterType === 'inactive'
                ? 'bg-hot text-black'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
            style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}
          >
            Inactive Only
          </button>

          <div className="ml-auto relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search beacons..."
              className="w-full bg-white/5 border border-white/20 pl-12 pr-4 py-2.5 text-white placeholder-white/40"
              style={{ fontWeight: 400, fontSize: '14px' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Globe Visualization */}
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white uppercase" style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.05em' }}>
                Global Distribution
              </h2>
              <Globe className="w-5 h-5 text-hot" />
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="w-full h-auto border border-white/10"
            />
          </div>

          {/* Beacon List */}
          <div className="bg-white/5 border border-white/10 p-6">
            <h2 className="text-white uppercase mb-6" style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.05em' }}>
              Beacon List ({filteredBeacons.length})
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredBeacons.map(beacon => (
                <div
                  key={beacon.id}
                  className={`bg-black/50 border p-4 cursor-pointer transition-all ${
                    selectedBeacon?.id === beacon.id
                      ? 'border-hot'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedBeacon(beacon)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        beacon.status === 'active' ? 'bg-hot' : 'bg-white/30'
                      }`} />
                      <div>
                        <p className="text-white" style={{ fontWeight: 600, fontSize: '14px' }}>
                          {beacon.name}
                        </p>
                        <p className="text-white/60" style={{ fontWeight: 400, fontSize: '12px' }}>
                          {beacon.city}, {beacon.country}
                        </p>
                      </div>
                    </div>
                    <span 
                      className={`px-2 py-1 uppercase border ${
                        beacon.status === 'active'
                          ? 'bg-hot/20 border-hot/50 text-hot'
                          : 'bg-white/5 border-white/20 text-white/40'
                      }`}
                      style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}
                    >
                      {beacon.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-white/40 mb-3" style={{ fontWeight: 400, fontSize: '11px' }}>
                    <span>{beacon.type}</span>
                    <span>{beacon.scans} scans</span>
                    <span>{new Date(beacon.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('adminBeacons');
                      }}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white transition-all uppercase flex items-center gap-2"
                      style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white transition-all uppercase flex items-center gap-2"
                      style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
