import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Share2, Zap, Info, ExternalLink, ChevronLeft, ChevronRight, Check, AlertTriangle, Loader, QrCode, Download, Link as LinkIcon } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getProductByHandle, getProductsByCollection, createCheckout } from '../lib/shopify-api';
import { Badge } from '../components/Badge';
import { toast } from 'sonner@2.0.3';
import { SaveButton } from '../components/SaveButton';
import { useCart } from '../contexts/CartContext';
import { analytics } from '../lib/analytics';
import { generateQRDataURL, downloadQRCode } from '../lib/qr-generator';
import { calculateXP } from '../lib/xp-system';

interface ShopProductDetailProps {
  slug: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function ShopProductDetail({ slug, onNavigate }: ShopProductDetailProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProductByHandle(slug);
        setProduct(data);
        setError(data ? null : 'Product not found');
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAftercareModal, setShowAftercareModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const { addItem } = useCart();

  // Track page view
  useEffect(() => {
    if (product) {
      analytics.commerce('product_viewed', {
        productId: product.id,
        productName: product.name,
        price: product.price,
      });
    }
  }, [product]);

  // Fetch related products from same collection
  useEffect(() => {
    async function fetchRelated() {
      if (!product) return;
      try {
        const collectionHandle = product.collection === 'raw' ? 'superhung' : 'hnh-mess';
        const products = await getProductsByCollection(collectionHandle, 4);
        setRelatedProducts(products.filter(p => p.slug !== product.slug).slice(0, 3));
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    }
    fetchRelated();
  }, [product]);

  // Set default color when product loads
  useEffect(() => {
    if (product?.colors?.[0]) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-hotmess-red mx-auto mb-4" />
          <p className="text-zinc-400">Loading product from Shopify...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl mb-4">{error || 'Product Not Found'}</h1>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 bg-hotmess-red hover:bg-red-600 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0 && !product.sizes.includes('One Size')) {
      toast.error('Please select a size');
      return;
    }

    // Show aftercare modal if product has aftercare note
    if (product.aftercareNote) {
      setShowAftercareModal(true);
    } else {
      addToCart();
    }
  };

  const addToCart = () => {
    toast.success(`Added ${product.name} to cart`);
    setShowAftercareModal(false);
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.name,
      category: product.collection,
      price: product.price,
      qty: quantity,
      size: selectedSize || undefined,
      image: product.images[0]
    });
    analytics.commerce('add_to_cart', { 
      productId: product.id,
      productName: product.name,
      quantity, 
      price: product.price,
    });
  };

