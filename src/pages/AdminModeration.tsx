/**
 * ADMIN MODERATION
 * Content moderation dashboard
 */

import { AdminLayout } from '../components/layouts/AdminLayout';
import { RouteId } from '../lib/routes';
import { Shield, AlertTriangle, Users, MessageSquare, Flag } from 'lucide-react';

interface AdminModerationProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function AdminModeration({ onNavigate }: AdminModerationProps) {
  return (
    <AdminLayout currentRoute="adminModeration" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            MODERATION DESK
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Review flagged content and moderate community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              PENDING REPORTS
            </div>
            <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px' }}>
              0
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              FLAGGED USERS
            </div>
            <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px' }}>
              0
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              FLAGGED POSTS
            </div>
            <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px' }}>
              0
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              RESOLVED (30D)
            </div>
            <div className="text-green-500" style={{ fontWeight: 900, fontSize: '32px' }}>
              0
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white/5 border border-white/10 p-12 text-center">
          <Shield className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="uppercase tracking-wider text-white mb-3" style={{ fontWeight: 900, fontSize: '24px' }}>
            MODERATION TOOLS COMING SOON
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-6" style={{ fontWeight: 400, fontSize: '14px' }}>
            Full content moderation dashboard with user reports, automated flagging, and community guidelines enforcement will be available here.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-3xl mx-auto text-left">
            <div className="bg-black border border-white/10 p-4">
              <Flag className="w-6 h-6 text-hot mb-3" />
              <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>REPORT QUEUE</h3>
              <p className="text-white/60" style={{ fontWeight: 400, fontSize: '12px' }}>
                Review user-submitted reports
              </p>
            </div>
            <div className="bg-black border border-white/10 p-4">
              <Users className="w-6 h-6 text-hot mb-3" />
              <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>USER MANAGEMENT</h3>
              <p className="text-white/60" style={{ fontWeight: 400, fontSize: '12px' }}>
                Warn, suspend, or ban users
              </p>
            </div>
            <div className="bg-black border border-white/10 p-4">
              <MessageSquare className="w-6 h-6 text-hot mb-3" />
              <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>CONTENT FILTER</h3>
              <p className="text-white/60" style={{ fontWeight: 400, fontSize: '12px' }}>
                Automated content screening
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
