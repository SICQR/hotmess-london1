// app/api/admin/records/assets/route.ts
// Admin-only: Register asset after upload

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

async function requireAdminApi(sb: ReturnType<typeof supabaseServer>) {
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
  const guard = await requireAdminApi(sb);
  if (!guard.ok)
    return NextResponse.json({ ok: false }, { status: guard.status });

  const body = await req.json();
  const { kind, bucket, path, mime_type, bytes, checksum_sha256 } = body;
  if (!kind || !bucket || !path || !mime_type)
    return NextResponse.json({ ok: false }, { status: 400 });

  const { data, error } = await sb
    .from("record_assets")
    .insert({
      kind,
      bucket,
      path,
      mime_type,
      bytes: Number(bytes || 0),
      checksum_sha256: checksum_sha256 || null,
    })
    .select("id")
    .single();

  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ ok: true, assetId: data.id });
}
