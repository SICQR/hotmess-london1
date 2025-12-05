// app/records/releases/[slug]/ReleaseClient.tsx
// Release detail client component - polished conversion machine

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SoundCloudPreviewPlayer } from "@/components/records/SoundCloudPreviewPlayer";
import { ArtworkHero } from "@/components/records/ArtworkHero";
import { StickyCtaBar } from "@/components/records/StickyCtaBar";
import { WhatYouGet } from "@/components/records/WhatYouGet";
import { DropAlertOptIn } from "@/components/records/DropAlertOptIn";
import { NextUpReleases } from "@/components/records/NextUpReleases";
import { TrackRowControls } from "@/components/records/TrackRowControls";
import { HeroQueueActions } from "@/components/records/HeroQueueActions";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Save, Lock, Music, Download, Play, List } from "lucide-react";

interface ReleaseClientProps {
  slug: string;
}

function getUtm() {
  if (typeof window === "undefined") return {};
  const u = new URL(window.location.href);
  const grab = (k: string) => u.searchParams.get(k) || null;
  return {
    source: u.searchParams.get("source") || "site",
    drop_id: u.searchParams.get("drop") || null,
    utm_source: grab("utm_source"),
    utm_medium: grab("utm_medium"),
    utm_campaign: grab("utm_campaign"),
    utm_content: grab("utm_content"),
    utm_term: grab("utm_term"),
  };
}

