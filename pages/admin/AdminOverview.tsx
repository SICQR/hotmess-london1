import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, AlertCircle } from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AdminOverviewProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface DashboardStats {
  revenue: { value: number; change: number };
  orders: { value: number; change: number };
  users: { value: number; change: number };
  vendors: { value: number; change: number };
}

interface QueueItem {
  id: string;
  type: 'vendor' | 'moderation' | 'care' | 'dsar';
  title: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export function AdminOverview({ onNavigate }: AdminOverviewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call real admin API
      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/admin`;
      const response = await fetch(`${API_BASE}/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load dashboard data');
      }

      const data = await response.json();
      
      // Map API response to stats
      setStats({
        revenue: { 
          value: data.stats.totalRevenue || 0, 
          change: parseFloat(data.stats.revenueGrowth) || 0 
        },
        orders: { 
          value: data.stats.totalOrders || 0, 
          change: parseFloat(data.stats.orderGrowth) || 0 
        },
        users: { 
          value: data.stats.totalUsers || 0, 
          change: parseFloat(data.stats.userGrowth) || 0 
        },
        vendors: { 
          value: data.stats.totalProducts || 0, 
          change: parseFloat(data.stats.productGrowth) || 0 
        }
      });

      // Map action queues
      const actionQueues: QueueItem[] = [];
      
      if (data.actionQueues.pendingOrders > 0) {
        actionQueues.push({
          id: 'pending-orders',
          type: 'vendor',
          title: `${data.actionQueues.pendingOrders} pending orders need review`,
          priority: 'high',
          createdAt: 'Now'
        });
      }

      if (data.actionQueues.pendingReports > 0) {
        actionQueues.push({
          id: 'pending-reports',
          type: 'moderation',
          title: `${data.actionQueues.pendingReports} reports need moderation`,
          priority: 'high',
          createdAt: 'Now'
        });
      }

      if (data.actionQueues.pendingDsar > 0) {
        actionQueues.push({
          id: 'pending-dsar',
          type: 'dsar',
          title: `${data.actionQueues.pendingDsar} DSAR requests pending`,
          priority: 'medium',
          createdAt: 'Now'
        });
      }

      setQueues(actionQueues);
      setLoading(false);

    } catch (err) {
      console.error('Dashboard data error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout currentRoute="admin" onNavigate={onNavigate}><LoadingState /></AdminLayout>;
  if (error) return <AdminLayout currentRoute="admin" onNavigate={onNavigate}><ErrorState message={error} onRetry={loadDashboardData} /></AdminLayout>;

  const StatCard = ({ title, value, change, icon: Icon }: any) => (
    <div className="bg-white/5 border border-white/10 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>{title}</div>
          <div className="text-hot mt-2" style={{ fontWeight: 900, fontSize: '36px' }}>{value}</div>
        </div>
        <div className="p-3 bg-white/10">
          <Icon className="w-6 h-6 text-hot" />
        </div>
      </div>
      <div className={`flex items-center gap-1 uppercase tracking-wider ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} style={{ fontWeight: 700, fontSize: '12px' }}>
        {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{Math.abs(change)}% vs last period</span>
      </div>
    </div>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 border-red-500/20 bg-red-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
      default: return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
    }
  };

  const getQueueRoute = (type: string): RouteId => {
    switch (type) {
      case 'vendor': return 'adminVendors';
      case 'moderation': return 'adminModeration';
      case 'care': return 'care';
      case 'dsar': return 'adminDsar';
      default: return 'admin';
    }
  };

  return (
    <AdminLayout currentRoute="adminOverview" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            OPERATOR CONSOLE
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            System overview and action queues
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Revenue (30d)"
            value={`£${stats?.revenue.value.toLocaleString()}`}
            change={stats?.revenue.change || 0}
            icon={TrendingUp}
          />
          <StatCard
            title="Orders (30d)"
            value={stats?.orders.value}
            change={stats?.orders.change || 0}
            icon={ShoppingCart}
          />
          <StatCard
            title="Active Users"
            value={stats?.users.value.toLocaleString()}
            change={stats?.users.change || 0}
            icon={Users}
          />
          <StatCard
            title="Vendors"
            value={stats?.vendors.value}
            change={stats?.vendors.change || 0}
            icon={Package}
          />
        </div>

        {/* Action Queues */}
        <div className="bg-white/5 border border-white/10 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="uppercase tracking-wider text-white" style={{ fontWeight: 900, fontSize: '24px' }}>
              ACTION QUEUES
            </h2>
            <div className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
              {queues.length} items require attention
            </div>
          </div>

          {queues.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
                All clear. No pending actions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {queues.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(getQueueRoute(item.type))}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-hot/20 border border-white/10 hover:border-hot transition-all text-left"
                >
                  <div className={`px-3 py-1 border uppercase tracking-wider ${getPriorityColor(item.priority)}`} style={{ fontWeight: 700, fontSize: '10px' }}>
                    {item.priority}
                  </div>
                  <div className="flex-1">
                    <div className="text-white/40 uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '11px' }}>
                      {item.type}
                    </div>
                    <div className="text-white" style={{ fontWeight: 400, fontSize: '14px' }}>
                      {item.title}
                    </div>
                  </div>
                  <div className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                    {item.createdAt}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('adminProducts')}
            className="p-6 bg-white/5 border border-white/10 hover:border-hot transition-all text-left group"
          >
            <Package className="w-8 h-8 text-hot mb-3" />
            <div className="text-white uppercase tracking-wider mb-1 group-hover:text-hot transition-colors" style={{ fontWeight: 900, fontSize: '16px' }}>
              CREATE PRODUCT
            </div>
            <div className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
              Add a new shop product
            </div>
          </button>
          <button
            onClick={() => onNavigate('adminContent')}
            className="p-6 bg-white/5 border border-white/10 hover:border-hot transition-all text-left group"
          >
            <Package className="w-8 h-8 text-hot mb-3" />
            <div className="text-white uppercase tracking-wider mb-1 group-hover:text-hot transition-colors" style={{ fontWeight: 900, fontSize: '16px' }}>
              MANAGE RADIO
            </div>
            <div className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
              Schedule shows and episodes
            </div>
          </button>
          <button
            onClick={() => onNavigate('adminAudit')}
            className="p-6 bg-white/5 border border-white/10 hover:border-hot transition-all text-left group"
          >
            <Package className="w-8 h-8 text-hot mb-3" />
            <div className="text-white uppercase tracking-wider mb-1 group-hover:text-hot transition-colors" style={{ fontWeight: 900, fontSize: '16px' }}>
              VIEW LOGS
            </div>
            <div className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
              System audit trail
            </div>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}