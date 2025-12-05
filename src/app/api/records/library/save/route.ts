// app/api/records/library/save/route.ts
// Save release to user's library

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
    }

    const { releaseId } = await req.json();

    const { error } = await supabase.from("record_library").upsert({
      user_id: userData.user.id,
      release_id: String(releaseId),
    });

    if (error) {
      console.error("Failed to save to library:", error);
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Library save error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
