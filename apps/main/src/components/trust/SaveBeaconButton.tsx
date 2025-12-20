// components/trust/SaveBeaconButton.tsx
// Save/Unsave beacon with expiry notification preferences

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  beaconId: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  showLabel?: boolean;
};

export default function SaveBeaconButton({
  beaconId,
  variant = "outline",
  size = "default",
  showLabel = false,
}: Props) {
  const [saved, setSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Check if already saved
  React.useEffect(() => {
    (async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from("saved_beacons")
          .select("beacon_id")
          .eq("user_id", user.user.id)
          .eq("beacon_id", beaconId)
          .single();

        if (!error && data) {
          setSaved(true);
        }
      } catch (e) {
        // Not saved
      }
    })();
  }, [beaconId]);

  async function toggle() {
    setLoading(true);
    setError(null);

    try {
      if (saved) {
        // Unsave
        const { error } = await supabase.rpc("unsave_beacon", {
          p_beacon_id: beaconId,
        });

        if (error) throw error;
        setSaved(false);
      } else {
        // Save with default notification settings
        const { error } = await supabase.rpc("save_beacon", {
          p_beacon_id: beaconId,
          p_notify_before_minutes: 30,
          p_notify_on_expiry: true,
        });

        if (error) throw error;
        setSaved(true);
      }
    } catch (e: any) {
      setError(e.message || "Failed to save beacon.");
      console.error("Save beacon error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant={variant}
        size={size}
        className="rounded-2xl"
        onClick={toggle}
        disabled={loading}
      >
        {saved ? (
          <>
            <BookmarkCheck className="h-4 w-4" />
            {showLabel && <span className="ml-2">Saved</span>}
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />
            {showLabel && <span className="ml-2">Save</span>}
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
