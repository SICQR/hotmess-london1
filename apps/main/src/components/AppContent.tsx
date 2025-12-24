import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Router } from './Router';
import { ScanBeaconFAB } from './ScanBeaconFAB';
import { CookieBanner } from './CookieBanner';
import { MiniPlayerBar } from './player/MiniPlayerBar';
import { QueueDrawer } from './player/QueueDrawer';
import { PersistentRadioPlayer } from './radio/PersistentRadioPlayer';
import { ExpandedRadioPlayer } from './radio/ExpandedRadioPlayer';
import { FirstRunOnboarding } from './FirstRunOnboarding';
import { RouteId } from '../lib/routes';
import { useAuth } from '../contexts/AuthContext';

interface AppContentProps {
  currentRoute: RouteId;
  routeParams: Record<string, string>;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function AppContent({ currentRoute, routeParams, onNavigate }: AppContentProps) {
  const { signOut } = useAuth();

  // Handle logout route
  useEffect(() => {
    if (currentRoute === 'logout') {
      handleLogout();
    }
  }, [currentRoute]);

  async function handleLogout() {
    try {
      await signOut();
      toast.success('Logged out successfully');
      onNavigate('home');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      onNavigate('home');
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" theme="dark" richColors />
      
      {/* Hide navigation for full-bleed immersive routes and auth pages */}
      {currentRoute !== 'earth' && 
       currentRoute !== 'login' && 
       currentRoute !== 'register' &&
       currentRoute !== 'welcome' &&
       currentRoute !== 'passwordReset' &&
       currentRoute !== 'setNewPassword' && 
       currentRoute !== 'logout' && (
        <Navigation 
          currentPage={currentRoute} 
          onNavigate={onNavigate} 
        />
      )}
      
      {/* Main content - adjust padding based on route */}
      <main className={
        currentRoute === 'earth' || 
        currentRoute === 'login' || 
        currentRoute === 'register' ||
        currentRoute === 'welcome' ||
        currentRoute === 'passwordReset' ||
        currentRoute === 'setNewPassword' ||
        currentRoute === 'logout'
          ? '' 
          : 'pt-20 lg:pt-0 lg:pl-80'
      }>
        {currentRoute === 'logout' ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white animate-spin mx-auto mb-4" />
              <p className="text-white" style={{ fontWeight: 600, fontSize: '18px' }}>
                Logging out...
              </p>
            </div>
          </div>
        ) : (
          <Router 
            currentRoute={currentRoute}
            routeParams={routeParams}
            onNavigate={onNavigate}
          />
        )}
      </main>

      {/* Hide footer for full-bleed routes and auth pages */}
      {currentRoute !== 'earth' && 
       currentRoute !== 'login' && 
       currentRoute !== 'register' &&
       currentRoute !== 'welcome' &&
       currentRoute !== 'passwordReset' &&
       currentRoute !== 'setNewPassword' &&
       currentRoute !== 'logout' && (
        <>
          <Footer onNavigate={onNavigate} />
          <CookieBanner onNavigate={onNavigate} />
          
          {/* Floating Scan Button */}
          <ScanBeaconFAB 
            onNavigate={onNavigate}
            currentRoute={currentRoute}
          />
        </>
      )}

      {/* Player UI - Records */}
      <QueueDrawer />
      <MiniPlayerBar />

      {/* Radio Player UI - Persistent across navigation */}
      <PersistentRadioPlayer />
      <ExpandedRadioPlayer />
      
      {/* First Run Onboarding - Shows for new users */}
      <FirstRunOnboarding />
    </div>
  );
}
