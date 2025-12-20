/**
 * HOTMESS LONDON — PURCHASE TICKET PAGE
 * 
 * Ticket purchase flow with Stripe payment
 */

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card } from '../../components/design-system/Card';
import { HMButton } from '../../components/library/HMButton';
import { supabase } from '../../lib/supabase';
import { purchaseTicket } from '../../lib/stripe/stripeService';
import { STRIPE_PUBLISHABLE_KEY } from '../../lib/env';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface TicketEvent {
  id: string;
  name: string;
  start_time: string;
  venue_name?: string;
  cover_image?: string;
  price_ga?: number;
  price_vip?: number;
}

/**
 * Checkout Form Component
 */
function CheckoutForm({ eventId, tier, price, onSuccess }: {
  eventId: string;
  tier: 'ga' | 'vip';
  price: number;
  onSuccess: (ticketId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Confirm the payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/my-tickets`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setErrorMessage(stripeError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      // Payment succeeded!
      onSuccess('ticket-id'); // TODO: Get actual ticket ID from payment metadata
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}

      <HMButton
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? 'Processing...' : `Pay £${(price / 100).toFixed(2)}`}
      </HMButton>
    </form>
  );
}

/**
 * Main Purchase Page
 */
export default function PurchaseTicket() {
  // Parse query params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('event');
  const tier = (urlParams.get('tier') as 'ga' | 'vip') || 'ga';

  const [event, setEvent] = useState<TicketEvent | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError('No event selected');
      setLoading(false);
      return;
    }

    loadEventAndCreateIntent();
  }, [eventId, tier]);

  async function loadEventAndCreateIntent() {
    try {
      // Get event details
      const { data: eventData, error: eventError } = await supabase
        .from('club_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError || !eventData) {
        setError('Event not found');
        setLoading(false);
        return;
      }

      setEvent(eventData);

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to purchase tickets. Click the button below to login.');
        setLoading(false);
        return;
      }

      // Get price for selected tier
      const price = tier === 'ga' ? eventData.price_ga : eventData.price_vip;
      if (!price) {
        setError('Ticket tier not available');
        setLoading(false);
        return;
      }

      // Create Payment Intent
      const result = await purchaseTicket(
        eventId!,
        tier,
        price,
        session.user.email || '',
        session.access_token
      );

      if (!result.success || !result.clientSecret) {
        setError(result.error || 'Failed to initialize payment');
        setLoading(false);
        return;
      }

      setClientSecret(result.clientSecret);
      setLoading(false);
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Failed to load event details');
      setLoading(false);
    }
  }

  function handleSuccess(ticketId: string) {
    window.location.href = `/my-tickets?success=true&ticket=${ticketId}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error || 'Something went wrong'}</p>
          <div className="flex flex-col gap-3">
            {error?.includes('logged in') && (
              <>
                <HMButton onClick={() => window.location.href = `/login?redirect=/tickets/purchase?event=${eventId}&tier=${tier}`}>
                  Login
                </HMButton>
                <HMButton onClick={() => window.location.href = `/register?redirect=/tickets/purchase?event=${eventId}&tier=${tier}`} variant="secondary">
                  Create Account
                </HMButton>
              </>
            )}
            <HMButton onClick={() => window.location.href = '/tickets'} variant="ghost">
              Back to Tickets
            </HMButton>
          </div>
        </Card>
      </div>
    );
  }

  const price = tier === 'ga' ? event.price_ga : event.price_vip;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl mb-2">Purchase Ticket</h1>
          <p className="text-gray-400">Secure checkout powered by Stripe</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Event Details */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Event Details</h3>
            
            {event.cover_image && (
              <img
                src={event.cover_image}
                alt={event.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Event</p>
                <p className="font-medium">{event.name}</p>
              </div>

              {event.venue_name && (
                <div>
                  <p className="text-gray-400 text-sm">Venue</p>
                  <p className="font-medium">{event.venue_name}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm">Date & Time</p>
                <p className="font-medium">
                  {new Date(event.start_time).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  <br />
                  {new Date(event.start_time).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Ticket Tier</p>
                <p className="font-medium uppercase">{tier}</p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-red-500">
                  £{price ? (price / 100).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </Card>

          {/* Payment Form */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Payment Details</h3>

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  eventId={eventId!}
                  tier={tier}
                  price={price || 0}
                  onSuccess={handleSuccess}
                />
              </Elements>
            )}

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500">
                🔒 Secure payment processing by Stripe. Your payment information is encrypted and secure.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
