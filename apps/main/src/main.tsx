import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles/globals.css";
import { toast } from "sonner";

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

createRoot(document.getElementById("root")!).render(<App />);
  