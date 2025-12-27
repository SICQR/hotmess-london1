import { createRoot } from "react-dom/client";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles/globals.css";
import { toast } from "sonner";
import { registerSW } from 'virtual:pwa-register';

// Define global types for error tracking
interface WindowWithSentry extends Window {
  Sentry?: {
    captureException: (error: unknown) => void;
  };
}

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Prevent default browser error
  event.preventDefault();
  
  // Show user-friendly message
  toast.error('An unexpected error occurred. Please try again.');
  
  // Log to error tracking if Sentry is available
  const win = window as WindowWithSentry;
  if (win.Sentry) {
    win.Sentry.captureException(event.reason);
  }
});

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

// PWA: register service worker (injectManifest) for offline resilience.
registerSW({ immediate: true });

function renderFatalError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  createRoot(rootEl!).render(
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
          App Failed to Start
        </h1>
        <p className="text-white/70 text-sm mb-4">
          A configuration or startup error prevented the app from loading.
        </p>
        <div className="text-left bg-black/40 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-white/50 mb-2">Error</div>
          <pre className="text-xs text-white/70 whitespace-pre-wrap break-words">{message}</pre>
        </div>
        <p className="text-white/50 text-xs mt-4">
          If this is a production deploy, verify your Vercel Environment Variables (VITE_*) are set.
        </p>
      </div>
    </div>
  );
}

(async () => {
  try {
    const mod = await import('./App.tsx');
    const App = mod.default;
    createRoot(rootEl!).render(<App />);
  } catch (error) {
    console.error('Fatal startup error:', error);
    renderFatalError(error);
  }
})();
  