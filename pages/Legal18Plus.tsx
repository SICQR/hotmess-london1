/**
 * 18+ AGE POLICY - PROPER NIGHTLIFE ENTRANCE
 * Not a boring legal doc - an experience
 */

import { RouteId } from '../lib/routes';

interface Legal18PlusProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function Legal18Plus({ onNavigate }: Legal18PlusProps) {
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
            <div className="space-y-6 text-white/90">
              <div className="flex items-start gap-4">
                <div className="text-hot" style={{ fontWeight: 900, fontSize: '48px', lineHeight: 1 }}>1</div>
                <div className="flex-1">
                  <div className="text-white mb-2" style={{ fontWeight: 900, fontSize: '20px' }}>
                    You must be 18 or older.
                  </div>
                  <div className="text-white/70 text-base leading-relaxed">
                    No exceptions. No excuses. If you're underage, leave now. Lying about your age is a crime.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-hot" style={{ fontWeight: 900, fontSize: '48px', lineHeight: 1 }}>2</div>
                <div className="flex-1">
                  <div className="text-white mb-2" style={{ fontWeight: 900, fontSize: '20px' }}>
                    You must be a man.
                  </div>
                  <div className="text-white/70 text-base leading-relaxed">
                    This is a men-only space. Trans men are men—welcome. If you don't identify as a man, there are other platforms.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-hot" style={{ fontWeight: 900, fontSize: '48px', lineHeight: 1 }}>3</div>
                <div className="flex-1">
                  <div className="text-white mb-2" style={{ fontWeight: 900, fontSize: '20px' }}>
                    Consent is mandatory.
                  </div>
                  <div className="text-white/70 text-base leading-relaxed">
                    By entering, you consent to viewing adult content and interacting with this community. You can leave anytime.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How We Verify */}
          <div className="bg-white/5 border border-white/20 p-8 md:p-12">
            <h2 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              HOW WE VERIFY
            </h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                We use <span className="text-hot font-bold">cookie-based age confirmation</span>. When you click "I'm 18+", you're making a legal declaration that you meet the age requirement.
              </p>
              <p>
                We log the timestamp of your consent, but we <span className="text-hot font-bold">DO NOT</span> store your birthdate, ID documents, or any identifying information related to age verification.
              </p>
              <p className="text-white/60 text-sm">
                Your privacy matters. We verify age, not identity.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/70 text-sm">
                  For high-risk purchases (tickets to 18+ venues, certain products), we may request additional verification. This is processed securely and deleted immediately after confirmation.
                </p>
              </div>
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
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Ban their account permanently</strong> — no appeals, no exceptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Delete all their data</strong> — within 24 hours, GDPR-compliant</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Block their device</strong> — IP ban to prevent re-registration</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Report to authorities</strong> — if legally required or if harm occurred</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-hot/10 border border-hot/30">
                <p className="text-white/70 text-sm leading-relaxed">
                  <strong className="text-hot">We take this seriously.</strong> Lying about your age is a violation of our Terms of Service and potentially a violation of law. Don't risk it.
                </p>
              </div>
            </div>
          </div>

          {/* For Minors */}
          <div className="bg-white/5 border border-white/20 p-8 md:p-12">
            <h2 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              IF YOU'RE UNDER 18
            </h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p className="text-lg text-white">
                <strong>Do not attempt to access HOTMESS.</strong>
              </p>
              <p>
                If you're a minor who has already accessed the platform, log out immediately. Contact us at <span className="text-hot font-bold">safety@hotmess.london</span> to have your data purged.
              </p>
              <p className="text-white/60 text-sm">
                We will not pursue legal action if you self-report and exit voluntarily. But continuing to use the platform after reading this is a serious violation.
              </p>
            </div>
          </div>

          {/* For Parents */}
          <div className="bg-white/5 border border-white/20 p-8 md:p-12">
            <h2 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              FOR PARENTS & GUARDIANS
            </h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                If you discover your child has accessed HOTMESS:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Contact us immediately at <strong className="text-hot">safety@hotmess.london</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Provide the username/email used</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>We will delete the account and all data within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-hot rounded-full mt-2 flex-shrink-0" />
                  <span>Consider using parental control software (Net Nanny, Qustodio)</span>
                </li>
              </ul>
              <p className="text-white/70 text-sm mt-4">
                We will cooperate fully with parents to remove access. Minors should not be on this platform.
              </p>
            </div>
          </div>

          {/* International */}
          <div className="bg-white/5 border border-white/20 p-8 md:p-12">
            <h2 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '24px' }}>
              INTERNATIONAL USERS
            </h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                HOTMESS is UK-based but accessible internationally. <strong className="text-white">You must comply with the age laws of your country</strong>:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white/5 border border-white/10">
                  <strong className="text-white">UK:</strong> 18+ (our baseline)
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <strong className="text-white">EU:</strong> 18+ minimum
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <strong className="text-white">US:</strong> 18+ federally, 21+ in some states
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <strong className="text-white">Other:</strong> Check local laws
                </div>
              </div>
              <p className="text-hot text-sm font-bold">
                If your country requires a higher age (e.g., 21+), that applies to you. No exceptions.
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate('legal')}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-hot text-white uppercase tracking-wider transition-all"
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              ← Back to Legal Hub
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-10 py-4 bg-hot hover:bg-white text-white hover:text-black uppercase tracking-wider transition-all"
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              Enter Platform →
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center text-white/40 text-sm space-y-2">
            <p>Questions? Email <span className="text-hot">legal@hotmess.london</span></p>
            <p>Safety concerns? Email <span className="text-hot">safety@hotmess.london</span></p>
            <p className="mt-4">HOTMESS LONDON · Men 18+ · Care-First Nightlife OS</p>
            <p className="text-xs">Last updated: November 29, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
