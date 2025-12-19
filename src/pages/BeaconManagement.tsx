/**
 * BEACON MANAGEMENT — Dashboard for Creating & Managing Beacons
 * Admin/Venue/Creator dashboard for beacon lifecycle
 */

import { useState, useEffect } from 'react';
import { 
  Plus, QrCode, BarChart3, Eye, Pause, Play, Archive, 
  MapPin, Calendar, Zap, TrendingUp, Users, Target, ChevronRight, Home
} from 'lucide-react';
import { toast } from 'sonner';
import {
  type Beacon,
  type BeaconType,
  BEACON_TYPE_META,
  isBeaconActive,
  generateBeaconCode,
  generateBeaconQRData,
} from '../lib/beacon-system';
import { getBeacons, updateBeacon, deleteBeacon } from '../lib/beacons/beaconService';
import { publicAnonKey } from '../utils/supabase/info';
import { BeaconQRCode } from '../components/BeaconQRCode';
import { BeaconQrPanel } from '../components/BeaconQrPanel';
import { RouteId } from '../lib/routes';
import { projectId } from '../utils/supabase/info';

interface BeaconManagementProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'live' | 'draft' | 'archived';

export function BeaconManagement({ onNavigate }: BeaconManagementProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedBeacon, setSelectedBeacon] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [beacons, setBeacons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load beacons from API
  useEffect(() => {
    loadBeacons();
  }, [filterStatus]);

  async function loadBeacons() {
    try {
      setLoading(true);
      const filters = filterStatus !== 'all' ? { status: filterStatus } : undefined;
      const result = await getBeacons(filters);
      
      if (result.ok) {
        setBeacons(result.beacons || []);
      } else {
        toast.error(result.error || 'Failed to load beacons');
        setBeacons([]);
      }
    } catch (error) {
      console.error('Failed to load beacons:', error);
      toast.error('Failed to load beacons');
      setBeacons([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredBeacons = beacons.filter(beacon => {
    if (filterStatus === 'all') return true;
    return beacon.status === filterStatus;
  });

  const totalScans = beacons.reduce((sum, b) => sum + (b.scan_count || 0), 0);
  const activeCount = beacons.filter(b => b.status === 'live').length;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
          >
            <Home size={16} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Home</span>
          </button>
          <ChevronRight size={16} className="text-white/20" />
          <span style={{ fontSize: '13px', fontWeight: 600 }} className="text-white">Beacon Manager</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-red-950/20 to-black pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 style={{ fontSize: '72px', fontWeight: 900, letterSpacing: '-0.02em' }} className="text-white mb-2">Beacon Manager</h1>
              <p style={{ fontSize: '16px', fontWeight: 400 }} className="text-white/60">
                Create, manage, and track your QR beacons across the platform
              </p>
            </div>
            
            <button
              onClick={() => onNavigate('beaconCreate')}
              className="flex items-center gap-3 h-16 px-10 bg-gradient-to-r from-[#ff1694] to-[#ff0080] text-white hover:shadow-[0_0_40px_rgba(255,22,148,0.6)] transition-all"
              style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}
            >
              <Plus size={20} />
              <span className="uppercase">Create Beacon</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <QrCode className="size-5 text-red-500" />
                <span className="text-[13px] text-white/60 uppercase tracking-wider">Total Beacons</span>
              </div>
              <div className="text-[32px] font-black text-white">{beacons.length}</div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <Play className="size-5 text-green-500" />
                <span className="text-[13px] text-white/60 uppercase tracking-wider">Active</span>
              </div>
              <div className="text-[32px] font-black text-white">{activeCount}</div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <Users className="size-5 text-blue-500" />
                <span className="text-[13px] text-white/60 uppercase tracking-wider">Total Scans</span>
              </div>
              <div className="text-[32px] font-black text-white">{totalScans.toLocaleString()}</div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="size-5 text-yellow-500" />
                <span className="text-[13px] text-white/60 uppercase tracking-wider">Avg / Beacon</span>
              </div>
              <div className="text-[32px] font-black text-white">
                {beacons.length > 0 ? Math.round(totalScans / beacons.length) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {/* Status Filters */}
          <div className="flex gap-2">
            {(['all', 'live', 'draft', 'archived'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                  filterStatus === status
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <div className="grid grid-cols-2 gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="size-1.5 bg-current rounded-sm" />
                ))}
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-1 bg-current rounded-sm" />
                ))}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Beacons List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBeacons.map((beacon) => (
              <BeaconCard
                key={beacon.id}
                beacon={beacon}
                onSelect={setSelectedBeacon}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBeacons.map((beacon) => (
              <BeaconListItem
                key={beacon.id}
                beacon={beacon}
                onSelect={setSelectedBeacon}
              />
            ))}
          </div>
        )}

        {filteredBeacons.length === 0 && (
          <div className="text-center py-20">
            <QrCode className="size-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-[20px] font-bold text-white/60 mb-2">No beacons found</h3>
            <p className="text-[14px] text-white/40">
              {filterStatus === 'all' 
                ? 'Create your first beacon to get started'
                : `No ${filterStatus} beacons`}
            </p>
          </div>
        )}
      </div>

      {/* Create Beacon Modal */}
      {showCreateModal && (
        <CreateBeaconModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(beacon) => {
            console.log('Created beacon:', beacon);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Beacon Detail Modal */}
      {selectedBeacon && (
        <BeaconDetailModal
          beacon={selectedBeacon}
          onClose={() => setSelectedBeacon(null)}
        />
      )}
    </div>
  );
}

function BeaconCard({ beacon, onSelect }: { beacon: any; onSelect: (b: any) => void }) {
  const isActive = beacon.status === 'live';
  // Use default meta if type is not found
  const meta = BEACON_TYPE_META[beacon.type as BeaconType] || BEACON_TYPE_META['checkin'];

  return (
    <div
      onClick={() => onSelect(beacon)}
      className="bg-white/[0.02] border border-white/10 rounded-lg p-5 hover:bg-white/[0.04] transition-all cursor-pointer group"
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
          isActive
            ? 'bg-green-950/40 text-green-400'
            : 'bg-white/10 text-white/40'
        }`}>
          {beacon.status}
        </span>
        
        <div className="text-[24px]">{meta.icon}</div>
      </div>

      {/* Name & Type */}
      <h3 className="text-[16px] font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
        {beacon.title}
      </h3>
      <p className="text-[12px] text-white/60 mb-4">{meta.label}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-[13px]">
        <div className="flex items-center gap-1.5">
          <Eye className="size-3 text-blue-500" />
          <span className="text-white/60">{beacon.scan_count || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3 text-white/40" />
          <span className="text-white/60">{beacon.city_id}</span>
        </div>
      </div>

      {/* Slug */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <span className="text-[11px] font-mono text-white/40">{beacon.slug}</span>
      </div>
    </div>
  );
}

function BeaconListItem({ beacon, onSelect }: { beacon: any; onSelect: (b: any) => void }) {
  const isActive = beacon.status === 'live';
  const meta = BEACON_TYPE_META[beacon.type as BeaconType] || BEACON_TYPE_META['checkin'];

  return (
    <div
      onClick={() => onSelect(beacon)}
      className="bg-white/[0.02] border border-white/10 rounded-lg p-5 hover:bg-white/[0.04] transition-all cursor-pointer flex items-center gap-4"
    >
      {/* Icon */}
      <div className="text-[32px] flex-shrink-0">{meta.icon}</div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-[16px] font-bold text-white">{beacon.title}</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
            isActive ? 'bg-green-950/40 text-green-400' : 'bg-white/10 text-white/40'
          }`}>
            {beacon.status}
          </span>
        </div>
        <p className="text-[13px] text-white/60">{meta.label}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-[20px] font-bold text-white">{beacon.scan_count || 0}</div>
          <div className="text-[11px] text-white/40 uppercase tracking-wider">Scans</div>
        </div>
        <div className="text-center">
          <div className="text-[20px] font-bold text-white/60">{beacon.city_id}</div>
          <div className="text-[11px] text-white/40 uppercase tracking-wider">City</div>
        </div>
      </div>

      {/* Slug */}
      <div className="text-right flex-shrink-0">
        <span className="text-[12px] font-mono text-white/60">{beacon.slug}</span>
      </div>
    </div>
  );
}

