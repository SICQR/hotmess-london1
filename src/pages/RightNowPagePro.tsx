/**
 * RIGHT NOW — Production-Ready Page
 * Live hookup/crowd feed with panic overlay + Mess Brain
 * Drop-in component with API hooks
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  MapPin,
  Radio,
  ShieldAlert,
  Globe2,
  HeartHandshake,
  X,
  Filter,
  Clock,
  MessageCircle,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type RightNowIntent = 'hookup' | 'crowd' | 'drop' | 'ticket' | 'radio' | 'care';

export interface RightNowPost {
  id: string;
  user_id: string;
  intent: RightNowIntent;
  text: string;
  city: string;
  country?: string;
  distance_km?: number;
  expires_at: string;
  created_at: string;
  beacon_id?: string | null;
  heat_score?: number;
  xp_reward?: number;
  safe_tags?: string[];
  verified_crowd_count?: number;
  membership_required?: 'free' | 'hnh' | 'sinner' | 'icon';
}

interface RightNowPageProps {
  onNavigate: (route: string) => void;
  // Optional: pass user city / location if you already have it
  userCity?: string;
}

const INTENT_LABELS: Record<RightNowIntent, string> = {
  hookup: 'HOOKUP',
  crowd: 'CROWD',
  drop: 'DROP',
  ticket: 'TICKET',
  radio: 'RADIO',
  care: 'CARE',
};

const INTENT_COLORS: Record<RightNowIntent, string> = {
  hookup: '#FF1744',
  crowd: '#FF6E40',
  drop: '#FF10F0',
  ticket: '#FFD600',
  radio: '#00E5FF',
  care: '#00C853',
};

const PANEL =
  'bg-black/90 border border-white/15 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-md';

// Utility
function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * RIGHT NOW MAIN PAGE
 */
