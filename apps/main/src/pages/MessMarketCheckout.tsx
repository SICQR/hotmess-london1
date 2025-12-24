/**
 * MessMarket Checkout
 *
 * Uses Supabase Edge Function `market-checkout-create` which returns a Stripe Checkout
 * Session URL (`checkout_url`). We collect shipping details in-app, then redirect the
 * buyer to Stripe-hosted Checkout.
 */

import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Lock, Mail, MapPin, Phone, ShoppingCart, User } from 'lucide-react';

import { supabase } from '../lib/supabase';
import { RouteId } from '../lib/routes';

interface MessMarketCheckoutProps {
  listingId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Listing {
  id: string;
  title: string;
  price_pence: number;
  media?: Array<{
    storage_path: string;
    alt?: string;
  }>;
  seller?: {
    display_name: string;
  };
}

export function MessMarketCheckout({ listingId, onNavigate }: MessMarketCheckoutProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostcode, setShippingPostcode] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const { data: listingData, error: listingError } = await supabase
          .from('market_listings')
          .select(
            `
            id,
            title,
            price_pence,
            media,
            seller:market_sellers(display_name)
          `
          )
          .eq('id', listingId)
          .single();

        if (listingError) throw listingError;
        if (cancelled) return;

        setListing(listingData as any);

        const { data: userData } = await supabase.auth.getUser();
        if (!cancelled && userData?.user?.email) {
          setShippingEmail(userData.user.email);
        }
      } catch (e: any) {
        console.error('Checkout init error:', e);
        if (!cancelled) setError(e?.message || 'Failed to initialize checkout');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    if (!shippingName || !shippingEmail || !shippingAddress || !shippingCity || !shippingPostcode) {
      setError('Please fill in all required shipping details');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const session = sessionData.session;

      if (!session) {
        setError('Please log in to checkout');
        setProcessing(false);
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke('market-checkout-create', {
        body: {
          listing_id: listing.id,
          quantity: 1,
          buyer_shipping: {
            name: shippingName,
            line1: shippingAddress,
            city: shippingCity,
            postcode: shippingPostcode,
            country: 'GB',
            phone: shippingPhone || undefined,
          },
          notes: null,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (fnError) throw fnError;

      const checkoutUrl = (data as any)?.checkout_url as string | undefined;
      if (!checkoutUrl) throw new Error('Checkout URL not returned');

      window.location.assign(checkoutUrl);
    } catch (e: any) {
      console.error('Checkout error:', e);
      setError(e?.message || 'Checkout failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-hotmess-red animate-spin" />
          <p className="text-zinc-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-zinc-400">Listing not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => onNavigate('messmessMarketProduct', { slug: listingId })}
            className="text-zinc-400 hover:text-zinc-300 mb-4"
            type="button"
          >
            ← Back to listing
          </button>
          <h1 className="text-3xl flex items-center gap-3">
            <Lock className="w-8 h-8 text-hotmess-red" />
            SECURE CHECKOUT
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-red-900/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-hotmess-red" />
                <h2 className="text-xl">SHIPPING INFORMATION</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-hotmess-red transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingEmail}
                      onChange={(e) => setShippingEmail(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-hotmess-red transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-hotmess-red transition-colors"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Address *</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-hotmess-red transition-colors"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">City *</label>
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-hotmess-red transition-colors"
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Postcode *</label>
                    <input
                      type="text"
                      value={shippingPostcode}
                      onChange={(e) => setShippingPostcode(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-hotmess-red transition-colors"
                      placeholder="Postcode"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-red-900/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-hotmess-red" />
                <h2 className="text-xl">PAYMENT DETAILS</h2>
              </div>

              <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-zinc-300">Payments are handled on a secure Stripe Checkout page.</p>
                <p className="text-xs text-zinc-500 mt-2">You’ll be redirected after you click Pay.</p>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-hotmess-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    PAY £{(listing.price_pence / 100).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-red-900/20 rounded-lg p-6 sticky top-4">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart className="w-5 h-5 text-hotmess-red" />
                <h2 className="text-xl">ORDER SUMMARY</h2>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  {listing.media?.[0]?.storage_path && (
                    <img
                      src={listing.media[0].storage_path}
                      alt={listing.media?.[0]?.alt || listing.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-bold">{listing.title}</p>
                    <p className="text-sm text-zinc-400">by {listing.seller?.display_name || 'Unknown Seller'}</p>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total</span>
                    <span className="text-hotmess-red">£{(listing.price_pence / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
