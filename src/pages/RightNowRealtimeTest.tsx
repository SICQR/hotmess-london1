import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, XCircle, Radio } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface RightNowRealtimeTestProps {
  onNavigate: (route: RouteId) => void;
}

export function RightNowRealtimeTest({ onNavigate }: RightNowRealtimeTestProps) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const setup = async () => {
      // Subscribe to London channel (public broadcast - no auth needed)
      const channel = supabase
        .channel('right_now:city:London', {
          config: {
            broadcast: { self: false },
          },
        })
        .on('broadcast', { event: '*' }, (payload) => {
          setMessages(prev => [...prev, {
            time: new Date().toISOString(),
            type: 'broadcast',
            message: 'Broadcast received',
            payload,
          }]);
        })
        .subscribe((status, err) => {
          setMessages(prev => [...prev, {
            time: new Date().toISOString(),
            type: 'status',
            message: `Channel status: ${status}`,
            error: err,
          }]);

          if (status === 'SUBSCRIBED') {
            setStatus('connected');
          } else if (status === 'CHANNEL_ERROR') {
            setStatus('error');
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setup();
  }, []);

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => onNavigate('rightNow')}
          className="mb-6 text-sm text-white/60 hover:text-white"
        >
          ← Back to RIGHT NOW
        </button>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black uppercase">
            RIGHT NOW Realtime Test
          </h1>
          <p className="text-sm text-white/60">
            Testing public broadcast channel{' '}
            <code className="rounded bg-white/10 px-2 py-1">
              right_now:city:London
            </code>
          </p>
        </div>

        {/* Status */}
        <div className="mb-8 rounded-2xl border border-white/20 bg-black/60 p-6">
          <div className="flex items-center gap-3">
            {status === 'connecting' && (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Connecting to realtime...</span>
              </>
            )}
            {status === 'connected' && (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-green-400">
                  Connected to realtime channel
                </span>
              </>
            )}
            {status === 'error' && (
              <>
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-400">Connection failed</span>
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.16em]">
            <Radio className="h-4 w-4" />
            How to test
          </h2>
          <ol className="space-y-2 text-sm text-white/70">
            <li>1. Keep this page open</li>
            <li>2. Open RIGHT NOW in another tab (?page=rightNow)</li>
            <li>3. Create a new RIGHT NOW post in London</li>
            <li>4. Watch this page for broadcast events below</li>
          </ol>
        </div>

        {/* Message log */}
        <div className="rounded-2xl border border-white/20 bg-black/60 p-6">
          <h2 className="mb-4 text-sm uppercase tracking-[0.16em]">
            Event Log ({messages.length})
          </h2>

          {messages.length === 0 ? (
            <p className="text-center text-sm text-white/50">
              Waiting for events...
            </p>
          ) : (
            <div className="space-y-3">
              {messages.slice().reverse().map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 ${
                    msg.type === 'broadcast'
                      ? 'border-hotmess-red/30 bg-hotmess-red/10'
                      : msg.type === 'error'
                      ? 'border-red-500/30 bg-red-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.16em] text-white/60">
                      {msg.type}
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(msg.time).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  {msg.payload && (
                    <pre className="mt-2 overflow-x-auto rounded bg-black/40 p-3 text-xs">
                      {JSON.stringify(msg.payload, null, 2)}
                    </pre>
                  )}
                  {msg.error && (
                    <pre className="mt-2 overflow-x-auto rounded bg-red-500/20 p-3 text-xs text-red-200">
                      {JSON.stringify(msg.error, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}