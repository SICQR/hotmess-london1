/**
 * MODERATION QUEUE — Real-time report monitoring
 */

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Report {
  id: string;
  type: string;
  severity: 'low' | 'med' | 'high';
  reporter: string;
  target: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export function ModQueue() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from Supabase with real-time subscription
    // For now, simulate data
    setTimeout(() => {
      setReports([
        {
          id: '1',
          type: 'Harassment',
          severity: 'high',
          reporter: 'User #4821',
          target: 'User #9234',
          timestamp: '5m ago',
          status: 'pending'
        },
        {
          id: '2',
          type: 'Spam',
          severity: 'low',
          reporter: 'User #2341',
          target: 'User #7812',
          timestamp: '23m ago',
          status: 'pending'
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const severityColors = {
    low: 'text-yellow-400 bg-yellow-500/10',
    med: 'text-orange-400 bg-orange-500/10',
    high: 'text-red-400 bg-red-500/10'
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={24} className="text-orange-500" />
          <h2 className="text-2xl uppercase tracking-tight">Moderation Queue</h2>
        </div>
        <span className="text-sm text-zinc-500">
          {reports.filter(r => r.status === 'pending').length} pending
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3 opacity-50" />
          <p className="text-zinc-400">No pending reports</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <div 
              key={report.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${severityColors[report.severity]}`}>
                    {report.severity}
                  </span>
                  <span className="text-white font-semibold">{report.type}</span>
                </div>
                <span className="text-xs text-zinc-500">{report.timestamp}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                <span>Reporter: <span className="text-white">{report.reporter}</span></span>
                <span>Target: <span className="text-white">{report.target}</span></span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm uppercase tracking-wider transition-colors">
                  Resolve
                </button>
                <button className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded text-sm uppercase tracking-wider transition-colors">
                  Dismiss
                </button>
                <button className="px-4 py-2 border border-zinc-600 hover:border-zinc-500 text-white rounded text-sm uppercase tracking-wider transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
