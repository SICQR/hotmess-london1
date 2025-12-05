import { ArrowLeft, Eye, Keyboard, Volume2, MousePointer, Smartphone, Mail } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface AccessibilityProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function Accessibility({ onNavigate }: AccessibilityProps) {
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
          Accessibility
        </h1>
        <p className="text-xl text-zinc-400 mb-12">
          We're building HOTMESS to be usable by everyone. Here's where we are and where we're going.
        </p>

        <div className="space-y-12 text-zinc-300 leading-relaxed">
          {/* Commitment */}
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Our Commitment</h2>
            <p className="mb-4">
              HOTMESS LONDON is committed to making our platform accessible to all queer men 18+, 
              regardless of disability. We're working toward <strong className="text-white">WCAG 2.1 Level AA</strong> compliance 
              and actively improving based on user feedback.
            </p>
            <p>
              <strong className="text-white">We're not perfect yet—but we're committed to getting better.</strong> 
              If you encounter barriers, please let us know.
            </p>
          </section>

          {/* Current Features */}
          <section>
            <h2 className="text-3xl text-white mb-6 uppercase">Accessibility Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-900 border border-white/10">
                <Eye className="w-8 h-8 text-hotmess-red mb-3" />
                <h3 className="text-xl mb-3">Visual</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>✓ High contrast mode (dark theme default)</li>
                  <li>✓ Keyboard navigation support</li>
                  <li>✓ Focus indicators on interactive elements</li>
                  <li>✓ Alt text on images</li>
                  <li>⏳ Screen reader optimization (in progress)</li>
                  <li>⏳ Text resizing support (coming soon)</li>
                </ul>
              </div>

              <div className="p-6 bg-zinc-900 border border-white/10">
                <Keyboard className="w-8 h-8 text-hotmess-red mb-3" />
                <h3 className="text-xl mb-3">Keyboard</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>✓ Full keyboard navigation</li>
                  <li>✓ Tab order follows visual layout</li>
                  <li>✓ Escape key closes modals</li>
                  <li>✓ Arrow keys for galleries/carousels</li>
                  <li>⏳ Custom shortcuts (coming soon)</li>
                </ul>
              </div>

              <div className="p-6 bg-zinc-900 border border-white/10">
                <Volume2 className="w-8 h-8 text-hotmess-red mb-3" />
                <h3 className="text-xl mb-3">Audio/Video</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>✓ Manual audio playback (no auto-play)</li>
                  <li>✓ Volume controls accessible</li>
                  <li>⏳ Captions for radio shows (coming)</li>
                  <li>⏳ Transcripts for video content (coming)</li>
                </ul>
              </div>

              <div className="p-6 bg-zinc-900 border border-white/10">
                <Smartphone className="w-8 h-8 text-hotmess-red mb-3" />
                <h3 className="text-xl mb-3">Mobile</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>✓ Responsive design for all screen sizes</li>
                  <li>✓ Touch-friendly targets (44px minimum)</li>
                  <li>✓ Swipe gestures supported</li>
                  <li>✓ Portrait and landscape modes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h2 className="text-3xl text-white mb-6 uppercase">Keyboard Shortcuts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Key</th>
                    <th className="text-left py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4"><kbd className="px-2 py-1 bg-zinc-800">Tab</kbd></td>
                    <td className="py-3 px-4">Navigate to next element</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4"><kbd className="px-2 py-1 bg-zinc-800">Shift+Tab</kbd></td>
                    <td className="py-3 px-4">Navigate to previous element</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4"><kbd className="px-2 py-1 bg-zinc-800">Enter</kbd> / <kbd className="px-2 py-1 bg-zinc-800">Space</kbd></td>
                    <td className="py-3 px-4">Activate button/link</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4"><kbd className="px-2 py-1 bg-zinc-800">Esc</kbd></td>
                    <td className="py-3 px-4">Close modal/drawer</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4"><kbd className="px-2 py-1 bg-zinc-800">←→</kbd></td>
                    <td className="py-3 px-4">Navigate image galleries</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><kbd className="px-2 py-1 bg-zinc-800">↑↓</kbd></td>
                    <td className="py-3 px-4">Scroll or navigate lists</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Screen Readers */}
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Screen Reader Support</h2>
            <p className="mb-4">
              We're actively testing HOTMESS with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-white">NVDA</strong> (Windows) - Primary testing</li>
              <li><strong className="text-white">JAWS</strong> (Windows) - Secondary testing</li>
              <li><strong className="text-white">VoiceOver</strong> (macOS/iOS) - In progress</li>
              <li><strong className="text-white">TalkBack</strong> (Android) - Coming soon</li>
            </ul>
            <p className="p-4 bg-orange-950/30 border-l-4 border-orange-500">
              <strong className="text-white">Known issue:</strong> Some dynamic content (live radio player, 
              real-time notifications) may not announce properly to screen readers. We're working on ARIA live 
              regions to fix this.
            </p>
          </section>

          {/* Known Issues */}
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Known Issues & Roadmap</h2>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 border-l-4 border-red-500">
                <h4 className="text-white mb-2">High Priority (Q1 2025)</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• Improve screen reader announcements for dynamic content</li>
                  <li>• Add skip-to-content links on all pages</li>
                  <li>• Ensure all form errors are announced</li>
                  <li>• Fix color contrast issues in certain components</li>
                </ul>
              </div>

              <div className="p-4 bg-zinc-900 border-l-4 border-orange-500">
                <h4 className="text-white mb-2">Medium Priority (Q2 2025)</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• Add text resizing without breaking layout</li>
                  <li>• Captions for radio shows and podcast content</li>
                  <li>• Improved mobile screen reader support</li>
                  <li>• Reduced motion preferences</li>
                </ul>
              </div>

              <div className="p-4 bg-zinc-900 border-l-4 border-yellow-500">
                <h4 className="text-white mb-2">Future Enhancements</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• Dark/light theme toggle</li>
                  <li>• Custom color themes for color blindness</li>
                  <li>• Text-to-speech for articles and guides</li>
                  <li>• Simplified language mode</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Assistive Tech */}
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Compatible Assistive Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900 border border-white/10">
                <h4 className="text-white mb-2">Tested & Working</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>✓ Screen readers (NVDA, JAWS)</li>
                  <li>✓ Keyboard-only navigation</li>
                  <li>✓ Browser zoom (up to 200%)</li>
                  <li>✓ Speech recognition software</li>
                </ul>
              </div>
              <div className="p-4 bg-zinc-900 border border-white/10">
                <h4 className="text-white mb-2">In Testing</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>⏳ VoiceOver (macOS/iOS)</li>
                  <li>⏳ TalkBack (Android)</li>
                  <li>⏳ Switch control devices</li>
                  <li>⏳ Eye-tracking software</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Content */}
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Third-Party Content</h2>
            <p className="mb-4">
              Some features rely on third-party services that we don't fully control:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Shopify checkout:</strong> We're working with Shopify to improve their accessibility</li>
              <li><strong className="text-white">Stripe payment forms:</strong> Stripe-controlled, generally accessible</li>
              <li><strong className="text-white">Embedded videos:</strong> Depends on source platform (YouTube, Vimeo, etc.)</li>
            </ul>
          </section>

          {/* Feedback */}
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Report Accessibility Issues</h2>
            <p className="mb-4">
              Found a barrier? Please tell us:
            </p>
            <div className="p-6 bg-zinc-900 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Mail className="w-6 h-6 text-hotmess-red flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-white">Email:</strong> accessibility@hotmess.london
                  <p className="text-sm text-zinc-500 mt-1">
                    Please include: Page URL, assistive tech you're using, and what you expected vs. what happened
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-500">
                <strong className="text-white">Response time:</strong> We aim to respond within 3 business days and resolve critical 
                issues within 2 weeks.
              </p>
            </div>
          </section>

          {/* Standards */}
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Conformance Status</h2>
            <p className="mb-4">
              HOTMESS LONDON aims to conform to <strong className="text-white">WCAG 2.1 Level AA</strong>. 
              Current status (as of November 2025):
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-24 text-sm text-zinc-500 mt-1">Level A:</div>
                <div className="flex-1">
                  <div className="w-full bg-zinc-800 h-6 relative">
                    <div className="absolute inset-0 bg-hotmess-red" style={{ width: '85%' }} />
                    <span className="absolute inset-0 flex items-center justify-center text-sm text-white">85%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-24 text-sm text-zinc-500 mt-1">Level AA:</div>
                <div className="flex-1">
                  <div className="w-full bg-zinc-800 h-6 relative">
                    <div className="absolute inset-0 bg-orange-500" style={{ width: '65%' }} />
                    <span className="absolute inset-0 flex items-center justify-center text-sm text-white">65%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-24 text-sm text-zinc-500 mt-1">Level AAA:</div>
                <div className="flex-1">
                  <div className="w-full bg-zinc-800 h-6 relative">
                    <div className="absolute inset-0 bg-yellow-600" style={{ width: '30%' }} />
                    <span className="absolute inset-0 flex items-center justify-center text-sm text-white">30%</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mt-4">
              Last audit: November 2025 | Next audit: February 2026
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-3xl text-white mb-4 uppercase">Contact</h2>
            <div className="space-y-3">
              <div className="p-4 bg-zinc-900 border border-white/10">
                <strong className="text-white">Accessibility Coordinator:</strong> accessibility@hotmess.london
              </div>
              <div className="p-4 bg-zinc-900 border border-white/10">
                <strong className="text-white">Alternative formats:</strong> If you need this accessibility statement 
                in a different format (audio, large print, etc.), email us.
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-sm text-zinc-600">
          Last updated: November 29, 2025
        </div>
      </div>
    </div>
  );
}
