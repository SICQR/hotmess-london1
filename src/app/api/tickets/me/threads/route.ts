// app/api/tickets/me/threads/route.ts
// Fetch current user's ticket threads (seller inbox)

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET() {
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
    const { data, error } = await supabase.rpc("ticket_list_my_threads", {
      p_limit: 50,
    });

    if (error) {
      console.error("[My Threads] RPC error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, items: data?.items ?? [] });
  } catch (e: any) {
    console.error("[My Threads] Fatal error:", e);
    return NextResponse.json(
      { ok: false, error: e.message || "Failed to fetch threads" },
      { status: 500 }
    );
  }
}
