// app/api/admin/moderation/message/remove/route.ts
// Remove message (admin)

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
    const body = await req.json();
    const mode = String(body.mode || "connect");
    const messageId = String(body.messageId || "");
    const reason = body.reason ? String(body.reason) : null;

    if (!messageId) {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }

    const { error } = await supabase.rpc("admin_remove_message", {
      p_mode: mode,
      p_message_id: messageId,
      p_reason: reason,
    });

    if (error) {
      console.error("[Remove Message API] Error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[Remove Message API] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "remove_failed" }, { status: 500 });
  }
}
