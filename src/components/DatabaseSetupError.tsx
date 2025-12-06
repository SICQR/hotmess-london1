import { AlertCircle, Database, FileCode, CheckCircle } from 'lucide-react';

interface DatabaseSetupErrorProps {
  error: string;
}

export function DatabaseSetupError({ error }: DatabaseSetupErrorProps) {
  const isDatabaseNotSetup = error.includes('relationship') || error.includes('PGRST200') || error.includes('Database not set up');

  if (!isDatabaseNotSetup) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-red-200 uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '16px' }}>Error Loading Data</h3>
          <p className="text-red-300 whitespace-pre-wrap" style={{ fontWeight: 400, fontSize: '13px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border-2 border-yellow-500/30 p-8">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-yellow-500" />
        <h2 className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '24px' }}>DATABASE SETUP REQUIRED</h2>
      </div>

      <p className="text-white/60 mb-6" style={{ fontWeight: 400, fontSize: '14px' }}>
        The HOTMESS commerce database hasn't been set up yet. Follow these steps to get started:
      </p>

      <div className="space-y-4 mb-6">
        <div className="bg-black border border-white/10 p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-hot flex items-center justify-center flex-shrink-0 mt-0.5">
              <span style={{ fontWeight: 900, fontSize: '13px' }}>1</span>
            </div>
            <div className="flex-1">
              <h3 className="uppercase tracking-wider text-white mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>Open Supabase SQL Editor</h3>
              <p className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '13px' }}>
                Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-hot hover:underline">Supabase Dashboard</a> → Your Project → SQL Editor
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-hot flex items-center justify-center flex-shrink-0 mt-0.5">
              <span style={{ fontWeight: 900, fontSize: '13px' }}>2</span>
            </div>
            <div className="flex-1">
              <h3 className="uppercase tracking-wider text-white mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>Run Commerce Architecture</h3>
              <p className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '13px' }}>
                Copy and run: <code className="px-2 py-1 bg-black border border-white/20 font-mono" style={{ fontWeight: 400, fontSize: '11px' }}>/supabase/migrations/commerce_architecture.sql</code>
              </p>
              <div className="flex items-center gap-2 text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
                <FileCode className="w-4 h-4" />
                Creates 11 tables, RLS policies, and indexes
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-hot flex items-center justify-center flex-shrink-0 mt-0.5">
              <span style={{ fontWeight: 900, fontSize: '13px' }}>3</span>
            </div>
            <div className="flex-1">
              <h3 className="uppercase tracking-wider text-white mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>Run Stock Reservation</h3>
              <p className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '13px' }}>
                Copy and run: <code className="px-2 py-1 bg-black border border-white/20 font-mono" style={{ fontWeight: 400, fontSize: '11px' }}>/supabase/migrations/stock_reservation.sql</code>
              </p>
              <div className="flex items-center gap-2 text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
                <FileCode className="w-4 h-4" />
                Adds atomic stock management functions
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="uppercase tracking-wider text-white mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>Verify Setup</h3>
              <p className="text-white/60 mb-2" style={{ fontWeight: 400, fontSize: '13px' }}>
                Copy and run: <code className="px-2 py-1 bg-black border border-white/20 font-mono" style={{ fontWeight: 400, fontSize: '11px' }}>/supabase/migrations/999_verify_setup.sql</code>
              </p>
              <div className="flex items-center gap-2 text-white/40" style={{ fontWeight: 400, fontSize: '11px' }}>
                <FileCode className="w-4 h-4" />
                Confirms everything is set up correctly
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-4" style={{ fontWeight: 400, fontSize: '13px' }}>
        <p className="text-blue-200 mb-2">
          <span style={{ fontWeight: 900 }}>📖 Full Guide:</span> See <code className="px-2 py-1 bg-black/50 font-mono" style={{ fontWeight: 400, fontSize: '11px' }}>/DATABASE_SETUP_NOW.md</code> for detailed instructions
        </p>
        <p className="text-blue-300/70" style={{ fontWeight: 400, fontSize: '11px' }}>
          Takes about 5 minutes. Just copy-paste the SQL files into Supabase.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 w-full px-6 py-3 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider"
        style={{ fontWeight: 900, fontSize: '14px' }}
      >
        I'VE RUN THE SCRIPTS - RELOAD PAGE
      </button>
    </div>
  );
}
