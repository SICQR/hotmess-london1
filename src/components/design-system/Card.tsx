/**
 * HOTMESS LONDON — CARD COMPONENT
 * 
 * Figma: HM/Card
 * Variants: Style, Media
 */

import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { motion } from 'motion/react';
import { colors, radius, shadows } from './tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: 'default' | 'elevated' | 'frosted' | 'neonBorder' | 'product' | 'ticket' | 'beacon' | 'seller';
  
  /** Media (image/video) at top */
  media?: ReactNode;
  
  /** Clickable card */
  onClick?: () => void;
  
  /** Hover effect */
  hoverable?: boolean;
}

// ============================================================================
// STYLES
// ============================================================================

const getVariantStyles = (variant: CardProps['variant']) => {
  switch (variant) {
    case 'default':
      return {
        backgroundColor: colors.grey[200],
        border: `1px solid ${colors.grey[400]}`,
        boxShadow: shadows.none,
      };

    case 'elevated':
      return {
        backgroundColor: colors.grey[200],
        border: 'none',
        boxShadow: shadows.surface2,
      };

    case 'frosted':
      return {
        backgroundColor: `${colors.grey[300]}CC`, // 80% opacity
        border: `1px solid ${colors.grey[400]}`,
        backdropFilter: 'blur(20px)',
        boxShadow: shadows.surface1,
      };

    case 'neonBorder':
      return {
        backgroundColor: colors.grey[200],
        border: `2px solid ${colors.hot}`,
        boxShadow: `0 0 20px ${colors.hot}40, inset 0 0 20px ${colors.hot}10`,
      };

    case 'product':
      return {
        backgroundColor: colors.grey[200],
        border: `1px solid ${colors.grey[400]}`,
        boxShadow: shadows.none,
        // Special product card styling
      };

    case 'ticket':
      return {
        backgroundColor: colors.grey[200],
        border: `2px solid ${colors.warning}40`,
        boxShadow: shadows.none,
      };

    case 'beacon':
      return {
        backgroundColor: colors.grey[200],
        border: `2px solid ${colors.hot}40`,
        boxShadow: `0 0 16px ${colors.hot}20`,
      };

    case 'seller':
      return {
        backgroundColor: colors.grey[200],
        border: `1px solid ${colors.info}40`,
        boxShadow: shadows.none,
      };

    default:
      return getVariantStyles('default');
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      media,
      onClick,
      hoverable = Boolean(onClick),
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const variantStyles = getVariantStyles(variant);
    const isClickable = Boolean(onClick);

    const Component = isClickable ? motion.div : 'div';

    // Build motion props only for motion.div
    const motionProps = isClickable ? {
      whileHover: hoverable ? { scale: 1.02, transition: { duration: 0.2 } } : undefined,
      whileTap: { scale: 0.98 },
    } : {};

    const baseStyle = {
      // Base styles
      borderRadius: radius.card,
      overflow: 'hidden',
      cursor: isClickable ? 'pointer' : 'default',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      
      // Variant styles
      ...variantStyles,
      
      // User styles
      ...style,
    };

    return (
      <Component
        ref={ref}
        onClick={onClick}
        className={className}
        style={baseStyle}
        {...motionProps}
        {...props}
      >
        {/* Media */}
        {media && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: colors.grey[300],
              overflow: 'hidden',
            }}
          >
            {media}
          </div>
        )}

        {/* Content */}
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

// ============================================================================
// CARD HEADER
// ============================================================================

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: ReactNode;
  
  /** Subtitle */
  subtitle?: ReactNode;
  
  /** Action element (e.g., button) */
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '24px',
          ...style,
        }}
        {...props}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
                color: colors.white,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: title ? '4px 0 0 0' : 0,
                fontSize: '14px',
                color: colors.grey[500],
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ============================================================================
// CARD CONTENT
// ============================================================================

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** No padding */
  noPadding?: boolean;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ noPadding, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          padding: noPadding ? 0 : '24px',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// ============================================================================
// CARD FOOTER
// ============================================================================

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '24px',
          borderTop: `1px solid ${colors.grey[400]}`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// ============================================================================
// EXPORT
// ============================================================================

export default Card;
