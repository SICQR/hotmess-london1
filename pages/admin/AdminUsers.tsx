/**
 * Admin Users - User management dashboard
 */

import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { 
  Users, 
  Search, 
  Shield, 
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  User
} from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AdminUsersProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface UserType {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'seller' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastActive: string;
  xp: number;
  orderCount: number;
  listingsCount: number;
}

export function AdminUsers({ onNavigate }: AdminUsersProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(false);

      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/admin`;
      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setLoading(false);

    } catch (err) {
      console.error('Load users error:', err);
      setError(true);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'seller': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'moderator': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="text-green-500" size={16} />;
      case 'suspended': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'banned': return <XCircle className="text-red-500" size={16} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout currentRoute="adminUsers" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentRoute="adminUsers" onNavigate={onNavigate}>
        <ErrorState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentRoute="adminUsers" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
              USER MANAGEMENT
            </h1>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              {filteredUsers.length} users • {users.filter(u => u.status === 'active').length} active
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Users
            </div>
            <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px' }}>
              {users.length}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              Active Sellers
            </div>
            <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px' }}>
              {users.filter(u => u.role === 'seller' && u.status === 'active').length}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              Admins
            </div>
            <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px' }}>
              {users.filter(u => u.role === 'admin').length}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              Banned
            </div>
            <div className="text-red-500" style={{ fontWeight: 900, fontSize: '32px' }}>
              {users.filter(u => u.status === 'banned').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Email or display name..."
                  className="w-full bg-black border border-white/20 text-white pl-10 pr-4 py-3 focus:border-hot outline-none"
                  style={{ fontWeight: 400, fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
                style={{ fontWeight: 400, fontSize: '14px' }}
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
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
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-black border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  User
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Role
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Status
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  XP
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Orders
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Last Active
                </th>
                <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white" style={{ fontWeight: 700, fontSize: '14px' }}>
                        {user.displayName}
                      </div>
                      <div className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 border uppercase tracking-wider ${getRoleColor(user.role)}`} style={{ fontWeight: 700, fontSize: '11px' }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className="text-white/80 capitalize" style={{ fontWeight: 400, fontSize: '13px' }}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-hot" style={{ fontWeight: 700, fontSize: '14px' }}>
                      {(user.xp || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/80" style={{ fontWeight: 400, fontSize: '14px' }}>
                      {user.orderCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
                      {user.lastActive || 'Never'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-hot/20 transition-colors" title="View Details">
                        <Eye size={16} className="text-white/60 hover:text-hot" />
                      </button>
                      <button className="p-2 hover:bg-hot/20 transition-colors" title="Edit User">
                        <Edit size={16} className="text-white/60 hover:text-hot" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 transition-colors" title="Ban User">
                        <Ban size={16} className="text-white/60 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-white/20" size={48} />
              <p className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
                No users found
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}