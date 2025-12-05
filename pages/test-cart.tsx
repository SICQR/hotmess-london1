import { useEffect, useState } from 'react';
import { fetchCart } from '../lib/cart-api';
import { getSession } from '../lib/auth';

export default function TestCart() {
  const [status, setStatus] = useState('Testing cart...');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function test() {
      try {
        // Check session
        const sess = await getSession();
        setSession(sess);
        setStatus(`Session: ${sess?.user?.email || 'Not logged in'}`);

        // Try to fetch cart
        console.log('🧪 Testing fetchCart()...');
        const items = await fetchCart();
        console.log('✅ Cart fetched successfully:', items);
        
        setCartItems(items);
        setStatus('Cart fetched successfully! No errors.');
      } catch (err: any) {
        console.error('❌ Cart fetch failed:', err);
        setError(err.message);
        setStatus('Cart fetch failed');
      }
    }

    test();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl mb-8">🧪 Cart API Test</h1>
        
        <div className="space-y-4">
          <div className="bg-zinc-900 p-4 rounded">
            <div className="font-mono text-sm">
              <strong>Status:</strong> {status}
            </div>
          </div>

          {session && (
            <div className="bg-zinc-900 p-4 rounded">
              <div className="font-mono text-sm">
                <strong>User:</strong> {session.user.email}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 p-4 rounded">
              <div className="text-red-400 font-mono text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          <div className="bg-zinc-900 p-4 rounded">
            <div className="font-mono text-sm mb-2">
              <strong>Cart Items:</strong>
            </div>
            <pre className="text-xs text-zinc-400 overflow-auto">
              {JSON.stringify(cartItems, null, 2)}
            </pre>
          </div>

          <div className="bg-zinc-900 p-4 rounded">
            <div className="font-mono text-sm mb-2">
              <strong>localStorage cart:</strong>
            </div>
            <pre className="text-xs text-zinc-400 overflow-auto">
              {localStorage.getItem('hotmess_cart') || '(empty)'}
            </pre>
          </div>

          <div className="bg-blue-900/20 border border-blue-500 p-4 rounded">
            <div className="text-blue-400 text-sm">
              <strong>Expected Behavior:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>fetchCart() should return empty array (no database query)</li>
                <li>Should log: "Cart fetch: Using localStorage"</li>
                <li>No Postgres errors in console</li>
                <li>Cart loads from localStorage in CartContext</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <a
            href="/"
            className="inline-block bg-pink-500 text-black px-6 py-3 rounded hover:bg-pink-400"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
