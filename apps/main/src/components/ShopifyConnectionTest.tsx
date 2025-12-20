// HOTMESS LONDON - Shopify Connection Test Component
// Add this to any page to test your Shopify connection

import { useState } from 'react';
import { getProductsByCollection } from '../lib/shopify-api';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

export function ShopifyConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    setResults(null);

    // Test your actual Shopify collection handles
    const collections = ['superhung', 'hnh-mess'];
    const testResults: any = {};

    for (const collection of collections) {
      try {
        const products = await getProductsByCollection(collection, 5);
        testResults[collection] = {
          success: true,
          count: products.length,
          products: products.slice(0, 3), // First 3 products
        };
      } catch (error: any) {
        testResults[collection] = {
          success: false,
          error: error.message,
        };
      }
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Test Button */}
      {!results && (
        <button
          onClick={runTest}
          disabled={testing}
          className="px-6 py-3 bg-hotmess-red hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          {testing ? (
            <>
              <Loader size={20} className="animate-spin" />
              Testing Shopify...
            </>
          ) : (
            <>
              🛍️ Test Shopify Connection
            </>
          )}
        </button>
      )}

      {/* Results Panel */}
      {results && (
        <div className="bg-black border border-white/20 rounded-lg shadow-2xl p-6 max-w-md max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Shopify Connection Test</h3>
            <button
              onClick={() => setResults(null)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(results).map(([collection, result]: [string, any]) => (
              <div
                key={collection}
                className="p-4 border border-white/10 rounded bg-zinc-900"
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <XCircle size={20} className="text-red-500" />
                  )}
                  <span className="text-white font-bold uppercase">{collection}</span>
                </div>

                {result.success ? (
                  <>
                    <p className="text-white/60 text-sm mb-2">
                      Found {result.count} product{result.count !== 1 ? 's' : ''}
                    </p>
                    {result.products && result.products.length > 0 ? (
                      <ul className="space-y-1 text-sm text-white/80">
                        {result.products.map((p: any) => (
                          <li key={p.id} className="truncate">
                            • {p.name} (£{p.price})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-amber-500 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        Add products to this collection
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-red-400 text-sm">
                    Error: {result.error}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-white/10">
            {Object.values(results).every((r: any) => r.success) ? (
              <div className="text-green-500 flex items-center gap-2">
                <CheckCircle size={20} />
                <span className="font-bold">Connection successful!</span>
              </div>
            ) : (
              <div className="text-red-500 flex items-center gap-2">
                <XCircle size={20} />
                <span className="font-bold">Some collections failed</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-2">
            <button
              onClick={runTest}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              Test Again
            </button>
            <a
              href="https://admin.shopify.com/store/1e0297-a4/products"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-hotmess-red hover:bg-red-600 text-white text-center rounded transition-colors"
            >
              Open Shopify Admin
            </a>
          </div>
        </div>
      )}
    </div>
  );
}