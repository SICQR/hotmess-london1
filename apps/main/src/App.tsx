// MUST be imported FIRST to suppress false positive Three.js warning
import './lib/suppress-three-warning';

import { useState, useEffect } from 'react';
import { Splash } from './components/Splash';
import { AgeGate } from './components/gate';
import { AppContent } from './components/AppContent';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { RadioProvider } from './contexts/RadioContext';
import { PlayerProvider } from './components/player/PlayerProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteId } from './lib/routes';
import { analytics } from './lib/analytics';
import { initMonitoring } from './lib/monitoring';
import { supabase } from './lib/supabase';
import { AccountConsents } from './pages/DataPrivacyAndAccountPages';
import './styles/globals.css';

function withTimeout<T>(promiseLike: PromiseLike<T>, ms: number, label: string): Promise<T> {
  const promise = Promise.resolve(promiseLike);
  let timeoutId: number | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(`[timeout] ${label} after ${ms}ms`));
    }, ms);
  });

  return (Promise.race([promise, timeout]).finally(() => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }) as unknown) as Promise<T>;
}

export default function App() {
  const [splashComplete, setSplashComplete] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [complianceChecked, setComplianceChecked] = useState(false);
  const [consentRequired, setConsentRequired] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteId>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Supabase password recovery links reliably include `#type=recovery` in the hash.
  // Force routing to the reset flow and bypass gates that would otherwise block the screen.
  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.includes('type=recovery')) {
      console.log('OS: Password Reset Session Detected.');
      setCurrentRoute('setNewPassword');
      setRouteParams({});
      setSplashComplete(true);
      setAgeVerified(true);
      setComplianceChecked(true);
      setConsentRequired(false);
    }
  }, []);

  // Initialize analytics and monitoring
  useEffect(() => {
    // Initialize monitoring (Web Vitals, error tracking)
    initMonitoring();
    
    // Track initial page view
    analytics.pageView(window.location.pathname, 'HOTMESS LONDON');
    
    console.log('📊 Analytics & monitoring initialized');
  }, []);

  // Consent lock (DB-backed): once age gate has been passed, confirm profile flags
  // before mounting the main AppContent.
  useEffect(() => {
    if (!splashComplete || !ageVerified) {
      setComplianceChecked(false);
      setConsentRequired(false);
      return;
    }

    // Password recovery flow must not be blocked by consent gating.
    if ((window.location.hash || '').includes('type=recovery')) {
      setConsentRequired(false);
      setComplianceChecked(true);
      return;
    }

    let cancelled = false;

    const checkCompliance = async () => {
      setComplianceChecked(false);
      try {
        // Use session (local) instead of getUser (network) to avoid hanging when offline.
        const { data: sessionData } = await withTimeout(
          supabase.auth.getSession(),
          1500,
          'supabase.auth.getSession()'
        );
        const user = sessionData.session?.user ?? null;

        // If not signed in, we can't persist consent to DB; allow read-only browsing.
        if (!user) {
          if (!cancelled) {
            setConsentRequired(false);
            setComplianceChecked(true);
          }
          return;
        }

        // Ensure profile row exists.
        // Supabase typings can infer insert/upsert payload as `never` in this repo;
        // cast at the call-site to keep builds unblocked.
        await withTimeout(
          (supabase as any).from('profiles').upsert({ id: user.id }, { onConflict: 'id' }),
          4000,
          'profiles.upsert(id)'
        );

        const { data, error } = await withTimeout(
          supabase
            .from('profiles')
            .select('consent_accepted, is_18_plus')
            .eq('id', user.id)
            .maybeSingle(),
          4000,
          'profiles.select(consent_accepted,is_18_plus)'
        );

        if (error) {
          const message = String((error as any)?.message ?? '');
          const code = String((error as any)?.code ?? '');
          const missingColumns =
            code === 'PGRST204' ||
            message.toLowerCase().includes('schema cache') ||
            message.toLowerCase().includes('column') ||
            message.toLowerCase().includes('could not find');

          if (!cancelled) {
            // If compliance columns are missing (migration not applied yet), fail open to unblock the app.
            if (missingColumns) {
              console.warn('Compliance columns missing. Bypassing lock.', { code, message });
              setConsentRequired(false);
              setComplianceChecked(true);
              return;
            }

            // Otherwise fail closed for authenticated users: route to consent gate.
            setConsentRequired(true);
            setComplianceChecked(true);
          }
          return;
        }

        const ok = Boolean((data as any)?.consent_accepted) && Boolean((data as any)?.is_18_plus);
        if (!cancelled) {
          setConsentRequired(!ok);
          setComplianceChecked(true);
        }
      } catch {
        if (!cancelled) {
          // If Supabase is unreachable or slow, don't hard-lock the app.
          // Users can still browse read-only; the consent gate will show when the backend is available.
          setConsentRequired(false);
          setComplianceChecked(true);
        }
      }
    };

    const { data: authSub } = supabase.auth.onAuthStateChange(() => {
      void checkCompliance();
    });

    void checkCompliance();

    return () => {
      cancelled = true;
      authSub.subscription.unsubscribe();
    };
  }, [splashComplete, ageVerified]);

  // Check localStorage for existing verification
  useEffect(() => {
    const verified = localStorage.getItem('hotmess_age_verified');
    
    // DEBUG: Log current state
    console.log('🔍 Age verification status:', verified);
    console.log('🔍 Current localStorage:', localStorage.getItem('hotmess_age_verified'));
    
    if (verified === 'true') {
      setAgeVerified(true);
      setSplashComplete(true); // Skip splash if already verified
    }
    
    // Parse URL - check query params first, then path
    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get('route') as RouteId | null;
    
    if (routeParam) {
      // Query param routing: ?route=beaconScan&code=GLO-001
      setCurrentRoute(routeParam);
      const paramObj: Record<string, string> = {};
      params.forEach((value, key) => {
        if (key !== 'route') {
          paramObj[key] = value;
        }
      });
      setRouteParams(paramObj);
    } else {
      // Path-based routing: /l/:code, /tickets/purchase, etc.
      const path = window.location.pathname;
      if (path.startsWith('/l/')) {
        const code = path.substring(3); // Remove '/l/'
        setCurrentRoute('beaconScan');
        setRouteParams({ code });
      } else if (path === '/tickets/purchase') {
        setCurrentRoute('ticketsPurchase');
        // Query params will be read by the PurchaseTicket component
      } else if (path === '/test-account-setup') {
        setCurrentRoute('quickTestSetup');
      } else if (path === '/test-cart') {
        setCurrentRoute('testCart');
      } else if (path.startsWith('/club/')) {
        const pathParts = path.substring(6).split('/'); // Remove '/club/'
        const clubId = pathParts[0] || 'default';
        
        if (pathParts[1] === 'scanner') {
          setCurrentRoute('clubDoorScanner');
          setRouteParams({ clubId, eventId: pathParts[2] || '' });
        } else if (pathParts[1] === 'events' && pathParts[2] === 'new') {
          setCurrentRoute('clubEventCreate');
          setRouteParams({ clubId });
        } else {
          setCurrentRoute('clubDashboard');
          setRouteParams({ clubId });
        }
      } else if (path.startsWith('/events/')) {
        const eventId = path.substring(8); // Remove '/events/'
        setCurrentRoute('clubEventDetail');
        setRouteParams({ eventId });
      }
    }
  }, []);

  const handleAgeGateEnter = () => {
    console.log('✅ Age gate ENTER clicked');
    localStorage.setItem('hotmess_age_verified', 'true');
    setAgeVerified(true);
    setSplashComplete(true);
  };

  const handleAgeGateLeave = () => {
    console.log('❌ Age gate LEAVE clicked');
    window.location.href = 'https://google.com';
  };

  const handleNavigate = (route: RouteId, params?: Record<string, string>) => {
    setCurrentRoute(route);
    if (params) setRouteParams(params);
    else setRouteParams({});
    
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SPLASH → AGE GATE POPUP → HOME flow
  // Main app with full routing
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <RadioProvider>
              <PlayerProvider>
              {/* BRUTALIST EDITORIAL DESIGN ACTIVE */}
              {/* Show splash first - BLOCKS EVERYTHING */}
              {!splashComplete && (
                <Splash onComplete={() => setSplashComplete(true)} />
              )}

            {/* Show age gate popup after splash - BLOCKS EVERYTHING */}
            {splashComplete && !ageVerified && (
              <AgeGate
                onEnter={handleAgeGateEnter}
                onLeave={handleAgeGateLeave}
              />
            )}

            {/* Main app content - ONLY SHOW AFTER VERIFICATION */}
            {splashComplete && ageVerified && !complianceChecked && (
              <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/60 text-sm">Checking consent…</div>
              </div>
            )}

            {splashComplete && ageVerified && complianceChecked && consentRequired && (
              <AccountConsents
                onNavigate={handleNavigate}
                gateMode
                onAccepted={() => {
                  setConsentRequired(false);
                }}
              />
            )}

            {splashComplete && ageVerified && complianceChecked && !consentRequired && (
              <AppContent
                currentRoute={currentRoute}
                routeParams={routeParams}
                onNavigate={handleNavigate}
              />
            )}

            </PlayerProvider>
          </RadioProvider>
        </CartProvider>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}