export function RightNowPagePro({ onNavigate, userCity }: RightNowPageProps) {
  const [posts, setPosts] = useState<RightNowPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeIntent, setActiveIntent] = useState<RightNowIntent | 'all'>('all');
  const [radius, setRadius] = useState<'1' | '3' | 'city' | 'global'>('3');
  const [timeWindow, setTimeWindow] = useState<'now' | 'tonight' | 'weekend'>('now');

  const [selectedPost, setSelectedPost] = useState<RightNowPost | null>(null);
  const [showPanic, setShowPanic] = useState(false);
  const [showMessBrain, setShowMessBrain] = useState(false);

  // Basic fetch — plug this into your RIGHT NOW API
  useEffect(() => {
    let alive = true;
    const fetchPosts = async () => {
      try {
        setError(null);
        setLoading(true);

        // RIGHT NOW feed endpoint with window and filter params
        const params = new URLSearchParams();
        params.set('window', timeWindow === 'now' ? '1h' : timeWindow === 'tonight' ? '24h' : '24h');
        if (radius !== 'global' && userCity) {
          params.set('city', userCity);
        }

        const url = `https://${projectId}.supabase.co/functions/v1/right-now-feed?${params.toString()}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Feed error: ${res.status}`);
        }

        const json = await res.json();
        if (!alive) return;

        const items: RightNowPost[] = json.items ?? [];
        setPosts(items);
      } catch (e: any) {
        console.error('RIGHT NOW feed error', e);
        if (!alive) return;
        setError(e?.message ?? 'Could not load RIGHT NOW feed');
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchPosts();
    const t = window.setInterval(fetchPosts, 15000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, [radius, timeWindow, userCity]);

  const filteredPosts = useMemo(() => {
    let out = posts.slice();
    if (activeIntent !== 'all') {
      out = out.filter((p) => p.intent === activeIntent);
    }
    // Basic sort: highest heat, then soonest expiry
    out.sort((a, b) => {
      const ha = a.heat_score ?? 0;
      const hb = b.heat_score ?? 0;
      if (hb !== ha) return hb - ha;
      return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
    });
    return out;
  }, [posts, activeIntent]);

  const handleViewGlobe = useCallback(() => {
    onNavigate('map'); // or 'earth' depending on what you call the globe route
  }, [onNavigate]);

  const handleCreatePost = useCallback(() => {
    onNavigate('rightNowCreatePage'); // updated to match Router
  }, [onNavigate]);

  const handleCare = useCallback(() => {
    onNavigate('hnhMess'); // Hand N Hand hub
  }, [onNavigate]);

  if (loading && !posts.length && !error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className={`${PANEL} px-6 py-4`}>
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/70">
            RESOLVING RIGHT NOW…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background vignette */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,23,68,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_140%,rgba(0,0,0,0.9),rgba(0,0,0,1))]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-white/60">HOTMESS</div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">RIGHT NOW</h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-hotmess-red/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-hotmess-red animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-white/60">
            Live men. Live rooms. Live decisions. Men-only, 18+.
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 text-xs">
          <button
            onClick={handleViewGlobe}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] hover:border-white/60 transition"
          >
            <Globe2 className="w-3 h-3" />
            VIEW GLOBE HEAT
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="text-[10px] uppercase tracking-[0.24em] text-white/40 hover:text-white/70"
          >
            HOME
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="relative z-10 px-4 pb-2">
        <div className={`${PANEL} px-3 py-3`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(['all', 'hookup', 'crowd', 'drop', 'ticket', 'radio', 'care'] as const).map(
                (intent) => {
                  const isAll = intent === 'all';
                  const active = activeIntent === intent;
                  const label = isAll ? 'ALL SIGNALS' : INTENT_LABELS[intent as RightNowIntent];
                  const color = !isAll
                    ? INTENT_COLORS[intent as RightNowIntent]
                    : 'rgba(255,255,255,0.9)';
                  return (
                    <button
                      key={intent}
                      type="button"
                      onClick={() =>
                        setActiveIntent(intent === 'all' ? 'all' : (intent as RightNowIntent))
                      }
                      className={`px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.22em] transition ${
                        active ? 'bg-white text-black border-white' : 'border-white/25 text-white/80'
                      }`}
                      style={
                        active && !isAll
                          ? { boxShadow: `0 0 18px ${color}55` }
                          : undefined
                      }
                    >
                      {label}
                    </button>
                  );
                }
              )}
            </div>

            <div className="flex flex-wrap gap-2 items-center text-[10px] uppercase tracking-[0.2em]">
              <div className="flex gap-1">
                {(['1', '3', 'city', 'global'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    className={`px-2.5 py-1 rounded-full border transition ${
                      radius === r
                        ? 'border-white bg-white text-black'
                        : 'border-white/25 text-white/70'
                    }`}
                  >
                    {r === '1'
                      ? '1KM'
                      : r === '3'
                      ? '3KM'
                      : r === 'city'
                      ? 'CITY'
                      : 'GLOBAL'}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {(['now', 'tonight', 'weekend'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeWindow(t)}
                    className={`px-2.5 py-1 rounded-full border transition ${
                      timeWindow === t
                        ? 'border-white bg-white text-black'
                        : 'border-white/25 text-white/70'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 border border-white/25 rounded-full px-2.5 py-1 text-[10px] text-white/70 hover:border-white/60"
              >
                <Filter className="w-3 h-3" />
                MORE
              </button>
            </div>
          </div>

          {userCity && (
            <div className="mt-2 text-[11px] text-white/50">
              PULSES NEAR <span className="font-semibold text-white/80">{userCity}</span>
            </div>
          )}
        </div>
      </section>

      {/* Feed */}
      <main className="relative z-10 px-4 pb-28 md:pb-20">
        {error && (
          <div className={`${PANEL} px-4 py-3 mb-3 text-sm text-red-300 flex items-center gap-2`}>
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {filteredPosts.length === 0 && !loading && !error && (
          <div className={`${PANEL} px-4 py-6 text-center text-sm text-white/60`}>
            No pulses in this window yet. Be the first to light it up.
          </div>
        )}

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredPosts.map((post) => (
              <RightNowCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
                onViewGlobe={handleViewGlobe}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Dock */}
      <footer className="fixed left-0 right-0 bottom-0 z-20 px-3 pb-3 pt-2">
        <div className={`${PANEL} px-3 py-2 flex items-center justify-between gap-2`}>
          <button
            type="button"
            onClick={handleCare}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-white/20 text-[10px] uppercase tracking-[0.22em] text-white/80 hover:border-white/60"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            CARE
          </button>

          <button
            type="button"
            onClick={handleViewGlobe}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-white/20 text-[10px] uppercase tracking-[0.22em] text-white/80 hover:border-white/60"
          >
            <Globe2 className="w-3.5 h-3.5" />
            GLOBE
          </button>

          <button
            type="button"
            onClick={handleCreatePost}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white text-black text-[11px] font-semibold uppercase tracking-[0.26em] px-3 py-2 hover:opacity-90"
          >
            <Zap className="w-4 h-4" />
            POST RIGHT NOW
          </button>

          <button
            type="button"
            onClick={() => setShowMessBrain((v) => !v)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-white/20 text-[10px] uppercase tracking-[0.22em] text-white/80 hover:border-white/60"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            MESS BRAIN
          </button>

          <button
            type="button"
            onClick={() => setShowPanic(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-red-500 text-[10px] uppercase tracking-[0.22em] text-red-400 hover:bg-red-600/20"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            PANIC
          </button>
        </div>
      </footer>

      {/* Post detail (simple sheet) */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-0 bottom-0 z-30 px-3 pb-5"
          >
            <div className={`${PANEL} px-4 py-4 max-h-[70vh] overflow-y-auto`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] tracking-[0.32em] uppercase text-white/60 mb-1">
                    RIGHT NOW · {INTENT_LABELS[selectedPost.intent]}
                  </div>
                  <p className="text-sm md:text-base leading-relaxed">{selectedPost.text}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/60">
                    {selectedPost.city && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedPost.city}
                      </span>
                    )}
                    {selectedPost.distance_km != null && (
                      <span>{selectedPost.distance_km.toFixed(1)}km away</span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      EXPIRES SOON
                    </span>
                    {selectedPost.verified_crowd_count && selectedPost.verified_crowd_count > 1 && (
                      <span>{selectedPost.verified_crowd_count} men verified in this room</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="text-white/50 hover:text-white/90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!selectedPost) return;
                    try {
                      const res = await fetch(
                        `https://${projectId}.supabase.co/functions/v1/right-now-reply`,
                        {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            post_id: selectedPost.id,
                            sender_user_id: 'anon_' + Date.now(),
                            message: 'Interested in connecting'
                          }),
                        }
                      );
                      if (res.ok) {
                        const json = await res.json();
                        if (json.telegram_link) {
                          window.open(json.telegram_link, '_blank');
                        }
                      } else {
                        // Fallback: open generic Telegram link
                        window.open('https://t.me/hotmess_bot?start=rightnow', '_blank');
                      }
                    } catch (e) {
                      console.error('Reply error', e);
                      // Fallback
                      window.open('https://t.me/hotmess_bot?start=rightnow', '_blank');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black text-[11px] uppercase tracking-[0.26em] px-3 py-2"
                >
                  REPLY / OPEN ROOM
                </button>
                <button
                  type="button"
                  onClick={handleViewGlobe}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 text-[11px] uppercase tracking-[0.24em] px-3 py-2 text-white/80 hover:border-white/60"
                >
                  <Globe2 className="w-4 h-4" />
                  VIEW THIS HEAT ON GLOBE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panic overlay */}
      <PanicOverlay open={showPanic} onClose={() => setShowPanic(false)} onCare={handleCare} />

      {/* Mess Brain */}
      <MessBrainChat open={showMessBrain} onClose={() => setShowMessBrain(false)} />
    </div>
  );
}

