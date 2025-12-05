// app/api/tickets/listing/[listingId]/route.ts
// API route to fetch listing details for thread context header
// Used when thread opens with ?listingId= query param

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ticketGetListing } from "@/lib/tickets/rpc";

export const runtime = "nodejs";

export async function GET(
  _: Request,
  { params }: { params: { listingId: string } }
) {
  // Listing detail is safe to show — RPC enforces visibility rules
  try {
    const listing = await ticketGetListing(supabase as any, params.listingId);

    if (!listing) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, listing });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "failed" },
      { status: 400 }
    );
  }
}
