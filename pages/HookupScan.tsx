// HOTMESS LONDON - Hookup Beacon Scan Page
// Consent-first connection flow for hookup beacons

import { useState, useEffect } from 'react';
import { Zap, MessageCircle, Users, AlertTriangle, Heart, Shield, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { HotmessButton } from '../components/hotmess/Button';
import { LoadingState } from '../components/LoadingState';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface HookupScanProps {
  code: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function HookupScan({ code, onNavigate }: HookupScanProps) {
  const { user, session } = useAuth();
  const [beacon, setBeacon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'info' | 'consent' | 'connecting' | 'connected'>('info');
  const [consentMessage, setConsentMessage] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadBeacon();
  }, [code]);

  const loadBeacon = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/hookup/beacon/${code}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load beacon');
      }

      const data = await response.json();
      setBeacon(data.beacon);
    } catch (err: any) {
      console.error('Error loading beacon:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async () => {
    // First check what consent message to show
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/hookup/scan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            beacon_id: code,
            consent_confirmed: false,
          }),
        }
      );

      const data = await response.json();

      if (data.requires_consent) {
        setConsentMessage(data.consent_message);
        setStep('consent');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const handleConfirmConsent = async () => {
    try {
      setStep('connecting');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/hookup/scan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            beacon_id: code,
            consent_confirmed: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle membership requirement
        if (response.status === 403 && errorData.required_tier) {
          setError(`This hookup zone requires ${errorData.required_tier.toUpperCase()} membership`);
          setStep('info');
          return;
        }

        throw new Error(errorData.error || 'Failed to connect');
      }

      const data = await response.json();
      setResult(data);
      setStep('connected');
    } catch (err: any) {
      console.error('Error connecting:', err);
      setError(err.message);
      setStep('info');
    }
  };

  if (loading) {
    return <LoadingState message="Loading hookup zone..." />;
  }

  if (error && !beacon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-red-500/30 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl text-white mb-2">Error</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <HotmessButton onClick={() => onNavigate('home')}>
            Back to Home
          </HotmessButton>
        </div>
      </div>
    );
  }

  if (!beacon) return null;

  // Step 1: Info Screen
  if (step === 'info') {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900/95 backdrop-blur-sm border-b border-white/10 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-hot" />
                <span className="text-white uppercase tracking-wider" style={{ fontWeight: 900 }}>
                  HOOK-UP ZONE
                </span>
              </div>
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Beacon Info */}
          <div className="bg-gradient-to-br from-hot/10 to-hot/5 border border-hot/30 rounded-2xl p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-hot/20 rounded-xl border border-hot/30">
                {beacon.mode === 'room' ? (
                  <Users className="w-8 h-8 text-hot" />
                ) : (
                  <MessageCircle className="w-8 h-8 text-hot" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl text-white mb-2">{beacon.name}</h1>
                <p className="text-white/60">{beacon.description}</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div>
                <div className="text-xs text-white/40 mb-1">CITY</div>
                <div className="text-white">{beacon.city}</div>
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">TYPE</div>
                <div className="text-white capitalize">
                  {beacon.mode === 'room' ? 'Group Vibes' : '1-on-1'}
                </div>
              </div>
              {beacon.venue && (
                <div>
                  <div className="text-xs text-white/40 mb-1">VENUE</div>
                  <div className="text-white">{beacon.venue}</div>
                </div>
              )}
              {beacon.zone && (
                <div>
                  <div className="text-xs text-white/40 mb-1">ZONE</div>
                  <div className="text-white capitalize">{beacon.zone}</div>
                </div>
              )}
            </div>
          </div>

          {/* Men-Only Notice */}
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white mb-2">Men-Only. 18+. Consent-First.</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  This is a hookup zone for queer men. By continuing, you confirm you're 18+, 
                  sober enough to consent, and will respect everyone's boundaries.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            {!user && beacon.mode === '1to1' && (
              <div className="text-center p-4 bg-white/5 rounded-xl mb-3">
                <p className="text-sm text-white/60">
                  You must be signed in to use 1-on-1 connections
                </p>
              </div>
            )}

            <HotmessButton
              fullWidth
              onClick={handleProceed}
              disabled={!user && beacon.mode === '1to1'}
              icon={beacon.mode === 'room' ? <Users size={20} /> : <MessageCircle size={20} />}
            >
              {beacon.mode === 'room' ? 'Enter Hook-Up Room' : 'Start Private Chat'}
            </HotmessButton>

            <HotmessButton
              fullWidth
              variant="outline"
              onClick={() => onNavigate('care')}
              icon={<Heart size={20} />}
            >
              Not Tonight / Care Resources
            </HotmessButton>
          </div>

          {/* Care Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('care')}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Need support? Visit our Care page →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Consent Check
  if (step === 'consent') {
    const consentItems = consentMessage.split('\n').filter(line => line.trim().startsWith('✓'));

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full border border-white/10 mb-4">
                <Shield className="w-8 h-8 text-white/60" />
              </div>
              <h2 className="text-2xl text-white mb-2">Quick Check-In</h2>
              <p className="text-sm text-white/60">
                Before you connect, make sure you're in a good place:
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {consentItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="text-green-400 flex-shrink-0 mt-0.5">✓</div>
                  <div className="text-sm text-white/80">{item.replace('✓', '').trim()}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <HotmessButton
                fullWidth
                onClick={handleConfirmConsent}
              >
                I Confirm - Let's Connect
              </HotmessButton>
              <HotmessButton
                fullWidth
                variant="outline"
                onClick={() => {
                  setStep('info');
                  setError(null);
                }}
              >
                Actually, Not Right Now
              </HotmessButton>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-xs text-white/40 text-center">
                If anything feels off — stop. You can always /report or use aftercare.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Connecting
  if (step === 'connecting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-hot/30 border-t-hot rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Connecting...</p>
        </div>
      </div>
    );
  }

  // Step 4: Connected
  if (step === 'connected' && result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full border border-green-500/30 mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl text-white mb-2">
                {result.mode === 'room' ? 'Room Unlocked!' : 'Connection Initiated!'}
              </h2>
              <p className="text-white/60">{result.message}</p>
            </div>

            {result.xp_earned > 0 && (
              <div className="p-4 bg-white/5 rounded-xl mb-6 text-center">
                <div className="text-sm text-white/60 mb-1">XP Earned</div>
                <div className="text-2xl text-yellow-400">+{result.xp_earned} XP</div>
              </div>
            )}

            {result.mode === 'room' && result.room_link && (
              <div className="space-y-3">
                <HotmessButton
                  fullWidth
                  onClick={() => window.open(result.room_link, '_blank')}
                  icon={<Users size={20} />}
                >
                  Open Telegram Room
                </HotmessButton>
                <div className="text-xs text-white/40 text-center">
                  Room opens in Telegram. Check in with yourself. Stay safe. 🖤
                </div>
              </div>
            )}

            {result.mode === '1to1' && (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-sm text-white/80 mb-3">Next Steps:</div>
                  <ul className="space-y-2">
                    {result.next_steps?.map((step: string, i: number) => (
                      <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                        <span className="text-hot flex-shrink-0">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs text-white/40 text-center">
                  {result.bot_message}
                </div>
              </div>
            )}

            <HotmessButton
              fullWidth
              variant="outline"
              onClick={() => onNavigate('home')}
              className="mt-6"
            >
              Back to Home
            </HotmessButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
