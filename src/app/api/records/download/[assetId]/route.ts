// app/api/records/download/[assetId]/route.ts
// Generate signed URL for download (requires download_pack entitlement)
// Uses service role for signed URLs (private bucket)

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function nowIso() {
  return new Date().toISOString();
}

export async function GET(
  req: Request,
  { params }: { params: { assetId: string } }
) {
  try {
    const sb = supabaseServer();
    const admin = supabaseAdmin();

    // Get authenticated user
    const { data: userData } = await sb.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ 
        ok: false, 
        error: "auth",
        message: "Sign in to download."
      }, { status: 401 });
    }

    // Get releaseId from query (required for entitlement check)
    const url = new URL(req.url);
    const releaseId = url.searchParams.get("releaseId");
    if (!releaseId) {
      return NextResponse.json({ 
        ok: false, 
        error: "releaseId_required" 
      }, { status: 400 });
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
          `and(kind.eq.download_pack,release_id.eq.${releaseId})`,
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
        message: "Not unlocked. Purchase this release to download."
      }, { status: 403 });
    }

    // Verify the asset is actually attached to this release as a pack
    // (prevents someone with entitlement for release A downloading asset from release B)
    const { data: packLink, error: plErr } = await admin
      .from("record_release_downloads")
      .select("asset_id")
      .eq("release_id", releaseId)
      .eq("asset_id", params.assetId)
      .maybeSingle();

    if (plErr || !packLink) {
      console.error("Pack link verification failed:", plErr);
      return NextResponse.json({ 
        ok: false, 
        error: "asset_not_linked_to_release",
        message: "This file is not part of this release."
      }, { status: 403 });
    }

    // Fetch asset using admin client
    const { data: asset, error: aErr } = await admin
      .from("record_assets")
      .select("bucket, path, mime_type")
      .eq("id", params.assetId)
      .maybeSingle();

    if (aErr || !asset) {
      console.error("Asset fetch failed:", aErr);
      return NextResponse.json({ 
        ok: false, 
        error: "asset_missing",
        message: "File not found. Ping support with this asset ID."
      }, { status: 404 });
    }

    // Log download (user session)
    await sb.from("record_download_logs").insert({
      user_id: userData.user.id,
      asset_id: params.assetId,
    });

    // Generate signed URL with service role (10 mins)
    const signed = await admin.storage
      .from(asset.bucket)
      .createSignedUrl(asset.path, 60 * 10);

    if (signed.error) {
      console.error("Signed URL creation failed:", signed.error);
      return NextResponse.json({ 
        ok: false, 
        error: signed.error.message,
        message: "Can't generate download URL. Try again."
      }, { status: 400 });
    }

    return NextResponse.json({ ok: true, url: signed.data.signedUrl });
  } catch (err) {
    console.error("Download API error:", err);
    return NextResponse.json({ 
      ok: false,
      message: "Server error. Try again."
    }, { status: 500 });
  }
}