export function ReleaseClient({ slug }: ReleaseClientProps) {
  const player = usePlayer();
  const [data, setData] = React.useState<any>(null);
  const [hqUrl, setHqUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saved, setSaved] = React.useState(false);
  const [downloads, setDownloads] = React.useState<{
    canDownload: boolean;
    packs: { kind: string; asset_id: string }[];
    reason?: string | null;
  } | null>(null);

  // Fetch release data
  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/records/release/${slug}`);
        const j = await r.json();
        if (!j.ok) {
          setError("Release not found.");
        } else {
          setData(j);

          // Track view event with UTMs
          try {
            const utm = getUtm();
            fetch("/api/records/referral", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                event: "view",
                releaseId: j.release.id,
                ...utm,
              }),
            });
          } catch {}
        }
      } catch (err) {
        setError("Failed to load release.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // Load downloads status
  async function loadDownloads() {
    if (!data?.release?.id) return;
    try {
      const r = await fetch("/api/records/downloads/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ releaseId: data.release.id }),
      });
      const j = await r.json();
      if (j.ok) {
        setDownloads({
          canDownload: j.canDownload,
          packs: j.packs,
          reason: j.reason,
        });
      }
    } catch (err) {
      console.error("Failed to load downloads:", err);
    }
  }

  React.useEffect(() => {
    if (data?.release?.id) {
      loadDownloads();
    }
  }, [data?.release?.id]);

  // Log play events
  async function log(eventType: string, payload: any = {}) {
    try {
      await fetch("/api/records/plays", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ eventType, ...payload }),
      });
    } catch {}
  }

  // Unlock HQ
  async function unlockHq(trackVersionId: string, releaseId: string) {
    setError(null);

    // Track unlock click
    try {
      const utm = getUtm();
      fetch("/api/records/referral", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event: "unlock_click",
          releaseId,
          ...utm,
        }),
      });
    } catch {}

    try {
      const r = await fetch(`/api/records/stream/${trackVersionId}`);
      const j = await r.json();
      if (!j.ok) {
        setError(
          j.message ||
            (j.error === "no_entitlement"
              ? "Unlock HQ with Premium or purchase."
              : "Can't load HQ.")
        );
        return;
      }
      setHqUrl(j.url);
      await log("play", { source: "site", releaseId, trackVersionId });
    } catch {
      setError("Failed to unlock HQ.");
    }
  }

  // Buy product
  async function buy(productId: string) {
    // Track checkout start
    try {
      const utm = getUtm();
      fetch("/api/records/referral", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event: "checkout_start",
          releaseId: data.release.id,
          ...utm,
        }),
      });
    } catch {}

    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const j = await r.json();
      if (!j.ok) {
        setError("Checkout failed.");
        return;
      }
      window.location.href = j.url;
    } catch {
      setError("Checkout failed.");
    }
  }

  // Save to library
  async function saveRelease(releaseId: string) {
    try {
      const r = await fetch("/api/records/library/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ releaseId }),
      });
      const j = await r.json();
      if (!j.ok) {
        setError("Couldn't save.");
      } else {
        setSaved(true);
      }
    } catch {
      setError("Couldn't save.");
    }
  }

  // Download pack
  async function downloadPack(assetId: string) {
    try {
      const r = await fetch(
        `/api/records/download/${assetId}?releaseId=${data.release.id}`
      );
      const j = await r.json();
      if (!j.ok) {
        setError(j.message || "Download failed.");
        return;
      }
      window.location.href = j.url;

      // Track download
      try {
        const utm = getUtm();
        fetch("/api/records/referral", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            event: "download",
            releaseId: data.release.id,
            ...utm,
          }),
        });
      } catch {}
    } catch {
      setError("Download failed.");
    }
  }

  // Player integration: Play SoundCloud preview in mini player
  function playPreviewInPlayer() {
    if (!preview?.soundcloud_widget_url || !data) return;
    
    const coverUrl = cover
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${cover.bucket}/${cover.path}`
      : undefined;

    player.enqueue(
      {
        id: `sc:${preview.soundcloud_widget_url}`,
        kind: "soundcloud",
        title: release.title,
        artist: release.artist_name,
        coverUrl,
        widgetUrl: preview.soundcloud_widget_url,
        href: `/records/releases/${release.slug}`,
      },
      { playNow: true }
    );

    // Track preview play
    try {
      const utm = getUtm();
      fetch("/api/records/referral", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event: "preview_play",
          releaseId: release.id,
          ...utm,
        }),
      });
    } catch {}
  }

  // Player integration: Play HQ in mini player
  async function playHqInPlayer(trackVersionId: string, trackTitle?: string) {
    setError(null);

    // Track unlock click
    try {
      const utm = getUtm();
      fetch("/api/records/referral", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event: "unlock_click",
          releaseId: release.id,
          ...utm,
        }),
      });
    } catch {}

    try {
      const r = await fetch(`/api/records/stream/${trackVersionId}`);
      const j = await r.json();
      if (!j.ok) {
        setError(
          j.message ||
            (j.error === "no_entitlement"
              ? "Unlock HQ with Premium or purchase."
              : "Can't load HQ.")
        );
        return;
      }

      const coverUrl = cover
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${cover.bucket}/${cover.path}`
        : undefined;

      player.enqueue(
        {
          id: `hq:${trackVersionId}`,
          kind: "audio",
          title: trackTitle || release.title,
          artist: release.artist_name,
          coverUrl,
          src: j.url,
          href: `/records/releases/${release.slug}`,
        },
        { playNow: true }
      );

      await log("play", {
        source: "site",
        releaseId: release.id,
        trackVersionId,
      });
    } catch {
      setError("Failed to unlock HQ.");
    }
  }

  // Player integration: Queue all tracks
  function queueAllTracks() {
    if (!tracks.length || !data) return;

    const coverUrl = cover
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${cover.bucket}/${cover.path}`
      : undefined;

    const items = tracks.map((track: any, idx: number) => {
      const trackPreview = versions.find(
        (v: any) =>
          v.track_id === track.id &&
          v.kind === "preview" &&
          v.soundcloud_widget_url
      );

      return {
        id: `sc:${trackPreview?.soundcloud_widget_url || track.id}:${idx}`,
        kind: "soundcloud" as const,
        title: track.title,
        artist: release.artist_name,
        coverUrl,
        widgetUrl: trackPreview?.soundcloud_widget_url || "",
        href: `/records/releases/${release.slug}`,
      };
    }).filter((item) => item.widgetUrl); // Only include tracks with preview URLs

    if (!items.length) {
      setError("No preview tracks available to queue.");
      return;
    }

    player.enqueueMany(items, { playNow: false });
    player.openDrawer();
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div className="text-center text-sm opacity-80">Loading…</div>
      </main>
    );
  }

  if (!data || error) {
    return (
      <main className="mx-auto max-w-4xl p-6 space-y-4">
        <div className="rounded-3xl border p-6 space-y-3">
          <div className="font-semibold">Release not found</div>
          <div className="text-sm opacity-80">
            {error || "This release doesn't exist."}
          </div>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/records/releases">Back to Releases</Link>
          </Button>
        </div>
      </main>
    );
  }

  const { release, cover, hero, tracks, versions, products } = data;

  const preview = versions.find(
    (v: any) => v.kind === "preview" && v.soundcloud_widget_url
  ) || versions.find((v: any) => v.soundcloud_widget_url);

  const hq = versions.find(
    (v: any) => v.kind === "hq" && v.is_streamable && v.id
  );

  // Map tracks with preview/hq versions for queue integration
  const trackRows = tracks.map((t: any) => {
    const trackVersions = versions.filter((v: any) => v.track_id === t.id);
    const pv = trackVersions.find((v: any) => v.kind === "preview");
    const hv = trackVersions.find((v: any) => v.kind === "hq" && v.is_streamable);
    return {
      ...t,
      preview_widget_url: pv?.soundcloud_widget_url ?? null,
      hq_track_version_id: hv?.id ?? null,
    };
  });

  // Cover URL for queue items
  const coverUrl = cover
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${cover.bucket}/${cover.path}`
    : undefined;

  // Status badges
  const statusBadges: string[] = [];
  if (release.is_explicit) statusBadges.push("EXPLICIT");
  if (release.access === "premium_early" && release.premium_early_until) {
    statusBadges.push("PREMIUM EARLY");
  }
  statusBadges.push("HQ");
  statusBadges.push("18+");

  // Product availability
  const hasDigital = products.some((p: any) => p.kind === "digital");
  const hasStudio = products.some((p: any) => p.kind === "studio_pack");

  return (
    <>
      <main className="mx-auto max-w-6xl p-4 md:p-6 pb-32 space-y-8 md:space-y-10">
        {/* Artwork Hero */}
        <ArtworkHero
          title={release.title}
          artist={`${release.artist_name} • ${String(
            release.release_type
          ).toUpperCase()} • ${release.catalog_no} • ${new Date(
            release.release_date
          ).toLocaleDateString("en-GB")}`}
          blurb={
            release.blurb
              ? String(release.blurb).slice(0, 160) +
                (release.blurb.length > 160 ? "…" : "")
              : undefined
          }
          cover={cover}
          hero={hero}
          badges={statusBadges}
        >
          {/* Primary CTAs */}
          <div className="flex flex-wrap gap-3">
            {hq && (
              <button
                className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-5 py-2.5 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm"
                onClick={() => unlockHq(hq.id, release.id)}
              >
                <Lock className="h-4 w-4 mr-2 inline" />
                Unlock HQ
              </button>
            )}
            <button
              className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-5 py-2.5 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all disabled:opacity-50 text-sm"
              onClick={() => saveRelease(release.id)}
              disabled={saved}
            >
              <Save className="h-4 w-4 mr-2 inline" />
              {saved ? "Saved" : "Save"}
            </button>
            <Link
              href="/account"
              className="rounded-xl border border-hot/30 bg-hot text-black px-5 py-2.5 font-bold uppercase tracking-wide hover:bg-hot/90 transition-all text-sm inline-flex items-center"
            >
              Go Premium
            </Link>
          </div>

          {/* Hero Queue Actions */}
          <HeroQueueActions
            release={release}
            coverUrl={coverUrl}
            trackRows={trackRows}
            mode="preview"
          />
        </ArtworkHero>

        {/* Error */}
        {error && (
          <div className="rounded-3xl border border-hot/30 bg-hot/5 backdrop-blur-sm p-5">
            <div className="text-sm font-medium text-hot">{error}</div>
          </div>
        )}

        {/* Preview Player */}
        <section className="rounded-3xl border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">Preview</div>
            <div className="text-xs opacity-70">Hosted on SoundCloud</div>
          </div>

          {preview?.soundcloud_widget_url ? (
            <>
              <SoundCloudPreviewPlayer
                widgetUrl={preview.soundcloud_widget_url}
                onEvent={(e) =>
                  log(e.type, {
                    source: "soundcloud_widget",
                    releaseId: release.id,
                    progress_ms: e.progress_ms,
                  })
                }
              />

              {/* Player CTAs */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={playPreviewInPlayer}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play in Mini Player
                </Button>
                {tracks.length > 1 && (
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={queueAllTracks}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Queue All ({tracks.length})
                  </Button>
                )}
                {hq && (
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => playHqInPlayer(hq.id, release.title)}
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Play HQ in Player
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border p-6 text-center text-sm opacity-80">
              No preview available.
            </div>
          )}

          <div className="text-xs opacity-70">
            Preview via SoundCloud. HQ stays on RAW.
          </div>
        </section>

        {/* What You Get */}
        <WhatYouGet
          hasDigital={hasDigital}
          hasStudio={hasStudio}
          unlocked={downloads?.canDownload ?? false}
          onBuyDigital={() => {
            const p = products.find((x: any) => x.kind === "digital");
            if (p) buy(p.id);
          }}
          onBuyStudio={() => {
            const p = products.find((x: any) => x.kind === "studio_pack");
            if (p) buy(p.id);
          }}
        />

        {/* Tracklist */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
            Tracklist
          </h2>
          <div className="space-y-3">
            {trackRows.map((track: any) => {
              return (
                <div
                  key={track.id}
                  className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 hover:bg-black/30 transition-all group"
                  title="Track row with play and add-to-queue controls."
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-lg font-bold tracking-tight group-hover:text-hot transition-colors">
                      {track.track_no}. {track.title}
                    </div>
                    <div className="text-xs opacity-60 uppercase tracking-wider font-bold flex flex-wrap gap-3">
                      {track.duration_sec && (
                        <span>
                          {Math.floor(track.duration_sec / 60)}:
                          {String(track.duration_sec % 60).padStart(2, "0")}
                        </span>
                      )}
                      {track.bpm && <span>{track.bpm} BPM</span>}
                      {track.musical_key && <span>{track.musical_key}</span>}
                    </div>
                  </div>

                  <TrackRowControls
                    mode={track.hq_track_version_id ? "hq" : "preview"}
                    title={track.title}
                    artist={release.artist_name}
                    coverUrl={coverUrl}
                    href={`/records/releases/${release.slug}`}
                    previewWidgetUrl={track.preview_widget_url}
                    hqTrackVersionId={track.hq_track_version_id}
                  />
                </div>
              );
            })}
          </div>

          <div className="text-xs opacity-50 text-center pt-3 uppercase tracking-widest font-bold">
            Queue it up. Keep browsing.
          </div>
        </section>

        {/* Downloads Section */}
        {downloads && downloads.packs.length > 0 && (
          <section id="downloads" className="rounded-3xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Downloads</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadDownloads}
                className="text-xs"
              >
                Refresh
              </Button>
            </div>

            {!downloads.canDownload ? (
              <div className="space-y-3">
                <div className="text-sm opacity-80">
                  Not unlocked yet. Buy the release or go Premium.
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="rounded-2xl">
                    <Link href="/account">Go Premium</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => {
                      const buySection = document.getElementById("buy");
                      buySection?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Buy Release
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm opacity-80">
                  Your files are ready. Links expire in 10 minutes.
                </div>
                <div className="flex flex-wrap gap-2">
                  {downloads.packs.map((pack: any) => (
                    <Button
                      key={pack.asset_id}
                      className="rounded-2xl"
                      onClick={() => downloadPack(pack.asset_id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {pack.kind === "studio_pack"
                        ? "Download Studio Pack"
                        : "Download Digital"}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Buy Section */}
        <section id="buy" className="space-y-3">
          <h2 className="text-xl font-bold">Buy</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="rounded-3xl border p-6 space-y-3"
              >
                <div className="font-bold">{product.name}</div>
                <div className="text-2xl font-bold text-hot">
                  £{(product.price_cents / 100).toFixed(2)}
                </div>
                <div className="text-sm opacity-80">
                  {product.kind === "studio_pack" ? "Studio Pack" : "Digital"}
                </div>
                <Button
                  className="w-full rounded-2xl"
                  onClick={() => buy(product.id)}
                >
                  Buy Now
                </Button>
              </div>
            ))}

            {/* Shop/Merch link */}
            <div className="rounded-3xl border p-6 space-y-3">
              <div className="font-bold">Merch / Vinyl</div>
              <div className="text-sm opacity-80">
                Physical drops live in the Shop.
              </div>
              <Button asChild variant="outline" className="w-full rounded-2xl">
                <Link href="/shop">Open Shop</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Drop Alert Opt-In */}
        <DropAlertOptIn
          releaseId={release.id}
          source={typeof window !== "undefined" ? getUtm().source : "site"}
        />

        {/* Credits */}
        {release.credits && (
          <section className="rounded-3xl border p-6 space-y-2">
            <div className="font-bold">Credits</div>
            <div className="text-sm opacity-90 whitespace-pre-wrap">
              {release.credits}
            </div>
          </section>
        )}

        {/* Next Up */}
        <NextUpReleases releaseId={release.id} />

        {/* Footer microcopy */}
        <div className="text-xs opacity-70 text-center">
          18+ only. Preview via SoundCloud embed. HQ listening and downloads
          delivered on this platform.
        </div>
      </main>

      {/* Sticky CTA Bar */}
      <StickyCtaBar
        status="HQ hits different."
        primaryLabel="Unlock HQ"
        onPrimary={() => {
          if (hq) unlockHq(hq.id, release.id);
        }}
        secondaryLabel="Save"
        onSecondary={() => saveRelease(release.id)}
      />
    </>
  );
}