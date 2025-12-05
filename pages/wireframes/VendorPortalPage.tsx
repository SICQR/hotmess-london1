/**
 * VENDOR PORTAL PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { ShoppingBag, Plus, TrendingUp, DollarSign, Package, BarChart3 } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMTabs } from '../../components/library/HMTabs';
import { HMInput } from '../../components/library/HMInput';
import { HMToggle } from '../../components/library/HMToggle';
import { HMProductCard } from '../../components/library/HMCard';
import { useState } from 'react';

interface VendorPortalPageProps {
  onNavigate: (page: string) => void;
}

export function VendorPortalPage({ onNavigate }: VendorPortalPageProps) {
  const [autoPublish, setAutoPublish] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            Vendor Portal
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Sell to the brotherhood. Care-first commerce for queer men.
          </p>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="px-6 py-12 bg-charcoal/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-black/50 border border-hot/30">
              <DollarSign size={24} className="mb-3 text-hot" />
              <div className="text-2xl text-white mb-1">£3,847</div>
              <div className="text-sm text-gray-400">This Month</div>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30">
              <Package size={24} className="mb-3 text-hot" />
              <div className="text-2xl text-white mb-1">142</div>
              <div className="text-sm text-gray-400">Orders</div>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30">
              <ShoppingBag size={24} className="mb-3 text-hot" />
              <div className="text-2xl text-white mb-1">23</div>
              <div className="text-sm text-gray-400">Products</div>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30">
              <TrendingUp size={24} className="mb-3 text-neon-lime" />
              <div className="text-2xl text-white mb-1">+18%</div>
              <div className="text-sm text-gray-400">Growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Portal */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'products',
                label: 'Products',
                content: (
                  <div>
                    <div className="mb-8 flex items-center justify-between">
                      <h3 className="text-xl text-hot uppercase tracking-wider">
                        Your Products
                      </h3>
                      <HMButton variant="primary" icon={<Plus size={20} />}>
                        Add Product
                      </HMButton>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <HMProductCard
                        image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
                        name="Sweat Tank"
                        collection="RAW"
                        price={45}
                        xp={25}
                        inStock={true}
                        bestseller={true}
                      />
                      <HMProductCard
                        image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
                        name="Mesh Shorts"
                        collection="RAW"
                        price={38}
                        xp={20}
                        inStock={true}
                      />
                      <HMProductCard
                        image="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400"
                        name="Harness Pro"
                        collection="HUNG"
                        price={68}
                        xp={35}
                        inStock={true}
                      />
                      <HMProductCard
                        image="https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=400"
                        name="Compression Fit"
                        collection="HIGH"
                        price={85}
                        xp={45}
                        inStock={false}
                      />
                    </div>
                  </div>
                ),
              },
              {
                id: 'orders',
                label: 'Orders',
                content: (
                  <div className="space-y-4">
                    {[
                      { id: '#1234', customer: 'HeatSeeker', items: 2, total: 83, status: 'shipped', date: '2 hours ago' },
                      { id: '#1233', customer: 'NightMess', items: 1, total: 45, status: 'processing', date: '5 hours ago' },
                      { id: '#1232', customer: 'SweatKing', items: 3, total: 151, status: 'delivered', date: '1 day ago' },
                      { id: '#1231', customer: 'VauxhallBoy', items: 1, total: 68, status: 'shipped', date: '1 day ago' },
                    ].map((order) => (
                      <div key={order.id} className="p-6 bg-black/50 border border-hot/30">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-white mb-2">
                              Order {order.id}
                            </h4>
                            <div className="text-sm text-gray-400 space-y-1">
                              <div>Customer: {order.customer}</div>
                              <div>{order.items} items • £{order.total}</div>
                              <div>{order.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-xs uppercase tracking-wider ${
                              order.status === 'delivered'
                                ? 'bg-neon-lime/20 text-neon-lime border border-neon-lime'
                                : order.status === 'shipped'
                                ? 'bg-cyan-static/20 text-cyan-static border border-cyan-static'
                                : 'bg-heat/20 text-heat border border-heat'
                            }`}>
                              {order.status}
                            </span>
                            <HMButton variant="tertiary" size="sm">
                              View
                            </HMButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: 'analytics',
                label: 'Analytics',
                content: (
                  <div className="space-y-8">
                    {/* Revenue Chart Placeholder */}
                    <div>
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Revenue (Last 30 Days)</h4>
                      <div className="h-64 bg-black/50 border border-hot/30 rounded flex items-center justify-center">
                        <BarChart3 size={64} className="text-gray-700" />
                        <p className="ml-4 text-gray-600">Chart Component</p>
                      </div>
                    </div>

                    {/* Top Products */}
                    <div>
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Top Products</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Sweat Tank', sales: 142, revenue: 6390 },
                          { name: 'Harness Pro', sales: 89, revenue: 6052 },
                          { name: 'Compression Fit', sales: 67, revenue: 5695 },
                          { name: 'Mesh Shorts', sales: 56, revenue: 2128 },
                        ].map((product, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-black/50 border border-hot/30">
                            <div className="flex-1">
                              <h5 className="text-white mb-1">{product.name}</h5>
                              <p className="text-sm text-gray-400">{product.sales} sales</p>
                            </div>
                            <div className="text-right">
                              <div className="text-hot">£{product.revenue.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'settings',
                label: 'Settings',
                content: (
                  <div className="space-y-8 max-w-2xl">
                    {/* Store Info */}
                    <div>
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Store Information</h4>
                      <div className="space-y-4">
                        <HMInput variant="text" label="Store Name" value="Sweat Supply Co." />
                        <HMInput
                          variant="text"
                          label="Store Description"
                          value="Athletic wear for the brotherhood."
                        />
                        <HMInput variant="email" label="Contact Email" value="store@example.com" />
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="pt-8 border-t border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Store Settings</h4>
                      <div className="space-y-4">
                        <HMToggle
                          label="Auto-publish new products"
                          enabled={autoPublish}
                          onChange={setAutoPublish}
                        />
                        <HMToggle
                          label="Accept custom orders"
                          enabled={true}
                          onChange={() => {}}
                        />
                        <HMToggle
                          label="Show in vendor directory"
                          enabled={true}
                          onChange={() => {}}
                        />
                      </div>
                    </div>

                    {/* Payout Info */}
                    <div className="pt-8 border-t border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Payout Settings</h4>
                      <div className="p-6 bg-black/50 border border-hot/30 mb-4">
                        <p className="text-sm text-gray-400 mb-2">Next payout</p>
                        <p className="text-2xl text-hot mb-4">£3,847</p>
                        <p className="text-xs text-gray-500">Expected on Jan 1, 2025</p>
                      </div>
                      <HMButton variant="secondary" size="sm">
                        Update Bank Details
                      </HMButton>
                    </div>

                    {/* Save Button */}
                    <div className="pt-8">
                      <HMButton variant="primary">
                        Save Changes
                      </HMButton>
                    </div>
                  </div>
                ),
              },
            ]}
            defaultTab="products"
          />
        </div>
      </section>

      {/* Apply CTA (if not a vendor) */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="mb-4 text-2xl text-hot uppercase tracking-wider">
            Not a vendor yet?
          </h3>
          <p className="mb-8 text-gray-300">
            Apply to sell on HOTMESS. Care-first commerce. Fair fees. Direct to the brotherhood.
          </p>
          <HMButton variant="secondary">
            Apply as Vendor
          </HMButton>
        </div>
      </section>
    </div>
  );
}
