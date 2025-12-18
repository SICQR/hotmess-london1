/**
 * Performance monitoring utilities
 * Tracks Web Vitals, long tasks, and custom performance metrics
 */

import { analytics } from './analytics';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  entries?: any[];
}

/**
 * Web Vitals thresholds (in milliseconds)
 */
const THRESHOLDS = {
  FCP: 1800,  // First Contentful Paint
  LCP: 2500,  // Largest Contentful Paint
  FID: 100,   // First Input Delay
  CLS: 0.1,   // Cumulative Layout Shift (no unit)
  TTFB: 800,  // Time to First Byte
  INP: 200,   // Interaction to Next Paint
};

/**
 * Track Web Vitals using the web-vitals library pattern
 */
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // FCP - First Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            reportMetric({
              name: 'FCP',
              value: entry.startTime,
              rating: getRating(entry.startTime, THRESHOLDS.FCP),
            });
          }
        });
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      // Observer not supported
    }

    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        reportMetric({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: getRating(lastEntry.renderTime || lastEntry.loadTime, THRESHOLDS.LCP),
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // Observer not supported
    }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          reportMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            rating: getRating(entry.processingStart - entry.startTime, THRESHOLDS.FID),
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // Observer not supported
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            reportMetric({
              name: 'CLS',
              value: clsValue,
              rating: getRating(clsValue, THRESHOLDS.CLS),
            });
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Observer not supported
    }

    // INP - Interaction to Next Paint (newer metric)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          reportMetric({
            name: 'INP',
            value: entry.duration,
            rating: getRating(entry.duration, THRESHOLDS.INP),
          });
        });
      });
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
    } catch (e) {
      // Observer not supported
    }
  }

  // TTFB - Time to First Byte (using Navigation Timing API)
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      reportMetric({
        name: 'TTFB',
        value: ttfb,
        rating: getRating(ttfb, THRESHOLDS.TTFB),
      });
    }
  }
}

/**
 * Report metric to analytics
 */
function reportMetric(metric: PerformanceMetric) {
  analytics.performance(metric.name, metric.value, {
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  });

  // Only log significant metrics in development (not every CLS update)
  if (process.env.NODE_ENV === 'development' && !['CLS'].includes(metric.name)) {
    console.log(`📊 ${metric.name}:`, {
      value: Math.round(metric.value),
      rating: metric.rating,
    });
  }
}

/**
 * Get rating based on threshold
 */
function getRating(value: number, threshold: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= threshold) return 'good';
  if (value <= threshold * 2) return 'needs-improvement';
  return 'poor';
}

/**
 * Track custom performance metric
 */
export function trackCustomMetric(name: string, value: number, metadata?: Record<string, any>) {
  analytics.performance(name, value, metadata);
}

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const result = fn();
  
  // If async, wait for completion
  if (result instanceof Promise) {
    return result.then((value) => {
      const duration = performance.now() - start;
      trackCustomMetric(name, duration);
      return value;
    });
  }
  
  // Sync function
  const duration = performance.now() - start;
  trackCustomMetric(name, duration);
  return result;
}

/**
 * Monitor API response times
 */
export async function monitorApiCall<T>(
  endpoint: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await fetchFn();
    const duration = performance.now() - start;
    
    trackCustomMetric(`API_${endpoint}`, duration, {
      status: 'success',
      endpoint,
    });
    
    return result;
  } catch (error: any) {
    const duration = performance.now() - start;
    
    trackCustomMetric(`API_${endpoint}`, duration, {
      status: 'error',
      endpoint,
      error: error.message,
    });
    
    // Track error
    analytics.apiError(endpoint, error.status || 500, error.message);
    
    throw error;
  }
}

/**
 * Global error handler
 */
export function setupGlobalErrorHandling() {
  if (typeof window === 'undefined') return;

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    analytics.error(event.message, {
      type: 'uncaught_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Note: unhandledrejection is now handled in main.tsx with toast notifications

  // Catch console errors (optional - can be noisy)
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Only track in production
    if (process.env.NODE_ENV === 'production') {
      analytics.error(args.join(' '), {
        type: 'console_error',
      });
    }
    originalError.apply(console, args);
  };
}

/**
 * Track long tasks (> 50ms)
 * DISABLED in development to avoid console noise
 */
export function trackLongTasks() {
  // Completely disabled in development - no tracking, no observers, no warnings
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return;
  }
  
  // Production-only long task tracking
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.duration > 50) {
            analytics.performance('Long_Task', entry.duration, {
              name: entry.name,
              startTime: entry.startTime,
            });
          }
        });
      });
      observer.observe({ type: 'longtask', buffered: true });
    } catch (e) {
      // Long task API not supported
    }
  }
}

/**
 * Initialize all monitoring
 */
export function initMonitoring() {
  if (typeof window === 'undefined') return;

  trackWebVitals();
  setupGlobalErrorHandling();
  
  // Long task tracking disabled in development to avoid console noise
  // Only runs in production environments
  if (process.env.NODE_ENV === 'production') {
    trackLongTasks();
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Performance monitoring initialized (long task tracking disabled in dev)');
  }
}
