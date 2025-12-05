// app/rewards/page.tsx
// Rewards & XP - Connected to real backend

import { requireUser } from "@/lib/requireUser";
import { RewardsClient } from "@/components/RewardsClient";

export const metadata = {
  title: "Rewards | HOTMESS",
  description: "Your XP & rewards",
};

export default async function RewardsPage() {
  await requireUser();

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="opacity-80" style={{ fontSize: '14px' }}>Rewards</div>
        <h1 className="uppercase tracking-tight" style={{ fontSize: '40px', fontWeight: 900 }}>
          XP & REWARDS
        </h1>
        <div className="opacity-80" style={{ fontSize: '14px' }}>
          Track your activity. Earn rewards.
        </div>
      </header>

      <RewardsClient />
    </main>
  );
}