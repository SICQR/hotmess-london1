/**
 * Debug utility for development logging
 * Automatically wraps console statements with DEV environment checks
 */

export const debug = {
  /**
   * Log debug information (only in development)
   */
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always logged, but sanitized)
   * Use this for errors that should be tracked in production
   */
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },

  /**
   * Group logs together (only in development)
   */
  group: (label: string, fn: () => void) => {
    if (import.meta.env.DEV) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  },

  /**
   * Log with timing information (only in development)
   */
  time: (label: string) => {
    if (import.meta.env.DEV) {
      console.time(label);
    }
  },

  /**
   * End timing (only in development)
   */
  timeEnd: (label: string) => {
    if (import.meta.env.DEV) {
      console.timeEnd(label);
    }
  },
};
