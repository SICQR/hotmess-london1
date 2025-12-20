import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { Shield, AlertTriangle, CheckCircle, XCircle, Ban, AlertCircle, Eye, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AdminModerationProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface ModerationItem {
  id: string;
  type: 'profile' | 'post' | 'message' | 'image' | 'comment';
  content: string;
  context?: string;
  user_id: string;
  user_name: string;
  user_email: string;
  flagged_at: string;
  flag_reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  severity: 'low' | 'medium' | 'high' | 'critical';
  auto_flagged: boolean;
  review_count: number;
}

interface ModerationStats {
  pending: number;
  approved_today: number;
  rejected_today: number;
  avg_review_time: number;
}

export function AdminModeration({ onNavigate }: AdminModerationProps) {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    pending: 0,
    approved_today: 0,
    rejected_today: 0,
    avg_review_time: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'high'>('pending');
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);

  useEffect(() => {
    loadModerationQueue();
  }, []);

  const loadModerationQueue = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/admin`;
      const response = await fetch(`${API_BASE}/moderation/queue`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load moderation queue');
      }

      const data = await response.json();
      setItems(data.items || []);
      setStats(data.stats || stats);
      setLoading(false);

    } catch (err) {
      console.error('Error loading moderation queue:', err);
      setError(err instanceof Error ? err.message : 'Failed to load queue');
      setLoading(false);
    }
  };

  const handleAction = async (itemId: string, action: 'approve' | 'reject' | 'ban_user') => {
    try {
      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/admin`;
      const response = await fetch(`${API_BASE}/moderation/action`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Action failed');
      }

      // Remove from queue or update status
      setItems(items.filter(item => item.id !== itemId));
      setSelectedItem(null);

      // Refresh stats
      loadModerationQueue();

    } catch (err) {
      console.error('Error performing action:', err);
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'pending') return item.status === 'pending';
    if (filter === 'high') return item.severity === 'high' || item.severity === 'critical';
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 border-red-500/50 bg-red-500/10';
      case 'high': return 'text-orange-500 border-orange-500/50 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      default: return 'text-white/60 border-white/20 bg-white/5';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'profile': return Shield;
      case 'post': return MessageSquare;
      case 'message': return MessageSquare;
      case 'image': return ImageIcon;
      default: return AlertCircle;
    }
  };

  if (loading) {
    return (
      <AdminLayout currentRoute="adminModeration" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentRoute="adminModeration" onNavigate={onNavigate}>
        <ErrorState message={error} onRetry={loadModerationQueue} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentRoute="adminModeration" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-white uppercase mb-2"
            style={{ fontWeight: 900, fontSize: '48px', lineHeight: '1', letterSpacing: '-0.02em' }}
          >
            Moderation Desk
          </h1>
          <p 
            className="text-white/60 uppercase"
            style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em' }}
          >
            Content moderation and user safety
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
                Pending Review
              </p>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.pending}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
                Approved Today
              </p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.approved_today}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
                Rejected Today
              </p>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.rejected_today}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
                Avg Review Time
              </p>
              <Shield className="w-5 h-5 text-hot" />
            </div>
            <p className="text-white" style={{ fontWeight: 900, fontSize: '32px' }}>
              {stats.avg_review_time}m
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 uppercase transition-all ${
              filter === 'all'
                ? 'bg-hot text-black'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
            style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 uppercase transition-all ${
              filter === 'pending'
                ? 'bg-hot text-black'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
            style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}
          >
            Pending Only
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 uppercase transition-all ${
              filter === 'high'
                ? 'bg-hot text-black'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
            style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}
          >
            High Priority
          </button>
        </div>

        {/* Moderation Queue */}
        {filteredItems.length === 0 ? (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-white/40" />
            <p className="text-white mb-2" style={{ fontWeight: 600, fontSize: '16px' }}>
              No items to review
            </p>
            <p className="text-white/60" style={{ fontWeight: 400, fontSize: '14px' }}>
              All content has been moderated
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const Icon = getTypeIcon(item.type);
              return (
                <div
                  key={item.id}
                  className={`bg-white/5 border transition-all p-6 ${
                    selectedItem?.id === item.id ? 'border-hot' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    {/* Icon & Type */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 flex items-center justify-center border ${getSeverityColor(item.severity)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span 
                              className={`px-2 py-1 uppercase border ${getSeverityColor(item.severity)}`}
                              style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}
                            >
                              {item.severity}
                            </span>
                            <span 
                              className="text-white/60 uppercase"
                              style={{ fontWeight: 600, fontSize: '11px' }}
                            >
                              {item.type}
                            </span>
                            {item.auto_flagged && (
                              <span 
                                className="text-yellow-500 uppercase"
                                style={{ fontWeight: 600, fontSize: '11px' }}
                              >
                                Auto-Flagged
                              </span>
                            )}
                          </div>
                          <p className="text-white mb-1" style={{ fontWeight: 600, fontSize: '14px' }}>
                            {item.user_name} ({item.user_email})
                          </p>
                          {item.flag_reason && (
                            <p className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '13px' }}>
                              Reason: {item.flag_reason}
                            </p>
                          )}
                        </div>

                        <span className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                          {new Date(item.flagged_at).toLocaleString()}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <div className="bg-black/50 border border-white/10 p-4 mb-4">
                        <p className="text-white" style={{ fontWeight: 400, fontSize: '14px', lineHeight: '1.5' }}>
                          {item.content}
                        </p>
                        {item.context && (
                          <p className="text-white/40 mt-2" style={{ fontWeight: 400, fontSize: '12px' }}>
                            Context: {item.context}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAction(item.id, 'approve')}
                          className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/50 transition-all uppercase flex items-center gap-2"
                          style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>

                        <button
                          onClick={() => handleAction(item.id, 'reject')}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 transition-all uppercase flex items-center gap-2"
                          style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>

                        <button
                          onClick={() => handleAction(item.id, 'ban_user')}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all uppercase flex items-center gap-2"
                          style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}
                        >
                          <Ban className="w-4 h-4" />
                          Ban User
                        </button>

                        <button
                          onClick={() => onNavigate('adminUsers')}
                          className="ml-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all uppercase flex items-center gap-2"
                          style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}
                        >
                          <Eye className="w-4 h-4" />
                          View User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
