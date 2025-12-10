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
import { MapboxGlobe } from '@/components/globe/MapboxGlobe';
import { 
  Zap, 
  MapPin, 
  Clock, 
  Shield, 
  Flame, 
  Trash2, 
  Plus, 
  X,
  Users,
  Droplet,
  Heart,
  Globe2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const MODE_CONFIG = {
  hookup: { 
    icon: Zap, 
    label: 'HOOKUP', 
    color: '#FF1744',
    description: 'Looking for connections right now'
  },
  crowd: { 
    icon: Users, 
    label: 'CROWD', 
    color: '#00E5FF',
    description: 'Report the scene, the vibe, the energy'
  },
  drop: { 
    icon: Droplet, 
    label: 'DROP', 
    color: '#FF10F0',
    description: 'Exclusive intel, what\'s happening'
  },
  care: { 
    icon: Heart, 
    label: 'CARE', 
    color: '#7C4DFF',
    description: 'Check-ins, aftercare, support'
  },
};

export default function RightNowLivePage() {
  const [posts, setPosts] = useState<RightNowPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<'split' | 'globe' | 'feed'>('split');
  const [feedCollapsed, setFeedCollapsed] = useState(false);

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

  // Load feed
  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRightNowFeed({
        mode: selectedMode === 'all' ? undefined : selectedMode,
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

  // Subscribe to realtime (gracefully handles no auth)
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
          // Silently skip geolocation if blocked (expected in iframe)
          if (geoError?.code !== 1) {
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

      setHeadline('');
      setText('');
      setConsent(false);
      setComposerOpen(false);
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
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h`;
  };

  // Map posts to beacons for globe
  const beacons = posts
    .filter(p => p.lat && p.lng)
    .map(p => ({
      id: p.id,
      code: p.id,
      type: p.mode === 'hookup' ? 'checkin' : p.mode === 'drop' ? 'drop' : 'event',
      title: p.headline,
      city: p.city,
      lat: p.lat!,
      lng: p.lng!,
    }));

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Globe Background */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        viewMode === 'feed' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <MapboxGlobe
          timeWindow="tonight"
          beacons={beacons}
          showBeacons={true}
          showHeat={true}
          useLiveData={false}
          onBeaconClick={(id) => {
            const el = document.querySelector(`[data-post-id="${id}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
      </div>

      {/* Background glow when in feed-only mode */}
      {viewMode === 'feed' && (
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_120%,rgba(255,23,68,0.22),transparent_60%)]" />
        </div>
      )}

      {/* Header Badge */}
      <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/90 px-6 py-2 backdrop-blur-xl">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#FF1744]" />
          <span className="text-[11px] font-black uppercase tracking-[0.32em] text-white">
            RIGHT NOW · LIVE CITY PULSE
          </span>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="absolute right-4 top-4 z-30">
        <div className="flex gap-2 rounded-xl border border-white/20 bg-black/90 p-1 backdrop-blur-xl">
          <button
            onClick={() => setViewMode('globe')}
            className={`rounded-lg px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
              viewMode === 'globe'
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Globe2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`rounded-lg px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
              viewMode === 'split'
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            SPLIT
          </button>
          <button
            onClick={() => setViewMode('feed')}
            className={`rounded-lg px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
              viewMode === 'feed'
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            FEED
          </button>
        </div>
      </div>

      {/* Live Stats Badge */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="rounded-full border border-white/15 bg-black/85 px-3 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Globe2 className="h-3 w-3 text-[#00E5FF]" />
            <span className="text-[9px] uppercase tracking-[0.26em] text-white/60">
              {posts.length} LIVE · {beacons.length} ON GLOBE
            </span>
          </div>
        </div>
      </div>

      {/* Feed Panel */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-500 ${
        viewMode === 'globe' ? 'translate-y-full' : 
        viewMode === 'feed' ? 'h-full' : 
        feedCollapsed ? 'h-16' : 'h-[60vh]'
      }`}>
        <div className="relative h-full">
          {/* Feed Container */}
          <div className="h-full overflow-hidden rounded-t-3xl border-t border-white/20 bg-black/95 backdrop-blur-2xl">
            {/* Feed Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase tracking-[0.24em]">
                  LIVE FEED
                </h2>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {posts.length} posts
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Collapse toggle (only in split mode) */}
                {viewMode === 'split' && (
                  <button
                    onClick={() => setFeedCollapsed(!feedCollapsed)}
                    className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    {feedCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}

                {/* New Post Button */}
                {!composerOpen && (
                  <button
                    onClick={() => setComposerOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#FF1744] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] transition hover:bg-white hover:text-black"
                  >
                    <Plus className="h-3 w-3" />
                    DROP
                  </button>
                )}
              </div>
            </div>

            {!feedCollapsed && (
              <>
                {/* Filters */}
                <div className="border-b border-white/10 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedMode('all')}
                      className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition ${
                        selectedMode === 'all'
                          ? 'bg-white text-black'
                          : 'border border-white/30 hover:border-white'
                      }`}
                    >
                      All
                    </button>
                    {(Object.keys(MODE_CONFIG) as RightNowMode[]).map((m) => {
                      const config = MODE_CONFIG[m];
                      const Icon = config.icon;
                      return (
                        <button
                          key={m}
                          onClick={() => setSelectedMode(m)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition ${
                            selectedMode === m
                              ? 'text-white'
                              : 'border border-white/30 hover:border-white'
                          }`}
                          style={selectedMode === m ? { 
                            backgroundColor: config.color,
                            borderColor: config.color 
                          } : {}}
                        >
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Filter by city..."
                      className="flex-1 rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-sm outline-none focus:border-white/40"
                    />
                    <label className="flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
                      <input
                        type="checkbox"
                        checked={safeOnly}
                        onChange={(e) => setSafeOnly(e.target.checked)}
                        className="h-3 w-3"
                      />
                      Safe Only
                    </label>
                  </div>
                </div>

                {/* Composer */}
                {composerOpen && (
                  <div className="border-b border-white/10 bg-black/80 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-white/80">
                        New Signal
                      </h3>
                      <button
                        onClick={() => {
                          setComposerOpen(false);
                          setHeadline('');
                          setText('');
                          setConsent(false);
                          setError(null);
                        }}
                        className="text-white/50 transition hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Mode selector */}
                    <div className="mb-3 flex gap-2">
                      {(Object.keys(MODE_CONFIG) as RightNowMode[]).map((m) => {
                        const config = MODE_CONFIG[m];
                        const Icon = config.icon;
                        return (
                          <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[10px] uppercase transition ${
                              mode === m
                                ? 'text-white'
                                : 'bg-white/10 hover:bg-white/20'
                            }`}
                            style={mode === m ? { backgroundColor: config.color } : {}}
                          >
                            <Icon className="h-3 w-3" />
                            {config.label}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder={`Quick headline (e.g. "${MODE_CONFIG[mode].description}")`}
                      maxLength={120}
                      className="mb-2 w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 text-sm outline-none focus:border-white"
                    />

                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Details (optional)"
                      rows={2}
                      maxLength={500}
                      className="mb-3 w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 text-sm outline-none focus:border-white"
                    />

                    <label className="mb-3 flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-3 w-3"
                      />
                      <span className="text-[10px] leading-relaxed text-white/60">
                        I&apos;m posting for men 18+, this is consensual, and I understand aftercare info is not medical advice.
                      </span>
                    </label>

                    {error && (
                      <div className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handlePost}
                      disabled={!headline.trim() || !consent || posting}
                      className="w-full rounded-xl bg-[#FF1744] px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black disabled:opacity-30"
                    >
                      {posting ? 'Dropping...' : 'Drop it Right Now'}
                    </button>
                  </div>
                )}

                {/* Feed List */}
                <div className="h-[calc(100%-240px)] overflow-y-auto p-4">
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
                    <div className="space-y-3">
                      {posts.map((post) => {
                        const config = MODE_CONFIG[post.mode];
                        const Icon = config.icon;
                        return (
                          <div
                            key={post.id}
                            data-post-id={post.id}
                            className="group rounded-xl border border-white/15 bg-black/60 p-4 transition hover:border-white/30"
                          >
                            {/* Header */}
                            <div className="mb-2 flex items-start justify-between">
                              <div className="flex flex-wrap items-center gap-2">
                                <span 
                                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em]"
                                  style={{ 
                                    backgroundColor: `${config.color}20`,
                                    color: config.color 
                                  }}
                                >
                                  <Icon className="h-3 w-3" />
                                  {config.label}
                                </span>
                                {post.membership_tier !== 'free' && (
                                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase">
                                    {post.membership_tier}
                                  </span>
                                )}
                                {post.near_party && (
                                  <span className="flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-[10px] text-orange-200">
                                    <Flame className="h-3 w-3" />
                                    Near party
                                  </span>
                                )}
                                {post.safety_flags?.includes('verified_host') && (
                                  <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-[10px] text-green-200">
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
                            <h3 className="mb-1 text-base">{post.headline}</h3>
                            {post.body && (
                              <p className="mb-3 text-sm text-white/70">{post.body}</p>
                            )}

                            {/* Footer */}
                            <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/50">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {post.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getTimeRemaining(post.expires_at)}
                              </span>
                              <span>Heat: {Math.round(post.score)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}