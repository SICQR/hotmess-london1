import { useState, useEffect } from 'react';
import { SellerLayout } from '../../components/layouts/SellerLayout';
import { RouteId } from '../../lib/routes';
import { supabase } from '../../lib/supabase';
import { DollarSign, TrendingUp, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface SellerPayoutsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface PayoutSummary {
  ok: boolean;
  onboarding: boolean;
  reason?: string;
  seller_id?: string;
  stripe_account_id?: string;
  balance?: {
    available: Array<{ amount: number; currency: string }>;
    pending: Array<{ amount: number; currency: string }>;
  };
  payouts?: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    arrival_date: string | null;
    created: string | null;
    description: string | null;
  }>;
}

const currencySymbol = (c: string) => (c || 'GBP').toUpperCase() === 'GBP' ? '£' : '€';

export function SellerPayouts({ onNavigate }: SellerPayoutsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PayoutSummary | null>(null);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Edge function doesn't exist yet - gracefully handle
      try {
        const { data: result, error: invokeError } = await supabase.functions.invoke(
          'seller-payout-summary',
          { body: {} }
        );

        if (invokeError) {
          console.warn('Payout summary function not available:', invokeError);
          setError('Payout data is not yet available. This feature is still being configured.');
          setData(null);
          setLoading(false);
          return;
        }

        setData(result as PayoutSummary);
        setLoading(false);
      } catch (funcError) {
        console.warn('Payout function not available:', funcError);
        setError('Payout data is not yet available. This feature is still being configured.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading payouts:', err);
      setError(err instanceof Error ? err.message : 'Could not load payouts');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout currentRoute="sellerPayouts" onNavigate={onNavigate}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-hotmess-red animate-spin" />
        </div>
      </SellerLayout>
    );
  }

  if (error || !data) {
    return (
      <SellerLayout currentRoute="sellerPayouts" onNavigate={onNavigate}>
        <div className="max-w-3xl">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-red-200 mb-4">{error || 'Could not load payouts'}</p>
              <button
                onClick={loadPayouts}
                className="px-4 py-2 bg-hotmess-red hover:bg-red-600 rounded transition-colors text-sm"
              >
                RETRY
              </button>
            </div>
          </div>
        </div>
      </SellerLayout>
    );
  }

  // Onboarding incomplete
  if (!data.onboarding) {
    let message = 'Connect your Stripe account to view payouts';
    let cta = 'START STRIPE ONBOARDING';

    if (data.reason === 'onboarding_incomplete') {
      message = 'Finish Stripe Connect onboarding to start receiving payouts';
      cta = 'COMPLETE ONBOARDING';
    }

    return (
      <SellerLayout currentRoute="sellerPayouts" onNavigate={onNavigate}>
        <div className="max-w-3xl">
          <div className="mb-8">
            <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>PAYOUTS</h1>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>View your Stripe Connect balance and payout history</p>
          </div>

          <div className="bg-white/5 border border-yellow-500/20 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="uppercase tracking-wider text-white mb-3" style={{ fontWeight: 900, fontSize: '24px' }}>STRIPE SETUP REQUIRED</h2>
            <p className="text-white/60 mb-6" style={{ fontWeight: 400, fontSize: '14px' }}>{message}</p>
            <button
              onClick={() => onNavigate('sellerSettings')}
              className="px-6 py-3 bg-hotmess-red hover:bg-red-600 rounded transition-colors flex items-center gap-2 mx-auto"
            >
              <ExternalLink className="w-4 h-4" />
              {cta}
            </button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  // Helper to aggregate balances by currency
  const byCurrency = (arr: Array<{ amount: number; currency: string }>) =>
    arr.reduce<Record<string, number>>((acc, x) => {
      const c = x.currency.toUpperCase();
      acc[c] = (acc[c] || 0) + x.amount;
      return acc;
    }, {});

  const availableMap = byCurrency(data.balance?.available || []);
  const pendingMap = byCurrency(data.balance?.pending || []);
  const payouts = data.payouts || [];

  const hasAvailable = Object.keys(availableMap).length > 0;
  const hasPending = Object.keys(pendingMap).length > 0;

  return (
    <SellerLayout currentRoute="sellerPayouts" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>PAYOUTS</h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Your Stripe Connect balance and payment history
          </p>
          <div className="mt-3 text-white/40 font-mono" style={{ fontWeight: 400, fontSize: '11px' }}>
            Stripe Account: {data.stripe_account_id}
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Available Balance */}
          <div className="bg-white/5 border border-green-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>AVAILABLE BALANCE</div>
                <div className="text-white/40" style={{ fontWeight: 400, fontSize: '10px' }}>Ready to pay out</div>
              </div>
            </div>

            {!hasAvailable ? (
              <div className="text-white/20" style={{ fontWeight: 900, fontSize: '32px' }}>£0.00</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(availableMap).map(([cur, amt]) => (
                  <div key={cur} className="flex items-baseline gap-2">
                    <div className="text-green-500" style={{ fontWeight: 900, fontSize: '32px' }}>
                      {currencySymbol(cur)}{(amt / 100).toFixed(2)}
                    </div>
                    <div className="text-white/40 uppercase" style={{ fontWeight: 700, fontSize: '11px' }}>{cur}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
              This is what's ready to be paid out from Stripe to your bank account. Stripe handles payouts automatically based on your schedule.
            </div>
          </div>

          {/* Pending Balance */}
          <div className="bg-white/5 border border-blue-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>PENDING BALANCE</div>
                <div className="text-white/40" style={{ fontWeight: 400, fontSize: '10px' }}>Processing or on hold</div>
              </div>
            </div>

            {!hasPending ? (
              <div className="text-white/20" style={{ fontWeight: 900, fontSize: '32px' }}>£0.00</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(pendingMap).map(([cur, amt]) => (
                  <div key={cur} className="flex items-baseline gap-2">
                    <div className="text-blue-500" style={{ fontWeight: 900, fontSize: '32px' }}>
                      {currencySymbol(cur)}{(amt / 100).toFixed(2)}
                    </div>
                    <div className="text-white/40 uppercase" style={{ fontWeight: 700, fontSize: '11px' }}>{cur}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
              Funds in settlement (card processing windows), dispute reserves, or fraud holds. These will become available after Stripe's review period.
            </div>
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="bg-white/5 border border-white/10 p-6">
          <h2 className="uppercase tracking-wider text-white mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>RECENT PAYOUTS</h2>

          {payouts.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40" style={{ fontWeight: 400, fontSize: '14px' }}>No payouts yet</p>
              <p className="text-white/30 mt-2" style={{ fontWeight: 400, fontSize: '12px' }}>
                Payouts will appear here once Stripe processes them
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between gap-6 p-4 bg-zinc-800 border border-zinc-700 rounded"
                >
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <div className="text-xl font-bold">
                        {currencySymbol(payout.currency)}{(payout.amount / 100).toFixed(2)}
                      </div>
                      <div className="text-sm text-zinc-500 uppercase">
                        {payout.currency}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                      {payout.created && (
                        <div>
                          Created: {new Date(payout.created).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                      {payout.arrival_date && (
                        <div>
                          Arrival: {new Date(payout.arrival_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                    </div>

                    {payout.description && (
                      <div className="text-sm text-zinc-400 mt-1">{payout.description}</div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                      payout.status === 'paid'
                        ? 'bg-green-500/20 text-green-500'
                        : payout.status === 'pending'
                        ? 'bg-blue-500/20 text-blue-500'
                        : payout.status === 'in_transit'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : payout.status === 'failed'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-zinc-700 text-zinc-400'
                    }`}>
                      {payout.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-sm text-zinc-400">
          <h3 className="text-white font-bold mb-3">ABOUT PAYOUTS</h3>
          <ul className="space-y-2">
            <li>• Stripe may hold funds for risk checks, chargebacks, or disputes</li>
            <li>• Payout timing depends on your Stripe country and risk profile (typically 2-7 days)</li>
            <li>• Platform fee (12% standard, 20% white-label) is deducted before payout</li>
            <li>• Use Seller Settings to update bank details or check Stripe onboarding status</li>
            <li>• Contact HOTMESS support for payout disputes or issues</li>
          </ul>

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <button
              onClick={() => onNavigate('sellerSettings')}
              className="text-hotmess-red hover:underline flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Manage Stripe Account Settings
            </button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}