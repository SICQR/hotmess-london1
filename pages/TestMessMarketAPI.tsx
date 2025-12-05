import { useState } from 'react';
import { getListings } from '../lib/api/messmarket';
import { HMButton } from '../components/library/HMButton';

export default function TestMessMarketAPI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing MessMarket API...');
      const data = await getListings({ limit: 5 });
      console.log('API Response:', data);
      setResult(data);
    } catch (err) {
      console.error('API Test Failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl mb-6">MessMarket API Test</h1>
        
        <HMButton
          onClick={testAPI}
          disabled={loading}
          className="mb-6"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </HMButton>

        {error && (
          <div className="bg-red-500/20 border border-red-500 p-4 rounded mb-4">
            <p className="text-red-400">❌ Error: {error}</p>
            <p className="text-sm text-red-300 mt-2">
              This likely means the Edge Function isn't deployed yet.
            </p>
          </div>
        )}

        {result && (
          <div className="bg-green-500/20 border border-green-500 p-4 rounded">
            <p className="text-green-400">✅ API is working!</p>
            <pre className="text-sm mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-zinc-900 rounded">
          <h2 className="text-xl mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>Click "Test API Connection"</li>
            <li>If you see ✅ = API is working, image upload should work</li>
            <li>If you see ❌ "Failed to fetch" = Edge Function not deployed</li>
            <li>If you see ❌ "Unauthorized" = You need to log in first</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
