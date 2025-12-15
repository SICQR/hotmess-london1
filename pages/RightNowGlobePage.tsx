'use client';

import { useEffect, useState } from "react";
import { MapboxGlobe } from "../components/globe/MapboxGlobe";
import { GlobeControls } from "../components/globe/GlobeControls";
import { createRightNowPost, fetchRightNowFeed, type RightNowPost, type RightNowIntent } from "../lib/right-now";
import { Zap, Send, AlertTriangle, Radio, Heart, Ticket, Droplet, Users, Clock, MapPin, Globe2 } from "lucide-react";

const INTENT_CONFIG: Record<RightNowIntent, { 
  icon: React.ReactNode; 
  label: string; 
  color: string;
  charLimit: number;
  placeholder: string;
}> = {
  hookup: { 
    icon: <Zap className="w-3 h-3" />, 
    label: "HOOKUP", 
    color: "#FF1744",
    charLimit: 200,
    placeholder: "What you want, where you are, what the vibe is... right now."
  },
  crowd: { 
    icon: <Users className="w-3 h-3" />, 
    label: "CROWD", 
    color: "#00E5FF",
    charLimit: 300,
    placeholder: "Describe the party, the vibe, the energy happening RIGHT NOW..."
  },
  drop: { 
    icon: <Droplet className="w-3 h-3" />, 
    label: "DROP", 
    color: "#FF10F0",
    charLimit: 400,
    placeholder: "Share what's dropping, where, when – exclusive intel for the city..."
  },
  ticket: { 
    icon: <Ticket className="w-3 h-3" />, 
    label: "TICKET", 
    color: "#FFD600",
    charLimit: 300,
    placeholder: "Looking for tickets, selling spares, last-minute deals..."
  },
  radio: { 
    icon: <Radio className="w-3 h-3" />, 
    label: "RADIO", 
    color: "#00C853",
    charLimit: 350,
    placeholder: "What's playing, what you're feeling, vibe check RIGHT NOW..."
  },
  care: { 
    icon: <Heart className="w-3 h-3" />, 
    label: "CARE", 
    color: "#7C4DFF",
    charLimit: 600,
    placeholder: "Check-ins, aftercare, making sure everyone's good. Care-first always."
  },
};

