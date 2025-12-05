// app/my-tickets/page.tsx
// Canonical My Tickets route (replaces /tickets/me)

import { requireUser } from "@/lib/requireUser";
import MyTicketsClient from "@/app/tickets/me/MyTicketsClient";

export const metadata = {
  title: "My Tickets | HOTMESS",
  description: "Your listings, your threads, your receipts. Keep it clean.",
};

export default async function MyTicketsPage() {
  await requireUser();
  return <MyTicketsClient />;
}
