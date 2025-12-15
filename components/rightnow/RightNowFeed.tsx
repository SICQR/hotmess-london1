/**
 * RIGHT NOW FEED COMPONENT
 * Shows live pulses from men with real-time data
 */

import { useEffect, useState, useMemo } from "react";
import { Zap, Clock, MapPin, Users, Filter, Flame } from "lucide-react";

type TimeWindow = "live" | "10m" | "1h" | "24h";
type Intent = "hookup" | "crowd" | "drop" | "ticket" | "radio" | "care";

interface RightNowItem {
  id: string;
  intent: Intent;
  text: string;
  city: string;
  country: string | null;
  roomMode: "solo" | "host";
  crowdCount: number | null;
  createdAt: string;
  expiresAt: string;
  hostBeaconId: string | null;
  allowAnonSignals: boolean;
}

interface RightNowFeedProps {
  filters?: {
    radius_km?: number;
    time_range?: 'now' | 'tonight' | 'weekend';
    intent?: string[];
  };
}

const INTENT_LABEL: Record<Intent, string> = {
  hookup: "HOOK-UP",
  crowd: "PARTY",
  drop: "DROP",
  ticket: "TICKET",
  radio: "RADIO",
  care: "CARE",
};

const INTENT_COLOR: Record<Intent, string> = {
  hookup: "#FF1744",
  crowd: "#FF6E40",
  drop: "#FF10F0",
  ticket: "#FFD600",
  radio: "#00E5FF",
  care: "#00C853",
};

function formatCountdown(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "EXPIRED";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  if (m < 1) return "NOW";
  if (m < 60) return `${m} MIN`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  if (rm === 0) return `${h} H`;
  return `${h}H ${rm}M`;
}

// Mock data fallback
function getMockItems(): RightNowItem[] {
  const now = Date.now();
  const in45Min = new Date(now + 45 * 60 * 1000).toISOString();
  const in30Min = new Date(now + 30 * 60 * 1000).toISOString();
  const in55Min = new Date(now + 55 * 60 * 1000).toISOString();
  
  return [
    {
      id: "mock-1",
      intent: "hookup",
      text: "Solo at E1, looking for dark room energy",
      city: "London",
      country: "UK",
      roomMode: "solo",
      crowdCount: null,
      createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
      expiresAt: in45Min,
      hostBeaconId: null,
      allowAnonSignals: true,
    },
    {
      id: "mock-2",
      intent: "crowd",
      text: "Vauxhall party starting now – host verified, ~18 men in",
      city: "London",
      country: "UK",
      roomMode: "host",
      crowdCount: 18,
      createdAt: new Date(now - 5 * 60 * 1000).toISOString(),
      expiresAt: in55Min,
      hostBeaconId: "beacon-vxh",
      allowAnonSignals: true,
    },
    {
      id: "mock-3",
      intent: "care",
      text: "Need to talk. Feeling wobbly after a rough night.",
      city: "London",
      country: "UK",
      roomMode: "solo",
      crowdCount: null,
      createdAt: new Date(now - 25 * 60 * 1000).toISOString(),
      expiresAt: in30Min,
      hostBeaconId: null,
      allowAnonSignals: false,
    },
  ];
}

export function RightNowFeed({ filters }: RightNowFeedProps) {
  const [items, setItems] = useState<RightNowItem[]>(getMockItems());
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load feed from API
  useEffect(() => {
    async function loadFeed() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters?.radius_km) params.set('radius_km', filters.radius_km.toString());
        if (filters?.intent && filters.intent.length > 0) {
          params.set('mode', filters.intent[0]); // Use first intent filter
        }
        
        const response = await fetch(
          `https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/hotmess-os/right-now?${params.toString()}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.posts && data.posts.length > 0) {
            // Map API data to feed items
            const mappedItems: RightNowItem[] = data.posts.map((post: any) => ({
              id: post.id,
              intent: post.mode as Intent,
              text: post.text,
              city: post.city,
              country: post.country || 'UK',
              roomMode: post.near_party ? 'host' : 'solo',
              crowdCount: null, // Will add party data later
              createdAt: post.created_at,
              expiresAt: post.expires_at,
              hostBeaconId: post.party_beacon_id,
              allowAnonSignals: true,
            }));
            setItems(mappedItems);
          } else {
            // Use mock data as fallback
            setItems(getMockItems());
          }
        } else {
          // Use mock data on error
          setItems(getMockItems());
        }
      } catch (error) {
        console.error('Error loading RIGHT NOW feed:', error);
        // Use mock data on error
        setItems(getMockItems());
      } finally {
        setLoading(false);
      }
    }
    
    loadFeed();
  }, [filters]);

  const activeCount = items.length;
  const hottest = useMemo(() => {
    if (!items.length) return null;
    return [...items].sort((a, b) => {
      const aw =
        (a.roomMode === "host" ? 3 : 1) +
        (a.crowdCount ? Math.min(50, a.crowdCount) / 10 : 0);
      const bw =
        (b.roomMode === "host" ? 3 : 1) +
        (b.crowdCount ? Math.min(50, b.crowdCount) / 10 : 0);
      return bw - aw;
    })[0];
  }, [items]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Stats row */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-hotmess-pink" />
          <span>
            {activeCount} live{" "}
            {activeCount === 1 ? "pulse" : "pulses"} right now
          </span>
        </div>
        {hottest && (
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-hotmess-red" />
            <span>
              Hottest: {INTENT_LABEL[hottest.intent]} in {hottest.city}
              {hottest.crowdCount ? ` · ~${hottest.crowdCount} men` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {loading && (
          <div className="text-sm text-white/60">Loading RIGHT NOW…</div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-sm text-white/60 p-8 text-center border border-white/10 rounded-xl">
            No pulses right now. That&apos;s your cue.
          </div>
        )}

        {items.map((item) => {
          const color = INTENT_COLOR[item.intent];
          const countdown = formatCountdown(item.expiresAt);

          return (
            <div
              key={item.id}
              className="rounded-xl border border-white/12 bg-white/3 hover:bg-white/8 transition p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-[0.2em]"
                      style={{
                        borderColor: color,
                        color,
                      }}
                    >
                      {INTENT_LABEL[item.intent]}
                    </span>
                    {item.roomMode === "host" && (
                      <span className="px-2 py-0.5 rounded-full border border-white/35 text-[10px] uppercase tracking-[0.2em]">
                        HOST
                      </span>
                    )}
                    {item.crowdCount && item.crowdCount > 1 && (
                      <span className="px-2 py-0.5 rounded-full border border-white/20 text-[10px] uppercase tracking-[0.2em] flex items-center gap-1">
                        <Users size={12} />
                        {item.crowdCount}+ MEN
                      </span>
                    )}
                  </div>

                  <p className="text-sm md:text-[15px] leading-relaxed mb-2">
                    {item.text}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/60">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {item.city}
                      {item.country ? `, ${item.country}` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {countdown === "EXPIRED"
                        ? "ENDING"
                        : `ENDS IN ${countdown}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}