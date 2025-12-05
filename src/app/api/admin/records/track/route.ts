// app/api/admin/records/track/route.ts
// Admin-only: Track CRUD

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

  const { releaseId, track_no, title } = await req.json();
  const { data, error } = await sb
    .from("record_tracks")
    .insert({
      release_id: String(releaseId),
      track_no: Number(track_no),
      title: String(title),
    })
    .select("*")
    .single();

  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true, track: data });
}

export async function PATCH(req: Request) {
  const sb = supabaseServer();
  const g = await guard(sb);
  if (!g.ok) return NextResponse.json({ ok: false }, { status: g.status });

  const { id, ...body } = await req.json();
  const { error } = await sb
    .from("record_tracks")
    .update(body)
    .eq("id", String(id));
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const sb = supabaseServer();
  const g = await guard(sb);
  if (!g.ok) return NextResponse.json({ ok: false }, { status: g.status });

  const { id } = await req.json();
  const { error } = await sb
    .from("record_tracks")
    .delete()
    .eq("id", String(id));
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true });
}
