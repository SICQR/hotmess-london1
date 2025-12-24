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
import './styles/globals.css';

export default function App() {
  const [splashComplete, setSplashComplete] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteId>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Initialize analytics and monitoring
  useEffect(() => {
    // Initialize monitoring (Web Vitals, error tracking)
    initMonitoring();
    
    // Track initial page view
    analytics.pageView(window.location.pathname, 'HOTMESS LONDON');
    
    console.log('📊 Analytics & monitoring initialized');
  }, []);

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
            {splashComplete && ageVerified && (
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