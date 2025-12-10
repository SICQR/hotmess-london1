// app/api/trust/block/route.ts
// Block user (closes all threads)

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
    const { blockedUserId } = await req.json();

    const { error } = await supabase.rpc("block_user", {
      p_blocked_user: String(blockedUserId),
    });

    if (error) {
      console.error("[Block User] Error:", error);
      
      // Map specific errors
      if (error.message.includes("cannot_block_self")) {
        return NextResponse.json({ ok: false, error: "You cannot block yourself." }, { status: 400 });
      }
      
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[Block User] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "Failed to block user" }, { status: 500 });
  }
}
