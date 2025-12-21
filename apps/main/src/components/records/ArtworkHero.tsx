// components/records/ArtworkHero.tsx
// Hero section with blurred backdrop + cover art - BRUTALIST × LUXURY UPGRADE

"use client";

import * as React from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

function publicUrl(bucket: string, path: string) {
  const sb = supabaseBrowser();
  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function ArtworkHero({
  title,
  artist,
  blurb,
  cover,
  hero,
  badges,
  children,
}: {
  title: string;
  artist: string;
  blurb?: string;
  cover?: { bucket: string; path: string } | null;
  hero?: { bucket: string; path: string } | null;
  badges?: string[];
  children?: React.ReactNode;
}) {
  const bg = hero ?? cover;
  const bgUrl = bg ? publicUrl(bg.bucket, bg.path) : null;
  const coverUrl = cover ? publicUrl(cover.bucket, cover.path) : null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
      {/* Blurred background with neon overlay */}
      {bgUrl && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(24px) saturate(1.2)",
              transform: "scale(1.15)",
              opacity: 0.3,
            }}
          />
          {/* Neon gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,20,147,0.15) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Cover art */}
          <div className="w-full md:w-[300px] shrink-0">
            <div className="aspect-square rounded-3xl border border-white/20 overflow-hidden bg-black/50 backdrop-blur-sm shadow-2xl">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={`${title} cover art`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm opacity-50">
                  Cover missing
                </div>
              )}
            </div>

            {/* Badges - brutalist pills */}
            {badges && badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="uppercase tracking-wider rounded-full border border-hot/50 bg-hot/10 px-3 py-1.5 text-hot"
                    style={{ fontSize: '10px', fontWeight: 700 }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Details + CTAs */}
          <div className="flex-1 space-y-4 min-w-0">
            <div className="uppercase tracking-widest opacity-60 text-hot" style={{ fontSize: '10px', fontWeight: 700 }}>
              RAW CONVICT RECORDS
            </div>
            <h1 className="tracking-tight break-words" style={{ fontSize: '40px', fontWeight: 700, lineHeight: 0.95 }}>
              {title}
            </h1>
            <div className="opacity-80" style={{ fontSize: '14px', fontWeight: 500 }}>
              {artist}
            </div>
            {blurb && (
              <div className="text-sm md:text-base opacity-70 max-w-prose leading-relaxed">
                {blurb}
              </div>
            )}

            <div className="pt-4 space-y-3">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}