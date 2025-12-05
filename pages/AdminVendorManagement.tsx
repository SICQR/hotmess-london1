import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Check, X, Mail, ExternalLink, Calendar, User } from 'lucide-react';
import { RouteId } from '../lib/routes';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/vendor`;

interface VendorApplication {
  id: string;
  userId: string | null;
  email: string;
  displayName: string;
  bio: string | null;
  portfolioUrl: string | null;
  instagramHandle: string | null;
  referralSource: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  admin_notes: string | null;
}

interface AdminVendorManagementProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function AdminVendorManagement({ onNavigate }: AdminVendorManagementProps) {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, [filter]);

  async function loadApplications() {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/applications`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load applications');
      }

      const data = await response.json();
      let apps = data.applications || [];

      // Filter client-side
      if (filter !== 'all') {
        apps = apps.filter((app: VendorApplication) => app.status === filter);
      }

      setApplications(apps);
    } catch (error) {
      console.error('Error loading vendor applications:', error);
      toast.error('Failed to load vendor applications');
    } finally {
      setLoading(false);
    }
  }

  async function updateApplicationStatus(
    email: string,
    status: 'approved' | 'rejected',
    adminNotes?: string
  ) {
    try {
      const response = await fetch(`${API_BASE}/applications/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          status,
          adminNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      toast.success(`Application ${status}!`);
      loadApplications();
      setSelectedApp(null);
      return true;
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
      return false;
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-8 py-12 border-b border-hotmess-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => onNavigate('admin')}
              className="text-hotmess-gray-400 hover:text-white transition-colors"
            >
              ← Admin Dashboard
            </button>
          </div>

          <h1 className="text-white mb-2" style={{ fontWeight: 900 }}>
            Vendor Applications
          </h1>
          <div className="h-1 w-24 bg-hotmess-red mb-6" />
          <p className="text-hotmess-gray-400">
            Review and approve vendor applications for MessMarket.
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="px-8 py-8 border-b border-hotmess-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-hotmess-gray-900 border-2 border-hotmess-gray-800 p-6">
              <div className="text-3xl text-white mb-2" style={{ fontWeight: 900 }}>
                {stats.total}
              </div>
              <div className="text-hotmess-gray-400 text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Total
              </div>
            </div>

            <div className="bg-hotmess-gray-900 border-2 border-hotmess-purple p-6">
              <div className="text-3xl text-hotmess-purple mb-2" style={{ fontWeight: 900 }}>
                {stats.pending}
              </div>
              <div className="text-hotmess-gray-400 text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Pending
              </div>
            </div>

            <div className="bg-hotmess-gray-900 border-2 border-green-500/30 p-6">
              <div className="text-3xl text-green-500 mb-2" style={{ fontWeight: 900 }}>
                {stats.approved}
              </div>
              <div className="text-hotmess-gray-400 text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Approved
              </div>
            </div>

            <div className="bg-hotmess-gray-900 border-2 border-hotmess-gray-800 p-6">
              <div className="text-3xl text-hotmess-gray-500 mb-2" style={{ fontWeight: 900 }}>
                {stats.rejected}
              </div>
              <div className="text-hotmess-gray-400 text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Rejected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-8 py-6 border-b border-hotmess-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 uppercase tracking-wider text-sm transition-all ${
                  filter === status
                    ? 'bg-hotmess-red text-black'
                    : 'bg-hotmess-gray-900 text-hotmess-gray-400 hover:text-white border border-hotmess-gray-700'
                }`}
                style={{ fontWeight: 700 }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Applications List */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-hotmess-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-hotmess-gray-400">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-hotmess-gray-700 mx-auto mb-4" />
              <p className="text-hotmess-gray-400">No {filter !== 'all' ? filter : ''} applications found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-hotmess-gray-900 border-2 border-hotmess-gray-800 hover:border-hotmess-red transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white" style={{ fontWeight: 900 }}>
                            {app.displayName}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs uppercase tracking-wider ${
                              app.status === 'pending'
                                ? 'bg-hotmess-purple/20 text-hotmess-purple border border-hotmess-purple/30'
                                : app.status === 'approved'
                                ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                : 'bg-hotmess-gray-800 text-hotmess-gray-500 border border-hotmess-gray-700'
                            }`}
                            style={{ fontWeight: 700 }}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-hotmess-gray-400 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <a
                              href={`mailto:${app.email}`}
                              className="hover:text-hotmess-red transition-colors"
                            >
                              {app.email}
                            </a>
                          </div>

                          {app.instagramHandle && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <a
                                href={`https://instagram.com/${app.instagramHandle.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-hotmess-red transition-colors"
                              >
                                {app.instagramHandle}
                              </a>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(app.created_at).toLocaleDateString()}</span>
                          </div>

                          {app.referralSource && (
                            <span className="text-hotmess-purple">
                              via {app.referralSource}
                            </span>
                          )}
                        </div>

                        {app.bio && (
                          <p className="text-hotmess-gray-400 mb-3 line-clamp-2">{app.bio}</p>
                        )}

                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-hotmess-red hover:underline text-sm flex items-center gap-2"
                          >
                            View Portfolio
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {app.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => updateApplicationStatus(app.email, 'approved')}
                            className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition-colors flex items-center gap-2"
                            style={{ fontWeight: 700 }}
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>

                          <button
                            onClick={() => updateApplicationStatus(app.email, 'rejected')}
                            className="bg-hotmess-gray-800 text-hotmess-gray-400 border border-hotmess-gray-700 px-4 py-2 hover:bg-hotmess-gray-700 transition-colors flex items-center gap-2"
                            style={{ fontWeight: 700 }}
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                    {app.admin_notes && (
                      <div className="pt-4 border-t border-hotmess-gray-800">
                        <p className="text-xs text-hotmess-gray-500 mb-1" style={{ fontWeight: 700 }}>
                          Admin Notes:
                        </p>
                        <p className="text-sm text-hotmess-gray-400">{app.admin_notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}