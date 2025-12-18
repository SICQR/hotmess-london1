import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RouteId } from '../lib/routes';
import { Package, ShoppingBag, Truck, AlertCircle, Loader2, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { SaveButton } from '../components/SaveButton';

interface MessMarketProductProps {
  slug: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Listing {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price_pence: number;
  currency?: string; // Now an enum: currency_code
  status: 'draft' | 'active' | 'paused' | 'removed'; // Now an enum: listing_status
  fulfilment_mode?: 'seller_fulfilled' | 'white_label_partner';
  quantity_available: number;
  category: string;
  tags?: string[];
  sku?: string;
  public_brand_name?: string;
  public_support_name?: string;
  shipping_policy?: string;
  returns_policy?: string;
  created_at: string;
  updated_at?: string;
  seller?: {
    id: string;
    display_name: string;
    status: string;
    white_label_enabled: boolean;
  } | null;
  media?: Array<{
    id: string;
    storage_path: string;
    alt: string;
    sort?: number;
  }>;
}

const currencySymbol = (c: string) => (c || 'GBP').toUpperCase() === 'GBP' ? '£' : '€';

export function MessMarketProductPage({ slug, onNavigate }: MessMarketProductProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [busyCheckout, setBusyCheckout] = useState(false);
  
  // Shipping form
  const [shipName, setShipName] = useState('');
  const [shipLine1, setShipLine1] = useState('');
  const [shipLine2, setShipLine2] = useState('');
  const [shipCity, setShipCity] = useState('');
  const [shipPostcode, setShipPostcode] = useState('');
  const [shipCountry, setShipCountry] = useState('GB');

  useEffect(() => {
    loadListing();
  }, [slug]);

  const loadListing = async () => {
    try {
      setLoading(true);
      setError(null);

      if (import.meta.env.DEV) {
        console.log('🔍 Loading listing with slug:', slug);
      }

      // Try to find by slug first, then by id if slug is actually a UUID
      // Query with all related data
      let query = supabase
        .from('market_listings')
        .select(`
          *,
          seller:market_sellers(id, display_name, status, white_label_enabled),
          media:market_listing_media(id, storage_path, alt, sort)
        `)
        .eq('status', 'active');

      // If slug looks like a UUID, search by id instead
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { data, error: fetchError } = await query.maybeSingle();

      if (import.meta.env.DEV) {
        console.log('📦 Query result:', { data, error: fetchError });
      }

      if (fetchError || !data) {
        console.error('❌ Listing not found:', fetchError);
        setError(`Listing not found or unavailable (slug: ${slug})`);
        setLoading(false);
        return;
      }

      // Transform data - Supabase returns seller and media as arrays
      const rawData = data as any;
      const sortedMedia = (rawData.media || []).sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0));
      const seller = Array.isArray(rawData.seller) ? rawData.seller[0] : rawData.seller;
      
      setListing({ ...rawData, media: sortedMedia, seller } as any);
      setLoading(false);
    } catch (err) {
      console.error('Error loading listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listing');
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!listing) return;
    
    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Please log in to purchase');
      return;
    }

    // Navigate to checkout page with listing ID
    onNavigate('messmarketCheckout', { listingId: listing.id });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-hotmess-red animate-spin" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl mb-4">LISTING NOT FOUND</h1>
          <p className="text-zinc-400 mb-6">{error || 'This listing is unavailable'}</p>
          <button
            onClick={() => onNavigate('messmarket')}
            className="px-6 py-3 bg-hotmess-red hover:bg-red-600 rounded transition-colors"
          >
            BACK TO MESSMARKET
          </button>
        </div>
      </div>
    );
  }

  const seller = listing.seller;
  const fulf = listing.fulfilment_mode || 'seller_fulfilled';
  const symbol = '£'; // All prices are in GBP
  const maxQty = Math.max(1, Math.min(10, listing.quantity_available || 1));
  const totalPrice = (listing.price_pence * quantity) / 100;

  const isWhiteLabel = fulf === 'white_label_partner';
  const fulfLabel = isWhiteLabel
    ? 'White-Label by HOTMESS • Fulfilled by partner'
    : `Sold by ${seller?.display_name || 'Test Seller Shop'}`;

  const canBuy = listing.status === 'active' && listing.quantity_available > 0 && !busyCheckout;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => onNavigate('messmarket')}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to MessMarket
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl mb-4">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-2 rounded text-sm font-bold ${
                  isWhiteLabel
                    ? 'bg-hotmess-purple text-white'
                    : 'bg-zinc-800 text-white'
                }`}>
                  {isWhiteLabel ? 'WHITE-LABEL' : 'SELLER FULFILLED'}
                </span>
                <span className="px-4 py-2 rounded bg-zinc-900 text-sm text-zinc-400">
                  by {seller?.display_name || 'Test Seller Shop'}
                </span>
                <span className="px-4 py-2 rounded bg-zinc-900 text-sm text-zinc-400 capitalize">
                  {listing.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-hotmess-red mb-2">
                {symbol}{(listing.price_pence / 100).toFixed(2)}
              </div>
              {listing.quantity_available <= 0 ? (
                <div className="text-sm text-red-500 font-bold">SOLD OUT</div>
              ) : listing.quantity_available <= 5 ? (
                <div className="text-sm text-yellow-500">
                  Only {listing.quantity_available} left
                </div>
              ) : (
                <div className="text-sm text-zinc-500">
                  {listing.quantity_available} in stock
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"
            >
              {listing.media && listing.media.length > 0 ? (
                <img
                  src={listing.media[0].storage_path}
                  alt={listing.media[0].alt || listing.title}
                  className="w-full h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-[500px] flex items-center justify-center bg-zinc-800">
                  <Package className="w-24 h-24 text-zinc-700" />
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6"
            >
              <h2 className="text-2xl mb-4">DETAILS</h2>
              {listing.description && (
                <p className="text-zinc-300 whitespace-pre-wrap mb-6">{listing.description}</p>
              )}
              
              {listing.tags && listing.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {listing.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm text-zinc-400">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white">Fulfilment:</span> {fulfLabel}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Store className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white">Support:</span> All support runs through in-app order threads. No direct contact details shared.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Checkout Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-2xl mb-6">CHECKOUT</h2>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">QUANTITY</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors flex items-center justify-center text-xl"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
                    className="flex-1 text-center bg-zinc-800 border border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-hotmess-red transition-colors"
                  />
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors flex items-center justify-center text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="mb-6 pb-6 border-b border-zinc-800">
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400">Item total</span>
                  <span className="font-bold">
                    {symbol}{totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Shipping</span>
                  <span>Calculated by seller</span>
                </div>
              </div>

              {/* Shipping Form */}
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-bold text-zinc-400">SHIPPING DETAILS</h3>
                <input
                  type="text"
                  placeholder="Full name"
                  value={shipName}
                  onChange={(e) => setShipName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-hotmess-red transition-colors"
                />
                <input
                  type="text"
                  placeholder="Address line 1"
                  value={shipLine1}
                  onChange={(e) => setShipLine1(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-hotmess-red transition-colors"
                />
                <input
                  type="text"
                  placeholder="Address line 2 (optional)"
                  value={shipLine2}
                  onChange={(e) => setShipLine2(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-hotmess-red transition-colors"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shipCity}
                  onChange={(e) => setShipCity(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-hotmess-red transition-colors"
                />
                <input
                  type="text"
                  placeholder="Postcode"
                  value={shipPostcode}
                  onChange={(e) => setShipPostcode(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-hotmess-red transition-colors"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-200">
                  {error}
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={!canBuy}
                className="w-full py-4 bg-gradient-to-r from-hotmess-red to-hotmess-pink hover:opacity-90 rounded transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg mb-3"
              >
                {busyCheckout ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    REDIRECTING...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    CHECKOUT WITH STRIPE
                  </>
                )}
              </button>

              {/* Save Button */}
              <SaveButton
                contentType="product"
                contentId={listing.id}
                metadata={{
                  title: listing.title,
                  description: listing.description,
                  image: listing.media?.[0]?.storage_path
                }}
                size="lg"
                showLabel={true}
                className="w-full"
              />

              {!canBuy && listing.quantity_available <= 0 && (
                <div className="mt-3 text-sm text-red-500 text-center">
                  Temporarily sold out
                </div>
              )}

              {/* Fine Print */}
              <div className="mt-4 text-xs text-zinc-500 space-y-1">
                <p>18+ only. Secure payment via Stripe.</p>
                <p>No direct contact details exchanged. All support via in-app threads.</p>
                <p>Platform fee: {isWhiteLabel ? '20%' : '12%'} (included in price)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}