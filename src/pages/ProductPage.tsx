import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { getProductBySlug, formatPrice } from '../lib/mockData';
import { RouteId } from '../lib/routes';
import { useCart } from '../contexts/CartContext';

interface ProductPageProps {
  slug: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function ProductPage({ slug, onNavigate }: ProductPageProps) {
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl uppercase mb-4" style={{ fontWeight: 900 }}>Product not found</h1>
          <button
            onClick={() => onNavigate('shop')}
            className="text-hot uppercase tracking-wider" style={{ fontWeight: 700 }}
          >
            ← Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // NOTE: ProductPage uses mock data which doesn't have Shopify variant IDs
    // In production, this page should fetch from Shopify API like ShopProductDetail does
    // For now, we'll skip adding to cart to prevent API errors
    toast.error('Please use the Shop page to add items to cart');
    console.warn('ProductPage uses mock data without Shopify variant IDs. Use ShopProductDetail for actual cart operations.');
    
    // Uncomment when this page is updated to use Shopify API:
    // addItem({
    //   productId: product.id,
    //   variantId: 'gid://shopify/ProductVariant/...', // Get from Shopify API
    //   slug: product.slug,
    //   title: product.title,
    //   category: product.category,
    //   price: product.pricePence,
    //   qty: qty,
    //   size: selectedSize,
    //   image: product.images[0],
    // });
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen bg-black">
      {/* Back button */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-6">
        <button
          onClick={() => onNavigate(`shop-${product.category.toLowerCase()}` as RouteId)}
          className="flex items-center gap-2 text-white/60 hover:text-hot transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
            Back to {product.category}
          </span>
        </button>
      </div>

      {/* Product content */}
      <div className="px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl">
          {/* Product image */}
          <motion.div
            className="aspect-square bg-white/5 overflow-hidden border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Product details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category badge */}
            <div className="inline-block px-3 py-1 bg-hot/20 border border-hot/40 mb-6">
              <span className="text-hot uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                {product.category}
              </span>
            </div>

            {/* Title & Price */}
            <h1 
              className="text-white uppercase tracking-wider mb-4"
              style={{ fontWeight: 900, fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              {product.title}
            </h1>
            
            <div 
              className="text-hot mb-8"
              style={{ fontWeight: 900, fontSize: '42px' }}
            >
              {formatPrice(product.pricePence)}
            </div>

            {/* Description */}
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity selector */}
            <div className="mb-8">
              <label className="text-white/60 uppercase tracking-wider text-xs block mb-3" style={{ fontWeight: 700 }}>
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 border border-white/20 hover:border-hot flex items-center justify-center transition-colors"
                >
                  <Minus size={20} className="text-white" />
                </button>
                <span className="text-white text-2xl w-12 text-center" style={{ fontWeight: 900 }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 border border-white/20 hover:border-hot flex items-center justify-center transition-colors"
                >
                  <Plus size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-8">
              <label className="text-white/60 uppercase tracking-wider text-xs block mb-3" style={{ fontWeight: 700 }}>
                Size
              </label>
              <div className="flex items-center gap-4">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border ${
                      selectedSize === size ? 'border-hot' : 'border-white/20'
                    } hover:border-hot flex items-center justify-center transition-colors`}
                  >
                    <span className="text-white text-2xl" style={{ fontWeight: 900 }}>{size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full h-16 uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
                'bg-hot hover:bg-white text-white hover:text-black'
              }`}
              style={{ fontWeight: 900 }}
            >
              <ShoppingCart size={24} />
              <span>Add to Cart</span>
            </button>

            {/* View cart link */}
            <button
              onClick={() => onNavigate('shopCart')}
              className="w-full mt-4 h-14 border border-white/20 hover:border-hot text-white uppercase tracking-wider transition-all"
              style={{ fontWeight: 700 }}
            >
              View Cart
            </button>

            {/* Product details */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '16px' }}>
                Details
              </h3>
              <ul className="space-y-2 text-white/60">
                <li>• Free shipping on orders over £50</li>
                <li>• UK-based brand</li>
                <li>• Designed for queer men</li>
                <li>• No refunds on worn items</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}