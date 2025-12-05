// XP Perks UI - Final Production Design
// Following Phil's complete spec

import { Zap, Crown, Gift, Lock, Check, TrendingUp, ChevronRight } from 'lucide-react';
import { HotmessButton } from '../components/hotmess/Button';
import { XPBar } from '../components/hotmess/XPBar';

interface XPProfileNewProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

// Mock user data - replace with real auth context
const mockUser = {
  level: 4,
  xp: 1280,
  nextLevelXP: 2000,
  city: 'London',
  rank: 12,
};

const unlockedPerks = [
  'Access to 5 interest rooms',
  'Early event RSVPs',
  'Seller follows',
  'Basic leaderboard placement',
];

const nextLevelPerks = [
  'Host micro-events',
  'Drop waitlist priority',
  'City spotlight',
  'Seller room access',
];

const rewards = [
  { id: 1, name: '10% merch discount', xpCost: 500, canRedeem: true },
  { id: 2, name: 'Free drink @ Club X', xpCost: 300, canRedeem: true },
  { id: 3, name: 'Seller 24h boost', xpCost: 1000, canRedeem: true },
  { id: 4, name: 'Event skip-the-line', xpCost: 800, canRedeem: false },
  { id: 5, name: 'Private room access (1 week)', xpCost: 1500, canRedeem: false },
];

const leaderboard = [
  { rank: 1, username: '@alexldn', xp: 12830, level: 8, isUser: false },
  { rank: 2, username: '@jakevoltage', xp: 11200, level: 7, isUser: false },
  { rank: 3, username: '@marcraw', xp: 10900, level: 7, isUser: false },
  { rank: 12, username: '@you', xp: 1280, level: 4, isUser: true },
];

export default function XPProfileNew({ onNavigate }: XPProfileNewProps) {
  return (
    <div className="min-h-screen bg-black py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Your XP Header */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Zap size={36} className="text-yellow-400" />
            <h1 className="text-4xl md:text-5xl text-white uppercase">Your XP</h1>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 via-black to-black rounded-3xl border border-white/10 p-8 md:p-10">
            <div className="flex items-baseline gap-4 mb-6">
              <h2 className="text-5xl md:text-6xl text-white">Level {mockUser.level}</h2>
              <span className="text-2xl text-white/60">{mockUser.xp.toLocaleString()} XP</span>
            </div>

            <XPBar current={mockUser.xp} max={mockUser.nextLevelXP} showLabel height="lg" />

            <div className="mt-6 flex items-center justify-between text-sm text-white/60">
              <span>City Rank: #{mockUser.rank}</span>
              <span>{(mockUser.nextLevelXP - mockUser.xp).toLocaleString()} XP to Level {mockUser.level + 1}</span>
            </div>
          </div>
        </section>

        {/* Perks Unlocked */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Check size={28} className="text-green-400" />
            <h2 className="text-2xl md:text-3xl text-white uppercase">Perks Unlocked</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {unlockedPerks.map((perk, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-5 bg-green-900/10 rounded-2xl border border-green-500/20"
              >
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-green-400" />
                </div>
                <p className="text-white/90">{perk}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Level */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Lock size={28} className="text-yellow-400" />
            <h2 className="text-2xl md:text-3xl text-white uppercase">
              Next Level (Level {mockUser.level + 1} @ {mockUser.nextLevelXP.toLocaleString()} XP)
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {nextLevelPerks.map((perk, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-5 bg-yellow-900/10 rounded-2xl border border-yellow-400/20"
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock size={14} className="text-yellow-400" />
                </div>
                <p className="text-white/90">{perk}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rewards You Can Redeem */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Gift size={28} className="text-hot" />
            <h2 className="text-2xl md:text-3xl text-white uppercase">Rewards You Can Redeem</h2>
          </div>

          <div className="space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  reward.canRedeem
                    ? 'bg-neutral-900 border-white/10 hover:border-white/20'
                    : 'bg-neutral-900/50 border-white/5'
                }`}
              >
                <div className="flex-1">
                  <h3 className={`text-lg mb-1 ${reward.canRedeem ? 'text-white' : 'text-white/40'}`}>
                    {reward.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Zap size={14} className={reward.canRedeem ? 'text-yellow-400' : 'text-white/20'} />
                    <span className={`text-sm ${reward.canRedeem ? 'text-white/60' : 'text-white/30'}`}>
                      {reward.xpCost} XP
                    </span>
                  </div>
                </div>

                <HotmessButton
                  variant={reward.canRedeem ? 'primary' : 'secondary'}
                  disabled={!reward.canRedeem}
                  onClick={() => {
                    // Handle redeem
                  }}
                >
                  {reward.canRedeem ? 'REDEEM' : 'LOCKED'}
                </HotmessButton>
              </div>
            ))}
          </div>
        </section>

        {/* PRO & ELITE */}
        <section>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Crown size={28} className="text-yellow-400" />
              <h2 className="text-2xl md:text-3xl text-white uppercase">PRO & ELITE</h2>
            </div>
            <p className="text-white/60">Unlock permanent perks and boost your XP</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* PRO Tier */}
            <div className="bg-gradient-to-br from-purple-900/30 to-black rounded-3xl border border-purple-500/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-400/30">
                  <h3 className="text-2xl text-white uppercase">PRO</h3>
                </div>
                <span className="text-white/60">Level 3+</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-white/80">
                  <Check size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Full room access</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <Check size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Priority event entry</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <Check size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Exclusive drops</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <Check size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>2x XP multiplier</span>
                </li>
              </ul>

              <HotmessButton
                fullWidth
                onClick={() => onNavigate('pricing')}
                className="bg-purple-600 hover:bg-purple-700 border-purple-500"
              >
                UPGRADE TO PRO
              </HotmessButton>
            </div>

            {/* ELITE Tier */}
            <div className="bg-gradient-to-br from-yellow-900/30 to-black rounded-3xl border border-yellow-400/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-yellow-400/20 rounded-xl border border-yellow-400/30">
                  <h3 className="text-2xl text-white uppercase">ELITE</h3>
                </div>
                <span className="text-white/60">Level 6+</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-white/80">
                  <Check size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Global rooms</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <Check size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Early drops (24h)</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <Check size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>VIP events</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <Check size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>3x XP multiplier</span>
                </li>
              </ul>

              <HotmessButton
                fullWidth
                onClick={() => onNavigate('pricing')}
                className="bg-yellow-600 hover:bg-yellow-700 border-yellow-500"
              >
                UPGRADE TO ELITE
              </HotmessButton>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp size={28} className="text-hot" />
              <h2 className="text-2xl md:text-3xl text-white uppercase">Leaderboard</h2>
            </div>
            <button
              onClick={() => onNavigate('xpProfile')}
              className="text-white/60 hover:text-white transition flex items-center gap-2"
            >
              View Full <ChevronRight size={18} />
            </button>
          </div>

          <div className="bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden">
            {leaderboard.map((entry) => (
              <div
                key={entry.username}
                className={`flex items-center justify-between p-5 border-b border-white/5 last:border-0 ${
                  entry.isUser ? 'bg-hot/10 border-hot/20' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      entry.rank === 1
                        ? 'bg-yellow-400 text-black'
                        : entry.rank === 2
                        ? 'bg-gray-300 text-black'
                        : entry.rank === 3
                        ? 'bg-amber-600 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <div>
                    <p className={`${entry.isUser ? 'text-white' : 'text-white/90'}`}>
                      {entry.username}
                    </p>
                    <p className="text-sm text-white/60">Level {entry.level}</p>
                  </div>
                </div>
                <p className="text-white">{entry.xp.toLocaleString()} XP</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
