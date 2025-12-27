import { useState, useEffect } from 'react';
import { SellerLayout } from '../../components/layouts/SellerLayout';
import { RouteId } from '../../lib/routes';
import { supabase as supabaseClient } from '../../lib/supabase';
import { Store, Loader2, ExternalLink, Save } from 'lucide-react';
import { StripeConnectOnboarding } from '../../components/seller/StripeConnectOnboarding';
import { StripeConnectDashboard } from '../../components/seller/StripeConnectDashboard';
import { toast } from 'sonner';

interface SellerSettingsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface SellerData {
  id: string;
  display_name: string;
  bio: string | null;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  status: string;
}

export function SellerSettings({ onNavigate }: SellerSettingsProps) {
  const supabase: any = supabaseClient;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadSeller();
  }, []);

  const loadSeller = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('market_sellers')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading seller:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setSeller(data);
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!seller) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('market_sellers')
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
        })
        .eq('id', seller.id);

      if (error) throw error;

      toast.success('Settings saved');
      loadSeller();
    } catch (err) {
      console.error('Error saving:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout currentRoute="sellerSettings" onNavigate={onNavigate}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-hot animate-spin" />
        </div>
      </SellerLayout>
    );
  }

  if (!seller) {
    return (
      <SellerLayout currentRoute="sellerSettings" onNavigate={onNavigate}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-6" style={{ fontWeight: 400, fontSize: '14px' }}>No seller account found</p>
            <button
              onClick={() => onNavigate('sellerOnboarding')}
              className="px-6 py-3 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider"
              style={{ fontWeight: 900, fontSize: '14px' }}
            >
              BECOME A SELLER
            </button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout currentRoute="sellerSettings" onNavigate={onNavigate}>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            SELLER SETTINGS
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Manage your shop details and payment settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Shop Details */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Store className="w-6 h-6 text-hot" />
              <h2 className="uppercase tracking-wider text-white" style={{ fontWeight: 900, fontSize: '20px' }}>
                SHOP DETAILS
              </h2>
            </div>

            <div>
              <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>Shop Name</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 bg-black border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-hot transition-colors"
                  placeholder="Enter shop name..."
                  style={{ fontWeight: 400, fontSize: '14px' }}
                  maxLength={100}
                />
                <button
                  onClick={handleSave}
                  disabled={saving || displayName.trim() === seller.display_name}
                  className="px-6 py-3 bg-hot hover:bg-white text-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 uppercase tracking-wider"
                  style={{ fontWeight: 900, fontSize: '14px' }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>Shop Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-hot transition-colors resize-none"
                placeholder="Tell buyers about your shop..."
                style={{ fontWeight: 400, fontSize: '14px' }}
                maxLength={500}
              />
              <div className="flex justify-between mt-2">
                <p className="text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
                  This will appear on your seller profile
                </p>
                <span className="text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
                  {bio.length}/500
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-white/40 uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '10px' }}>SELLER ID</div>
                  <div className="text-white font-mono" style={{ fontWeight: 400, fontSize: '11px' }}>{seller.id}</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '10px' }}>STATUS</div>
                  <div className={`uppercase tracking-wider inline-block px-2 py-1 ${
                    seller.status === 'approved' ? 'text-green-500 bg-green-500/10 border border-green-500/20' :
                    seller.status === 'pending' ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20' :
                    'text-red-500 bg-red-500/10 border border-red-500/20'
                  }`} style={{ fontWeight: 700, fontSize: '10px' }}>
                    {seller.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Connect */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ExternalLink className="w-6 h-6 text-hot" />
              <h2 className="uppercase tracking-wider text-white" style={{ fontWeight: 900, fontSize: '20px' }}>
                PAYMENT SETTINGS
              </h2>
            </div>

            {!seller.stripe_onboarding_complete ? (
              <div>
                <p className="text-white/60 mb-4" style={{ fontWeight: 400, fontSize: '14px' }}>
                  Connect your Stripe account to receive payments
                </p>
                <StripeConnectOnboarding onComplete={loadSeller} />
              </div>
            ) : (
              <div>
                <p className="text-white/60 mb-4" style={{ fontWeight: 400, fontSize: '14px' }}>
                  Your Stripe account is connected. Manage your payout settings below.
                </p>
                {seller.stripe_account_id && (
                  <div className="mb-4 p-3 bg-black border border-white/10">
                    <div className="text-white/40 uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '10px' }}>
                      STRIPE ACCOUNT
                    </div>
                    <div className="text-white font-mono" style={{ fontWeight: 400, fontSize: '11px' }}>
                      {seller.stripe_account_id}
                    </div>
                  </div>
                )}
                <StripeConnectDashboard />
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 p-6">
            <h2 className="uppercase tracking-wider text-red-500 mb-3" style={{ fontWeight: 900, fontSize: '20px' }}>
              DANGER ZONE
            </h2>
            <p className="text-white/60 mb-4" style={{ fontWeight: 400, fontSize: '13px' }}>
              Deactivating your seller account will hide all your listings and prevent new orders. You can reactivate it at any time.
            </p>
            <button
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 transition-colors uppercase tracking-wider"
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              DEACTIVATE SELLER ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
