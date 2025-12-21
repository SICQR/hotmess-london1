'use client';

/**
 * Client-side Rewards component with real data
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useUserXP, useXPHistory } from '../lib/useUserData';
import { ProgressBar } from './ProgressBar';
import { StatCard } from './StatCard';
import { Zap, TrendingUp, Award, Target } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { StatCardSkeleton, ListItemSkeleton } from './LoadingSkeleton';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function RewardsClient() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setAccessToken(session?.access_token || null);
    }
    getSession();
  }, []);

  const { data: xpData, loading: xpLoading, error: xpError } = useUserXP(accessToken || undefined);
  const { data: xpHistory, loading: historyLoading } = useXPHistory(accessToken || undefined, 10);

  if (xpLoading) {
    return (
      <div className="space-y-6">
        {/* XP Overview Skeleton */}
        <div className="rounded-3xl border border-hot/30 bg-hot/5 p-6 space-y-4 animate-pulse">
          <div className="h-8 w-32 bg-white/10 rounded mb-2" />
          <div className="h-3 w-full bg-white/10 rounded" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton count={4} />
        </div>

        {/* Activity Skeleton */}
        <div className="rounded-3xl border p-6">
          <div className="h-4 w-40 bg-white/10 rounded mb-4" />
          <div className="space-y-3">
            <ListItemSkeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (xpError) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-red-400" style={{ fontSize: '14px' }}>
          Failed to load rewards data. Please try again.
        </p>
      </div>
    );
  }

  if (!xpData) {
    return (
      <EmptyState
        icon={Zap}
        title="No XP Data Yet"
        description="Start scanning beacons and attending events to earn XP!"
        actionLabel="Explore Map"
      />
    );
  }

  const xpProgress = ((xpData.totalXP % xpData.nextLevelXP) / xpData.nextLevelXP) * 100;
  const xpNeeded = xpData.nextLevelXP - (xpData.totalXP % xpData.nextLevelXP);

  return (
    <div className="space-y-6">
      {/* XP Overview */}
      <div className="rounded-3xl border border-hot/30 bg-hot/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white uppercase tracking-tight mb-1" style={{ fontSize: '24px', fontWeight: 900 }}>
              Level {xpData.level}
            </h2>
            <p className="text-white/60" style={{ fontSize: '14px' }}>
              {xpData.totalXP.toLocaleString()} Total XP
            </p>
          </div>
          <div className="text-right">
            <div className="text-hot" style={{ fontSize: '32px', fontWeight: 700 }}>
              {xpData.currentMultiplier}x
            </div>
            <p className="text-white/60" style={{ fontSize: '12px' }}>Multiplier</p>
          </div>
        </div>

        <ProgressBar
          current={xpData.totalXP % xpData.nextLevelXP}
          max={xpData.nextLevelXP}
          label={`${xpNeeded.toLocaleString()} XP to Level ${xpData.level + 1}`}
          color="hot"
          size="lg"
          animated
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Zap}
          label="Total XP"
          value={xpData.totalXP}
          color="hot"
          animate
        />
        <StatCard
          icon={Award}
          label="Current Level"
          value={xpData.level}
          color="heat"
          animate
        />
        <StatCard
          icon={Target}
          label="Day Streak"
          value={xpData.streakDays}
          sublabel={xpData.streakDays > 0 ? 'Keep it up! 🔥' : 'Start your streak today'}
          color="lime"
          animate
        />
        <StatCard
          icon={TrendingUp}
          label="Global Rank"
          value={xpData.rank || 0}
          sublabel={xpData.cityRank ? `#${xpData.cityRank} in your city` : undefined}
          color="cyan"
          animate
        />
      </div>

      {/* Recent Activity */}
      {xpHistory && xpHistory.length > 0 && (
        <div className="rounded-3xl border p-6">
          <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontSize: '14px', fontWeight: 900 }}>
            Recent XP Activity
          </h3>
          <div className="space-y-3">
            {xpHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Zap className="text-hot" size={20} />
                  <div>
                    <p className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
                      {entry.action}
                    </p>
                    <p className="text-white/60" style={{ fontSize: '12px' }}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-hot" style={{ fontSize: '18px', fontWeight: 700 }}>
                  +{entry.amount} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon */}
      <div className="rounded-3xl border p-8 text-center space-y-4">
        <div style={{ fontSize: '48px' }}>🎁</div>
        <div className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>
          Rewards Store Coming Soon
        </div>
        <p className="text-white/60 max-w-md mx-auto" style={{ fontSize: '14px' }}>
          Redeem your XP for exclusive perks, merch, and access to special events.
        </p>
      </div>
    </div>
  );
}