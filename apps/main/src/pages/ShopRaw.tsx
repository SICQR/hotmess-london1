import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, ExternalLink, Zap, Info, Loader } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getProductsByCollection, ShopifyNotConfiguredError } from '../lib/shopify-api';
import { Badge } from '../components/Badge';
import { ShopifySetupGuide } from '../components/ShopifySetupGuide';

interface ShopRawProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function ShopRaw({ onNavigate }: ShopRawProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [shopifyNotConfigured, setShopifyNotConfigured] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProductsByCollection('raw', 20);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error loading RAW products:', err);
        if (err instanceof ShopifyNotConfiguredError) {
          setShopifyNotConfigured(true);
        } else {
          setError('Failed to load products. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=2000"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-16">
          <button
            onClick={() => onNavigate('shop')}
            className="mb-6 text-zinc-400 hover:text-white transition-colors w-fit"
          >
            ← Back to Shop
          </button>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[120px] md:text-[200px] uppercase tracking-[-0.04em] leading-[0.85] mb-6" style={{ fontWeight: 900 }}>
              RAW
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 max-w-2xl mb-4">
              Vests that don't ask permission. Tees that cling like they've missed you. 
              <span className="text-hotmess-red"> Cuts sharp enough to draw attention.</span>
            </p>
            <p className="text-lg text-zinc-500 max-w-xl">
              The foundation of your nightlife wardrobe. No frills, no apologies, no pretending.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="px-6 md:px-16 lg:px-24 py-24">
        {/* Collection Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 p-8 bg-gradient-to-br from-hotmess-red/10 to-transparent border-l-4 border-hotmess-red"
        >
          <h2 className="text-2xl mb-3">What is RAW?</h2>
          <p className="text-zinc-400 mb-4">
            Our foundational collection. Essential pieces that work solo or layered. 
            Built for movement, designed to be seen. From the dance floor to the dark room, 
            RAW is what you reach for when you know exactly what you want.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <strong className="text-white">Fit:</strong> Athletic to slim
            </div>
            <div>
              <strong className="text-white">Materials:</strong> Cotton, stretch blends
            </div>
            <div>
              <strong className="text-white">Care:</strong> Machine washable
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl uppercase">All RAW Products</h2>
            <div className="text-zinc-500">{products.length} items</div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader className="w-8 h-8 animate-spin text-hotmess-red" />
              <span className="ml-4 text-zinc-400">Loading products from Shopify...</span>
            </div>
          )}

          {shopifyNotConfigured && !loading && (
            <ShopifySetupGuide className="my-12" />
          )}

          {error && !shopifyNotConfigured && (
            <div className="p-8 bg-red-950/30 border-2 border-red-500 text-center">
              <p className="text-white mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-hotmess-red hover:bg-red-600 transition-colors uppercase tracking-wider"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && !shopifyNotConfigured && products.length === 0 && (
            <div className="p-8 bg-zinc-900 border border-white/10 text-center">
              <p className="text-zinc-400 mb-4">No products found in RAW collection.</p>
              <p className="text-sm text-zinc-500">Create products in your Shopify admin and tag them with "raw"</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const isHovered = hoveredProduct === product.id;
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group cursor-pointer"
                  onClick={() => onNavigate('shopProduct', { slug: product.slug })}
                >
                  {/* Image */}
                  <div className="relative aspect-square mb-4 overflow-hidden bg-zinc-900 border-2 border-transparent group-hover:border-hotmess-red transition-all">
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.bestseller && (
                        <Badge label="Bestseller" variant="hot" size="sm" pulse />
                      )}
                      {product.newArrival && (
                        <Badge label="New" variant="lime" size="sm" />
                      )}
                      {product.stock === 'low' && (
                        <Badge label="Low Stock" variant="heat" size="sm" />
                      )}
                    </div>

                    {/* Quick View Overlay */}
                    <div className={`absolute inset-0 bg-black/80 flex items-center justify-center transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button className="px-6 py-3 bg-hotmess-red hover:bg-red-600 transition-colors uppercase tracking-wider">
                        View Details
                      </button>
                    </div>

                    {/* XP Badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-black/90 border border-hotmess-red/50">
                        <Zap size={14} className="text-hotmess-red" />
                        <span className="text-xs text-hotmess-red">+{product.xp} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="mb-3 text-sm text-zinc-400 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-hotmess-red">£{product.price}</span>
                      <button
                        disabled={product.stock === 'out'}
                        className={`px-4 py-2 uppercase tracking-wider text-sm transition-all ${
                          product.stock === 'out'
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            : 'bg-hotmess-red hover:bg-red-600 text-white'
                        }`}
                      >
                        {product.stock === 'out' ? 'Sold Out' : 'Quick Add'}
                      </button>
                    </div>

                    {/* Sizes Preview */}
                    <div className="mt-3 flex gap-1">
                      {product.sizes.slice(0, 5).map((size) => (
                        <div key={size} className="px-2 py-1 bg-zinc-900 text-xs text-zinc-500">
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Care Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 p-8 bg-gradient-to-br from-red-950/30 to-black border-2 border-hotmess-red"
        >
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-hotmess-red flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl mb-2">Looking good is one thing. Feeling safe is everything.</h3>
              <p className="text-zinc-400 mb-4">
                RAW is designed for nights out, but your wellbeing comes first. 
                Whether you're hitting the club or the sauna, make sure you're prepared.
              </p>
              <button
                onClick={() => onNavigate('care')}
                className="text-hotmess-red hover:underline flex items-center gap-2"
              >
                Visit Care Hub
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Cross-Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('affiliate')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Affiliate Program</h4>
            <p className="text-sm text-zinc-500 mb-3">Earn 15% commission on RAW products</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Learn More
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('radio')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Radio</h4>
            <p className="text-sm text-zinc-500 mb-3">Soundtrack for getting dressed</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Listen Now
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Other Collections</h4>
            <p className="text-sm text-zinc-500 mb-3">Explore HUNG, HIGH, and SUPER</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Browse Shop
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Size Guide */}
        <details className="mt-12 p-6 bg-zinc-900 border border-white/10">
          <summary className="cursor-pointer text-xl mb-4">Size Guide</summary>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">Size</th>
                  <th className="text-left py-3 px-4">Chest (inches)</th>
                  <th className="text-left py-3 px-4">Waist (inches)</th>
                  <th className="text-left py-3 px-4">Height (cm)</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">S</td>
                  <td className="py-3 px-4">34-36</td>
                  <td className="py-3 px-4">28-30</td>
                  <td className="py-3 px-4">165-175</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">M</td>
                  <td className="py-3 px-4">38-40</td>
                  <td className="py-3 px-4">32-34</td>
                  <td className="py-3 px-4">175-185</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">L</td>
                  <td className="py-3 px-4">42-44</td>
                  <td className="py-3 px-4">36-38</td>
                  <td className="py-3 px-4">185-195</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">XL</td>
                  <td className="py-3 px-4">46-48</td>
                  <td className="py-3 px-4">40-42</td>
                  <td className="py-3 px-4">195+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