/**
 * RIGHT NOW CARD
 */
interface RightNowCardProps {
  post: RightNowPost;
  onClick: () => void;
  onViewGlobe: () => void;
}

function RightNowCard({ post, onClick, onViewGlobe }: RightNowCardProps) {
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const ms = new Date(post.expires_at).getTime() - Date.now();
      setCountdown(formatCountdown(ms));
    };
    update();
    const t = window.setInterval(update, 1000);
    return () => window.clearInterval(t);
  }, [post.expires_at]);

  const color = INTENT_COLORS[post.intent];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="w-full text-left"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/70 px-3 py-3 hover:border-white/40 transition group"
        style={{
          boxShadow: post.heat_score
            ? `0 0 40px rgba(255,23,68,${Math.min(
                0.25,
                (post.heat_score ?? 1) / 100
              )})`
            : undefined,
        }}
      >
        <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-hotmess-red/5 blur-2xl" />
        <div className="flex justify-between items-start gap-3 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.26em]"
                style={{
                  borderColor: color,
                  color,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {INTENT_LABELS[post.intent]}
              </span>
              {post.verified_crowd_count && post.verified_crowd_count > 1 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] text-white/70">
                  <UsersDot />
                  CROWD VERIFIED
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed line-clamp-3">{post.text}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/60">
              {post.city && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.city}
                </span>
              )}
              {post.distance_km != null && (
                <span>{post.distance_km.toFixed(1)}km away</span>
              )}
              {countdown && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {countdown}
                </span>
              )}
              {post.xp_reward && (
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-300" />
                  +{post.xp_reward} XP
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewGlobe();
            }}
            className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/20 w-8 h-8 text-white/70 hover:border-white/70"
          >
            <Globe2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.button>
  );
}

