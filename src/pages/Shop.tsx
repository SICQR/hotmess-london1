import { ShoppingBag, Zap, Package, TrendingUp, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SHOP } from '../design-system/tokens';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getProductsByCollection } from '../lib/shopify-api';
import { ShopifyConnectionTest } from '../components/ShopifyConnectionTest';

interface ShopProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  collection: 'raw' | 'hung' | 'high' | 'super';
  price: number;
  images: string[];
  description: string;
  bestseller: boolean;
  newArrival: boolean;
  stock: 'in' | 'low' | 'out';
  xp: number;
}

export function Shop({ onNavigate }: ShopProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const collections = [
    { id: 'all', label: 'All Products' },
    { id: 'superhung', label: 'SUPERHUNG', tagline: 'Limited capsule collection' },
    { id: 'hnh-mess', label: 'HNH MESS', tagline: 'Essential gear for the night' },
  ];

  // Fetch products on mount and when collection changes
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      try {
        if (selectedCollection === 'all') {
          // Fetch all collections
          const [superhungProducts, hnhMessProducts] = await Promise.all([
            getProductsByCollection('superhung', 20),
            getProductsByCollection('hnh-mess', 20),
          ]);
          
          setProducts([...superhungProducts, ...hnhMessProducts] as Product[]);
        } else {
          // Fetch single collection
          const collectionProducts = await getProductsByCollection(selectedCollection, 20);
          setProducts(collectionProducts as Product[]);
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCollection]);

  return (
    <div className="min-h-screen bg-black">
      {/* Editorial Hero */}
      <section className="relative h-[60vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=2000"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-16">
          <motion.h1 
            className="text-[96px] md:text-[180px] uppercase tracking-[-0.04em] leading-[0.85] text-white mb-4"
            style={{ fontWeight: 900 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SHOP
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Three lines. One attitude. <span className="text-hot">RAW. HUNG. HIGH.</span>
          </motion.p>
        </div>
      </section>

      <div className="px-8 md:px-16 lg:px-24 py-24">
        {/* Collection Filter */}
        <motion.div 
          className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {collections.map((collection, i) => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={`p-6 border transition-all duration-300 ${
                selectedCollection === collection.id
                  ? 'bg-white text-black border-white'
                  : 'bg-black border-white/20 hover:border-hot text-white'
              }`}
            >
              <h4 className="mb-2 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                {collection.label}
              </h4>
              {collection.tagline && (
                <p className={`text-sm ${selectedCollection === collection.id ? 'text-black/60' : 'text-white/40'}`}>
                  {collection.tagline}
                </p>
              )}
            </button>
          ))}
        </motion.div>

        {/* Stats Bar */}
        <div className="mb-12 grid grid-cols-3 gap-6">
          <div className="p-4 bg-black/50 border border-hot/30 text-center">
            <TrendingUp className="mx-auto mb-2 text-hot" size={24} />
            <div className="text-2xl text-white mb-1">{products.length}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Products</div>
          </div>
          <div className="p-4 bg-black/50 border border-hot/30 text-center">
            <Package className="mx-auto mb-2 text-heat" size={24} />
            <div className="text-2xl text-white mb-1">Free</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Shipping</div>
          </div>
          <div className="p-4 bg-black/50 border border-hot/30 text-center">
            <Zap className="mx-auto mb-2 text-lime" size={24} />
            <div className="text-2xl text-white mb-1">+XP</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">On Purchases</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader className="animate-spin text-hot mb-4" size={48} />
            <p className="text-white/60">Loading products from Shopify...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-8 border border-hot/50 bg-red-950/20 text-center">
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-hot hover:bg-heat transition-colors uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No products found"
                description="Check back soon for new drops."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const isHovered = hoveredProduct === product.id;
                  
                  return (
                    <div
                      key={product.id}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      onClick={() => onNavigate('shopProduct', { slug: product.slug })}
                      className="group transition-all hover-glow cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative aspect-square mb-4 overflow-hidden bg-gray-900 border-2 border-transparent group-hover:border-hot transition-all">
                        <ImageWithFallback
                          src={product.images[0] || 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400'}
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

                        {/* Quick View */}
                        <div className={`absolute inset-0 bg-black/80 flex items-center justify-center transition-opacity duration-300 ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <button className="px-6 py-3 bg-hot hover:bg-heat transition-colors uppercase tracking-wider neon-border">
                            View Product
                          </button>
                        </div>

                        {/* XP Badge */}
                        <div className="absolute bottom-4 right-4">
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-black/90 border border-hot/50">
                            <Zap size={14} className="text-hot" />
                            <span className="text-xs text-hot">+{product.xp} XP</span>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="mb-2">
                          <Badge 
                            label={product.collection.toUpperCase()} 
                            variant={
                              product.collection === 'raw' ? 'hot' :
                              product.collection === 'hung' ? 'heat' :
                              'lime'
                            }
                            size="sm"
                          />
                        </div>
                        
                        <h4 className="mb-2 text-white group-hover:text-hot transition-colors">
                          {product.name}
                        </h4>
                        
                        <p className="mb-3 text-sm text-gray-400 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-2xl text-hot">£{product.price}</span>
                          <button
                            disabled={product.stock === 'out'}
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('shopProduct', { slug: product.slug });
                            }}
                            className={`px-4 py-2 uppercase tracking-wider text-sm transition-all ${
                              product.stock === 'out'
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-hot hover:bg-heat text-white'
                            }`}
                          >
                            {product.stock === 'out' ? 'Sold Out' : 'View'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        {!loading && products.length > 0 && (
          <div className="mt-16 p-8 bg-gradient-to-br from-red-950/50 to-black border-2 border-hot text-center wet-texture">
            <h3 className="mb-3 text-white">Can't decide?</h3>
            <p className="mb-6 text-gray-400">
              Every purchase earns XP. Every piece tells a story.
            </p>
            <button
              onClick={() => onNavigate('drops')}
              className="px-8 py-4 bg-hot hover:bg-heat transition-all uppercase tracking-wider neon-border hover-glow"
            >
              Check Limited Drops
            </button>
          </div>
        )}
      </div>
      
      {/* Shopify Connection Test Button - Development only */}
      {/* <ShopifyConnectionTest /> */}
    </div>
  );
}