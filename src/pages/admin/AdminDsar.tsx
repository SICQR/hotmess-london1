/**
 * Admin DSAR - Data Subject Access Requests (GDPR compliance)
 */

import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { 
  FileText, 
  Download,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { SUPABASE_URL } from '../../lib/env';
import { getAccessTokenAsync } from '../../lib/auth';

interface AdminDsarProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface DsarRequest {
  id: string;
  userId: string;
  type: 'export' | 'delete' | 'rectify';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  completedAt?: string;
  notes: string;
  userEmail?: string;
}

export function AdminDsar({ onNavigate }: AdminDsarProps) {
  const [requests, setRequests] = useState<DsarRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setActionError(null);

    try {
      const token = await getAccessTokenAsync();
      if (!token) {
        setRequests([]);
        setActionError('You must be signed in as an admin to view DSAR requests.');
        return;
      }

      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/make-server-a670c824/privacy/admin/dsar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Failed to load DSAR requests');
      }

      const list = Array.isArray(data?.requests) ? (data.requests as DsarRequest[]) : [];
      setRequests(list);
    } catch (err: any) {
      setRequests([]);
      setActionError(err?.message || 'Failed to load DSAR requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesType = filterType === 'all' || req.type === filterType;
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'export': return <Download size={16} />;
      case 'delete': return <Trash2 size={16} />;
      case 'rectify': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'export': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delete': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'rectify': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'processing': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-white/60';
    }
  };

  const updateStatus = async (requestId: string, status: 'processing' | 'completed' | 'rejected') => {
    setActionError(null);
    setActionLoading(requestId);
    try {
      const token = await getAccessTokenAsync();
      if (!token) {
        setActionError('You must be signed in as an admin to perform this action.');
        return;
      }

      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/make-server-a670c824/privacy/admin/dsar/${encodeURIComponent(requestId)}/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Failed to update status');
      }

      await loadRequests();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleProcess = (requestId: string) => updateStatus(requestId, 'processing');
  const handleComplete = (requestId: string) => updateStatus(requestId, 'completed');

  const handleExecuteDelete = async (requestId: string) => {
    setActionError(null);
    setActionLoading(requestId);
    try {
      const token = await getAccessTokenAsync();
      if (!token) {
        setActionError('You must be signed in as an admin to perform this action.');
        return;
      }

      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/make-server-a670c824/privacy/admin/dsar/${encodeURIComponent(requestId)}/execute-delete`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Failed to execute deletion');
      }

      await loadRequests();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to execute deletion');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout currentRoute="adminDsar" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const processingCount = requests.filter(r => r.status === 'processing').length;

  return (
    <AdminLayout currentRoute="adminDsar" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            DSAR REQUESTS
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Data Subject Access Requests - GDPR Compliance
          </p>
        </div>

        {/* GDPR Info Banner */}
        <div className="bg-blue-500/10 border-2 border-blue-500 p-6 mb-8">
          <div className="flex items-start gap-4">
            <FileText className="text-blue-500 flex-shrink-0" size={32} />
            <div>
              <h3 className="text-blue-500 uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '16px' }}>
                GDPR Compliance Information
              </h3>
              <p className="text-white/80 mb-2" style={{ fontWeight: 400, fontSize: '14px' }}>
                All DSAR requests must be fulfilled within <strong>30 days</strong> of receipt (UK GDPR requirement).
              </p>
              <ul className="text-white/60 space-y-1" style={{ fontWeight: 400, fontSize: '13px' }}>
                <li>• <strong>Export:</strong> Provide all personal data held about the user</li>
                <li>• <strong>Delete:</strong> Remove all personal data (Right to be forgotten)</li>
                <li>• <strong>Rectify:</strong> Correct inaccurate personal data</li>
              </ul>
            </div>
          </div>
        </div>

        {actionError ? (
          <div className="bg-hot/10 border border-hot/30 p-4 mb-6">
            <p className="text-white/80 text-sm">{actionError}</p>
          </div>
        ) : null}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><FileText size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {requests.length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Requests
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><Clock size={20} /></span>
              <span className="text-yellow-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {pendingCount}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Pending
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><AlertTriangle size={20} /></span>
              <span className="text-blue-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {processingCount}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Processing
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><CheckCircle size={20} /></span>
              <span className="text-green-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {requests.filter(r => r.status === 'completed').length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Completed
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
                style={{ fontWeight: 400, fontSize: '14px' }}
              >
                <option value="all">All Types</option>
                <option value="export">Export</option>
                <option value="delete">Delete</option>
                <option value="rectify">Rectify</option>
              </select>
            </div>

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
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white/5 border border-white/10 hover:border-hot/50 transition-all p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-white/10">
                    {getTypeIcon(request.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '16px' }}>
                        {request.userEmail || request.userId}
                      </h3>
                      <span className={`px-3 py-1 border uppercase tracking-wider ${getTypeColor(request.type)}`} style={{ fontWeight: 700, fontSize: '10px' }}>
                        {request.type}
                      </span>
                      <span className={`uppercase tracking-wider ${getStatusColor(request.status)}`} style={{ fontWeight: 700, fontSize: '12px' }}>
                        {request.status}
                      </span>
                    </div>
                    <div className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '13px' }}>
                      {request.notes}
                    </div>
                    <div className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                      Requested: {request.createdAt}
                      {request.completedAt && ` • Completed: ${request.completedAt}`}
                    </div>
                  </div>
                </div>
              </div>

              {request.status !== 'completed' && request.status !== 'rejected' && (
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleProcess(request.id)}
                      disabled={actionLoading === request.id}
                      className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500 text-blue-400 px-4 py-2 uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontWeight: 700, fontSize: '12px' }}
                    >
                      <Clock size={14} />
                      {actionLoading === request.id ? 'Working…' : 'Start Processing'}
                    </button>
                  )}
                  {request.status === 'processing' && (
                    <>
                      {request.type === 'delete' && (
                        <button
                          onClick={() => handleExecuteDelete(request.id)}
                          disabled={actionLoading === request.id}
                          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500 text-red-400 px-4 py-2 uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontWeight: 700, fontSize: '12px' }}
                        >
                          <Trash2 size={14} />
                          {actionLoading === request.id ? 'Working…' : 'Execute Deletion'}
                        </button>
                      )}
                      <button
                        onClick={() => handleComplete(request.id)}
                        disabled={actionLoading === request.id}
                        className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500 text-green-400 px-4 py-2 uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontWeight: 700, fontSize: '12px' }}
                      >
                        <CheckCircle size={14} />
                        {actionLoading === request.id ? 'Working…' : 'Mark Complete'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <CheckCircle className="mx-auto mb-4 text-white/20" size={48} />
            <p className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              No DSAR requests found
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
