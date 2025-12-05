import { ReactNode } from 'react';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { RouteId } from '../../lib/routes';

interface PublicLayoutProps {
  children: ReactNode;
  currentRoute: RouteId;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function PublicLayout({ children, currentRoute, onNavigate }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage={currentRoute} onNavigate={onNavigate} />
      
      {/* Main content - adjust padding for mobile/desktop nav */}
      <main className="pt-20 lg:pt-0 lg:pl-80">
        {children}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
