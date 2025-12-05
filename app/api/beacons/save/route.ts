// app/api/beacons/save/route.ts
// Save beacon with notification preferences

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
  }

  try {
    const { beaconId, notifyBeforeMinutes, notifyOnExpiry } = await req.json();

    const { error } = await supabase.rpc("save_beacon", {
      p_beacon_id: String(beaconId),
      p_notify_before_minutes: Number(notifyBeforeMinutes ?? 30),
      p_notify_on_expiry: Boolean(notifyOnExpiry ?? true),
    });

    if (error) {
      console.error("[Save Beacon] Error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[Save Beacon] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "Failed to save beacon" }, { status: 500 });
  }
}
