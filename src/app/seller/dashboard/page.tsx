// app/seller/dashboard/page.tsx
// Seller Dashboard - MessMarket seller management

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  ShoppingBag,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SellerStats {
  totalSales: number;
  pendingPayouts: number;
  activeListings: number;
  totalListings: number;
  views: number;
  conversionRate: number;
  totalOrders: number;
  pendingShipments: number;
  completedOrders: number;
  sellerStatus: string;
  stripeConnected: boolean;
  stripeAccountId: string | null;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/login?redirect=/seller/dashboard');
        return;
      }

      setUserId(user.id);
      await loadDashboard(user.id);
    } catch (err: any) {
      console.error('Auth check failed:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const loadDashboard = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats from backend
      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/seller-dashboard`;
      const response = await fetch(`${API_BASE}/dashboard/stats/${uid}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No seller account yet - show onboarding
          setStats(null);
          setLoading(false);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load dashboard');
      }

      const data = await response.json();
      
      if (data.success && data.stats) {
        setStats(data.stats);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading seller dashboard...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-3xl uppercase" style={{ fontWeight: 900 }}>
            Error Loading Dashboard
          </h1>
          <p className="text-white/60">{error}</p>
          <button
            onClick={() => loadDashboard(userId!)}
            className="bg-hotmess-red hover:bg-red-600 text-white px-6 py-3 rounded-xl uppercase tracking-wide transition-all"
            style={{ fontWeight: 900 }}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // No seller account - show onboarding
  if (!stats) {
    return (
      <main className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
              BECOME A SELLER
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Join MessMarket's care-first marketplace and sell your experimental gear, 
              limited collabs, or bold designs to the HOTMESS community.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-hotmess-red/10 border border-hotmess-red/20 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-hotmess-red" />
              </div>
              <h3 className="uppercase tracking-wide" style={{ fontWeight: 700 }}>
                List Your Items
              </h3>
              <p className="text-sm text-white/60">
                Create listings with photos, descriptions, and pricing
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-hotmess-red/10 border border-hotmess-red/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-hotmess-red" />
              </div>
              <h3 className="uppercase tracking-wide" style={{ fontWeight: 700 }}>
                Get Paid
              </h3>
              <p className="text-sm text-white/60">
                Secure payouts through Stripe Connect
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-hotmess-red/10 border border-hotmess-red/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-hotmess-red" />
              </div>
              <h3 className="uppercase tracking-wide" style={{ fontWeight: 700 }}>
                Grow Your Sales
              </h3>
              <p className="text-sm text-white/60">
                Track analytics and engage with buyers
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-8 space-y-6">
            <h2 className="text-2xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
              How It Works
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-hotmess-red flex items-center justify-center shrink-0" style={{ fontWeight: 900 }}>
                  1
                </div>
                <div>
                  <h4 className="uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                    Apply to Sell
                  </h4>
                  <p className="text-sm text-white/60">
                    Fill out our seller application and agree to community guidelines
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-hotmess-red flex items-center justify-center shrink-0" style={{ fontWeight: 900 }}>
                  2
                </div>
                <div>
                  <h4 className="uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                    Connect Stripe
                  </h4>
                  <p className="text-sm text-white/60">
                    Set up your payment account to receive payouts
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-hotmess-red flex items-center justify-center shrink-0" style={{ fontWeight: 900 }}>
                  3
                </div>
                <div>
                  <h4 className="uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                    Start Listing
                  </h4>
                  <p className="text-sm text-white/60">
                    Create your first listing and start selling
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                // TODO: Implement seller application modal
                console.log('Seller application coming soon!');
              }}
              className="bg-hotmess-red hover:bg-red-600 text-white px-8 py-4 rounded-xl uppercase tracking-wide transition-all flex items-center gap-3 cursor-not-allowed opacity-50"
              style={{ fontWeight: 900 }}
              disabled
              title="Seller applications coming soon"
            >
              <Plus className="w-5 h-5" />
              Apply to Become a Seller
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Has seller account - show dashboard
  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-5xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
            SELLER DASHBOARD
          </h1>
          <p className="text-white/60">
            Manage your MessMarket presence
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-xs text-white/40 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                Total Sales
              </span>
            </div>
            <div className="text-3xl text-white" style={{ fontWeight: 900 }}>
              £{((stats.totalSales || 0) / 100).toFixed(2)}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <Package className="w-5 h-5 text-hotmess-red" />
              <span className="text-xs text-white/40 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                Active Listings
              </span>
            </div>
            <div className="text-3xl text-white" style={{ fontWeight: 900 }}>
              {stats.activeListings || 0}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-white/40 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                Views
              </span>
            </div>
            <div className="text-3xl text-white" style={{ fontWeight: 900 }}>
              {stats.views || 0}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-white/40 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                Orders
              </span>
            </div>
            <div className="text-3xl text-white" style={{ fontWeight: 900 }}>
              {stats.totalOrders || 0}
            </div>
          </div>
        </div>

        {/* Stripe Status */}
        {!stats.stripeConnected && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />
              <div className="flex-1">
                <h3 className="uppercase tracking-wide mb-2" style={{ fontWeight: 700 }}>
                  Connect Stripe to Receive Payments
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  You need to connect a Stripe account to receive payouts from sales.
                </p>
                <button
                  onClick={() => alert('Stripe Connect flow coming soon!')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg uppercase tracking-wide transition-all text-sm"
                  style={{ fontWeight: 900 }}
                >
                  Connect Stripe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/messmarket')}
            className="rounded-2xl border border-white/20 hover:border-hotmess-red hover:bg-black/60 bg-black/40 p-6 text-left transition-all group"
          >
            <Plus className="w-8 h-8 text-white/40 group-hover:text-hotmess-red mb-3 transition-colors" />
            <h3 className="uppercase tracking-wide mb-2" style={{ fontWeight: 700 }}>
              Create New Listing
            </h3>
            <p className="text-sm text-white/60">
              Add a new product to sell on MessMarket
            </p>
          </button>

          <button
            onClick={() => router.push('/messmarket')}
            className="rounded-2xl border border-white/20 hover:border-hotmess-red hover:bg-black/60 bg-black/40 p-6 text-left transition-all group"
          >
            <Package className="w-8 h-8 text-white/40 group-hover:text-hotmess-red mb-3 transition-colors" />
            <h3 className="uppercase tracking-wide mb-2" style={{ fontWeight: 700 }}>
              Manage Listings
            </h3>
            <p className="text-sm text-white/60">
              View and edit your active listings
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
