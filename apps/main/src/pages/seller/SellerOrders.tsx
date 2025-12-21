import { useState, useEffect } from 'react';
import { SellerLayout } from '../../components/layouts/SellerLayout';
import { RouteId } from '../../lib/routes';
import { supabase } from '../../lib/supabase';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';

interface SellerOrdersProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Order {
  id: string;
  status: string;
  total_pence: number;
  currency: string;
  buyer_shipping: any;
  notes: string | null;
  created_at: string;
  accepted_at: string | null;
  shipped_at: string | null;
  items: Array<{
    title: string;
    quantity: number;
    unit_price_pence: number;
  }>;
  shipments: Array<{
    carrier: string | null;
    tracking_number: string | null;
    tracking_url: string | null;
    shipped_at: string;
  }>;
}

const STATUS_CONFIG = {
  paid: { label: 'NEW ORDER', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertCircle },
  accepted: { label: 'ACCEPTED', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Clock },
  shipped: { label: 'SHIPPED', color: 'text-green-500', bg: 'bg-green-500/10', icon: Truck },
  delivered: { label: 'DELIVERED', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
  cancelled: { label: 'CANCELLED', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle },
  refunded: { label: 'REFUNDED', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle },
};

export function SellerOrders({ onNavigate }: SellerOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Ship modal state
  const [showShipModal, setShowShipModal] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      // Get seller record
      const { data: seller, error: sellerError } = await supabase
        .from('market_sellers')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (sellerError || !seller) {
        console.error('Seller not found:', sellerError);
        setError('Seller account not found');
        setLoading(false);
        return;
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('market_orders')
        .select(`
          *,
          items:market_order_items(*),
          shipments:market_shipments(*)
        `)
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        setError('Failed to load orders');
        setLoading(false);
        return;
      }

      setOrders((ordersData as any) || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      setActionLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Not authenticated');
        setActionLoading(false);
        return;
      }

      // Call Edge Function (or direct update if using client)
      // For now, direct update:
      const { error: updateError } = await supabase
        .from('market_orders')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error accepting order:', updateError);
        setError('Failed to accept order');
        setActionLoading(false);
        return;
      }

      // Reload orders
      await loadOrders();
      setActionLoading(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error accepting order:', err);
      setError(err instanceof Error ? err.message : 'Failed to accept order');
      setActionLoading(false);
    }
  };

  const openShipModal = (order: Order) => {
    setSelectedOrder(order);
    setShowShipModal(true);
    setCarrier('');
    setTrackingNumber('');
    setTrackingUrl('');
  };

  const shipOrder = async () => {
    if (!selectedOrder) return;

    try {
      setActionLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Not authenticated');
        setActionLoading(false);
        return;
      }

      // Create shipment
      const { error: shipmentError } = await supabase
        .from('market_shipments')
        .insert({
          order_id: selectedOrder.id,
          carrier: carrier.trim() || null,
          tracking_number: trackingNumber.trim() || null,
          tracking_url: trackingUrl.trim() || null,
          shipped_at: new Date().toISOString(),
        });

      if (shipmentError) {
        console.error('Error creating shipment:', shipmentError);
        setError('Failed to create shipment');
        setActionLoading(false);
        return;
      }

      // Update order status
      const { error: updateError } = await supabase
        .from('market_orders')
        .update({
          status: 'shipped',
          shipped_at: new Date().toISOString(),
        })
        .eq('id', selectedOrder.id);

      if (updateError) {
        console.error('Error updating order:', updateError);
        setError('Failed to update order');
        setActionLoading(false);
        return;
      }

      // Reload orders
      await loadOrders();
      setActionLoading(false);
      setShowShipModal(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error shipping order:', err);
      setError(err instanceof Error ? err.message : 'Failed to ship order');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout currentRoute="sellerOrders" onNavigate={onNavigate}>
        <LoadingState />
      </SellerLayout>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === 'paid');
  const activeOrders = orders.filter((o) => o.status === 'accepted');
  const shippedOrders = orders.filter((o) => ['shipped', 'delivered'].includes(o.status));

  return (
    <SellerLayout currentRoute="sellerOrders" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            ORDERS
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Process and ship your MessMarket orders
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-yellow-500/20 p-6">
            <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              PENDING ACCEPTANCE
            </div>
            <div className="text-yellow-500" style={{ fontWeight: 900, fontSize: '36px' }}>
              {pendingOrders.length}
            </div>
          </div>
          <div className="bg-white/5 border border-blue-500/20 p-6">
            <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              READY TO SHIP
            </div>
            <div className="text-blue-500" style={{ fontWeight: 900, fontSize: '36px' }}>
              {activeOrders.length}
            </div>
          </div>
          <div className="bg-white/5 border border-green-500/20 p-6">
            <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              SHIPPED
            </div>
            <div className="text-green-500" style={{ fontWeight: 900, fontSize: '36px' }}>
              {shippedOrders.length}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="uppercase tracking-wider text-white mb-2" style={{ fontWeight: 900, fontSize: '24px' }}>
              No orders yet
            </h2>
            <p className="text-white/60 mb-6" style={{ fontWeight: 400, fontSize: '14px' }}>
              Orders will appear here once buyers purchase your listings.
            </p>
            <button
              onClick={() => onNavigate('sellerListings')}
              className="px-6 py-3 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider"
              style={{ fontWeight: 900, fontSize: '14px' }}
            >
              VIEW MY LISTINGS
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={() => acceptOrder(order.id)}
                onShip={() => openShipModal(order)}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}

        {/* Ship Modal */}
        {showShipModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl mb-4">SHIP ORDER</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Order #{selectedOrder.id.slice(0, 8)}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Carrier (Optional)
                  </label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="e.g., Royal Mail, DHL, etc."
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-hotmess-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Tracking Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g., 1234567890"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-hotmess-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Tracking URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-hotmess-red transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowShipModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors disabled:opacity-50"
                >
                  CANCEL
                </button>
                <button
                  onClick={shipOrder}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-hotmess-red hover:bg-red-600 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SHIPPING...
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      MARK AS SHIPPED
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}

// Order Card Component
function OrderCard({
  order,
  onAccept,
  onShip,
  actionLoading,
}: {
  order: Order;
  onAccept: () => void;
  onShip: () => void;
  actionLoading: boolean;
}) {
  const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.paid;
  const Icon = config.icon;
  
  const shipping = order.buyer_shipping || {};
  const hasTracking = order.shipments && order.shipments.length > 0;

  return (
    <div className={`bg-zinc-900 border ${config.bg.replace('/10', '/20')} rounded-lg p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${config.bg}`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold">Order #{order.id.slice(0, 8)}</span>
              <span className={`text-xs px-2 py-1 rounded ${config.bg} ${config.color} font-bold`}>
                {config.label}
              </span>
            </div>
            <div className="text-sm text-zinc-400">
              {new Date(order.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            £{(order.total_pence / 100).toFixed(2)}
          </div>
          <div className="text-xs text-zinc-500">{order.currency}</div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4 p-3 bg-zinc-800 rounded">
        <div className="text-sm text-zinc-400 mb-2">ITEMS</div>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm mb-1">
            <span>
              {item.quantity}x {item.title}
            </span>
            <span className="text-zinc-400">
              £{(item.unit_price_pence / 100).toFixed(2)} each
            </span>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="mb-4 p-3 bg-zinc-800 rounded">
        <div className="text-sm text-zinc-400 mb-2">SHIP TO</div>
        <div className="text-sm">
          {shipping.name && <div className="font-bold">{shipping.name}</div>}
          {shipping.line1 && <div>{shipping.line1}</div>}
          {shipping.line2 && <div>{shipping.line2}</div>}
          {shipping.city && <div>{shipping.city}</div>}
          {shipping.postcode && <div>{shipping.postcode}</div>}
          {shipping.country && <div className="uppercase">{shipping.country}</div>}
          {shipping.phone && <div className="text-zinc-400 mt-1">{shipping.phone}</div>}
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-4 p-3 bg-zinc-800 rounded">
          <div className="text-sm text-zinc-400 mb-2">BUYER NOTES</div>
          <div className="text-sm">{order.notes}</div>
        </div>
      )}

      {/* Tracking */}
      {hasTracking && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded">
          <div className="text-sm text-green-400 mb-2">TRACKING INFO</div>
          {order.shipments.map((shipment, idx) => (
            <div key={idx} className="text-sm space-y-1">
              {shipment.carrier && <div>Carrier: {shipment.carrier}</div>}
              {shipment.tracking_number && <div>Tracking: {shipment.tracking_number}</div>}
              {shipment.tracking_url && (
                <a
                  href={shipment.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline flex items-center gap-1"
                >
                  Track Package <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {order.status === 'paid' && (
          <button
            onClick={onAccept}
            disabled={actionLoading}
            className="flex-1 px-4 py-2 bg-hotmess-red hover:bg-red-600 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {actionLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ACCEPTING...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                ACCEPT ORDER
              </>
            )}
          </button>
        )}

        {order.status === 'accepted' && (
          <button
            onClick={onShip}
            disabled={actionLoading}
            className="flex-1 px-4 py-2 bg-hotmess-red hover:bg-red-600 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            MARK AS SHIPPED
          </button>
        )}

        {['shipped', 'delivered'].includes(order.status) && (
          <div className="flex-1 text-center text-sm text-zinc-500 py-2">
            Order completed
          </div>
        )}
      </div>
    </div>
  );
}