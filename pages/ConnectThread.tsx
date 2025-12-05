/**
 * CONNECT THREAD CHAT
 * Real-time chat interface for Connect threads
 */

import { useState, useEffect, useRef } from 'react';
import { RouteId } from '../lib/routes';
import { HMButton } from '../components/library/HMButton';
import { 
  Send, 
  User, 
  MoreVertical, 
  AlertCircle, 
  Shield, 
  X,
  Flag,
  Ban,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface ConnectThreadProps {
  threadId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_mine: boolean;
}

interface ThreadInfo {
  id: string;
  status: 'active' | 'closed';
  other_user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  created_at: string;
}

export function ConnectThread({ threadId, onNavigate }: ConnectThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadInfo, setThreadInfo] = useState<ThreadInfo | null>(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    loadThread();
    const interval = setInterval(loadMessages, 3000); // Poll every 3s for new messages
    return () => clearInterval(interval);
  }, [threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function loadThread() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in');
        onNavigate('login');
        return;
      }

      setCurrentUserId(session.user.id);

      // Mock thread info (replace with real Supabase query)
      const mockThread: ThreadInfo = {
        id: threadId,
        status: 'active',
        other_user: {
          id: 'user-2',
          username: 'anonymous_flame',
          avatar_url: undefined
        },
        created_at: new Date(Date.now() - 3600000).toISOString()
      };

      setThreadInfo(mockThread);
      await loadMessages();
    } catch (error) {
      console.error('Error loading thread:', error);
      toast.error('Failed to load thread');
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    try {
      // Mock messages (replace with real Supabase query)
      const mockMessages: Message[] = [
        {
          id: 'msg-1',
          thread_id: threadId,
          sender_id: 'user-2',
          content: 'Hey! Saw your intent. I\'m near the bar.',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          is_mine: false
        },
        {
          id: 'msg-2',
          thread_id: threadId,
          sender_id: currentUserId,
          content: 'Cool! I\'m by the DJ booth. Red jacket.',
          created_at: new Date(Date.now() - 1500000).toISOString(),
          is_mine: true
        },
        {
          id: 'msg-3',
          thread_id: threadId,
          sender_id: 'user-2',
          content: 'Perfect, heading over now 🔥',
          created_at: new Date(Date.now() - 1200000).toISOString(),
          is_mine: false
        },
        {
          id: 'msg-4',
          thread_id: threadId,
          sender_id: currentUserId,
          content: 'See you in a sec!',
          created_at: new Date(Date.now() - 900000).toISOString(),
          is_mine: true
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  async function sendMessage() {
    if (!messageText.trim() || sending) return;

    setSending(true);
    try {
      // Mock send (replace with real Supabase insert)
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        thread_id: threadId,
        sender_id: currentUserId,
        content: messageText.trim(),
        created_at: new Date().toISOString(),
        is_mine: true
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      toast.success('Message sent');

      // In production, insert to Supabase here
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  async function closeThread() {
    if (!confirm('Close this thread? This cannot be undone.')) return;

    try {
      // Mock close (replace with real Supabase update)
      toast.success('Thread closed');
      onNavigate('connectThreads');
    } catch (error) {
      console.error('Error closing thread:', error);
      toast.error('Failed to close thread');
    }
  }

  async function reportThread() {
    if (!confirm('Report this user for inappropriate behavior?')) return;

    try {
      // Mock report (replace with real Supabase insert)
      toast.success('Report submitted. Our team will review it.');
      setShowMenu(false);
    } catch (error) {
      console.error('Error reporting:', error);
      toast.error('Failed to submit report');
    }
  }

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!threadInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="font-bold text-xl mb-2">Thread Not Found</h2>
          <p className="text-white/60 mb-6">This thread may have been closed or deleted.</p>
          <HMButton onClick={() => onNavigate('connectThreads')}>
            Back to Threads
          </HMButton>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/90 backdrop-blur-sm flex-shrink-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('connectThreads')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ←
              </button>
              
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                {threadInfo.other_user.avatar_url ? (
                  <img 
                    src={threadInfo.other_user.avatar_url} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>

              <div>
                <div className="font-bold">{threadInfo.other_user.username}</div>
                <div className="text-xs text-white/50">
                  {threadInfo.status === 'active' ? 'Active' : 'Closed'}
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-white/10 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/20 shadow-xl z-10">
                  <button
                    onClick={reportThread}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-3 text-yellow-500"
                  >
                    <Flag className="w-4 h-4" />
                    Report User
                  </button>
                  <button
                    onClick={closeThread}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-3 text-red-500"
                  >
                    <X className="w-4 h-4" />
                    Close Thread
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/30 flex items-start gap-2 flex-shrink-0">
        <Shield className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/70">
          Meet in public. Tell friends. Trust your instincts. Report abuse immediately.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Thread Start Notice */}
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-xs text-white/60">
              <Info className="w-3.5 h-3.5" />
              Thread started {new Date(threadInfo.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.is_mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] ${
                  message.is_mine
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-white'
                } px-4 py-3 rounded-none`}
              >
                <p className="text-sm break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.is_mine ? 'text-white/70' : 'text-white/50'
                }`}>
                  {formatTimestamp(message.created_at)}
                </p>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-black/90 backdrop-blur-sm flex-shrink-0">
        <div className="px-4 py-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type a message..."
              disabled={threadInfo.status === 'closed' || sending}
              className="flex-1 h-12 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <HMButton
              onClick={sendMessage}
              disabled={!messageText.trim() || sending || threadInfo.status === 'closed'}
              className="h-12 px-6"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send'}
            </HMButton>
          </div>

          {threadInfo.status === 'closed' && (
            <p className="text-center text-xs text-white/50 mt-3">
              This thread is closed. No new messages can be sent.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
