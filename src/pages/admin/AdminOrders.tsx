import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { Search, RefreshCw, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AdminOrdersProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  createdAt: string;
  source: 'shop' | 'market';
}

export function AdminOrders({ onNavigate }: AdminOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/admin`;
      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setLoading(false);

    } catch (err) {
      console.error('Load orders error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      setLoading(false);
    }
  };

  const handleRefund = async (orderId: string, amount?: string) => {
    try {
      // TODO: Implement refund API call
      console.log('Refunding order:', orderId, 'Amount:', amount);
      toast.success(`Order ${orderId} refunded successfully`);
      setShowRefundModal(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      toast.error('Failed to process refund');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // TODO: Implement status update API call
      console.log('Updating order:', orderId, 'Status:', newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'shipped': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'refunded': return 'text-white/40 bg-white/5 border-white/20';
      default: return 'text-white/40 bg-white/5 border-white/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <AdminLayout currentRoute="adminOrders" onNavigate={onNavigate}><LoadingState /></AdminLayout>;
  if (error) return <AdminLayout currentRoute="adminOrders" onNavigate={onNavigate}><ErrorState message={error} onRetry={loadOrders} /></AdminLayout>;

  return (
    <AdminLayout currentRoute="adminOrders" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
              ORDERS
            </h1>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              Manage shop and market orders
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-4 py-3 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all"
            style={{ fontWeight: 900, fontSize: '13px' }}
          >
            <RefreshCw className="w-4 h-4" />
            REFRESH
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot"
              style={{ fontWeight: 400, fontSize: '14px' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot"
            style={{ fontWeight: 400, fontSize: '14px' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="NO ORDERS FOUND"
            message={searchQuery || statusFilter !== 'all' ? 
              "No orders match your filters. Try adjusting your search." : 
              "No orders have been placed yet."
            }
            primaryCTA={{
              label: 'CLEAR FILTERS',
              onClick: () => {
                setSearchQuery('');
                setStatusFilter('all');
              }
            }}
            secondaryCTA={{
              label: 'VIEW SHOP',
              onClick: () => onNavigate('shop')
            }}
          />
        ) : (
          <div className="bg-white/5 border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-black border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>Order</th>
                  <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>Customer</th>
                  <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>Items</th>
                  <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>Total</th>
                  <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>Status</th>
                  <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>Source</th>
                  <th className="px-6 py-4 text-left text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white" style={{ fontWeight: 700, fontSize: '14px' }}>{order.orderNumber}</div>
                      <div className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>{order.createdAt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white" style={{ fontWeight: 700, fontSize: '14px' }}>{order.customer}</div>
                      <div className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>{order.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80" style={{ fontWeight: 400, fontSize: '14px' }}>{order.items}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white" style={{ fontWeight: 700, fontSize: '14px' }}>£{order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 border uppercase tracking-wider ${getStatusColor(order.status)}`} style={{ fontWeight: 700, fontSize: '11px' }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                        {order.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'processing')}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors"
                            title="Mark as Processing"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === 'processing' || order.status === 'pending') && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setRefundAmount(order.total.toString());
                              setShowRefundModal(true);
                            }}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                            title="Refund Order"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="bg-black border border-hot/30 text-white">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '24px' }}>REFUND ORDER</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-white/60 mb-4" style={{ fontWeight: 400, fontSize: '14px' }}>
                Refunding order {selectedOrder?.orderNumber} for {selectedOrder?.customer}
              </p>
              <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>Refund Amount (£)</label>
              <input
                type="number"
                step="0.01"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-white/20 text-white focus:outline-none focus:border-hot"
                style={{ fontWeight: 400, fontSize: '14px' }}
              />
              <p className="text-white/40 mt-1" style={{ fontWeight: 400, fontSize: '12px' }}>
                Original amount: £{selectedOrder?.total.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => selectedOrder && handleRefund(selectedOrder.id, refundAmount)}
                className="flex-1 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider"
                style={{ fontWeight: 900, fontSize: '13px' }}
              >
                CONFIRM REFUND
              </Button>
              <Button
                onClick={() => setShowRefundModal(false)}
                variant="outline"
                className="flex-1 border-white/20 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '13px' }}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}