function BeaconDetailModal({ beacon, onClose }: { beacon: any; onClose: () => void }) {
  const meta = BEACON_TYPE_META[beacon.type as BeaconType] || BEACON_TYPE_META['checkin'];
  const functionsUrl = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-[48px]">{meta.icon}</div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }} className="text-white mb-1">{beacon.title}</h2>
                <p style={{ fontSize: '14px', fontWeight: 400 }} className="text-white/60">{meta.label}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 text-center">
              <div style={{ fontSize: '24px', fontWeight: 900 }} className="text-white mb-1">{beacon.scan_count || 0}</div>
              <div style={{ fontSize: '11px', fontWeight: 600 }} className="text-white/40 uppercase tracking-wider">Total Scans</div>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 text-center">
              <div style={{ fontSize: '24px', fontWeight: 900 }} className="text-white/60 mb-1">{beacon.city_id}</div>
              <div style={{ fontSize: '11px', fontWeight: 600 }} className="text-white/40 uppercase tracking-wider">City</div>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 text-center">
              <div style={{ fontSize: '24px', fontWeight: 900 }} className="text-green-500 mb-1">
                {beacon.status === 'live' ? 'Live' : beacon.status}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600 }} className="text-white/40 uppercase tracking-wider">Status</div>
            </div>
          </div>

          {/* Beacon Details */}
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Slug:</span>
                <span className="text-white font-mono text-sm">{beacon.slug}</span>
              </div>
              {beacon.description && (
                <div className="pt-2 border-t border-white/10">
                  <span className="text-white/60 text-sm">Description:</span>
                  <p className="text-white/80 text-sm mt-1">{beacon.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateBeaconModal({ onClose, onCreate }: { onClose: () => void; onCreate: (beacon: Partial<Beacon>) => void }) {
  const [type, setType] = useState<BeaconType>('checkin');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(BEACON_TYPE_META['checkin'].defaultXP);

  const meta = BEACON_TYPE_META[type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBeacon: Partial<Beacon> = {
      code: generateBeaconCode(type),
      type,
      status: 'active',
      name,
      description,
      xpReward,
      scanCount: 0,
      ownerId: 'current-user',
      ownerType: 'user',
    };

    onCreate(newBeacon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-[24px] font-bold text-white">Create New Beacon</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selector */}
          <div>
            <label className="block text-[13px] text-white/60 uppercase tracking-wider mb-3">
              Beacon Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(BEACON_TYPE_META) as BeaconType[]).slice(0, 6).map((t) => {
                const m = BEACON_TYPE_META[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setType(t);
                      setXpReward(m.defaultXP);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      type === t
                        ? 'border-red-600 bg-red-950/20'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="text-[24px] mb-2">{m.icon}</div>
                    <div className="text-[13px] font-bold text-white">{m.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[13px] text-white/60 uppercase tracking-wider mb-2">
              Beacon Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., The Glory Check-in"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] text-white/60 uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={meta.description}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>

          {/* XP Reward */}
          <div>
            <label className="block text-[13px] text-white/60 uppercase tracking-wider mb-2">
              XP Reward
            </label>
            <input
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
              min="0"
              max="1000"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
              required
            />
            <p className="text-[12px] text-white/40 mt-1">
              Default: {meta.defaultXP} XP (will be multiplied by user's tier)
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
            >
              Create Beacon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}