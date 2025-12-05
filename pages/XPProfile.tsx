// XP Profile - Gamification profile with perks and rewards

import { Zap, Crown, Gift, Users, Calendar, ShoppingBag, ArrowRight, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrutalistCard } from "@/components/layouts/BrutalistCard";
import { typography, spacing } from "@/lib/design-system";
import { Badge } from "@/components/ui/badge";

interface XPProfileProps {
  onNavigate: (route: string) => void;
}

// Mock user data - replace with real API
const mockUser = {
  level: 4,
  xp: 1280,
  nextLevelXP: 2000,
  city: "London",
  rank: 12,
};

const unlockedPerks = [
  "Access to 5 interest rooms",
  "Early event RSVPs",
  "Seller follows",
  "Basic leaderboard placement",
];

const nextLevelPerks = [
  "Host micro-events",
  "Drop waitlist priority",
  "City spotlight",
  "Advanced room access",
];

const availableRewards = [
  { id: 1, name: "10% merch discount", xpCost: 500, available: true },
  { id: 2, name: "Free drink @ Eagle London", xpCost: 300, available: true },
  { id: 3, name: "Seller 24h boost", xpCost: 1000, available: true },
  { id: 4, name: "Event skip-the-line", xpCost: 800, available: false },
];

const subscriptionTiers = [
  {
    name: "PRO",
    level: 3,
    price: "£9/mo",
    perks: [
      "Full room access",
      "Priority event entry",
      "Exclusive drops",
      "2x XP multiplier",
      "Ad-free experience",
    ],
    eligible: true,
  },
  {
    name: "ELITE",
    level: 6,
    price: "£19/mo",
    perks: [
      "Global room access",
      "Early drop access (24h)",
      "VIP events",
      "3x XP multiplier",
      "Host privileges",
      "Elite badge",
    ],
    eligible: false,
  },
];

// Mock leaderboard
const topUsers = [
  { rank: 1, username: "@wolf_ldn", xp: 12830, city: "London" },
  { rank: 2, username: "@bearking", xp: 11200, city: "London" },
  { rank: 3, username: "@nightowl", xp: 10900, city: "London" },
  { rank: 12, username: "@you", xp: 1280, city: "London", isUser: true },
];

