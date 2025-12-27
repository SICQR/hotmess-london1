import { useState, useEffect, useRef } from 'react';
import { SellerLayout } from '../../components/layouts/SellerLayout';
import { RouteId } from '../../lib/routes';
import { supabase as supabaseClient } from '../../lib/supabase';
import type { Stripe } from '@stripe/stripe-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { loadStripeConnect } from '../../lib/stripe-loader';
import { StripeConnectOnboarding } from '../../components/seller/StripeConnectOnboarding';
import { CheckCircle, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface SellerOnboardingProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface SellerStatus {
  exists: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | null;
  stripe_onboarding_complete: boolean;
  stripe_account_id: string | null;
  display_name: string | null;
}

export function SellerOnboarding({ onNavigate }: SellerOnboardingProps) {
  const supabase: any = supabaseClient;
  const [sellerStatus, setSellerStatus] = useState<SellerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripeRef = useRef<Stripe | null>(null);

  useEffect(() => {
    loadSellerStatus();
  }, []);

  const loadSellerStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to access seller features');
        setLoading(false);
        return;
      }

      // Check if seller record exists
      const { data: seller, error: sellerError } = await supabase
        .from('market_sellers')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (sellerError) {
        console.error('Error fetching seller:', sellerError);
        setSellerStatus({
          exists: false,
          status: null,
          stripe_onboarding_complete: false,
          stripe_account_id: null,
          display_name: null
        });
      } else if (seller) {
        setSellerStatus({
          exists: true,
          status: seller.status,
          stripe_onboarding_complete: seller.stripe_onboarding_complete || false,
          stripe_account_id: seller.stripe_account_id,
          display_name: seller.display_name
        });
      } else {
        setSellerStatus({
          exists: false,
          status: null,
          stripe_onboarding_complete: false,
          stripe_account_id: null,
          display_name: null
        });
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading seller status:', err);
      setError(err instanceof Error ? err.message : 'Failed to load seller status');
      setLoading(false);
    }
  };

  const handleApplyAsSeller = async () => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    try {
      setOnboarding(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in');
        setOnboarding(false);
        return;
      }

      // Create seller application
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/market/seller/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            display_name: displayName.trim(),
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit application');
      }

      // Reload status
      await loadSellerStatus();
      setOnboarding(false);
    } catch (err) {
      console.error('Error applying as seller:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
      setOnboarding(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout currentRoute="sellerOnboarding" onNavigate={onNavigate}>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-hot animate-spin" />
        </div>
      </SellerLayout>
    );
  }

  // Already a seller with Stripe connected
  if (sellerStatus?.exists && sellerStatus.status === 'approved' && sellerStatus.stripe_onboarding_complete) {
    return (
      <SellerLayout currentRoute="sellerOnboarding" onNavigate={onNavigate}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-500/10 border-2 border-green-500 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="uppercase tracking-wider text-white mb-3" style={{ fontWeight: 900, fontSize: '32px' }}>
              You're all set!
            </h1>
            <p className="text-white/80 mb-6" style={{ fontWeight: 400, fontSize: '14px' }}>
              Your seller account is active and ready to start selling.
            </p>
            <button
              onClick={() => onNavigate('sellerDashboard')}
              className="px-8 py-3 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider"
              style={{ fontWeight: 900, fontSize: '14px' }}
            >
              GO TO DASHBOARD
            </button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout currentRoute="sellerOnboarding" onNavigate={onNavigate}>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            SELLER ONBOARDING
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Set up your MessMarket seller account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500 p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white" style={{ fontWeight: 700, fontSize: '14px' }}>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Not a seller yet */}
        {!sellerStatus?.exists && (
          <div className="bg-white/5 border border-white/10 p-8">
            <h2 className="uppercase tracking-wider text-white mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              BECOME A SELLER
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-hot uppercase tracking-wider mb-3" style={{ fontWeight: 900, fontSize: '16px' }}>
                  What you'll get:
                </h3>
                <ul className="space-y-2 text-white/80" style={{ fontWeight: 400, fontSize: '14px' }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                    <span>List unlimited products on MessMarket</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                    <span>Direct deposits via Stripe Connect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                    <span>Built-in analytics and order management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                    <span>Access to HOTMESS nightlife community</span>
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Seller Display Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. VIBE SUPPLY, NIGHT CRAWLER GEAR"
                  className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors"
                  maxLength={50}
                />
                <p className="mt-2 text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                  This is how your shop will appear to buyers
                </p>
              </div>

              <button
                onClick={handleApplyAsSeller}
                disabled={onboarding || !displayName.trim()}
                className="w-full px-8 py-4 bg-hot hover:bg-white text-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                {onboarding ? 'SUBMITTING...' : 'APPLY TO BECOME A SELLER'}
              </button>
            </div>
          </div>
        )}

        {/* Pending approval */}
        {sellerStatus?.exists && sellerStatus.status === 'pending' && (
          <div className="bg-yellow-500/10 border-2 border-yellow-500 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div>
                <h2 className="uppercase tracking-wider text-white mb-3" style={{ fontWeight: 900, fontSize: '24px' }}>
                  APPLICATION PENDING
                </h2>
                <p className="text-white/80 mb-4" style={{ fontWeight: 400, fontSize: '14px' }}>
                  Your seller application is being reviewed. You'll receive an email once it's been approved.
                </p>
                <p className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
                  Display Name: <strong className="text-white">{sellerStatus.display_name}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Approved but need Stripe */}
        {sellerStatus?.exists && sellerStatus.status === 'approved' && !sellerStatus.stripe_onboarding_complete && (
          <div className="bg-white/5 border border-white/10 p-8">
            <h2 className="uppercase tracking-wider text-white mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              CONNECT STRIPE
            </h2>
            <p className="text-white/80 mb-6" style={{ fontWeight: 400, fontSize: '14px' }}>
              Your seller application has been approved! Complete Stripe Connect onboarding to start receiving payments.
            </p>
            <StripeConnectOnboarding onComplete={loadSellerStatus} />
          </div>
        )}

        {/* Rejected */}
        {sellerStatus?.exists && sellerStatus.status === 'rejected' && (
          <div className="bg-red-500/10 border-2 border-red-500 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="uppercase tracking-wider text-white mb-3" style={{ fontWeight: 900, fontSize: '24px' }}>
                  APPLICATION DECLINED
                </h2>
                <p className="text-white/80 mb-4" style={{ fontWeight: 400, fontSize: '14px' }}>
                  Unfortunately, your seller application was not approved at this time.
                </p>
                <p className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
                  If you have questions, please contact support.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suspended */}
        {sellerStatus?.exists && sellerStatus.status === 'suspended' && (
          <div className="bg-orange-500/10 border-2 border-orange-500 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-orange-500 flex-shrink-0" />
              <div>
                <h2 className="uppercase tracking-wider text-white mb-3" style={{ fontWeight: 900, fontSize: '24px' }}>
                  ACCOUNT SUSPENDED
                </h2>
                <p className="text-white/80 mb-4" style={{ fontWeight: 400, fontSize: '14px' }}>
                  Your seller account has been temporarily suspended.
                </p>
                <p className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
                  Please contact support for more information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-white/5 border border-white/10 p-6">
          <h3 className="text-white uppercase tracking-wider mb-3" style={{ fontWeight: 900, fontSize: '16px' }}>
            SELLER REQUIREMENTS
          </h3>
          <ul className="space-y-2 text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
            <li>• Must be 18+ and comply with all community guidelines</li>
            <li>• Valid Stripe Connect account required for payouts</li>
            <li>• All products must comply with platform policies</li>
            <li>• Responsible for shipping and customer service</li>
          </ul>
        </div>
      </div>
    </SellerLayout>
  );
}
