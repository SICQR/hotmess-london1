/**
 * HOTMESS LONDON — DESIGN SYSTEM
 * 
 * Production-ready React component library
 * Matching Figma specifications exactly
 * 
 * Import like: import { Button, Input, Card } from './components/design-system';
 */

// ============================================================================
// TOKENS
// ============================================================================

export * from './tokens';

// ============================================================================
// COMPONENTS
// ============================================================================

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input, Textarea } from './Input';
export type { InputProps, TextareaProps } from './Input';

export { Card, CardHeader, CardContent, CardFooter } from './Card';
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from './Card';

export { Badge, XPBadge, CityBadge, StatusBadge } from './Badge';
export type { BadgeProps, XPBadgeProps, CityBadgeProps, StatusBadgeProps } from './Badge';

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Apply responsive styles based on breakpoint
 */
export const useBreakpoint = () => {
  // Simple media query hook
  // In production, use a proper hook or library
  return 'desktop'; // Placeholder
};

/**
 * Generate color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
