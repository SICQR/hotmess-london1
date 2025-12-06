// app/api/records/downloads/status/route.ts
// Get download packs status for a release + current user's access

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function nowIso() {
  return new Date().toISOString();
}

export async function POST(req: Request) {
  try {
    const sb = supabase;
    const { data: userData } = await sb.auth.getUser();

    const { releaseId } = await req.json();
    if (!releaseId) {
      return NextResponse.json({ 
        ok: false, 
        error: "releaseId_required" 
      }, { status: 400 });
    }

    // Fetch available packs for this release (public if published)
    const { data: packs, error: pErr } = await sb
      .from("record_release_downloads")
      .select("kind, asset_id")
      .eq("release_id", String(releaseId));

    if (pErr) {
      console.error("Failed to fetch packs:", pErr);
      return NextResponse.json({ 
        ok: false, 
        error: "packs_failed" 
      }, { status: 400 });
    }

    // Not logged in => can't download
    if (!userData.user) {
      return NextResponse.json({
        ok: true,
        canDownload: false,
        packs: packs ?? [],
        reason: "auth",
      });
    }

    // Entitlement check: premium active OR download_pack for this release
    const { data: ents, error: eErr } = await sb
      .from("record_entitlements")
      .select("id, kind, ends_at")
      .eq("user_id", userData.user.id)
      .or(
        [
          `and(kind.eq.premium,ends_at.is.null)`,
          `and(kind.eq.premium,ends_at.gt.${nowIso()})`,
          `and(kind.eq.download_pack,release_id.eq.${String(releaseId)})`,
        ].join(",")
      )
      .limit(1);

    if (eErr) {
      console.error("Failed to check entitlements:", eErr);
      return NextResponse.json({ 
        ok: false, 
        error: "entitlements_failed" 
      }, { status: 400 });
    }

    const canDownload = !!ents && ents.length > 0;
    
    return NextResponse.json({
      ok: true,
      canDownload,
      packs: packs ?? [],
      reason: canDownload ? null : "no_entitlement",
    });
  } catch (err) {
    console.error("Downloads status error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
