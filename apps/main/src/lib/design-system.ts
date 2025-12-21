// lib/design-system.ts
// HOTMESS LONDON — Brutalist × Luxury Design System
// Token-based component classes for consistent brutal aesthetic

/**
 * TYPOGRAPHY SCALE
 * Oversized, bold, tight tracking
 */
export const typography = {
  // Display (Hero titles)
  displayLarge: "text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter",
  displayMedium: "text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight",
  displaySmall: "text-3xl md:text-5xl font-bold leading-[0.95] tracking-tight",
  
  // Headings
  h1: "text-3xl md:text-4xl font-bold uppercase tracking-tight",
  h2: "text-2xl md:text-3xl font-bold uppercase tracking-tight",
  h3: "text-xl md:text-2xl font-bold uppercase tracking-tight",
  h4: "text-lg md:text-xl font-bold tracking-tight",
  
  // Body
  bodyLarge: "text-base md:text-lg font-medium",
  body: "text-sm md:text-base",
  bodySmall: "text-xs md:text-sm",
  
  // Labels & Metadata
  label: "text-[10px] uppercase tracking-widest font-bold",
  metadata: "text-xs uppercase tracking-wider font-bold opacity-60",
  microcopy: "text-xs uppercase tracking-widest font-bold opacity-50",
};

/**
 * COLORS
 * Dark neon × wet black palette
 */
export const colors = {
  // Backgrounds
  bgPage: "bg-black",
  bgCard: "bg-black/20 backdrop-blur-sm",
  bgCardInteractive: "bg-black/30 backdrop-blur-sm",
  bgHot: "bg-hot/10",
  bgHotStrong: "bg-hot",
  bgError: "bg-hot/5",
  
  // Borders
  borderDefault: "border-white/10",
  borderHover: "border-white/20",
  borderHot: "border-hot/50",
  borderHotSubtle: "border-hot/30",
  
  // Text
  textPrimary: "text-white",
  textHot: "text-hot",
  textMuted: "opacity-70",
  textSubtle: "opacity-50",
  
  // Effects
  glass: "backdrop-blur-sm",
  glassStrong: "backdrop-blur-md",
};

/**
 * SPACING
 * Generous, rhythmic spacing for luxury feel
 */
export const spacing = {
  // Page containers
  pageContainer: "mx-auto max-w-6xl p-4 md:p-6 pb-32",
  pageContainerWide: "mx-auto max-w-7xl p-4 md:p-8 pb-32",
  pageContainerNarrow: "mx-auto max-w-4xl p-4 md:p-6 pb-32",
  
  // Section spacing
  sectionVertical: "space-y-8 md:space-y-10",
  sectionVerticalTight: "space-y-5 md:space-y-6",
  sectionVerticalLoose: "space-y-10 md:space-y-12",
  
  // Card spacing
  cardPadding: "p-5 md:p-6",
  cardPaddingLarge: "p-6 md:p-8",
  cardGap: "gap-4 md:gap-5",
  
  // Button groups
  buttonGroup: "flex flex-wrap gap-3",
  buttonGroupTight: "flex flex-wrap gap-2",
};

/**
 * BORDERS & RADIUS
 * Brutalist rounded corners
 */
export const borders = {
  // Radius
  radiusButton: "rounded-xl",
  radiusCard: "rounded-2xl",
  radiusSection: "rounded-3xl",
  radiusFull: "rounded-full",
  
  // Combined with border
  cardBorder: "rounded-2xl border border-white/10",
  sectionBorder: "rounded-3xl border border-white/10",
};

/**
 * BUTTONS
 * Brutalist uppercase CTAs
 */
