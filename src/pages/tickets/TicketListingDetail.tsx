/**
 * TICKET LISTING DETAIL PAGE
 * C2C ticket marketplace - single listing view with purchase button
 */

import { useState, useEffect } from 'react';
import { RouteId } from '../../lib/routes';
import { supabase } from '../../lib/supabase';
import { projectId } from '../../utils/supabase/info';
import {
  Calendar,
  MapPin,
  User,
  Tag,
  Shield,
  ArrowLeft,
  Ticket,
  AlertCircle,
} from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { Card } from '../../components/design-system/Card';
import { Badge } from '../../components/design-system/Badge';
import { SaveButton } from '../../components/SaveButton';
import { toast } from 'sonner';

interface TicketListingDetailProps {
  listingId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function TicketListingDetail({ listingId, onNavigate }: TicketListingDetailProps) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadListing();
  }, [listingId]);

  const loadListing = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/tickets-c2c/listings/${listingId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load listing');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setListing(data.listing);
      setLoading(false);
    } catch (err) {
      console.error('Error loading listing:', err);
      setError('Failed to load listing');
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please log in to purchase tickets');
      onNavigate('login');
      return;
    }

    setPurchasing(true);

    try {
      // Create checkout session
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/tickets-c2c/listings/${listingId}/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create checkout');
        setPurchasing(false);
        return;
      }

      const data = await response.json();

      // Redirect to purchase page with client secret
      onNavigate('ticketsPurchase', {
        listingId,
        purchaseId: data.purchase_id,
        clientSecret: data.client_secret,
      });
    } catch (err) {
      console.error('Purchase error:', err);
      toast.error('Failed to start purchase');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-hotmess-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-hotmess-gray-400">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-hotmess-red text-4xl mb-4">⚠️</div>
          <h2 className="mb-2">Listing Not Found</h2>
          <p className="text-hotmess-gray-400 mb-6">{error}</p>
          <HMButton onClick={() => onNavigate('tickets')}>
            Back to Tickets
          </HMButton>
        </Card>
      </div>
    );
  }

  const totalPrice = listing.price_pence * quantity;
  const buyerFee = Math.round(totalPrice * 0.10);
  const totalWithFees = totalPrice + buyerFee;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => onNavigate('tickets')}
          className="flex items-center gap-2 text-hotmess-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to tickets</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Event Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="mb-2">{listing.beacon?.event_name || 'Event'}</h1>
                  <div className="flex gap-2">
                    <Badge variant="default">
                      {listing.tier === 'ga' ? 'General Admission' : listing.tier === 'vip' ? 'VIP' : listing.tier}
                    </Badge>
                    {listing.quantity_available < 5 && (
                      <Badge variant="danger">Only {listing.quantity_available} left</Badge>
                    )}
                  </div>
                </div>
                <SaveButton contentType={"ticket" as any} contentId={listing.id} size="lg" />
              </div>

              <div className="space-y-3 text-hotmess-gray-300">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-hotmess-red" />
                  <span>
                    {new Date(listing.beacon?.event_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-hotmess-red" />
                  <span>{listing.beacon?.venue_name || 'Venue TBA'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-hotmess-red" />
                  <span>Sold by {listing.seller?.display_name || 'Anonymous'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-hotmess-red" />
                  <span>{listing.quantity_available} tickets available</span>
                </div>
              </div>
            </div>

            {listing.notes && (
              <div className="mb-6">
                <h3 className="mb-2 text-white">Seller Notes</h3>
                <p className="text-hotmess-gray-300 whitespace-pre-wrap">{listing.notes}</p>
              </div>
            )}

            {/* Safety Notice */}
            <Card className="p-4 bg-hotmess-red/10 border-hotmess-red/20">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-hotmess-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white mb-1">Buyer Protection</h4>
                  <p className="text-sm text-hotmess-gray-300">
                    Your payment is held in escrow until the seller provides proof of purchase.
                    You can approve or reject the proof before funds are released.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Purchase Card */}
          <div>
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl text-white font-black">
                    £{(listing.price_pence / 100).toFixed(2)}
                  </span>
                  <span className="text-hotmess-gray-400">per ticket</span>
                </div>
                <p className="text-sm text-hotmess-gray-500">
                  Original price: £{(listing.original_price_pence / 100).toFixed(2)}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm text-hotmess-gray-300 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={listing.quantity_available}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(listing.quantity_available, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-center text-white focus:outline-none focus:border-hotmess-red"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(listing.quantity_available, quantity + 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    disabled={quantity >= listing.quantity_available}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-hotmess-gray-300">
                  <span>Tickets ({quantity})</span>
                  <span>£{(totalPrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-hotmess-gray-300">
                  <span>Service fee (10%)</span>
                  <span>£{(buyerFee / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-black text-lg">
                  <span>Total</span>
                  <span>£{(totalWithFees / 100).toFixed(2)}</span>
                </div>
              </div>

              <HMButton
                onClick={handlePurchase}
                disabled={purchasing || listing.quantity_available < 1}
                className="w-full mb-3"
              >
                {purchasing ? 'Processing...' : 'Buy Tickets'}
              </HMButton>

              <p className="text-xs text-center text-hotmess-gray-500">
                By purchasing, you agree to our{' '}
                <button onClick={() => onNavigate('legalTerms')} className="underline hover:text-hotmess-red">
                  Terms of Service
                </button>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
