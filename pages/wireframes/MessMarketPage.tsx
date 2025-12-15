/**
 * MESSMARKET PAGE WIREFRAME
 * Community marketplace for peer-to-peer trading
 * Mobile-first → Tablet → Desktop
 */

import { Plus, Search, TrendingUp, Clock, MapPin } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMInput } from '../../components/library/HMInput';
import { HMChip } from '../../components/library/HMTabs';
import { HMTabs } from '../../components/library/HMTabs';
import { HMProductCard } from '../../components/library/HMCard';
import { useState } from 'react';

interface MessMarketPageProps {
  onNavigate: (page: string) => void;
}

export function MessMarketPage({ onNavigate }: MessMarketPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            MessMarket
          </h1>
          <p className="text-gray-300 max-w-2xl mb-6">
            Buy, sell, and trade within the brotherhood. Peer-to-peer marketplace for the community.
          </p>
          <HMButton variant="primary" icon={<Plus size={20} />}>
            List an Item
          </HMButton>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="px-6 py-8 bg-charcoal/50 sticky top-16 lg:top-0 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <HMInput
              variant="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <HMChip
              label="All Items"
              active={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              variant="hot"
            />
            <HMChip
              label="Clothing"
              active={selectedCategory === 'clothing'}
              onClick={() => setSelectedCategory('clothing')}
              variant="hot"
            />
            <HMChip
              label="Gear"
              active={selectedCategory === 'gear'}
              onClick={() => setSelectedCategory('gear')}
              variant="hot"
            />
            <HMChip
              label="Accessories"
              active={selectedCategory === 'accessories'}
              onClick={() => setSelectedCategory('accessories')}
              variant="hot"
            />
            <HMChip
              label="Tickets"
              active={selectedCategory === 'tickets'}
              onClick={() => setSelectedCategory('tickets')}
              variant="hot"
            />
          </div>

          {/* Sort Options */}
          <div className="flex gap-3 overflow-x-auto">
            <HMChip label="Recent" variant="default" />
            <HMChip label="Price: Low to High" variant="default" />
            <HMChip label="Price: High to Low" variant="default" />
            <HMChip label="Nearby" variant="default" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'listings',
                label: 'All Listings',
                content: (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Community Listings */}
                    <div className="bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
                      <div className="aspect-square bg-gray-900 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400"
                          alt="Listing"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-hot to-heat rounded-full" />
                          <span className="text-xs text-gray-400">HeatSeeker</span>
                          <Clock size={12} className="ml-auto text-gray-500" />
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                        <h4 className="text-white mb-2">Leather Harness (Like New)</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl text-hot">£45</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={12} />
                            <span>Vauxhall</span>
                          </div>
                        </div>
                        <HMButton variant="secondary" size="sm" className="w-full">
                          Message Seller
                        </HMButton>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
                      <div className="aspect-square bg-gray-900 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
                          alt="Listing"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-hot to-heat rounded-full" />
                          <span className="text-xs text-gray-400">SweatKing</span>
                          <Clock size={12} className="ml-auto text-gray-500" />
                          <span className="text-xs text-gray-500">5h ago</span>
                        </div>
                        <h4 className="text-white mb-2">Mesh Tank + Shorts Set</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl text-hot">£30</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={12} />
                            <span>Soho</span>
                          </div>
                        </div>
                        <HMButton variant="secondary" size="sm" className="w-full">
                          Message Seller
                        </HMButton>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
                      <div className="aspect-square bg-gray-900 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400"
                          alt="Listing"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-hot to-heat rounded-full" />
                          <span className="text-xs text-gray-400">NightMess</span>
                          <Clock size={12} className="ml-auto text-gray-500" />
                          <span className="text-xs text-gray-500">1d ago</span>
                        </div>
                        <h4 className="text-white mb-2">HOTMESS Event Tickets (2x)</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl text-hot">£60</span>
                          <span className="px-2 py-1 bg-neon-lime/20 text-neon-lime text-xs border border-neon-lime">
                            TICKETS
                          </span>
                        </div>
                        <HMButton variant="secondary" size="sm" className="w-full">
                          Message Seller
                        </HMButton>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
                      <div className="aspect-square bg-gray-900 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
                          alt="Listing"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-hot to-heat rounded-full" />
                          <span className="text-xs text-gray-400">MessyBeast</span>
                          <Clock size={12} className="ml-auto text-gray-500" />
                          <span className="text-xs text-gray-500">1d ago</span>
                        </div>
                        <h4 className="text-white mb-2">Running Shoes (Size 10)</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl text-hot">£25</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={12} />
                            <span>Shoreditch</span>
                          </div>
                        </div>
                        <HMButton variant="secondary" size="sm" className="w-full">
                          Message Seller
                        </HMButton>
                      </div>
                    </div>

                    {/* Repeat pattern for more listings */}
                    <div className="bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
                      <div className="aspect-square bg-gray-900 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=400"
                          alt="Listing"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-hot to-heat rounded-full" />
                          <span className="text-xs text-gray-400">VauxhallBoy</span>
                          <Clock size={12} className="ml-auto text-gray-500" />
                          <span className="text-xs text-gray-500">2d ago</span>
                        </div>
                        <h4 className="text-white mb-2">Compression Shirt (M)</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl text-hot">£18</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={12} />
                            <span>Vauxhall</span>
                          </div>
                        </div>
                        <HMButton variant="secondary" size="sm" className="w-full">
                          Message Seller
                        </HMButton>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
                      <div className="aspect-square bg-gray-900 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400"
                          alt="Listing"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-hot to-heat rounded-full" />
                          <span className="text-xs text-gray-400">ClaphamKing</span>
                          <Clock size={12} className="ml-auto text-gray-500" />
                          <span className="text-xs text-gray-500">3d ago</span>
                        </div>
                        <h4 className="text-white mb-2">Chain Necklace (Silver)</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl text-hot">£40</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={12} />
                            <span>Clapham</span>
                          </div>
                        </div>
                        <HMButton variant="secondary" size="sm" className="w-full">
                          Message Seller
                        </HMButton>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'my-listings',
                label: 'My Listings',
                content: (
                  <div>
                    <div className="mb-8 text-center">
                      <HMButton variant="primary" icon={<Plus size={20} />}>
                        Create New Listing
                      </HMButton>
                    </div>

                    <div className="space-y-4">
                      {/* User's active listings */}
                      <div className="p-6 bg-black/50 border border-hot/30">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-32 h-32 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200"
                              alt="My listing"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white mb-1">Sweat Tank (Size M)</h4>
                                <p className="text-sm text-gray-400">Posted 2 days ago</p>
                              </div>
                              <span className="px-3 py-1 bg-neon-lime/20 text-neon-lime text-xs border border-neon-lime uppercase">
                                Active
                              </span>
                            </div>
                            <div className="mb-4">
                              <span className="text-2xl text-hot">£35</span>
                            </div>
                            <div className="flex gap-2">
                              <HMButton variant="tertiary" size="sm">
                                Edit
                              </HMButton>
                              <HMButton variant="tertiary" size="sm">
                                Mark as Sold
                              </HMButton>
                              <HMButton variant="tertiary" size="sm">
                                Delete
                              </HMButton>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Empty state if no listings */}
                      <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">No active listings yet</p>
                        <HMButton variant="secondary" icon={<Plus size={20} />}>
                          List Your First Item
                        </HMButton>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'saved',
                label: 'Saved',
                content: (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Saved items - similar to listings but with "Remove from Saved" button */}
                    <div className="text-center py-12 col-span-full">
                      <p className="text-gray-400">No saved items yet</p>
                    </div>
                  </div>
                ),
              },
            ]}
            defaultTab="listings"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-2xl md:text-3xl text-hot uppercase tracking-wider text-center">
            How MessMarket Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-hot/20 border-2 border-hot flex items-center justify-center">
                <Plus size={32} className="text-hot" />
              </div>
              <h4 className="mb-3 text-white uppercase tracking-wider">List</h4>
              <p className="text-sm text-gray-400">
                Post items you want to sell or trade. Add photos, price, and location.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-hot/20 border-2 border-hot flex items-center justify-center">
                <Search size={32} className="text-hot" />
              </div>
              <h4 className="mb-3 text-white uppercase tracking-wider">Connect</h4>
              <p className="text-sm text-gray-400">
                Browse listings. Message sellers directly. Arrange meetups within the community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-hot/20 border-2 border-hot flex items-center justify-center">
                <TrendingUp size={32} className="text-hot" />
              </div>
              <h4 className="mb-3 text-white uppercase tracking-wider">Trade</h4>
              <p className="text-sm text-gray-400">
                Complete the sale. Build reputation. Keep the brotherhood thriving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="mb-6 text-2xl text-hot uppercase tracking-wider text-center">
            Marketplace Guidelines
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-black/50 border-l-4 border-hot">
              <h4 className="text-white mb-2 uppercase tracking-wider text-sm">Safety First</h4>
              <p className="text-sm text-gray-300">
                Meet in public places. Trust your instincts. Report suspicious activity.
              </p>
            </div>
            <div className="p-4 bg-black/50 border-l-4 border-hot">
              <h4 className="text-white mb-2 uppercase tracking-wider text-sm">Honest Listings</h4>
              <p className="text-sm text-gray-300">
                Accurate photos. Clear descriptions. Fair prices. Respect the community.
              </p>
            </div>
            <div className="p-4 bg-black/50 border-l-4 border-hot">
              <h4 className="text-white mb-2 uppercase tracking-wider text-sm">No Spam</h4>
              <p className="text-sm text-gray-300">
                Genuine items only. No commercial vendors. This is peer-to-peer.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <HMButton variant="tertiary" onClick={() => onNavigate('legal')}>
              Read Full Guidelines
            </HMButton>
          </div>
        </div>
      </section>

      {/* Shop Alternative CTA */}
      <section className="px-6 py-16 bg-hot/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="mb-4 text-2xl text-hot uppercase tracking-wider">
            Looking for New Gear?
          </h3>
          <p className="mb-8 text-gray-300">
            Check out the official HOTMESS shop for brand new RAW/HUNG/HIGH collections.
          </p>
          <HMButton variant="secondary" onClick={() => onNavigate('shop')}>
            Visit Shop
          </HMButton>
        </div>
      </section>
    </div>
  );
}
