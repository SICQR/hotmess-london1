// components/tickets/ProofUploadQuickflow.tsx
// One-tap proof upload quickflow for ticket threads
// Handles file picker → upload → message posting

"use client";

import * as React from "react";
import { trackTicketEvent } from "@/lib/tickets/track";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

const MAX_FILES = 4;
const MAX_BYTES = 12 * 1024 * 1024; // 12MB
const ALLOWED = new Set(["image/jpeg", "image/png", "application/pdf"]);

function fmtBytes(n: number): string {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)}KB`;
  return `${(n / (1024 * 1024)).toFixed(1)}MB`;
}

export function ProofUploadQuickflow({
  threadId,
  threadType = "ticket",
  listingId,
  disabled,
  onDone,
}: {
  threadId: string;
  threadType?: "connect" | "ticket";
  listingId?: string | null;
  disabled?: boolean;
  onDone?: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function pick() {
    setMsg(null);
    inputRef.current?.click();
  }

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // Reset input

    if (!files.length) return;

    // Validation
    if (files.length > MAX_FILES) {
      setMsg({ type: "error", text: `Max ${MAX_FILES} files.` });
      return;
    }

    for (const f of files) {
      if (!ALLOWED.has(f.type)) {
        setMsg({ type: "error", text: "Allowed: JPG, PNG, PDF." });
        return;
      }
      if (f.size > MAX_BYTES) {
        setMsg({
          type: "error",
          text: `File too big: ${f.name} (${fmtBytes(f.size)}).`,
        });
        return;
      }
    }

    // Start upload process
    setBusy("Preparing upload…");

    // Track upload start
    if (threadType === "ticket") {
      trackTicketEvent("ticket_proof_upload_start", {
        listing_id: listingId ?? null,
        meta: {
          count: files.length,
          bytes: files.reduce((a, f) => a + f.size, 0),
        } as any,
      });
    }

    try {
      // 1) Init: Get signed upload URLs
      const initResponse = await fetch("/api/threads/attachments/init", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          thread_type: threadType,
          is_proof: true,
          files: files.map((f) => ({
            filename: f.name,
            mime_type: f.type,
            bytes: f.size,
          })),
        }),
      });

      const initJson = await initResponse.json();
      if (!initJson.ok) {
        throw new Error(initJson.error || "init_failed");
      }

      // 2) Upload: PUT each file to signed URL
      setBusy("Uploading…");

      const uploadedMeta: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const item = initJson.items[i];

        const putResponse = await fetch(item.signedUploadUrl, {
          method: "PUT",
          headers: { "content-type": file.type },
          body: file,
        });

        if (!putResponse.ok) {
          throw new Error("upload_failed");
        }

        uploadedMeta.push({
          bucket: item.bucket,
          path: item.path,
          filename: item.filename,
          mime_type: item.mime_type,
          bytes: item.bytes,
        });
      }

      // 3) Finalize: Create proof message + attachment records
      setBusy("Posting proof…");

      const finalizeResponse = await fetch("/api/threads/attachments/finalize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          thread_type: threadType,
          is_proof: true,
          attachments: uploadedMeta,
        }),
      });

      const finalizeJson = await finalizeResponse.json();
      if (!finalizeJson.ok) {
        throw new Error(finalizeJson.error || "finalize_failed");
      }

      // Success!
      if (threadType === "ticket") {
        trackTicketEvent("ticket_proof_upload_done", {
          listing_id: listingId ?? null,
        });
      }

      setMsg({ type: "success", text: "Proof uploaded." });
      setBusy(null);
      onDone?.();
    } catch (e: any) {
      console.error("[Proof Upload]", e);

      if (threadType === "ticket") {
        trackTicketEvent("ticket_proof_upload_fail", {
          listing_id: listingId ?? null,
        });
      }

      setBusy(null);
      setMsg({
        type: "error",
        text: "Upload failed. Try a smaller file or different format.",
      });
    }
  }

  return (
    <div className="rounded-3xl border p-4 space-y-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Proof upload
          </div>
          <div className="text-xs opacity-70 mt-1">
            Upload screenshots / PDFs. Blur names if you want. Keep it in-thread.
          </div>
        </div>

        <Button
          variant="outline"
          className="rounded-2xl"
          onClick={pick}
          disabled={!!disabled || !!busy}
        >
          {busy || "Upload proof"}
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/jpeg,image/png,application/pdf"
        onChange={onPickFiles}
      />

      {/* Feedback message */}
      {msg && (
        <Alert
          className={
            msg.type === "success" ? "border-green-500/30 bg-green-500/5" : ""
          }
        >
          <AlertDescription className="flex items-center gap-2 text-sm">
            {msg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {msg.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Limits footer */}
      <div className="text-[11px] opacity-60">
        Max {MAX_FILES} files • {fmtBytes(MAX_BYTES)} each • JPG/PNG/PDF only
      </div>
    </div>
  );
}
