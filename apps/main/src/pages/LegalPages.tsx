// All Legal & Privacy pages
import { PageTemplate } from '../components/PageTemplate';
import { RouteId } from '../lib/routes';
import { Shield, FileText, Cookie, Heart, Users, Download, Trash, FileCheck, Flag, Scale } from 'lucide-react';
import { motion } from 'motion/react';
import { mockUser } from '../lib/mockData';

type NavFunction = (route: RouteId, params?: Record<string, string>) => void;

// LEGAL HUB
export function LegalHub({ onNavigate }: { onNavigate: NavFunction }) {
  const legalPages = [
    { route: 'legalTerms' as RouteId, title: 'Terms of Service', description: 'Rules for using HOTMESS' },
    { route: 'legalPrivacy' as RouteId, title: 'Privacy Policy', description: 'How we handle your data' },
    { route: 'legalCookies' as RouteId, title: 'Cookie Policy', description: 'Cookies & tracking' },
    { route: 'legalCareDisclaimer' as RouteId, title: 'Care Disclaimer', description: 'Limits of our care resources' },
    { route: 'legal18Plus' as RouteId, title: '18+ Age Policy', description: 'Age verification requirements' },
  ];

  return (
    <PageTemplate title="Legal Hub" subtitle="Policies, terms, and trust documentation" icon={Scale} onNavigate={onNavigate}>
      <div className="max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legalPages.map((page, i) => (
            <motion.button
              key={page.route}
              onClick={() => onNavigate(page.route)}
              className="bg-white/5 border border-white/20 hover:border-hot p-8 text-left transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3 className="text-white uppercase tracking-wider mb-3" style={{ fontWeight: 900 }}>{page.title}</h3>
              <p className="text-white/60 text-sm">{page.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Additional links */}
        <div className="mt-12 pt-12 border-t border-white/10">
          <h2 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '20px' }}>
            Data & Privacy
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('dataPrivacy')}
              className="bg-hot/10 border border-hot/30 p-6 text-left hover:bg-hot/20 transition-all"
            >
              <h3 className="text-hot uppercase tracking-wider mb-2" style={{ fontWeight: 900 }}>Data & Privacy Hub</h3>
              <p className="text-white/60 text-sm">Manage your data rights (DSAR, export, delete)</p>
            </button>
            <button
              onClick={() => onNavigate('ugcModeration')}
              className="bg-white/5 border border-white/20 hover:border-hot p-6 text-left transition-all"
            >
              <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900 }}>UGC Moderation Policy</h3>
              <p className="text-white/60 text-sm">How we moderate user content</p>
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

// LEGAL TERMS
export function LegalTerms({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Terms of Service" subtitle="Last updated: November 25, 2025" icon={FileText} backRoute="legal" backLabel="Legal Hub" onNavigate={onNavigate}>
      <div className="max-w-4xl prose prose-invert prose-lg">
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>1. Acceptance of Terms</h2>
            <p>By accessing HOTMESS LONDON ("the Service"), you agree to be bound by these Terms of Service. If you don't agree, don't use the Service.</p>
          </section>

          <section>
            <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>2. Age Requirement</h2>
            <p>You must be 18 or older to use this Service. By using HOTMESS, you confirm you are at least 18 years old.</p>
          </section>

          <section>
            <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>3. User Conduct</h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post non-consensual content</li>
              <li>Harass, threaten, or dox other users</li>
              <li>Share content involving minors</li>
              <li>Engage in scams or fraud</li>
              <li>Violate others' intellectual property</li>
            </ul>
          </section>

          <section>
            <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>4. Content Moderation</h2>
            <p>We reserve the right to remove content and ban users who violate these terms. See our UGC Moderation Policy for details.</p>
          </section>

          <section>
            <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>5. Disclaimers</h2>
            <p>HOTMESS provides information and community resources. We are NOT providing medical, legal, or professional advice. Use at your own risk.</p>
          </section>

          <section>
            <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>6. Contact</h2>
            <p>Questions? Email legal@hotmesslondon.com</p>
          </section>
        </div>
      </div>
    </PageTemplate>
  );
}

