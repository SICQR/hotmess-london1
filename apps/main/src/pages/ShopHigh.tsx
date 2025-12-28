import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Zap, Info, AlertTriangle, Loader } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getProductsByCollection, ShopifyNotConfiguredError } from '../lib/shopify-api';
import { Badge } from '../components/Badge';
import { ShopifySetupGuide } from '../components/ShopifySetupGuide';

interface ShopHighProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function ShopHigh({ onNavigate }: ShopHighProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [shopifyNotConfigured, setShopifyNotConfigured] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProductsByCollection('high', 20);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error loading HIGH products:', err);
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
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000"
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
              HIGH
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 max-w-2xl mb-4">
              Higher contrast. Higher heat. 
              <span className="text-hotmess-red"> The silhouette of a man who stopped pretending long ago.</span>
            </p>
            <p className="text-lg text-zinc-500 max-w-xl">
              Statement pieces. Festival armor. Kink-positive aesthetics for unapologetic men.
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
          className="mb-12 p-6 bg-gradient-to-br from-red-950/30 to-transparent border-l-4 border-red-600"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg mb-2 text-red-400">Advanced Content - 18+ Only</h3>
              <p className="text-zinc-400 text-sm mb-3">
                HIGH features kink aesthetics including leather-look materials, harnesses, and fetish-adjacent designs. 
                These pieces are designed for adult environments where consent and boundaries are understood.
              </p>
              <button
                onClick={() => onNavigate('legalCareDisclaimer')}
                className="text-red-400 hover:underline text-sm"
              >
                Read our kink safety disclaimer →
              </button>
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
          <h2 className="text-2xl mb-3">What is HIGH?</h2>
          <p className="text-zinc-400 mb-4">
            The advanced collection. Reflective panels, vegan leather, full harnesses, and pieces that blur 
            the line between fashion and fetish. HIGH is for experienced users who understand kink culture, 
            consent practices, and how to navigate adult spaces safely.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <strong className="text-white">Fit:</strong> Statement to extreme
            </div>
            <div>
              <strong className="text-white">Materials:</strong> Vegan leather, reflective, specialty fabrics
            </div>
            <div>
              <strong className="text-white">Care:</strong> Specialist care required
            </div>
            <div>
              <strong className="text-white">Experience:</strong> Confident users
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl uppercase">All HIGH Products</h2>
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
              <p className="text-zinc-400 mb-4">No products found in HIGH collection.</p>
              <p className="text-sm text-zinc-500">Create products in your Shopify admin and tag them with "high"</p>
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

        {/* Kink Safety Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 p-8 bg-gradient-to-br from-red-950/30 to-black border-2 border-red-600"
        >
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl mb-2 text-red-400">Kink Culture Requires Care Culture</h3>
              <p className="text-zinc-400 mb-4">
                HIGH pieces embrace kink aesthetics—leather, harnesses, and fetish fashion. 
                If you're new to this world, please educate yourself first:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-400 mb-6">
                <li><strong className="text-white">Consent is non-negotiable:</strong> Kink aesthetics signal participation in a culture with specific rules</li>
                <li><strong className="text-white">Know your materials:</strong> Vegan leather, real leather, and specialty fabrics require different care</li>
                <li><strong className="text-white">Understand the signals:</strong> Some pieces carry cultural meanings in certain spaces</li>
                <li><strong className="text-white">Safety first:</strong> Harnesses and restraints should never restrict breathing or circulation</li>
              </ul>
              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate('care')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  Read Kink Safety Guide
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('legalCareDisclaimer')}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Care Disclaimer
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cross-Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('care')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Kink Safety Resources</h4>
            <p className="text-sm text-zinc-500 mb-3">Consent, boundaries, and scene safety</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Essential Reading
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('community')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Community</h4>
            <p className="text-sm text-zinc-500 mb-3">Connect with experienced users</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Join Discussion
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('beacons')}
            className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
          >
            <h4 className="text-xl mb-2 group-hover:text-hotmess-red transition-colors">Events</h4>
            <p className="text-sm text-zinc-500 mb-3">Find kink-friendly parties</p>
            <div className="flex items-center gap-2 text-hotmess-red text-sm">
              Browse Events
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
