// app/records/releases/page.tsx
// Browse all releases - Brutalist × Luxury

"use client";

import * as React from "react";
import Link from "next/link";
import { spacing, typography, grids, badges } from "@/lib/design-system";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BrutalistCard } from "@/components/layouts/BrutalistCard";
import { Music } from "lucide-react";

export default function ReleasesPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/records/releases");
        const j = await r.json();
        setItems(j.ok ? j.items : []);
      } catch (err) {
        console.error("Failed to load releases:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className={spacing.pageContainer}>
        <div className="text-center text-sm opacity-70 uppercase tracking-widest font-bold">
          Loading releases…
        </div>
      </main>
    );
  }

  return (
    <main className={spacing.pageContainer + " " + spacing.sectionVertical}>
      <PageHeader
        label="RAW CONVICT RECORDS"
        title="RELEASES"
        subtitle="All drops. No filler. HQ listening, studio packs, full credits."
      />

      <div className={grids.threeCol}>
        {items.map((release) => (
          <Link
            key={release.id}
            href={`/records/releases/${release.slug}`}
            className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-5 hover:border-white/20 hover:bg-black/30 transition-all group"
          >
            <div className="space-y-4">
              {/* Cover placeholder */}
              <div className="aspect-square rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center overflow-hidden">
                <Music className="h-12 w-12 opacity-30" />
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="text-xs opacity-60 uppercase tracking-wider font-bold">
                  {release.artist_name}
                </div>
                <div className="text-lg font-bold tracking-tight group-hover:text-hot transition-colors line-clamp-2">
                  {release.title}
                </div>
                <div className="text-xs opacity-50 uppercase tracking-wider font-bold flex flex-wrap gap-2">
                  <span>{String(release.release_type).toUpperCase()}</span>
                  <span>•</span>
                  <span>{release.catalog_no}</span>
                  <span>•</span>
                  <span>{new Date(release.release_date).toLocaleDateString("en-GB")}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {release.is_explicit && (
                  <span className={badges.hot}>
                    EXPLICIT
                  </span>
                )}
                {release.access === "premium_early" && (
                  <span className={badges.hot}>
                    PREMIUM EARLY
                  </span>
                )}
                <span className={badges.default}>
                  HQ
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <BrutalistCard variant="section">
          <div className="text-center space-y-5 py-8">
            <Music className="h-16 w-16 mx-auto opacity-30" />
            <div className="space-y-2">
              <div className={typography.h3}>
                No releases yet
              </div>
              <div className="text-sm opacity-70">
                Check back soon for drops.
              </div>
            </div>
          </div>
        </BrutalistCard>
      )}

      {/* Microcopy */}
      <div className={typography.microcopy + " text-center"}>
        18+ only. Preview via SoundCloud. HQ listening + downloads on platform.
      </div>
    </main>
  );
}