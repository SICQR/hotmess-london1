/**
 * hm/Card — HOTMESS Card Components
 * Variants: Product, Beacon, Reward, Vendor, RadioShow
 */

import { ReactNode } from 'react';
import { MapPin, Zap, ShoppingBag, Radio, Star } from 'lucide-react';
import { HMButton } from './HMButton';

// Base Card
interface HMCardBaseProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function HMCardBase({ children, className = '', hover = true }: HMCardBaseProps) {
  return (
    <div className={`bg-black/50 border border-hot/30 transition-all duration-300 ${
      hover ? 'hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] hover:-translate-y-1' : ''
    } ${className}`}>
      {children}
    </div>
  );
}

// Product Card
interface ProductCardProps {
  image: string;
  name: string;
  collection: 'RAW' | 'HUNG' | 'HIGH';
  price: number;
  xp: number;
  inStock: boolean;
  bestseller?: boolean;
  onAddToCart?: () => void;
}

export function HMProductCard({
  image,
  name,
  collection,
  price,
  xp,
  inStock,
  bestseller,
  onAddToCart,
}: ProductCardProps) {
  return (
    <HMCardBase>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-900">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        
        {bestseller && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-hot border border-hot text-xs uppercase tracking-wider beacon-flare">
            Bestseller
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-black/90 border border-hot/50">
          <Zap size={14} className="text-hot" />
          <span className="text-xs text-hot">+{xp} XP</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-2 px-2 py-1 bg-hot/20 text-hot text-xs uppercase tracking-wider inline-block border border-hot/50">
          {collection}
        </div>
        
        <h4 className="mb-3 text-white text-lg">{name}</h4>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl text-hot">£{price}</span>
          <HMButton
            variant="primary"
            size="sm"
            disabled={!inStock}
            onClick={onAddToCart}
          >
            {inStock ? 'Add to Cart' : 'Sold Out'}
          </HMButton>
        </div>
      </div>
    </HMCardBase>
  );
}

// Beacon Card
interface BeaconCardProps {
  name: string;
  location: string;
  heat: 'high' | 'medium' | 'low';
  scans: number;
  active: boolean;
  xpReward: number;
}

export function HMBeaconCard({ name, location, heat, scans, active, xpReward }: BeaconCardProps) {
  const heatColors = {
    high: 'border-hot text-hot bg-red-950/30',
    medium: 'border-heat text-heat bg-orange-950/30',
    low: 'border-gray-600 text-gray-500 bg-gray-950/30',
  };

  return (
    <HMCardBase className={`${heatColors[heat]} ${!active ? 'opacity-50' : ''}`}>
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <MapPin size={24} className={active ? 'text-hot' : 'text-gray-500'} />
          <div className="flex-1">
            <h4 className="text-white mb-1">{name}</h4>
            <p className="text-sm text-gray-400">{location}</p>
          </div>
          {active && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-hot rounded-full beacon-flare" />
              <span className="text-hot uppercase text-xs tracking-wider">Live</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="text-gray-400" style={{ fontSize: '14px' }}>
            <span className="text-white" style={{ fontWeight: 700 }}>{scans}</span> scans today
          </div>
          <div className="flex items-center gap-1 text-hot">
            <Zap size={16} />
            <span style={{ fontWeight: 700 }}>+{xpReward} XP</span>
          </div>
        </div>
      </div>
    </HMCardBase>
  );
}

// Reward Card
interface RewardCardProps {
  name: string;
  description: string;
  cost: number;
  locked: boolean;
  canAfford: boolean;
  onRedeem?: () => void;
}

export function HMRewardCard({ name, description, cost, locked, canAfford, onRedeem }: RewardCardProps) {
  return (
    <HMCardBase className={locked ? 'opacity-50' : canAfford ? 'border-hot' : ''}>
      <div className="p-6">
        <h4 className="text-white mb-2">{name}</h4>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <Zap className={canAfford && !locked ? 'text-hot' : 'text-gray-600'} size={20} />
          <span className={`text-2xl ${canAfford && !locked ? 'text-hot' : 'text-gray-600'}`}>
            {cost.toLocaleString()} XP
          </span>
        </div>

        <HMButton
          variant={canAfford && !locked ? 'primary' : 'tertiary'}
          size="sm"
          disabled={locked || !canAfford}
          onClick={onRedeem}
          className="w-full"
        >
          {locked ? 'Locked' : canAfford ? 'Redeem' : 'Not Enough XP'}
        </HMButton>
      </div>
    </HMCardBase>
  );
}

// Vendor Card
interface VendorCardProps {
  name: string;
  logo?: string;
  category: string;
  rating: number;
  products: number;
  onClick?: () => void;
}

export function HMVendorCard({ name, logo, category, rating, products, onClick }: VendorCardProps) {
  return (
    <HMCardBase hover={true}>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {logo ? (
            <img src={logo} alt={name} className="w-16 h-16 rounded-full border-2 border-hot" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-hot to-heat flex items-center justify-center border-2 border-hot">
              <ShoppingBag size={24} className="text-white" />
            </div>
          )}
          
          <div className="flex-1">
            <h4 className="text-white mb-1">{name}</h4>
            <p className="text-sm text-gray-400 mb-2">{category}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Star size={12} className="text-neon-lime fill-neon-lime" />
                {rating.toFixed(1)}
              </span>
              <span>{products} products</span>
            </div>
          </div>
        </div>

        <HMButton variant="secondary" size="sm" className="w-full" onClick={onClick}>
          View Shop
        </HMButton>
      </div>
    </HMCardBase>
  );
}

// Radio Show Card
interface RadioShowCardProps {
  name: string;
  host: string;
  time: string;
  live: boolean;
  description: string;
}

export function HMRadioShowCard({ name, host, time, live, description }: RadioShowCardProps) {
  return (
    <HMCardBase className={live ? 'border-hot bg-red-950/30 beacon-flare' : ''}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Radio size={24} className={live ? 'text-hot' : 'text-gray-500'} />
            <div>
              <h4 className="text-white mb-1">{name}</h4>
              <p className="text-sm text-gray-400">{host}</p>
            </div>
          </div>
          
          {live && (
            <div className="px-3 py-1 bg-hot text-xs uppercase tracking-wider beacon-flare">
              Live
            </div>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-3">{description}</p>
        
        <div className="text-xs text-gray-500">{time}</div>
      </div>
    </HMCardBase>
  );
}