// PRIVACY POLICY
export function LegalPrivacy({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Privacy Policy" subtitle="How we collect, use, and protect your data" icon={Shield} backRoute="legal" backLabel="Legal Hub" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-8 text-white/80 leading-relaxed">
        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>What we collect</h2>
          <ul className="space-y-2">
            <li>• Email address (for account creation)</li>
            <li>• Display name (optional)</li>
            <li>• Order history (if you shop with us)</li>
            <li>• IP address hash (for abuse prevention only)</li>
            <li>• Cookie preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>What we DON'T collect</h2>
          <ul className="space-y-2">
            <li>• Real names (unless you provide them)</li>
            <li>• Location tracking (except MessMap beacon opt-in)</li>
            <li>• Browsing history outside HOTMESS</li>
          </ul>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>How we use your data</h2>
          <ul className="space-y-2">
            <li>• To provide the Service (radio, shop, community)</li>
            <li>• To process orders via Stripe</li>
            <li>• To respond to abuse reports</li>
            <li>• To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Your rights (GDPR)</h2>
          <p>You have the right to:</p>
          <ul className="space-y-2">
            <li>• Access your data (DSAR)</li>
            <li>• Export your data</li>
            <li>• Delete your data</li>
            <li>• Rectify incorrect data</li>
            <li>• Withdraw consent</li>
          </ul>
          <button
            onClick={() => onNavigate('dataPrivacy')}
            className="mt-4 bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all"
            style={{ fontWeight: 900 }}
          >
            Manage My Data
          </button>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Third parties</h2>
          <ul className="space-y-2">
            <li>• Stripe (payment processing)</li>
            <li>• RadioKing (radio streaming)</li>
            <li>• Vercel (hosting)</li>
            <li>• Supabase (database)</li>
          </ul>
          <p className="mt-4">We share ONLY what's necessary for these services to function.</p>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Contact</h2>
          <p>privacy@hotmesslondon.com</p>
        </section>
      </div>
    </PageTemplate>
  );
}

// COOKIE POLICY
export function LegalCookies({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Cookie Policy" subtitle="How we use cookies and tracking" icon={Cookie} backRoute="legal" backLabel="Legal Hub" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-8 text-white/80 leading-relaxed">
        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Essential Cookies</h2>
          <p>These are required for the site to work. You cannot opt out.</p>
          <ul className="space-y-2 mt-4">
            <li>• <code className="text-hot">age18</code> — age verification (1 year)</li>
            <li>• <code className="text-hot">session</code> — login session (30 days)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Analytics Cookies</h2>
          <p>We use minimal analytics to understand usage. You can opt out.</p>
          <ul className="space-y-2 mt-4">
            <li>• <code className="text-hot">_analytics</code> — anonymous usage data (90 days)</li>
          </ul>
          <button
            onClick={() => onNavigate('accountConsents')}
            className="mt-4 bg-white/10 border border-white/20 hover:border-hot px-6 py-3 text-white uppercase tracking-wider transition-all"
            style={{ fontWeight: 700 }}
          >
            Manage Cookie Preferences
          </button>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Third-Party Cookies</h2>
          <p>Some services (Stripe, RadioKing) set their own cookies. Check their policies:</p>
          <ul className="space-y-2 mt-4">
            <li>• <a href="https://stripe.com/privacy" className="text-hot hover:text-white" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a></li>
            <li>• <a href="https://www.radioking.com/privacy" className="text-hot hover:text-white" target="_blank" rel="noopener noreferrer">RadioKing Privacy Policy</a></li>
          </ul>
        </section>
      </div>
    </PageTemplate>
  );
}

