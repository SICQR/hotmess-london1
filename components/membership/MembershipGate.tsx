// HOTMESS LONDON - Membership Gate
// Wrapper component to gate content by membership tier

import { ReactNode, useState } from 'react';
import { Lock } from 'lucide-react';
import { MembershipTier } from '../../types/membership';
import { UpgradePrompt } from './UpgradePrompt';
import { useAuth } from '../../contexts/AuthContext';
import { useMembership } from '../../hooks/useMembership';

interface MembershipGateProps {
  requiredTier: MembershipTier;
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  onUpgrade?: () => void;
}

export function MembershipGate({
  requiredTier,
  feature,
  children,
  fallback,
  onUpgrade,
}: MembershipGateProps) {
  const { user, session } = useAuth();
  const { membership } = useMembership(session?.access_token);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // If user not logged in, show login prompt
  if (!user) {
    return (
      <div className="p-8 bg-neutral-900 border border-white/10 rounded-xl text-center">
        <Lock className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">Sign in required</h3>
        <p className="text-white/60">Please sign in to access this feature</p>
      </div>
    );
  }

  // Check if user has required tier
  const tierOrder = ['free', 'pro', 'elite'];
  const userTier = membership?.tier || 'free';
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);

  const hasAccess = userTierIndex >= requiredTierIndex;

  // If has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If no access, show fallback or default lock UI
  const defaultFallback = (
    <div 
      className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl text-center cursor-pointer hover:border-hot/30 transition-all"
      onClick={() => setShowUpgradePrompt(true)}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full border border-white/10 mb-4">
        <Lock className="w-8 h-8 text-white/60" />
      </div>
      <h3 className="text-xl text-white mb-2">
        {requiredTier.toUpperCase()} Feature
      </h3>
      <p className="text-white/60 mb-4">
        Upgrade to {requiredTier} to unlock {feature}
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-hot/20 border border-hot/30 rounded-lg text-hot text-sm">
        <Lock size={14} />
        <span>Tap to Upgrade</span>
      </div>
    </div>
  );

  return (
    <>
      {fallback || defaultFallback}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        requiredTier={requiredTier}
        feature={feature}
        onUpgrade={() => {
          setShowUpgradePrompt(false);
          if (onUpgrade) {
            onUpgrade();
          } else {
            // Default: navigate to pricing page
            window.location.href = '/?route=pricing';
          }
        }}
      />
    </>
  );
}
