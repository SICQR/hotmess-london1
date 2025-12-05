// app/api/beacons/unsave/route.ts
// Unsave beacon (cancels future notifications)

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
    const { beaconId } = await req.json();

    const { error } = await supabase.rpc("unsave_beacon", {
      p_beacon_id: String(beaconId),
    });

    if (error) {
      console.error("[Unsave Beacon] Error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[Unsave Beacon] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "Failed to unsave beacon" }, { status: 500 });
  }
}
