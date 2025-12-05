// All remaining pages generated with templates
import { PageTemplate } from '../components/PageTemplate';
import { EmptyState } from '../components/EmptyState';
import { RouteId } from '../lib/routes';
import {
  FileText, Shield, Cookie, Heart, AlertTriangle, Users, Download,
  Trash, FileCheck, Flag, Scale, UserCheck, Package, BarChart, Settings,
  Zap, Radio as RadioIcon, Disc, Calendar, Headphones, MapPin, TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { mockCareResources, mockRadioShows, mockPosts, mockUser, formatDate } from '../lib/mockData';
import React from 'react';

// P0 CRITICAL PAGES - Import the actual components
export { default as CityHome } from './CityHome';
export { default as VendorProfile } from './VendorProfile';
export { default as TicketOrderConfirmation } from './TicketOrderConfirmation';
export { default as EditListing } from './seller/EditListing';
export { default as RadioNowPlaying } from './RadioNowPlaying';

type NavFunction = (route: RouteId, params?: Record<string, string>) => void;

// PUBLIC PAGES
export function About({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="About HOTMESS" subtitle="London's masculine queer nightlife OS. Care-first principles. Kink aesthetics. 18+ only." onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-12">
        <div>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Our Mission</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            HOTMESS exists to create safe, sweaty, unapologetic spaces for queer men in London. We combine care-first principles with bold kink aesthetics because looking after each other doesn't have to be soft.
          </p>
        </div>
        <div>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>What We Do</h2>
          <ul className="text-white/80 text-lg space-y-3">
            <li>• 24/7 Radio — music, shows, community voices</li>
            <li>• Merchandise — RAW/HUNG/HIGH/SUPER collections</li>
            <li>• Care Resources — mental health, sexual health, harm reduction</li>
            <li>• Community — forums, events, connection</li>
            <li>• MessMap — beacon scanning to find the party</li>
          </ul>
        </div>
      </div>
    </PageTemplate>
  );
}

export function Press({ onNavigate }: { onNavigate: NavFunction }) {
  const handleDownload = (asset: string) => {
    alert(`Downloading ${asset}... (In production, this would download the file)`);
  };

  return (
    <PageTemplate title="Press Room" icon={FileText} backRoute="home" backLabel="Home" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-8">
        <div className="bg-white/5 border border-white/20 p-8">
          <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>Media Contact</h3>
          <a href="mailto:press@hotmesslondon.com" className="text-hot hover:text-white transition-colors">
            press@hotmesslondon.com
          </a>
        </div>
        <div>
          <h3 className="text-white uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '20px' }}>Brand Assets</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => handleDownload('Logo Pack')}
              className="bg-white/5 border border-white/20 hover:border-hot p-6 text-left transition-all"
            >
              <div className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>Logo Pack</div>
              <div className="text-white/40 text-sm">SVG, PNG, EPS</div>
            </button>
            <button 
              onClick={() => handleDownload('Brand Guidelines')}
              className="bg-white/5 border border-white/20 hover:border-hot p-6 text-left transition-all"
            >
              <div className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>Brand Guidelines</div>
              <div className="text-white/40 text-sm">PDF, 2MB</div>
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

export function SponsorshipDisclosures({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Sponsorship Disclosures" icon={DollarSign} backRoute="legal" backLabel="Legal Hub" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-6 text-white/80">
        <p>HOTMESS may work with brands and sponsors. We always disclose these relationships.</p>
        <div className="bg-white/5 border border-white/20 p-8">
          <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>Current Sponsors</h3>
          <p className="text-white/60">None at this time.</p>
        </div>
      </div>
    </PageTemplate>
  );
}

export function PartnerIntegrations({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Partner Integrations" subtitle="Services we integrate with to power HOTMESS." onNavigate={onNavigate}>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {[
          { name: 'Stripe', purpose: 'Payment processing' },
          { name: 'RadioKing', purpose: '24/7 radio streaming' },
          { name: 'Supabase', purpose: 'Database & auth' },
          { name: 'Vercel', purpose: 'Hosting' },
        ].map(partner => (
          <div key={partner.name} className="bg-white/5 border border-white/20 p-6">
            <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900 }}>{partner.name}</h3>
            <p className="text-white/60">{partner.purpose}</p>
          </div>
        ))}
      </div>
    </PageTemplate>
  );
}