export default function RightNowGlobePage() {
  const [posts, setPosts] = useState<RightNowPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [intent, setIntent] = useState<RightNowIntent>("hookup");
  const [text, setText] = useState("");
  const [city, setCity] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterIntent, setFilterIntent] = useState<RightNowIntent | "all">("all");
  const [filterCity, setFilterCity] = useState<string>("");
  const [showComposer, setShowComposer] = useState(false);
  const [timeWindow, setTimeWindow] = useState<"tonight" | "weekend" | "month">("tonight");

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Silently skip geolocation errors in iframe (expected)
          if (error.code !== 1) {
            console.error("Location error:", error);
          }
        }
      );
    }
  }, []);

  // Load feed
  useEffect(() => {
    loadFeed();
  }, [filterIntent, filterCity]);

  async function loadFeed() {
    try {
      setLoading(true);
      const feedOpts: any = { limit: 100 };
      if (filterIntent !== "all") feedOpts.intent = filterIntent;
      if (filterCity) feedOpts.city = filterCity;
      
      const { posts: fetchedPosts } = await fetchRightNowFeed(feedOpts);
      setPosts(fetchedPosts);
    } catch (e: any) {
      setError(e.message ?? "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }

  // Map posts → beacons for globe
  const beacons = posts
    .filter(p => p.lat && p.lng && p.show_on_globe)
    .map(p => ({
      id: p.id,
      code: p.id,
      type: p.intent === "hookup" ? "checkin" : p.intent === "drop" ? "drop" : "event",
      title: p.text.slice(0, 40),
      city: p.city ?? undefined,
      lat: p.lat!,
      lng: p.lng!
    }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    const config = INTENT_CONFIG[intent];
    
    if (text.trim().length < 3) {
      setError("Too short. Say more.");
      return;
    }
    
    if (text.trim().length > config.charLimit) {
      setError(`Too long. ${intent.toUpperCase()} posts max ${config.charLimit} chars.`);
      return;
    }
    
    if (!city.trim()) {
      setError("City required. Where are you right now?");
      return;
    }

    setSubmitting(true);
    
    try {
      const res = await createRightNowPost({
        kind: intent,
        text: text.trim(),
        city: city.trim(),
        lat: userLocation?.lat,
        lng: userLocation?.lng,
        expires_in_minutes: 60,
        show_on_globe: true,
        telegram_mirror: false,
      });
      
      // Add to top of feed
      setPosts(prev => [res.post, ...prev]);
      
      // Reset form
      setText("");
      setShowComposer(false);
      
      // Show success
      setError(null);
    } catch (e: any) {
      setError(e.message ?? "Failed to post");
    } finally {
      setSubmitting(false);
    }
  }

  const currentConfig = INTENT_CONFIG[intent];
  const charCount = text.length;
  const charLimit = currentConfig.charLimit;
  const charRemaining = charLimit - charCount;

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Background: Globe */}
      <div className="absolute inset-0">
        <MapboxGlobe
          timeWindow={timeWindow}
          beacons={beacons}
          showBeacons={true}
          showHeat={true}
          useLiveData={true}
          onBeaconClick={(id) => {
            // Scroll feed to that post or open card
            const el = document.querySelector(`[data-post-id="${id}"]`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
      </div>

      {/* Top controls */}
      <GlobeControls
        mode="rightnow"
        timeWindow={timeWindow}
        onTimeWindowChange={(tw) => setTimeWindow(tw as any)}
        layers={{ pins: true, heat: true, trails: false, cities: true }}
        onLayerToggle={() => {}}
        showFilters={false}
        onToggleFilters={() => {}}
      />

      {/* RIGHT NOW Header Badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-black/90 border border-white/20 rounded-full px-6 py-2 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FF1744] rounded-full animate-pulse" />
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 900,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'white'
            }}>
              RIGHT NOW – LIVE CITY PULSE
            </span>
          </div>
        </div>
      </div>

      {/* Composer (conditional) */}
      {showComposer && (
        <div className="absolute left-4 right-4 top-24 max-w-3xl mx-auto z-20">
          <form
            onSubmit={handleSubmit}
            className="bg-black/95 border border-white/20 rounded-2xl p-4 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF1744]" />
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 700,
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  DROP IT RIGHT NOW
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="text-white/50 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Intent pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(Object.keys(INTENT_CONFIG) as RightNowIntent[]).map((k) => {
                const config = INTENT_CONFIG[k];
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setIntent(k)}
                    className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase border transition-all ${
                      intent === k
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/70 border-white/25 hover:border-white/60"
                    }`}
                    style={intent === k ? { backgroundColor: config.color, borderColor: config.color, color: '#000' } : {}}
                  >
                    <span className="flex items-center gap-1.5">
                      {config.icon}
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* City input */}
            <div className="mb-3">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g. London, Berlin, NYC)"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#FF1744]/70"
              />
            </div>

            {/* Text area */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={charLimit}
              placeholder={currentConfig.placeholder}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-sm outline-none focus:border-[#FF1744]/70 resize-none min-h-[96px]"
            />

            {/* Char counter */}
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-[10px] tracking-[0.22em] uppercase text-white/45">
                {charRemaining >= 0 
                  ? `${charRemaining} chars left` 
                  : `${Math.abs(charRemaining)} over limit`}
              </div>
            </div>

            {/* Error / safety line */}
            <div className="mt-3 flex items-center justify-between gap-2">
              {error && (
                <div className="flex items-center gap-1 text-xs text-[#FF1744]">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{error}</span>
                </div>
              )}
              {!error && (
                <div className="text-[10px] tracking-[0.22em] uppercase text-white/45">
                  Men-only, 18+. Keep it consensual. No hate, no minors, no illegal content.
                </div>
              )}
              <button
                type="submit"
                disabled={!text.trim() || !city.trim() || submitting || charRemaining < 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-[10px] tracking-[0.22em] uppercase border border-white hover:bg-[#FF1744] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontWeight: 900 }}
              >
                <Send className="w-3 h-3" />
                {submitting ? "DROPPING..." : "DROP IT"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters Bar */}
      <div className="absolute top-24 left-4 z-20">
        <div className="bg-black/85 border border-white/15 rounded-2xl backdrop-blur-md p-3">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/60 mb-2">
            FILTER FEED
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => setFilterIntent("all")}
              className={`px-2 py-1 rounded-full text-[9px] tracking-[0.2em] uppercase border ${
                filterIntent === "all"
                  ? "bg-white/20 text-white border-white/40"
                  : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
              }`}
            >
              ALL
            </button>
            {(Object.keys(INTENT_CONFIG) as RightNowIntent[]).map((k) => (
              <button
                key={k}
                onClick={() => setFilterIntent(k)}
                className={`px-2 py-1 rounded-full text-[9px] tracking-[0.2em] uppercase border ${
                  filterIntent === k
                    ? "bg-white/20 text-white border-white/40"
                    : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
                }`}
              >
                {INTENT_CONFIG[k].label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            placeholder="Filter by city..."
            className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[11px] outline-none focus:border-white/40"
          />
        </div>
      </div>

      {/* Feed list */}
      <div className="absolute bottom-0 left-0 right-0 z-20 max-h-[45vh] overflow-hidden">
        <div className="m-4 bg-black/90 border border-white/15 rounded-2xl backdrop-blur-xl p-4 overflow-y-auto max-h-[calc(45vh-2rem)]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
              LIVE FEED · {posts.length} POSTS
            </div>
            {!showComposer && (
              <button
                onClick={() => setShowComposer(true)}
                className="px-3 py-1.5 rounded-full bg-[#FF1744] text-white text-[10px] tracking-[0.22em] uppercase border border-[#FF1744] hover:bg-white hover:text-black transition"
                style={{ fontWeight: 900 }}
              >
                + NEW POST
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="text-sm text-white/60">Resolving the mess…</div>
          ) : posts.length === 0 ? (
            <div className="text-sm text-white/60">Quiet. For now. Be the first to drop something.</div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => {
                const postConfig = INTENT_CONFIG[p.intent];
                return (
                  <div
                    key={p.id}
                    data-post-id={p.id}
                    className="border border-white/10 rounded-xl p-3 bg-black/60 hover:border-white/20 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: postConfig.color }}
                        />
                        <div className="text-[10px] tracking-[0.26em] uppercase text-white/60">
                          {postConfig.label}
                        </div>
                        {p.city && (
                          <>
                            <span className="text-white/30">·</span>
                            <div className="flex items-center gap-1 text-[10px] text-white/50">
                              <MapPin className="w-2.5 h-2.5" />
                              {p.city}
                            </div>
                          </>
                        )}
                        {p.crowd_verified && (
                          <>
                            <span className="text-white/30">·</span>
                            <div className="flex items-center gap-1 text-[10px] text-[#00E5FF]">
                              <Users className="w-2.5 h-2.5" />
                              CROWD ✓
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-white/40">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(p.created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                    <div className="text-sm leading-relaxed">{p.text}</div>
                    {p.safe_tags && p.safe_tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.safe_tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-[#7C4DFF]/20 text-[#7C4DFF] text-[9px] tracking-[0.2em] uppercase border border-[#7C4DFF]/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Globe indicator */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/85 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Globe2 className="w-3 h-3 text-[#00E5FF]" />
            <span className="text-[9px] tracking-[0.26em] uppercase text-white/60">
              {beacons.length} LIVE ON GLOBE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}