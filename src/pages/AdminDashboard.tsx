/**
 * Admin Dashboard - Central hub for all admin functions
 */

import { motion } from 'motion/react';
import { 
  Settings, 
  Upload, 
  Shield, 
  Users, 
  Package, 
  TrendingUp,
  AlertCircle,
  Zap,
  Globe
} from 'lucide-react';
import { RouteId } from '../lib/routes';
import { useAuth } from '../contexts/AuthContext';

interface AdminDashboardProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();

  const adminSections = [
    {
      title: 'Overview & Analytics',
      icon: <TrendingUp className="text-hot" size={32} />,
      links: [
        { label: 'Admin Overview', route: 'adminOverview' as RouteId, description: 'Platform metrics, stats & action queues' },
        { label: 'Audit Logs', route: 'adminAudit' as RouteId, description: 'System activity tracking and security logs' },
      ],
    },
    {
      title: 'User Management',
      icon: <Users className="text-hot" size={32} />,
      links: [
        { label: 'Manage Users', route: 'adminUsers' as RouteId, description: 'View, edit, ban users and manage roles' },
        { label: 'DSAR Requests', route: 'adminDsar' as RouteId, description: 'GDPR data export & deletion requests' },
      ],
    },
    {
      title: 'Commerce & Products',
      icon: <Package className="text-hot" size={32} />,
      links: [
        { label: 'Shop Products', route: 'adminProducts' as RouteId, description: 'Manage Shopify products across all collections' },
        { label: 'Orders', route: 'adminOrders' as RouteId, description: 'View and manage all platform orders' },
        { label: 'Market Sellers', route: 'adminMarketSellers' as RouteId, description: 'Approve and manage MessMarket sellers' },
      ],
    },
    {
      title: 'Content & Radio',
      icon: <Upload className="text-hot" size={32} />,
      links: [
        { label: 'Radio Management', route: 'adminContent' as RouteId, description: 'Manage shows, schedule & RadioKing integration' },
        { label: 'Upload Records', route: 'adminRecordsUpload' as RouteId, description: 'Upload MP3s and cover art for RAW Convict' },
        { label: 'View Releases', route: 'records' as RouteId, description: 'Browse all records and releases' },
      ],
    },
    {
      title: 'Moderation & Safety',
      icon: <Shield className="text-hot" size={32} />,
      links: [
        { label: 'Reports Queue', route: 'adminReports' as RouteId, description: 'Review user reports and moderate content' },
        { label: 'Moderation Desk', route: 'adminModeration' as RouteId, description: 'Content moderation and user safety' },
      ],
    },
    {
      title: 'Beacons & Map',
      icon: <Zap className="text-hot" size={32} />,
      links: [
        { label: 'Beacon Management', route: 'adminBeacons' as RouteId, description: 'Manage all beacons and locations' },
        { label: 'Globe View', route: 'earth' as RouteId, description: 'View beacons on 3D globe' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 py-12 border-b border-hot/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-hot" size={48} />
            <div>
              <h1 className="uppercase tracking-[-0.04em] text-white" style={{ fontWeight: 900, fontSize: 'clamp(32px, 6vw, 64px)' }}>
                Admin Dashboard
              </h1>
              <p className="text-white/60 uppercase tracking-wider mt-2" style={{ fontWeight: 700, fontSize: '14px' }}>
                Welcome back, {user?.displayName || user?.email}
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white/5 border border-white/10 p-4 inline-block">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-hot rounded-full animate-pulse" />
              <span className="text-white/80 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
                Admin Access Active
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 md:px-8 lg:px-12 py-8 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value="1,247" icon={<Users size={20} />} />
          <StatCard label="Active Beacons" value="89" icon={<Zap size={20} />} />
          <StatCard label="Records" value="34" icon={<Package size={20} />} />
          <StatCard label="Pending Reports" value="7" icon={<AlertCircle size={20} />} />
        </div>
      </section>

      {/* Admin Sections */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 hover:border-hot/50 transition-all p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '18px' }}>
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3">
                {section.links.map(link => (
                  <button
                    key={link.route}
                    onClick={() => onNavigate(link.route)}
                    className="w-full text-left bg-white/5 hover:bg-hot/20 border border-white/10 hover:border-hot p-4 transition-all group"
                  >
                    <div className="text-white uppercase tracking-wider mb-1 group-hover:text-hot transition-colors" style={{ fontWeight: 700, fontSize: '14px' }}>
                      {link.label}
                    </div>
                    <div className="text-white/50 text-sm" style={{ fontWeight: 400 }}>
                      {link.description}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DEV TOOL: Make yourself admin */}
      {user && user.role !== 'admin' && (
        <section className="px-4 md:px-8 lg:px-12 py-8">
          <div className="bg-yellow-500/10 border-2 border-yellow-500 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-yellow-500 flex-shrink-0" size={32} />
              <div className="flex-1">
                <h3 className="text-yellow-500 uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '16px' }}>
                  DEV TOOL: Set Admin Role
                </h3>
                <p className="text-white/80 mb-4" style={{ fontWeight: 400, fontSize: '14px' }}>
                  Your current role: <strong>{user.role || 'user'}</strong>
                </p>
                <p className="text-white/60 mb-4" style={{ fontWeight: 400, fontSize: '13px' }}>
                  To access admin features, you need to set your role to "admin" in your user metadata.
                  Run this in the browser console:
                </p>
                <pre className="bg-black p-4 text-green-400 overflow-x-auto text-xs mb-4">
{`// Open browser console (F12) and run:
localStorage.setItem('hotmess_admin_override', 'true');
window.location.reload();`}
                </pre>
                <button
                  onClick={() => {
                    localStorage.setItem('hotmess_admin_override', 'true');
                    window.location.reload();
                  }}
                  className="bg-yellow-500 text-black px-6 py-3 uppercase tracking-wider hover:bg-yellow-400 transition-all"
                  style={{ fontWeight: 900, fontSize: '13px' }}
                >
                  Enable Admin Mode (DEV)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/40">{icon}</span>
        <span className="text-hot uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '24px' }}>
          {value}
        </span>
      </div>
      <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
        {label}
      </div>
    </div>
  );
}