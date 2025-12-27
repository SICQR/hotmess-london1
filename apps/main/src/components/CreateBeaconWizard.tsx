/**
 * HOTMESS LONDON — Create Beacon Wizard
 * 7-step flow: Type → Details → Location → Time → Access → Notifications → Publish
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Shield, Bell, CheckCircle, Loader2, Copy, Download, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { createBeacon } from '../lib/beacons/beaconService'; // Updated import
import { downloadBrandedBeaconQR } from '../lib/qr/downloadBrandedBeaconQR';

interface CreateBeaconWizardProps {
  onNavigate: (page: string, params?: any) => void;
}

type BeaconType =
  | 'checkin'
  | 'ticket'
  | 'connect'
  | 'product'
  | 'drop'
  | 'event'
  | 'chat'
  | 'vendor'
  | 'reward'
  | 'sponsor';

const TYPE_OPTIONS: { value: BeaconType; label: string; hint: string }[] = [
  { value: 'checkin', label: 'Check-In', hint: 'Venue analytics + presence' },
  { value: 'ticket', label: 'Tickets', hint: 'Listings + threads' },
  { value: 'connect', label: 'Connect', hint: 'Mutual opt-in messaging (premium)' },
  { value: 'product', label: 'Product Drop', hint: 'Shop drop / merch link' },
  { value: 'drop', label: 'Content Release', hint: 'Records release / media link' },
  { value: 'event', label: 'Live Event', hint: 'Happening now or scheduled' },
  { value: 'chat', label: 'Chat Room', hint: 'Group conversation beacon' },
  { value: 'vendor', label: 'Vendor', hint: 'Paid placement + analytics' },
  { value: 'sponsor', label: 'Sponsor', hint: 'Campaign beacon + disclosures' },
];

export function CreateBeaconWizard({ onNavigate }: CreateBeaconWizardProps) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Type
  const [type, setType] = useState<BeaconType>('checkin');

  // Step 2: Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  // Step 3: Location
  const [geoLat, setGeoLat] = useState<number | null>(null);
  const [geoLng, setGeoLng] = useState<number | null>(null);
  const [citySlug, setCitySlug] = useState('london');
  const [requiresGps, setRequiresGps] = useState(true);

  // Step 4: Time Window
  const [startsAt, setStartsAt] = useState<string>(() => new Date().toISOString());
  const [endsAt, setEndsAt] = useState<string>(() => {
    const end = new Date();
    end.setHours(end.getHours() + 6);
    return end.toISOString();
  });

  // Step 5: Access + XP
  const [xpAmount, setXpAmount] = useState(100);
  const [maxScansPerDay, setMaxScansPerDay] = useState(1);
  const [premiumRequired, setPremiumRequired] = useState(false);

  // Step 6: Notifications
  const [notifyNearby, setNotifyNearby] = useState(false);
  const [notifyOwner, setNotifyOwner] = useState(true);

  // Step 7: Published
  const [createdBeacon, setCreatedBeacon] = useState<any | null>(null);

  // Helpers
  function setTimeWindow(hours: number) {
    const start = new Date();
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
    setStartsAt(start.toISOString());
    setEndsAt(end.toISOString());
  }

  async function useMyLocation() {
    setError(null);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
        })
      );
      setGeoLat(pos.coords.latitude);
      setGeoLng(pos.coords.longitude);
    } catch {
      setError("Couldn't get location. Allow GPS or enter coordinates.");
    }
  }

  async function publishBeacon() {
    setBusy(true);
    setError(null);

    try {
      // Validation
      if (!title.trim()) throw new Error('Add a title.');
      if (title.trim().length < 2) throw new Error('Title must be at least 2 characters.');
      if (geoLat === null || geoLng === null) throw new Error('Add a location.');
      
      const s = new Date(startsAt);
      const e = new Date(endsAt);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) throw new Error('Invalid time window.');
      if (e <= s) throw new Error('End time must be after start time.');

      // Build config
      const config: Record<string, any> = {
        notifications: {
          nearby_opt_in: notifyNearby,
          owner_alerts: notifyOwner,
        },
      };

      if (type === 'product' && targetUrl) {
        config.target = { kind: 'url', url: targetUrl.trim() };
      }
      if (type === 'drop' && targetUrl) {
        config.target = { kind: 'release', url: targetUrl.trim() };
      }

      // Call collision-safe beacon creation service
      const res = await (createBeacon as any)({
        type: type as any,
        title: title.trim(),
        description: description.trim() || null,
        geo_lat: geoLat,
        geo_lng: geoLng,
        radius_m: 150, // Could make this configurable
        starts_at: s.toISOString(),
        ends_at: e.toISOString(),
        requires_gps: requiresGps,
        premium_required: premiumRequired,
        config,
      });

      if (!res.ok) throw new Error(res.error);
      
      setCreatedBeacon(res.beacon);
      setStep(7);
    } catch (e: any) {
      console.error('Beacon creation error:', e);
      setError(e?.message || 'Failed to create beacon.');
    } finally {
      setBusy(false);
    }
  }

  function generateBeaconCode(): string {
    // Generate 8-character code (uppercase letters + numbers, excluding confusing chars)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async function copyLink() {
    if (!createdBeacon) return;
    const link = `${window.location.origin}/l/${createdBeacon.code}`;
    await navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  }

  async function downloadQR() {
    if (!createdBeacon) return;
    try {
      await downloadBrandedBeaconQR(createdBeacon);
    } catch (error) {
      console.error('QR download error:', error);
      alert('Failed to download QR code');
    }
  }

  const totalSteps = 7;

  return (
    <div className="bg-white/5 border border-white/10 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-hot uppercase tracking-widest" style={{ fontWeight: 700, fontSize: '10px' }}>
            Create Beacon
          </div>
          <div className="text-white uppercase tracking-wider mt-1" style={{ fontWeight: 700, fontSize: '14px' }}>
            Step {step} / {totalSteps}
          </div>
        </div>
        {step < 7 && (
          <div className="text-white/40 text-right" style={{ fontSize: '10px' }}>
            18+ only • Consent-first
            <br />
            Time windows + GPS checks
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-950/50 border border-red-500/50 text-red-200 p-4 mb-6" style={{ fontSize: '12px' }}>
          {error}
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && <Step1Type type={type} setType={setType} />}
          {step === 2 && (
            <Step2Details
              type={type}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              targetUrl={targetUrl}
              setTargetUrl={setTargetUrl}
            />
          )}
          {step === 3 && (
            <Step3Location
              geoLat={geoLat}
              geoLng={geoLng}
              setGeoLat={setGeoLat}
              setGeoLng={setGeoLng}
              citySlug={citySlug}
              setCitySlug={setCitySlug}
              requiresGps={requiresGps}
              setRequiresGps={setRequiresGps}
              onUseMyLocation={useMyLocation}
            />
          )}
          {step === 4 && (
            <Step4TimeWindow
              startsAt={startsAt}
              endsAt={endsAt}
              setStartsAt={setStartsAt}
              setEndsAt={setEndsAt}
              onSetWindow={setTimeWindow}
            />
          )}
          {step === 5 && (
            <Step5Access
              type={type}
              xpAmount={xpAmount}
              setXpAmount={setXpAmount}
              maxScansPerDay={maxScansPerDay}
              setMaxScansPerDay={setMaxScansPerDay}
              premiumRequired={premiumRequired}
              setPremiumRequired={setPremiumRequired}
            />
          )}
          {step === 6 && (
            <Step6Notifications
              notifyNearby={notifyNearby}
              setNotifyNearby={setNotifyNearby}
              notifyOwner={notifyOwner}
              setNotifyOwner={setNotifyOwner}
            />
          )}
          {step === 7 && <Step7Published beacon={createdBeacon} onCopy={copyLink} onDownload={downloadQR} onNavigate={onNavigate} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step < 7 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={busy || step === 1}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all disabled:opacity-30"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            Back
          </button>

          {step < 6 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={busy}
              className="px-6 py-3 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all"
              style={{ fontWeight: 700, fontSize: '12px' }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={publishBeacon}
              disabled={busy}
              className="px-8 py-3 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
              style={{ fontWeight: 700, fontSize: '12px' }}
            >
              {busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Beacon'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function Step1Type({ type, setType }: { type: BeaconType; setType: (t: BeaconType) => void }) {
  return (
    <div>
      <h3 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 700, fontSize: '16px' }}>
        Beacon Type
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setType(option.value)}
            className={`p-4 border text-left transition-all ${
              type === option.value
                ? 'bg-hot/20 border-hot'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            <div className="text-white uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '12px' }}>
              {option.label}
            </div>
            <div className="text-white/60" style={{ fontSize: '11px' }}>
              {option.hint}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2Details({
  type,
  title,
  setTitle,
  description,
  setDescription,
  targetUrl,
  setTargetUrl,
}: {
  type: BeaconType;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  targetUrl: string;
  setTargetUrl: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 700, fontSize: '16px' }}>
        Beacon Details
      </h3>

      <div>
        <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Fire Nightclub Check-In"
          className="w-full bg-black border border-white/20 px-4 py-3 text-white placeholder:text-white/30"
          style={{ fontSize: '14px' }}
        />
      </div>

      <div>
        <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell people what this beacon is for..."
          className="w-full bg-black border border-white/20 px-4 py-3 text-white placeholder:text-white/30 min-h-[100px]"
          style={{ fontSize: '14px' }}
        />
      </div>

      {(type === 'product' || type === 'drop') && (
        <div>
          <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
            Target URL (Optional)
          </label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="/shop/products/raw-tee or https://..."
            className="w-full bg-black border border-white/20 px-4 py-3 text-white placeholder:text-white/30"
            style={{ fontSize: '14px' }}
          />
        </div>
      )}
    </div>
  );
}

function Step3Location({
  geoLat,
  geoLng,
  setGeoLat,
  setGeoLng,
  citySlug,
  setCitySlug,
  requiresGps,
  setRequiresGps,
  onUseMyLocation,
}: {
  geoLat: number | null;
  geoLng: number | null;
  setGeoLat: (v: number | null) => void;
  setGeoLng: (v: number | null) => void;
  citySlug: string;
  setCitySlug: (v: string) => void;
  requiresGps: boolean;
  setRequiresGps: (v: boolean) => void;
  onUseMyLocation: () => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-white uppercase tracking-wider mb-4 flex items-center gap-2" style={{ fontWeight: 700, fontSize: '16px' }}>
        <MapPin size={20} className="text-hot" />
        Location
      </h3>

      <button
        onClick={onUseMyLocation}
        className="px-6 py-3 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all"
        style={{ fontWeight: 700, fontSize: '12px' }}
      >
        Use My Location
      </button>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
            Latitude
          </label>
          <input
            type="number"
            step="0.000001"
            value={geoLat ?? ''}
            onChange={(e) => setGeoLat(e.target.value ? Number(e.target.value) : null)}
            placeholder="51.5074"
            className="w-full bg-black border border-white/20 px-4 py-3 text-white placeholder:text-white/30"
            style={{ fontSize: '14px' }}
          />
        </div>
        <div>
          <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
            Longitude
          </label>
          <input
            type="number"
            step="0.000001"
            value={geoLng ?? ''}
            onChange={(e) => setGeoLng(e.target.value ? Number(e.target.value) : null)}
            placeholder="-0.1278"
            className="w-full bg-black border border-white/20 px-4 py-3 text-white placeholder:text-white/30"
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
          City
        </label>
        <select
          value={citySlug}
          onChange={(e) => setCitySlug(e.target.value)}
          className="w-full bg-black border border-white/20 px-4 py-3 text-white"
          style={{ fontSize: '14px' }}
        >
          <option value="london">London</option>
          <option value="berlin">Berlin</option>
          <option value="amsterdam">Amsterdam</option>
          <option value="paris">Paris</option>
        </select>
      </div>

      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
        <input
          type="checkbox"
          checked={requiresGps}
          onChange={(e) => setRequiresGps(e.target.checked)}
          className="w-5 h-5"
        />
        <span className="text-white" style={{ fontSize: '12px' }}>
          Require GPS verification on scan (recommended for physical venues)
        </span>
      </label>
    </div>
  );
}

function Step4TimeWindow({
  startsAt,
  endsAt,
  setStartsAt,
  setEndsAt,
  onSetWindow,
}: {
  startsAt: string;
  endsAt: string;
  setStartsAt: (v: string) => void;
  setEndsAt: (v: string) => void;
  onSetWindow: (hours: number) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-white uppercase tracking-wider mb-4 flex items-center gap-2" style={{ fontWeight: 700, fontSize: '16px' }}>
        <Clock size={20} className="text-hot" />
        Time Window
      </h3>

      <div className="flex gap-2">
        <button
          onClick={() => onSetWindow(3)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all"
          style={{ fontWeight: 700, fontSize: '11px' }}
        >
          3 Hours
        </button>
        <button
          onClick={() => onSetWindow(6)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all"
          style={{ fontWeight: 700, fontSize: '11px' }}
        >
          6 Hours
        </button>
        <button
          onClick={() => onSetWindow(9)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all"
          style={{ fontWeight: 700, fontSize: '11px' }}
        >
          9 Hours
        </button>
        <button
          onClick={() => onSetWindow(24)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all"
          style={{ fontWeight: 700, fontSize: '11px' }}
        >
          24 Hours
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
            Starts At
          </label>
          <input
            type="datetime-local"
            value={startsAt.slice(0, 16)}
            onChange={(e) => setStartsAt(new Date(e.target.value).toISOString())}
            className="w-full bg-black border border-white/20 px-4 py-3 text-white"
            style={{ fontSize: '14px' }}
          />
        </div>
        <div>
          <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
            Ends At
          </label>
          <input
            type="datetime-local"
            value={endsAt.slice(0, 16)}
            onChange={(e) => setEndsAt(new Date(e.target.value).toISOString())}
            className="w-full bg-black border border-white/20 px-4 py-3 text-white"
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>

      <div className="bg-hot/10 border border-hot/30 p-4" style={{ fontSize: '11px' }}>
        <div className="text-hot uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>
          Note
        </div>
        <div className="text-white/60">
          Beacons expire automatically. Pin disappears from map. Analytics stay archived.
        </div>
      </div>
    </div>
  );
}

function Step5Access({
  type,
  xpAmount,
  setXpAmount,
  maxScansPerDay,
  setMaxScansPerDay,
  premiumRequired,
  setPremiumRequired,
}: {
  type: BeaconType;
  xpAmount: number;
  setXpAmount: (v: number) => void;
  maxScansPerDay: number;
  setMaxScansPerDay: (v: number) => void;
  premiumRequired: boolean;
  setPremiumRequired: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-white uppercase tracking-wider mb-4 flex items-center gap-2" style={{ fontWeight: 700, fontSize: '16px' }}>
        <Shield size={20} className="text-hot" />
        Access + Rewards
      </h3>

      <div>
        <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
          XP Reward (per scan)
        </label>
        <input
          type="number"
          min="0"
          max="1000"
          value={xpAmount}
          onChange={(e) => setXpAmount(Number(e.target.value))}
          className="w-full bg-black border border-white/20 px-4 py-3 text-white"
          style={{ fontSize: '14px' }}
        />
      </div>

      <div>
        <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '10px' }}>
          Max Scans Per User Per Day
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={maxScansPerDay}
          onChange={(e) => setMaxScansPerDay(Number(e.target.value))}
          className="w-full bg-black border border-white/20 px-4 py-3 text-white"
          style={{ fontSize: '14px' }}
        />
      </div>

      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
        <input
          type="checkbox"
          checked={premiumRequired}
          onChange={(e) => setPremiumRequired(e.target.checked)}
          className="w-5 h-5"
        />
        <span className="text-white" style={{ fontSize: '12px' }}>
          Require Premium membership {type === 'connect' && '(recommended for Connect beacons)'}
        </span>
      </label>
    </div>
  );
}

function Step6Notifications({
  notifyNearby,
  setNotifyNearby,
  notifyOwner,
  setNotifyOwner,
}: {
  notifyNearby: boolean;
  setNotifyNearby: (v: boolean) => void;
  notifyOwner: boolean;
  setNotifyOwner: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-white uppercase tracking-wider mb-4 flex items-center gap-2" style={{ fontWeight: 700, fontSize: '16px' }}>
        <Bell size={20} className="text-hot" />
        Notifications
      </h3>

      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
        <input
          type="checkbox"
          checked={notifyNearby}
          onChange={(e) => setNotifyNearby(e.target.checked)}
          className="w-5 h-5"
        />
        <div>
          <div className="text-white" style={{ fontSize: '12px' }}>
            Notify nearby users (opt-in only)
          </div>
          <div className="text-white/40 mt-1" style={{ fontSize: '10px' }}>
            Push notifications to users who've enabled location alerts
          </div>
        </div>
      </label>

      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
        <input
          type="checkbox"
          checked={notifyOwner}
          onChange={(e) => setNotifyOwner(e.target.checked)}
          className="w-5 h-5"
        />
        <div>
          <div className="text-white" style={{ fontSize: '12px' }}>
            Notify me on scans/threads/reports
          </div>
          <div className="text-white/40 mt-1" style={{ fontSize: '10px' }}>
            Get updates when people interact with your beacon
          </div>
        </div>
      </label>
    </div>
  );
}

function Step7Published({
  beacon,
  onCopy,
  onDownload,
  onNavigate,
}: {
  beacon: any;
  onCopy: () => void;
  onDownload: () => void;
  onNavigate: (page: string, params?: any) => void;
}) {
  if (!beacon) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <CheckCircle size={64} className="text-hot mx-auto" />
        </motion.div>

        <h3 className="text-white uppercase tracking-[-0.02em] leading-none mb-2" style={{ fontWeight: 900, fontSize: '32px' }}>
          Beacon Published
        </h3>
        <div className="text-hot uppercase tracking-wider mb-6" style={{ fontWeight: 700, fontSize: '12px' }}>
          {beacon.type.toUpperCase()} • /l/{beacon.code}
        </div>
      </div>

      <div className="bg-white/5 border border-hot/30 p-6">
        <div className="text-white mb-4" style={{ fontSize: '14px' }}>
          <strong>{beacon.title}</strong>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onCopy}
            className="w-full px-6 py-3 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            <Copy size={16} />
            Copy Link
          </button>

          <button
            onClick={onDownload}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            <Download size={16} />
            Download QR Code
          </button>

          <button
            onClick={() => {
              window.location.href = `/l/${beacon.code}`;
            }}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            <ExternalLink size={16} />
            Open Beacon
          </button>

          <button
            onClick={() => onNavigate('map', { focus: beacon.id })}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            <MapPin size={16} />
            View on Map
          </button>
        </div>
      </div>

      <div className="text-white/40 text-center" style={{ fontSize: '10px' }}>
        18+ only • Consent-first • GPS + time windows enforced
      </div>
    </div>
  );
}