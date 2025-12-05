/**
 * HOTMESS LONDON — Design Tokens
 * Complete token system for colors, typography, spacing, radius, shadows, and motion
 */

export const DESIGN_TOKENS = {
  // Colors
  colors: {
    hot: '#E70F3C',
    heat: '#FF622D',
    neonLime: '#B2FF52',
    cyanStatic: '#29E2FF',
    wetBlack: '#000000',
    charcoal: '#0E0E0F',
    steel: '#9BA1A6',
  },

  // Typography
  typography: {
    display: {
      fontSize: '4rem',
      lineHeight: '1',
      fontWeight: '900',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase' as const,
    },
    h1: {
      fontSize: '3.5rem',
      lineHeight: '1',
      fontWeight: '900',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      lineHeight: '1.1',
      fontWeight: '800',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      lineHeight: '1.2',
      fontWeight: '700',
    },
    h4: {
      fontSize: '1.25rem',
      lineHeight: '1.3',
      fontWeight: '700',
    },
    h5: {
      fontSize: '1.125rem',
      lineHeight: '1.4',
      fontWeight: '600',
    },
    h6: {
      fontSize: '1rem',
      lineHeight: '1.4',
      fontWeight: '600',
    },
    body: {
      fontSize: '1rem',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    label: {
      fontSize: '0.875rem',
      lineHeight: '1.4',
      fontWeight: '500',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
  },

  // Spacing (in px)
  spacing: {
    4: '4px',
    8: '8px',
    16: '16px',
    24: '24px',
    32: '32px',
    48: '48px',
    64: '64px',
  },

  // Radius
  radius: {
    0: '0',
    4: '4px',
    8: '8px',
    16: '16px',
    100: '100px',
  },

  // Shadows
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.4)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.6)',
    hard: '0 4px 12px rgba(0, 0, 0, 0.8)',
    glow: '0 0 20px rgba(231, 15, 60, 0.6)',
    glowIntense: '0 0 40px rgba(231, 15, 60, 0.8), 0 0 80px rgba(231, 15, 60, 0.4)',
  },

  // Motion
  motion: {
    pulse: {
      animation: 'pulse',
      duration: '2s',
      timing: 'ease-in-out',
      iteration: 'infinite',
    },
    shimmer: {
      animation: 'shimmer',
      duration: '3s',
      timing: 'ease-in-out',
      iteration: 'infinite',
    },
    dropIn: {
      animation: 'drop-in',
      duration: '0.4s',
      timing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    heatWave: {
      animation: 'heat-wave',
      duration: '4s',
      timing: 'ease-in-out',
      iteration: 'infinite',
    },
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
