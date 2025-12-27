/**
 * HOTMESS LONDON — BUTTON COMPONENT
 * 
 * Figma: HM/Button
 * Variants: Style, State, Size, Icon
 */

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { motion } from 'motion/react';
import { colors, radius, animation } from './tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
  > {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' | 'link';
  
  /** Size variant */
  size?: 'large' | 'medium' | 'small';
  
  /** Icon position */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  
  /** Full width */
  fullWidth?: boolean;
  
  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// STYLES
// ============================================================================

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: colors.red,
        color: colors.white,
        border: 'none',
        hover: {
          backgroundColor: '#CC0031', // darker red
          boxShadow: `0 0 20px ${colors.red}40`,
        },
        active: {
          backgroundColor: '#990024',
        },
      };

    case 'secondary':
      return {
        backgroundColor: colors.grey[300],
        color: colors.white,
        border: 'none',
        hover: {
          backgroundColor: colors.grey[400],
        },
        active: {
          backgroundColor: colors.grey[500],
        },
      };

    case 'tertiary':
      return {
        backgroundColor: 'transparent',
        color: colors.white,
        border: `1px solid ${colors.grey[400]}`,
        hover: {
          borderColor: colors.white,
          backgroundColor: `${colors.white}10`,
        },
        active: {
          backgroundColor: `${colors.white}20`,
        },
      };

    case 'danger':
      return {
        backgroundColor: colors.orange,
        color: colors.white,
        border: 'none',
        hover: {
          backgroundColor: '#E65F00',
          boxShadow: `0 0 20px ${colors.orange}40`,
        },
        active: {
          backgroundColor: '#CC5400',
        },
      };

    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: colors.white,
        border: 'none',
        hover: {
          backgroundColor: `${colors.white}10`,
        },
        active: {
          backgroundColor: `${colors.white}20`,
        },
      };

    case 'link':
      return {
        backgroundColor: 'transparent',
        color: colors.red,
        border: 'none',
        hover: {
          color: colors.pink,
          textDecoration: 'underline',
        },
        active: {
          color: '#CC0031',
        },
      };

    default:
      return getVariantStyles('primary');
  }
};

const getSizeStyles = (size: ButtonProps['size']) => {
  switch (size) {
    case 'large':
      return {
        height: '56px',
        padding: '0 32px',
        fontSize: '18px',
        fontWeight: 700,
      };

    case 'medium':
      return {
        height: '48px',
        padding: '0 24px',
        fontSize: '16px',
        fontWeight: 600,
      };

    case 'small':
      return {
        height: '40px',
        padding: '0 16px',
        fontSize: '14px',
        fontWeight: 600,
      };

    default:
      return getSizeStyles('medium');
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      iconLeft,
      iconRight,
      fullWidth,
      loading,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const variantStyles = getVariantStyles(variant);
    const sizeStyles = getSizeStyles(size);

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? 'hover' : undefined}
        whileTap={!disabled && !loading ? 'active' : undefined}
        className={className}
        style={{
          // Base styles
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          borderRadius: radius.button,
          fontFamily: 'inherit',
          fontWeight: sizeStyles.fontWeight,
          fontSize: sizeStyles.fontSize,
          lineHeight: 1,
          textDecoration: 'none',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          transition: `all ${animation.base} ${animation.ease}`,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          width: fullWidth ? '100%' : 'auto',
          
          // Size styles
          height: sizeStyles.height,
          padding: sizeStyles.padding,

          // Variant styles
          backgroundColor: variantStyles.backgroundColor,
          color: variantStyles.color,
          border: variantStyles.border || 'none',

          // Disabled styles
          opacity: disabled || loading ? 0.5 : 1,
        }}
        {...(props as any)}
      >
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '16px',
              height: '16px',
              border: `2px solid ${colors.white}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
            }}
          />
        )}

        {!loading && iconLeft && <span style={{ display: 'flex' }}>{iconLeft}</span>}

        {children}

        {!loading && iconRight && <span style={{ display: 'flex' }}>{iconRight}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// EXPORT
// ============================================================================

export default Button;
