'use client';

/**
 * Admin Users Management with real backend data
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { EmptyState } from '../EmptyState';
import { Users, Shield, Ban, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface User {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  status?: string;
  created_at: string;
  banned_at?: string;
}

export function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setAccessToken(session?.access_token || null);
    }
    getSession();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const result = await response.json();
        setUsers(result.users || []);
        setFilteredUsers(result.users || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [accessToken]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.displayName?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  async function handleBanUser(userId: string) {
    if (!accessToken) return;
    if (!confirm('Are you sure you want to ban this user?')) return;

    setActionLoading(userId);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/users/${userId}/ban`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      // Refresh users list
      const usersResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = await usersResponse.json();
      setUsers(result.users || []);
      setFilteredUsers(result.users || []);
    } catch (err: any) {
      console.error('Error banning user:', err);
      alert('Failed to ban user: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin text-hot mb-4">
            <Users size={48} />
          </div>
          <p className="text-white/60" style={{ fontSize: '14px' }}>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-red-400" style={{ fontSize: '14px' }}>
          Failed to load users. Please try again.
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Users"
        description="No users found in the system."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-hot/30 bg-hot/5 p-6">
          <div className="text-hot mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>
            {users.length}
          </div>
          <p className="text-white/80" style={{ fontSize: '14px', fontWeight: 700 }}>
            Total Users
          </p>
        </div>
        <div className="rounded-3xl border border-lime/30 bg-lime/5 p-6">
          <div className="text-neon-lime mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>
            {users.filter((u) => u.status !== 'banned').length}
          </div>
          <p className="text-white/80" style={{ fontSize: '14px', fontWeight: 700 }}>
            Active Users
          </p>
        </div>
        <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6">
          <div className="text-red-400 mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>
            {users.filter((u) => u.status === 'banned').length}
          </div>
          <p className="text-white/80" style={{ fontSize: '14px', fontWeight: 700 }}>
            Banned Users
          </p>
        </div>
        <div className="rounded-3xl border border-heat/30 bg-heat/5 p-6">
          <div className="text-heat mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>
            {users.filter((u) => u.role === 'admin' || u.role === 'operator').length}
          </div>
          <p className="text-white/80" style={{ fontSize: '14px', fontWeight: 700 }}>
            Admins
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <Input
          type="text"
          placeholder="Search by email, name, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {/* Users List */}
      <div className="rounded-3xl border p-6">
        <h3 className="text-white uppercase tracking-wider mb-6" style={{ fontSize: '14px', fontWeight: 900 }}>
          All Users ({filteredUsers.length})
        </h3>
        <div className="space-y-3 max-h-[700px] overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-white truncate" style={{ fontSize: '14px', fontWeight: 700 }}>
                    {user.displayName || user.email}
                  </p>
                  {user.role && (
                    <Badge
                      variant={user.role === 'admin' ? 'default' : 'outline'}
                      className="uppercase"
                    >
                      {user.role}
                    </Badge>
                  )}
                  {user.status === 'banned' && (
                    <Badge variant="destructive" className="uppercase">
                      Banned
                    </Badge>
                  )}
                </div>
                <p className="text-white/60 truncate" style={{ fontSize: '12px' }}>
                  {user.email}
                </p>
                <p className="text-white/40 font-mono" style={{ fontSize: '10px' }}>
                  {user.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {user.status !== 'banned' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBanUser(user.id)}
                    disabled={actionLoading === user.id}
                  >
                    <Ban size={16} className="mr-2" />
                    {actionLoading === user.id ? 'Banning...' : 'Ban'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
