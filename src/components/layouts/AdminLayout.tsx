import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  X, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Radio, 
  MapPin, 
  Users, 
  Shield, 
  FileText, 
  Activity,
  Upload,
  Music,
  Globe,
  AlertCircle
} from 'lucide-react';
import { RouteId } from '../../lib/routes';

interface AdminLayoutProps {
  children: ReactNode;
  currentRoute: RouteId;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface NavItem {
  id: RouteId;
  label: string;
  subtitle: string;
  icon: any;
  badge?: number;
}

export function AdminLayout({ children, currentRoute, onNavigate }: AdminLayoutProps) {
  const { user, signOut } = useAuth();

  const navSections: Record<string, NavItem[]> = {
    'Overview & Analytics': [
      { 
        id: 'adminOverview' as RouteId, 
        label: 'Admin Overview',
        subtitle: 'Platform metrics, stats & action queues',
        icon: LayoutDashboard 
      },
      { 
        id: 'adminAudit' as RouteId, 
        label: 'Audit Logs',
        subtitle: 'System activity tracking and security logs',
        icon: Activity 
      }
    ],
    'User Management': [
      { 
        id: 'adminUsers' as RouteId, 
        label: 'Manage Users',
        subtitle: 'View, edit, ban users and manage roles',
        icon: Users 
      },
      { 
        id: 'adminDsar' as RouteId, 
        label: 'DSAR Requests',
        subtitle: 'GDPR data export & deletion requests',
        icon: FileText 
      }
    ],
    'Commerce & Products': [
      { 
        id: 'adminProducts' as RouteId, 
        label: 'Shop Products',
        subtitle: 'Manage Shopify products across all collections',
        icon: Package 
      },
      { 
        id: 'adminOrders' as RouteId, 
        label: 'Orders',
        subtitle: 'View and manage all platform orders',
        icon: ShoppingCart 
      },
      { 
        id: 'adminMarketSellers' as RouteId, 
        label: 'Market Sellers',
        subtitle: 'Approve and manage MessMarket sellers',
        icon: Users 
      }
    ],
    'Content & Radio': [
      { 
        id: 'adminContent' as RouteId, 
        label: 'Radio Management',
        subtitle: 'Manage shows, schedule & RadioKing integration',
        icon: Radio 
      },
      { 
        id: 'adminRecordsUpload' as RouteId, 
        label: 'Upload Records',
        subtitle: 'Upload MP3s and cover art for RAW Convict',
        icon: Upload 
      },
      { 
        id: 'adminRecordsReleases' as RouteId, 
        label: 'View Releases',
        subtitle: 'Browse all records and releases',
        icon: Music 
      }
    ],
    'Moderation & Safety': [
      { 
        id: 'adminReports' as RouteId, 
        label: 'Reports Queue',
        subtitle: 'Review user reports and moderate content',
        icon: AlertCircle 
      },
      { 
        id: 'adminModeration' as RouteId, 
        label: 'Moderation Desk',
        subtitle: 'Content moderation and user safety',
        icon: Shield 
      }
    ],
    'Beacons & Map': [
      { 
        id: 'adminBeacons' as RouteId, 
        label: 'Beacon Management',
        subtitle: 'Manage all beacons and locations',
        icon: MapPin 
      },
      { 
        id: 'adminGlobeView' as RouteId, 
        label: 'Globe View',
        subtitle: 'View beacons on 3D globe',
        icon: Globe 
      }
    ]
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-black border-r border-hot/30 flex flex-col z-50">
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
              className="p-2 hover:bg-hot/20 transition-colors"
              aria-label="Exit admin"
            >
              <X className="w-5 h-5 text-hot" />
            </button>
          </div>
          <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
            Operator Console
          </div>
          <div className="text-white mt-1 truncate" style={{ fontWeight: 400, fontSize: '13px' }}>
            {user?.email}
          </div>
          <div className="text-hot uppercase mt-1" style={{ fontWeight: 900, fontSize: '10px' }}>
            {user?.role || 'admin'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(navSections).map(([section, items]) => (
            <div key={section}>
              <div 
                className="text-white/40 uppercase tracking-wider mb-3 px-3" 
                style={{ fontWeight: 900, fontSize: '10px', letterSpacing: '0.05em' }}
              >
                {section}
              </div>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`
                        w-full flex flex-col items-start gap-1 px-3 py-2.5 transition-all
                        ${isActive 
                          ? 'bg-hot text-black border-l-2 border-hot' 
                          : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span 
                          className="uppercase tracking-wider"
                          style={{ fontWeight: 700, fontSize: '12px' }}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="ml-auto bg-hot text-black px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 900 }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div 
                        className={`text-left pl-6 ${isActive ? 'text-black/70' : 'text-white/40'}`}
                        style={{ fontWeight: 400, fontSize: '10px', lineHeight: '1.3' }}
                      >
                        {item.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-hot/30">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 bg-white/10 hover:bg-hot hover:text-black text-white transition-all uppercase tracking-wider border border-white/20 hover:border-hot"
            style={{ fontWeight: 900, fontSize: '12px' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-72 p-8">
        {children}
      </main>
    </div>
  );
}
