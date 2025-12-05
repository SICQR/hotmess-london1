// components/tickets/AttachmentViewer.tsx
// Displays file attachments in thread messages
// Handles proof badges + signed URL downloads

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image as ImageIcon, Download, ExternalLink } from "lucide-react";

function fmtBytes(n: number): string {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)}KB`;
  return `${(n / (1024 * 1024)).toFixed(1)}MB`;
}

function getFileIcon(mime: string) {
  if (mime.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

interface Attachment {
  id: string;
  filename: string;
  mime_type: string;
  bytes: number;
  is_proof: boolean;
}

export function AttachmentViewer({
  attachments,
}: {
  attachments: Attachment[];
}) {
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function openAttachment(id: string) {
    setLoading(id);
    setError(null);

    try {
      const response = await fetch("/api/threads/attachments/signed", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attachment_id: id }),
      });

      const json = await response.json();

      if (!json.ok) {
        throw new Error(json.error || "Failed to get download URL");
      }

      // Open in new tab
      window.open(json.url, "_blank");
    } catch (e: any) {
      console.error("[Attachment Viewer]", e);
      setError("Failed to open file");
    } finally {
      setLoading(null);
    }
  }

  if (!attachments?.length) return null;

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((a) => (
        <button
          key={a.id}
          className="w-full text-left rounded-2xl border px-3 py-2 hover:bg-black/5 transition-colors disabled:opacity-50"
          onClick={() => openAttachment(a.id)}
          disabled={loading === a.id}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              {getFileIcon(a.mime_type)}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm truncate flex items-center gap-2">
                  {a.filename}
                  {a.is_proof && (
                    <Badge variant="outline" className="rounded-full text-[10px]">
                      PROOF
                    </Badge>
                  )}
                </div>
                <div className="text-xs opacity-70">
                  {a.mime_type} • {fmtBytes(a.bytes)}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {loading === a.id ? (
                <span className="text-xs opacity-70">Opening…</span>
              ) : (
                <ExternalLink className="h-4 w-4 opacity-70" />
              )}
            </div>
          </div>
        </button>
      ))}

      {error && (
        <div className="text-xs text-red-500">{error}</div>
      )}
    </div>
  );
}
