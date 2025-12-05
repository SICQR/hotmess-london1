// HOTMESS LONDON - Benefits Gate Component
// Gates features by membership tier with upgrade CTA

import { Lock, Crown, Zap } from 'lucide-react';
import { HotmessButton } from '../hotmess/Button';
import { MembershipTier } from '../../types/membership';
import { getTierInfo } from '../../hooks/useMembership';

interface BenefitsGateProps {
  userTier: MembershipTier;
  requiredTier: MembershipTier;
  feature: string;
  children?: React.ReactNode;
  onUpgrade: () => void;
  fallback?: React.ReactNode;
}

export function BenefitsGate({
  userTier,
  requiredTier,
  feature,
  children,
  onUpgrade,
  fallback,
}: BenefitsGateProps) {
  const tierOrder = ['free', 'pro', 'elite'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);

  const hasAccess = userTierIndex >= requiredTierIndex;

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback or upgrade gate
  if (fallback) {
    return <>{fallback}</>;
  }

  const tierInfo = getTierInfo(requiredTier);

  return (
    <div className="relative">
      {/* Blurred/locked content */}
      {children && (
        <div className="pointer-events-none select-none blur-sm opacity-50">
          {children}
        </div>
      )}

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="text-center max-w-md">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${tierInfo.bgColor} ${tierInfo.borderColor} border-2 mb-4`}>
            {requiredTier === 'pro' ? (
              <Zap className={`w-8 h-8 ${tierInfo.color}`} />
            ) : (
              <Crown className={`w-8 h-8 ${tierInfo.color}`} />
            )}
          </div>

          <h3 className="text-xl text-white mb-2">
            {tierInfo.name} Feature
          </h3>
          <p className="text-white/70 mb-6">
            Upgrade to {tierInfo.name} to unlock {feature}
          </p>

          <HotmessButton onClick={onUpgrade}>
            Upgrade to {tierInfo.name}
          </HotmessButton>
        </div>
      </div>
    </div>
  );
}

// Simple inline gate for buttons/actions
interface InlineGateProps {
  userTier: MembershipTier;
  requiredTier: MembershipTier;
  children: React.ReactNode;
  onUpgrade: () => void;
}

export function InlineGate({
  userTier,
  requiredTier,
  children,
  onUpgrade,
}: InlineGateProps) {
  const tierOrder = ['free', 'pro', 'elite'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);

  const hasAccess = userTierIndex >= requiredTierIndex;

  if (hasAccess) {
    return <>{children}</>;
  }

  const tierInfo = getTierInfo(requiredTier);

  return (
    <button
      onClick={onUpgrade}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${tierInfo.bgColor} ${tierInfo.borderColor} border ${tierInfo.color} hover:bg-opacity-80 transition-all`}
    >
      <Lock size={16} />
      <span>{tierInfo.name} Feature</span>
    </button>
  );
}

// Badge to show tier-exclusive features
interface TierBadgeProps {
  tier: MembershipTier;
  size?: 'sm' | 'md' | 'lg';
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  if (tier === 'free') return null;

  const tierInfo = getTierInfo(tier);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${tierInfo.bgColor} ${tierInfo.borderColor} border ${tierInfo.color} ${sizeClasses[size]}`}
    >
      <span>{tierInfo.icon}</span>
      <span className="uppercase tracking-wider">{tierInfo.name}</span>
    </span>
  );
}