function UsersDot() {
  return (
    <span className="relative w-3 h-3">
      <span className="absolute inset-0 rounded-full bg-white/40" />
      <span className="absolute inset-[2px] rounded-full bg-black" />
    </span>
  );
}

/**
 * PANIC OVERLAY
 */
interface PanicOverlayProps {
  open: boolean;
  onClose: () => void;
  onCare: () => void;
}

export function PanicOverlay({ open, onClose, onCare }: PanicOverlayProps) {
  const [selection, setSelection] = useState<'unsafe' | 'overwhelmed' | 'talk' | null>(null);

  useEffect(() => {
    if (!open) setSelection(null);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={`${PANEL} max-w-lg w-full px-5 py-5 relative`}>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-white/50 hover:text-white/90"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-red-700/30">
                <span className="absolute inset-0 rounded-full border border-red-500/60 animate-ping" />
                <ShieldAlert className="w-5 h-5 text-red-400 relative" />
              </span>
              <div>
                <div className="text-[11px] tracking-[0.32em] uppercase text-red-300">
                  HAND N HAND · PANIC
                </div>
                <div className="text-lg font-semibold">We&apos;ve got the room.</div>
              </div>
            </div>

            <p className="text-sm text-white/70 mb-3">
              You&apos;re in a men-only, 18+ nightlife space. We&apos;re not emergency services. If you&apos;re in
              danger, call your local emergency number. We help you think, breathe, and get home.
            </p>

            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => setSelection('unsafe')}
                className={`w-full text-left px-3 py-2 rounded-xl border text-sm flex items-start gap-2 ${
                  selection === 'unsafe'
                    ? 'border-red-400 bg-red-600/20'
                    : 'border-white/20 bg-black/40 hover:border-red-400/60'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-red-300 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">I feel unsafe and want out.</div>
                  <div className="text-xs text-white/70">
                    We log this anonymously and help you plan a way out.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelection('overwhelmed')}
                className={`w-full text-left px-3 py-2 rounded-xl border text-sm flex items-start gap-2 ${
                  selection === 'overwhelmed'
                    ? 'border-red-400 bg-red-600/20'
                    : 'border-white/20 bg-black/40 hover:border-red-400/60'
                }`}
              >
                <Radio className="w-4 h-4 text-red-300 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">I&apos;m spun out / overwhelmed.</div>
                  <div className="text-xs text-white/70">
                    Maybe substances, maybe vibes. We&apos;ll help you calm down.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelection('talk')}
                className={`w-full text-left px-3 py-2 rounded-xl border text-sm flex items-start gap-2 ${
                  selection === 'talk'
                    ? 'border-red-400 bg-red-600/20'
                    : 'border-white/20 bg-black/40 hover:border-red-400/60'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-red-300 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">I just need to talk.</div>
                  <div className="text-xs text-white/70">
                    You don&apos;t have to explain it perfectly. Just start.
                  </div>
                </div>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onCare}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black text-[11px] uppercase tracking-[0.26em] px-3 py-2"
              >
                <HeartHandshake className="w-4 h-4" />
                MESSAGE HAND N HAND
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `https://${projectId}.supabase.co/functions/v1/panic-alert`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          user_id: 'anon_' + Date.now(),
                          situation: selection || 'talk',
                          location_city: 'Unknown',
                          additional_notes: 'User requested emergency contact from panic overlay'
                        }),
                      }
                    );
                    
                    if (res.ok) {
                      const json = await res.json();
                      const contact = json.emergency_contacts?.[1]; // LGBT+ Switchboard
                      if (contact) {
                        window.location.href = `sms:${contact.number}?body=I need support. I'm using HOTMESS and need someone to talk to.`;
                      }
                    } else {
                      // Fallback: open SMS to LGBT+ Switchboard directly
                      window.location.href = `sms:03003300630?body=I need support. I'm using HOTMESS and need someone to talk to.`;
                    }
                  } catch (e) {
                    console.error('Contact error', e);
                    // Fallback
                    window.location.href = `sms:03003300630?body=I need support.`;
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 text-[11px] uppercase tracking-[0.24em] px-3 py-2 text-white/80 hover:border-white/60"
              >
                <ArrowUpRight className="w-4 h-4" />
                TEXT A TRUSTED CONTACT
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-[11px] uppercase tracking-[0.24em] text-white/50 hover:text-white/80 mt-1"
              >
                I&apos;M OK, STAY IN NIGHT MODE
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * MESS BRAIN AI CHAT
 */
interface MessBrainChatProps {
  open: boolean;
  onClose: () => void;
}

interface MessBrainMessage {
  id: string;
  from: 'user' | 'ai';
  text: string;
  created_at: string;
}

export function MessBrainChat({ open, onClose }: MessBrainChatProps) {
  const [messages, setMessages] = useState<MessBrainMessage[]>([
    {
      id: 'seed',
      from: 'ai',
      text: 'Ask me where the heat really is, where it\'s safest to land solo, or which room to avoid.',
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    const userMsg: MessBrainMessage = {
      id: `u_${Date.now()}`,
      from: 'user',
      text: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      // Call hotmess-concierge Edge Function
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/hotmess-concierge`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: trimmed,
            city: 'London', // TODO: get from user context
            xpTier: 'fresh', // TODO: get from user profile
            membership: 'free' // TODO: get from user memberships
          }),
        }
      );

      let reply = "I'm watching the heat and safety signals. Give me a second look around.";
      if (res.ok) {
        const json = await res.json();
        if (json.reply) reply = json.reply;
      }

      const aiMsg: MessBrainMessage = {
        id: `ai_${Date.now()}`,
        from: 'ai',
        text: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error('Mess Brain error', e);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          from: 'ai',
          text: 'Lost signal. Try again in a second.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
        >
          <div className={`${PANEL} max-w-lg mx-auto px-4 py-3`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
                  MESS BRAIN
                </div>
                <div className="text-xs text-white/70">Gay city intelligence with receipts.</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-white/50 hover:text-white/90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-2 text-[10px] text-white/50">
              We use anonymous heat, panic and venue data. We&apos;re not medical or emergency services.
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 mb-2 text-sm">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[80%] ${
                      m.from === 'user'
                        ? 'bg-white text-black rounded-br-none'
                        : 'bg-white/10 text-white rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl bg-white/10 text-xs text-white/70">
                    Reading the room…
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask where the heat and safety really sit…"
                className="flex-1 bg-black/60 border border-white/20 rounded-full px-3 py-2 text-xs focus:outline-none focus:border-white/60"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="inline-flex items-center justify-center rounded-full bg-white text-black w-8 h-8 hover:opacity-90 disabled:opacity-50"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}