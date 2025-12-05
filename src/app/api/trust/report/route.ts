// app/api/trust/report/route.ts
// Create user report (feeds moderation queue)

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
    const { targetType, targetId, reasonCode, details } = await req.json();

    const { data, error } = await supabase.rpc("create_report", {
      p_target_type: targetType,
      p_target_id: String(targetId),
      p_reason_code: String(reasonCode),
      p_details: details ? String(details) : null,
    });

    if (error) {
      console.error("[Report] Error:", error);
      
      // Map specific errors to user-friendly messages
      if (error.message.includes("rate_limited")) {
        return NextResponse.json({ ok: false, error: "You've submitted too many reports. Try again later." }, { status: 429 });
      }
      
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, reportId: data });
  } catch (e: any) {
    console.error("[Report] Fatal error:", e);
    return NextResponse.json({ ok: false, error: e.message || "Failed to submit report" }, { status: 500 });
  }
}
