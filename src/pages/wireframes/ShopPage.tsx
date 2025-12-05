/**
 * SHOP PAGE WIREFRAME (Product Listing Page)
 * Mobile-first → Tablet → Desktop
 */

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMProductCard } from '../../components/library/HMCard';
import { HMInput } from '../../components/library/HMInput';
import { HMChip } from '../../components/library/HMTabs';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  onViewProduct?: (productId: string) => void;
}

export function ShopPage({ onNavigate, onViewProduct }: ShopPageProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            Shop the Heat
          </h1>
          <p className="text-gray-300 max-w-2xl">
            RAW. HUNG. HIGH. Sweat-soaked gear for the men who show up.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="px-6 py-8 bg-charcoal/50 sticky top-16 lg:top-0 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <HMInput
              variant="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Collection Filters */}
          <div className="flex flex-wrap gap-3">
            <HMChip
              label="All"
              active={selectedCollection === 'all'}
              onClick={() => setSelectedCollection('all')}
              variant="hot"
            />
            <HMChip
              label="RAW"
              active={selectedCollection === 'raw'}
              onClick={() => setSelectedCollection('raw')}
              variant="hot"
            />
            <HMChip
              label="HUNG"
              active={selectedCollection === 'hung'}
              onClick={() => setSelectedCollection('hung')}
              variant="hot"
            />
            <HMChip
              label="HIGH"
              active={selectedCollection === 'high'}
              onClick={() => setSelectedCollection('high')}
              variant="hot"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <HMProductCard
              image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
              name="Sweat Tank"
              collection="RAW"
              price={45}
              xp={25}
              inStock={true}
              bestseller={true}
              onAddToCart={() => {}}
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
              bestseller={true}
            />
            <HMProductCard
              image="https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=400"
              name="Compression Fit"
              collection="HIGH"
              price={85}
              xp={45}
              inStock={true}
            />
            <HMProductCard
              image="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400"
              name="Neon Caps"
              collection="HIGH"
              price={32}
              xp={15}
              inStock={false}
            />
            <HMProductCard
              image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
              name="Heat Socks"
              collection="RAW"
              price={18}
              xp={10}
              inStock={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="mb-4 text-2xl text-hot uppercase tracking-wider">
            Become a Vendor
          </h3>
          <p className="mb-8 text-gray-300">
            Sell your gear to the HOTMESS community. Care-first commerce.
          </p>
          <HMButton variant="secondary" onClick={() => onNavigate('vendor')}>
            Apply as Vendor
          </HMButton>
        </div>
      </section>
    </div>
  );
}
