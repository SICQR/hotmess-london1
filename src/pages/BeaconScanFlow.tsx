/**
 * BEACON SCAN FLOW — Complete Scanning Experience
 * Handles QR scanning, code entry, XP rewards, and BRE routing with type-specific modals
 */

import { useState, useEffect } from 'react';
import { Zap, Check, X, AlertCircle, QrCode, ArrowRight, Star, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import {
  type Beacon,
  type BeaconType,
  BEACON_TYPE_META,
  isBeaconActive,
  routeBeacon,
  isValidBeaconCode,
} from '../lib/beacon-system';
import { scanBeacon, getBeacon } from '../lib/beacons/beaconService';
import { publicAnonKey } from '../utils/supabase/info';
import { 
  CheckInSuccessModal,
  QuickCheckoutModal,
  RewardUnlockModal,
  MusicPreSaveModal,
  EventRSVPModal,
  QuestProgressModal,
  TelegramJoinModal,
} from '../components/beacon-flows';
import { getMockDataForBeaconType } from '../lib/beacon-mock-data';
import { SaveButton } from '../components/SaveButton';

interface BeaconScanFlowProps {
  code?: string; // Optional pre-filled code from URL
  onNavigate: (route: string, params?: Record<string, string>) => void;
  onClose?: () => void;
}

type ScanState = 'input' | 'scanning' | 'success' | 'error' | 'routing' | 'modal';

export function BeaconScanFlow({ code: initialCode, onNavigate, onClose }: BeaconScanFlowProps) {
  const [state, setState] = useState<ScanState>(initialCode ? 'scanning' : 'input');
  const [code, setCode] = useState(initialCode || '');
  const [beacon, setBeacon] = useState<any | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userMultiplier, setUserMultiplier] = useState(1);
  const [activeModal, setActiveModal] = useState<BeaconType | null>(null);

  // Auto-scan if code provided
  useEffect(() => {
    if (initialCode) {
      handleScan(initialCode);
    }
  }, [initialCode]);

  const handleScan = async (scanCode: string) => {
    setState('scanning');
    setError(null);

    try {
      // Call beaconService to scan the beacon
      const result = await scanBeacon(scanCode);
      
      if (result.ok) {
        const beaconData = result.scan;
        const earnedXP = result.xpAwarded || 0;
        
        // Fetch the beacon details
        const beaconResult = await getBeacon(scanCode);
        if (beaconResult.ok) {
          setBeacon(beaconResult.beacon);
          setXpAwarded(earnedXP);
          setUserMultiplier(1); // Default multiplier
          setState('success');
          
          toast.success(`+${earnedXP} XP earned!`);

          // Auto-route after 3 seconds
          setTimeout(() => {
            handleRoute(beaconResult.beacon);
          }, 3000);
        } else {
          setState('error');
          setError(beaconResult.error);
          toast.error(beaconResult.error);
        }
      } else {
        setState('error');
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err: any) {
      setState('error');
      const errorMsg = err.message || 'Failed to scan beacon. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleRoute = (beaconToRoute: any) => {
    setState('routing');
    const route = routeBeacon(beaconToRoute);

    // Slight delay for transition
    setTimeout(() => {
      if (route.type === 'external') {
        window.open(route.destination, '_blank');
        onClose?.();
      } else if (route.type === 'page') {
        onNavigate(route.destination as any, route.params);
      } else if (route.type === 'modal') {
        // Handle modal opening (would need modal context)
        setActiveModal(beaconToRoute.type);
        onClose?.();
      }
    }, 500);
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      handleScan(code.trim());
    }
  };

  const handleReset = () => {
    setState('input');
    setCode('');
    setBeacon(null);
    setXpAwarded(0);
    setError(null);
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Input State */}
        {state === 'input' && (
          <div className="text-center">
            <div className="size-24 mx-auto mb-6 rounded-full bg-red-950/40 flex items-center justify-center">
              <QrCode className="size-12 text-red-500" />
            </div>
            
            <h1 className="mb-3">Scan Beacon</h1>
            
            <p className="text-[15px] text-white/60 mb-8 leading-[1.6]">
              Enter a beacon code or scan a QR code to earn XP and unlock content.
            </p>

            <form onSubmit={handleManualEntry} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g., GLO-001)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center text-[16px] font-mono uppercase tracking-wider focus:outline-none focus:border-red-500 transition-colors"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!code.trim()}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-white/5 disabled:text-white/30 rounded-lg font-bold transition-colors"
              >
                Scan Beacon
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-[13px] text-white/40 mb-4">Try scanning one of these:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['GLO-001', 'CONVICT-HOTMESS', 'RAW-DROP-001', 'TG-LONDON'].map((testCode) => (
                  <button
                    key={testCode}
                    onClick={() => {
                      setCode(testCode);
                      handleScan(testCode);
                    }}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[11px] font-mono hover:bg-white/10 transition-colors"
                  >
                    {testCode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scanning State */}
        {state === 'scanning' && (
          <div className="text-center">
            <div className="size-24 mx-auto mb-6 rounded-full bg-red-950/40 flex items-center justify-center animate-pulse">
              <QrCode className="size-12 text-red-500" />
            </div>
            
            <h2 className="mb-2">Scanning...</h2>
            <p className="text-[14px] text-white/60">
              Looking up beacon code: <span className="font-mono">{code}</span>
            </p>

            <div className="mt-6 flex justify-center">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="size-2 rounded-full bg-red-500"
                    style={{
                      animation: `pulse 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {state === 'success' && beacon && (
          <div className="text-center">
            {/* Success Icon */}
            <div className="size-24 mx-auto mb-6 rounded-full bg-green-950/40 border-4 border-green-600 flex items-center justify-center animate-scale-in">
              <Check className="size-12 text-green-500" />
            </div>

            {/* XP Award */}
            <div className="mb-6 animate-fade-in-up">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="size-8 text-yellow-500" />
                <span className="text-[48px] font-black text-white">+{xpAwarded}</span>
                <span className="text-[20px] text-white/60">XP</span>
              </div>
              <p className="text-[13px] text-white/40">
                {userMultiplier}x multiplier applied
              </p>
            </div>

            {/* Beacon Info */}
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5 mb-6 text-left animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="text-[32px]">{BEACON_TYPE_META[beacon.type as BeaconType]?.icon || '📍'}</div>
                <div className="flex-1">
                  <h3 className="text-[18px] font-bold text-white mb-1">{beacon.title}</h3>
                  <p className="text-[13px] text-white/60 leading-[1.5]">
                    {beacon.description || BEACON_TYPE_META[beacon.type as BeaconType]?.description}
                  </p>
                </div>
              </div>

              {/* Beacon Details */}
              <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-white/40">Type</span>
                  <span className="text-[13px] font-bold text-white">
                    {BEACON_TYPE_META[beacon.type as BeaconType]?.label || beacon.type}
                  </span>
                </div>

                {beacon.city_id && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3 text-white/40" />
                    <span className="text-[13px] text-white/60">{beacon.city_id}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[11px] font-mono text-white/40">{beacon.slug}</span>
                </div>

                {/* Save Button */}
                <SaveButton
                  contentType="beacon"
                  contentId={beacon.slug}
                  metadata={{
                    title: beacon.title,
                    description: beacon.description,
                    image: null,
                    location: beacon.city_id
                  }}
                  size="sm"
                />
              </div>
            </div>

            {/* Routing Message */}
            <div className="flex items-center gap-2 justify-center text-[14px] text-white/60 mb-6">
              <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Routing you now...</span>
            </div>

            {/* Manual Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleRoute(beacon)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold transition-colors"
              >
                Scan Another
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="text-center">
            <div className="size-24 mx-auto mb-6 rounded-full bg-red-950/40 border-4 border-red-600 flex items-center justify-center">
              <X className="size-12 text-red-500" />
            </div>
            
            <h2 className="mb-3">Scan Failed</h2>
            
            <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[14px] text-white/80 text-left leading-[1.5]">
                  {error}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Routing State */}
        {state === 'routing' && (
          <div className="text-center">
            <div className="size-24 mx-auto mb-6 rounded-full bg-red-950/40 flex items-center justify-center">
              <ArrowRight className="size-12 text-red-500 animate-bounce-horizontal" />
            </div>
            
            <h2 className="mb-2">Redirecting...</h2>
            <p className="text-[14px] text-white/60">Taking you to your destination</p>
          </div>
        )}

        {/* Close Button (if used as modal) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="size-5 text-white/60" />
          </button>
        )}
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce-horizontal {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s ease-in-out infinite;
        }
      `}</style>

      {/* Type-specific Modals */}
      {activeModal && beacon && (() => {
        const mockData = getMockDataForBeaconType(activeModal, beacon.name);
        
        switch (activeModal) {
          case 'checkin':
            return mockData && (
              <CheckInSuccessModal
                isOpen={true}
                onClose={() => setActiveModal(null)}
                {...mockData}
              />
            );
          
          case 'scan-to-buy':
            return mockData && (
              <QuickCheckoutModal
                isOpen={true}
                onClose={() => setActiveModal(null)}
                {...mockData}
              />
            );
          
          case 'reward':
            return mockData && (
              <RewardUnlockModal
                isOpen={true}
                onClose={() => setActiveModal(null)}
                {...mockData}
              />
            );
          
          case 'music':
            return mockData && (
              <MusicPreSaveModal
                isOpen={true}
                onClose={() => setActiveModal(null)}
                {...mockData}
              />
            );
          
          case 'event':
            return mockData && (
              <EventRSVPModal
                isOpen={true}
                onClose={() => setActiveModal(null)}
                {...mockData}
              />
            );
          
          case 'quest':
            return mockData && (
              <QuestProgressModal
                isOpen={true}
                onClose={() => setActiveModal(null)}
                {...mockData}
              />
            );
          
          case 'scan-to-join':
            return mockData && (
              <TelegramJoinModal
                isOpen={true}
                onClose={() => setActiveModal(null)}
                {...mockData}
              />
            );
          
          default:
            return null;
        }
      })()}
    </div>
  );
}