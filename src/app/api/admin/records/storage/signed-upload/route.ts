// app/api/admin/records/storage/signed-upload/route.ts
// Admin-only: Get signed upload URL for Supabase storage

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireAdminApi() {
  const sb = supabaseServer();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return { ok: false as const, status: 401 };
  const { data: prof } = await sb
    .from("profiles")
    .select("role")
    .eq("user_id", u.user.id)
    .maybeSingle();
  if (!prof || prof.role !== "admin")
    return { ok: false as const, status: 403 };
  return { ok: true as const, userId: u.user.id };
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok)
    return NextResponse.json({ ok: false }, { status: guard.status });

  const { bucket, path } = await req.json();
  if (!bucket || !path)
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 }
    );

  const admin = supabaseAdmin();
  const signed = await admin.storage
    .from(String(bucket))
    .createSignedUploadUrl(String(path));

  if (signed.error)
    return NextResponse.json(
      { ok: false, error: signed.error.message },
      { status: 400 }
    );

  return NextResponse.json({
    ok: true,
    signedUrl: signed.data.signedUrl,
    token: signed.data.token,
  });
}
