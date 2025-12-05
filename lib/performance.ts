/**
 * Performance optimization utilities
 * Code splitting, lazy loading, and bundle optimization helpers
 */

import dynamic from 'next/dynamic';

// Lazy load heavy components with loading fallbacks
export const LazyComponents = {
  // Admin components (only load when needed)
  AdminOverview: dynamic(() => import('@/components/admin/AdminOverviewClient').then(m => ({ default: m.AdminOverviewClient })), {
    loading: () => <div className="animate-pulse p-8">Loading admin dashboard...</div>,
    ssr: false, // Don't SSR admin components
  }),
  
  AdminBeacons: dynamic(() => import('@/components/admin/AdminBeaconsClient').then(m => ({ default: m.AdminBeaconsClient })), {
    loading: () => <div className="animate-pulse p-8">Loading beacons...</div>,
    ssr: false,
  }),
  
  AdminUsers: dynamic(() => import('@/components/admin/AdminUsersClient').then(m => ({ default: m.AdminUsersClient })), {
    loading: () => <div className="animate-pulse p-8">Loading users...</div>,
    ssr: false,
  }),

  // User-facing components
  RewardsClient: dynamic(() => import('@/components/RewardsClient').then(m => ({ default: m.RewardsClient })), {
    loading: () => <div className="animate-pulse p-8">Loading rewards...</div>,
  }),
  
  DropsClient: dynamic(() => import('@/components/DropsClient').then(m => ({ default: m.DropsClient })), {
    loading: () => <div className="animate-pulse p-8">Loading drops...</div>,
  }),
  
  AccountClient: dynamic(() => import('@/components/AccountClient').then(m => ({ default: m.AccountClient })), {
    loading: () => <div className="animate-pulse p-8">Loading profile...</div>,
  }),
};

// Image optimization settings
export const imageConfig = {
  // Use smaller images on mobile
  getResponsiveSrc: (src: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    // If Unsplash image, add size parameters
    if (src.includes('unsplash.com')) {
      const sizeMap = {
        sm: 'w=400',
        md: 'w=800',
        lg: 'w=1200',
      };
      return `${src}${src.includes('?') ? '&' : '?'}${sizeMap[size]}&q=80&auto=format`;
    }
    return src;
  },

  // Lazy loading config
  loading: 'lazy' as const,
  decoding: 'async' as const,
};

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for scroll/resize handlers
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Check if we should preload data
export function shouldPreload(): boolean {
  // Don't preload on slow connections
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g')) {
      return false;
    }
  }
  return true;
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px', // Start loading 50px before element is visible
    threshold: 0.01,
    ...options,
  });
}
