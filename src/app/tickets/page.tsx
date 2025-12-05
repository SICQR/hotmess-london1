// app/tickets/page.tsx
// Browse ticket beacons with search + filter
// Main Tickets module landing page

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Search, Map } from "lucide-react";
import TicketsBrowseClient from "./ui/TicketsBrowseClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tickets | HOTMESS",
  description: "Beacons with live listings. Keep it clean. Keep it moving.",
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: { q?: string; city?: string; sort?: string };
}) {
  const q = (searchParams.q || "").trim();
  const city = (searchParams.city || "").trim();
  const sort = (searchParams.sort || "recent").trim();

  // Query ticket beacons from beacons table
  let query = supabase
    .from("beacons")
    .select("id,type,title,city,starts_at,ends_at,is_active,expires_at")
    .eq("type", "ticket")
    .eq("is_active", true)
    .limit(80);

  if (q) query = query.ilike("title", `%${q}%`);
  if (city) query = query.ilike("city", `%${city}%`);

  // Sort
  if (sort === "soon") {
    query = query.order("starts_at", { ascending: true });
  } else {
    query = query.order("starts_at", { ascending: false });
  }

  const { data: beacons } = await query;

  return <TicketsBrowseClient initial={beacons ?? []} />;
}