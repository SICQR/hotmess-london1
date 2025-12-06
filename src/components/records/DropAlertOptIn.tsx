// components/records/DropAlertOptIn.tsx
// Soft email capture for drop alerts

"use client";

import * as React from "react";

export function DropAlertOptIn({
  releaseId,
  source,
}: {
  releaseId?: string;
  source?: string;
}) {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function submit() {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/records/opt-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          tag: "release_drop_alerts",
          releaseId,
          source: source || "site",
        }),
      });

      const json = await response.json();

      if (!json.ok) {
        throw new Error(json.error);
      }

      setDone(true);
    } catch (err) {
      setError("Enter a real email, and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border p-4 space-y-2">
      <div className="font-semibold">Drop alerts</div>
      <div className="text-sm opacity-80">
        Drop alerts only. No spam. Unsub anytime.
      </div>

      {done ? (
        <div className="rounded-2xl border p-3 text-sm">
          Locked in. You'll get the next drop.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="flex-1 rounded-2xl border px-3 py-2"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && email.trim() && !busy) {
                submit();
              }
            }}
          />
          <button
            className="rounded-2xl border px-4 py-2"
            onClick={submit}
            disabled={busy}
          >
            {busy ? "Saving…" : "Notify me"}
          </button>
        </div>
      )}

      {error && <div className="text-xs opacity-70 text-red-600">{error}</div>}
      <div className="text-xs opacity-70">18+ only.</div>
    </section>
  );
}
