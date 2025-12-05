// app/api/threads/attachments/init/route.ts
// Initialize proof/file upload - returns signed upload URLs
// Called before client uploads files to storage

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_FILES = 4;
const MAX_BYTES = 12 * 1024 * 1024; // 12MB each
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

export const runtime = "nodejs";

function safeName(name: string): string {
  return name.replace(/[^\w.\- ]+/g, "_").slice(0, 120);
}

export async function POST(req: Request) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
  }

  const body = await req.json();
  const thread_id = String(body.thread_id || "");
  const thread_type = String(body.thread_type || ""); // 'connect' or 'ticket'
  const files = Array.isArray(body.files) ? body.files : [];
  const is_proof = !!body.is_proof;

  // Validation
  if (!thread_id || !thread_type) {
    return NextResponse.json(
      { ok: false, error: "thread_id_and_type_required" },
      { status: 400 }
    );
  }

  if (thread_type !== "connect" && thread_type !== "ticket") {
    return NextResponse.json(
      { ok: false, error: "invalid_thread_type" },
      { status: 400 }
    );
  }

  if (files.length < 1 || files.length > MAX_FILES) {
    return NextResponse.json(
      { ok: false, error: `file_count_must_be_1_to_${MAX_FILES}` },
      { status: 400 }
    );
  }

  // Ensure user is a thread member
  const memberTable =
    thread_type === "connect"
      ? "connect_thread_members"
      : "ticket_thread_members";

  const { data: member } = await supabase
    .from(memberTable)
    .select("thread_id")
    .eq("thread_id", thread_id)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!member) {
    return NextResponse.json(
      { ok: false, error: "not_member" },
      { status: 403 }
    );
  }

  const bucket = "thread-attachments";
  const now = Date.now();
  const presigned: any[] = [];

  for (let i = 0; i < files.length; i++) {
    const f = files[i] || {};
    const mime_type = String(f.mime_type || "");
    const bytes = Number(f.bytes || 0);
    const filename = safeName(String(f.filename || `file_${i}`));

    // Validate mime type
    if (!ALLOWED_TYPES.has(mime_type)) {
      return NextResponse.json(
        { ok: false, error: "mime_not_allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (!Number.isFinite(bytes) || bytes <= 0 || bytes > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "file_too_large" },
        { status: 400 }
      );
    }

    // Generate storage path
    const storage_path = `${thread_type}/${thread_id}/${userData.user.id}/${now}_${i}_${filename}`;

    // Get signed upload URL from admin client
    const uploadResult = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(storage_path);

    if (uploadResult.error) {
      console.error("[Proof Upload Init] Storage error:", uploadResult.error);
      return NextResponse.json(
        { ok: false, error: uploadResult.error.message },
        { status: 400 }
      );
    }

    presigned.push({
      filename,
      mime_type,
      bytes,
      bucket,
      path: storage_path,
      signedUploadUrl: uploadResult.data.signedUrl,
      token: uploadResult.data.token,
      is_proof,
    });
  }

  return NextResponse.json({ ok: true, items: presigned });
}
