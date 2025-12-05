import { ArrowLeft, Shield, Eye, Lock, Database, UserX } from 'lucide-react';

interface LegalPrivacyProps {
  onNavigate: (route: string) => void;
}

export function LegalPrivacy({ onNavigate }: LegalPrivacyProps) {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-24 py-16">
      <button
        onClick={() => onNavigate('?route=legal')}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Legal
      </button>

      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-7xl uppercase tracking-tight mb-4" style={{ fontWeight: 900 }}>
          Privacy Policy
        </h1>
        <p className="text-zinc-500 mb-12">Last updated: November 29, 2025</p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <button
            onClick={() => onNavigate('?route=dataPrivacyExport')}
            className="p-4 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-center"
          >
            <Database className="w-6 h-6 text-hotmess-red mx-auto mb-2" />
            <div className="text-sm">Export Data</div>
          </button>

          <button
            onClick={() => onNavigate('?route=dataPrivacyDsar')}
            className="p-4 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-center"
          >
            <Eye className="w-6 h-6 text-hotmess-red mx-auto mb-2" />
            <div className="text-sm">DSAR Request</div>
          </button>

          <button
            onClick={() => onNavigate('?route=dataPrivacyDelete')}
            className="p-4 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-center"
          >
            <UserX className="w-6 h-6 text-hotmess-red mx-auto mb-2" />
            <div className="text-sm">Delete Account</div>
          </button>

          <button
            onClick={() => onNavigate('?route=legalCookies')}
            className="p-4 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors text-center"
          >
            <Lock className="w-6 h-6 text-hotmess-red mx-auto mb-2" />
            <div className="text-sm">Cookie Policy</div>
          </button>
        </div>

        <div className="space-y-12 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Our Commitment</h2>
            <p>
              At HOTMESS LONDON, your privacy isn't an afterthought—it's foundational. We collect only what we need,
              protect what we collect, and give you full control over your data.
            </p>
            <p className="mt-4">
              <strong className="text-white">We do NOT:</strong> Sell your data • Share with advertisers • Track you across the web • Use facial recognition
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">1. What We Collect</h2>
            
            <h3 className="text-xl text-white mb-3 mt-6">Account Information</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email address (required for login)</li>
              <li>Username/display name</li>
              <li>Age verification data (18+ proof)</li>
              <li>Profile photo (optional)</li>
              <li>Bio and preferences (optional)</li>
            </ul>

            <h3 className="text-xl text-white mb-3 mt-6">Activity Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pages you visit</li>
              <li>Products you view or purchase</li>
              <li>Events you attend or list</li>
              <li>Messages you send (encrypted)</li>
              <li>Content you post or upload</li>
            </ul>

            <h3 className="text-xl text-white mb-3 mt-6">Technical Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP address</li>
              <li>Device type and browser</li>
              <li>Location data (city-level, for events)</li>
              <li>Session cookies</li>
            </ul>

            <h3 className="text-xl text-white mb-3 mt-6">Payment Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Transaction history</li>
              <li>Shipping address (for physical goods)</li>
              <li><strong className="text-white">We do NOT store card details—Stripe and Shopify handle payments</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">2. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Provide the Platform:</strong> Account management, transactions, messaging</li>
              <li><strong className="text-white">Improve UX:</strong> Analytics to understand what works (anonymized)</li>
              <li><strong className="text-white">Safety & Moderation:</strong> Detect fraud, abuse, or ToS violations</li>
              <li><strong className="text-white">Communications:</strong> Order confirmations, security alerts, updates (you can opt out of marketing)</li>
              <li><strong className="text-white">Legal Compliance:</strong> Age verification, GDPR/CCPA requests, law enforcement (only when legally required)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">3. Who We Share Data With</h2>
            
            <h3 className="text-xl text-white mb-3 mt-6">Service Providers</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Supabase:</strong> Database and auth (EU-hosted)</li>
              <li><strong className="text-white">Stripe:</strong> Payment processing</li>
              <li><strong className="text-white">Shopify:</strong> E-commerce for /shop</li>
              <li><strong className="text-white">Vercel/Cloudflare:</strong> Hosting and CDN</li>
            </ul>

            <h3 className="text-xl text-white mb-3 mt-6">Legal Requirements</h3>
            <p className="ml-4">
              We may disclose data if required by law, court order, or to prevent harm. We will notify you unless prohibited.
            </p>

            <h3 className="text-xl text-white mb-3 mt-6">We NEVER</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sell your data to third parties</li>
              <li>Share with advertisers or data brokers</li>
              <li>Use your data for AI training without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">4. Your Rights (GDPR/CCPA)</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Access:</strong> Request a copy of all your data</li>
              <li><strong className="text-white">Correction:</strong> Update inaccurate information</li>
              <li><strong className="text-white">Deletion:</strong> Request account and data deletion</li>
              <li><strong className="text-white">Portability:</strong> Export your data in JSON format</li>
              <li><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing emails</li>
              <li><strong className="text-white">Object:</strong> Stop certain data processing activities</li>
            </ul>
            <p className="mt-4">
              Exercise your rights via our{' '}
              <button onClick={() => onNavigate('?route=dataPrivacy')} className="text-hotmess-red underline">Data & Privacy Hub</button>.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">5. Data Retention</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Active accounts:</strong> Data retained while your account is active</li>
              <li><strong className="text-white">Deleted accounts:</strong> Data purged within 30 days (except legal/financial records)</li>
              <li><strong className="text-white">Transaction records:</strong> Kept for 7 years (legal requirement)</li>
              <li><strong className="text-white">Backups:</strong> Deleted data may persist in backups for up to 90 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">6. Security</h2>
            <p className="mb-4">We protect your data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>End-to-end encryption for messages</li>
              <li>HTTPS everywhere</li>
              <li>Regular security audits</li>
              <li>Row-level security on database</li>
              <li>2FA support (coming soon)</li>
            </ul>
            <p className="mt-4">
              <strong className="text-white">No system is 100% secure.</strong> If you believe your account has been compromised,
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">7. Cookies & Tracking</h2>
            <p>
              We use minimal cookies for functionality (login, preferences). No third-party ad trackers.
              See our <button onClick={() => onNavigate('?route=legalCookies')} className="text-hotmess-red underline">Cookie Policy</button> for details.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">8. Children's Privacy</h2>
            <p>
              HOTMESS is 18+ only. We do not knowingly collect data from minors. If we discover a user is underage,
              we will immediately delete their account and data.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">9. International Transfers</h2>
            <p>
              Your data is primarily stored in the EU (Supabase). Some service providers (Stripe, Shopify) may process
              data in the US under standard contractual clauses.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">10. Changes to This Policy</h2>
            <p>
              We may update this policy. Significant changes will be announced via email or site banner. Continued use
              after changes = acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">11. Contact & Data Protection Officer</h2>
            <ul className="list-none space-y-2 mt-4">
              <li><strong className="text-white">Email:</strong> privacy@hotmess.london</li>
              <li><strong className="text-white">DPO:</strong> dpo@hotmess.london</li>
              <li><strong className="text-white">Postal:</strong> HOTMESS LONDON, Vauxhall, London, UK</li>
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
            <button onClick={() => onNavigate('?route=legalTerms')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('?route=legalCookies')} className="hover:text-white transition-colors">
              Cookie Policy
            </button>
            <button onClick={() => onNavigate('?route=dataPrivacy')} className="hover:text-white transition-colors">
              Data & Privacy Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
