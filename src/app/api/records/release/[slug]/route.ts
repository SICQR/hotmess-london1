// app/api/records/release/[slug]/route.ts
// Single release detail API with tracks, versions, products

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Fetch release
    const { data: release, error: relError } = await supabase
      .from("record_releases")
      .select("id,slug,title,artist_name,release_type,catalog_no,release_date,cover_asset_id,is_explicit,blurb,credits,access,premium_early_until,is_published")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();

    if (relError || !release) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    // Fetch tracks
    const { data: tracks } = await supabase
      .from("record_tracks")
      .select("id,track_no,title,duration_sec,bpm,musical_key")
      .eq("release_id", release.id)
      .order("track_no");

    // Fetch track versions
    const trackIds = (tracks ?? []).map(t => t.id);
    const { data: versions } = trackIds.length
      ? await supabase
          .from("record_track_versions")
          .select("id,track_id,kind,is_streamable,is_downloadable,soundcloud_widget_url,duration_sec")
          .in("track_id", trackIds)
      : { data: [] };

    // Fetch products
    const { data: products } = await supabase
      .from("record_products")
      .select("id,name,kind,price_cents,currency")
      .eq("release_id", release.id)
      .eq("is_active", true);

    // Fetch cover asset (public bucket)
    let cover: any = null;
    if (release.cover_asset_id) {
      const { data: coverAsset } = await supabase
        .from("record_assets")
        .select("id,bucket,path,mime_type")
        .eq("id", release.cover_asset_id)
        .maybeSingle();
      cover = coverAsset ?? null;
    }

    // Fetch hero image crop (optional)
    let hero: any = null;
    const { data: heroImg } = await supabase
      .from("record_release_images")
      .select("kind,asset_id")
      .eq("release_id", release.id)
      .eq("kind", "hero")
      .maybeSingle();

    if (heroImg?.asset_id) {
      const { data: heroAsset } = await supabase
        .from("record_assets")
        .select("id,bucket,path,mime_type")
        .eq("id", heroImg.asset_id)
        .maybeSingle();
      hero = heroAsset ?? null;
    }

    return NextResponse.json({
      ok: true,
      release,
      cover,
      hero,
      tracks: tracks ?? [],
      versions: versions ?? [],
      products: products ?? [],
    });
  } catch (err) {
    console.error("Release API error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}