/**
 * Admin Audit - System audit logs and activity tracking
 */

import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { 
  Activity, 
  Filter,
  Download,
  RefreshCw,
  User,
  Shield,
  Package,
  DollarSign,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';

interface AdminAuditProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
}

export function AdminAudit({ onNavigate }: AdminAuditProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setLogs([
        {
          id: '1',
          timestamp: '2024-12-03 14:32:15',
          user: 'admin@hotmess.london',
          action: 'USER_BANNED',
          resource: 'User: spammer123',
          details: 'Banned user for repeated spam violations',
          ipAddress: '192.168.1.1',
          status: 'success'
        },
        {
          id: '2',
          timestamp: '2024-12-03 14:28:43',
          user: 'moderator@hotmess.london',
          action: 'REPORT_REVIEWED',
          resource: 'Report #4521',
          details: 'Reviewed and resolved spam report',
          ipAddress: '192.168.1.2',
          status: 'success'
        },
        {
          id: '3',
          timestamp: '2024-12-03 14:15:22',
          user: 'admin@hotmess.london',
          action: 'PRODUCT_CREATED',
          resource: 'Product: CONVICT TEE',
          details: 'Created new product in RAW collection',
          ipAddress: '192.168.1.1',
          status: 'success'
        },
        {
          id: '4',
          timestamp: '2024-12-03 13:45:18',
          user: 'system',
          action: 'FAILED_LOGIN',
          resource: 'Login attempt from suspicious IP',
          details: 'Multiple failed login attempts detected',
          ipAddress: '185.220.101.5',
          status: 'failed'
        },
        {
          id: '5',
          timestamp: '2024-12-03 13:22:09',
          user: 'admin@hotmess.london',
          action: 'BEACON_APPROVED',
          resource: 'Beacon: Club FIRE',
          details: 'Approved new beacon application',
          ipAddress: '192.168.1.1',
          status: 'success'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesAction && matchesStatus;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('USER')) return <User size={16} />;
    if (action.includes('REPORT')) return <Shield size={16} />;
    if (action.includes('PRODUCT') || action.includes('BEACON')) return <Package size={16} />;
    if (action.includes('ORDER')) return <DollarSign size={16} />;
    if (action.includes('LOGIN')) return <AlertTriangle size={16} />;
    return <Activity size={16} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-white/60';
    }
  };

  if (loading) {
    return (
      <AdminLayout currentRoute="adminAudit" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <AdminLayout currentRoute="adminAudit" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
              AUDIT LOGS
            </h1>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              System activity tracking and security audit trail
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadLogs()}
              className="bg-white/10 hover:bg-hot/20 border border-white/20 hover:border-hot text-white px-4 py-3 uppercase tracking-wider transition-all flex items-center gap-2"
              style={{ fontWeight: 700, fontSize: '13px' }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => alert('Export logs to CSV')}
              className="bg-hot hover:bg-white text-white hover:text-black px-4 py-3 uppercase tracking-wider transition-all flex items-center gap-2"
              style={{ fontWeight: 900, fontSize: '13px' }}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><Activity size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {logs.length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Events
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><Activity size={20} /></span>
              <span className="text-green-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {logs.filter(l => l.status === 'success').length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Successful
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><AlertTriangle size={20} /></span>
              <span className="text-red-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {logs.filter(l => l.status === 'failed').length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Failed
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><User size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {[...new Set(logs.map(l => l.user))].length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Active Users
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action Filter */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Filter by Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
                style={{ fontWeight: 400, fontSize: '14px' }}
              >
                <option value="all">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
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
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-black border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Timestamp
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  User
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Action
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Resource
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  IP Address
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-white/80 font-mono" style={{ fontSize: '12px' }}>
                      {log.timestamp}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-white/40" />
                      <span className="text-white/80" style={{ fontWeight: 400, fontSize: '13px' }}>
                        {log.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-white uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white" style={{ fontWeight: 700, fontSize: '13px' }}>
                        {log.resource}
                      </div>
                      <div className="text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
                        {log.details}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/60 font-mono" style={{ fontSize: '12px' }}>
                      {log.ipAddress}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`uppercase tracking-wider ${getStatusColor(log.status)}`} style={{ fontWeight: 700, fontSize: '12px' }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="mx-auto mb-4 text-white/20" size={48} />
              <p className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
                No audit logs found
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}