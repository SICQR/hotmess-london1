/**
 * RIGHT NOW CREATE PAGE
 * Full creation flow with intent, room mode, host QR, safety + GDPR toggles
 * Wired into XP + globe/heat system
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  MapPin,
  ShieldAlert,
  Globe2,
  HeartHandshake,
  ChevronLeft,
  Users,
  QrCode,
  Info,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type RightNowIntent = 'hookup' | 'crowd' | 'drop' | 'ticket' | 'radio' | 'care';

interface RightNowCreatePageProps {
  onNavigate: (route: string) => void;
  // Optional: pre-fill city if you already know it
  userCity?: string;
  userCountry?: string;
}

const INTENT_LABELS: Record<RightNowIntent, string> = {
  hookup: 'Hookup / Play',
  crowd: 'Crowd / Party',
  drop: 'Drop / Offer',
  ticket: 'Ticket / Event',
  radio: 'Radio / Listening',
  care: 'Care / Support',
};

const PANEL =
  'bg-black/90 border border-white/15 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-md';

export function RightNowCreatePage({
  onNavigate,
  userCity,
  userCountry,
}: RightNowCreatePageProps) {
  const [intent, setIntent] = useState<RightNowIntent | null>('hookup');
  const [text, setText] = useState('');
  const [city, setCity] = useState(userCity ?? '');
  const [country, setCountry] = useState(userCountry ?? '');
  const [roomMode, setRoomMode] = useState<'solo' | 'host'>('solo');
  const [crowdCount, setCrowdCount] = useState(3);
  const [hostQrCode, setHostQrCode] = useState('');
  const [shareToTelegram, setShareToTelegram] = useState(true);
  const [showOnGlobe, setShowOnGlobe] = useState(true);
  const [acceptRules, setAcceptRules] = useState(false);
  const [allowAnonSignals, setAllowAnonSignals] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!intent) {
      setError('Choose what kind of signal you\'re sending.');
      return;
    }
    if (text.trim().length < 10) {
      setError('Say a little more so men know what you\'re about.');
      return;
    }
    if (!city.trim()) {
      setError('Add the city so we can place you on the map.');
      return;
    }
    if (!acceptRules) {
      setError('You must confirm the basic rules before posting.');
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        intent,
        text: text.trim(),
        city: city.trim(),
        country: country.trim() || null,
        room_mode: roomMode,
        crowd_count: roomMode === 'host' ? crowdCount : null,
        host_beacon_id: roomMode === 'host' && hostQrCode.trim() ? hostQrCode.trim() : null,
        expires_in_minutes: 60, // Default 1 hour expiry
        allow_anon_signals: allowAnonSignals,
      };

      // Wire to Supabase right-now-create Edge Function
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/right-now-create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Create failed (${res.status})`);
      }

      setSuccess(true);
      // Small pause then send back to RIGHT NOW feed
      setTimeout(() => {
        onNavigate('rightNowLivePage');
      }, 800);
    } catch (e: any) {
      console.error('RightNow create error', e);
      setError(e?.message ?? 'Could not create RIGHT NOW post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,23,68,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_140%,rgba(0,0,0,0.9),rgba(0,0,0,1))]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('rightNow')}
          className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.24em] text-white/60 hover:text-white/90"
        >
          <ChevronLeft className="w-4 h-4" />
          BACK
        </button>
        <div className="text-center flex-1">
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
            RIGHT NOW · NEW
          </div>
          <div className="text-xs text-white/60">Men-only, 18+. No minors, no hate, no outing.</div>
        </div>
        <div className="w-14" />
      </header>

      {/* Form container */}
      <main className="relative z-10 px-4 pb-6 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className={`${PANEL} w-full max-w-xl px-4 py-4 md:px-6 md:py-5`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-black">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-black tracking-tight">Drop a RIGHT NOW signal</h1>
              <p className="text-xs text-white/60">
                Say what you want, where you are, and how live it is. Expires in about an hour.
              </p>
            </div>
          </div>

          {/* INTENT */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-[0.26em] text-white/70">
                WHAT IS THIS?
              </label>
              <span className="text-[11px] text-white/50">Pick one.</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(['hookup', 'crowd', 'drop', 'ticket', 'radio', 'care'] as RightNowIntent[]).map(
                (key) => {
                  const active = intent === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setIntent(key)}
                      className={`flex flex-col items-start rounded-xl border px-3 py-2 text-left text-xs transition ${
                        active
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 bg-black/40 text-white/80 hover:border-white/50'
                      }`}
                    >
                      <span className="font-semibold text-[11px] uppercase tracking-[0.22em]">
                        {INTENT_LABELS[key].toUpperCase()}
                      </span>
                      <span className="mt-0.5 text-[11px] opacity-70">
                        {key === 'hookup' && 'Looking for something now.'}
                        {key === 'crowd' && 'You and others in the same room / party.'}
                        {key === 'drop' && 'Deals, offers, codes, free things.'}
                        {key === 'ticket' && 'Events starting soon or on sale.'}
                        {key === 'radio' && 'You\'re tuned in and want company.'}
                        {key === 'care' && 'You need softness, not chaos.'}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          {/* TEXT */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="rn-text"
                className="text-[11px] uppercase tracking-[0.26em] text-white/70"
              >
                SAY IT CLEAN, SAY IT CLEAR
              </label>
              <span className="text-[11px] text-white/50">
                {text.length}/240
              </span>
            </div>
            <textarea
              id="rn-text"
              maxLength={240}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you want, what's the energy, what do men need to know?"
              className="w-full rounded-xl bg-black/60 border border-white/20 px-3 py-2 text-sm min-h-[88px] resize-none focus:outline-none focus:border-white/70"
            />
            <p className="mt-1 text-[11px] text-white/45 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5" />
              Don&apos;t mention minors. Don&apos;t share anyone&apos;s full name, face, or work details without
              consent.
            </p>
          </section>

          {/* LOCATION */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-[0.26em] text-white/70">
                WHERE ARE YOU?
              </label>
              <span className="text-[11px] text-white/50">City level only.</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-white/50 absolute left-2 top-2.5" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full pl-7 pr-2 py-2 rounded-xl bg-black/60 border border-white/20 text-sm focus:outline-none focus:border-white/70"
                  />
                </div>
              </div>
              <div className="w-28">
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="w-full px-2 py-2 rounded-xl bg-black/60 border border-white/20 text-sm focus:outline-none focus:border-white/70"
                />
              </div>
            </div>
            <p className="mt-1 text-[11px] text-white/45">
              We never show your flat or door — just the rough city area and heat on the globe.
            </p>
          </section>

          {/* ROOM MODE / CROWD / QR */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-[0.26em] text-white/70">
                ARE YOU SOLO OR HOSTING?
              </label>
            </div>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setRoomMode('solo')}
                className={`flex-1 flex flex-col items-start rounded-xl border px-3 py-2 text-left text-xs transition ${
                  roomMode === 'solo'
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 bg-black/40 text-white/80 hover:border-white/50'
                }`}
              >
                <span className="font-semibold text-[11px] uppercase tracking-[0.22em]">
                  SOLO
                </span>
                <span className="mt-0.5 text-[11px] opacity-70">
                  Just you, or you and one other.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRoomMode('host')}
                className={`flex-1 flex flex-col items-start rounded-xl border px-3 py-2 text-left text-xs transition ${
                  roomMode === 'host'
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 bg-black/40 text-white/80 hover:border-white/50'
                }`}
              >
                <span className="font-semibold text-[11px] uppercase tracking-[0.22em]">
                  HOST / PARTY
                </span>
                <span className="mt-0.5 text-[11px] opacity-70">
                  You&apos;re anchoring a room, event, or afters.
                </span>
              </button>
            </div>

            {roomMode === 'host' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.26em] text-white/70">
                    HOW MANY MEN IN THE ROOM?
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-white/60" />
                    <input
                      type="range"
                      min={2}
                      max={50}
                      step={1}
                      value={crowdCount}
                      onChange={(e) => setCrowdCount(parseInt(e.target.value, 10))}
                      className="flex-1 accent-white"
                    />
                    <span className="w-10 text-right text-sm">{crowdCount}+</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/45">
                    Used for verified crowd heat. More scans of your host QR = stronger glow.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="host-qr"
                    className="text-[11px] uppercase tracking-[0.26em] text-white/70 flex items-center gap-1"
                  >
                    HOST QR / BEACON CODE (OPTIONAL)
                    <QrCode className="w-3 h-3" />
                  </label>
                  <input
                    id="host-qr"
                    type="text"
                    value={hostQrCode}
                    onChange={(e) => setHostQrCode(e.target.value)}
                    placeholder="Paste your host QR code or beacon code"
                    className="mt-1 w-full rounded-xl bg-black/60 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:border-white/70"
                  />
                  <p className="mt-1 text-[11px] text-white/45">
                    If this matches a live HOTMESS QR, we lock your heat to that exact party and
                    glow it on the globe.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* PRIVACY / HEAT / TELEGRAM */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-[0.26em] text-white/70">
                VISIBILITY
              </label>
            </div>
            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnGlobe}
                  onChange={(e) => setShowOnGlobe(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Show this as anonymous heat on the globe and city map.
                  <span className="block text-[11px] text-white/50">
                    Your text is not shown on the globe, only intensity and rough area.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareToTelegram}
                  onChange={(e) => setShareToTelegram(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Mirror this to linked HOTMESS Telegram rooms.
                  <span className="block text-[11px] text-white/50">
                    Only in rooms you&apos;ve joined and linked. Good for supergroups and parties.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowAnonSignals}
                  onChange={(e) => setAllowAnonSignals(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Let MESS BRAIN use this anonymously for safety & heat advice.
                  <span className="block text-[11px] text-white/50">
                    We strip identifiers. Used to warn other men when a room&apos;s vibe changes.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* CONSENT / RULES */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-[0.26em] text-white/70">
                BASIC RULES
              </label>
              <button
                type="button"
                onClick={() => onNavigate('legal')}
                className="text-[11px] text-white/50 hover:text-white/90 underline underline-offset-2"
              >
                VIEW FULL TERMS
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptRules}
                  onChange={(e) => setAcceptRules(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  I confirm I&apos;m a man, 18+, and I&apos;m not sharing anyone under 18 or without consent.
                  <span className="block text-[11px] text-white/50">
                    No minors, no hate, no doxxing, no non-consensual content.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* ERROR / SUCCESS */}
          {error && (
            <div className="mb-3 text-xs text-red-300 flex items-start gap-1">
              <ShieldAlert className="w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-3 text-xs text-green-300 flex items-start gap-1">
              <Zap className="w-4 h-4 mt-0.5" />
              <span>Signal sent. Dropping you back into RIGHT NOW…</span>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black text-[11px] uppercase tracking-[0.26em] px-3 py-2 hover:opacity-90 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {submitting ? 'SENDING…' : 'POST RIGHT NOW'}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onNavigate('hnhMess')}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 text-[11px] uppercase tracking-[0.24em] px-3 py-2 text-white/80 hover:border-white/70"
              >
                <HeartHandshake className="w-4 h-4" />
                HAND N HAND
              </button>
              <button
                type="button"
                onClick={() => onNavigate('map')}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 text-[11px] uppercase tracking-[0.24em] px-3 py-2 text-white/80 hover:border-white/70"
              >
                <Globe2 className="w-4 h-4" />
                VIEW GLOBE
              </button>
            </div>

            <p className="mt-1 text-[10px] text-white/45 flex items-start gap-1">
              <ShieldAlert className="w-3 h-3 mt-0.5" />
              We&apos;re not emergency services. If you feel unsafe or unwell, use Panic or call your
              local emergency number. Aftercare is information and support, not medical treatment.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}