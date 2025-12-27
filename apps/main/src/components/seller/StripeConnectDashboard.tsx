/**
 * Stripe Connect Embedded Dashboard Component
 * Embeds Stripe's seller dashboard directly in HOTMESS UI
 */

import { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { loadStripeConnect } from '../../lib/stripe-loader';

interface StripeConnectDashboardProps {
  /** Client secret from account session API */
  clientSecret?: string;
  /** Callback when dashboard encounters an error */
  onError?: (error: string) => void;
}

export function StripeConnectDashboard({
  clientSecret,
  onError,
}: StripeConnectDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientSecret) return;
    initializeStripeDashboard();
  }, [clientSecret]);

  if (!clientSecret) {
    return null;
  }

  const initializeStripeDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading Stripe Connect SDK for dashboard...');
      const StripeConnectInstance = await loadStripeConnect();
      
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (!publishableKey) {
        throw new Error('Stripe publishable key not found. Please set VITE_STRIPE_PUBLISHABLE_KEY environment variable.');
      }

      const instance = StripeConnectInstance(publishableKey);

      if (!containerRef.current) {
        throw new Error('Container ref not available');
      }

      console.log('Creating embedded dashboard component...');
      const accountManagement = instance.create('account-management', {
        clientSecret,
        appearance: {
          variables: {
            colorPrimary: '#ef4444', // HOTMESS red
            colorBackground: '#18181b', // zinc-900
            colorText: '#fafafa', // zinc-50
            colorDanger: '#dc2626',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '0.5rem',
          },
          overlays: 'drawer',
        },
      });

      // Mount the component
      accountManagement.mount(containerRef.current);

      // Listen for error event
      accountManagement.on('error', (e: any) => {
        console.error('Dashboard error:', e);
        const errorMsg = e?.error?.message || 'Dashboard failed to load';
        setError(errorMsg);
        if (onError) {
          onError(errorMsg);
        }
      });

      setLoading(false);
    } catch (err) {
      console.error('Failed to initialize Stripe dashboard:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-bold text-red-200 mb-1">Dashboard Error</p>
          <p className="text-zinc-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-hot animate-spin" />
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>Loading Dashboard...</p>
          </div>
        </div>
      )}
      
      {/* Stripe Connect will mount here */}
      <div 
        ref={containerRef} 
        className="min-h-[600px] bg-white/5 border border-white/10 overflow-hidden"
        style={{
          width: '100%',
        }}
      />
    </div>
  );
}