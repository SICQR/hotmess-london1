'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapboxGlobe } from '../components/globe/MapboxGlobe';
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
  ChevronDown,
  Send,
  Filter,
  Target
} from 'lucide-react';

// Mock data structure matching RightNowPost
interface MockPost {
  id: string;
  mode: 'hookup' | 'crowd' | 'drop' | 'care';
  headline: string;
  body?: string;
  city: string;
  lat?: number;
  lng?: number;
  expires_at: string;
  score: number;
  membership_tier: 'free' | 'raw' | 'hung' | 'super';
  near_party: boolean;
  safety_flags: string[];
  created_at: string;
}

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

// Demo data
const DEMO_POSTS: MockPost[] = [
  {
    id: '1',
    mode: 'hookup',
    headline: 'Solo in Shoreditch, looking for dark energy',
    body: '30, masc, into leather. Hit me up if you\'re nearby.',
    city: 'London',
    lat: 51.5266,
    lng: -0.0786,
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    score: 87,
    membership_tier: 'hung',
    near_party: true,
    safety_flags: ['verified_host'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    mode: 'crowd',
    headline: 'Heaven is PACKED tonight',
    body: 'Line around the block, DJ is killing it, crowd is 🔥',
    city: 'London',
    lat: 51.5081,
    lng: -0.1206,
    expires_at: new Date(Date.now() + 7200000).toISOString(),
    score: 142,
    membership_tier: 'super',
    near_party: true,
    safety_flags: ['crowd_verified'],
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: '3',
    mode: 'drop',
    headline: 'Secret warehouse party in E2',
    body: 'DM for location. £10 entry. Bring ID.',
    city: 'London',
    lat: 51.5308,
    lng: -0.0550,
    expires_at: new Date(Date.now() + 5400000).toISOString(),
    score: 203,
    membership_tier: 'super',
    near_party: false,
    safety_flags: [],
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '4',
    mode: 'care',
    headline: 'Safe space check-in',
    body: 'Anyone need water, charging station, or just somewhere to decompress? We got you at the back bar.',
    city: 'London',
    lat: 51.5145,
    lng: -0.1270,
    expires_at: new Date(Date.now() + 10800000).toISOString(),
    score: 64,
    membership_tier: 'raw',
    near_party: true,
    safety_flags: ['verified_host', 'care_certified'],
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '5',
    mode: 'hookup',
    headline: 'Vauxhall vibes - looking for now',
    body: 'At RVT, verse, DDF, can host',
    city: 'London',
    lat: 51.4862,
    lng: -0.1235,
    expires_at: new Date(Date.now() + 1800000).toISOString(),
    score: 91,
    membership_tier: 'hung',
    near_party: true,
    safety_flags: [],
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
];

export default function RightNowLiveDemo() {
  const [posts, setPosts] = useState<MockPost[]>(DEMO_POSTS);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<'split' | 'globe' | 'feed'>('split');
  const [feedCollapsed, setFeedCollapsed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [selectedMode, setSelectedMode] = useState<'hookup' | 'crowd' | 'drop' | 'care' | 'all'>('all');
  const [safeOnly, setSafeOnly] = useState(false);
  const [city, setCity] = useState('London');

  // Composer
  const [composerOpen, setComposerOpen] = useState(false);
  const [mode, setMode] = useState<'hookup' | 'crowd' | 'drop' | 'care'>('hookup');
  const [headline, setHeadline] = useState('');
  const [text, setText] = useState('');
  const [consent, setConsent] = useState(false);

  // NOTE: No realtime hook for demo - this uses mock data only
  // Real implementation would use: useRightNowRealtime({ city, onInsert, onUpdate, onDelete })

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (selectedMode !== 'all' && post.mode !== selectedMode) return false;
    if (city && post.city !== city) return false;
    if (safeOnly && post.safety_flags.length === 0) return false;
    return true;
  });

  // Create post (demo - just adds to local state)
  const handlePost = async () => {
    if (!headline.trim() || !consent) return;

    try {
      setPosting(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newPost: MockPost = {
        id: Date.now().toString(),
        mode,
        headline: headline.trim(),
        body: text.trim() || undefined,
        city: 'London',
        lat: 51.5074 + (Math.random() - 0.5) * 0.1,
        lng: -0.1278 + (Math.random() - 0.5) * 0.1,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        score: Math.floor(Math.random() * 100) + 50,
        membership_tier: 'hung',
        near_party: Math.random() > 0.5,
        safety_flags: Math.random() > 0.5 ? ['verified_host'] : [],
        created_at: new Date().toISOString(),
      };

      setPosts(prev => [newPost, ...prev]);
      setHeadline('');
      setText('');
      setConsent(false);
      setComposerOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  // Delete post
  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
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
  const beacons = filteredPosts
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
            if (el) {
              setFeedCollapsed(false);
              setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }
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
      <div className="absolute left-1/2 top-6 z-30 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/90 px-8 py-3 backdrop-blur-xl">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FF1744]" />
          <span className="text-[13px] font-black uppercase tracking-[0.32em] text-white">
            RIGHT NOW
          </span>
          <span className="text-[11px] uppercase tracking-[0.28em] text-white/50">
            LIVE CITY PULSE
          </span>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="absolute right-6 top-6 z-30">
        <div className="flex gap-1 rounded-xl border border-white/20 bg-black/90 p-1.5 backdrop-blur-xl">
          <button
            onClick={() => setViewMode('globe')}
            title="Globe View"
            className={`rounded-lg p-2 transition ${
              viewMode === 'globe'
                ? 'bg-white text-black'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Globe2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('split')}
            title="Split View"
            className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition ${
              viewMode === 'split'
                ? 'bg-white text-black'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            SPLIT
          </button>
          <button
            onClick={() => setViewMode('feed')}
            title="Feed View"
            className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition ${
              viewMode === 'feed'
                ? 'bg-white text-black'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            FEED
          </button>
        </div>
      </div>

      {/* Live Stats Badge */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="rounded-full border border-white/15 bg-black/85 px-4 py-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Globe2 className="h-3.5 w-3.5 text-[#00E5FF]" />
            <span className="text-[10px] uppercase tracking-[0.26em] text-white/60">
              {filteredPosts.length} LIVE
            </span>
            <span className="text-white/30">·</span>
            <span className="text-[10px] uppercase tracking-[0.26em] text-white/60">
              {beacons.length} ON GLOBE
            </span>
          </div>
        </div>
      </div>

      {/* Feed Panel */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-500 ${
        viewMode === 'globe' ? 'translate-y-full' : 
        viewMode === 'feed' ? 'h-full' : 
        feedCollapsed ? 'h-20' : 'h-[65vh]'
      }`}>
        <div className="relative h-full">
          {/* Feed Container */}
          <div className="h-full overflow-hidden rounded-t-[32px] border-t-2 border-white/20 bg-black/95 shadow-2xl backdrop-blur-2xl">
            {/* Feed Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-4">
                <h2 className="text-base font-black uppercase tracking-[0.28em]">
                  LIVE FEED
                </h2>
                <span className="rounded-full bg-[#FF1744]/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#FF1744]">
                  {filteredPosts.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter toggle */}
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`rounded-lg p-2 transition ${
                    filtersOpen
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                  title="Filters"
                >
                  <Filter className="h-4 w-4" />
                </button>

                {/* Collapse toggle (only in split mode) */}
                {viewMode === 'split' && (
                  <button
                    onClick={() => setFeedCollapsed(!feedCollapsed)}
                    className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                    title={feedCollapsed ? 'Expand' : 'Collapse'}
                  >
                    {feedCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}

                {/* New Post Button */}
                {!composerOpen && !feedCollapsed && (
                  <button
                    onClick={() => setComposerOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#FF1744] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.24em] transition hover:bg-white hover:text-black"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    DROP
                  </button>
                )}
              </div>
            </div>

            {!feedCollapsed && (
              <>
                {/* Filters */}
                {filtersOpen && (
                  <div className="border-b border-white/10 bg-black/60 p-4">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedMode('all')}
                        className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition ${
                          selectedMode === 'all'
                            ? 'bg-white text-black'
                            : 'border border-white/30 hover:border-white'
                        }`}
                      >
                        All
                      </button>
                      {(Object.keys(MODE_CONFIG) as Array<'hookup' | 'crowd' | 'drop' | 'care'>).map((m) => {
                        const config = MODE_CONFIG[m];
                        const Icon = config.icon;
                        return (
                          <button
                            key={m}
                            onClick={() => setSelectedMode(m)}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition ${
                              selectedMode === m
                                ? 'text-white'
                                : 'border border-white/30 hover:border-white'
                            }`}
                            style={selectedMode === m ? { 
                              backgroundColor: config.color,
                              borderColor: config.color 
                            } : {}}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {config.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Filter by city..."
                          className="w-full rounded-xl border border-white/20 bg-black/60 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-white/40"
                        />
                      </div>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/20 bg-black/60 px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={safeOnly}
                          onChange={(e) => setSafeOnly(e.target.checked)}
                          className="h-4 w-4 rounded border-white/30"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                          Safe Only
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Composer */}
                {composerOpen && (
                  <div className="border-b border-white/10 bg-gradient-to-b from-black/80 to-black/60 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-[#FF1744]" />
                        <h3 className="text-[12px] font-black uppercase tracking-[0.28em] text-white/90">
                          New Signal
                        </h3>
                      </div>
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
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Mode selector */}
                    <div className="mb-4 grid grid-cols-4 gap-2">
                      {(Object.keys(MODE_CONFIG) as Array<'hookup' | 'crowd' | 'drop' | 'care'>).map((m) => {
                        const config = MODE_CONFIG[m];
                        const Icon = config.icon;
                        return (
                          <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex flex-col items-center gap-2 rounded-xl p-3 transition ${
                              mode === m
                                ? 'text-white'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                            style={mode === m ? { backgroundColor: config.color } : {}}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                              {config.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder={`e.g. "${MODE_CONFIG[mode].description}"`}
                      maxLength={120}
                      className="mb-3 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-3.5 text-sm outline-none transition focus:border-white"
                    />

                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Add details (optional)"
                      rows={3}
                      maxLength={500}
                      className="mb-4 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-3.5 text-sm outline-none transition focus:border-white"
                    />

                    <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl bg-white/5 p-4">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-white/30"
                      />
                      <span className="text-[11px] leading-relaxed text-white/70">
                        I&apos;m posting for men 18+, this is consensual, and I understand aftercare info is not medical advice.
                      </span>
                    </label>

                    {error && (
                      <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-[11px] text-red-200">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handlePost}
                      disabled={!headline.trim() || !consent || posting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF1744] px-6 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-black disabled:opacity-30"
                    >
                      <Send className="h-4 w-4" />
                      {posting ? 'Dropping...' : 'Drop it Right Now'}
                    </button>
                  </div>
                )}

                {/* Feed List */}
                <div className={`overflow-y-auto p-6 ${
                  composerOpen ? 'h-[calc(100%-520px)]' : 
                  filtersOpen ? 'h-[calc(100%-230px)]' : 
                  'h-[calc(100%-80px)]'
                }`}>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-white/15 bg-black/60 p-16 text-center">
                      <Zap className="mx-auto mb-4 h-16 w-16 text-white/20" />
                      <p className="text-sm text-white/60">
                        No signals right now{city ? ` in ${city}` : ''}.
                        <br />
                        Be the first to drop something.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPosts.map((post) => {
                        const config = MODE_CONFIG[post.mode];
                        const Icon = config.icon;
                        return (
                          <div
                            key={post.id}
                            data-post-id={post.id}
                            className="group rounded-2xl border border-white/15 bg-gradient-to-br from-black/80 to-black/60 p-5 transition hover:border-white/30 hover:shadow-lg"
                          >
                            {/* Header */}
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex flex-wrap items-center gap-2">
                                <span 
                                  className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]"
                                  style={{ 
                                    backgroundColor: `${config.color}30`,
                                    color: config.color 
                                  }}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                  {config.label}
                                </span>
                                {post.membership_tier !== 'free' && (
                                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em]">
                                    {post.membership_tier}
                                  </span>
                                )}
                                {post.near_party && (
                                  <span className="flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 text-[10px] font-bold text-orange-200">
                                    <Flame className="h-3 w-3" />
                                    Near party
                                  </span>
                                )}
                                {post.safety_flags?.includes('verified_host') && (
                                  <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold text-green-200">
                                    <Shield className="h-3 w-3" />
                                    Verified
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="rounded-lg p-2 opacity-0 transition hover:bg-red-500/20 group-hover:opacity-100"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </button>
                            </div>

                            {/* Content */}
                            <h3 className="mb-2 text-base leading-snug">{post.headline}</h3>
                            {post.body && (
                              <p className="mb-3 text-sm leading-relaxed text-white/70">{post.body}</p>
                            )}

                            {/* Footer */}
                            <div className="flex flex-wrap items-center gap-4 text-[10px] text-white/50">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3" />
                                {post.city}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                {getTimeRemaining(post.expires_at)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Flame className="h-3 w-3" />
                                Heat: {Math.round(post.score)}
                              </span>
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