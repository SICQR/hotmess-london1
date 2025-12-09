/**
 * HOTMESS LONDON — DESIGN TOKENS
 * 
 * Foundation tokens from Figma spec
 * Single source of truth for colors, typography, spacing, etc.
 */

// ============================================================================
// COLORS — "HOTMESS Core Palette"
// ============================================================================

// COMPLIANCE: Aligned with DESIGN_SYSTEM.md color palette
// All colors now match globals.css CSS variables
export const colors = {
  // Primary - matches DESIGN_SYSTEM.md
  black: '#000000',        // --color-black
  night: '#0A0A0A',        // secondary black
  hot: '#FF0080',          // --color-hot (HOTMESS Hot Pink)
  hotBright: '#FF1694',    // --color-hot-bright
  hotDark: '#E70F3C',      // --color-hot-dark
  white: '#FFFFFF',        // --color-white

  // Greys - monochrome scale
  grey: {
    100: '#0a0a0a',        // --color-mono-950
    200: '#171717',        // --color-mono-900
    300: '#262626',        // --color-mono-800
    400: '#404040',        // --color-mono-700
    500: '#525252',        // --color-mono-600
    600: '#737373',        // --color-mono-500
  },

  // Semantic Colors - matches DESIGN_SYSTEM.md
  success: '#00C853',      // --color-success (Green)
  warning: '#FFD600',      // --color-warning (Yellow)
  danger: '#FF1744',       // --color-danger (Red)
  info: '#00E5FF',         // --color-info (Cyan)
  purple: '#7C4DFF',       // --color-purple

  // Legacy aliases for backwards compatibility
  red: '#FF0080',          // Use 'hot' instead
  pink: '#FF1694',         // Use 'hotBright' instead
  green: '#00C853',        // Use 'success' instead
  yellow: '#FFD600',       // Use 'warning' instead
  orange: '#FF6E40',       // beacon reward color
  blue: '#00E5FF',         // Use 'info' instead
  gold: '#FFC107',         // beacon sponsor color
} as const;

// ============================================================================
// TYPOGRAPHY — "MASC TYPE SYSTEM"
// ============================================================================

export const typography = {
  display: {
    xl: {
      fontSize: '132px',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    l: {
      fontSize: '96px',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    m: {
      fontSize: '72px',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
  },

  headline: {
    l: {
      fontSize: '48px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    m: {
      fontSize: '36px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    s: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
  },

  body: {
    l: {
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    m: {
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    s: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },

  caption: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.4,
  },

  label: {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.2,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const;

// ============================================================================
// RADIUS
// ============================================================================

export const radius = {
  card: '20px',
  button: '12px',
  modal: '24px',
  full: '9999px',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  surface1: '0 4px 12px rgba(255, 0, 60, 0.12)',
  surface2: '0 8px 24px rgba(255, 0, 60, 0.18)',
  surface3: '0 0 40px rgba(255, 0, 60, 0.4)', // neon glow
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  mobile: '360px',
  tablet: '960px',
  desktop: '1440px',
} as const;

// ============================================================================
// GRID
// ============================================================================

export const grid = {
  mobile: {
    columns: 4,
    margin: '16px',
  },
  tablet: {
    columns: 12,
    margin: '40px',
  },
  desktop: {
    columns: 12,
    margin: '80px',
  },
} as const;

// ============================================================================
// ANIMATION
// ============================================================================

export const animation = {
  fast: '150ms',
  base: '250ms',
  slow: '400ms',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
} as const;
