import { Package, TrendingUp, DollarSign, ShoppingBag, Plus, Eye } from 'lucide-react';
import { VENDOR, ADMIN } from '../design-system/tokens';

interface VendorPortalProps {
  onNavigate: (route: any, params?: any) => void;
}

const mockVendorStats = {
  name: 'NightWear Collective',
  totalSales: 4850,
  activeListings: 12,
  pendingOrders: 7,
  revenue: 12475,
  commission: 0.15, // 15%
};

const mockOrders = [
  { id: 'ORD-1847', item: 'Mesh Tank (M)', status: 'pending', amount: 45, date: '2h ago' },
  { id: 'ORD-1846', item: 'Crop Tee (L)', status: 'shipped', amount: 38, date: '5h ago' },
  { id: 'ORD-1845', item: 'RAW Vest (S)', status: 'shipped', amount: 52, date: '1d ago' },
  { id: 'ORD-1844', item: 'Shadow Set (M)', status: 'delivered', amount: 95, date: '2d ago' },
];

const mockListings = [
  { id: 1, name: 'Mesh Tank', category: 'RAW', price: 45, stock: 23, status: 'active' },
  { id: 2, name: 'Crop Tee', category: 'HUNG', price: 38, stock: 12, status: 'active' },
  { id: 3, name: 'Shadow Set', category: 'HIGH', price: 95, stock: 0, status: 'out-of-stock' },
  { id: 4, name: 'Neon Vest', category: 'RAW', price: 52, stock: 8, status: 'low-stock' },
];

export function VendorPortal({ onNavigate }: VendorPortalProps) {
  const payout = mockVendorStats.revenue * (1 - mockVendorStats.commission);

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="mb-2 glow-text">VENDOR PORTAL</h2>
          <p className="text-lg text-gray-300">{VENDOR.intro}</p>
          <p className="text-sm text-gray-500 mt-2">{VENDOR.dashboard}</p>
        </div>

        {/* Vendor Info */}
        <div className="mb-8 p-6 bg-gradient-to-br from-red-950/30 to-black border border-red-600/30">
          <h3 className="mb-2 text-red-400">{mockVendorStats.name}</h3>
          <p className="text-sm text-gray-400">Your gear. Your rules. Our platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-black/50 border border-red-600/30 text-center">
            <TrendingUp className="mx-auto mb-3 text-red-400" size={32} />
            <h4 className="mb-1 text-3xl text-white">{mockVendorStats.totalSales}</h4>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Total Sales</p>
          </div>

          <div className="p-6 bg-black/50 border border-red-600/30 text-center">
            <DollarSign className="mx-auto mb-3 text-green-400" size={32} />
            <h4 className="mb-1 text-3xl text-white">£{payout.toLocaleString()}</h4>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Your Payout</p>
            <p className="text-xs text-gray-600 mt-1">(after {mockVendorStats.commission * 100}% commission)</p>
          </div>

          <div className="p-6 bg-black/50 border border-red-600/30 text-center">
            <Package className="mx-auto mb-3 text-red-400" size={32} />
            <h4 className="mb-1 text-3xl text-white">{mockVendorStats.pendingOrders}</h4>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Pending Orders</p>
          </div>

          <div className="p-6 bg-black/50 border border-red-600/30 text-center">
            <ShoppingBag className="mx-auto mb-3 text-red-400" size={32} />
            <h4 className="mb-1 text-3xl text-white">{mockVendorStats.activeListings}</h4>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Active Listings</p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-red-400 uppercase tracking-wider">Recent Orders</h3>
            <button className="text-sm text-gray-400 hover:text-red-400 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-black/50 border border-gray-800 hover:border-red-600/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white">{order.id}</h4>
                      <span
                        className={`px-2 py-1 text-xs uppercase tracking-wider ${
                          order.status === 'pending'
                            ? 'bg-orange-950/50 border border-orange-600 text-orange-400'
                            : order.status === 'shipped'
                            ? 'bg-blue-950/50 border border-blue-600 text-blue-400'
                            : 'bg-green-950/50 border border-green-600 text-green-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{order.item}</p>
                    <p className="text-xs text-gray-600 mt-1">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl text-red-400">£{order.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-red-400 uppercase tracking-wider">Your Listings</h3>
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors uppercase tracking-wider flex items-center gap-2">
              <Plus size={18} />
              New Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockListings.map((listing) => (
              <div
                key={listing.id}
                className="p-6 bg-black/50 border border-gray-800 hover:border-red-600/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="mb-1 text-white">{listing.name}</h4>
                    <p className="text-xs text-red-400 uppercase tracking-wider">{listing.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs uppercase tracking-wider ${
                      listing.status === 'active'
                        ? 'bg-green-950/50 border border-green-600 text-green-400'
                        : listing.status === 'low-stock'
                        ? 'bg-orange-950/50 border border-orange-600 text-orange-400'
                        : 'bg-red-950/50 border border-red-600 text-red-400'
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-2xl text-red-400 mb-2">£{listing.price}</p>
                  <p className="text-sm text-gray-400">
                    Stock: <span className={listing.stock === 0 ? 'text-red-400' : 'text-white'}>{listing.stock}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 transition-colors text-sm uppercase tracking-wider">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 bg-black/50 border border-green-600/30">
          <h4 className="mb-3 text-green-400 uppercase tracking-wider text-sm">{ADMIN.vendorSync}</h4>
          <p className="text-gray-400 text-sm">
            All systems operational. Orders syncing in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