export const buttons = {
  // Primary (Hot)
  primary: `
    rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm 
    px-5 py-2.5 font-bold uppercase tracking-wide text-hot 
    hover:bg-hot hover:text-black transition-all text-sm
    disabled:opacity-30 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),
  
  // Secondary
  secondary: `
    rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm 
    px-5 py-2.5 font-bold uppercase tracking-wide 
    hover:bg-white/10 hover:border-white/30 transition-all text-sm
    disabled:opacity-30 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),
  
  // Ghost
  ghost: `
    rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm 
    px-5 py-2.5 font-bold uppercase tracking-wide 
    hover:bg-white/5 hover:border-white/20 transition-all text-sm
    disabled:opacity-30 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),
  
  // Small variants
  primarySmall: `
    rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm 
    px-4 py-2 text-xs font-bold uppercase tracking-wide text-hot 
    hover:bg-hot hover:text-black transition-all
    disabled:opacity-30 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),
  
  secondarySmall: `
    rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm 
    px-4 py-2 text-xs font-bold uppercase tracking-wide 
    hover:bg-white/10 hover:border-white/30 transition-all
    disabled:opacity-30 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),
};

/**
 * CARDS
 * Dark glassmorphism with hover states
 */
export const cards = {
  // Base card
  base: `
    rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm 
    p-5 transition-all
  `.trim().replace(/\s+/g, ' '),
  
  // Interactive card (clickable/hoverable)
  interactive: `
    rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm 
    p-5 hover:border-white/20 hover:bg-black/30 transition-all 
    cursor-pointer group
  `.trim().replace(/\s+/g, ' '),
  
  // Section card (larger)
  section: `
    rounded-3xl border border-white/10 bg-black/20 backdrop-blur-sm 
    p-6 md:p-8 transition-all
  `.trim().replace(/\s+/g, ' '),
  
  // Error card
  error: `
    rounded-3xl border border-hot/30 bg-hot/5 backdrop-blur-sm 
    p-5 transition-all
  `.trim().replace(/\s+/g, ' '),
};

/**
 * BADGES
 * Brutalist pills
 */
export const badges = {
  // Hot accent
  hot: `
    text-[10px] uppercase tracking-wider font-bold rounded-full 
    border border-hot/50 bg-hot/10 px-3 py-1.5 text-hot
  `.trim().replace(/\s+/g, ' '),
  
  // Default
  default: `
    text-[10px] uppercase tracking-wider font-bold rounded-full 
    border border-white/20 bg-white/5 px-3 py-1.5
  `.trim().replace(/\s+/g, ' '),
  
  // Outline
  outline: `
    text-[10px] uppercase tracking-wider font-bold rounded-full 
    border border-white/30 px-3 py-1.5
  `.trim().replace(/\s+/g, ' '),
};

/**
 * INPUTS
 * Brutalist form fields
 */
export const inputs = {
  text: `
    rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm 
    px-4 py-2.5 font-medium text-sm
    focus:border-hot/50 focus:bg-black/40 focus:outline-none 
    transition-all placeholder:opacity-50
  `.trim().replace(/\s+/g, ' '),
  
  textarea: `
    rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm 
    px-4 py-2.5 font-medium text-sm
    focus:border-hot/50 focus:bg-black/40 focus:outline-none 
    transition-all placeholder:opacity-50 min-h-[120px]
  `.trim().replace(/\s+/g, ' '),
};

/**
 * HERO PATTERNS
 * Full-bleed hero sections
 */
export const hero = {
  // Standard hero
  base: `
    relative overflow-hidden rounded-3xl border border-white/10 bg-black
  `.trim().replace(/\s+/g, ' '),
  
  // With neon gradient
  neon: `
    relative overflow-hidden rounded-3xl border border-white/10 bg-black
  `.trim().replace(/\s+/g, ' '),
  
  // Gradient overlay (use as child div with style prop)
  gradientOverlay: {
    background: "linear-gradient(135deg, rgba(255,20,147,0.15) 0%, rgba(0,0,0,0.8) 100%)",
  },
};

/**
 * GRID LAYOUTS
 * Responsive grid patterns
 */
export const grids = {
  // 2 column
  twoCol: "grid md:grid-cols-2 gap-4 md:gap-5",
  
  // 3 column
  threeCol: "grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5",
  
  // 4 column
  fourCol: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4",
  
  // Auto-fit (responsive cards)
  autoFit: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5",
};

/**
 * UTILITY CLASSES
 */
export const utils = {
  // Transitions
  transition: "transition-all duration-200",
  transitionColors: "transition-colors duration-200",
  
  // Truncate
  truncate: "truncate",
  lineClamp2: "line-clamp-2",
  lineClamp3: "line-clamp-3",
  
  // Aspect ratios
  aspectSquare: "aspect-square",
  aspectVideo: "aspect-video",
  aspect4x3: "aspect-[4/3]",
};

/**
 * COMPOSE UTILITY
 * Combine multiple class strings
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
