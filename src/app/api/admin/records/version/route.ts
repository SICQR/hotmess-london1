// app/api/admin/records/version/route.ts
// Admin-only: Track version upsert

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

  const body = await req.json();
  const { track_id, kind } = body;

  const { data: existing } = await sb
    .from("record_track_versions")
    .select("id")
    .eq("track_id", String(track_id))
    .eq("kind", String(kind))
    .maybeSingle();

  if (existing?.id) {
    const { error } = await sb
      .from("record_track_versions")
      .update(body)
      .eq("id", existing.id);
    if (error)
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    return NextResponse.json({ ok: true, id: existing.id });
  }

  const { data, error } = await sb
    .from("record_track_versions")
    .insert(body)
    .select("id")
    .single();
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true, id: data.id });
}

export async function DELETE(req: Request) {
  const sb = supabaseServer();
  const g = await guard(sb);
  if (!g.ok) return NextResponse.json({ ok: false }, { status: g.status });

  const { id } = await req.json();
  const { error } = await sb
    .from("record_track_versions")
    .delete()
    .eq("id", String(id));
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true });
}
