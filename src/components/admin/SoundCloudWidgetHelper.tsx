// components/admin/SoundCloudWidgetHelper.tsx
// Modal to fetch SoundCloud widget URL from track permalink

"use client";

import * as React from "react";

export function SoundCloudWidgetHelper({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (widgetUrl: string) => void;
}) {
  const [url, setUrl] = React.useState("");
  const [widgetUrl, setWidgetUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setUrl("");
      setWidgetUrl(null);
      setError(null);
      setBusy(false);
    }
  }, [open]);

  async function fetchWidget() {
    setBusy(true);
    setError(null);
    setWidgetUrl(null);

    try {
      const response = await fetch("/api/admin/soundcloud/widget-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = await response.json();

      if (!json.ok) {
        throw new Error(json.error || "fetch_failed");
      }

      setWidgetUrl(json.widgetUrl);
    } catch (e: any) {
      setError(
        "Couldn't fetch the widget URL. Check the link and try again."
      );
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Get SoundCloud Preview</div>
            <div className="text-sm opacity-80 mt-1">
              Paste a SoundCloud track link. I'll extract the widget URL and
              drop it into the preview field.
            </div>
          </div>
          <button
            className="rounded-2xl border px-3 py-1 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <label className="block space-y-2">
          <div className="text-xs opacity-70">SoundCloud track URL</div>
          <input
            className="w-full rounded-2xl border px-3 py-2"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://soundcloud.com/artist/track"
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.trim() && !busy) {
                fetchWidget();
              }
            }}
          />
        </label>

        {error && (
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            className="rounded-2xl border px-4 py-2"
            onClick={fetchWidget}
            disabled={busy || !url.trim()}
          >
            {busy ? "Fetching…" : "Fetch Widget URL"}
          </button>

          {widgetUrl && (
            <button
              className="rounded-2xl border px-4 py-2 bg-hot text-white"
              onClick={() => onPick(widgetUrl)}
            >
              Use this
            </button>
          )}
        </div>

        {widgetUrl && (
          <div className="rounded-2xl border p-3 space-y-2">
            <div className="text-xs opacity-70">Widget URL (ready to use)</div>
            <div className="text-xs font-mono break-all opacity-80">
              {widgetUrl}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
