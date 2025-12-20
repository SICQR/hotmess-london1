/**
 * REWARDS PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { Zap, Gift, Trophy, Lock } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMRewardCard } from '../../components/library/HMCard';
import { HMXPMeter } from '../../components/library/HMXPMeter';
import { HMTabs } from '../../components/library/HMTabs';

interface RewardsPageProps {
  onNavigate: (page: string) => void;
}

export function RewardsPage({ onNavigate }: RewardsPageProps) {
  const userXP = 2847;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            Rewards
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Earn XP. Unlock rewards. The more you show up, the more you get.
          </p>
        </div>
      </section>

      {/* XP Status */}
      <section className="px-6 py-12 bg-charcoal/50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl text-white mb-1">Your XP</h3>
              <p className="text-gray-400 text-sm">Level 12</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-hot">
              <Zap size={24} className="text-hot" />
              <span className="text-2xl text-hot">{userXP.toLocaleString()}</span>
            </div>
          </div>
          <HMXPMeter current={2847} max={5000} level={12} showPercentage />
          
          <div className="mt-6 text-center">
            <HMButton variant="secondary" onClick={() => onNavigate('map')}>
              Scan Beacons to Earn More
            </HMButton>
          </div>
        </div>
      </section>

      {/* Rewards Catalog */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'available',
                label: 'Available',
                content: (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <HMRewardCard
                      name="Free Drink Token"
                      description="Redeem at any HOTMESS event for one free drink."
                      cost={500}
                      locked={false}
                      canAfford={true}
                      onRedeem={() => alert('Redeemed!')}
                    />
                    <HMRewardCard
                      name="10% Off Shop"
                      description="One-time 10% discount on any shop purchase."
                      cost={750}
                      locked={false}
                      canAfford={true}
                      onRedeem={() => alert('Redeemed!')}
                    />
                    <HMRewardCard
                      name="Priority Entry"
                      description="Skip the line at partner venues for one night."
                      cost={1200}
                      locked={false}
                      canAfford={true}
                      onRedeem={() => alert('Redeemed!')}
                    />
                    <HMRewardCard
                      name="Exclusive Merch Drop"
                      description="Early access to limited edition HOTMESS gear."
                      cost={2000}
                      locked={false}
                      canAfford={true}
                      onRedeem={() => alert('Redeemed!')}
                    />
                    <HMRewardCard
                      name="VIP Event Access"
                      description="Invitation to exclusive HOTMESS events."
                      cost={3000}
                      locked={false}
                      canAfford={false}
                    />
                    <HMRewardCard
                      name="Custom Profile Badge"
                      description="Unlock a unique badge for your profile."
                      cost={1500}
                      locked={false}
                      canAfford={true}
                      onRedeem={() => alert('Redeemed!')}
                    />
                  </div>
                ),
              },
              {
                id: 'locked',
                label: 'Locked',
                content: (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <HMRewardCard
                      name="Secret Beacon Location"
                      description="Unlock coordinates for a hidden high-XP beacon."
                      cost={5000}
                      locked={true}
                      canAfford={false}
                    />
                    <HMRewardCard
                      name="Founder's Circle"
                      description="Lifetime access to all HOTMESS events."
                      cost={10000}
                      locked={true}
                      canAfford={false}
                    />
                    <HMRewardCard
                      name="Private Radio Show"
                      description="Host your own show on HOTMESS Radio."
                      cost={7500}
                      locked={true}
                      canAfford={false}
                    />
                  </div>
                ),
              },
              {
                id: 'redeemed',
                label: 'Redeemed',
                content: (
                  <div className="text-center py-12">
                    <Gift size={64} className="mx-auto mb-6 text-gray-600" />
                    <p className="text-gray-400">You haven't redeemed any rewards yet.</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Start earning XP and redeem your first reward!
                    </p>
                  </div>
                ),
              },
            ]}
            defaultTab="available"
          />
        </div>
      </section>

      {/* How to Earn XP */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="mb-8 text-2xl text-hot uppercase tracking-wider text-center">
            How to Earn XP
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-black/50 border border-hot/30 text-center">
              <Zap size={40} className="mx-auto mb-4 text-hot" />
              <h4 className="mb-2 text-white uppercase tracking-wider text-sm">Scan Beacons</h4>
              <p className="text-3xl text-hot mb-2">15-50 XP</p>
              <p className="text-xs text-gray-500">Per scan</p>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30 text-center">
              <Gift size={40} className="mx-auto mb-4 text-hot" />
              <h4 className="mb-2 text-white uppercase tracking-wider text-sm">Shop Purchases</h4>
              <p className="text-3xl text-hot mb-2">10-45 XP</p>
              <p className="text-xs text-gray-500">Per item</p>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30 text-center">
              <Trophy size={40} className="mx-auto mb-4 text-hot" />
              <h4 className="mb-2 text-white uppercase tracking-wider text-sm">Events</h4>
              <p className="text-3xl text-hot mb-2">50-200 XP</p>
              <p className="text-xs text-gray-500">Per event</p>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30 text-center">
              <Lock size={40} className="mx-auto mb-4 text-hot" />
              <h4 className="mb-2 text-white uppercase tracking-wider text-sm">Achievements</h4>
              <p className="text-3xl text-hot mb-2">100-500 XP</p>
              <p className="text-xs text-gray-500">Special unlocks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="mb-8 text-2xl text-hot uppercase tracking-wider">
            Top Brotherhood
          </h3>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'HeatSeeker', xp: 12847, level: 24 },
              { rank: 2, name: 'NightMess', xp: 10293, level: 21 },
              { rank: 3, name: 'SweatKing', xp: 9847, level: 20 },
              { rank: 4, name: 'VauxhallBoy', xp: 8293, level: 18 },
              { rank: 5, name: 'MessyBeast', xp: 7482, level: 16 },
            ].map((user) => (
              <div
                key={user.rank}
                className="flex items-center gap-4 p-4 bg-black/50 border border-hot/30 hover:border-hot transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-hot/20 border border-hot text-hot text-xl">
                  #{user.rank}
                </div>
                <div className="flex-1">
                  <h4 className="text-white">{user.name}</h4>
                  <p className="text-sm text-gray-400">Level {user.level}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-hot" />
                  <span className="text-hot">{user.xp.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <HMButton variant="tertiary" onClick={() => onNavigate('community')}>
              View Full Leaderboard
            </HMButton>
          </div>
        </div>
      </section>
    </div>
  );
}
