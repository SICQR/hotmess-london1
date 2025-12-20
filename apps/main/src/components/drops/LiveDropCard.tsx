// HOTMESS LONDON - Live Drop Card
// Card showing a live drop with countdown and stock

import { useState, useEffect } from 'react';
import { Clock, Zap, MapPin, Users } from 'lucide-react';
import { Drop } from '../../types/drops';
import { HotmessButton } from '../hotmess/Button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LiveDropCardProps {
  drop: Drop;
  onView: () => void;
}

export function LiveDropCard({ drop, onView }: LiveDropCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!drop.ends_at) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(drop.ends_at!).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('ENDED');
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [drop.ends_at]);

  const stockLeft = drop.quantity - drop.quantity_sold;
  const stockPercentage = (stockLeft / drop.quantity) * 100;

  const getTypeIcon = () => {
    switch (drop.type) {
      case 'timed':
        return <Clock className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'instant':
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (drop.type) {
      case 'timed':
        return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'location':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'instant':
        return 'text-hot border-hot/30 bg-hot/10';
      default:
        return 'text-white/60 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="group relative bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden hover:border-hot/30 transition-all">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        <ImageWithFallback
          src={drop.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'}
          alt={drop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Type Badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-sm ${getTypeColor()}`}>
          {getTypeIcon()}
          <span className="text-xs uppercase tracking-wider">{drop.type}</span>
        </div>

        {/* Stock Warning */}
        {stockLeft < 10 && stockLeft > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-hot/90 backdrop-blur-sm rounded-lg">
            <span className="text-xs text-white">Only {stockLeft} left!</span>
          </div>
        )}

        {/* Sold Out */}
        {stockLeft === 0 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-2xl text-white">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Seller */}
        <div>
          <h3 className="text-white mb-1 line-clamp-1">{drop.title}</h3>
          <p className="text-sm text-white/60">by {drop.seller_username}</p>
        </div>

        {/* Price & XP */}
        <div className="flex items-center justify-between">
          <div className="text-2xl text-white">£{drop.price}</div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg border border-white/10">
            <Zap size={12} className="text-yellow-400" />
            <span className="text-xs text-white">+{drop.xp_reward} XP</span>
          </div>
        </div>

        {/* Stock Bar */}
        {stockLeft > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs text-white/60 mb-1">
              <span>{stockLeft} available</span>
              <span>{drop.quantity_sold} sold</span>
            </div>
            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  stockPercentage > 50
                    ? 'bg-green-400'
                    : stockPercentage > 25
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Countdown */}
        {drop.ends_at && timeLeft && timeLeft !== 'ENDED' && (
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Clock size={14} />
            <span>Ends in {timeLeft}</span>
          </div>
        )}

        {/* Location */}
        {drop.location && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <MapPin size={14} />
            <span>{drop.location.venue || drop.location.city}</span>
          </div>
        )}

        {/* CTA */}
        <HotmessButton
          fullWidth
          onClick={onView}
          disabled={stockLeft === 0}
        >
          {stockLeft === 0 ? 'Sold Out' : 'View Drop'}
        </HotmessButton>
      </div>
    </div>
  );
}
