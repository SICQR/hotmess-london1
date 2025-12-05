// app/api/admin/records/publish/route.ts
// Admin-only: Publish/unpublish release with validation

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

async function guard(sb: ReturnType<typeof supabaseServer>) {
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return { ok: false as const, status: 401 };
  const { data: prof } = await sb
    .from("profiles")
    .select("role")
    .eq("user_id", u.user.id)
    .maybeSingle();
  if (!prof || prof.role !== "admin")
    return { ok: false as const, status: 403 };
  return { ok: true as const };
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  const g = await guard(sb);
  if (!g.ok) return NextResponse.json({ ok: false }, { status: g.status });

  const { releaseId, publish } = await req.json();

  // Validate
  const { data: rel } = await sb
    .from("record_releases")
    .select("*")
    .eq("id", String(releaseId))
    .maybeSingle();
  if (!rel)
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );

  const { data: tracks } = await sb
    .from("record_tracks")
    .select("id")
    .eq("release_id", rel.id);
  if (!tracks || tracks.length === 0)
    return NextResponse.json(
      { ok: false, error: "need_tracks" },
      { status: 400 }
    );

  const trackIds = tracks.map((t) => t.id);
  const { data: versions } = await sb
    .from("record_track_versions")
    .select("kind,soundcloud_widget_url,audio_asset_id")
    .in("track_id", trackIds);

  const hasPreview = (versions ?? []).some(
    (v) => v.kind === "preview" && v.soundcloud_widget_url
  );
  if (!hasPreview)
    return NextResponse.json(
      { ok: false, error: "need_preview" },
      { status: 400 }
    );

  if (!rel.cover_asset_id)
    return NextResponse.json(
      { ok: false, error: "need_cover" },
      { status: 400 }
    );

  const { error } = await sb
    .from("record_releases")
    .update({
      is_published: !!publish,
      updated_at: new Date().toISOString(),
    })
    .eq("id", rel.id);

  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true });
}
