// components/SaveBeaconRow.tsx
// Save beacon control with notification preferences

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, BookmarkCheck } from "lucide-react";

type Props = {
  beaconId: string;
  initialSaved?: boolean;
};

export function SaveBeaconRow({ beaconId, initialSaved = false }: Props) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [minutes, setMinutes] = React.useState("30");
  const [onExpiry, setOnExpiry] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function toggleSave(on: boolean) {
    setBusy(true);
    setError(null);

    try {
      const endpoint = on ? "/api/beacons/save" : "/api/beacons/unsave";
      const body = on
        ? { beaconId, notifyBeforeMinutes: Number(minutes), notifyOnExpiry: onExpiry }
        : { beaconId };

      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const j = await r.json();

      if (!j.ok) {
        throw new Error(String(j.error || "Failed"));
      }

      setSaved(on);
    } catch (e: any) {
      setError(e?.message ?? (on ? "Failed to save beacon" : "Failed to unsave beacon"));
      console.error("Save beacon error:", e);
    } finally {
      setBusy(false);
    }
  }

  async function updatePreferences() {
    if (!saved) return;
    await toggleSave(true); // Re-save with new preferences
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {saved ? (
              <BookmarkCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Bookmark className="h-4 w-4 opacity-70" />
            )}
            <div className="text-sm font-semibold">
              {saved ? "Beacon saved" : "Save this beacon"}
            </div>
          </div>
          <div className="text-xs opacity-75 mt-1">
            {saved ? "You'll get a heads-up before it expires." : "Heads-up before it expires."}
          </div>
        </div>
        <Switch checked={saved} onCheckedChange={(v) => toggleSave(v)} disabled={busy} />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-2 text-xs">
          {error}
        </div>
      )}

      <div
        className={`space-y-3 transition-opacity ${
          saved ? "" : "opacity-50 pointer-events-none"
        }`}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs opacity-75">Reminder</div>
            <Select value={minutes} onValueChange={setMinutes} disabled={!saved}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="30 min before" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No reminder</SelectItem>
                <SelectItem value="15">15 min before</SelectItem>
                <SelectItem value="30">30 min before</SelectItem>
                <SelectItem value="60">60 min before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <div className="text-xs opacity-75">At expiry</div>
            <Button
              variant={onExpiry ? "default" : "secondary"}
              className="rounded-2xl w-full"
              onClick={() => setOnExpiry((v) => !v)}
              disabled={!saved}
            >
              {onExpiry ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        {saved && (
          <Button
            className="rounded-2xl w-full"
            onClick={updatePreferences}
            disabled={busy}
            size="sm"
            variant="outline"
          >
            {busy ? "Updating..." : "Update reminders"}
          </Button>
        )}
      </div>
    </div>
  );
}
