// HOTMESS LONDON - Radio Live Chat
// Real-time chat during broadcasts using Supabase Realtime

import { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

interface LiveChatProps {
  showId?: string;
  className?: string;
}

export function LiveChat({ showId, className }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect to realtime channel
  useEffect(() => {
    const channelName = showId ? `radio:show:${showId}` : 'radio:live';
    
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: true },
        presence: { key: user?.id || 'anonymous' },
      },
    });

    // Listen for new messages
    channel.on('broadcast', { event: 'chat-message' }, (payload) => {
      setMessages((prev) => [...prev, payload.payload as ChatMessage]);
    });

    // Track online users
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      setListenerCount(Object.keys(state).length);
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        // Track presence
        channel.track({
          online_at: new Date().toISOString(),
          username: user?.user_metadata?.username || 'Anonymous',
        });
      }
    });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [showId, user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !channelRef.current) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: user?.id || 'anonymous',
      username: user?.user_metadata?.username || 'Anonymous',
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    await channelRef.current.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: message,
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-red-500/30">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-red-500" />
          <h3 className="text-white">Live Chat</h3>
          {isConnected && (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Users className="w-4 h-4" />
          <span>{listenerCount}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[400px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-500">{msg.username}</span>
                <span className="text-xs text-zinc-600">
                  {new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <p className="text-white text-sm break-words">{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-red-500/30">
        {user ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-zinc-900 border border-red-500/30 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center text-zinc-500 text-sm">
            <a href="/login" className="text-red-500 hover:underline">
              Sign in
            </a>{' '}
            to join the chat
          </div>
        )}
      </div>
    </div>
  );
}