  const handleShare = async () => {
    const productURL = `${window.location.origin}/shop/${product.slug}`;
    
    analytics.action('product_share_clicked', 'commerce', undefined, { productId: product.id });

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on HOTMESS LONDON`,
          url: productURL
        });
        analytics.action('product_shared', 'commerce', undefined, { productId: product.id, method: 'native' });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleGenerateQR = async () => {
    const productURL = `${window.location.origin}/shop/${product.slug}`;
    try {
      const qrURL = await generateQRDataURL(productURL, {
        size: 512,
        darkColor: '#FF0055',
        lightColor: '#000000'
      });
      setQrDataURL(qrURL);
      setShowQRModal(true);
      analytics.action('product_qr_generated', 'commerce', undefined, { productId: product.id });
    } catch (err) {
      console.error('QR generation error:', err);
      toast.error('Failed to generate QR code');
    }
  };

  const handleDownloadQR = async () => {
    if (!qrDataURL) return;
    const productURL = `${window.location.origin}/shop/${product.slug}`;
    try {
      await downloadQRCode(productURL, `HOTMESS-${product.slug}-QR.png`, {
        size: 1024,
        darkColor: '#FF0055',
        lightColor: '#000000'
      });
      toast.success('QR code downloaded');
      analytics.action('product_qr_downloaded', 'commerce', undefined, { productId: product.id });
    } catch (err) {
      console.error('QR download error:', err);
      toast.error('Failed to download QR code');
    }
  };

  const copyProductLink = () => {
    const productURL = `${window.location.origin}/shop/${product.slug}`;
    navigator.clipboard.writeText(productURL);
    toast.success('Link copied to clipboard');
    analytics.action('product_link_copied', 'commerce', undefined, { productId: product.id });
  };

  const generateAffiliateLink = () => {
    // TODO: Replace with actual affiliate system
    const productURL = `${window.location.origin}/shop/${product.slug}?ref=USER_ID`;
    navigator.clipboard.writeText(productURL);
    toast.success('Affiliate link copied! Join the program to earn commission.');
    analytics.action('affiliate_link_generated', 'commerce', undefined, { productId: product.id });
  };

  const collectionColors: Record<string, string> = {
    raw: 'hotmess-red',
    hung: 'orange-500',
    high: 'yellow-500',
    super: 'red-600'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb - Brutalist */}
      <div className="px-6 md:px-16 lg:px-24 py-6 border-b border-brutal">
        <div className="flex items-center gap-2 text-sm text-white/40 uppercase tracking-wider">
          <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Shop</button>
          <span>/</span>
          <button 
            onClick={() => {
              if (product.collection === 'raw') onNavigate('shopRaw');
              else if (product.collection === 'hung') onNavigate('shopHung');
              else if (product.collection === 'high') onNavigate('shopHigh');
              else if (product.collection === 'super') onNavigate('shopSuper');
            }}
            className="hover:text-white transition-colors uppercase"
          >
            {product.collection}
          </button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Image Gallery - Brutalist */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square mb-4 overflow-hidden bg-mono-900 border border-brutal">
              <ImageWithFallback
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.bestseller && (
                  <div className="px-3 py-1 bg-hotmess-red text-white text-xs uppercase tracking-wider font-semibold">
                    Bestseller
                  </div>
                )}
                {product.newArrival && (
                  <div className="px-3 py-1 bg-white text-black text-xs uppercase tracking-wider font-semibold">
                    New
                  </div>
                )}
                {product.limitedEdition && (
                  <div className="px-3 py-1 bg-white text-black text-xs uppercase tracking-wider font-semibold">
                    Limited
                  </div>
                )}
                {product.stock === 'low' && (
                  <div className="px-3 py-1 bg-hotmess-red text-white text-xs uppercase tracking-wider font-semibold">
                    Low Stock
                  </div>
                )}
              </div>

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    disabled={selectedImage === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/90 hover:bg-black disabled:opacity-30 flex items-center justify-center border border-brutal transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}
                    disabled={selectedImage === product.images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/90 hover:bg-black disabled:opacity-30 flex items-center justify-center border border-brutal transition-all"
                  >
                    <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square overflow-hidden bg-mono-900 border-2 transition-all ${
                      selectedImage === i ? 'border-hotmess-red' : 'border-brutal hover:border-brutal-strong'
                    }`}
                  >
                    <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Brutalist */}
          <div>
            <div className="mb-4">
              <div className="inline-block px-3 py-1 border border-brutal-strong text-xs uppercase tracking-wider font-semibold">
                {product.collection.toUpperCase()}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl mb-6 uppercase tracking-tight" style={{ fontWeight: 700 }}>
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-brutal">
              <span className="text-4xl text-white" style={{ fontWeight: 700 }}>£{product.price}</span>
              <div className="flex items-center gap-2 px-3 py-1 border border-hotmess-red">
                <Zap size={16} className="text-hotmess-red" strokeWidth={1.5} />
                <span className="text-sm text-hotmess-red font-semibold">+{product.xp} XP</span>
              </div>
            </div>

            <div 
              className="text-lg text-white/70 mb-8 leading-relaxed prose prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-1 max-w-none"
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />

            {/* Size Selection - Brutalist */}
            {product.sizes.length > 0 && !product.sizes.includes('One Size Adjustable') && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm uppercase tracking-wider text-white/50 font-semibold">Size</label>
                  <button className="text-sm text-hotmess-red hover:text-white transition-colors uppercase tracking-wider font-semibold">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border transition-all uppercase tracking-wide font-semibold ${
                        selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-brutal text-white/70 hover:border-brutal-strong hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection - Brutalist */}
            {product.colors && product.colors.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm uppercase tracking-wider text-white/50 mb-3 font-semibold">
                  Color: {selectedColor}
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-16 h-16 border-2 flex items-center justify-center transition-all ${
                        selectedColor === color ? 'border-white' : 'border-brutal hover:border-brutal-strong'
                      }`}
                      style={{ backgroundColor: color.toLowerCase().replace(/\s+/g, '') }}
                    >
                      {selectedColor === color && <Check className="text-white" strokeWidth={2} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity - Brutalist */}
            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider text-white/50 mb-3 font-semibold">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-transparent hover:bg-white/5 border border-brutal transition-all"
                >
                  -
                </button>
                <span className="text-2xl w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-transparent hover:bg-white/5 border border-brutal transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions - Brutalist */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 'out'}
                className={`flex-1 h-16 uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-semibold ${
                  product.stock === 'out'
                    ? 'bg-mono-800 text-white/30 cursor-not-allowed border border-brutal'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {product.stock === 'out' ? 'Sold Out' : 'Add to Cart'}
              </button>
              <SaveButton
                contentType="product"
                contentId={product.id || slug}
                metadata={{
                  title: product.title,
                  description: product.category,
                  image: product.images?.[0]?.src
                }}
                size="lg"
              />
              <button 
                onClick={handleShare}
                className="w-16 h-16 bg-transparent hover:bg-white/5 border border-brutal flex items-center justify-center transition-all"
              >
                <Share2 className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Share & QR Actions - NEW */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleGenerateQR}
                className="px-4 py-3 bg-transparent hover:bg-white/5 border border-brutal flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider"
              >
                <QrCode size={18} strokeWidth={1.5} />
                Generate QR
              </button>
              <button
                onClick={generateAffiliateLink}
                className="px-4 py-3 bg-transparent hover:bg-white/5 border border-brutal flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider"
              >
                <LinkIcon size={18} strokeWidth={1.5} />
                Affiliate Link
              </button>
            </div>

            {/* Product Details - Brutalist */}
            <div className="space-y-6 p-6 border border-brutal">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-3 font-semibold">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-start gap-3">
                      <span className="text-hotmess-red mt-1">—</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-3 font-semibold">Materials</h3>
                <p className="text-sm text-white/70">{product.materials.join(', ')}</p>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-3 font-semibold">Care Instructions</h3>
                <p className="text-sm text-white/70">{product.careInstructions}</p>
              </div>
            </div>

            {/* Aftercare Note Preview */}
            {product.aftercareNote && (
              <div className="mt-6 p-6 border-l-2 border-hotmess-red bg-hotmess-red/5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-hotmess-red flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <h4 className="text-sm text-hotmess-red mb-2 uppercase tracking-wider font-semibold">Aftercare Reminder</h4>
                    <p className="text-sm text-white/70">{product.aftercareNote}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cross-Links Section */}
        <div className="mb-16 p-8 bg-gradient-to-br from-hotmess-red/10 to-transparent border-l-4 border-hotmess-red">
          <h3 className="text-2xl mb-6">Complete Your Look</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => onNavigate('care')}
              className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
            >
              <h4 className="text-lg mb-2 group-hover:text-hotmess-red transition-colors">Care Resources</h4>
              <p className="text-sm text-zinc-500 mb-3">Pre-party prep and aftercare guides</p>
              <div className="flex items-center gap-2 text-hotmess-red text-sm">
                Read Guides
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('radio')}
              className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
            >
              <h4 className="text-lg mb-2 group-hover:text-hotmess-red transition-colors">Getting Ready Playlist</h4>
              <p className="text-sm text-zinc-500 mb-3">Soundtrack from HOTMESS Radio</p>
              <div className="flex items-center gap-2 text-hotmess-red text-sm">
                Listen Now
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('affiliate')}
              className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-left group"
            >
              <h4 className="text-lg mb-2 group-hover:text-hotmess-red transition-colors">Love This?</h4>
              <p className="text-sm text-zinc-500 mb-3">Earn 15% commission sharing this product</p>
              <div className="flex items-center gap-2 text-hotmess-red text-sm">
                Join Affiliate
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl mb-8 uppercase">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.filter(p => p.id !== product.id).map((relProduct) => (
              <button
                key={relProduct.id}
                onClick={() => onNavigate('shopProduct', { slug: relProduct.slug })}
                className="text-left group"
              >
                <div className="relative aspect-square mb-4 overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-hotmess-red transition-all">
                  <ImageWithFallback
                    src={relProduct.images[0]}
                    alt={relProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-lg mb-2 group-hover:text-hotmess-red transition-colors">{relProduct.name}</h4>
                <span className="text-hotmess-red">£{relProduct.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aftercare Modal */}
      {showAftercareModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full p-8 bg-zinc-900 border-2 border-hotmess-red"
          >
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-8 h-8 text-hotmess-red flex-shrink-0" />
              <div>
                <h3 className="text-2xl mb-3">Before You Go...</h3>
                <p className="text-zinc-300 mb-4">{product.aftercareNote}</p>
                <p className="text-zinc-400 text-sm mb-6">
                  HOTMESS is care-first. We want you to look amazing AND feel safe. 
                  Consider visiting our Care hub for preparation and recovery tips.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('care')}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                <Info className="w-4 h-4" />
                Visit Care Hub First
              </button>
              <button
                onClick={addToCart}
                className="flex-1 px-6 py-3 bg-hotmess-red hover:bg-red-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrDataURL && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6" onClick={() => setShowQRModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 bg-zinc-900 border-2 border-hotmess-red"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl uppercase tracking-tight">Product QR Code</h3>
              <button onClick={() => setShowQRModal(false)} className="text-white/60 hover:text-white">✕</button>
            </div>

            <div className="bg-black p-6 mb-6 flex items-center justify-center">
              <img src={qrDataURL} alt="Product QR Code" className="w-64 h-64" />
            </div>

            <p className="text-sm text-white/60 mb-6 text-center">
              Scan this QR code to view {product.name} on any device
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleDownloadQR}
                className="flex-1 px-6 py-3 bg-hotmess-red hover:bg-red-600 transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                <Download size={18} />
                Download QR
              </button>
              <button
                onClick={copyProductLink}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                <LinkIcon size={18} />
                Copy Link
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6" onClick={() => setShowShareModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 bg-zinc-900 border-2 border-hotmess-red"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl uppercase tracking-tight">Share Product</h3>
              <button onClick={() => setShowShareModal(false)} className="text-white/60 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <button
                onClick={copyProductLink}
                className="w-full px-6 py-4 bg-transparent hover:bg-white/5 border border-brutal flex items-center gap-3 transition-all"
              >
                <LinkIcon size={20} />
                <span>Copy Link</span>
              </button>

              <button
                onClick={handleGenerateQR}
                className="w-full px-6 py-4 bg-transparent hover:bg-white/5 border border-brutal flex items-center gap-3 transition-all"
              >
                <QrCode size={20} />
                <span>Generate QR Code</span>
              </button>

              <button
                onClick={generateAffiliateLink}
                className="w-full px-6 py-4 bg-hotmess-red hover:bg-red-600 border border-hotmess-red flex items-center gap-3 transition-all"
              >
                <Zap size={20} />
                <span>Get Affiliate Link (15% commission)</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}