// app/api/threads/attachments/finalize/route.ts
// Finalize proof/file upload - creates message + attachment records
// Called after client successfully uploads files to storage

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
  }

  const body = await req.json();
  const thread_id = String(body.thread_id || "");
  const thread_type = String(body.thread_type || ""); // 'connect' or 'ticket'
  const attachments = Array.isArray(body.attachments) ? body.attachments : [];
  const is_proof = !!body.is_proof;

  // Validation
  if (!thread_id || !thread_type || attachments.length === 0) {
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 }
    );
  }

  if (thread_type !== "connect" && thread_type !== "ticket") {
    return NextResponse.json(
      { ok: false, error: "invalid_thread_type" },
      { status: 400 }
    );
  }

  // Ensure membership
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

  // Create message of kind 'proof' or 'text'
  const messageTable =
    thread_type === "connect" ? "connect_messages" : "ticket_messages";

  const messageContent = is_proof
    ? "Proof uploaded."
    : `${attachments.length} file${attachments.length > 1 ? "s" : ""} uploaded.`;

  const { data: msg, error: msgError } = await supabase
    .from(messageTable)
    .insert({
      thread_id,
      sender_user_id: userData.user.id,
      body: messageContent,
      kind: is_proof ? "proof" : "text",
    })
    .select("id")
    .single();

  if (msgError || !msg) {
    console.error("[Proof Upload Finalize] Message insert error:", msgError);
    return NextResponse.json(
      { ok: false, error: "message_failed" },
      { status: 400 }
    );
  }

  // Create attachment records
  const attachmentRows = attachments.map((a: any) => ({
    thread_type,
    thread_id,
    message_id: msg.id,
    uploader_id: userData.user.id,
    storage_bucket: String(a.bucket || "thread-attachments"),
    storage_path: String(a.path),
    filename: String(a.filename),
    mime_type: String(a.mime_type),
    bytes: Number(a.bytes),
    is_proof,
  }));

  const { error: attachError } = await supabase
    .from("thread_attachments")
    .insert(attachmentRows);

  if (attachError) {
    console.error("[Proof Upload Finalize] Attachment insert error:", attachError);
    return NextResponse.json(
      { ok: false, error: "attach_failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, message_id: msg.id });
}
