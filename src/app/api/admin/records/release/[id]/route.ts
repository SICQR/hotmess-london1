// app/api/admin/records/release/[id]/route.ts
// Admin-only: Update/fetch release

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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sb = supabaseServer();
  const g = await guard(sb);
  if (!g.ok) return NextResponse.json({ ok: false }, { status: g.status });

  const body = await req.json();

  const allowed = [
    "slug",
    "title",
    "artist_name",
    "release_type",
    "catalog_no",
    "release_date",
    "access",
    "premium_early_until",
    "is_explicit",
    "blurb",
    "credits",
    "cover_asset_id",
  ] as const;

  const update: any = {};
  for (const k of allowed) if (k in body) update[k] = body[k];

  update.updated_at = new Date().toISOString();

  const { error } = await sb
    .from("record_releases")
    .update(update)
    .eq("id", params.id);
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true });
}

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const sb = supabaseServer();
  const g = await guard(sb);
  if (!g.ok) return NextResponse.json({ ok: false }, { status: g.status });

  const { data: release } = await sb
    .from("record_releases")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  const { data: tracks } = await sb
    .from("record_tracks")
    .select("*")
    .eq("release_id", params.id)
    .order("track_no");
  const trackIds = (tracks ?? []).map((t) => t.id);
  const { data: versions } = trackIds.length
    ? await sb.from("record_track_versions").select("*").in("track_id", trackIds)
    : { data: [] as any[] };
  const { data: products } = await sb
    .from("record_products")
    .select("*")
    .eq("release_id", params.id);
  const { data: downloads } = await sb
    .from("record_release_downloads")
    .select("*")
    .eq("release_id", params.id);

  return NextResponse.json({
    ok: true,
    release,
    tracks: tracks ?? [],
    versions: versions ?? [],
    products: products ?? [],
    downloads: downloads ?? [],
  });
}
