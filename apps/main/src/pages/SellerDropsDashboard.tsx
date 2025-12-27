// HOTMESS LONDON - Seller Drops Dashboard
// Analytics and management for sellers

import { useState } from 'react';
import { TrendingUp, Package, DollarSign, Zap, Eye, Heart, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSellerDrops } from '../hooks/useDrops';
import { HotmessButton } from '../components/hotmess/Button';
import { StatCard } from '../components/StatCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { DropCreationWizard } from '../components/drops/DropCreationWizard';

interface SellerDropsDashboardProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function SellerDropsDashboard({ onNavigate }: SellerDropsDashboardProps) {
  const { user, session } = useAuth();
  const { drops, loading, refetch } = useSellerDrops(user?.id || '');
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Sign in to manage drops</h2>
          <HotmessButton onClick={() => onNavigate('login')}>
            Sign In
          </HotmessButton>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Loading your drops..." />;
  }

  const totalRevenue = drops.reduce((sum, drop) => sum + (drop.price * drop.quantity_sold), 0);
  const totalSales = drops.reduce((sum, drop) => sum + drop.quantity_sold, 0);
  const totalViews = drops.reduce((sum, drop) => sum + (drop.views || 0), 0);
  const totalXP = drops.reduce((sum, drop) => sum + (drop.quantity_sold * 10), 0);

  const activeDrops = drops.filter(d => d.status === 'live').length;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-neutral-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-white mb-2">My Drops</h1>
              <p className="text-white/60">Manage your product drops and track performance</p>
            </div>
            <HotmessButton
              onClick={() => setShowCreateWizard(true)}
              icon={<Plus size={20} />}
            >
              Create Drop
            </HotmessButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Revenue"
            value={`£${totalRevenue.toFixed(2)}`}
            icon={<DollarSign className="w-5 h-5 text-green-400" />}
            change="+12.5%"
            trend="up"
          />
          <StatCard
            label="Total Sales"
            value={totalSales.toString()}
            icon={<Package className="w-5 h-5 text-blue-400" />}
            subtitle={`${activeDrops} active`}
          />
          <StatCard
            label="Total Views"
            value={totalViews.toString()}
            icon={<Eye className="w-5 h-5 text-purple-400" />}
          />
          <StatCard
            label="XP Earned"
            value={totalXP.toString()}
            icon={<Zap className="w-5 h-5 text-yellow-400" />}
          />
        </div>

        {/* Drops List */}
        {drops.length === 0 ? (
          <EmptyState
            title="No drops yet"
            message="Create your first drop to start selling"
            icon={<Package className="w-12 h-12 text-white/40" />}
            action={
              <HotmessButton onClick={() => setShowCreateWizard(true)}>
                Create First Drop
              </HotmessButton>
            }
          />
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl text-white mb-4">Your Drops</h2>
            {drops.map((drop) => (
              <div
                key={drop.id}
                className="p-6 bg-neutral-900 border border-white/10 rounded-xl hover:border-white/20 transition-all cursor-pointer"
                onClick={() => onNavigate('messmessMarketProduct', { slug: drop.id })}
              >
                <div className="flex items-start gap-4">
                  {/* Image */}
                  {drop.images[0] && (
                    <img
                      src={drop.images[0]}
                      alt={drop.title}
                      className="w-24 h-24 object-cover rounded-lg bg-neutral-800"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white mb-1">{drop.title}</h3>
                        <p className="text-sm text-white/60">
                          {drop.type.toUpperCase()} • {(drop as any).city ?? ''}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        drop.status === 'live' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : drop.status === 'sold_out'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/10 text-white/60 border border-white/10'
                      }`}>
                        {drop.status.toUpperCase()}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-xs text-white/60 mb-1">Price</div>
                        <div className="text-white">£{drop.price}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/60 mb-1">Sold</div>
                        <div className="text-white">{drop.quantity_sold}/{drop.quantity}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/60 mb-1">Views</div>
                        <div className="text-white">{drop.views || 0}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/60 mb-1">Revenue</div>
                        <div className="text-white">£{(drop.price * drop.quantity_sold).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Wizard */}
      {session && (
        <DropCreationWizard
          isOpen={showCreateWizard}
          onClose={() => setShowCreateWizard(false)}
          authToken={session.access_token}
          onSuccess={() => {
            refetch();
            setShowCreateWizard(false);
          }}
        />
      )}
    </div>
  );
}
