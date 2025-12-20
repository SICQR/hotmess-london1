import { toast } from 'sonner';

/**
 * Safe async wrapper that catches errors and shows user-friendly messages
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  options: {
    errorMessage?: string;
    onError?: (error: Error) => void;
    fallback?: T;
  } = {}
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    
    console.error('Async error:', err);
    
    // Show user-friendly message
    toast.error(options.errorMessage || 'Something went wrong. Please try again.');
    
    // Call error handler
    options.onError?.(err);
    
    // Return fallback value
    return options.fallback;
  }
}

/**
 * Retry async operation with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: number;
    onRetry?: (attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = 2,
    onRetry,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxAttempts) {
        const delay = delayMs * Math.pow(backoff, attempt - 1);
        onRetry?.(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Type guard for API errors
 */
export function isApiError(error: unknown): error is { message: string; status: number } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    typeof (error as any).message === 'string' &&
    typeof (error as any).status === 'number'
  );
}