export default function XPProfile({ onNavigate }: XPProfileProps) {
  const xpProgress = (mockUser.xp / mockUser.nextLevelXP) * 100;

  return (
    <main className={spacing.pageContainer + " " + spacing.sectionVertical}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className={typography.h1 + " text-hot"}>Your XP</h1>
        <p className="text-sm opacity-70">
          Level {mockUser.level} · Rank #{mockUser.rank} in {mockUser.city}
        </p>
      </div>

      {/* XP Progress */}
      <BrutalistCard variant="section">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-hot">
                Level {mockUser.level}
              </div>
              <div className="text-sm opacity-70">
                {mockUser.xp.toLocaleString()} / {mockUser.nextLevelXP.toLocaleString()} XP
              </div>
            </div>
            <Zap className="h-12 w-12 text-hot" />
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-hot transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="text-xs opacity-50 text-right">
              {Math.round(mockUser.nextLevelXP - mockUser.xp)} XP to Level {mockUser.level + 1}
            </div>
          </div>
        </div>
      </BrutalistCard>

      {/* Perks Unlocked */}
      <section className="space-y-6">
        <h2 className={typography.h2}>Perks Unlocked</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {unlockedPerks.map((perk, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-5 flex items-center gap-3"
            >
              <Check className="h-5 w-5 text-hot flex-shrink-0" />
              <div className="text-sm font-bold">{perk}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Level */}
      <BrutalistCard variant="section">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-hot" />
            <h2 className={typography.h2}>Next Level (Level {mockUser.level + 1} @ {mockUser.nextLevelXP.toLocaleString()} XP)</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {nextLevelPerks.map((perk, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-black/10 p-4 flex items-center gap-3 opacity-70"
              >
                <Lock className="h-4 w-4 text-hot flex-shrink-0" />
                <div className="text-sm">{perk}</div>
              </div>
            ))}
          </div>
        </div>
      </BrutalistCard>

      {/* Rewards You Can Redeem */}
      <section className="space-y-6">
        <h2 className={typography.h2}>Rewards You Can Redeem</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {availableRewards.map((reward) => (
            <div
              key={reward.id}
              className={`rounded-2xl border p-6 transition-all ${
                reward.available
                  ? "border-white/10 bg-black/20 backdrop-blur-sm hover:border-white/20 hover:bg-black/30"
                  : "border-white/5 bg-black/10 opacity-50"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="font-bold">{reward.name}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-hot" />
                      <span className="text-hot">{reward.xpCost} XP</span>
                    </div>
                  </div>
                  <Gift className="h-6 w-6 text-hot flex-shrink-0" />
                </div>
                {reward.available ? (
                  <Button
                    variant="outline"
                    className="w-full border-hot/50 bg-hot/10 text-hot hover:bg-hot hover:text-black"
                  >
                    Redeem
                  </Button>
                ) : (
                  <div className="text-xs opacity-50 text-center">
                    Not enough XP
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRO & ELITE */}
      <section className="space-y-6">
        <h2 className={typography.h2}>PRO & ELITE</h2>
        <p className="text-sm opacity-70">
          Upgrade your status. Unlock exclusive perks.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {subscriptionTiers.map((tier) => (
            <BrutalistCard key={tier.name}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Crown className="h-8 w-8 text-hot" />
                      <div>
                        <div className="text-2xl font-bold text-hot">{tier.name}</div>
                        <div className="text-sm opacity-70">Level {tier.level}+ required</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold">{tier.price}</div>
                  </div>
                  {!tier.eligible && (
                    <Badge variant="outline" className="text-xs">
                      Reach Level {tier.level} to unlock
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  {tier.perks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-hot flex-shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  className={`w-full ${
                    tier.eligible
                      ? "border-hot/50 bg-hot/10 text-hot hover:bg-hot hover:text-black"
                      : "border-white/10 bg-black/10 opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!tier.eligible}
                >
                  {tier.eligible ? `Upgrade to ${tier.name}` : "Locked"}
                </Button>
              </div>
            </BrutalistCard>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={typography.h2}>Leaderboard</h2>
          <button
            onClick={() => onNavigate("/?route=leaderboard")}
            className="text-sm uppercase tracking-wide text-hot hover:underline inline-flex items-center gap-1"
          >
            View Full <ArrowRight className="h-3 w-3" />
            </button>
        </div>
        <BrutalistCard>
          <div className="space-y-4">
            {topUsers.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between py-3 border-b border-white/10 last:border-0 ${
                  entry.isUser ? "bg-hot/5 -mx-6 px-6 rounded-xl" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-hot w-8">
                    {entry.rank}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {entry.username}
                      {entry.isUser && <Badge variant="outline" className="text-xs">You</Badge>}
                    </div>
                    <div className="text-xs opacity-50">{entry.city}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Zap className="h-4 w-4 text-hot" />
                  {entry.xp.toLocaleString()} XP
                </div>
              </div>
            ))}
          </div>
        </BrutalistCard>
      </section>

      {/* How to Earn XP */}
      <BrutalistCard variant="section">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h2 className={typography.h2}>How to Earn XP</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[
              { action: "Scan beacons", xp: "+20-50 XP" },
              { action: "Join rooms", xp: "+10 XP" },
              { action: "Post in rooms", xp: "+2 XP" },
              { action: "Buy tickets", xp: "+40 XP" },
              { action: "Attend events", xp: "+50 XP" },
              { action: "Buy drops", xp: "+30 XP" },
              { action: "Listen to radio", xp: "+5 XP/hr" },
              { action: "Complete challenges", xp: "+100 XP" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/10"
              >
                <div className="text-sm">{item.action}</div>
                <div className="text-sm font-bold text-hot">{item.xp}</div>
              </div>
            ))}
          </div>
        </div>
      </BrutalistCard>
    </main>
  );
}
