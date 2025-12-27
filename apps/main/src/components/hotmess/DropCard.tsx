// Drop Card Component - Editorial Brutal Luxury

import { Clock, Zap } from 'lucide-react';

interface DropCardProps {
  drop: {
    id: string;
    name: string;
    price: number;
    seller: string;
    image: string;
    xp: number;
    stock: number;
    endsAt?: string;
  };
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function DropCard({ drop, onNavigate }: DropCardProps) {
  return (
    <div 
      className="group border border-brutal hover:border-brutal-strong transition-all hover-lift cursor-pointer"
      onClick={() => onNavigate('messmarketProduct', { productId: drop.id })}
    >
      <div className="aspect-square bg-mono-900 overflow-hidden">
        <img
          src={drop.image}
          alt={drop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-sm text-white uppercase tracking-tight mb-1">{drop.name}</h4>
          <p className="text-xs text-white/40">{drop.seller}</p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-white/50">
            <Clock size={12} strokeWidth={1.5} />
            <span>{drop.endsAt ?? ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-hotmess-red" strokeWidth={1.5} />
            <span className="text-white/70">+{drop.xp}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brutal">
          <span className="text-base text-white">£{drop.price}</span>
          <span className="text-xs text-white/40">{drop.stock} left</span>
        </div>
      </div>
    </div>
  );
}