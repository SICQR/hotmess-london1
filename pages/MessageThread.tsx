/**
 * MESSAGE THREAD
 * View a specific message conversation
 */

import { RouteId } from '../lib/routes';

interface MessageThreadProps {
  threadId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function MessageThread({ threadId, onNavigate }: MessageThreadProps) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">MESSAGE THREAD</h1>
        <p className="text-white/60 mb-4">
          Thread ID: {threadId}
        </p>
        <p className="text-white/60 mb-8">
          Coming soon.
        </p>
        
        <button
          onClick={() => onNavigate('connectMessages')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Messages
        </button>
      </div>
    </div>
  );
}
