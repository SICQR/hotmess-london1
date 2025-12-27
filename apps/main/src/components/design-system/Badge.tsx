/**
 * HOTMESS LONDON — BADGE COMPONENT
 * 
 * Figma: HM/Badge
 * Variants: XP, City, Verified, Host, Niche, Sponsor, ProductType
 */

import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { colors, radius } from './tokens';
import { Zap, MapPin, CheckCircle2, Crown, Tag, Megaphone } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Badge variant */
  variant?:
    | 'xp'
    | 'city'
    | 'verified'
    | 'host'
    | 'niche'
    | 'sponsor'
    | 'productType'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'default'
    | 'gray'
    | 'green'
    | 'blue'
    | 'custom';
  
  /** Custom color (hex) */
  color?: string;
  
  /** Icon */
  icon?: ReactNode;
  
  /** Size */
  size?: 'small' | 'medium' | 'large';
}

// ============================================================================
// VARIANT CONFIGS
// ============================================================================

const getVariantConfig = (variant: BadgeProps['variant']) => {
  switch (variant) {
    case 'default':
    case 'gray':
    case 'secondary':
      return {
        color: colors.white,
        backgroundColor: colors.grey[400],
        icon: null,
      };

    case 'success':
    case 'green':
      return {
        color: colors.green,
        backgroundColor: `${colors.green}20`,
        icon: null,
      };

    case 'primary':
      return {
        color: colors.red,
        backgroundColor: `${colors.red}20`,
        icon: null,
      };

    case 'danger':
      return {
        color: colors.orange,
        backgroundColor: `${colors.orange}20`,
        icon: null,
      };

    case 'xp':
      return {
        color: colors.gold,
        backgroundColor: `${colors.gold}20`,
        icon: <Zap size={14} fill="currentColor" />,
      };

    case 'city':
    case 'blue':
      return {
        color: colors.blue,
        backgroundColor: `${colors.blue}20`,
        icon: <MapPin size={14} />,
      };

    case 'verified':
      return {
        color: colors.green,
        backgroundColor: `${colors.green}20`,
        icon: <CheckCircle2 size={14} fill="currentColor" />,
      };

    case 'host':
      return {
        color: colors.purple,
        backgroundColor: `${colors.purple}20`,
        icon: <Crown size={14} />,
      };

    case 'niche':
      return {
        color: colors.pink,
        backgroundColor: `${colors.pink}20`,
        icon: <Tag size={14} />,
      };

    case 'sponsor':
      return {
        color: colors.yellow,
        backgroundColor: `${colors.yellow}20`,
        icon: <Megaphone size={14} />,
      };

    case 'productType':
      return {
        color: colors.orange,
        backgroundColor: `${colors.orange}20`,
        icon: null,
      };

    default:
      return {
        color: colors.white,
        backgroundColor: colors.grey[400],
        icon: null,
      };
  }
};

const getSizeStyles = (size: BadgeProps['size']) => {
  switch (size) {
    case 'small':
      return {
        height: '20px',
        padding: '0 8px',
        fontSize: '11px',
        gap: '4px',
      };

    case 'medium':
      return {
        height: '24px',
        padding: '0 10px',
        fontSize: '12px',
        gap: '6px',
      };

    case 'large':
      return {
        height: '32px',
        padding: '0 12px',
        fontSize: '14px',
        gap: '6px',
      };

    default:
      return getSizeStyles('medium');
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant = 'custom',
      color,
      icon,
      size = 'medium',
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const variantConfig = getVariantConfig(variant);
    const sizeStyles = getSizeStyles(size);

    // Use custom color if provided, otherwise use variant color
    const badgeColor = color || variantConfig.color;
    const badgeBg = color ? `${color}20` : variantConfig.backgroundColor;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: sizeStyles.height,
          padding: sizeStyles.padding,
          gap: sizeStyles.gap,
          fontSize: sizeStyles.fontSize,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: badgeColor,
          backgroundColor: badgeBg,
          borderRadius: radius.full,
          whiteSpace: 'nowrap',
          ...style,
        }}
        {...props}
      >
        {(icon || variantConfig.icon) && (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {icon || variantConfig.icon}
          </span>
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

// ============================================================================
// SPECIALIZED BADGES
// ============================================================================

export interface XPBadgeProps extends Omit<BadgeProps, 'variant'> {
  /** XP amount */
  xp: number;
}

export const XPBadge = forwardRef<HTMLDivElement, XPBadgeProps>(
  ({ xp, ...props }, ref) => {
    return (
      <Badge ref={ref} variant="xp" {...props}>
        +{xp} XP
      </Badge>
    );
  }
);

XPBadge.displayName = 'XPBadge';

// ============================================================================

export interface CityBadgeProps extends Omit<BadgeProps, 'variant'> {
  /** City name */
  city: string;
}

export const CityBadge = forwardRef<HTMLDivElement, CityBadgeProps>(
  ({ city, ...props }, ref) => {
    return (
      <Badge ref={ref} variant="city" {...props}>
        {city}
      </Badge>
    );
  }
);

CityBadge.displayName = 'CityBadge';

// ============================================================================

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  /** Status */
  status: 'live' | 'upcoming' | 'ended' | 'sold-out' | 'active' | 'paused' | 'expired';
}

export const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, children, ...props }, ref) => {
    const getStatusColor = () => {
      switch (status) {
        case 'live':
          return colors.red;
        case 'upcoming':
          return colors.green;
        case 'ended':
          return colors.grey[500];
        case 'sold-out':
          return colors.orange;
        case 'active':
          return colors.green;
        case 'paused':
          return colors.yellow;
        case 'expired':
          return colors.grey[500];
        default:
          return colors.grey[500];
      }
    };

    return (
      <Badge ref={ref} color={getStatusColor()} {...props}>
        {status === 'live' && '🔴 '}
        {children || status.toUpperCase()}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// ============================================================================
// EXPORT
// ============================================================================

export default Badge;
