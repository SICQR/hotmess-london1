import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

export function DiagnosticsPage() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (name: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any) => {
    setResults(prev => [...prev, { name, status, message, details, timestamp: Date.now() }]);
  };

  const runDiagnostics = async () => {
    setTesting(true);
    setResults([]);

    // 1. Check Supabase connection
    addResult('Supabase Config', 'pass', `Project ID: ${projectId}`, { projectId, hasAnonKey: !!publicAnonKey });

    // 2. Check auth status
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session) {
        addResult('Authentication', 'pass', `Logged in as: ${session.user.email}`, { 
          userId: session.user.id,
          email: session.user.email 
        });
      } else {
        addResult('Authentication', 'warning', 'Not logged in (required for checkout)', null);
      }
    } catch (err: any) {
      addResult('Authentication', 'fail', `Auth error: ${err.message}`, { error: err });
    }

    // 3. Test database connection
    try {
      const { data, error } = await supabase
        .from('market_listings')
        .select('id, title, status')
        .limit(1);
      
      if (error) throw error;
      addResult('Database Connection', 'pass', `Found ${data?.length || 0} listings`, { listings: data });
    } catch (err: any) {
      addResult('Database Connection', 'fail', `DB error: ${err.message}`, { error: err });
    }

    // 4. Test Edge Function availability
    const functionUrl = `https://${projectId}.supabase.co/functions/v1/market-checkout-create`;
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ test: true }),
      });

      const text = await response.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }

      if (response.ok || response.status === 400 || response.status === 401) {
        // 400/401 means function is there, just rejecting our request
        addResult('Edge Function Deployed', 'pass', `Function responds (${response.status})`, { 
          status: response.status,
          response: json 
        });
      } else if (response.status === 404) {
        addResult('Edge Function Deployed', 'fail', 'Function not found (404) - needs deployment!', {
          url: functionUrl,
          status: 404
        });
      } else {
        addResult('Edge Function Deployed', 'warning', `Unexpected response (${response.status})`, {
          status: response.status,
          response: json
        });
      }
    } catch (err: any) {
      addResult('Edge Function Deployed', 'fail', `Network error: ${err.message}`, { 
        error: err,
        url: functionUrl 
      });
    }

    // 5. Test Supabase Functions SDK
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const { data, error } = await supabase.functions.invoke('market-checkout-create', {
        body: { test: true },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });

      if (error) {
        if (error.message.includes('Failed to send')) {
          addResult('Supabase Functions SDK', 'fail', 'Function not deployed or unreachable', { error });
        } else {
          addResult('Supabase Functions SDK', 'warning', `Function error (expected): ${error.message}`, { error });
        }
      } else {
        addResult('Supabase Functions SDK', 'pass', 'Function callable via SDK', { response: data });
      }
    } catch (err: any) {
      addResult('Supabase Functions SDK', 'fail', `SDK error: ${err.message}`, { error: err });
    }

    // 6. Check for test product
    try {
      const { data, error } = await supabase
        .from('market_listings')
        .select('id, slug, title, status, quantity_available')
        .eq('slug', 'neon-harness')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        if (data.status === 'active' && data.quantity_available > 0) {
          addResult('Test Product', 'pass', `Found: "${data.title}" (active, ${data.quantity_available} in stock)`, data);
        } else {
          addResult('Test Product', 'warning', `Found but not available (status: ${data.status}, stock: ${data.quantity_available})`, data);
        }
      } else {
        addResult('Test Product', 'warning', 'Test product "neon-harness" not found', null);
      }
    } catch (err: any) {
      addResult('Test Product', 'fail', `Error checking product: ${err.message}`, { error: err });
    }

    // 7. Check Stripe environment variable
    const stripeKeySet = typeof process !== 'undefined' && process.env?.STRIPE_SECRET_KEY;
    addResult('Stripe Config', stripeKeySet ? 'pass' : 'warning', 
      stripeKeySet ? 'STRIPE_SECRET_KEY detected' : 'STRIPE_SECRET_KEY not visible (normal for frontend)', 
      { note: 'This should be set in Supabase Edge Functions secrets' }
    );

    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-4">🔧 SYSTEM DIAGNOSTICS</h1>
          <p className="text-zinc-400">
            Run tests to verify your HOTMESS LONDON setup
          </p>
        </div>

        {/* Run Button */}
        <button
          onClick={runDiagnostics}
          disabled={testing}
          className="mb-8 px-6 py-3 bg-hotmess-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors flex items-center gap-2"
        >
          {testing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running diagnostics...
            </>
          ) : (
            'RUN DIAGNOSTICS'
          )}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-4">Results:</h2>
            
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  result.status === 'pass'
                    ? 'bg-green-500/10 border-green-500/30'
                    : result.status === 'fail'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.status === 'pass' && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />}
                  {result.status === 'fail' && <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />}
                  {result.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold">{result.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status === 'pass'
                          ? 'bg-green-500/20 text-green-300'
                          : result.status === 'fail'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-2">{result.message}</p>
                    
                    {result.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-zinc-500 hover:text-zinc-400">
                          Show details
                        </summary>
                        <pre className="mt-2 p-2 bg-black rounded overflow-auto text-zinc-400">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <h3 className="text-xl mb-4">Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {results.filter(r => r.status === 'pass').length}
                  </div>
                  <div className="text-sm text-zinc-400">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {results.filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-sm text-zinc-400">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">
                    {results.filter(r => r.status === 'fail').length}
                  </div>
                  <div className="text-sm text-zinc-400">Failed</div>
                </div>
              </div>

              {/* Recommendations */}
              {results.some(r => r.status === 'fail') && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded">
                  <h4 className="font-bold mb-2 text-red-300">⚠️ Action Required</h4>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {results.find(r => r.name === 'Edge Function Deployed' && r.status === 'fail') && (
                      <li>
                        • <strong>Deploy Edge Functions:</strong> See /DEPLOY_EDGE_FUNCTIONS.md for instructions
                      </li>
                    )}
                    {results.find(r => r.name === 'Authentication' && r.status === 'warning') && (
                      <li>
                        • <strong>Login required:</strong> You must be logged in to test checkout
                      </li>
                    )}
                    {results.find(r => r.name === 'Database Connection' && r.status === 'fail') && (
                      <li>
                        • <strong>Database issue:</strong> Check Supabase project is running
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {results.length === 0 && !testing && (
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
            <h3 className="text-xl mb-4">What This Tests:</h3>
            <ul className="space-y-2 text-zinc-300">
              <li>✓ Supabase configuration</li>
              <li>✓ Authentication status</li>
              <li>✓ Database connection</li>
              <li>✓ Edge Function deployment</li>
              <li>✓ Supabase Functions SDK</li>
              <li>✓ Test product availability</li>
              <li>✓ Stripe configuration</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
