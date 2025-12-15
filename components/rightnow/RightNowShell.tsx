'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  fetchRightNowFeed, 
  createRightNowPost, 
  deleteRightNowPost,
  type RightNowPost,
  type RightNowMode 
} from '@/lib/rightNowClient';
import { useRightNowRealtime } from '@/lib/useRightNowRealtime';
import { Zap, MapPin, Clock, Shield, Flame, Trash2, Plus, Radio as RadioIcon } from 'lucide-react';
import { PanicButton } from './PanicButton';
import { PanicOverlay } from './PanicOverlay';

export function RightNowShell() {
  const [posts, setPosts] = useState<RightNowPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedMode, setSelectedMode] = useState<RightNowMode | 'all'>('all');
  const [safeOnly, setSafeOnly] = useState(false);
  const [city, setCity] = useState('London');

  // Composer
  const [composerOpen, setComposerOpen] = useState(false);
  const [mode, setMode] = useState<RightNowMode>('hookup');
  const [headline, setHeadline] = useState('');
  const [text, setText] = useState('');
  const [consent, setConsent] = useState(false);

  // Panic
  const [panicActive, setPanicActive] = useState(false);

  // Load feed
  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRightNowFeed({
        mode: selectedMode,
        city,
        safeOnly,
      });
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMode, city, safeOnly]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Realtime callbacks
  const handleInsert = useCallback((post: RightNowPost) => {
    setPosts(prev => [post, ...prev]);
  }, []);

  const handleUpdate = useCallback((post: RightNowPost) => {
    setPosts(prev => prev.map(p => p.id === post.id ? post : p));
  }, []);

  const handleDelete = useCallback((postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  // Subscribe to realtime
  useRightNowRealtime({
    city,
    onInsert: handleInsert,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  });

  // Create post
  const handlePost = async () => {
    if (!headline.trim() || !consent) return;

    try {
      setPosting(true);
      setError(null);

      // Get browser location (optional)
      let lat: number | undefined;
      let lng: number | undefined;

      if ('geolocation' in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 60000,
            });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch (geoError: any) {
          // Geolocation blocked in iframe - this is expected, just skip location
          if (geoError?.code === 1) {
            console.log('📍 Location access not available (iframe restriction). Posting without location.');
          } else {
            console.warn('Geolocation failed:', geoError);
          }
        }
      }

      await createRightNowPost({
        mode,
        headline: headline.trim(),
        text: text.trim() || undefined,
        lat,
        lng,
      });

      // Reset form
      setHeadline('');
      setText('');
      setConsent(false);
      setComposerOpen(false);

      // Reload feed (realtime will also add it, but this ensures sync)
      loadFeed();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    try {
      await deleteRightNowPost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err: any) {
      console.error('Delete failed:', err);
    }
  };

  // Time remaining
  const getTimeRemaining = (expiresAt: string) => {
    const ms = new Date(expiresAt).getTime() - Date.now();
    const minutes = Math.floor(ms / 60000);
    if (minutes < 1) return 'Expiring...';
    if (minutes < 60) return `${minutes}m left`;
    return `${Math.floor(minutes / 60)}h left`;
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_120%,rgba(255,23,68,0.22),transparent_60%)]" />
        </div>

        <main className="relative z-10 mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <RadioIcon className="h-6 w-6 animate-pulse text-hotmess-red" />
              <span className="text-xs uppercase tracking-[0.2em] text-hotmess-red">
                LIVE NOW
              </span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight">
              RIGHT NOW
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/60">
              Live nightlife signals • {city}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedMode('all')}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                selectedMode === 'all'
                  ? 'bg-white text-black'
                  : 'border border-white/30 hover:border-white'
              }`}
            >
              All
            </button>
            {(['hookup', 'crowd', 'drop', 'care'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                  selectedMode === m
                    ? 'bg-hotmess-red text-white'
                    : 'border border-white/30 hover:border-white'
                }`}
              >
                {m}
              </button>
            ))}

            <div className="ml-auto">
              <label className="flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={safeOnly}
                  onChange={(e) => setSafeOnly(e.target.checked)}
                  className="h-4 w-4"
                />
                Safe / Verified only
              </label>
            </div>
          </div>

          {/* Composer */}
          {!composerOpen ? (
            <button
              onClick={() => setComposerOpen(true)}
              className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/30 p-6 transition hover:border-white"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.18em]">
                Drop Something Right Now
              </span>
            </button>
          ) : (
            <div className="mb-6 rounded-2xl border border-white/20 bg-black/60 p-6">
              <h2 className="mb-4 text-sm uppercase tracking-[0.18em]">
                New Signal
              </h2>

              <div className="mb-4 flex gap-2">
                {(['hookup', 'crowd', 'drop', 'care'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs uppercase transition ${
                      mode === m
                        ? 'bg-hotmess-red text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Quick headline (e.g. 'Solo in Shoreditch, looking for dark energy')"
                maxLength={120}
                className="mb-3 w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 outline-none focus:border-white"
              />

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Details (optional)"
                rows={3}
                maxLength={500}
                className="mb-4 w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 outline-none focus:border-white"
              />

              <label className="mb-4 flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span className="text-xs text-white/70">
                  I&apos;m posting for men 18+, this is consensual, and I understand
                  aftercare info is not medical advice.
                </span>
              </label>

              {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setComposerOpen(false);
                    setHeadline('');
                    setText('');
                    setConsent(false);
                    setError(null);
                  }}
                  className="flex-1 rounded-xl border border-white/30 px-6 py-3 text-sm uppercase tracking-[0.18em] transition hover:border-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePost}
                  disabled={!headline.trim() || !consent || posting}
                  className="flex-1 rounded-xl bg-hotmess-red px-6 py-3 text-sm uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:opacity-30"
                >
                  {posting ? 'Posting...' : 'Drop it Right Now'}
                </button>
              </div>
            </div>
          )}

          {/* Feed */}
          {loading && posts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-white/15 bg-black/60 p-12 text-center">
              <Zap className="mx-auto mb-4 h-12 w-12 text-white/30" />
              <p className="text-sm text-white/60">
                No signals right now in {city}.
                <br />
                Be the first to drop something.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group rounded-2xl border border-white/15 bg-black/60 p-6 transition hover:border-white/30"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-hotmess-red/20 px-3 py-1 text-xs uppercase tracking-[0.16em] text-hotmess-red">
                        {post.mode}
                      </span>
                      {post.membership_tier !== 'free' && (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase">
                          {post.membership_tier}
                        </span>
                      )}
                      {post.near_party && (
                        <span className="flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-200">
                          <Flame className="h-3 w-3" />
                          Near live party
                        </span>
                      )}
                      {post.safety_flags.includes('verified_host') && (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-200">
                          <Shield className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg">{post.headline}</h3>
                  {post.body && (
                    <p className="mb-3 text-sm text-white/70">{post.body}</p>
                  )}

                  {/* Footer */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {post.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(post.expires_at)}
                    </span>
                    <span>Score: {Math.round(post.score)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Panic Button */}
        <PanicButton onTrigger={() => setPanicActive(true)} />
      </div>

      {/* Panic Overlay */}
      {panicActive && (
        <PanicOverlay onClose={() => setPanicActive(false)} />
      )}
    </>
  );
}