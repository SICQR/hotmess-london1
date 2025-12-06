// HOTMESS LONDON - Membership Badge
// Small badge showing user's tier

import { MembershipTier } from '../../types/membership';
import { getTierInfo } from '../../hooks/useMembership';

interface MembershipBadgeProps {
  tier: MembershipTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function MembershipBadge({ 
  tier, 
  size = 'md', 
  showLabel = true,
  className = '' 
}: MembershipBadgeProps) {
  const tierInfo = getTierInfo(tier);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full
        ${tierInfo.bgColor} ${tierInfo.borderColor} border
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}>
        {tierInfo.icon}
      </span>
      {showLabel && (
        <span className={tierInfo.color}>
          {tierInfo.name}
        </span>
      )}
    </div>
  );
}