export function CreatorOnboarding({ onNavigate }: { onNavigate: NavFunction }) {
  const [formData, setFormData] = React.useState({
    email: '',
    displayName: '',
    bio: '',
    portfolioUrl: '',
    instagramHandle: '',
    referralSource: 'messmarket',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { submitVendorApplication } = await import('../lib/messmarket-api');
    const success = await submitVendorApplication(formData);

    setSubmitting(false);

    if (success) {
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          email: '',
          displayName: '',
          bio: '',
          portfolioUrl: '',
          instagramHandle: '',
          referralSource: 'messmarket',
        });
        setSubmitted(false);
      }, 3000);
    } else {
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageTemplate title="Creator Onboarding" subtitle="Host a show. Run a drop. Join the team." icon={Zap} onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-8">
        <div className="bg-hot/10 border border-hot/30 p-8">
          <h3 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>We're looking for</h3>
          <ul className="text-white/80 space-y-2">
            <li>• Radio hosts (music, talk, community shows)</li>
            <li>• Merchandise designers & vendors</li>
            <li>• Event organizers</li>
            <li>• Content creators</li>
          </ul>
        </div>

        {submitted ? (
          <div className="bg-hotmess-red/10 border-2 border-hotmess-red p-8 text-center">
            <h3 className="text-white mb-4" style={{ fontWeight: 900 }}>
              Application Submitted!
            </h3>
            <p className="text-hotmess-gray-300">
              We'll review your application and get back to you within 5 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>
                Apply to sell on MessMarket
              </h3>
              <p className="text-white/60 mb-6">
                Tell us about yourself and what you want to create.
              </p>
            </div>

            <div>
              <label className="block text-white mb-2" style={{ fontWeight: 700 }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black border-2 border-hotmess-gray-700 text-white px-4 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-white mb-2" style={{ fontWeight: 700 }}>
                Display Name *
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full bg-black border-2 border-hotmess-gray-700 text-white px-4 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="Your Name or Brand"
              />
            </div>

            <div>
              <label className="block text-white mb-2" style={{ fontWeight: 700 }}>
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-black border-2 border-hotmess-gray-700 text-white px-4 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="Tell us about your work..."
              />
            </div>

            <div>
              <label className="block text-white mb-2" style={{ fontWeight: 700 }}>
                Portfolio URL
              </label>
              <input
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                className="w-full bg-black border-2 border-hotmess-gray-700 text-white px-4 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-white mb-2" style={{ fontWeight: 700 }}>
                Instagram Handle
              </label>
              <input
                type="text"
                name="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleChange}
                className="w-full bg-black border-2 border-hotmess-gray-700 text-white px-4 py-3 focus:border-hotmess-red focus:outline-none transition-colors"
                placeholder="@yourhandle"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-hotmess-red text-black px-6 py-4 hover:bg-hotmess-red/80 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: 900 }}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}

        <div className="border-t border-white/10 pt-8">
          <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>Questions?</h3>
          <p className="text-white/60">Email us: creators@hotmesslondon.com</p>
        </div>
      </div>
    </PageTemplate>
  );
}

// CARE & COMMUNITY
export function HNHMess({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Hand N Hand Mess" subtitle="Community-run care resources. Not medical advice." icon={Heart} onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-8">
        {/* Aftercare Banner */}
        <div className="bg-hot/10 border border-hot/30 p-8">
          <h3 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>⚠️ Disclaimer</h3>
          <p className="text-white/80 leading-relaxed mb-4">
            This is peer support, not professional medical or mental health advice. If you're in crisis, please contact emergency services or a crisis line.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-hot" style={{ fontWeight: 700 }}>UK Emergency: 999</span>
            <span className="text-white/60">Samaritans: 116 123</span>
          </div>
        </div>

        <div className="grid gap-6">
          {mockCareResources.map((resource, i) => (
            <motion.div
              key={resource.id}
              className="bg-white/5 border border-white/20 p-8 hover:border-hot transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900 }}>{resource.title}</h3>
              <p className="text-white/60 mb-4">{resource.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {resource.phone && (
                  <a 
                    href={`tel:${resource.phone}`} 
                    className="text-hot hover:text-white transition-colors"
                    style={{ fontWeight: 700 }}
                  >
                    📞 {resource.phone}
                  </a>
                )}
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-hot hover:text-white transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  🌐 Website
                </a>
                <span className="text-white/40">{resource.available}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Actions */}
        <div className="pt-8 border-t border-white/10 grid md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('care')}
            className="bg-white/10 border border-white/20 hover:border-hot px-6 py-4 text-white uppercase tracking-wider transition-all"
            style={{ fontWeight: 700 }}
          >
            All Care Resources
          </button>
          <button
            onClick={() => onNavigate('legalCareDisclaimer')}
            className="bg-white/10 border border-white/20 hover:border-hot px-6 py-4 text-white uppercase tracking-wider transition-all"
            style={{ fontWeight: 700 }}
          >
            Read Disclaimer
          </button>
          <button
            onClick={() => onNavigate('abuseReporting')}
            className="bg-white/10 border border-white/20 hover:border-hot px-6 py-4 text-white uppercase tracking-wider transition-all"
            style={{ fontWeight: 700 }}
          >
            Report Abuse
          </button>
        </div>
      </div>
    </PageTemplate>
  );
}

export function CommunityPost({ postId, onNavigate }: { postId: string; onNavigate: NavFunction }) {
  const post = mockPosts.find(p => p.id === postId);
  if (!post) return <div className="p-12 text-white">Post not found</div>;

  return (
    <PageTemplate title={post.title || 'Community Post'} backRoute="community" backLabel="Community" onNavigate={onNavigate}>
      <div className="max-w-4xl">
        <div className="bg-white/5 border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
            <div className="w-12 h-12 bg-hot/20 rounded-full flex items-center justify-center">
              <span className="text-hot uppercase" style={{ fontWeight: 900 }}>{post.authorName[0]}</span>
            </div>
            <div>
              <div className="text-white" style={{ fontWeight: 700 }}>{post.authorName}</div>
              <div className="text-white/40 text-sm">{formatDate(post.createdAt)}</div>
            </div>
          </div>
          <div className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap">
            {post.body}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

// TRENDING
export function Trending({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Trending" subtitle="What's hot in the HOTMESS community right now" icon={TrendingUp} onNavigate={onNavigate}>
      <div className="max-w-4xl">
        <EmptyState
          icon={TrendingUp}
          title="Nothing trending yet"
          description="Check back soon to see what the HOTMESS community is talking about."
          action={{
            label: "Browse Community",
            onClick: () => onNavigate('community')
          }}
        />
      </div>
    </PageTemplate>
  );
}

// Stub helper component for icon import
function DollarSign({ className }: { className?: string }) {
  return <div className={className}>£</div>;
}