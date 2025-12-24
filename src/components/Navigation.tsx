import { Home, Radio, ShoppingBag, ShoppingCart, Heart, Map, Gift, User, Users, Menu, X, Zap, Package, Shield, TrendingUp, Sparkles, Settings, LogIn, Disc3, Globe, Ticket, Building2, Search, Pause, LogOut } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RouteId } from '../lib/routes';
import { buildNav } from '../lib/nav';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useRadio } from '../contexts/RadioContext';
import { NotificationBadge } from './NotificationBadge';

interface NavigationProps {
  currentPage: RouteId;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

type NavItem = {
  id: RouteId;
  label: string;
  icon: any;
  badge?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

// Icon mapping for routes
const ROUTE_ICONS: Record<string, any> = {
  home: Home,
  shop: ShoppingBag,
  shopCart: ShoppingCart,
  messmarket: Package,
  radio: Radio,
  records: Disc3,
  beacons: Zap,
  beaconsGlobe: Zap,
  earth: Globe,
  nightPulse: Globe,
  tickets: Ticket,
  myTickets: Ticket,
  account: User,
  settings: Settings,
  rewards: Gift,
  drops: Zap,
  login: LogIn,
  register: User,
  care: Heart,
  community: Users,
  connect: Users,
  trending: TrendingUp,
  legal: Shield,
  admin: Settings,
  about: Sparkles,
  map: Map,
  hnhMess: Heart,
  clubDashboard: Building2,
};

// Badge mapping for routes
const ROUTE_BADGES: Record<string, string> = {
  messmarket: 'LIMITED',
  radio: 'LIVE',
  records: 'NEW',
  beacons: 'LIVE',
  beaconsGlobe: 'LIVE',
  earth: 'NEW',
  drops: 'NEW',
  clubDashboard: 'VENUE',
};

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user } = useAuth();
  const { isPlaying, isLoading, togglePlay } = useRadio();

  // Build nav sections dynamically from registry
  const navSections = useMemo<NavSection[]>(() => {
    const nav = buildNav({
      isAuthed: !!user,
      isAdmin: user?.role === 'admin',
    });

    return [
      {
        title: 'Nightlife',
        items: [
          ...nav.primary
            .filter(r => ['tickets', 'map', 'beacons', 'nightPulse'].includes(r.id))
            .map(route => ({
              id: route.id,
              label: route.label,
              icon: ROUTE_ICONS[route.id] || Zap,
              badge: ROUTE_BADGES[route.id],
            })),
          // Add Connect if authed
          ...(user ? [{
            id: 'connect' as RouteId,
            label: 'Connect',
            icon: Users,
            badge: undefined,
          }] : []),
        ],
      },
      {
        title: 'Commerce',
        items: [
          ...nav.primary
            .filter(r => ['shop', 'messmarket'].includes(r.id))
            .map(route => ({
              id: route.id,
              label: route.label,
              icon: ROUTE_ICONS[route.id] || ShoppingBag,
              badge: route.id === 'shop' && itemCount > 0 
                ? itemCount.toString() 
                : ROUTE_BADGES[route.id],
            })),
          {
            id: 'shopCart' as RouteId,
            label: 'Cart',
            icon: ShoppingCart,
            badge: itemCount > 0 ? itemCount.toString() : undefined,
          },
        ],
      },
      {
        title: 'Music',
        items: [
          ...nav.primary
            .filter(r => ['records'].includes(r.id))
            .map(route => ({
              id: route.id,
              label: route.label,
              icon: ROUTE_ICONS[route.id] || Disc3,
              badge: ROUTE_BADGES[route.id],
            })),
          ...nav.utility
            .filter(r => ['radio'].includes(r.id))
            .map(route => ({
              id: route.id,
              label: route.label,
              icon: ROUTE_ICONS[route.id] || Radio,
              badge: ROUTE_BADGES[route.id],
            })),
        ],
      },
      {
        title: 'Community',
        items: nav.utility
          .filter(r => ['care', 'community', 'hnhMess'].includes(r.id))
          .map(route => ({
            id: route.id,
            label: route.label,
            icon: ROUTE_ICONS[route.id] || Heart,
            badge: ROUTE_BADGES[route.id],
          })),
      },
      {
        title: 'Account',
        items: user
          ? [
              ...nav.utility
                .filter(r => ['account', 'myTickets', 'rewards'].includes(r.id))
                .map(route => ({
                  id: route.id,
                  label: route.label,
                  icon: ROUTE_ICONS[route.id] || User,
                  badge: ROUTE_BADGES[route.id],
                })),
              // Add XP Profile link
              {
                id: 'xpProfile' as RouteId,
                label: 'XP Profile',
                icon: Zap,
                badge: undefined,
              },
              // Add Settings link
              {
                id: 'settings' as RouteId,
                label: 'Settings',
                icon: Settings,
                badge: undefined,
              },
              // Add Logout link
              {
                id: 'logout' as RouteId,
                label: 'Logout',
                icon: LogOut,
                badge: undefined,
              },
            ]
          : [
              { id: 'login' as RouteId, label: 'Login', icon: LogIn, badge: undefined },
              { id: 'register' as RouteId, label: 'Register', icon: User, badge: undefined },
            ],
      },
      {
        title: 'Admin',
        items: [
          ...nav.admin.map(route => ({
            id: route.id,
            label: route.label,
            icon: ROUTE_ICONS[route.id] || Settings,
            badge: ROUTE_BADGES[route.id],
          })),
        ],
      },
      {
        title: 'System',
        items: nav.utility
          .filter(r => ['legal'].includes(r.id))
          .map(route => ({
            id: route.id,
            label: route.label,
            icon: ROUTE_ICONS[route.id] || Shield,
            badge: ROUTE_BADGES[route.id],
          })),
      },
    ].filter(section => section.items.length > 0); // Remove empty sections
  }, [user, itemCount]);

