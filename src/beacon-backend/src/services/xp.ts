const MAX_DAILY_XP = 500;

export async function awardXP({
  userId,
  beaconId,
  amount,
  reason
}: {
  userId: string;
  beaconId?: string;
  amount: number;
  reason: string;
}) {
  if (amount <= 0) return;
  console.log("[XP] award", { userId, beaconId, amount, reason });
  // Real implementation: membership tier, caps, DB writes.
}
