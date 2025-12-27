/**
 * CONNECT THREADS LIST
 * View all Connect threads with real chat functionality
 */

import { useState, useEffect } from 'react';
import { RouteId } from '../lib/routes';
import { HMButton } from '../components/library/HMButton';
import { MessageCircle, User, Plus, Inbox, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface ConnectThreadsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Thread {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
  other_user?: {
    username: string;
    avatar_url?: string;
  };
  unread_count?: number;
}

export function ConnectThreads({ onNavigate }: ConnectThreadsProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadThreads();
  }, [filter]);

  async function loadThreads() {
    setLoading(true);
    try {
      // Escape hatch: many legacy tables are not represented in local DB typings.
      const sb = supabase as any;

      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        toast.error('Please sign in to view threads');
        onNavigate('login');
        return;
      }

      // Query connect_threads where user is a member
      const { data: threadMemberships, error: memberError } = await sb
        .from('connect_thread_members')
        .select(`
          thread_id,
          connect_threads!inner (
            id,
            beacon_id,
            status,
            created_at,
            closed_at
          )
        `)
        .eq('user_id', session.user.id);

      if (memberError) {
        throw memberError;
      }

      if (!threadMemberships || threadMemberships.length === 0) {
        setThreads([]);
        return;
      }

      // Get thread IDs
      const threadIds = threadMemberships.map((m: any) => m.thread_id);

      // Get the other members for each thread
      const { data: otherMembers, error: otherMembersError } = await sb
        .from('connect_thread_members')
        .select('thread_id, user_id')
        .in('thread_id', threadIds)
        .neq('user_id', session.user.id);

      if (otherMembersError) {
        throw otherMembersError;
      }

      // Get last messages for each thread
      const { data: lastMessages, error: messagesError } = await sb
        .from('connect_messages')
        .select('thread_id, body, created_at')
        .in('thread_id', threadIds)
        .order('created_at', { ascending: false });

      if (messagesError) {
        throw messagesError;
      }

      // Group messages by thread
      const messagesByThread = new Map<string, any>();
      if (lastMessages) {
        lastMessages.forEach((msg: any) => {
          if (!messagesByThread.has(msg.thread_id)) {
            messagesByThread.set(msg.thread_id, msg);
          }
        });
      }

      // Build thread objects
      const threadsData: Thread[] = threadMemberships.map((membership: any) => {
        const thread = membership.connect_threads;
        const otherMember = otherMembers?.find((m: any) => m.thread_id === thread.id);
        const lastMsg = messagesByThread.get(thread.id);

        return {
          id: thread.id,
          user1_id: session.user.id,
          user2_id: otherMember?.user_id || '',
          status: thread.status === 'open' ? 'active' : 'closed',
          created_at: thread.created_at,
          updated_at: lastMsg?.created_at || thread.created_at,
          last_message: lastMsg?.body,
          last_message_at: lastMsg?.created_at,
          other_user: {
            username: 'Anonymous', // Privacy: don't expose usernames
            avatar_url: undefined
          },
          unread_count: 0 // TODO: Implement unread tracking
        };
      });

      // Apply filter
      const filteredThreads = threadsData.filter(t => 
        filter === 'all' ? true : t.status === filter
      );

      setThreads(filteredThreads);
    } catch (error: any) {
      console.error('Error loading threads:', error);
      toast.error(error.message || 'Failed to load threads');
    } finally {
      setLoading(false);
    }
  }

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  const filteredThreads = threads.filter(thread => 
    searchQuery === '' || 
    thread.other_user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tight">My Threads</h1>
                <p className="text-xs text-white/50">Your Connect conversations</p>
              </div>
            </div>
            
            <HMButton
              onClick={() => onNavigate('connectCreate')}
              size="sm"
            >
              <Plus className="w-4 h-4" />
              New Intent
            </HMButton>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'closed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                filter === tab
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab}
              {tab === 'active' && threads.filter(t => t.status === 'active').length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {threads.filter(t => t.status === 'active').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 mx-auto text-white/20 animate-pulse mb-4" />
            <p className="text-white/60">Loading threads...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredThreads.length === 0 && (
          <div className="text-center py-16">
            <Inbox className="w-16 h-16 mx-auto text-white/10 mb-6" />
            <h3 className="text-xl font-bold mb-2">No Threads Yet</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'No threads match your search'
                : filter === 'closed'
                ? 'No closed threads'
                : 'Create an intent at a venue to start connecting with others'}
            </p>
            {!searchQuery && filter === 'active' && (
              <HMButton onClick={() => onNavigate('connectCreate')}>
                <Plus className="w-4 h-4" />
                Create Your First Intent
              </HMButton>
            )}
          </div>
        )}

        {/* Threads List */}
        {!loading && filteredThreads.length > 0 && (
          <div className="space-y-3">
            {filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => onNavigate('connectThread', { threadId: thread.id })}
                className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    {thread.other_user?.avatar_url ? (
                      <img 
                        src={thread.other_user.avatar_url} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-red-500 transition-colors">
                          {thread.other_user?.username || 'Anonymous'}
                        </span>
                        {thread.unread_count && thread.unread_count > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {thread.unread_count}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/50 flex-shrink-0">
                        {thread.last_message_at && formatTimestamp(thread.last_message_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-white/60 truncate">
                      {thread.last_message || 'No messages yet'}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs px-2 py-0.5 ${
                        thread.status === 'active'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {thread.status}
                      </span>
                      <span className="text-xs text-white/40">
                        Started {formatTimestamp(thread.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => onNavigate('connect')}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            ← Back to Connect
          </button>
        </div>
      </div>
    </div>
  );
}
