// HOTMESS LONDON - Create Hookup Beacon
// Create room-based or 1:1 hookup QR codes

import { useState } from 'react';
import { Zap, Users, MessageCircle, MapPin, Calendar, Shield, Lock, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { HotmessButton } from '../components/hotmess/Button';
import { projectId } from '../utils/supabase/info';

interface HookupBeaconCreateProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function HookupBeaconCreate({ onNavigate }: HookupBeaconCreateProps) {
  const { user, session } = useAuth();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'room' | '1to1' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: 'london',
    venue: '',
    zone: '',
    telegram_room_id: '',
    active_from: '',
    active_until: '',
    max_connections_per_hour: 10,
    membership_required: 'free',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-white/10 rounded-2xl p-8 text-center">
          <Lock className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h2 className="text-2xl text-white mb-4">Sign in required</h2>
          <p className="text-white/60 mb-6">
            You must be signed in to create hookup beacons
          </p>
          <HotmessButton onClick={() => onNavigate('login')}>
            Sign In
          </HotmessButton>
        </div>
      </div>
    );
  }

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/hookup/beacon/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            mode,
            target_user_id: mode === '1to1' ? user.id : undefined,
            ...formData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create beacon');
      }

      const data = await response.json();
      setResult(data);
      setStep(4);
    } catch (err: any) {
      console.error('Error creating beacon:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 bg-neutral-900/95 backdrop-blur-sm border-b border-white/10 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-hot" />
            <h1 className="text-white uppercase tracking-wider" style={{ fontWeight: 900 }}>
              Create Hook-Up Beacon
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                s <= step ? 'bg-hot' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Choose Mode */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-white mb-2">Choose Connection Type</h2>
              <p className="text-white/60">
                Create a QR code for group vibes or 1-on-1 connections
              </p>
            </div>

            <button
              onClick={() => {
                setMode('room');
                setStep(2);
              }}
              className="w-full p-6 bg-neutral-900 border-2 border-white/10 hover:border-hot/50 rounded-2xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-hot/10 transition-colors">
                  <Users className="w-8 h-8 text-white/60 group-hover:text-hot" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl text-white mb-2">Room-Based Hook-Up</h3>
                  <p className="text-sm text-white/60 mb-3">
                    For venues, floors, zones. Perfect for clubs, saunas, parties.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                      Group vibes
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                      Safer default
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                      +100 XP
                    </span>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setMode('1to1');
                setStep(2);
              }}
              className="w-full p-6 bg-neutral-900 border-2 border-white/10 hover:border-hot/50 rounded-2xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-hot/10 transition-colors">
                  <MessageCircle className="w-8 h-8 text-white/60 group-hover:text-hot" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl text-white mb-2">1-on-1 Connection</h3>
                  <p className="text-sm text-white/60 mb-3">
                    Your personal QR. For profiles, stickers, phone cases, wristbands.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                      Direct DM
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                      Consent-first
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                      +50 XP
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-white mb-2">
                {mode === 'room' ? 'Zone Details' : 'Your Connection Details'}
              </h2>
              <p className="text-white/60">
                {mode === 'room'
                  ? 'Describe the hookup zone'
                  : 'Customize your connection message'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={
                    mode === 'room'
                      ? 'e.g., "MEN ON THIS FLOOR TONIGHT"'
                      : 'e.g., "Connect with me"'
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-hot/50"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={
                    mode === 'room'
                      ? 'e.g., "Hook-up room for basement floor. Consent-first."'
                      : 'e.g., "Looking to connect. Let\'s chat."'
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-hot/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-hot/50"
                >
                  <option value="london">London</option>
                  <option value="berlin">Berlin</option>
                  <option value="paris">Paris</option>
                  <option value="amsterdam">Amsterdam</option>
                </select>
              </div>

              {mode === 'room' && (
                <>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Venue (optional)</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g., Club XYZ"
                      className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-hot/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Zone (optional)</label>
                    <input
                      type="text"
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      placeholder="e.g., basement, darkroom, main-floor"
                      className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-hot/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Telegram Room ID
                      <span className="ml-2 text-xs text-white/40">(required for room mode)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.telegram_room_id}
                      onChange={(e) => setFormData({ ...formData, telegram_room_id: e.target.value })}
                      placeholder="e.g., hotmess_london_hookups_basement"
                      className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-hot/50"
                    />
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <HotmessButton
                variant="outline"
                onClick={() => setStep(1)}
                fullWidth
              >
                Back
              </HotmessButton>
              <HotmessButton
                onClick={() => setStep(3)}
                fullWidth
                disabled={!formData.name || (mode === 'room' && !formData.telegram_room_id)}
              >
                Continue
              </HotmessButton>
            </div>
          </div>
        )}

        {/* Step 3: Settings & Create */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-white mb-2">Settings</h2>
              <p className="text-white/60">Optional: set time limits and access control</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Membership Required
                </label>
                <select
                  value={formData.membership_required}
                  onChange={(e) => setFormData({ ...formData, membership_required: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-hot/50"
                >
                  <option value="free">FREE - Anyone</option>
                  <option value="pro">PRO - £15/mo members</option>
                  <option value="elite">ELITE - £35/mo members</option>
                </select>
              </div>

              {mode === '1to1' && (
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Max Connections Per Hour
                  </label>
                  <input
                    type="number"
                    value={formData.max_connections_per_hour}
                    onChange={(e) => setFormData({ ...formData, max_connections_per_hour: parseInt(e.target.value) })}
                    min="1"
                    max="50"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-hot/50"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Prevents spam. Recommended: 10-20 per hour.
                  </p>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white mb-2">Preview</h3>
                  <div className="space-y-1 text-sm text-white/60">
                    <div>Name: {formData.name || 'Not set'}</div>
                    <div>Type: {mode === 'room' ? 'Room-based' : '1-on-1'}</div>
                    <div>City: {formData.city}</div>
                    <div>Access: {formData.membership_required.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <HotmessButton
                variant="outline"
                onClick={() => setStep(2)}
                fullWidth
              >
                Back
              </HotmessButton>
              <HotmessButton
                onClick={handleCreate}
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Beacon'}
              </HotmessButton>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && result && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full border border-green-500/30 mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl text-white mb-2">Beacon Created!</h2>
              <p className="text-white/60">Your hookup QR is ready to use</p>
            </div>

            <div className="p-6 bg-neutral-900 border border-white/10 rounded-xl">
              <div className="text-sm text-white/60 mb-3">QR URL</div>
              <div className="p-3 bg-black rounded-lg mb-3 break-all text-sm text-white/80">
                {result.qr_url}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.qr_url);
                  alert('URL copied!');
                }}
                className="text-sm text-hot hover:underline"
              >
                Copy URL
              </button>
            </div>

            <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 rounded-xl text-center">
              <div className="text-sm text-white/60 mb-1">XP Earned</div>
              <div className="text-2xl text-yellow-400">+{result.xp_earned} XP</div>
            </div>

            <HotmessButton
              fullWidth
              onClick={() => onNavigate('home')}
            >
              Done
            </HotmessButton>
          </div>
        )}
      </div>
    </div>
  );
}
