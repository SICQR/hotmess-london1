import { Clock, Zap, ShoppingBag, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DROPS } from '../design-system/tokens';
import { CountdownTimer } from '../components/CountdownTimer';

interface DropsProps {
  onNavigate: (page: string) => void;
}

const mockDrops = [
  {
    id: 1,
    name: 'Midnight Mesh Set',
    category: 'RAW',
    price: 65,
    quantity: 50,
    dropTime: new Date(Date.now() + 3600000), // 1 hour from now
    image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600',
    status: 'upcoming' as const,
  },
  {
    id: 2,
    name: 'Shadow Crop',
    category: 'HUNG',
    price: 45,
    quantity: 30,
    dropTime: new Date(Date.now() + 86400000), // 24 hours from now
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    status: 'upcoming' as const,
  },
  {
    id: 3,
    name: 'Neon Strike Tank',
    category: 'HIGH',
    price: 55,
    quantity: 0,
    dropTime: new Date(Date.now() - 3600000), // 1 hour ago
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600',
    status: 'sold-out' as const,
  },
];

export function Drops({ onNavigate }: DropsProps) {
  const [countdown, setCountdown] = useState<Record<number, number>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdown: Record<number, number> = {};
      mockDrops.forEach(drop => {
        if (drop.status === 'upcoming') {
          const diff = drop.dropTime.getTime() - Date.now();
          newCountdown[drop.id] = Math.max(0, Math.floor(diff / 1000));
        }
      });
      setCountdown(newCountdown);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 glow-text">DROPS</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {DROPS.intro}
          </p>
        </div>

        {/* Live Drop Alert */}
        {mockDrops.some(d => countdown[d.id] <= 60 && countdown[d.id] > 0) && (
          <div className="mb-12 p-8 bg-gradient-to-br from-red-600 to-pink-600 neon-border animate-pulse">
            <div className="flex items-center gap-4 justify-center">
              <AlertCircle size={32} />
              <div className="text-center">
                <h3 className="mb-2">{DROPS.live}</h3>
                <p className="text-sm">
                  {DROPS.countdownUrgent.replace('{seconds}', String(
                    Math.max(...Object.values(countdown).filter(c => c <= 60 && c > 0))
                  ))}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Drops Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockDrops.map((drop) => {
            const isLive = drop.status === 'live';
            const isSoldOut = drop.status === 'sold-out';

            return (
              <div
                key={drop.id}
                className={`overflow-hidden transition-all hover-glow ${
                  isLive
                    ? 'bg-gradient-to-br from-red-950/50 to-pink-950/50 border-2 border-hot neon-border beacon-flare'
                    : isSoldOut
                    ? 'bg-black/50 border border-gray-800 opacity-60'
                    : 'bg-black/50 border border-hot/30 hover:border-hot'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-900">
                  <img
                    src={drop.image}
                    alt={drop.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  {isLive && (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-hot neon-border beacon-flare">
                      <span className="uppercase tracking-wider">LIVE NOW</span>
                    </div>
                  )}
                  
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="text-center">
                        <h4 className="mb-2 text-gray-400">{DROPS.soldOut}</h4>
                        <p className="text-sm text-gray-600">{DROPS.tooSlow}</p>
                      </div>
                    </div>
                  )}

                  {/* Countdown Overlay */}
                  {!isSoldOut && !isLive && drop.status === 'upcoming' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
                      <div className="w-full p-6">
                        <CountdownTimer targetDate={drop.dropTime} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="mb-1 text-white">{drop.name}</h3>
                      <p className="text-sm text-hot uppercase tracking-wider">{drop.category}</p>
                    </div>
                    <p className="text-2xl text-hot">£{drop.price}</p>
                  </div>

                  {!isSoldOut && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                      <Zap size={16} className="text-hot" />
                      <span>Limited to {drop.quantity} units</span>
                    </div>
                  )}

                  {/* Actions */}
                  {isLive ? (
                    <button className="w-full px-6 py-4 bg-hot hover:bg-heat transition-colors uppercase tracking-wider neon-border flex items-center justify-center gap-2 hover-glow">
                      <ShoppingBag size={20} />
                      Buy Now
                    </button>
                  ) : isSoldOut ? (
                    <button
                      disabled
                      className="w-full px-6 py-4 bg-gray-800 text-gray-500 cursor-not-allowed uppercase tracking-wider"
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full px-6 py-4 bg-gray-900 border border-hot/30 text-gray-400 cursor-not-allowed uppercase tracking-wider"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Past Drops */}
        <div className="mt-12 p-8 bg-black/50 border border-gray-800">
          <h3 className="mb-4 text-gray-400 uppercase tracking-wider">Recent Drops</h3>
          <p className="text-gray-600">
            The city moves fast. Check back for the next drop.
          </p>
        </div>
      </div>
    </div>
  );
}