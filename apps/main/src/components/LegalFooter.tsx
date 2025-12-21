import { RouteId } from '../lib/routes';
import { Shield, Scale, Heart, Eye, AlertTriangle, FileText, Users, Handshake } from 'lucide-react';

interface LegalFooterProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
  variant?: 'compact' | 'full';
}

export function LegalFooter({ onNavigate, variant = 'full' }: LegalFooterProps) {
  if (variant === 'compact') {
    return (
      <div className="mt-16 pt-8 border-t border-white/10">
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500 justify-center">
          <button onClick={() => onNavigate('legalPrivacy')} className="hover:text-white transition-colors">
            Privacy
          </button>
          <button onClick={() => onNavigate('legalTerms')} className="hover:text-white transition-colors">
            Terms
          </button>
          <button onClick={() => onNavigate('legalCareDisclaimer')} className="hover:text-white transition-colors">
            Care Disclaimer
          </button>
          <button onClick={() => onNavigate('legal18Plus')} className="hover:text-white transition-colors">
            18+ Policy
          </button>
          <button onClick={() => onNavigate('dataPrivacy')} className="hover:text-white transition-colors">
            Data & Privacy
          </button>
          <button onClick={() => onNavigate('abuseReporting')} className="hover:text-white transition-colors">
            Report Abuse
          </button>
          <button onClick={() => onNavigate('accessibility')} className="hover:text-white transition-colors">
            Accessibility
          </button>
        </div>
        <div className="text-center text-xs text-zinc-600 mt-6">
          © 2025 HOTMESS LONDON. All rights reserved. Men 18+ only.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-24 pt-12 border-t border-white/10">
      {/* Legal & Compliance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Core Legal */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-hotmess-red">
            <Scale className="w-5 h-5" />
            <h3 className="text-sm uppercase tracking-wider">Legal</h3>
          </div>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>
              <button onClick={() => onNavigate('legalTerms')} className="hover:text-white transition-colors">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legalPrivacy')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legalCookies')} className="hover:text-white transition-colors">
                Cookie Policy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legal')} className="hover:text-white transition-colors">
                Legal Hub
              </button>
            </li>
          </ul>
        </div>

        {/* Safety & Care */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-hotmess-red">
            <Heart className="w-5 h-5" />
            <h3 className="text-sm uppercase tracking-wider">Safety & Care</h3>
          </div>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>
              <button onClick={() => onNavigate('legalCareDisclaimer')} className="hover:text-white transition-colors">
                Care Disclaimer
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legal18Plus')} className="hover:text-white transition-colors">
                18+ Age Policy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('abuseReporting')} className="hover:text-white transition-colors">
                Report Abuse
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('care')} className="hover:text-white transition-colors">
                Care Hub
              </button>
            </li>
          </ul>
        </div>

        {/* Privacy & Data */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-hotmess-red">
            <Shield className="w-5 h-5" />
            <h3 className="text-sm uppercase tracking-wider">Privacy & Data</h3>
          </div>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>
              <button onClick={() => onNavigate('dataPrivacy')} className="hover:text-white transition-colors">
                Data & Privacy Hub
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dataPrivacyExport')} className="hover:text-white transition-colors">
                Export Your Data
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dataPrivacyDelete')} className="hover:text-white transition-colors">
                Delete Account
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dataPrivacyDsar')} className="hover:text-white transition-colors">
                DSAR Request
              </button>
            </li>
          </ul>
        </div>

        {/* Trust & Transparency */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-hotmess-red">
            <Eye className="w-5 h-5" />
            <h3 className="text-sm uppercase tracking-wider">Transparency</h3>
          </div>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>
              <button onClick={() => onNavigate('accessibility')} className="hover:text-white transition-colors">
                Accessibility
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('ugcModeration')} className="hover:text-white transition-colors">
                Content Moderation
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dmca')} className="hover:text-white transition-colors">
                DMCA / Takedowns
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('affiliate')} className="hover:text-white transition-colors">
                Affiliate Disclosures
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Emergency & Support */}
      <div className="p-6 bg-gradient-to-br from-red-950/30 to-black border border-red-900/30 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white mb-2">In Crisis? Get Help Now</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm text-zinc-400">
                <div>
                  <strong className="text-white">Emergency:</strong> 999
                </div>
                <div>
                  <strong className="text-white">Samaritans:</strong> 116 123
                </div>
                <div>
                  <strong className="text-white">NHS 111:</strong> Option 2
                </div>
                <div>
                  <strong className="text-white">FRANK:</strong> 0300 123 6600
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('care')}
            className="px-6 py-3 bg-hotmess-red hover:bg-red-600 transition-colors uppercase tracking-wider text-sm whitespace-nowrap"
          >
            Visit Care Hub
          </button>
        </div>
      </div>

      {/* Platform Sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-8 mb-12 text-sm">
        <div>
          <h4 className="text-white mb-3 uppercase tracking-wider text-xs">Shop</h4>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onNavigate('shopRaw')} className="hover:text-white transition-colors">RAW</button></li>
            <li><button onClick={() => onNavigate('shopHung')} className="hover:text-white transition-colors">HUNG</button></li>
            <li><button onClick={() => onNavigate('shopHigh')} className="hover:text-white transition-colors">HIGH</button></li>
            <li><button onClick={() => onNavigate('shopSuper')} className="hover:text-white transition-colors">SUPER</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3 uppercase tracking-wider text-xs">Commerce</h4>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onNavigate('messmarket')} className="hover:text-white transition-colors">MessMarket</button></li>
            <li><button onClick={() => onNavigate('tickets')} className="hover:text-white transition-colors">Tickets</button></li>
            <li><button onClick={() => onNavigate('hnhMess')} className="hover:text-white transition-colors">HNH MESS</button></li>
            <li><button onClick={() => onNavigate('affiliate')} className="hover:text-white transition-colors">Affiliates</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3 uppercase tracking-wider text-xs">Content</h4>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onNavigate('radio')} className="hover:text-white transition-colors">Radio</button></li>
            <li><button onClick={() => onNavigate('records')} className="hover:text-white transition-colors">Records</button></li>
            <li><button onClick={() => onNavigate('editorial')} className="hover:text-white transition-colors">Editorial</button></li>
            <li><button onClick={() => onNavigate('beacons')} className="hover:text-white transition-colors">Beacons</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3 uppercase tracking-wider text-xs">Community</h4>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onNavigate('community')} className="hover:text-white transition-colors">Forums</button></li>
            <li><button onClick={() => onNavigate('care')} className="hover:text-white transition-colors">Care Hub</button></li>
            <li><button onClick={() => onNavigate('threads')} className="hover:text-white transition-colors">Messages</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3 uppercase tracking-wider text-xs">About</h4>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onNavigate('pressRoom')} className="hover:text-white transition-colors">Press Room</button></li>
            <li><button onClick={() => onNavigate('account')} className="hover:text-white transition-colors">Account</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3 uppercase tracking-wider text-xs">Sellers</h4>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onNavigate('sellerDashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
            <li><button onClick={() => onNavigate('sellerListings')} className="hover:text-white transition-colors">Listings</button></li>
            <li><button onClick={() => onNavigate('sellerPayouts')} className="hover:text-white transition-colors">Payouts</button></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div>
            © 2025 HOTMESS LONDON. All rights reserved. 
            <span className="mx-2">•</span>
            Men 18+ only.
            <span className="mx-2">•</span>
            Care-first nightlife OS for queer men.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('legal')} className="hover:text-white transition-colors">
              Legal
            </button>
            <button onClick={() => onNavigate('pressRoom')} className="hover:text-white transition-colors">
              Press
            </button>
            <button onClick={() => onNavigate('accessibility')} className="hover:text-white transition-colors">
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
