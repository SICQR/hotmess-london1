/**
 * MessMarket Checkout with Stripe Payment Element
 * Custom branded checkout experience using Stripe's Payment Element
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { projectId } from '../utils/supabase/info';
import { loadStripe } from '../lib/stripe-loader';
import { RouteId } from '../lib/routes';
import { StripeTestCardHelper } from '../components/StripeTestCardHelper';
import { 
  ShoppingCart, 
  Lock, 
  AlertCircle, 
  Loader2,
  CheckCircle,
  MapPin,
  User,
  Mail,
  Phone
} from 'lucide-react';

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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  
  // Shipping details
  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostcode, setShippingPostcode] = useState('');

  useEffect(() => {
    loadListingAndInitialize();
  }, [listingId]);

  const loadListingAndInitialize = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load listing
      const { data: listingData, error: listingError } = await supabase
        .from('market_listings')
        .select(`
          *,
          seller:market_sellers!inner(display_name)
        `)
        .eq('id', listingId)
        .single();

      if (listingError) {
        console.error('Error loading listing:', listingError);
        setError('Failed to load listing');
        setLoading(false);
        return;
      }

      setListing(listingData);

      // Load user details to pre-fill form
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setShippingEmail(user.email || '');
      }

      // Initialize Stripe
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        setError('Stripe not configured');
        setLoading(false);
        return;
      }

      const stripeInstance = await loadStripe(publishableKey);
      setStripe(stripeInstance);

      // Create payment intent
      await createPaymentIntent(listingData);

      setLoading(false);
    } catch (err) {
      console.error('Initialize error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize checkout');
      setLoading(false);
    }
  };

  const createPaymentIntent = async (listingData: Listing) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please log in to checkout');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/market/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            listing_id: listingData.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment intent error:', errorData);
        setError(errorData.error || 'Failed to create payment');
        return;
      }

      const data = await response.json();
      if (data?.client_secret) {
        setClientSecret(data.client_secret);
      } else {
        setError('No client secret returned');
      }
    } catch (err) {
      console.error('Create payment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create payment');
    }
  };

  useEffect(() => {
    if (stripe && clientSecret) {
      const elementsInstance = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#ef4444',
            colorBackground: '#18181b',
            colorText: '#fafafa',
            colorDanger: '#dc2626',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '0.5rem',
          },
        },
      });

      const paymentElement = elementsInstance.create('payment');
      paymentElement.mount('#payment-element');

      setElements(elementsInstance);
    }
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready');
      return;
    }

    // Validate shipping info
    if (!shippingName || !shippingAddress || !shippingCity || !shippingPostcode) {
      setError('Please fill in all shipping details');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}?route=messmarketOrder&payment_intent={PAYMENT_INTENT_ID}`,
          shipping: {
            name: shippingName,
            phone: shippingPhone || undefined,
            address: {
              line1: shippingAddress,
              city: shippingCity,
              postal_code: shippingPostcode,
              country: 'GB',
            },
          },
          receipt_email: shippingEmail,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
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
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('messmessMarketProduct', { slug: listingId })}
            className="text-zinc-400 hover:text-zinc-300 mb-4"
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
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

            {/* Payment Information */}
            <div className="bg-zinc-900 border border-red-900/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-hotmess-red" />
                <h2 className="text-xl">PAYMENT INFORMATION</h2>
              </div>

              {/* Test Card Helper (only shows in test mode) */}
              <div className="mb-4">
                <StripeTestCardHelper />
              </div>

              <div id="payment-element" className="mb-4"></div>

              <div className="flex items-start gap-2 text-sm text-zinc-400 mb-6">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p>
                  Your payment information is encrypted and secure. HOTMESS never stores
                  your card details.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={processing || !stripe || !elements}
                className="w-full py-4 bg-gradient-to-r from-hotmess-red to-hotmess-pink hover:opacity-90 rounded transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>PAY £{listing.price_pence / 100}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
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
                      alt={listing.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-bold">{listing.title}</p>
                    <p className="text-sm text-zinc-400">
                      by {listing.seller?.display_name || 'Unknown Seller'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Subtotal</span>
                    <span>£{listing.price_pence / 100}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Platform Fee (12%)</span>
                    <span>£{(listing.price_pence * 0.12) / 100}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-zinc-800">
                    <span>Total</span>
                    <span className="text-hotmess-red">
                      £{(listing.price_pence * 1.12) / 100}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}