// CARE DISCLAIMER
export function LegalCareDisclaimer({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Care Disclaimer" subtitle="Important information about our care resources" icon={Heart} backRoute="legal" backLabel="Legal Hub" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-8">
        <div className="bg-hot/10 border border-hot/30 p-8">
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>This is NOT medical advice</h2>
          <p className="text-white/80 leading-relaxed">
            HOTMESS provides community resources, peer support, and information. We are NOT a medical service, mental health provider, or crisis intervention team.
          </p>
        </div>

        <section className="text-white/80 leading-relaxed space-y-4">
          <h3 className="text-white uppercase tracking-wider" style={{ fontWeight: 900 }}>What we provide</h3>
          <ul className="space-y-2">
            <li>• Links to professional services (sexual health, mental health, harm reduction)</li>
            <li>• Peer support community forums</li>
            <li>• Educational content (not medical advice)</li>
          </ul>
        </section>

        <section className="text-white/80 leading-relaxed space-y-4">
          <h3 className="text-white uppercase tracking-wider" style={{ fontWeight: 900 }}>Emergency situations</h3>
          <p>If you or someone else is in immediate danger:</p>
          <div className="bg-white/5 border border-white/20 p-6">
            <ul className="space-y-2">
              <li>🚨 <strong>UK Emergency:</strong> 999</li>
              <li>💬 <strong>Samaritans (crisis):</strong> 116 123 (24/7)</li>
              <li>📱 <strong>Shout (text crisis):</strong> Text SHOUT to 85258</li>
            </ul>
          </div>
        </section>

        <section className="text-white/80 leading-relaxed space-y-4">
          <h3 className="text-white uppercase tracking-wider" style={{ fontWeight: 900 }}>Use at your own risk</h3>
          <p>
            We do our best to keep resources accurate and up-to-date, but we cannot guarantee the accuracy, completeness, or effectiveness of any information provided. Always consult a qualified professional for medical, mental health, or legal advice.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
}

// 18+ POLICY - REBUILT AS PROPER NIGHTLIFE ENTRANCE
export function Legal18Plus({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-hot/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-hot/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-3xl w-full space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="text-hot uppercase tracking-widest mb-4" style={{ fontWeight: 700, fontSize: '12px' }}>
              ADULTS ONLY
            </div>
            <h1 
              className="uppercase tracking-[-0.03em] leading-[0.85] text-white"
              style={{ fontWeight: 900, fontSize: 'clamp(48px, 12vw, 120px)' }}
            >
              MEN ONLY.
              <br />
              <span className="text-hot">18+.</span>
              <br />
              NO EXCEPTIONS.
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
              This is a masculine queer nightlife OS. If you're not a man, if you're not 18+, or if you're not ready for explicit content — this isn't your space.
            </p>
          </div>

          {/* What You'll Find */}
          <div className="bg-white/5 border border-white/20 p-8 md:p-12">
            <h2 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              WHAT YOU'LL FIND HERE
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-white/70">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Explicit language</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Sexual health information</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Kink aesthetics & themes</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Harm reduction content</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>User-generated NSFW content</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Adult products & gear</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Nightlife & party culture</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Brotherhood without apology</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-hot/10 border-2 border-hot p-8 md:p-12">
            <h2 className="text-hot uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              THE RULES
            </h2>
            <div className="space-y-4 text-white/90 text-lg">
              <div className="flex items-start gap-4">
                <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px', lineHeight: 1 }}>1</div>
                <div>
                  <div className="font-bold mb-1">You must be 18 or older.</div>
                  <div className="text-white/70 text-base">No exceptions. No excuses. If you're underage, leave now.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px', lineHeight: 1 }}>2</div>
                <div>
                  <div className="font-bold mb-1">You must be a man.</div>
                  <div className="text-white/70 text-base">This is a men-only space. If that's not you, there are other platforms.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-hot" style={{ fontWeight: 900, fontSize: '32px', lineHeight: 1 }}>3</div>
                <div>
                  <div className="font-bold mb-1">Consent is mandatory.</div>
                  <div className="text-white/70 text-base">By entering, you consent to viewing adult content and interacting with this community.</div>
                </div>
              </div>
            </div>
          </div>

          {/* How We Verify */}
          <div className="bg-white/5 border border-white/20 p-8 md:p-12">
            <h2 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              HOW WE VERIFY
            </h2>
            <div className="space-y-4 text-white/80">
              <p>
                We use <span className="text-hot font-bold">cookie-based age confirmation</span>. When you click "I'm 18+", you're making a legal declaration that you meet the age requirement.
              </p>
              <p>
                We log the timestamp of your consent, but we <span className="text-hot font-bold">DO NOT</span> store your birthdate, ID documents, or any identifying information related to age verification.
              </p>
              <p className="text-white/60 text-sm">
                Your privacy matters. We verify age, not identity.
              </p>
            </div>
          </div>

          {/* Enforcement */}
          <div className="bg-black border-2 border-hot p-8 md:p-12">
            <h2 className="text-hot uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              ENFORCEMENT
            </h2>
            <div className="space-y-4 text-white/90">
              <p className="text-lg">
                If we discover a user is under 18, we will <span className="text-hot font-bold">immediately</span>:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Ban their account permanently</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Delete all their data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Block their device from re-registering</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Report to authorities if legally required</span>
                </li>
              </ul>
              <p className="text-white/70 text-sm mt-6">
                We take this seriously. Lying about your age is a violation of our Terms of Service and potentially a violation of law.
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => onNavigate('legal')}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-hot text-white uppercase tracking-wider transition-all"
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              ← Back to Legal Hub
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center text-white/40 text-sm">
            <p>Questions? Email <span className="text-hot">legal@hotmess.london</span></p>
            <p className="mt-2">HOTMESS LONDON · Men 18+ · Care-First Nightlife OS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Checkout & Order pages
export function Checkout({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Checkout" subtitle="Powered by Stripe" backRoute="shopCart" backLabel="Back to Cart" onNavigate={onNavigate}>
      <div className="max-w-4xl">
        <div className="bg-white/5 border border-white/20 p-12 text-center">
          <p className="text-white/60 mb-6">In production, this redirects to Stripe Checkout.</p>
          <button
            onClick={() => onNavigate('shopOrder', { id: 'ORD-2025-0847' })}
            className="bg-hot hover:bg-white text-white hover:text-black px-8 py-4 uppercase tracking-wider transition-all"
            style={{ fontWeight: 900 }}
          >
            Simulate Payment Success
          </button>
        </div>
      </div>
    </PageTemplate>
  );
}

export function OrderPage({ orderId, onNavigate }: { orderId: string; onNavigate: NavFunction }) {
  return (
    <PageTemplate title={`Order ${orderId}`} subtitle="Order confirmed" backRoute="accountOrders" backLabel="My Orders" onNavigate={onNavigate}>
      <div className="max-w-4xl">
        <div className="bg-white/5 border border-white/20 p-8">
          <h3 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>Thank you!</h3>
          <p className="text-white/60">Your order has been confirmed. You'll receive a shipping confirmation soon.</p>
        </div>
      </div>
    </PageTemplate>
  );
}
