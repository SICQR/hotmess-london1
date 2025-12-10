// HOTMESS LONDON - Membership Tier Card
// Displays membership tier with benefits and CTA

import { Check, Zap, Crown, Lock } from 'lucide-react';
import { MembershipTier, MEMBERSHIP_TIERS } from '../../types/membership';
import { HotmessButton } from '../hotmess/Button';

interface TierCardProps {
  tier: MembershipTier;
  currentTier?: MembershipTier;
  currentLevel: number;
  billingCycle: 'monthly' | 'yearly';
  onSelect: (tier: MembershipTier, billingCycle: 'monthly' | 'yearly') => void;
  featured?: boolean;
}

export function TierCard({
  tier,
  currentTier = 'free',
  currentLevel,
  billingCycle,
  onSelect,
  featured = false,
}: TierCardProps) {
  const config = MEMBERSHIP_TIERS[tier];
  const price = billingCycle === 'monthly' ? config.price_monthly : config.price_yearly;
  const pricePerMonth = billingCycle === 'yearly' ? price / 12 : price;

  const isCurrentTier = currentTier === tier;
  const canUpgrade = currentLevel >= config.level_required;
  const isLocked = !canUpgrade && tier !== 'free';

  const tierOrder = ['free', 'pro', 'elite'];
  const isDowngrade = tierOrder.indexOf(tier) < tierOrder.indexOf(currentTier);

  const getTierIcon = () => {
    if (tier === 'free') return null;
    if (tier === 'pro') return <Zap className="w-5 h-5" />;
    if (tier === 'elite') return <Crown className="w-5 h-5" />;
    return null;
  };

  const topBenefits = [
    tier === 'free' && { text: '3 city rooms', included: true },
    tier === 'free' && { text: 'Marketplace browsing', included: true },
    tier === 'free' && { text: 'Basic XP earning', included: true },
    tier === 'free' && { text: 'Radio listening', included: true },
    
    tier === 'pro' && { text: 'All rooms in your city', included: true },
    tier === 'pro' && { text: 'Drop scheduling', included: true },
    tier === 'pro' && { text: '10% XP boost', included: true },
    tier === 'pro' && { text: '10% merch discount', included: true },
    tier === 'pro' && { text: 'Early event access', included: true },
    
    tier === 'elite' && { text: 'Global room access', included: true },
    tier === 'elite' && { text: 'First access to all drops', included: true },
    tier === 'elite' && { text: '20% XP boost', included: true },
    tier === 'elite' && { text: 'VIP club line access', included: true },
    tier === 'elite' && { text: 'Free event monthly', included: true },
  ].filter(Boolean);

  return (
    <div
      className={`relative rounded-2xl border-2 p-6 transition-all ${
        featured
          ? 'border-hot scale-105 bg-gradient-to-b from-hot/10 to-transparent'
          : isCurrentTier
          ? 'border-green-500/50 bg-green-950/20'
          : 'border-white/10 bg-neutral-900 hover:border-white/20'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-hot rounded-full text-xs text-white uppercase tracking-wider">
          Most Popular
        </div>
      )}

      {/* Current Tier Badge */}
      {isCurrentTier && (
        <div className="absolute -top-3 right-6 px-3 py-1 bg-green-500 rounded-full text-xs text-white uppercase tracking-wider">
          Current Plan
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full ${
            tier === 'free'
              ? 'bg-zinc-800'
              : tier === 'pro'
              ? 'bg-blue-500/20'
              : 'bg-yellow-500/20'
          }`}
        >
          <span className="text-2xl">{config.badge_icon}</span>
        </div>
        <div>
          <h3 className="text-xl text-white">{config.name}</h3>
          {tier !== 'free' && (
            <p className="text-xs text-white/60">
              Level {config.level_required}+ required
            </p>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        {tier === 'free' ? (
          <div className="text-3xl text-white">Free</div>
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl text-white">£{pricePerMonth.toFixed(0)}</span>
              <span className="text-white/60">/month</span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-xs text-green-400 mt-1">
                Save £{(config.price_monthly * 12 - config.price_yearly).toFixed(0)}/year
              </p>
            )}
          </div>
        )}
      </div>

      {/* Benefits */}
      <ul className="space-y-3 mb-6">
        {topBenefits.slice(0, 5).map((benefit: any, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-white/80">{benefit.text}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isLocked ? (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
          <Lock className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/60">
            Level {config.level_required} required
          </span>
        </div>
      ) : isCurrentTier ? (
        <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-center">
          <span className="text-sm text-green-400">Your current plan</span>
        </div>
      ) : isDowngrade ? (
        <HotmessButton
          variant="outline"
          fullWidth
          onClick={() => onSelect(tier, billingCycle)}
        >
          Downgrade to {config.name}
        </HotmessButton>
      ) : (
        <HotmessButton
          variant={featured ? 'primary' : 'outline'}
          fullWidth
          onClick={() => onSelect(tier, billingCycle)}
        >
          {tier === 'free' ? 'Current Plan' : `Upgrade to ${config.name}`}
        </HotmessButton>
      )}
    </div>
  );
}
