import { useMemo, useState } from "react";
import { MapboxGlobe } from "../components/globe/MapboxGlobe";
import {
  RightNowComposer,
  RightNowDraftPayload,
  RightNowEntitlements,
  MembershipTier,
  XpTier,
} from "../components/rightnow/RightNowComposer";
import { MessConciergeWidget } from "../components/ai/MessConciergeWidget";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || "your-project-id";
const API_BASE = `https://${PROJECT_ID}.supabase.co/functions/v1`;

// Simple entitlement logic based on membership + XP
function computeEntitlements(
  membership: MembershipTier,
  xpTier: XpTier,
): RightNowEntitlements {
  // Icon tier: maximum privileges
  if (membership === "icon") {
    return {
      membership,
      xpTier,
      maxPostLength: 600,
      maxRadiusKm: 25,
      dailyPostLimit: 20,
      canAttachMedia: true,
      canBoost: true,
    };
  }

  // HNH (Hand N Hand) tier: enhanced privileges
  if (membership === "hnh") {
    return {
      membership,
      xpTier,
      maxPostLength: 400,
      maxRadiusKm: 15,
      dailyPostLimit: 10,
      canAttachMedia: true,
      canBoost: false,
    };
  }

  // Vendor / Sponsor tiers: business privileges
  if (membership === "vendor" || membership === "sponsor") {
    return {
      membership,
      xpTier,
      maxPostLength: 500,
      maxRadiusKm: 20,
      dailyPostLimit: 30,
      canAttachMedia: true,
      canBoost: true,
    };
  }

  // FREE tier: basic privileges
  return {
    membership,
    xpTier,
    maxPostLength: 200,
    maxRadiusKm: 5,
    dailyPostLimit: 3,
    canAttachMedia: false,
    canBoost: false,
  };
}

export default function RightNowPageWithMembership() {
  // TODO: Replace with actual user data from Supabase
  // For now, these are hard-coded for demo purposes
  const [membership, setMembership] = useState<MembershipTier>("free");
  const [xpTier, setXpTier] = useState<XpTier>("fresh");

  const entitlements = useMemo(
    () => computeEntitlements(membership, xpTier),
    [membership, xpTier],
  );

  const [city, setCity] = useState<string | undefined>("London");
  const [country, setCountry] = useState<string | undefined>("United Kingdom");
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({
    lat: 51.5074,
    lng: -0.1278,
  });

  async function handleCreatePost(payload: RightNowDraftPayload) {
    // Thin wrapper to your existing insert path.
    // Example: Supabase Edge Function "right-now-create"
    const res = await fetch(`${API_BASE}/right-now-create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    console.log("RIGHT NOW post created:", payload);
  }

  return (
    <div className="min-h-screen hotmess-bg text-white grid grid-cols-1 lg:grid-cols-[420px_1fr]">
      {/* LEFT – RIGHT NOW composer + feed */}
      <div className="border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="text-2xl font-black tracking-tight uppercase">
            RIGHT NOW
          </div>
          <div className="hm-label mt-1">HOOKUPS • CROWDS • SIGNALS</div>

          {/* Demo Tier Switcher */}
          <div className="mt-4 p-3 border border-white/10 rounded-xl bg-white/5">
            <div className="text-[10px] tracking-[0.32em] uppercase text-white/60 mb-2">
              Demo: Switch Tier
            </div>
            <div className="flex gap-2 mb-2">
              {(["free", "hnh", "vendor", "icon"] as MembershipTier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setMembership(t)}
                  className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded-md border transition-all ${
                    membership === t
                      ? "bg-hotmess-pink text-black border-hotmess-pink"
                      : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["fresh", "regular", "sinner", "icon"] as XpTier[]).map((x) => (
                <button
                  key={x}
                  onClick={() => setXpTier(x)}
                  className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded-md border transition-all ${
                    xpTier === x
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
                  }`}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <RightNowComposer
            apiBase={API_BASE}
            defaultCity={city}
            defaultCountry={country}
            lat={coords.lat}
            lng={coords.lng}
            entitlements={entitlements}
            onSubmit={handleCreatePost}
          />

          {/* TODO: render live feed list here, filtered by city & radius */}
          <div className="p-4 border border-white/10 rounded-xl bg-white/3 text-sm text-white/60">
            <div className="text-[10px] tracking-[0.32em] uppercase text-white/60 mb-2">
              Feed placeholder
            </div>
            <p>
              Live RIGHT NOW posts from {city} will appear here, filtered by
              intent and radius based on your membership tier.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT – Globe */}
      <div className="relative">
        <MapboxGlobe
          timeWindow="tonight"
          useLiveData={true}
          showHeat={true}
          showBeacons={true}
          onCityClick={(c) => {
            setCity(c.city);
            setCountry(c.country);
            setCoords({
              lat: c.coordinates[1],
              lng: c.coordinates[0],
            });
          }}
        />
      </div>

      {/* AI concierge pinned to page for exploring features & cities */}
      <MessConciergeWidget
        apiBase={API_BASE}
        city={city}
        xpTier={xpTier}
        membership={membership}
      />
    </div>
  );
}
