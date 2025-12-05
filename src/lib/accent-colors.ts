/**
 * ACCENT COLOR UTILITIES
 * Convert beacon accent tokens to CSS variable references
 */

import { AccentToken } from './beaconTypes';

export function getAccentColor(accent: AccentToken): string {
  const mapping: Record<AccentToken, string> = {
    ACCENT_NEUTRAL: 'var(--accent-neutral)',
    ACCENT_CARE: 'var(--accent-care)',
    ACCENT_CONNECT: 'var(--accent-connect)',
    ACCENT_TICKET: 'var(--accent-ticket)',
    ACCENT_DROP: 'var(--accent-drop)',
    ACCENT_CONTENT: 'var(--accent-content)',
    ACCENT_RADIO: 'var(--accent-radio)',
  };
  
  return mapping[accent];
}

// Get Tailwind-safe color classes for common use cases
export function getAccentTailwindClass(accent: AccentToken, type: 'border' | 'bg' | 'text' = 'border'): string {
  // For dynamic colors, we use inline styles instead of Tailwind classes
  // Return empty string to signal using inline style
  return '';
}

// Get RGB values for shadow/glow effects
export function getAccentRGBA(accent: AccentToken, alpha: number = 1): string {
  const rgbMapping: Record<AccentToken, string> = {
    ACCENT_NEUTRAL: `rgba(255, 255, 255, ${alpha})`,
    ACCENT_CARE: `rgba(245, 124, 0, ${alpha})`,
    ACCENT_CONNECT: `rgba(156, 39, 176, ${alpha})`,
    ACCENT_TICKET: `rgba(33, 150, 243, ${alpha})`,
    ACCENT_DROP: `rgba(255, 23, 68, ${alpha})`,
    ACCENT_CONTENT: `rgba(0, 230, 118, ${alpha})`,
    ACCENT_RADIO: `rgba(255, 235, 59, ${alpha})`,
  };
  
  return rgbMapping[accent];
}
