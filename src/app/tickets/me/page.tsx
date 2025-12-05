// app/tickets/me/page.tsx
// My Tickets: Seller dashboard (server wrapper)

import { requireUser } from "@/lib/requireUser";
import MyTicketsClient from "./MyTicketsClient";

export const metadata = {
  title: "My Tickets | HOTMESS",
  description: "Your listings, your threads, your receipts. Keep it clean.",
};

export default async function MyTicketsPage() {
  await requireUser();
  return <MyTicketsClient />;
}
