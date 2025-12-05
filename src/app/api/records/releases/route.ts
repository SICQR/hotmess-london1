// app/api/records/releases/route.ts
// Public releases list API

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("record_releases")
      .select("id,slug,title,artist_name,release_type,catalog_no,release_date,cover_asset_id,is_explicit,access,premium_early_until")
      .eq("is_published", true)
      .order("release_date", { ascending: false })
      .limit(60);

    if (error) {
      console.error("Failed to fetch releases:", error);
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    return NextResponse.json({ ok: true, items: data ?? [] });
  } catch (err) {
    console.error("Releases API error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
