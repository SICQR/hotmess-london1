import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Zap, Info, AlertCircle, Loader } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getProductsByCollection } from '../lib/shopify-api';
import { Badge } from '../components/Badge';

interface ShopHungProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function ShopHung({ onNavigate }: ShopHungProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProductsByCollection('hung', 20);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error loading HUNG products:', err);
        setError('Failed to load products. Please try again.');
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
            src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000"
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
              HUNG
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 max-w-2xl mb-4">
              Shapes that say everything without saying anything. 
              <span className="text-hotmess-red"> Stretched, cropped, teased.</span>
            </p>
            <p className="text-lg text-zinc-500 max-w-xl">
              If you know, you know. For men who stopped hiding long ago.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="px-6 md:px-16 lg:px-24 py-24">
        {/* Content Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 p-6 bg-gradient-to-br from-orange-950/30 to-transparent border-l-4 border-orange-500"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg mb-2 text-orange-400">18+ Content Ahead</h3>
              <p className="text-zinc-400 text-sm">
                HUNG features body-conscious cuts and kink-adjacent aesthetics. 
                Designed for adult spaces and confidence. Make sure you're comfortable before browsing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Collection Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 p-8 bg-gradient-to-br from-hotmess-red/10 to-transparent border-l-4 border-hotmess-red"
        >
          <h2 className="text-2xl mb-3">What is HUNG?</h2>
          <p className="text-zinc-400 mb-4">
            The mid-level collection where fashion meets function meets fetish. Tighter fits, 
            strategic cutouts, and silhouettes designed to be noticed. From harnesses that work 
            under jackets to shorts that don't apologize—HUNG is for men who embrace body confidence.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <strong className="text-white">Fit:</strong> Form-fitting to compression
            </div>
            <div>
              <strong className="text-white">Materials:</strong> Stretch fabrics, mesh, vegan leather
            </div>
            <div>
              <strong className="text-white">Care:</strong> Varies by piece
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl uppercase">All HUNG Products</h2>
            <div className="text-zinc-500">{products.length} items</div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader className="w-8 h-8 animate-spin text-hotmess-red" />
              <span className="ml-4 text-zinc-400">Loading products from Shopify...</span>
            </div>
          )}

          {error && (
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

          {!loading && !error && products.length === 0 && (
            <div className="p-8 bg-zinc-900 border border-white/10 text-center">
              <p className="text-zinc-400 mb-4">No products found in HUNG collection.</p>
              <p className="text-sm text-zinc-500">Create products in your Shopify admin and tag them with "hung"</p>
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
                  <div className="relative aspect-square mb-4 overflow-hidden bg-zinc-900 border-2 border-transparent group-hover:border-hotmess-red transition-all">
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.bestseller && <Badge label="Bestseller" variant="hot" size="sm" pulse />}
                      {product.newArrival && <Badge label="New" variant="lime" size="sm" />}
                      {product.limitedEdition && <Badge label="Limited" variant="heat" size="sm" />}
                      {product.stock === 'low' && <Badge label="Low Stock" variant="heat" size="sm" />}
                    </div>

                    <div className={`absolute inset-0 bg-black/80 flex items-center justify-center transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button className="px-6 py-3 bg-hotmess-red hover:bg-red-600 transition-colors uppercase tracking-wider">
                        View Details
                      </button>
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-black/90 border border-hotmess-red/50">
                        <Zap size={14} className="text-hotmess-red" />
                        <span className="text-xs text-hotmess-red">+{product.xp} XP</span>
                      </div>
                    </div>
                  </div>

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
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Aftercare Note */}
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
              <h3 className="text-xl mb-2">Body confidence starts with body safety</h3>
              <p className="text-zinc-400 mb-4">
                HUNG pieces are designed to show skin and celebrate your body. 
                Before you head out, make sure you have the knowledge and tools to stay safe:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-400 mb-4">
                <li>Sun protection for outdoor events</li>
                <li>Hydration and nutrition before club nights</li>
                <li>Understanding consent in intimate spaces</li>
                <li>Aftercare for extended wear</li>
              </ul>
              <button
                onClick={() => onNavigate('care')}
                className="text-hotmess-red hover:underline flex items-center gap-2"
              >
                Visit Care Hub for full guides
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Cross-Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('care')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Care Resources</h4>
            <p className="text-sm text-zinc-500 mb-3">Body safety, consent, and aftercare guides</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Learn More
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('hnhMess')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Hand N Hand</h4>
            <p className="text-sm text-zinc-500 mb-3">Lube, protection, and aftercare products</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Shop Now
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('affiliate')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Earn Commission</h4>
            <p className="text-sm text-zinc-500 mb-3">15% on HUNG products you promote</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Join Affiliate
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
