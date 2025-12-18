# Error Boundaries and Error Handling Implementation

This document describes the error boundaries and error handling utilities implemented in the HOTMESS LONDON application.

## Overview

The application now has comprehensive error handling to prevent blank screens and provide graceful degradation when errors occur.

## Components

### 1. ErrorBoundary (`src/components/ErrorBoundary.tsx`)

Global error boundary that catches React component errors and displays a branded error screen.

**Features:**
- Catches all React component errors
- Displays user-friendly error message
- Provides "Reload Page" and "Go Home" buttons
- Shows error stack trace in development mode
- Integrates with analytics (gtag) if available
- Supports custom fallback UI

**Usage:**
```tsx
import { ErrorBoundary } from './components/ErrorBoundary';

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

**With custom fallback:**
```tsx
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

### 2. FeatureErrorBoundary (`src/components/FeatureErrorBoundary.tsx`)

Feature-specific error boundary for modular error handling.

**Features:**
- Compact error UI for feature failures
- Doesn't crash entire app when a feature fails
- Provides retry functionality
- Logs errors with feature name for easier debugging

**Usage:**
```tsx
import { FeatureErrorBoundary } from './components/FeatureErrorBoundary';

<FeatureErrorBoundary featureName="Map View">
  <MapComponent />
</FeatureErrorBoundary>
```

## Error Handling Utilities (`src/lib/error-handling.ts`)

### safeAsync()

Safe wrapper for async operations with error handling and user feedback.

**Features:**
- Catches errors automatically
- Shows user-friendly toast messages
- Calls optional error handler
- Returns fallback value on error

**Usage:**
```tsx
import { safeAsync } from '../lib/error-handling';

const loadData = async () => {
  const data = await safeAsync(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    {
      errorMessage: 'Failed to load data',
      onError: (error) => console.error('Error:', error),
      fallback: [],
    }
  );
  
  setData(data);
};
```

### retry()

Retry async operations with exponential backoff.

**Features:**
- Configurable max attempts (default: 3)
- Exponential backoff (default: 2x)
- Optional retry callback
- Configurable initial delay

**Usage:**
```tsx
import { retry } from '../lib/error-handling';

const fetchData = async () => {
  return retry(
    async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed');
      return response.json();
    },
    {
      maxAttempts: 3,
      delayMs: 1000,
      backoff: 2,
      onRetry: (attempt) => console.log(`Retry ${attempt}/3`),
    }
  );
};
```

### isApiError()

Type guard for API errors.

**Usage:**
```tsx
import { isApiError } from '../lib/error-handling';

try {
  await fetchData();
} catch (error) {
  if (isApiError(error)) {
    console.log(`API Error ${error.status}: ${error.message}`);
  }
}
```

## Global Error Handling

### Unhandled Promise Rejections (`src/main.tsx`)

Catches unhandled promise rejections and shows user-friendly toast messages.

**Features:**
- Prevents default browser error
- Shows toast notification
- Logs to Sentry if available
- Logs to console for debugging

### Uncaught Errors (`src/lib/monitoring.ts`)

Catches uncaught JavaScript errors and sends to analytics.

**Features:**
- Tracks filename, line number, column number
- Sends to analytics service
- Logs to console

## API Integration

All API functions now use the `retry()` utility for automatic retry with exponential backoff:

- `src/lib/api/beacons.ts` - Beacon operations
- `src/lib/api/messmarket.ts` - Marketplace operations
- `src/lib/api/xp.ts` - XP system operations

## Best Practices

### 1. Component Error Handling

Always use loading and error states in components:

```tsx
function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    safeAsync(
      async () => {
        const result = await fetchData();
        setData(result);
      },
      {
        errorMessage: 'Failed to load data',
        onError: (err) => setError(err),
      }
    ).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
}
```

### 2. Feature Boundaries

Wrap independent features in FeatureErrorBoundary:

```tsx
<FeatureErrorBoundary featureName="Chat">
  <ChatComponent />
</FeatureErrorBoundary>
```

### 3. API Calls

Use retry for important API calls:

```tsx
export async function getCriticalData() {
  return retry(
    async () => {
      const response = await fetch('/api/critical');
      if (!response.ok) throw new Error('Failed');
      return response.json();
    },
    { maxAttempts: 3 }
  );
}
```

### 4. User Feedback

Always show user feedback for async operations:

```tsx
try {
  await saveData(data);
  toast.success('Saved successfully!');
} catch (error) {
  toast.error('Failed to save. Please try again.');
}
```

## Testing

### Manual Testing

1. **Test Error Boundary:**
   - Create a component that throws an error
   - Verify error boundary catches it
   - Verify branded error screen appears
   - Test "Reload Page" and "Go Home" buttons

2. **Test Promise Rejection:**
   - Create an unhandled promise rejection
   - Verify toast notification appears
   - Check console for error log

3. **Test API Retry:**
   - Simulate network failure
   - Verify API calls retry 3 times
   - Verify exponential backoff
   - Check console for retry logs

### Error Scenarios Covered

✅ React component crashes
✅ Unhandled promise rejections
✅ Failed API calls
✅ Network timeouts
✅ Invalid data responses
✅ Missing dependencies
✅ Runtime errors

## Security

- No security vulnerabilities detected (CodeQL scan: 0 alerts)
- Proper TypeScript types (no `any` types)
- Safe error logging (no sensitive data exposure)
- Proper error boundaries prevent full app crashes

## Performance

- Error boundaries have minimal overhead
- Retry logic uses exponential backoff to prevent API spam
- Errors are logged efficiently
- No memory leaks from error handlers

## Browser Support

- Supports all modern browsers
- Falls back gracefully for browsers without error tracking APIs
- Works with React 18.x

## Future Enhancements

Potential future improvements:

1. Integration with error tracking service (Sentry, Rollbar)
2. Error reporting dashboard
3. User feedback on errors
4. Offline error queue
5. Error replay functionality
6. A/B testing for error messages

## Related Documentation

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling Best Practices](https://github.com/goldbergyoni/nodebestpractices#2-error-handling-practices)
- [Toast Notifications (Sonner)](https://sonner.emilkowal.ski/)
