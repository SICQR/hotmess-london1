// app/api/threads/attachments/signed/route.ts
// Get signed download URL for a thread attachment
// Returns temporary URL that expires in 10 minutes

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
  }

  const { attachment_id } = await req.json();
  const id = String(attachment_id || "");

  if (!id) {
    return NextResponse.json(
      { ok: false, error: "attachment_id_required" },
      { status: 400 }
    );
  }

  // Fetch attachment details
  // RLS ensures user can only see attachments from threads they're in
  const { data: attachment, error: fetchError } = await supabase
    .from("thread_attachments")
    .select(
      "id, thread_id, thread_type, storage_bucket, storage_path, filename, mime_type, bytes, is_proof"
    )
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !attachment) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );
  }

  // Generate signed download URL (10 minute expiry)
  const signedResult = await supabaseAdmin.storage
    .from(attachment.storage_bucket)
    .createSignedUrl(attachment.storage_path, 60 * 10);

  if (signedResult.error) {
    console.error("[Attachment Signed URL] Storage error:", signedResult.error);
    return NextResponse.json(
      { ok: false, error: signedResult.error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    url: signedResult.data.signedUrl,
    filename: attachment.filename,
    mime_type: attachment.mime_type,
    bytes: attachment.bytes,
    is_proof: attachment.is_proof,
  });
}
