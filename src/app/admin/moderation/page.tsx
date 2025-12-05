// app/admin/moderation/page.tsx
// Server wrapper for admin moderation desk

import { requireAdmin } from "@/lib/requireAdmin";
import ModerationDeskClient from "./ModerationDeskClient";

export default async function ModerationPage() {
  await requireAdmin();
  return <ModerationDeskClient />;
}
