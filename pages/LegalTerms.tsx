import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface LegalTermsProps {
  onNavigate: (route: string) => void;
}

export function LegalTerms({ onNavigate }: LegalTermsProps) {
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
          Terms of Service
        </h1>
        <p className="text-zinc-500 mb-12">Last updated: November 29, 2025</p>

        <div className="p-6 bg-hotmess-red/10 border-l-4 border-hotmess-red mb-12">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-hotmess-red flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl mb-2">18+ Only, Men Only</h3>
              <p className="text-zinc-300">
                HOTMESS LONDON is an adults-only platform for queer men aged 18 and over.
                By accessing this platform, you confirm you meet these requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">1. Acceptance of Terms</h2>
            <p>
              By accessing or using HOTMESS LONDON ("the Platform"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, you must not access or use the Platform.
            </p>
            <p className="mt-4">
              We reserve the right to update these terms at any time. Continued use of the Platform after
              changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">2. Eligibility</h2>
            <p className="mb-4">You must meet ALL of the following requirements to use HOTMESS LONDON:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Identify as a man (trans men welcome)</li>
              <li>Be part of the queer community</li>
              <li>Not be prohibited from using the Platform by law</li>
              <li>Not have been previously banned from the Platform</li>
            </ul>
            <p className="mt-4">
              <strong className="text-white">We verify age and eligibility.</strong> Providing false information
              will result in immediate account termination.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">3. Account Responsibilities</h2>
            <p className="mb-4">When you create an account, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate, current information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Accept responsibility for all activity under your account</li>
              <li>Not share, sell, or transfer your account to others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">4. Prohibited Conduct</h2>
            <p className="mb-4">You may NOT:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Harass, threaten, or abuse other users</li>
              <li>Post content depicting minors in sexual contexts</li>
              <li>Share personal information of others without consent</li>
              <li>Engage in fraud, scams, or deceptive practices</li>
              <li>Use automated systems (bots) without permission</li>
              <li>Attempt to reverse-engineer or hack the Platform</li>
              <li>Post racist, transphobic, or discriminatory content</li>
              <li>Promote illegal activities or substances</li>
            </ul>
            <p className="mt-4">
              <strong className="text-white">Zero tolerance:</strong> Violations will result in immediate account suspension or termination.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">5. Content & Intellectual Property</h2>
            <p className="mb-4">
              <strong className="text-white">Your Content:</strong> You retain ownership of content you post.
              By posting, you grant us a worldwide, non-exclusive license to use, display, and distribute your
              content on the Platform.
            </p>
            <p className="mb-4">
              <strong className="text-white">Our Content:</strong> All HOTMESS branding, design, code, and
              original content is protected by copyright and may not be used without permission.
            </p>
            <p>
              <strong className="text-white">DMCA:</strong> We respond to copyright infringement claims.
              See our <button onClick={() => onNavigate('?route=dmca')} className="text-hotmess-red underline">DMCA Policy</button>.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">6. Commerce & Transactions</h2>
            <p className="mb-4">
              <strong className="text-white">Shop:</strong> All purchases through /shop are processed by Shopify.
              Returns and refunds follow Shopify's policies.
            </p>
            <p className="mb-4">
              <strong className="text-white">MessMarket:</strong> P2P marketplace transactions are between buyers and sellers.
              We facilitate payments via Stripe Connect but are not responsible for disputes. Platform fees: 12% standard, 20% white-label.
            </p>
            <p className="mb-4">
              <strong className="text-white">Tickets:</strong> Event tickets are peer-to-peer. We do not guarantee event quality or validity.
              Sellers must honor legitimate sales.
            </p>
            <p>
              <strong className="text-white">Records:</strong> Music purchases are final. Downloads are for personal use only—no redistribution.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">7. Aftercare & Harm Reduction</h2>
            <p>
              HOTMESS provides aftercare resources and harm reduction information, but we are NOT medical professionals.
              Our care content is educational only and does not replace professional medical or mental health care.
            </p>
            <p className="mt-4">
              See our <button onClick={() => onNavigate('?route=legalCareDisclaimer')} className="text-hotmess-red underline">Care Disclaimer</button> for full details.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">8. Privacy & Data</h2>
            <p>
              We take your privacy seriously. Read our{' '}
              <button onClick={() => onNavigate('?route=legalPrivacy')} className="text-hotmess-red underline">Privacy Policy</button>{' '}
              to understand how we collect, use, and protect your data.
            </p>
            <p className="mt-4">
              <strong className="text-white">GDPR/CCPA Rights:</strong> You can request data export, deletion, or correction.
              Visit our <button onClick={() => onNavigate('?route=dataPrivacy')} className="text-hotmess-red underline">Data & Privacy Hub</button>.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">9. Disclaimers & Limitations</h2>
            <p className="mb-4">
              <strong className="text-white">AS-IS:</strong> The Platform is provided "as is" without warranties of any kind.
            </p>
            <p className="mb-4">
              <strong className="text-white">Availability:</strong> We do not guarantee uninterrupted access. The Platform may
              go down for maintenance or experience outages.
            </p>
            <p>
              <strong className="text-white">Third Parties:</strong> We are not responsible for third-party services
              (Shopify, Stripe, Supabase) or their availability.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, HOTMESS LONDON and its operators shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or goodwill</li>
              <li>Damages arising from user conduct or content</li>
              <li>Issues with P2P transactions, events, or third-party services</li>
            </ul>
            <p className="mt-4">
              <strong className="text-white">Maximum liability:</strong> £100 or the amount you paid us in the last 12 months,
              whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">11. Termination</h2>
            <p className="mb-4">
              We may suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Harassment or abuse of other users</li>
              <li>Prolonged inactivity (12+ months)</li>
            </ul>
            <p className="mt-4">
              You may close your account at any time via{' '}
              <button onClick={() => onNavigate('?route=dataPrivacyDelete')} className="text-hotmess-red underline">Data & Privacy Hub</button>.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of England and Wales. Disputes shall be resolved in UK courts.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">13. Contact</h2>
            <p>
              Questions about these Terms? Contact us:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong className="text-white">Email:</strong> legal@hotmess.london</li>
              <li><strong className="text-white">Support:</strong> <button onClick={() => onNavigate('?route=care')} className="text-hotmess-red underline">Care Hub</button></li>
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
            <button onClick={() => onNavigate('?route=legalPrivacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('?route=legalCookies')} className="hover:text-white transition-colors">
              Cookie Policy
            </button>
            <button onClick={() => onNavigate('?route=legalCareDisclaimer')} className="hover:text-white transition-colors">
              Care Disclaimer
            </button>
            <button onClick={() => onNavigate('?route=legal18Plus')} className="hover:text-white transition-colors">
              18+ Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
