// HOTMESS LONDON - Drops Hub Page
// Main directory of all product drops

import { useState } from 'react';
import { Plus, Filter, Zap, Clock, MapPin, Music } from 'lucide-react';
import { DropCard } from '../components/hotmess/DropCard';
import { DropCreationWizard } from '../components/drops/DropCreationWizard';
import { HotmessButton } from '../components/hotmess/Button';
import { useDrops } from '../hooks/useDrops';
import { useAuth } from '../contexts/AuthContext';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { DropType } from '../types/drops';

interface DropsHubProps {
  onNavigate: (route: any, params?: any) => void;
}

export function DropsHub({ onNavigate }: DropsHubProps) {
  const { user, session } = useAuth();
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<DropType | ''>('');
  
  const { drops, loading, error, refetch } = useDrops({
    city: selectedCity || undefined,
    type: selectedType || undefined,
    status: 'live',
    limit: 20,
  });

  const typeIcons: Record<string, any> = {
    instant: <Zap className="w-4 h-4" />,
    timed: <Clock className="w-4 h-4" />,
    location: <MapPin className="w-4 h-4" />,
    dual: <Music className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-hot/20 to-transparent border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl text-white mb-4">Product Drops</h1>
            <p className="text-lg text-white/80 mb-6">
              Limited edition products from the community. Bot-powered, city-first, instant gratification.
            </p>
            {user && (
              <HotmessButton
                onClick={() => setShowCreateWizard(true)}
                icon={<Plus size={20} />}
              >
                Create a Drop
              </HotmessButton>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-white/10 bg-neutral-900/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Filter size={16} />
              <span>Filter:</span>
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white"
            >
              <option value="">All Cities</option>
              <option value="london">London</option>
              <option value="berlin">Berlin</option>
              <option value="paris">Paris</option>
              <option value="amsterdam">Amsterdam</option>
            </select>

            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedType === ''
                    ? 'bg-hot text-white'
                    : 'bg-neutral-800 text-white/60 hover:text-white'
                }`}
              >
                All Types
              </button>
              {(['instant', 'timed', 'location', 'dual'] as DropType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedType === type
                      ? 'bg-hot text-white'
                      : 'bg-neutral-800 text-white/60 hover:text-white'
                  }`}
                >
                  {typeIcons[type]}
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drops Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingState message="Loading drops..." />
        ) : error ? (
          <div className="text-red-400 text-center py-12">{error}</div>
        ) : drops.length === 0 ? (
          <EmptyState
            title="No drops found"
            message="Be the first to create a drop in this city!"
            icon={<Zap className="w-12 h-12 text-white/40" />}
            action={
              user ? (
                <HotmessButton onClick={() => setShowCreateWizard(true)}>
                  Create First Drop
                </HotmessButton>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {drops.map((drop) => (
              <DropCard
                key={drop.id}
                drop={{
                  id: drop.id,
                  name: drop.title,
                  price: drop.price,
                  seller: drop.seller_username,
                  image: drop.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600',
                  xp: drop.xp_reward,
                  stock: drop.quantity - drop.quantity_sold,
                  endsAt: drop.ends_at ? new Date(drop.ends_at).toLocaleDateString() : undefined,
                }}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Drop Wizard */}
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
