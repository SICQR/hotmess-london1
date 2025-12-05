// app/admin/beacons/page.tsx
// Admin beacons management - Connected to real backend

import { requireAdmin } from "@/lib/requireAdmin";
import { AdminBeaconsClient } from "@/components/admin/AdminBeaconsClient";

export const metadata = {
  title: "Beacons | Admin | HOTMESS",
  description: "Beacon network management",
};

export default async function AdminBeaconsPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="opacity-80" style={{ fontSize: '14px' }}>Admin / Beacons</div>
        <h1 className="uppercase tracking-tight" style={{ fontSize: '40px', fontWeight: 900 }}>
          BEACON NETWORK
        </h1>
        <div className="opacity-80" style={{ fontSize: '14px' }}>
          Manage beacons, locations, and scan activity
        </div>
      </header>

      <AdminBeaconsClient />
    </main>
  );
}
