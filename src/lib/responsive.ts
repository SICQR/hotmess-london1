/**
 * Responsive design utilities and breakpoint helpers
 * Ensures consistent responsive behavior across all components
 */

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const responsive = {
  // Container classes with responsive padding
  container: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
  containerNarrow: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl',
  containerWide: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]',

  // Grid systems
  gridAuto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6',
  grid3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  grid4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  grid6: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4',

  // Spacing
  sectionPadding: 'py-12 sm:py-16 lg:py-20',
  cardPadding: 'p-4 sm:p-6 lg:p-8',
  
  // Typography helpers
  h1: 'text-3xl sm:text-4xl lg:text-5xl',
  h2: 'text-2xl sm:text-3xl lg:text-4xl',
  h3: 'text-xl sm:text-2xl lg:text-3xl',
  h4: 'text-lg sm:text-xl lg:text-2xl',
  body: 'text-sm sm:text-base',
  small: 'text-xs sm:text-sm',

  // Visibility classes
  showMobile: 'block md:hidden',
  showTablet: 'hidden md:block lg:hidden',
  showDesktop: 'hidden lg:block',
  hideMobile: 'hidden md:block',
  hideTablet: 'block md:hidden lg:block',
  hideDesktop: 'block lg:hidden',

  // Common responsive patterns
  flexStack: 'flex flex-col sm:flex-row gap-4',
  flexCenter: 'flex flex-col sm:flex-row items-center justify-center gap-4',
  buttonGroup: 'flex flex-col sm:flex-row gap-3',
  statsGrid: 'grid grid-cols-2 md:grid-cols-4 gap-4',
} as const;

// Mobile-first breakpoint hooks
export function isMobile(width: number): boolean {
  return width < 768;
}

export function isTablet(width: number): boolean {
  return width >= 768 && width < 1024;
}

export function isDesktop(width: number): boolean {
  return width >= 1024;
}
