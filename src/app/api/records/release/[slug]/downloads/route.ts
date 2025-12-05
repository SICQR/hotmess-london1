// app/api/records/release/[slug]/downloads/route.ts
// Get available download packs for a release (requires entitlement)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Get authenticated user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ 
        ok: false, 
        error: "auth"
      }, { status: 401 });
    }

    // Fetch release
    const { data: release } = await supabase
      .from("record_releases")
      .select("id")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();

    if (!release) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    // Check download_pack entitlement
    const { data: ent } = await supabase
      .from("record_entitlements")
      .select("id")
      .eq("user_id", userData.user.id)
      .eq("kind", "download_pack")
      .eq("release_id", release.id)
      .limit(1);

    if (!ent || ent.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: "no_entitlement",
        downloads: []
      }, { status: 403 });
    }

    // Fetch available downloads
    const { data: downloads } = await supabase
      .from("record_release_downloads")
      .select("kind,asset_id")
      .eq("release_id", release.id);

    return NextResponse.json({ 
      ok: true, 
      downloads: downloads ?? []
    });
  } catch (err) {
    console.error("Downloads API error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
