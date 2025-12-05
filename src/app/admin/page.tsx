// app/admin/page.tsx
// Admin dashboard - Connected to real backend

import { requireAdmin } from "@/lib/requireAdmin";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export const metadata = {
  title: "Admin | HOTMESS",
  description: "Admin dashboard",
};

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="opacity-80" style={{ fontSize: '14px' }}>Admin</div>
        <h1 className="uppercase tracking-tight" style={{ fontSize: '40px', fontWeight: 900 }}>
          DASHBOARD
        </h1>
        <div className="opacity-80" style={{ fontSize: '14px' }}>
          System admin controls
        </div>
      </header>

      <AdminOverviewClient />
    </main>
  );
}