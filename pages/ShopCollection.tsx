import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { getProductsByCategory, formatPrice, type Product } from '../lib/mockData';
import { RouteId } from '../lib/routes';

interface ShopCollectionProps {
  collection: 'RAW' | 'HUNG' | 'HIGH' | 'SUPER';
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

const collectionInfo = {
  RAW: {
    title: 'RAW',
    tagline: 'No filter. No apologies.',
    description: 'Mesh, see-through, unapologetic. For the gym, the club, the street. Wear it how you want.',
  },
  HUNG: {
    title: 'HUNG',
    tagline: 'Leather. Harness. Power.',
    description: 'Premium leather goods. Harnesses, caps, accessories. Crafted for impact.',
  },
  HIGH: {
    title: 'HIGH',
    tagline: 'Reflective. Loud. Visible.',
    description: 'High-vis brutalism. Bucket hats, vests, accessories. Be seen.',
  },
  SUPER: {
    title: 'SUPER',
    tagline: 'Oversized. Comfort. Statement.',
    description: 'Heavy hoodies, oversized tees, loungewear. Logo loud and proud.',
  },
};

export function ShopCollection({ collection, onNavigate }: ShopCollectionProps) {
  const products = getProductsByCategory(collection);
  const info = collectionInfo[collection];

  return (
    <div className="min-h-screen bg-black">
      {/* Back button */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-6">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-white/60 hover:text-hot transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
            Back to Shop
          </span>
        </button>
      </div>

      {/* Hero */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-white uppercase tracking-[-0.03em] leading-none mb-6"
            style={{ fontWeight: 900, fontSize: 'clamp(64px, 12vw, 160px)' }}
          >
            {info.title}
          </h1>
          <p 
            className="text-hot uppercase tracking-wider mb-4"
            style={{ fontWeight: 700, fontSize: 'clamp(18px, 3vw, 28px)' }}
          >
            {info.tagline}
          </p>
          <p className="text-white/60 max-w-2xl text-lg">
            {info.description}
          </p>
        </motion.div>
      </div>

      {/* Products grid */}
      <div className="px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.button
              key={product.id}
              onClick={() => onNavigate('shopProduct', { slug: product.slug })}
              className="group text-left bg-black border border-white/20 hover:border-hot transition-all overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Product image */}
              <div className="aspect-square overflow-hidden bg-white/5">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 
                    className="text-white uppercase tracking-wider flex-1"
                    style={{ fontWeight: 700, fontSize: '16px' }}
                  >
                    {product.title}
                  </h3>
                  <span 
                    className="text-hot"
                    style={{ fontWeight: 900, fontSize: '18px' }}
                  >
                    {formatPrice(product.pricePence)}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 text-hot">
                  <ShoppingCart size={16} />
                  <span className="text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                    View Product
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700 }}>
              Coming soon
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-white/10 px-6 lg:px-12 py-12">
        <div className="max-w-4xl">
          <h2 
            className="text-white uppercase tracking-wider mb-4"
            style={{ fontWeight: 900, fontSize: 'clamp(24px, 4vw, 42px)' }}
          >
            Not sure? Check out all collections
          </h2>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-hot hover:bg-white text-white hover:text-black transition-all px-8 py-4 uppercase tracking-wider"
            style={{ fontWeight: 900 }}
          >
            View All Shop
          </button>
        </div>
      </div>
    </div>
  );
}
