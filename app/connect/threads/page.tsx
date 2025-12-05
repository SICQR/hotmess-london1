/**
 * CONNECT THREADS
 * List of active and past connect conversations
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ArrowLeft, Loader2, User, Clock, MapPin } from 'lucide-react';
import { BrutalistCard } from '@/components/BrutalistCard';
import { BrutalistHeader } from '@/components/BrutalistHeader';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { projectId } from '@/utils/supabase/info';

interface Thread {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  status: 'active' | 'closed';
  created_at: string;
  beacon_name: string;
  venue: string;
  city: string;
}

export default function ConnectThreadsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    loadThreads();
  }, []);

  async function loadThreads() {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login?redirect=/connect/threads');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/connect/threads`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load threads');
      }

      const data = await response.json();
      setThreads(data.threads || []);

    } catch (error) {
      console.error('Error loading threads:', error);
      toast.error('Failed to load threads');
    } finally {
      setLoading(false);
    }
  }

  function formatLastMessage(thread: Thread) {
    if (!thread.last_message) {
      return 'No messages yet';
    }
    
    const maxLength = 60;
    return thread.last_message.length > maxLength
      ? thread.last_message.substring(0, maxLength) + '...'
      : thread.last_message;
  }

  function formatTime(timestamp: string | null) {
    if (!timestamp) return '';
    
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

  const activeThreads = threads.filter(t => t.status === 'active');
  const closedThreads = threads.filter(t => t.status === 'closed');

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <BrutalistHeader
        icon={MessageCircle}
        label="CONNECT"
        title="MY THREADS"
        subtitle="Active and past conversations"
      />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Active threads */}
            <BrutalistCard variant="section">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">ACTIVE THREADS</h2>
                  <Badge variant="outline" className="border-white/20">
                    {activeThreads.length}
                  </Badge>
                </div>

                {activeThreads.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <MessageCircle className="w-12 h-12 mx-auto text-white/20" />
                    <p className="text-white/70">No active threads</p>
                    <p className="text-sm text-white/50">
                      Create an intent and wait for mutual opt-ins
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeThreads.map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => router.push(`/connect/thread/${thread.id}`)}
                        className="w-full p-4 text-left bg-white/5 border-2 border-white/10 hover:border-white/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                            {thread.other_user_avatar ? (
                              <img
                                src={thread.other_user_avatar}
                                alt={thread.other_user_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-white/50" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold truncate">
                                {thread.other_user_name}
                              </p>
                              {thread.unread_count > 0 && (
                                <Badge className="bg-red-500 text-white border-0 flex-shrink-0">
                                  {thread.unread_count}
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-white/70 truncate">
                              {formatLastMessage(thread)}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-white/50">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{thread.venue || thread.city}</span>
                              </div>
                              {thread.last_message_at && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTime(thread.last_message_at)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </BrutalistCard>

            {/* Closed threads */}
            {closedThreads.length > 0 && (
              <BrutalistCard variant="section">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">CLOSED THREADS</h2>
                    <Badge variant="outline" className="border-white/20">
                      {closedThreads.length}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {closedThreads.map((thread) => (
                      <div
                        key={thread.id}
                        className="p-4 bg-white/5 border-2 border-white/10 opacity-50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                            {thread.other_user_avatar ? (
                              <img
                                src={thread.other_user_avatar}
                                alt={thread.other_user_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-white/50" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="font-bold truncate">
                              {thread.other_user_name}
                            </p>
                            <p className="text-sm text-white/70">Thread closed</p>
                            <div className="flex items-center gap-3 text-xs text-white/50">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{thread.venue || thread.city}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BrutalistCard>
            )}
          </>
        )}

        {/* Privacy reminder */}
        <div className="p-4 bg-white/5 border-2 border-white/10 text-xs space-y-2">
          <p className="font-bold">🔒 AUTO-DELETE</p>
          <p className="text-white/70">
            Threads automatically delete after 7 days of inactivity for your privacy.
            You can close a thread anytime from the thread view.
          </p>
        </div>
      </div>
    </div>
  );
}
