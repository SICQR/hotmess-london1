// HOTMESS LONDON - Upgrade Prompt
// Modal prompting users to upgrade when accessing locked features

import { X, Lock, Zap, Crown } from 'lucide-react';
import { MembershipTier } from '../../types/membership';
import { HotmessButton } from '../hotmess/Button';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTier: MembershipTier;
  feature: string;
  onUpgrade: () => void;
}

export function UpgradePrompt({
  isOpen,
  onClose,
  requiredTier,
  feature,
  onUpgrade,
}: UpgradePromptProps) {
  if (!isOpen) return null;

  const tierConfig = {
    pro: {
      icon: <Zap className="w-12 h-12 text-blue-400" />,
      color: 'blue',
      price: '£15',
    },
    elite: {
      icon: <Crown className="w-12 h-12 text-yellow-400" />,
      color: 'yellow',
      price: '£35',
    },
  };

  const config = tierConfig[requiredTier as 'pro' | 'elite'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl border border-white/10 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-white/5 rounded-full border border-white/10">
            <Lock className="w-8 h-8 text-white/60" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl text-white mb-2">Unlock {feature}</h2>
          <p className="text-white/60">
            This feature requires a {requiredTier.toUpperCase()} membership
          </p>
        </div>

        {/* Tier Info */}
        <div className="p-4 bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {config.icon}
              <div>
                <div className="text-white capitalize">{requiredTier}</div>
                <div className="text-sm text-white/60">Membership</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl text-white">{config.price}</div>
              <div className="text-xs text-white/60">/month</div>
            </div>
          </div>

          {/* Quick Benefits */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            {requiredTier === 'pro' && (
              <>
                <div className="text-sm text-white/80">✓ All rooms in your city</div>
                <div className="text-sm text-white/80">✓ Early drop access</div>
                <div className="text-sm text-white/80">✓ 10% XP boost</div>
              </>
            )}
            {requiredTier === 'elite' && (
              <>
                <div className="text-sm text-white/80">✓ Global room access</div>
                <div className="text-sm text-white/80">✓ First access to drops</div>
                <div className="text-sm text-white/80">✓ VIP club line</div>
              </>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <HotmessButton variant="outline" fullWidth onClick={onClose}>
            Maybe Later
          </HotmessButton>
          <HotmessButton fullWidth onClick={onUpgrade}>
            Upgrade Now
          </HotmessButton>
        </div>
      </div>
    </div>
  );
}
