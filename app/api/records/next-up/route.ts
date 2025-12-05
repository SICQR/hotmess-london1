// app/api/records/next-up/route.ts
// Get next 3 published releases (excluding current)

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const sb = supabaseServer();
    const url = new URL(req.url);
    const releaseId = url.searchParams.get("releaseId");

    let query = sb
      .from("record_releases")
      .select("id,slug,title,artist_name,release_date,catalog_no")
      .eq("is_published", true)
      .order("release_date", { ascending: false })
      .limit(3);

    if (releaseId) {
      query = query.neq("id", releaseId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Next-up fetch error:", error);
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    return NextResponse.json({ ok: true, items: data ?? [] });
  } catch (err) {
    console.error("Next-up exception:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
