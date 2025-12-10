// app/admin/users/page.tsx
// Admin users management - Connected to real backend

import { requireAdmin } from "@/lib/requireAdmin";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export const metadata = {
  title: "Users | Admin | HOTMESS",
  description: "User management and moderation",
};

export default async function AdminUsersPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="opacity-80" style={{ fontSize: '14px' }}>Admin / Users</div>
        <h1 className="uppercase tracking-tight" style={{ fontSize: '40px', fontWeight: 900 }}>
          USER MANAGEMENT
        </h1>
        <div className="opacity-80" style={{ fontSize: '14px' }}>
          Manage users, roles, and bans
        </div>
      </header>

      <AdminUsersClient />
    </main>
  );
}
