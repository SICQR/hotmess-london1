/**
 * Admin Reports - User reports and moderation queue
 */

import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { 
  AlertTriangle, 
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Trash2,
  MessageSquare,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AdminReportsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Report {
  id: string;
  type: 'user' | 'post' | 'message' | 'listing';
  reason: string;
  reportedBy: string;
  reportedItem: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  description: string;
}

export function AdminReports({ onNavigate }: AdminReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(false);

      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/admin`;
      const response = await fetch(`${API_BASE}/moderation/queue`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load reports');
      }

      const data = await response.json();
      setReports(data.items || []);
      setLoading(false);

    } catch (err) {
      console.error('Load reports error:', err);
      setError(true);
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User size={16} />;
      case 'post': return <MessageSquare size={16} />;
      case 'message': return <MessageSquare size={16} />;
      case 'listing': return <ImageIcon size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'reviewed': return 'text-blue-500';
      case 'resolved': return 'text-green-500';
      case 'dismissed': return 'text-white/40';
      default: return 'text-white/60';
    }
  };

  const handleResolve = (reportId: string) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: 'resolved' as const } : r
    ));
  };

  const handleDismiss = (reportId: string) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: 'dismissed' as const } : r
    ));
  };

  if (loading) {
    return (
      <AdminLayout currentRoute="adminReports" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentRoute="adminReports" onNavigate={onNavigate}>
        <ErrorState />
      </AdminLayout>
    );
  }

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const highPriorityCount = reports.filter(r => r.priority === 'high' && r.status === 'pending').length;

  return (
    <AdminLayout currentRoute="adminReports" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            REPORTS & MODERATION
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Review user reports and moderate content
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><AlertTriangle size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {reports.length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Reports
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><AlertTriangle size={20} /></span>
              <span className="text-yellow-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {pendingCount}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Pending Review
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><AlertTriangle size={20} /></span>
              <span className="text-red-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {highPriorityCount}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              High Priority
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><CheckCircle size={20} /></span>
              <span className="text-green-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {reports.filter(r => r.status === 'resolved').length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Resolved
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
                style={{ fontWeight: 400, fontSize: '14px' }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Filter by Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
                style={{ fontWeight: 400, fontSize: '14px' }}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white/5 border border-white/10 hover:border-hot/50 transition-all p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-white/10">
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '16px' }}>
                        {report.reportedItem}
                      </h3>
                      <span className={`px-3 py-1 border uppercase tracking-wider ${getPriorityColor(report.priority)}`} style={{ fontWeight: 700, fontSize: '10px' }}>
                        {report.priority}
                      </span>
                      <span className={`uppercase tracking-wider ${getStatusColor(report.status)}`} style={{ fontWeight: 700, fontSize: '12px' }}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '14px' }}>
                      <strong>Reason:</strong> {report.reason}
                    </div>
                    <div className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '13px' }}>
                      {report.description}
                    </div>
                    <div className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                      Reported by <strong>{report.reportedBy}</strong> • {report.createdAt}
                    </div>
                  </div>
                </div>
              </div>

              {report.status === 'pending' && (
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => alert('View details for report: ' + report.id)}
                    className="bg-white/10 hover:bg-hot/20 border border-white/20 hover:border-hot text-white px-4 py-2 uppercase tracking-wider transition-all flex items-center gap-2"
                    style={{ fontWeight: 700, fontSize: '12px' }}
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  <button
                    onClick={() => handleResolve(report.id)}
                    className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500 text-green-400 px-4 py-2 uppercase tracking-wider transition-all flex items-center gap-2"
                    style={{ fontWeight: 700, fontSize: '12px' }}
                  >
                    <CheckCircle size={14} />
                    Resolve
                  </button>
                  <button
                    onClick={() => handleDismiss(report.id)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white/60 px-4 py-2 uppercase tracking-wider transition-all flex items-center gap-2"
                    style={{ fontWeight: 700, fontSize: '12px' }}
                  >
                    <XCircle size={14} />
                    Dismiss
                  </button>
                  <button
                    onClick={() => alert('Ban user flow')}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500 text-red-400 px-4 py-2 uppercase tracking-wider transition-all flex items-center gap-2"
                    style={{ fontWeight: 700, fontSize: '12px' }}
                  >
                    <Ban size={14} />
                    Ban User
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <CheckCircle className="mx-auto mb-4 text-white/20" size={48} />
            <p className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              No reports found
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}