  return (
    <>
      {/* Mobile Header - Fixed Top - Editorial */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-brutal">
        <div className="flex items-center justify-between px-6 h-20">
          {/* Logo */}
          <motion.button
            onClick={() => onNavigate('home')}
            className="flex-shrink-0"
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-white uppercase tracking-[-0.04em] leading-none" style={{ fontWeight: 700, fontSize: '26px' }}>
              HOTMESS
            </span>
          </motion.button>

          {/* Utility Icons */}
          <div className="flex items-center gap-3">
            {/* Live Radio Button */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className={`p-2 transition-all ${
                isPlaying 
                  ? 'bg-hotmess-red text-white' 
                  : 'hover:bg-white/5 text-white'
              } disabled:opacity-50`}
              aria-label={isPlaying ? 'Pause Radio' : 'Listen Live'}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Radio className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={() => onNavigate('search')}
              className="p-2 hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('shopCart')}
              className="relative p-2 hover:bg-white/5 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-hotmess-red text-white text-[11px] leading-[18px] text-center"
                  style={{ fontWeight: 700 }}
                >
                  {itemCount}
                </span>
              )}
            </button>
            
            <NotificationBadge onClick={() => onNavigate('notifications')} />

            {/* Menu Toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative w-11 h-11 border border-brutal hover:border-brutal-strong transition-all flex items-center justify-center ml-2"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-white" strokeWidth={2} />
              ) : (
                <Menu size={20} className="text-white" strokeWidth={2} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Full-Screen Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 top-20 bg-black z-40 overflow-y-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                {navSections.map((section, sectionIndex) => (
                  <motion.div 
                    key={section.title}
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
                  >
                    {/* Section Title */}
                    <div className="mb-4 pb-3 border-b border-brutal">
                      <h3 className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 600, fontSize: '12px' }}>
                        {section.title}
                      </h3>
                    </div>

                    {/* Section Items */}
                    <div className="space-y-2">
                      {section.items.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        
                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => {
                              onNavigate(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full group relative overflow-hidden transition-all border ${
                              isActive 
                                ? 'bg-white border-white' 
                                : 'bg-transparent border-brutal hover:border-brutal-strong'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (i * 0.05) }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4 px-5 py-4">
                              <Icon 
                                size={24} 
                                className={isActive ? 'text-black' : 'text-white'}
                                strokeWidth={1.5}
                              />
                              <div className="flex-1 text-left">
                                <div 
                                  className={`uppercase tracking-wide ${isActive ? 'text-black' : 'text-white'}`}
                                  style={{ fontWeight: 600, fontSize: '15px' }}
                                >
                                  {item.label}
                                </div>
                              </div>
                              {item.badge && (
                                <span className="px-2 py-1 bg-hotmess-red text-white uppercase tracking-wider" style={{ fontWeight: 600, fontSize: '12px' }}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}

                {/* Mobile Footer Stats */}
                <motion.div 
                  className="mt-12 pt-8 border-t border-brutal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl text-white mb-1" style={{ fontWeight: 700 }}>12</div>
                      <div className="text-xs text-white/40 uppercase tracking-wider" style={{ fontWeight: 500 }}>Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl text-white mb-1" style={{ fontWeight: 700 }}>2.8K</div>
                      <div className="text-xs text-white/40 uppercase tracking-wider" style={{ fontWeight: 500 }}>XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl text-white mb-1" style={{ fontWeight: 700 }}>7</div>
                      <div className="text-xs text-white/40 uppercase tracking-wider" style={{ fontWeight: 500 }}>Streak</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar - Editorial */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-80 bg-black border-r border-brutal flex-col">
        {/* Logo Section */}
        <div className="p-8 border-b border-brutal">
          <motion.button
            onClick={() => onNavigate('home')}
            className="group w-full"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="text-white uppercase tracking-[-0.05em] leading-none text-left" style={{ fontWeight: 700, fontSize: '38px' }}>
              HOTMESS
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="text-white/50 uppercase tracking-wider text-xs" style={{ fontWeight: 600 }}>
                LONDON
              </div>
              <div className="w-1.5 h-1.5 bg-hotmess-red" />
            </div>
          </motion.button>

          {/* Quick Stats */}
          <div className="mt-6 p-5 glass-strong">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/40 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>Your Stats</span>
              <Zap size={14} className="text-hotmess-red" strokeWidth={1.5} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>12</div>
                <div className="text-xs text-white/40 uppercase" style={{ fontWeight: 500 }}>LVL</div>
              </div>
              <div>
                <div className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>2.8K</div>
                <div className="text-xs text-white/40 uppercase" style={{ fontWeight: 500 }}>XP</div>
              </div>
              <div>
                <div className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>7D</div>
                <div className="text-xs text-white/40 uppercase" style={{ fontWeight: 500 }}>Streak</div>
              </div>
            </div>
          </div>

          {/* Live Radio CTA */}
          <motion.button
            onClick={togglePlay}
            disabled={isLoading}
            className={`mt-4 w-full h-14 flex items-center justify-center gap-2 uppercase tracking-wider transition-all disabled:opacity-50 ${
              isPlaying
                ? 'bg-white text-black border border-white'
                : 'bg-transparent text-white border border-brutal hover:bg-white/5'
            }`}
            style={{ fontWeight: 600 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-current/30 border-t-current animate-spin" />
                <span>Loading...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause size={18} fill="currentColor" />
                <span>Now Playing</span>
              </>
            ) : (
              <>
                <Radio size={18} />
                <span>Listen Live</span>
              </>
            )}
          </motion.button>
        </div>
          
        {/* Navigation Sections - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-6">
          {navSections.map((section, sectionIndex) => (
            <motion.div 
              key={section.title}
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
            >
              {/* Section Title */}
              <div className="mb-3 px-1">
                <h3 className="text-white/40 uppercase tracking-wider text-xs" style={{ fontWeight: 600 }}>
                  {section.title}
                </h3>
              </div>

              {/* Section Items */}
              <div className="space-y-1.5">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full group relative overflow-hidden transition-all border ${
                        isActive 
                          ? 'bg-white border-white' 
                          : 'bg-transparent border-brutal hover:border-brutal-strong hover:bg-white/[0.02]'
                      }`}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (i * 0.03) }}
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <Icon 
                          size={20} 
                          className={isActive ? 'text-black' : 'text-white'}
                          strokeWidth={1.5}
                        />
                        <div className="flex-1 text-left">
                          <div 
                            className={`uppercase tracking-wide ${isActive ? 'text-black' : 'text-white'}`}
                            style={{ fontWeight: 600, fontSize: '12px' }}
                          >
                            {item.label}
                          </div>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-hotmess-red text-white text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </nav>

        {/* Footer CTA */}
        <div className="p-6 border-t border-brutal">
          <button 
            className="w-full bg-white hover:bg-white/90 text-black transition-all h-14 uppercase tracking-wider group"
            style={{ fontWeight: 600 }}
            onClick={() => onNavigate('shop')}
          >
            <span className="group-hover:tracking-widest inline-block transition-all">Shop RAW →</span>
          </button>
        </div>
      </div>
    </>
  );
}