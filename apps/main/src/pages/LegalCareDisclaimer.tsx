import { ArrowLeft, Heart, AlertTriangle, Phone, ExternalLink } from 'lucide-react';

import { RouteId } from '../lib/routes';

interface LegalCareDisclaimerProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function LegalCareDisclaimer({ onNavigate }: LegalCareDisclaimerProps) {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-24 py-16">
      <button
        onClick={() => onNavigate('legal')}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Legal
      </button>

      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-7xl uppercase tracking-tight mb-4" style={{ fontWeight: 900 }}>
          Care Disclaimer
        </h1>
        <p className="text-zinc-500 mb-12">Last updated: November 29, 2025</p>

        {/* Critical Notice */}
        <div className="p-8 bg-gradient-to-br from-hotmess-red/20 to-black border-2 border-hotmess-red mb-12">
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-hotmess-red flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl mb-3 text-hotmess-red">We're Care-First, Not Caregivers</h2>
              <p className="text-zinc-300 mb-4">
                HOTMESS LONDON provides educational resources about harm reduction, sexual health, 
                consent, and aftercare. <strong className="text-white">We are NOT medical professionals, 
                therapists, or emergency services.</strong>
              </p>
              <p className="text-zinc-300">
                Our care content is designed to empower you with knowledge—not replace professional help.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">What We Provide</h2>
            <p className="mb-4">HOTMESS care resources include:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Harm reduction information:</strong> Safe substance use, testing, overdose prevention</li>
              <li><strong className="text-white">Sexual health education:</strong> STI prevention, PrEP/PEP, safe sex practices</li>
              <li><strong className="text-white">Consent frameworks:</strong> Negotiation, boundaries, communication in kink contexts</li>
              <li><strong className="text-white">Aftercare guides:</strong> Physical and emotional recovery after parties, scenes, or intense experiences</li>
              <li><strong className="text-white">Mental health resources:</strong> Links to professional services, crisis hotlines, support groups</li>
              <li><strong className="text-white">Community support:</strong> Peer-to-peer forums (not professional counseling)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">What We Are NOT</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Medical professionals:</strong> We cannot diagnose, treat, or prescribe</li>
              <li><strong className="text-white">Therapists:</strong> Our community support is not a substitute for therapy</li>
              <li><strong className="text-white">Emergency services:</strong> In crisis, call 999 or go to A&E</li>
              <li><strong className="text-white">Legal advisors:</strong> We provide info, not legal advice</li>
              <li><strong className="text-white">Drug treatment services:</strong> We can direct you to them, but we're not one</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Harm Reduction Disclaimer</h2>
            <div className="p-6 bg-orange-950/30 border-l-4 border-orange-500 mb-4">
              <p className="mb-4">
                <strong className="text-white">Harm reduction is NOT encouragement to use substances.</strong> 
                It's a realistic approach that acknowledges people make choices, and we want them to survive those choices.
              </p>
            </div>
            <p className="mb-4">Our substance harm reduction content includes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Testing and dosing information</li>
              <li>Overdose recognition and naloxone guidance</li>
              <li>Drug interaction warnings</li>
              <li>Safer use practices</li>
              <li>Links to addiction support services</li>
            </ul>
            <p className="mt-4">
              <strong className="text-white">We do NOT:</strong> Sell substances • Encourage use • Provide medical clearance • Guarantee safety
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Sexual Health Disclaimer</h2>
            <p className="mb-4">
              Our sexual health content covers STI prevention, testing, PrEP, condoms, and safe practices. 
              This is <strong className="text-white">educational only</strong>—not medical advice.
            </p>
            <p className="mb-4">
              <strong className="text-white">Always:</strong> Get tested regularly • Consult a sexual health clinic for PrEP/PEP • 
              Discuss your history with partners • Use protection appropriate to your risk level
            </p>
            <p>
              <strong className="text-white">UK Sexual Health Clinics:</strong> Free, confidential, no judgment. 
              Find your nearest clinic at <a href="https://www.nhs.uk/service-search/sexual-health" target="_blank" rel="noopener noreferrer" className="text-hotmess-red underline">NHS Sexual Health Services</a>.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Kink & Consent Disclaimer</h2>
            <p className="mb-4">
              HOTMESS embraces kink culture. Our consent and scene safety resources are based on community best practices, 
              but <strong className="text-white">we are not kink educators or dungeon monitors</strong>.
            </p>
            <p className="mb-4">Key principles we advocate:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">SSC (Safe, Sane, Consensual)</strong> or <strong className="text-white">RACK (Risk-Aware Consensual Kink)</strong></li>
              <li><strong className="text-white">Negotiation before play:</strong> Discuss limits, safewords, aftercare needs</li>
              <li><strong className="text-white">Aftercare is mandatory:</strong> Physical and emotional check-ins post-scene</li>
              <li><strong className="text-white">Consent can be withdrawn:</strong> At any time, for any reason</li>
              <li><strong className="text-white">Education is ongoing:</strong> Learn from workshops, mentors, community</li>
            </ul>
            <p className="mt-4">
              <strong className="text-white">If something feels wrong, it probably is.</strong> Trust your instincts. 
              Kink should be empowering, not exploitative.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Mental Health Disclaimer</h2>
            <p className="mb-4">
              We link to mental health resources and encourage seeking professional help. Our community forums are 
              <strong className="text-white"> peer support, not therapy</strong>.
            </p>
            <p className="mb-4">
              <strong className="text-white">If you're in crisis:</strong>
            </p>
            <div className="p-6 bg-zinc-900 border border-white/10 space-y-3">
              <div>
                <strong className="text-hotmess-red">Samaritans (24/7):</strong> 116 123 (free from any phone)
              </div>
              <div>
                <strong className="text-hotmess-red">NHS Mental Health Crisis:</strong> Call 111, option 2
              </div>
              <div>
                <strong className="text-hotmess-red">LGBT+ Switchboard:</strong> 0300 330 0630
              </div>
              <div>
                <strong className="text-hotmess-red">Emergency:</strong> 999 or go to A&E
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Product Disclaimers</h2>
            <p className="mb-4">
              <strong className="text-white">Hand N Hand (HNH MESS):</strong> Our lube and aftercare products are for 
              personal use. Follow manufacturer instructions. We're not liable for allergic reactions or misuse.
            </p>
            <p className="mb-4">
              <strong className="text-white">Shop items:</strong> Clothing and accessories are fashion, not medical devices. 
              Items with kink aesthetics (harnesses, hoods) require user knowledge of safe use.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Community Support Disclaimer</h2>
            <p className="mb-4">
              Our forums and community features connect you with other users. <strong className="text-white">This is NOT 
              professional counseling or medical advice</strong>.
            </p>
            <p className="mb-4">Community guidelines:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Share experiences, not medical diagnoses</li>
              <li>Suggest resources, not treatment plans</li>
              <li>Be supportive, not prescriptive</li>
              <li>Report harmful content immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Liability Limitations</h2>
            <p className="mb-4">
              By using HOTMESS care resources, you acknowledge:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Information is educational, not medical/legal advice</li>
              <li>You are responsible for your own choices and safety</li>
              <li>HOTMESS is not liable for outcomes from using our resources</li>
              <li>Professional help is always recommended for medical, mental health, or legal issues</li>
              <li>Harm reduction resources are not guarantees of safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Emergency Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-900 border border-white/10">
              <div>
                <h4 className="text-lg mb-2 text-hotmess-red">Medical Emergency</h4>
                <p className="text-2xl mb-2">999</p>
                <p className="text-sm text-zinc-500">Ambulance, police, fire</p>
              </div>
              <div>
                <h4 className="text-lg mb-2 text-hotmess-red">Mental Health Crisis</h4>
                <p className="text-2xl mb-2">111 (option 2)</p>
                <p className="text-sm text-zinc-500">NHS urgent mental health</p>
              </div>
              <div>
                <h4 className="text-lg mb-2 text-hotmess-red">Samaritans</h4>
                <p className="text-2xl mb-2">116 123</p>
                <p className="text-sm text-zinc-500">24/7 emotional support</p>
              </div>
              <div>
                <h4 className="text-lg mb-2 text-hotmess-red">Sexual Assault</h4>
                <p className="text-2xl mb-2">0808 802 9999</p>
                <p className="text-sm text-zinc-500">Rape Crisis (24/7)</p>
              </div>
              <div>
                <h4 className="text-lg mb-2 text-hotmess-red">LGBT+ Support</h4>
                <p className="text-2xl mb-2">0300 330 0630</p>
                <p className="text-sm text-zinc-500">Switchboard (10am-10pm)</p>
              </div>
              <div>
                <h4 className="text-lg mb-2 text-hotmess-red">Drug Support</h4>
                <p className="text-2xl mb-2">0300 123 6600</p>
                <p className="text-sm text-zinc-500">FRANK (24/7)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Contact</h2>
            <p className="mb-4">
              Questions or concerns about our care resources?
            </p>
            <ul className="list-none space-y-2">
              <li><strong className="text-white">Care Team:</strong> care@hotmess.london</li>
              <li><strong className="text-white">Report Harmful Content:</strong> <button onClick={() => onNavigate('abuseReporting')} className="text-hotmess-red underline">Abuse Reporting</button></li>
              <li><strong className="text-white">General Support:</strong> <button onClick={() => onNavigate('care')} className="text-hotmess-red underline">Care Hub</button></li>
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
            <button onClick={() => onNavigate('legalTerms')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('legalPrivacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('care')} className="hover:text-white transition-colors">
              Care Hub
            </button>
            <button onClick={() => onNavigate('abuseReporting')} className="hover:text-white transition-colors">
              Report Abuse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
