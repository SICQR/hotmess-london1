/**
 * PRODUCT DETAIL PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { useState } from 'react';
import { ShoppingBag, Zap, Heart, Share2, ChevronLeft } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMProductCard } from '../../components/library/HMCard';
import { HMTabs } from '../../components/library/HMTabs';

interface ProductDetailPageProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function ProductDetailPage({ onNavigate, onBack }: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <section className="px-6 py-4 border-b border-hot/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm uppercase tracking-wider">Back to Shop</span>
        </button>
      </section>

      {/* Product Hero */}
      <section className="px-6 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-gray-900 rounded overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            {/* Collection Badge */}
            <div className="inline-block px-3 py-1 mb-4 bg-hot/20 border border-hot text-hot text-xs uppercase tracking-wider">
              RAW Collection
            </div>

            <h1 className="mb-4 text-3xl md:text-4xl text-white uppercase tracking-wider">
              Sweat Tank
            </h1>

            <div className="mb-6 flex items-center gap-4">
              <span className="text-4xl text-hot">£45</span>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-black/50 border border-hot/50">
                <Zap size={16} className="text-hot" />
                <span className="text-sm text-hot">+25 XP</span>
              </div>
            </div>

            <p className="mb-8 text-gray-300 leading-relaxed">
              Built for the sweat. Cut for movement. No apologies, just heat. 
              Engineered for the men who show up and don't scare easy.
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block mb-3 text-sm uppercase tracking-wider text-gray-400">
                Select Size
              </label>
              <div className="flex gap-3">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border transition-all ${
                      selectedSize === size
                        ? 'bg-hot border-hot text-white'
                        : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block mb-3 text-sm uppercase tracking-wider text-gray-400">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-700 hover:border-gray-500 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-700 hover:border-gray-500 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <HMButton variant="primary" icon={<ShoppingBag size={20} />} className="flex-1">
                Add to Cart
              </HMButton>
              <button className="px-4 border border-gray-700 hover:border-gray-500 transition-colors">
                <Heart size={20} className="text-gray-400" />
              </button>
              <button className="px-4 border border-gray-700 hover:border-gray-500 transition-colors">
                <Share2 size={20} className="text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-500 italic">
              Free shipping over £75. Earn XP with every purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="px-6 py-16 border-t border-hot/30">
        <div className="max-w-7xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'details',
                label: 'Details',
                content: (
                  <div className="prose prose-invert max-w-none">
                    <h4 className="text-white mb-4">Product Details</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>Premium cotton blend with moisture-wicking technology</li>
                      <li>Athletic fit designed for movement</li>
                      <li>Reinforced seams for durability</li>
                      <li>Machine washable</li>
                      <li>Made in London</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: 'sizing',
                label: 'Sizing',
                content: (
                  <div className="text-gray-300">
                    <h4 className="text-white mb-4">Size Guide</h4>
                    <p className="mb-4">Athletic fit. True to size. Size up if between sizes.</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="py-2 text-left text-hot">Size</th>
                            <th className="py-2 text-left">Chest (in)</th>
                            <th className="py-2 text-left">Length (in)</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-400">
                          <tr className="border-b border-gray-900">
                            <td className="py-2">S</td>
                            <td className="py-2">36-38</td>
                            <td className="py-2">27</td>
                          </tr>
                          <tr className="border-b border-gray-900">
                            <td className="py-2">M</td>
                            <td className="py-2">38-40</td>
                            <td className="py-2">28</td>
                          </tr>
                          <tr className="border-b border-gray-900">
                            <td className="py-2">L</td>
                            <td className="py-2">40-42</td>
                            <td className="py-2">29</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ),
              },
              {
                id: 'care',
                label: 'Care',
                content: (
                  <div className="text-gray-300">
                    <h4 className="text-white mb-4">Care Instructions</h4>
                    <ul className="space-y-2">
                      <li>Machine wash cold</li>
                      <li>Tumble dry low</li>
                      <li>Do not bleach</li>
                      <li>Iron on low if needed</li>
                    </ul>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Related Products */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="mb-8 text-2xl text-hot uppercase tracking-wider">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <HMProductCard
              image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
              name="Mesh Shorts"
              collection="RAW"
              price={38}
              xp={20}
              inStock={true}
            />
            <HMProductCard
              image="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400"
              name="Neon Caps"
              collection="HIGH"
              price={32}
              xp={15}
              inStock={true}
            />
            <HMProductCard
              image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
              name="Heat Socks"
              collection="RAW"
              price={18}
              xp={10}
              inStock={true}
            />
            <HMProductCard
              image="https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=400"
              name="Compression Fit"
              collection="HIGH"
              price={85}
              xp={45}
              inStock={true}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
