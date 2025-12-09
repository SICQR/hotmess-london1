/**
 * SHOP PLP — Product Listing Page
 * Luxury editorial design with full hero and product grid
 */

import { useState } from 'react';
import { HMButton } from '../../components/library/HMButton';
import { HMChip } from '../../components/library/HMTabs';
import { HMXPMeter } from '../../components/library/HMXPMeter';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface ShopPLPProps {
  onNavigate?: (page: string) => void;
  onProductClick?: (productId: string) => void;
}

const products = [
  {
    id: 'raw-tank-01',
    name: 'Sweat Tank',
    collection: 'RAW',
    price: 45,
    xpReward: 25,
    primaryImage: 'https://images.unsplash.com/photo-1762666167414-d57961f39a07?q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1605553703411-73938914721b?q=80&w=800',
  },
  {
    id: 'hung-mesh-01',
    name: 'Mesh Shorts',
    collection: 'HUNG',
    price: 55,
    xpReward: 30,
    primaryImage: 'https://images.unsplash.com/photo-1549481478-c4460b999ba5?q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1605553703411-73938914721b?q=80&w=800',
  },
  {
    id: 'raw-harness-01',
    name: 'Steel Harness',
    collection: 'RAW',
    price: 85,
    xpReward: 50,
    primaryImage: 'https://images.unsplash.com/photo-1711113456756-40a80c23491c?q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1762288410054-ad6000bd5672?q=80&w=800',
  },
  {
    id: 'high-graphic-01',
    name: 'Vapor Tee',
    collection: 'HIGH',
    price: 40,
    xpReward: 20,
    primaryImage: 'https://images.unsplash.com/photo-1621788455015-e48161cb187b?q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1754475172820-6053bbed3b25?q=80&w=800',
  },
  {
    id: 'super-minimal-01',
    name: 'Luxury Hoodie',
    collection: 'SUPER',
    price: 120,
    xpReward: 75,
    primaryImage: 'https://images.unsplash.com/photo-1762288410054-ad6000bd5672?q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1621788455015-e48161cb187b?q=80&w=800',
  },
  {
    id: 'hung-compression-01',
    name: 'Compression Shirt',
    collection: 'HUNG',
    price: 60,
    xpReward: 35,
    primaryImage: 'https://images.unsplash.com/photo-1605553703411-73938914721b?q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1762666167414-d57961f39a07?q=80&w=800',
  },
  {
    id: 'raw-cargo-01',
    name: 'Tactical Cargo',
    collection: 'RAW',
    price: 95,
    xpReward: 55,
    primaryImage: 'https://images.unsplash.com/photo-1754475172820-6053bbed3b25?q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1762288410054-ad6000bd5672?q=80&w=800',
  },
  {
    id: 'high-shorts-01',
    name: 'Neon Swim',
    collection: 'HIGH',
    price: 50,
    xpReward: 30,
    primaryImage: 'https://images.unsplash.com/photo-1549481478-c4460b999ba5?q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1621788455015-e48161cb187b?q=80&w=800',
  },
];

export function ShopPLP({ onNavigate, onProductClick }: ShopPLPProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const filteredProducts = selectedCollection === 'all' 
    ? products 
    : products.filter(p => p.collection === selectedCollection);

  return (
    <div className="min-h-screen bg-black">
      {/* Full Hero Banner with Model Photography */}
      <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1621788455015-e48161cb187b?q=80&w=2000"
          alt="Shop HOTMESS"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <h1 
            className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[180px] xl:text-[200px] leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-hot via-heat to-hot drop-shadow-[0_0_60px_rgba(231,15,60,0.8)] mb-4 sm:mb-6"
            style={{
              fontWeight: 900,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SHOP
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 tracking-wide mb-6 sm:mb-8">
            RAW / HUNG / HIGH / SUPER
          </p>
          <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-gradient-to-r from-hot to-heat" />
        </div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-16 lg:top-0 z-20 bg-black/95 backdrop-blur-lg border-b border-hot/30 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <HMChip
              label="All"
              active={selectedCollection === 'all'}
              onClick={() => setSelectedCollection('all')}
              variant="hot"
            />
            <HMChip
              label="RAW"
              active={selectedCollection === 'RAW'}
              onClick={() => setSelectedCollection('RAW')}
              variant="hot"
            />
            <HMChip
              label="HUNG"
              active={selectedCollection === 'HUNG'}
              onClick={() => setSelectedCollection('HUNG')}
              variant="hot"
            />
            <HMChip
              label="HIGH"
              active={selectedCollection === 'HIGH'}
              onClick={() => setSelectedCollection('HIGH')}
              variant="hot"
            />
            <HMChip
              label="SUPER"
              active={selectedCollection === 'SUPER'}
              onClick={() => setSelectedCollection('SUPER')}
              variant="hot"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => onProductClick?.(product.id)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image with Hover State */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-900 mb-3 sm:mb-4 border-2 border-transparent group-hover:border-hot transition-all duration-300">
                  <img
                    src={hoveredProduct === product.id ? product.hoverImage : product.primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* XP Reward Badge */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-hot text-white text-[10px] sm:text-xs uppercase tracking-wider">
                    +{product.xpReward} XP
                  </div>

                  {/* Collection Badge */}
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/80 border border-hot text-hot text-[10px] sm:text-xs uppercase tracking-wider">
                    {product.collection}
                  </div>

                  {/* Quick Add Overlay - Hidden on touch devices */}
                  <div className="hidden md:flex absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
                    <HMButton variant="primary" size="sm" icon={<ShoppingBag size={16} />}>
                      Quick Add
                    </HMButton>
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <h4 className="text-white text-sm sm:text-base mb-1 uppercase tracking-wider group-hover:text-hot transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-lg sm:text-xl md:text-2xl text-hot">£{product.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 sm:mt-14 md:mt-16 text-center">
            <HMButton variant="secondary" size="lg">
              Load More Products
            </HMButton>
          </div>
        </div>
      </section>

      {/* Editorial Feature Block */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 md:py-24 bg-gradient-to-b from-black via-hot/5 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 text-hot uppercase tracking-wider">
            Earn XP with Every Purchase
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Every item you buy earns XP. Level up. Unlock rewards. Rep the brotherhood.
          </p>
          <HMButton variant="primary" size="lg" onClick={() => onNavigate?.('rewards')}>
            View Rewards
          </HMButton>
        </div>
      </section>

      {/* Collection Spotlights */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* RAW Spotlight */}
            <div className="relative h-[500px] overflow-hidden group cursor-pointer border-2 border-steel/30 hover:border-steel transition-all">
              <img
                src="https://images.unsplash.com/photo-1758558309640-132f8f97fb44?q=80&w=1200"
                alt="RAW Collection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-5xl mb-4 text-steel uppercase tracking-wider">RAW</h3>
                <p className="text-gray-300 mb-6">Hyper-masculine. Industrial strength.</p>
                <HMButton variant="secondary" icon={<ArrowRight size={20} />}>
                  Shop RAW
                </HMButton>
              </div>
            </div>

            {/* HUNG Spotlight */}
            <div className="relative h-[500px] overflow-hidden group cursor-pointer border-2 border-hot/30 hover:border-hot transition-all">
              <img
                src="https://images.unsplash.com/photo-1574622731854-f06af7345d28?q=80&w=1200"
                alt="HUNG Collection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-5xl mb-4 text-hot uppercase tracking-wider">HUNG</h3>
                <p className="text-gray-300 mb-6">Sexual confidence. Unapologetic power.</p>
                <HMButton variant="primary" icon={<ArrowRight size={20} />}>
                  Shop HUNG
                </HMButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
