/**
 * Stripe Test Card Helper
 * Shows test card numbers when in development/test mode
 */

import { useState } from 'react';
import { CreditCard, ChevronDown, ChevronUp, Copy, CheckCircle } from 'lucide-react';

export function StripeTestCardHelper() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Only show in test mode
  const isTestMode = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_');
  
  if (!isTestMode) {
    return null;
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const testCards = [
    { number: '4242 4242 4242 4242', name: 'Visa (Succeeds)', type: 'success' },
    { number: '5555 5555 5555 4444', name: 'Mastercard (Succeeds)', type: 'success' },
    { number: '4000 0025 0000 3155', name: '3D Secure (Auth Required)', type: 'auth' },
    { number: '4000 0000 0000 0002', name: 'Card Declined', type: 'error' },
    { number: '4000 0000 0000 9995', name: 'Insufficient Funds', type: 'error' },
  ];

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-yellow-500/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-yellow-500" />
          <div className="text-left">
            <p className="text-sm text-yellow-200">Test Mode Active</p>
            <p className="text-xs text-yellow-400/70">Click to view test card numbers</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-yellow-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-yellow-500/20 pt-3">
          <p className="text-xs text-yellow-400/70 mb-3">
            Use these test cards to simulate different payment scenarios:
          </p>
          
          {testCards.map((card) => (
            <div
              key={card.number}
              className="flex items-center justify-between gap-3 p-2 bg-zinc-900/50 rounded hover:bg-zinc-900 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm text-zinc-200 font-mono">{card.number}</p>
                <p className="text-xs text-zinc-400">{card.name}</p>
              </div>
              <button
                onClick={() => copyToClipboard(card.number.replace(/\s/g, ''), card.number)}
                className="px-3 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 rounded text-xs flex items-center gap-2 transition-colors"
              >
                {copied === card.number ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400">Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t border-yellow-500/20 text-xs text-yellow-400/70">
            <p className="mb-1">💡 <strong className="text-yellow-300">Pro Tips:</strong></p>
            <ul className="space-y-1 ml-5 list-disc">
              <li>Use any future expiry date (e.g., 12/34)</li>
              <li>Use any 3-digit CVC (e.g., 123)</li>
              <li>Use any valid ZIP/postcode</li>
            </ul>
          </div>

          <a
            href="https://stripe.com/docs/testing"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs text-yellow-400 hover:text-yellow-300 mt-3 underline"
          >
            View all test cards in Stripe Docs →
          </a>
        </div>
      )}
    </div>
  );
}
