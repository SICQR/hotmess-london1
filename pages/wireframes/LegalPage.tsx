/**
 * LEGAL HUB PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { Shield, FileText, AlertCircle, Lock } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMTabs } from '../../components/library/HMTabs';

interface LegalPageProps {
  onNavigate: (page: string) => void;
}

export function LegalPage({ onNavigate }: LegalPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-4xl mx-auto text-center">
          <Shield size={64} className="mx-auto mb-6 text-hot" />
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            Legal Hub
          </h1>
          <p className="text-gray-300">
            Terms, privacy, and community standards for HOTMESS LONDON.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-6 py-8 bg-charcoal/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-6 bg-black/50 border border-hot/30 hover:border-hot transition-all text-center">
            <FileText size={32} className="mx-auto mb-3 text-hot" />
            <span className="text-sm text-white uppercase tracking-wider">Terms</span>
          </button>
          <button className="p-6 bg-black/50 border border-hot/30 hover:border-hot transition-all text-center">
            <Lock size={32} className="mx-auto mb-3 text-hot" />
            <span className="text-sm text-white uppercase tracking-wider">Privacy</span>
          </button>
          <button className="p-6 bg-black/50 border border-hot/30 hover:border-hot transition-all text-center">
            <Shield size={32} className="mx-auto mb-3 text-hot" />
            <span className="text-sm text-white uppercase tracking-wider">Guidelines</span>
          </button>
          <button className="p-6 bg-black/50 border border-hot/30 hover:border-hot transition-all text-center">
            <AlertCircle size={32} className="mx-auto mb-3 text-hot" />
            <span className="text-sm text-white uppercase tracking-wider">Report</span>
          </button>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'terms',
                label: 'Terms of Service',
                content: (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-hot mb-4">HOTMESS LONDON Terms of Service</h3>
                    <p className="text-gray-400 mb-4">Last updated: November 24, 2024</p>

                    <h4 className="text-white mt-6 mb-3">1. Acceptance of Terms</h4>
                    <p className="text-gray-300 leading-relaxed">
                      By accessing and using HOTMESS LONDON ("the Service"), you agree to be bound by these Terms of Service. 
                      If you do not agree to these terms, do not use the Service.
                    </p>

                    <h4 className="text-white mt-6 mb-3">2. Eligibility</h4>
                    <p className="text-gray-300 leading-relaxed">
                      You must be at least 18 years old to use this Service. By using HOTMESS, you represent and warrant 
                      that you are 18 years of age or older.
                    </p>

                    <h4 className="text-white mt-6 mb-3">3. User Conduct</h4>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      HOTMESS is a care-first community. Users agree to:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Treat all community members with respect</li>
                      <li>Not engage in harassment, hate speech, or bullying</li>
                      <li>Not share content that violates others' privacy or consent</li>
                      <li>Not use the Service for illegal activities</li>
                      <li>Report violations to moderators</li>
                    </ul>

                    <h4 className="text-white mt-6 mb-3">4. XP and Rewards</h4>
                    <p className="text-gray-300 leading-relaxed">
                      XP (experience points) are earned through participation in the Service. XP has no cash value and cannot 
                      be transferred or sold. HOTMESS reserves the right to adjust XP values or rewards at any time.
                    </p>

                    <h4 className="text-white mt-6 mb-3">5. Content</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Users retain ownership of content they create. By posting, you grant HOTMESS a non-exclusive license 
                      to display and distribute your content within the Service.
                    </p>

                    <h4 className="text-white mt-6 mb-3">6. Marketplace & Vendors</h4>
                    <p className="text-gray-300 leading-relaxed">
                      HOTMESS provides a platform for third-party vendors. We are not responsible for vendor products, 
                      services, or transactions. All sales are between users and vendors.
                    </p>

                    <h4 className="text-white mt-6 mb-3">7. Termination</h4>
                    <p className="text-gray-300 leading-relaxed">
                      HOTMESS reserves the right to suspend or terminate accounts that violate these Terms or Community Guidelines.
                    </p>

                    <h4 className="text-white mt-6 mb-3">8. Limitation of Liability</h4>
                    <p className="text-gray-300 leading-relaxed">
                      HOTMESS is provided "as is" without warranties. We are not liable for damages arising from use of the Service.
                    </p>

                    <h4 className="text-white mt-6 mb-3">9. Changes to Terms</h4>
                    <p className="text-gray-300 leading-relaxed">
                      We may update these Terms at any time. Continued use after changes constitutes acceptance.
                    </p>

                    <h4 className="text-white mt-6 mb-3">10. Contact</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Questions? Email legal@hotmesslondon.com
                    </p>
                  </div>
                ),
              },
              {
                id: 'privacy',
                label: 'Privacy Policy',
                content: (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-hot mb-4">Privacy Policy</h3>
                    <p className="text-gray-400 mb-4">Last updated: November 24, 2024</p>

                    <h4 className="text-white mt-6 mb-3">1. Information We Collect</h4>
                    <p className="text-gray-300 leading-relaxed mb-3">We collect:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Account information (email, display name)</li>
                      <li>Activity data (beacon scans, XP, purchases)</li>
                      <li>Location data (when scanning beacons, with permission)</li>
                      <li>Device and usage data</li>
                    </ul>

                    <h4 className="text-white mt-6 mb-3">2. How We Use Your Data</h4>
                    <p className="text-gray-300 leading-relaxed mb-3">Your data is used to:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Provide and improve the Service</li>
                      <li>Track XP and rewards</li>
                      <li>Show nearby beacons and events</li>
                      <li>Send notifications (with permission)</li>
                      <li>Prevent abuse and enforce guidelines</li>
                    </ul>

                    <h4 className="text-white mt-6 mb-3">3. Data Sharing</h4>
                    <p className="text-gray-300 leading-relaxed">
                      We do NOT sell your data. We may share data with:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Service providers (hosting, analytics)</li>
                      <li>Vendors (for order fulfillment only)</li>
                      <li>Law enforcement (if legally required)</li>
                    </ul>

                    <h4 className="text-white mt-6 mb-3">4. Your Rights</h4>
                    <p className="text-gray-300 leading-relaxed mb-3">You have the right to:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Access your data</li>
                      <li>Request deletion</li>
                      <li>Opt out of marketing</li>
                      <li>Export your data</li>
                    </ul>

                    <h4 className="text-white mt-6 mb-3">5. Security</h4>
                    <p className="text-gray-300 leading-relaxed">
                      We use industry-standard security measures. However, no system is 100% secure. 
                      Use strong passwords and enable two-factor authentication.
                    </p>

                    <h4 className="text-white mt-6 mb-3">6. Cookies</h4>
                    <p className="text-gray-300 leading-relaxed">
                      We use cookies for authentication and preferences. You can disable cookies in your browser settings.
                    </p>

                    <h4 className="text-white mt-6 mb-3">7. Contact</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Privacy questions? Email privacy@hotmesslondon.com
                    </p>
                  </div>
                ),
              },
              {
                id: 'guidelines',
                label: 'Community Guidelines',
                content: (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-hot mb-4">Community Guidelines</h3>
                    <p className="text-gray-400 mb-6">
                      HOTMESS is built on care-first principles. These guidelines keep the brotherhood safe.
                    </p>

                    <h4 className="text-white mt-6 mb-3">✓ Do:</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Look after each other</li>
                      <li>Respect boundaries and consent</li>
                      <li>Share resources and support</li>
                      <li>Report harmful behavior</li>
                      <li>Be authentic and present</li>
                    </ul>

                    <h4 className="text-white mt-6 mb-3">✗ Don't:</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Harass, bully, or shame anyone</li>
                      <li>Share non-consensual content</li>
                      <li>Post hate speech or discrimination</li>
                      <li>Solicit or scam</li>
                      <li>Impersonate others</li>
                    </ul>

                    <h4 className="text-white mt-6 mb-3">Content Rules:</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>18+ content allowed (marked NSFW)</li>
                      <li>No explicit sexual content in public spaces</li>
                      <li>No illegal content</li>
                      <li>Respect intellectual property</li>
                    </ul>

                    <h4 className="text-white mt-6 mb-3">Consequences:</h4>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      Violations may result in:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Warning</li>
                      <li>Temporary suspension</li>
                      <li>Permanent ban</li>
                      <li>Law enforcement referral (for illegal activity)</li>
                    </ul>

                    <p className="text-hot italic mt-8">
                      Care dressed as kink. No cruelty. Just brotherhood.
                    </p>
                  </div>
                ),
              },
              {
                id: 'copyright',
                label: 'Copyright & DMCA',
                content: (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-hot mb-4">Copyright & DMCA</h3>

                    <h4 className="text-white mt-6 mb-3">Copyright Notice</h4>
                    <p className="text-gray-300 leading-relaxed">
                      All HOTMESS branding, design, and original content are © 2024 HOTMESS LONDON. 
                      All rights reserved.
                    </p>

                    <h4 className="text-white mt-6 mb-3">DMCA Takedown Requests</h4>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      If you believe your copyrighted work has been infringed, send a DMCA notice to:
                    </p>
                    <div className="p-4 bg-black/50 border border-hot/30 text-gray-300">
                      <p>Email: dmca@hotmesslondon.com</p>
                      <p className="mt-2">Include:</p>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Description of copyrighted work</li>
                        <li>URL of infringing content</li>
                        <li>Your contact information</li>
                        <li>Statement of good faith belief</li>
                        <li>Electronic signature</li>
                      </ul>
                    </div>

                    <h4 className="text-white mt-6 mb-3">Counter-Notice</h4>
                    <p className="text-gray-300 leading-relaxed">
                      If your content was removed in error, you may file a counter-notice at the same email.
                    </p>
                  </div>
                ),
              },
            ]}
            defaultTab="terms"
          />
        </div>
      </section>

      {/* Report Abuse CTA */}
      <section className="px-6 py-16 bg-hot/10">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-hot" />
          <h3 className="mb-4 text-2xl text-hot uppercase tracking-wider">
            Report Abuse or Violations
          </h3>
          <p className="mb-8 text-gray-300">
            See something that violates our guidelines? Report it immediately.
          </p>
          <HMButton variant="primary">
            Report an Issue
          </HMButton>
        </div>
      </section>
    </div>
  );
}
