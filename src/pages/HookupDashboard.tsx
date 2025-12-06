/**
 * MY HOOK-UP QRS DASHBOARD
 * Manage all user-created hookup beacons
 * Route: /?route=hookupDashboard
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHookupBeacons } from '../hooks/useHookupBeacons';
import type { HookupBeacon } from '../types/hookup';
import type { RouteId } from '../lib/routes';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { 
  Plus, 
  QrCode, 
  Users, 
  MessageCircle, 
  Eye, 
  Download,
  Edit,
  Pause,
  Play,
  Trash2,
  TrendingUp,
  Calendar,
  MapPin,
  Settings,
  BarChart3,
} from 'lucide-react';

interface HookupDashboardProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function HookupDashboard({ onNavigate }: HookupDashboardProps) {
  const { user } = useAuth();
  const navigate = onNavigate;
  const { getMyBeacons, deleteBeacon, getBeaconStats, loading, error } = useHookupBeacons();
  
  const [beacons, setBeacons] = useState<HookupBeacon[]>([]);
  const [selectedBeacon, setSelectedBeacon] = useState<HookupBeacon | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadBeacons();
  }, []);

  useEffect(() => {
    if (selectedBeacon) {
      loadStats(selectedBeacon.id);
    }
  }, [selectedBeacon]);

  const loadBeacons = async () => {
    const data = await getMyBeacons();
    if (data) {
      setBeacons(data);
      if (!selectedBeacon && data.length > 0) {
        setSelectedBeacon(data[0]);
      }
    }
  };

  const loadStats = async (beaconId: string) => {
    const data = await getBeaconStats(beaconId);
    if (data) {
      setStats(data);
    }
  };

  const handleDelete = async (beaconId: string) => {
    if (confirm('Are you sure you want to deactivate this beacon? Scans will no longer work.')) {
      const success = await deleteBeacon(beaconId);
      if (success) {
        await loadBeacons();
        if (selectedBeacon?.id === beaconId) {
          setSelectedBeacon(null);
        }
      }
    }
  };

  const handleDownloadQR = (beacon: HookupBeacon) => {
    const qrUrl = `https://hotmess.london/?route=hookupScan&code=${beacon.id}`;
    // Open QR generator with this URL
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrUrl)}`, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl mb-4">Sign In Required</h2>
          <p className="text-white/60 mb-6">
            You need to be signed in to manage your hook-up QRs.
          </p>
          <Button onClick={() => navigate('login')} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">MY HOOK-UP QRS</h1>
              <p className="text-white/60">
                Manage your connection beacons
              </p>
            </div>
            <Button
              onClick={() => navigate('hookupCreate')}
              className="bg-[#FF1744] hover:bg-[#FF1744]/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New QR
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-white/60">Loading your beacons...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-500/10 border-red-500/30 p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </Card>
        )}

        {!loading && beacons.length === 0 && (
          <Card className="p-12 text-center">
            <QrCode className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h2 className="text-2xl mb-2">No Hook-Up QRs Yet</h2>
            <p className="text-white/60 mb-6">
              Create your first hookup beacon to start connecting with men in your city.
            </p>
            <Button
              onClick={() => navigate('hookupCreate')}
              className="bg-[#FF1744] hover:bg-[#FF1744]/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First QR
            </Button>
          </Card>
        )}

        {!loading && beacons.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Beacon List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-sm uppercase tracking-wide text-white/60 mb-4">
                Your Beacons ({beacons.length})
              </h3>
              
              {beacons.map((beacon) => (
                <Card
                  key={beacon.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedBeacon?.id === beacon.id
                      ? 'bg-white/10 border-[#FF1744]'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                  onClick={() => setSelectedBeacon(beacon)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {beacon.mode === 'room' ? (
                        <Users className="w-5 h-5 text-[#FF1744]" />
                      ) : (
                        <MessageCircle className="w-5 h-5 text-[#9C27B0]" />
                      )}
                      <Badge variant={beacon.status === 'active' ? 'default' : 'secondary'}>
                        {beacon.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <h4 className="mb-1 line-clamp-1">{beacon.name}</h4>
                  <p className="text-sm text-white/60 mb-3 line-clamp-2">
                    {beacon.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {beacon.total_scans}
                    </div>
                    {beacon.mode === 'room' ? (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {beacon.total_connections}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {beacon.total_connections}
                      </div>
                    )}
                  </div>
                  
                  {beacon.venue && (
                    <div className="flex items-center gap-1 text-xs text-white/40 mt-2">
                      <MapPin className="w-3 h-3" />
                      {beacon.venue}
                      {beacon.zone && ` • ${beacon.zone}`}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Detail Panel */}
            {selectedBeacon && (
              <div className="lg:col-span-2 space-y-6">
                {/* Beacon Header */}
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl">{selectedBeacon.name}</h2>
                        <Badge variant={selectedBeacon.status === 'active' ? 'default' : 'secondary'}>
                          {selectedBeacon.status}
                        </Badge>
                        <Badge variant="outline">
                          {selectedBeacon.mode === 'room' ? 'ROOM-BASED' : '1-ON-1'}
                        </Badge>
                      </div>
                      <p className="text-white/60">{selectedBeacon.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-white/60 mb-1">City</p>
                      <p className="capitalize">{selectedBeacon.city}</p>
                    </div>
                    {selectedBeacon.venue && (
                      <div>
                        <p className="text-sm text-white/60 mb-1">Venue</p>
                        <p>{selectedBeacon.venue}</p>
                      </div>
                    )}
                    {selectedBeacon.zone && (
                      <div>
                        <p className="text-sm text-white/60 mb-1">Zone</p>
                        <p className="capitalize">{selectedBeacon.zone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-white/60 mb-1">Membership</p>
                      <p className="uppercase text-[#FF1744]">{selectedBeacon.membership_required}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleDownloadQR(selectedBeacon)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR
                    </Button>
                    
                    <Button
                      onClick={() => navigate('hookupScan', { code: selectedBeacon.id })}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>

                    {selectedBeacon.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-400 border-yellow-400/30"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-400 border-green-400/30"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                    )}

                    <Button
                      onClick={() => handleDelete(selectedBeacon.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400/30"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>

                {/* Stats */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-[#FF1744]" />
                    <h3 className="text-xl">Analytics</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl text-[#FF1744] mb-1">
                        {selectedBeacon.total_scans}
                      </p>
                      <p className="text-sm text-white/60">Total Scans</p>
                    </div>

                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl text-[#9C27B0] mb-1">
                        {selectedBeacon.total_connections}
                      </p>
                      <p className="text-sm text-white/60">
                        {selectedBeacon.mode === 'room' ? 'Room Joins' : 'Connections'}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl text-[#00E676] mb-1">
                        {stats?.conversion_rate || '0%'}
                      </p>
                      <p className="text-sm text-white/60">Conversion</p>
                    </div>
                  </div>

                  {selectedBeacon.mode === '1to1' && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Settings className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white mb-1">Rate Limit</h4>
                          <p className="text-sm text-white/60">
                            Max {selectedBeacon.max_connections_per_hour} connections per hour
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBeacon.mode === 'room' && selectedBeacon.telegram_room_id && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white mb-1">Telegram Room</h4>
                          <p className="text-sm text-white/60 font-mono">
                            {selectedBeacon.telegram_room_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* QR Preview */}
                <Card className="p-6">
                  <h3 className="text-xl mb-4">QR Code Preview</h3>
                  <div className="bg-white p-8 rounded-xl max-w-sm mx-auto">
                    <div className="text-center mb-4">
                      <h4 className="text-black text-xl mb-2">{selectedBeacon.name}</h4>
                      <p className="text-black/60 text-sm">
                        {selectedBeacon.mode === 'room' ? 'SCAN → JOIN ROOM' : 'SCAN TO CONNECT'}
                      </p>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-48 h-48 text-gray-400" />
                      <div className="absolute text-xs text-gray-600">
                        QR Code
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-black/60 text-xs">
                        MEN-ONLY • 18+ • CONSENT-FIRST
                      </p>
                      <p className="text-black/40 text-xs mt-1">
                        HOTMESS.LONDON
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
