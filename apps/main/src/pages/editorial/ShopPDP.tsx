/**
 * SHOP PDP — Product Detail Page
 * Luxury editorial with oversized photography and zoom mode
 */

import { useState } from 'react';
import { HMButton } from '../../components/library/HMButton';
import { HMTabs } from '../../components/library/HMTabs';
import { HMXPMeter } from '../../components/library/HMXPMeter';
import { ShoppingBag, ZoomIn, Minus, Plus, ArrowLeft } from 'lucide-react';

interface ShopPDPProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function ShopPDP({ onNavigate, onBack }: ShopPDPProps) {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const product = {
    name: 'Sweat Tank',
    collection: 'RAW',
    price: 45,
    xpReward: 25,
    description: 'Hyper-masculine tank designed for the sweatiest nights. Industrial-grade cotton blend with reinforced seams.',
    images: [
      'https://images.unsplash.com/photo-1762666167414-d57961f39a07?q=80&w=1200',
      'https://images.unsplash.com/photo-1605553703411-73938914721b?q=80&w=1200',
      'https://images.unsplash.com/photo-1754475172820-6053bbed3b25?q=80&w=1200',
      'https://images.unsplash.com/photo-1756362400728-4038e18281df?q=80&w=1200', // Fabric close-up
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fabricDetails: [
      '85% Cotton / 15% Elastane',
      'Heavyweight construction (280gsm)',
      'Pre-shrunk',
      'Ribbed collar & armholes',
      'Made in Portugal',
    ],
    fitNotes: [
      'True to size with athletic fit',
      'Designed for movement',
      'Reinforced seams for durability',
      'Model is 6\'1" wearing size M',
    ],
    aftercare: [
      'Machine wash cold',
      'Tumble dry low',
      'Do not bleach',
      'Iron on low if needed',
      'Wash dark colors separately',
    ],
  };

  const relatedProducts = [
    {
      id: 'raw-cargo',
      name: 'Tactical Cargo',
      collection: 'RAW',
      price: 95,
      image: 'https://images.unsplash.com/photo-1754475172820-6053bbed3b25?q=80&w=600',
    },
    {
      id: 'hung-mesh',
      name: 'Mesh Shorts',
      collection: 'HUNG',
      price: 55,
      image: 'https://images.unsplash.com/photo-1549481478-c4460b999ba5?q=80&w=600',
    },
    {
      id: 'raw-harness',
      name: 'Steel Harness',
      collection: 'RAW',
      price: 85,
      image: 'https://images.unsplash.com/photo-1711113456756-40a80c23491c?q=80&w=600',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="px-6 py-6 border-b border-hot/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-hot transition-colors uppercase tracking-wider text-sm"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </button>
      </div>

      {/* Product Detail Grid */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Images */}
            <div>
              {/* Main Image with Zoom */}
              <div 
                className="relative aspect-[3/4] bg-gray-900 mb-4 overflow-hidden cursor-zoom-in border-2 border-hot/30 hover:border-hot transition-all"
                onClick={() => setIsZoomed(true)}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/80 p-2 border border-hot">
                  <ZoomIn size={20} className="text-hot" />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`
                      aspect-square overflow-hidden border-2 transition-all
                      ${selectedImage === idx ? 'border-hot' : 'border-gray-800 hover:border-gray-600'}
                    `}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div>
              {/* Collection Badge */}
              <div className="inline-block px-4 py-2 bg-hot/20 border border-hot text-hot text-xs uppercase tracking-wider mb-4">
                {product.collection}
              </div>

              {/* Product Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white uppercase tracking-wider">
                {product.name}
              </h1>

              {/* Price & XP */}
              <div className="flex items-center gap-6 mb-6">
                <span className="text-4xl text-hot">£{product.price}</span>
                <div className="px-4 py-2 bg-neon-lime/20 border border-neon-lime text-neon-lime uppercase tracking-wider text-sm">
                  Earn +{product.xpReward} XP
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-8">
                <h4 className="text-white mb-4 uppercase tracking-wider">Select Size</h4>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        w-16 h-16 border-2 transition-all uppercase
                        ${selectedSize === size 
                          ? 'border-hot bg-hot/20 text-hot' 
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h4 className="text-white mb-4 uppercase tracking-wider">Quantity</h4>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-gray-700 hover:border-hot text-white transition-all"
                  >
                    <Minus size={16} className="mx-auto" />
                  </button>
                  <span className="text-2xl text-white w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border-2 border-gray-700 hover:border-hot text-white transition-all"
                  >
                    <Plus size={16} className="mx-auto" />
                  </button>
                </div>
              </div>

              {/* Add to Cart — Oversized Brutalist Button */}
              <HMButton 
                variant="primary" 
                size="lg" 
                icon={<ShoppingBag size={24} />}
                className="w-full mb-4 py-6 text-xl"
              >
                Add to Cart — £{product.price * quantity}
              </HMButton>

              {/* XP Progress */}
              <div className="mt-8 p-6 bg-black/50 border border-hot/30">
                <h4 className="text-white mb-4 uppercase tracking-wider text-sm">Your Progress</h4>
                <HMXPMeter 
                  current={480}
                  max={500}
                  level={12}
                />
                <p className="text-xs text-gray-400 mt-3">
                  This purchase gives you +{product.xpReward} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="px-6 py-16 bg-charcoal/30">
        <div className="max-w-7xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'fabric',
                label: 'Fabric Details',
                content: (
                  <div className="py-8">
                    <ul className="space-y-3">
                      {product.fabricDetails.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-hot mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                id: 'fit',
                label: 'Fit Notes',
                content: (
                  <div className="py-8">
                    <ul className="space-y-3">
                      {product.fitNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-hot mt-1">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                id: 'care',
                label: 'Aftercare',
                content: (
                  <div className="py-8">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
                      Non-medical care instructions
                    </p>
                    <ul className="space-y-3">
                      {product.aftercare.map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-hot mt-1">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
            ]}
            defaultTab="fabric"
          />
        </div>
      </section>

      {/* Cross-Sells */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl md:text-4xl text-hot uppercase tracking-wider mb-8">
            Complete the Look
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
                onClick={() => onNavigate?.('shop')}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-900 mb-4 border-2 border-transparent group-hover:border-hot transition-all">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 border border-hot text-hot text-xs uppercase tracking-wider">
                    {item.collection}
                  </div>
                </div>
                <h4 className="text-white mb-1 uppercase tracking-wider group-hover:text-hot transition-colors">
                  {item.name}
                </h4>
                <p className="text-xl text-hot">£{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-6 right-6 text-white hover:text-hot transition-colors text-4xl"
            onClick={() => setIsZoomed(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
