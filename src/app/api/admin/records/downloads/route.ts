// app/api/admin/records/downloads/route.ts
// Admin-only: Attach download packs to releases

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

  const { releaseId, kind, assetId } = await req.json();
  const { error } = await sb.from("record_release_downloads").upsert({
    release_id: String(releaseId),
    kind: String(kind),
    asset_id: String(assetId),
  });

  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true });
}
