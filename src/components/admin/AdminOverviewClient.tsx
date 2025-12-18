'use client';

/**
 * Admin Dashboard Overview with real backend data
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { StatCard } from '../StatCard';
import { EmptyState } from '../EmptyState';
import { StatCardSkeleton, CardSkeleton } from '../LoadingSkeleton';
import { Users, ShoppingBag, Package, DollarSign, AlertCircle, FileText, Shield } from 'lucide-react';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  userGrowth: string;
  totalOrders: number;
  pendingOrders: number;
  orderGrowth: string;
  totalProducts: number;
  productGrowth: string;
  totalRevenue: number;
  revenueGrowth: string;
}

interface ActionQueues {
  pendingOrders: number;
  pendingReports: number;
  pendingDsar: number;
  pendingSellers: number;
}

export function AdminOverviewClient() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [queues, setQueues] = useState<ActionQueues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setAccessToken(session?.access_token || null);
    }
    getSession();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/stats/overview`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch admin stats');
        }

        const result = await response.json();
        setStats(result.stats);
        setQueues(result.actionQueues);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-white uppercase tracking-wider mb-4" style={{ fontSize: '14px', fontWeight: 900 }}>
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCardSkeleton count={4} />
          </div>
        </div>
        
        <div>
          <h2 className="text-white uppercase tracking-wider mb-4" style={{ fontSize: '14px', fontWeight: 900 }}>
            Action Queues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCardSkeleton count={4} />
          </div>
        </div>

        <div>
          <h2 className="text-white uppercase tracking-wider mb-4" style={{ fontSize: '14px', fontWeight: 900 }}>
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <CardSkeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-red-400" style={{ fontSize: '14px' }}>
          Failed to load admin stats. Please try again.
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <EmptyState
        icon={Shield}
        title="No Admin Data"
        description="Unable to load dashboard statistics."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div>
        <h2 className="text-white uppercase tracking-wider mb-4" style={{ fontSize: '14px', fontWeight: 900 }}>
          Platform Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            sublabel={`${stats.newUsersThisWeek} new this week`}
            trend={stats.userGrowth}
            color="hot"
            animate
          />
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={stats.totalOrders}
            sublabel={`${stats.pendingOrders} pending`}
            trend={stats.orderGrowth}
            color="heat"
            animate
          />
          <StatCard
            icon={Package}
            label="Products"
            value={stats.totalProducts}
            trend={stats.productGrowth}
            color="lime"
            animate
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={`£${(stats.totalRevenue / 100).toFixed(2)}`}
            trend={stats.revenueGrowth}
            color="cyan"
            animate
          />
        </div>
      </div>

      {/* Action Queues */}
      {queues && (
        <div>
          <h2 className="text-white uppercase tracking-wider mb-4" style={{ fontSize: '14px', fontWeight: 900 }}>
            Action Queues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/admin/orders" className="block">
              <div className="rounded-3xl border border-hot/30 bg-hot/5 p-6 hover:bg-hot/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingBag size={24} className="text-hot" />
                  <span className="text-hot" style={{ fontSize: '32px', fontWeight: 700 }}>
                    {queues.pendingOrders}
                  </span>
                </div>
                <p className="text-white/80" style={{ fontSize: '14px', fontWeight: 700 }}>
                  Pending Orders
                </p>
                <p className="text-white/60" style={{ fontSize: '12px' }}>
                  Requires review
                </p>
              </div>
            </a>

            <a href="/admin/moderation" className="block">
              <div className="rounded-3xl border border-heat/30 bg-heat/5 p-6 hover:bg-heat/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle size={24} className="text-heat" />
                  <span className="text-heat" style={{ fontSize: '32px', fontWeight: 700 }}>
                    {queues.pendingReports}
                  </span>
                </div>
                <p className="text-white/80" style={{ fontSize: '14px', fontWeight: 700 }}>
                  Pending Reports
                </p>
                <p className="text-white/60" style={{ fontSize: '12px' }}>
                  Safety & moderation
                </p>
              </div>
            </a>

            <a href="/admin/dsar" className="block">
              <div className="rounded-3xl border border-cyan-static/30 bg-cyan-static/5 p-6 hover:bg-cyan-static/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <FileText size={24} className="text-cyan-static" />
                  <span className="text-cyan-static" style={{ fontSize: '32px', fontWeight: 700 }}>
                    {queues.pendingDsar}
                  </span>
                </div>
                <p className="text-white/80" style={{ fontSize: '14px', fontWeight: 700 }}>
                  DSAR Requests
                </p>
                <p className="text-white/60" style={{ fontSize: '12px' }}>
                  Data access requests
                </p>
              </div>
            </a>

            <a href="/admin/vendors" className="block">
              <div className="rounded-3xl border border-neon-lime/30 bg-neon-lime/5 p-6 hover:bg-neon-lime/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Users size={24} className="text-neon-lime" />
                  <span className="text-neon-lime" style={{ fontSize: '32px', fontWeight: 700 }}>
                    {queues.pendingSellers}
                  </span>
                </div>
                <p className="text-white/80" style={{ fontSize: '14px', fontWeight: 700 }}>
                  Seller Applications
                </p>
                <p className="text-white/60" style={{ fontSize: '12px' }}>
                  Awaiting approval
                </p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-white uppercase tracking-wider mb-4" style={{ fontSize: '14px', fontWeight: 900 }}>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/admin/moderation"
            className="rounded-3xl border p-6 hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield size={24} className="text-hot" />
              <h3 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
                Moderation
              </h3>
            </div>
            <p className="text-white/60" style={{ fontSize: '14px' }}>
              Review reports & take action
            </p>
          </a>

          <a
            href="/admin/beacons"
            className="rounded-3xl border p-6 hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Package size={24} className="text-heat" />
              <h3 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
                Beacons
              </h3>
            </div>
            <p className="text-white/60" style={{ fontSize: '14px' }}>
              Manage beacon network
            </p>
          </a>

          <a
            href="/admin/records"
            className="rounded-3xl border p-6 hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText size={24} className="text-neon-lime" />
              <h3 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
                Records
              </h3>
            </div>
            <p className="text-white/60" style={{ fontSize: '14px' }}>
              RCR releases & catalog
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}