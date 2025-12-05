// app/api/trust/mute/route.ts
// Mute thread (temporary notification block)

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
    const { threadType, threadId, minutes } = await req.json();

    const { error } = await supabase.rpc("mute_thread", {
      p_thread_type: String(threadType), // 'connect' | 'tickets'
      p_thread_id: String(threadId),
      p_minutes: Number(minutes),
    });

    if (error) {
      console.error("[Mute Thread] Error:", error);
      
      // Map specific errors
      if (error.message.includes("invalid_thread_type")) {
        return NextResponse.json({ ok: false, error: "Invalid thread type." }, { status: 400 });
      }
      if (error.message.includes("invalid_duration")) {
        return NextResponse.json({ ok: false, error: "Invalid mute duration." }, { status: 400 });
      }
      
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[Mute Thread] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "Failed to mute thread" }, { status: 500 });
  }
}
