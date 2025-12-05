/**
 * HOTMESS LONDON — DOOR SCANNER MODE
 * 
 * Real-time ticket validation for door staff.
 * Scan QR codes to check in guests and track capacity.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ScanLine, 
  CheckCircle2, 
  XCircle, 
  Camera,
  Users,
  TrendingUp,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { Card } from '../../components/design-system/Card';
import { HMInput } from '../../components/library/HMInput';
import { 
  scanTicketAtDoor, 
  getEvent, 
  getEventCapacity,
  DoorScanResult,
  ClubEvent
} from '../../lib/clubMode/clubModeService';
import { useAuth } from '../../contexts/AuthContext';
import { RouteId } from '../../lib/routes';

interface Props {
  clubId: string;
  eventId?: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export default function DoorScanner({ clubId, eventId: initialEventId, onNavigate }: Props) {
  const { user } = useAuth();
  const [eventId, setEventId] = useState(initialEventId || '');
  const [event, setEvent] = useState<ClubEvent | null>(null);
  const [capacity, setCapacity] = useState({
    capacity: 0,
    checked_in: 0,
    tickets_sold: 0,
    available: 0,
    percentage: 0
  });

  const [scanMode, setScanMode] = useState<'manual' | 'camera'>('manual');
  const [qrInput, setQrInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<DoorScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<DoorScanResult[]>([]);

  // Auto-refresh capacity every 5 seconds
  useEffect(() => {
    if (!eventId) return;

    loadEventData();
    const interval = setInterval(refreshCapacity, 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  const loadEventData = async () => {
    if (!eventId) return;

    const eventData = await getEvent(eventId);
    setEvent(eventData);

    await refreshCapacity();
  };

  const refreshCapacity = async () => {
    if (!eventId) return;

    const capacityData = await getEventCapacity(eventId);
    setCapacity(capacityData);
  };

  const handleScan = async () => {
    if (!qrInput.trim() || !user) {
      return;
    }

    setScanning(true);

    // Get user location
    let lat: number | undefined;
    let lng: number | undefined;

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 3000,
            enableHighAccuracy: true
          });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (err) {
        console.warn('Location access denied');
      }
    }

    // Scan ticket
    const result = await scanTicketAtDoor(
      qrInput.trim().toUpperCase(),
      user.id,
      lat,
      lng
    );

    setLastScan(result);
    setScanHistory(prev => [result, ...prev.slice(0, 49)]); // Keep last 50 scans

    // Refresh capacity
    await refreshCapacity();

    // Clear input
    setQrInput('');
    setScanning(false);

    // Auto-hide success after 3 seconds
    if (result.success) {
      setTimeout(() => {
        setLastScan(null);
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  // Event selection UI
  if (!eventId || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <ScanLine className="w-16 h-16 text-[#FF0080] mx-auto" />
            <h1 className="text-3xl font-black text-white uppercase">
              Door Scanner
            </h1>
            <p className="text-white/60">
              Select an event to start scanning tickets
            </p>
          </div>

          <Card className="p-6">
            <label className="block text-white font-bold mb-2">
              Event ID
            </label>
            <HMInput
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="Enter event ID..."
            />
            <HMButton
              onClick={loadEventData}
              className="w-full mt-4"
              disabled={!eventId}
            >
              Start Scanning
            </HMButton>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate capacity status
  const capacityPercentage = capacity.percentage;
  const isNearCapacity = capacityPercentage >= 90;
  const isAtCapacity = capacityPercentage >= 100;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-white uppercase truncate">
                {event.name}
              </h1>
              <p className="text-white/60 text-sm">
                {new Date(event.start_time).toLocaleDateString()}
              </p>
            </div>

            <HMButton
              variant="ghost"
              onClick={() => onNavigate('clubDashboard', { clubId })}
            >
              Exit Scanner
            </HMButton>
          </div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className={`border-b transition-colors ${
        isAtCapacity ? 'bg-red-500/10 border-red-500/30' :
        isNearCapacity ? 'bg-yellow-500/10 border-yellow-500/30' :
        'border-white/10'
      }`}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${
                isAtCapacity ? 'text-red-500' :
                isNearCapacity ? 'text-yellow-500' :
                'text-[#FF0080]'
              }`} />
              <span className="text-white font-bold">
                {capacity.checked_in} / {capacity.capacity}
              </span>
            </div>

            <div className="text-right">
              <p className={`text-2xl font-black ${
                isAtCapacity ? 'text-red-500' :
                isNearCapacity ? 'text-yellow-500' :
                'text-[#FF0080]'
              }`}>
                {capacityPercentage}%
              </p>
              <p className="text-white/60 text-xs">
                {capacity.available} remaining
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full transition-colors ${
                isAtCapacity ? 'bg-red-500' :
                isNearCapacity ? 'bg-yellow-500' :
                'bg-[#FF0080]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Warning */}
          {isNearCapacity && (
            <p className={`text-sm mt-2 ${
              isAtCapacity ? 'text-red-500' : 'text-yellow-500'
            }`}>
              {isAtCapacity ? '⚠️ AT CAPACITY - No more entries' : '⚠️ NEAR CAPACITY'}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Scan Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setScanMode('manual')}
            className={`flex-1 py-3 px-4 rounded font-bold uppercase transition-colors ${
              scanMode === 'manual'
                ? 'bg-[#FF0080] text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <ScanLine className="w-5 h-5 inline mr-2" />
            Manual Entry
          </button>
          <button
            onClick={() => setScanMode('camera')}
            className={`flex-1 py-3 px-4 rounded font-bold uppercase transition-colors ${
              scanMode === 'camera'
                ? 'bg-[#FF0080] text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Camera className="w-5 h-5 inline mr-2" />
            Camera Scan
          </button>
        </div>

        {/* Scanner Input */}
        <Card className="p-6">
          <div className="space-y-4">
            <label className="block text-white font-bold">
              Ticket QR Code
            </label>
            
            {scanMode === 'manual' ? (
              <div className="flex gap-2">
                <HMInput
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="TIX-XXXXXXXXXXXX"
                  className="flex-1 font-mono uppercase"
                  autoFocus
                  disabled={scanning}
                />
                <HMButton
                  onClick={handleScan}
                  disabled={!qrInput.trim() || scanning}
                  className="px-8"
                >
                  {scanning ? 'Scanning...' : 'Scan'}
                </HMButton>
              </div>
            ) : (
              <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Camera className="w-12 h-12 text-white/40 mx-auto" />
                  <p className="text-white/60 text-sm">
                    Camera scanning coming soon
                  </p>
                  <HMButton
                    variant="secondary"
                    onClick={() => setScanMode('manual')}
                  >
                    Use Manual Entry
                  </HMButton>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Last Scan Result */}
        <AnimatePresence mode="wait">
          {lastScan && (
            <motion.div
              key={lastScan.success ? 'success' : 'error'}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
            >
              <ScanResultCard result={lastScan} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-white uppercase mb-4">
              Recent Scans
            </h2>
            <Card>
              <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
                {scanHistory.map((scan, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 flex items-center gap-3 ${
                      scan.allow_entry ? 'bg-green-500/5' : 'bg-red-500/5'
                    }`}
                  >
                    {scan.allow_entry ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${
                        scan.allow_entry ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {scan.message}
                      </p>
                      {scan.ticket && (
                        <p className="text-white/60 text-xs truncate">
                          {scan.ticket.qr_code} · {scan.ticket.tier.toUpperCase()}
                        </p>
                      )}
                    </div>

                    <div className="text-right text-white/40 text-xs">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SCAN RESULT CARD
// ============================================================================

function ScanResultCard({ result }: { result: DoorScanResult }) {
  if (result.allow_entry) {
    return (
      <Card className="p-6 bg-green-500/10 border-green-500/30">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-12 h-12 text-green-500 flex-shrink-0" />
          
          <div className="flex-1">
            <h3 className="text-2xl font-black text-green-500 uppercase mb-2">
              ✓ ENTRY GRANTED
            </h3>
            <p className="text-white/80 mb-4">
              {result.message}
            </p>

            {result.ticket && result.event && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Tier</p>
                  <p className="text-white font-bold uppercase">
                    {result.ticket.tier}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Price</p>
                  <p className="text-white font-bold">
                    £{(result.ticket.price / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Ticket</p>
                  <p className="text-white font-mono text-xs">
                    {result.ticket.qr_code}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Purchased</p>
                  <p className="text-white text-xs">
                    {new Date(result.ticket.purchased_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-red-500/10 border-red-500/30">
      <div className="flex items-start gap-4">
        <XCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
        
        <div className="flex-1">
          <h3 className="text-2xl font-black text-red-500 uppercase mb-2">
            ✗ ENTRY DENIED
          </h3>
          <p className="text-white/80 mb-4">
            {result.message}
          </p>

          {result.ticket && (
            <div className="bg-black/20 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Status</span>
                <span className="text-white font-bold uppercase">
                  {result.ticket.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Ticket</span>
                <span className="text-white font-mono text-xs">
                  {result.ticket.qr_code}
                </span>
              </div>
              {result.ticket.checked_in_at && (
                <div className="flex justify-between">
                  <span className="text-white/60">Checked in</span>
                  <span className="text-white text-xs">
                    {new Date(result.ticket.checked_in_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
