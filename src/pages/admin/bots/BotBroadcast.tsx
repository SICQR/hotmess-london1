/**
 * BOT BROADCAST — Manual message sending to all bots/rooms
 */

import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function BotBroadcast() {
  const [message, setMessage] = useState('');
  const [selectedBot, setSelectedBot] = useState('all');
  const [sending, setSending] = useState(false);

  const bots = [
    { id: 'all', name: 'All Bots' },
    { id: 'radio', name: 'RadioBot' },
    { id: 'rooms', name: 'RoomsBot' },
    { id: 'care', name: 'CareBot' },
    { id: 'drop', name: 'DropBot' },
    { id: 'tickets', name: 'TicketsBot' },
    { id: 'admin', name: 'AdminBot' }
  ];

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setSending(true);
    
    try {
      // In production, call Supabase function to broadcast
      // await supabase.functions.invoke('botBroadcast', {
      //   body: { bot: selectedBot, message }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Broadcast sent to ${selectedBot === 'all' ? 'all bots' : selectedBot}`);
      setMessage('');
    } catch (error) {
      toast.error('Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Send size={24} className="text-purple-500" />
        <h2 className="text-2xl uppercase tracking-tight">Bot Broadcast</h2>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-yellow-400 font-semibold mb-1">Use with caution</p>
          <p className="text-yellow-300/80">
            This will send a message to all users subscribed to the selected bot(s). 
            Only use for critical announcements.
          </p>
        </div>
      </div>

      {/* Bot Selection */}
      <div className="mb-4">
        <label className="block text-sm text-zinc-400 mb-2 uppercase tracking-wider">
          Target Bot
        </label>
        <select
          value={selectedBot}
          onChange={(e) => setSelectedBot(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
        >
          {bots.map(bot => (
            <option key={bot.id} value={bot.id}>{bot.name}</option>
          ))}
        </select>
      </div>

      {/* Message Input */}
      <div className="mb-4">
        <label className="block text-sm text-zinc-400 mb-2 uppercase tracking-wider">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your broadcast message..."
          rows={6}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
        />
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>Supports Markdown formatting</span>
          <span>{message.length} characters</span>
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={sending || !message.trim()}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-4 rounded-lg uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2"
      >
        {sending ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            SENDING...
          </>
        ) : (
          <>
            <Send size={20} />
            SEND BROADCAST
          </>
        )}
      </button>
    </div>
  );
}
