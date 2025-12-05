// app/api/records/stream/[trackVersionId]/route.ts
// Generate signed URL for HQ audio streaming (entitlement required)
// Uses service role for signed URLs (private bucket)

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function nowIso() {
  return new Date().toISOString();
}

export async function GET(
  _: Request,
  { params }: { params: { trackVersionId: string } }
) {
  try {
    const sb = supabaseServer();
    const admin = supabaseAdmin();

    // 1) Auth required
    const { data: userData } = await sb.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ 
        ok: false, 
        error: "auth",
        message: "Sign in to unlock HQ."
      }, { status: 401 });
    }

    // 2) Load version + releaseId (via track)
    const { data: version, error: vErr } = await sb
      .from("record_track_versions")
      .select("id, kind, audio_asset_id, record_tracks(release_id)")
      .eq("id", params.trackVersionId)
      .maybeSingle();

    if (vErr || !version) {
      return NextResponse.json({ 
        ok: false, 
        error: "not_found" 
      }, { status: 404 });
    }

    if (!version.audio_asset_id) {
      return NextResponse.json({ 
        ok: false, 
        error: "missing_asset",
        message: "File not found. Ping support with this release ID."
      }, { status: 404 });
    }

    const releaseId = (version as any).record_tracks?.release_id as string | undefined;
    if (!releaseId) {
      return NextResponse.json({ 
        ok: false, 
        error: "release_missing" 
      }, { status: 404 });
    }

    // 3) Entitlement check (premium OR release_access for this release)
    const { data: ents, error: eErr } = await sb
      .from("record_entitlements")
      .select("id, kind, ends_at")
      .eq("user_id", userData.user.id)
      .or(
        [
          `and(kind.eq.premium,ends_at.is.null)`,
          `and(kind.eq.premium,ends_at.gt.${nowIso()})`,
          `and(kind.eq.release_access,release_id.eq.${releaseId})`,
        ].join(",")
      )
      .limit(1);

    if (eErr) {
      console.error("Entitlement check failed:", eErr);
      return NextResponse.json({ 
        ok: false, 
        error: "entitlement_check_failed" 
      }, { status: 400 });
    }

    if (!ents || ents.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: "no_entitlement",
        message: "Not unlocked. Go Premium or purchase this release."
      }, { status: 403 });
    }

    // 4) Fetch asset using admin client (for private bucket access)
    const { data: asset, error: aErr } = await admin
      .from("record_assets")
      .select("bucket, path, mime_type")
      .eq("id", version.audio_asset_id)
      .maybeSingle();

    if (aErr || !asset) {
      console.error("Asset fetch failed:", aErr);
      return NextResponse.json({ 
        ok: false, 
        error: "asset_missing",
        message: "File not found. Ping support with this asset ID."
      }, { status: 404 });
    }

    // 5) Generate signed URL with service role (10 mins)
    const signed = await admin.storage
      .from(asset.bucket)
      .createSignedUrl(asset.path, 60 * 10);

    if (signed.error) {
      console.error("Signed URL creation failed:", signed.error);
      return NextResponse.json({ 
        ok: false, 
        error: signed.error.message,
        message: "Can't generate stream URL. Try again."
      }, { status: 400 });
    }

    return NextResponse.json({ ok: true, url: signed.data.signedUrl });
  } catch (err) {
    console.error("Stream API error:", err);
    return NextResponse.json({ 
      ok: false,
      message: "Server error. Try again."
    }, { status: 500 });
  }
}
