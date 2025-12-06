// app/account/page.tsx
// Account page - Connected to real backend

import { requireUser } from "@/lib/requireUser";
import { AccountClient } from "@/components/AccountClient";

export const metadata = {
  title: "Account | HOTMESS",
  description: "Your account settings",
};

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="opacity-80" style={{ fontSize: '14px' }}>Account</div>
        <h1 className="uppercase tracking-tight" style={{ fontSize: '40px', fontWeight: 900 }}>
          YOUR PROFILE
        </h1>
        <div className="opacity-80" style={{ fontSize: '14px' }}>
          Manage your HOTMESS account
        </div>
      </header>

      <AccountClient user={user} />
    </main>
  );
}