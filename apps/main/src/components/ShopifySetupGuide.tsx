/**
 * HOTMESS LONDON - Shopify Setup Guide
 * Displays when Shopify is not configured, guiding developers/admins to set it up
 */

import { ExternalLink, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ShopifySetupGuideProps {
  className?: string;
}

export function ShopifySetupGuide({ className = '' }: ShopifySetupGuideProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const envVars = [
    'VITE_SHOPIFY_DOMAIN=your-store.myshopify.com',
    'VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-4xl mx-auto ${className}`}
    >
      <div className="border-2 border-hot/30 bg-gradient-to-br from-hot/5 to-transparent p-8 md:p-12">
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className="text-hot flex-shrink-0 mt-1" size={32} />
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
              Shopify Not Configured
            </h2>
            <p className="text-white/70 text-lg">
              The shop is ready to go, but we need your Shopify credentials first.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-hot flex items-center justify-center text-black font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Create a Shopify Store</h3>
                <p className="text-white/60 mb-3">
                  If you don't have a Shopify store yet, create one at Shopify.com. You can start with a free trial.
                </p>
                <a
                  href="https://www.shopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-hot hover:text-heat transition-colors text-sm font-bold"
                >
                  Create Shopify Store
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-hot flex items-center justify-center text-black font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Get Your Storefront API Token</h3>
                <p className="text-white/60 mb-3">
                  In your Shopify Admin, go to <strong>Settings → Apps and sales channels → Develop apps</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 text-white/70 text-sm mb-3 ml-2">
                  <li>Click "Create an app" and give it a name (e.g., "HOTMESS Frontend")</li>
                  <li>Click "Configure Storefront API scopes"</li>
                  <li>Enable these scopes:
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li>unauthenticated_read_product_listings</li>
                      <li>unauthenticated_write_checkouts</li>
                      <li>unauthenticated_read_checkouts</li>
                      <li>unauthenticated_write_customers</li>
                    </ul>
                  </li>
                  <li>Click "Save", then "Install app"</li>
                  <li>Copy your <strong>Storefront API access token</strong></li>
                </ol>
                <a
                  href="https://help.shopify.com/en/manual/apps/app-types/custom-apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-hot hover:text-heat transition-colors text-sm font-bold"
                >
                  Read Shopify Documentation
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-hot flex items-center justify-center text-black font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Set Environment Variables</h3>
                <p className="text-white/60 mb-3">Add these to your environment configuration:</p>

                {/* Local Development */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-white mb-2">For Local Development (.env.local):</p>
                  <div className="bg-black/50 p-4 rounded border border-white/10 font-mono text-sm">
                    {envVars.map((envVar, i) => (
                      <div key={i} className="flex items-center justify-between mb-2 last:mb-0">
                        <code className="text-lime">{envVar}</code>
                        <button
                          onClick={() => copyToClipboard(envVar, i)}
                          className="ml-4 p-2 hover:bg-white/10 rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedStep === i ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} className="text-white/60" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Production/Vercel */}
                <div>
                  <p className="text-sm font-bold text-white mb-2">For Production (Vercel/GitHub Secrets):</p>
                  <ul className="list-disc list-inside space-y-2 text-white/70 text-sm ml-2">
                    <li>
                      <strong>Vercel:</strong> Project Settings → Environment Variables → Add each variable
                    </li>
                    <li>
                      <strong>GitHub Actions:</strong> Repository Settings → Secrets and variables → Actions → New repository secret
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-hot flex items-center justify-center text-black font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Create Collections & Add Products</h3>
                <p className="text-white/60 mb-3">
                  In Shopify Admin, create these collections (case-insensitive):
                </p>
                <ul className="list-disc list-inside space-y-1 text-white/70 ml-2 mb-3">
                  <li><strong className="text-hot">raw</strong> - Foundation pieces, vests, tees</li>
                  <li><strong className="text-heat">hung</strong> - Body-conscious pieces</li>
                  <li><strong className="text-lime">high</strong> - Statement pieces</li>
                  <li><strong className="text-yellow-400">super</strong> - Extreme designs</li>
                </ul>
                <p className="text-white/60 text-sm">
                  Add products to each collection in Shopify Admin. Products will automatically appear on your site.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-hot flex items-center justify-center text-black font-bold flex-shrink-0">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Restart & Test</h3>
                <p className="text-white/60 mb-3">
                  After configuring environment variables:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-white/70 text-sm ml-2">
                  <li>Restart your development server (<code className="text-lime">npm run dev</code>)</li>
                  <li>Or redeploy to production</li>
                  <li>Refresh this page - products should appear</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="border-t border-white/10 pt-6 mt-6">
            <p className="text-white/60 text-sm">
              <strong className="text-white">Need help?</strong> Check the{' '}
              <a
                href="https://github.com/SICQR/hotmess-london1/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-hot hover:text-heat underline"
              >
                README
              </a>
              {' '}or{' '}
              <a
                href="https://github.com/SICQR/hotmess-london1/blob/main/.env.example"
                target="_blank"
                rel="noopener noreferrer"
                className="text-hot hover:text-heat underline"
              >
                .env.example
              </a>
              {' '}for more details.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
