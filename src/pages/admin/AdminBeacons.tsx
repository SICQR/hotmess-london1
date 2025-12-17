import { useState, useEffect } from 'react';
import { RouteId } from '../../lib/routes';
import { motion } from 'motion/react';
import { Plus, Zap, MapPin, Calendar, TrendingUp, Edit, Pause, Play, Trash2, Copy, ExternalLink, Download, QrCode } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';
import { downloadBrandedBeaconQR } from '../../lib/qr/downloadBrandedBeaconQR';

interface AdminBeaconsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Beacon {
  id: string;
  code: string;
  type: string;
  title: string;
  description: string | null;
  status: string;
  geo_lat: number | null;
  geo_lng: number | null;
  city_slug: string | null;
  xp_amount: number;
  max_scans_total: number | null;
  max_scans_per_user_per_day: number | null;
  redirect_url: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

const BEACON_TYPES = [
  { value: 'checkin', label: 'CHECK-IN', desc: 'Location check-in' },
  { value: 'drop', label: 'DROP', desc: 'Limited drop' },
  { value: 'event', label: 'EVENT', desc: 'Event RSVP' },
  { value: 'product', label: 'SHOP', desc: 'Product link' },
  { value: 'vendor', label: 'VENDOR', desc: 'Vendor promo' },
  { value: 'chat', label: 'CHAT', desc: 'Chat room join' },
  { value: 'reward', label: 'REWARD', desc: 'Reward claim' },
  { value: 'sponsor', label: 'SPONSOR', desc: 'Sponsor link' },
];

export function AdminBeacons({ onNavigate }: AdminBeaconsProps) {
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBeacon, setEditingBeacon] = useState<Beacon | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'checkin',
    title: '',
    description: '',
    status: 'draft',
    geo_lat: '',
    geo_lng: '',
    city_slug: '',
    xp_amount: '10',
    max_scans_total: '',
    max_scans_per_user_per_day: '',
    redirect_url: '',
    starts_at: '',
    ends_at: '',
  });

  useEffect(() => {
    fetchBeacons();
  }, []);

  async function fetchBeacons() {
    try {
      setLoading(true);
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/beacons/active`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setBeacons(data.beacons || []);
      }
    } catch (error) {
      console.error('Failed to fetch beacons:', error);
      toast.error('Failed to load beacons');
    } finally {
      setLoading(false);
    }
  }

  async function createBeacon() {
    try {
      const payload = {
        ...formData,
        geo_lat: formData.geo_lat ? parseFloat(formData.geo_lat) : null,
        geo_lng: formData.geo_lng ? parseFloat(formData.geo_lng) : null,
        xp_amount: parseInt(formData.xp_amount) || 0,
        max_scans_total: formData.max_scans_total ? parseInt(formData.max_scans_total) : null,
        max_scans_per_user_per_day: formData.max_scans_per_user_per_day
          ? parseInt(formData.max_scans_per_user_per_day)
          : null,
        owner_id: null,
        sponsor_id: null,
        chat_room_id: null,
        redirect_fallback: null,
        utm_json: null,
      };

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/beacons`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast.success('Beacon created successfully');
        setShowCreateForm(false);
        resetForm();
        fetchBeacons();
      } else {
        const error = await res.json();
        toast.error(`Failed to create beacon: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create beacon:', error);
      toast.error('Failed to create beacon');
    }
  }

  async function updateBeaconStatus(beaconId: string, status: string) {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/beacons/${beaconId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        toast.success(`Beacon ${status}`);
        fetchBeacons();
      } else {
        toast.error('Failed to update beacon');
      }
    } catch (error) {
      console.error('Failed to update beacon:', error);
      toast.error('Failed to update beacon');
    }
  }

  function resetForm() {
    setFormData({
      code: '',
      type: 'checkin',
      title: '',
      description: '',
      status: 'draft',
      geo_lat: '',
      geo_lng: '',
      city_slug: '',
      xp_amount: '10',
      max_scans_total: '',
      max_scans_per_user_per_day: '',
      redirect_url: '',
      starts_at: '',
      ends_at: '',
    });
  }

  function copyShortlink(code: string) {
    const url = `${window.location.origin}/l/${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Shortlink copied to clipboard');
  }

  async function downloadQRCode(beacon: Beacon) {
    try {
      await downloadBrandedBeaconQR(beacon);
      toast.success('QR code downloaded!');
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error('Failed to generate QR code');
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white uppercase tracking-[-0.03em] leading-none" style={{ fontWeight: 900, fontSize: '42px' }}>
              BEACON ADMIN
            </h1>
            <p className="text-hot uppercase tracking-wider mt-2" style={{ fontWeight: 700, fontSize: '12px' }}>
              CREATE × MANAGE × TRACK BEACON SYSTEM
            </p>
          </div>

          <motion.button
            onClick={() => setShowCreateForm(true)}
            className="bg-hot text-black px-6 py-4 hover:bg-white transition-all"
            style={{ fontWeight: 900, fontSize: '14px' }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} className="inline mr-2" />
            CREATE BEACON
          </motion.button>
        </div>
      </div>

      {/* Beacon List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            LOADING BEACONS...
          </p>
        </div>
      ) : beacons.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-white/20 p-12">
          <Zap size={48} className="text-white/40 mx-auto mb-4" />
          <p className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '18px' }}>
            NO BEACONS YET
          </p>
          <p className="text-white/60 uppercase tracking-wider mb-6" style={{ fontWeight: 700, fontSize: '12px' }}>
            Create your first beacon to start tracking scans
          </p>
          <motion.button
            onClick={() => setShowCreateForm(true)}
            className="bg-hot text-black px-6 py-3 hover:bg-white transition-all"
            style={{ fontWeight: 900, fontSize: '12px' }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} className="inline mr-2" />
            CREATE FIRST BEACON
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {beacons.map((beacon) => (
            <motion.div
              key={beacon.id}
              className="bg-white/5 border border-white/20 hover:border-hot transition-all p-6"
              whileHover={{ scale: 1.01 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-hot uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '10px' }}>
                    {beacon.type.toUpperCase()}
                  </div>
                  <h3 className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '18px' }}>
                    {beacon.title}
                  </h3>
                </div>

                <div className="flex gap-2">
                  {beacon.status === 'active' ? (
                    <button
                      onClick={() => updateBeaconStatus(beacon.id, 'paused')}
                      className="p-2 bg-white/10 hover:bg-white/20 transition-colors"
                      title="Pause beacon"
                    >
                      <Pause size={16} className="text-white" />
                    </button>
                  ) : (
                    <button
                      onClick={() => updateBeaconStatus(beacon.id, 'active')}
                      className="p-2 bg-hot hover:bg-white transition-colors"
                      title="Activate beacon"
                    >
                      <Play size={16} className="text-black" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              {beacon.description && (
                <p className="text-white/60 mb-4" style={{ fontSize: '13px' }}>
                  {beacon.description}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-black/50 p-3">
                  <div className="text-white/60 uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '9px' }}>
                    XP
                  </div>
                  <div className="text-hot" style={{ fontWeight: 900, fontSize: '18px' }}>
                    +{beacon.xp_amount}
                  </div>
                </div>

                {beacon.city_slug && (
                  <div className="bg-black/50 p-3">
                    <div className="text-white/60 uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '9px' }}>
                      CITY
                    </div>
                    <div className="text-white uppercase" style={{ fontWeight: 900, fontSize: '11px' }}>
                      {beacon.city_slug}
                    </div>
                  </div>
                )}

                <div className="bg-black/50 p-3">
                  <div className="text-white/60 uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '9px' }}>
                    STATUS
                  </div>
                  <div
                    className={`uppercase ${
                      beacon.status === 'active' ? 'text-hot' : 'text-white/60'
                    }`}
                    style={{ fontWeight: 900, fontSize: '11px' }}
                  >
                    {beacon.status}
                  </div>
                </div>
              </div>

              {/* Shortlink */}
              <div className="bg-black/50 p-3 mb-4">
                <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '9px' }}>
                  SHORTLINK
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-white text-sm flex-1 truncate">
                    /l/{beacon.code}
                  </code>
                  <button
                    onClick={() => copyShortlink(beacon.code)}
                    className="p-2 bg-white/10 hover:bg-white/20 transition-colors"
                    title="Copy shortlink"
                  >
                    <Copy size={14} className="text-white" />
                  </button>
                  <button
                    onClick={() => window.open(`/l/${beacon.code}`, '_blank')}
                    className="p-2 bg-white/10 hover:bg-white/20 transition-colors"
                    title="Open shortlink"
                  >
                    <ExternalLink size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 p-3 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all"
                  style={{ fontWeight: 900, fontSize: '11px' }}
                >
                  <TrendingUp size={14} className="inline mr-2" />
                  VIEW STATS
                </button>
                <button
                  onClick={() => downloadQRCode(beacon)}
                  className="flex-1 p-3 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all"
                  style={{ fontWeight: 900, fontSize: '11px' }}
                >
                  <QrCode size={14} className="inline mr-2" />
                  DOWNLOAD QR
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
          onClick={() => setShowCreateForm(false)}
        >
          <motion.div
            className="bg-black border-2 border-hot p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white uppercase tracking-[-0.02em] leading-none mb-6" style={{ fontWeight: 900, fontSize: '32px' }}>
              CREATE BEACON
            </h2>

            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  CODE (UNIQUE)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                  placeholder="e.g. vxtavern1"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  TYPE
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                >
                  {BEACON_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.desc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  TITLE
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                  placeholder="e.g. Vauxhall Tavern Check-In"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  DESCRIPTION
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>

              {/* XP Amount */}
              <div>
                <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  XP AMOUNT
                </label>
                <input
                  type="number"
                  value={formData.xp_amount}
                  onChange={(e) => setFormData({ ...formData, xp_amount: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                />
              </div>

              {/* Geo */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                    LAT
                  </label>
                  <input
                    type="text"
                    value={formData.geo_lat}
                    onChange={(e) => setFormData({ ...formData, geo_lat: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                    placeholder="51.5074"
                  />
                </div>
                <div>
                  <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                    LNG
                  </label>
                  <input
                    type="text"
                    value={formData.geo_lng}
                    onChange={(e) => setFormData({ ...formData, geo_lng: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                    placeholder="-0.1276"
                  />
                </div>
                <div>
                  <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                    CITY
                  </label>
                  <input
                    type="text"
                    value={formData.city_slug}
                    onChange={(e) => setFormData({ ...formData, city_slug: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                    placeholder="london"
                  />
                </div>
              </div>

              {/* Redirect URL */}
              <div>
                <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  REDIRECT URL
                </label>
                <input
                  type="text"
                  value={formData.redirect_url}
                  onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                  placeholder="https://hotmesslondon.com/map"
                />
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                    MAX TOTAL SCANS
                  </label>
                  <input
                    type="number"
                    value={formData.max_scans_total}
                    onChange={(e) => setFormData({ ...formData, max_scans_total: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <label className="text-white uppercase tracking-wider block mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                    MAX PER USER/DAY
                  </label>
                  <input
                    type="number"
                    value={formData.max_scans_per_user_per_day}
                    onChange={(e) => setFormData({ ...formData, max_scans_per_user_per_day: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white p-3 focus:border-hot outline-none"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="flex-1 p-4 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all"
                  style={{ fontWeight: 900, fontSize: '12px' }}
                >
                  CANCEL
                </button>
                <button
                  onClick={createBeacon}
                  className="flex-1 p-4 bg-hot hover:bg-white text-black uppercase tracking-wider transition-all"
                  style={{ fontWeight: 900, fontSize: '12px' }}
                >
                  CREATE BEACON
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}