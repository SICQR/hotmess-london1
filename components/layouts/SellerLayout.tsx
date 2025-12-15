import { ReactNode, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, LayoutDashboard, Package, DollarSign, BarChart3, Settings, Menu } from 'lucide-react';
import { RouteId } from '../../lib/routes';

interface SellerLayoutProps {
  children: ReactNode;
  currentRoute: RouteId;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function SellerLayout({ children, currentRoute, onNavigate }: SellerLayoutProps) {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'sellerDashboard' as RouteId, label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'sellerListings' as RouteId, label: 'LISTINGS', icon: Package },
    { id: 'sellerOrders' as RouteId, label: 'ORDERS', icon: BarChart3 },
    { id: 'sellerPayouts' as RouteId, label: 'PAYOUTS', icon: DollarSign },
    { id: 'sellerSettings' as RouteId, label: 'SETTINGS', icon: Settings }
  ];

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  const handleNavClick = (route: RouteId) => {
    onNavigate(route);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-black border-r border-hot/30 flex flex-col z-50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-hot/30">
          <div className="flex items-center justify-between mb-4">
            <h1 
              className="uppercase tracking-[-0.04em] text-hot" 
              style={{ fontWeight: 900, fontSize: '32px', lineHeight: '1' }}
            >
              HOTMESS
            </h1>
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-hot/20 transition-colors lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-hot" />
            </button>
          </div>
          <div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>SELLER DASHBOARD</div>
            <div className="text-white mt-1 truncate" style={{ fontWeight: 400, fontSize: '13px' }}>{user?.displayName}</div>
            <div className="text-hot uppercase mt-1" style={{ fontWeight: 900, fontSize: '10px' }}>
              SELLER
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 transition-all uppercase tracking-wider
                  ${isActive 
                    ? 'bg-hot text-black border-l-2 border-hot' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                  }
                `}
                style={{ fontWeight: 700, fontSize: '12px' }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-hot/30 space-y-2">
          <button
            onClick={() => {
              onNavigate('market');
              setIsSidebarOpen(false);
            }}
            className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors uppercase tracking-wider"
            style={{ fontWeight: 700, fontSize: '12px' }}
          >
            VIEW MARKET
          </button>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 bg-white/10 hover:bg-hot hover:text-black text-white border border-white/20 hover:border-hot transition-all uppercase tracking-wider"
            style={{ fontWeight: 900, fontSize: '12px' }}
          >
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-hot/30 flex items-center justify-between px-4 z-30 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-hot/20 transition-colors"
        >
          <Menu className="w-6 h-6 text-hot" />
        </button>
        <h1 className="uppercase tracking-[-0.04em] text-hot" style={{ fontWeight: 900, fontSize: '24px' }}>
          HOTMESS
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}