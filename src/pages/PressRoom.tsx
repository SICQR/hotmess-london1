import { ArrowLeft, Download, Mail, ExternalLink, Image, FileText, Video } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface PressRoomProps {
  onNavigate: (route: string) => void;
}

export function PressRoom({ onNavigate }: PressRoomProps) {
  const pressReleases = [
    {
      date: '2025-01-15',
      title: 'HOTMESS LONDON Launches MessMarket: P2P Marketplace for Queer Men',
      excerpt: 'New Etsy-style platform with White-Label premium seller mode revolutionizes queer commerce',
      link: '#'
    },
    {
      date: '2024-11-20',
      title: 'HOTMESS Introduces Care-First Commerce Framework',
      excerpt: 'Platform integrates aftercare triggers and consent gates throughout shopping experience',
      link: '#'
    },
    {
      date: '2024-09-10',
      title: 'P2P Ticketing with QR Verification Goes Live',
      excerpt: 'Secure ticket trading for queer events with fraud prevention built-in',
      link: '#'
    },
  ];

  const mediaAssets = [
    {
      type: 'logo',
      title: 'HOTMESS Logo Pack',
      description: 'SVG, PNG, EPS formats. Full color and monochrome versions.',
      size: '2.4 MB'
    },
    {
      type: 'screenshot',
      title: 'Platform Screenshots',
      description: 'High-res screenshots of shop, marketplace, and beacons features.',
      size: '15.8 MB'
    },
    {
      type: 'style',
      title: 'Brand Guidelines',
      description: 'Typography, color palette, usage rules, and visual identity.',
      size: '1.2 MB'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-24 py-16">
      <button
        onClick={() => onNavigate('?route=home')}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="max-w-6xl">
        <h1 className="text-5xl md:text-7xl uppercase tracking-tight mb-4" style={{ fontWeight: 900 }}>
          Press Room
        </h1>
        <p className="text-xl text-zinc-400 mb-12">
          Media assets, press releases, and contact information for journalists
        </p>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-gradient-to-br from-hotmess-red/20 to-black border-2 border-hotmess-red">
            <Mail className="w-8 h-8 text-hotmess-red mb-3" />
            <h3 className="text-lg mb-2">Press Inquiries</h3>
            <a href="mailto:press@hotmess.london" className="text-hotmess-red hover:underline">
              press@hotmess.london
            </a>
          </div>

          <div className="p-6 bg-zinc-900 border border-white/10">
            <FileText className="w-8 h-8 text-hotmess-red mb-3" />
            <h3 className="text-lg mb-2">Media Kit</h3>
            <button className="text-hotmess-red hover:underline flex items-center gap-2">
              Download ZIP
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 bg-zinc-900 border border-white/10">
            <ExternalLink className="w-8 h-8 text-hotmess-red mb-3" />
            <h3 className="text-lg mb-2">Social Media</h3>
            <div className="space-y-1 text-sm">
              <div>
                <a href="https://twitter.com/hotmesslondon" className="text-hotmess-red hover:underline">
                  @hotmesslondon
                </a>
              </div>
              <div>
                <a href="https://instagram.com/hotmesslondon" className="text-hotmess-red hover:underline">
                  @hotmesslondon
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6 uppercase">About HOTMESS LONDON</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 text-zinc-300 leading-relaxed">
              <p>
                <strong className="text-white">HOTMESS LONDON</strong> is a complete masculine nightlife operating system 
                for queer men 18+, combining care-first principles with kink aesthetics. Founded in 2023 in London's Vauxhall 
                neighborhood, HOTMESS has grown into a multi-platform ecosystem serving thousands of users globally.
              </p>
              <p>
                The platform features a two-engine commerce system: <strong className="text-white">/shop</strong> powered by 
                Shopify for branded merchandise (RAW, HUNG, HIGH, SUPER collections), and <strong className="text-white">/messmarket</strong> 
                running on Supabase + Stripe Connect as an Etsy-style marketplace with White-Label premium seller mode.
              </p>
              <p>
                Beyond commerce, HOTMESS includes <strong className="text-white">P2P event ticketing with QR verification</strong>, 
                <strong className="text-white"> HOTMESS Records</strong> (music label with SoundCloud integration), 
                <strong className="text-white"> HOTMESS Radio</strong> (live streaming), and a comprehensive 
                <strong className="text-white"> Care Hub</strong> featuring harm reduction, consent education, and aftercare resources.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 border border-white/10">
                <div className="text-sm text-zinc-500 mb-1">Founded</div>
                <div className="text-2xl text-white">2023</div>
              </div>
              <div className="p-4 bg-zinc-900 border border-white/10">
                <div className="text-sm text-zinc-500 mb-1">Location</div>
                <div className="text-2xl text-white">London, UK</div>
              </div>
              <div className="p-4 bg-zinc-900 border border-white/10">
                <div className="text-sm text-zinc-500 mb-1">Audience</div>
                <div className="text-2xl text-white">Queer Men 18+</div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6 uppercase">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-900 border border-white/10">
              <h3 className="text-xl mb-3 text-hotmess-red">Care-First Commerce</h3>
              <p className="text-zinc-400 text-sm">
                Progressive consent model with aftercare triggers throughout the shopping experience. 
                High-risk products require mandatory safety acknowledgment.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-white/10">
              <h3 className="text-xl mb-3 text-hotmess-red">Dual Commerce Engines</h3>
              <p className="text-zinc-400 text-sm">
                Shopify-powered branded shop + Stripe Connect P2P marketplace with 12% standard / 20% white-label fees.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-white/10">
              <h3 className="text-xl mb-3 text-hotmess-red">P2P Event Ticketing</h3>
              <p className="text-zinc-400 text-sm">
                Secure ticket marketplace with QR verification, fraud prevention, and atomic stock reservation to prevent overselling.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-white/10">
              <h3 className="text-xl mb-3 text-hotmess-red">Music Ecosystem</h3>
              <p className="text-zinc-400 text-sm">
                HOTMESS Records label with SoundCloud previews + HQ downloads. Live radio streaming with DJ schedule.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-white/10">
              <h3 className="text-xl mb-3 text-hotmess-red">Harm Reduction</h3>
              <p className="text-zinc-400 text-sm">
                Comprehensive care resources: sexual health, substance harm reduction, kink safety, consent frameworks.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-white/10">
              <h3 className="text-xl mb-3 text-hotmess-red">Men-Only, 18+</h3>
              <p className="text-zinc-400 text-sm">
                Intentional community for adult queer men (trans men fully welcome). Strict age verification.
              </p>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6 uppercase">Recent Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, i) => (
              <div key={i} className="p-6 bg-zinc-900 border border-white/10 hover:border-hotmess-red transition-colors">
                <div className="text-sm text-zinc-500 mb-2">{release.date}</div>
                <h3 className="text-xl mb-2 text-white">{release.title}</h3>
                <p className="text-zinc-400 mb-4">{release.excerpt}</p>
                <a href={release.link} className="text-hotmess-red hover:underline flex items-center gap-2">
                  Read Full Release
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Media Assets */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6 uppercase">Media Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaAssets.map((asset, i) => (
              <div key={i} className="p-6 bg-zinc-900 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  {asset.type === 'logo' && <Image className="w-6 h-6 text-hotmess-red" />}
                  {asset.type === 'screenshot' && <Video className="w-6 h-6 text-hotmess-red" />}
                  {asset.type === 'style' && <FileText className="w-6 h-6 text-hotmess-red" />}
                  <h3 className="text-lg">{asset.title}</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-4">{asset.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">{asset.size}</span>
                  <button className="text-hotmess-red hover:underline text-sm flex items-center gap-2">
                    Download
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-orange-950/30 border-l-4 border-orange-500">
            <p className="text-sm text-zinc-300">
              <strong className="text-white">Usage Guidelines:</strong> Logo and brand assets are provided for editorial 
              use only. Do not modify colors, proportions, or design. See brand guidelines for full details.
            </p>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6 uppercase">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-zinc-900 border border-white/10">
              <div className="aspect-square mb-4 overflow-hidden bg-zinc-800 border border-white/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400"
                  alt="Marcus Chen"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <h3 className="text-xl mb-2">Marcus Chen</h3>
              <div className="text-sm text-zinc-500 mb-3">Founder & Creative Director</div>
              <p className="text-sm text-zinc-400 mb-3">
                Former club promoter turned tech founder. Based in Vauxhall. Passionate about building 
                infrastructure for queer masculine communities.
              </p>
              <button className="text-hotmess-red hover:underline text-sm">
                Request Interview
              </button>
            </div>

            <div className="p-6 bg-zinc-900 border border-white/10">
              <div className="aspect-square mb-4 overflow-hidden bg-zinc-800 border border-white/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                  alt="Javier Rodriguez"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <h3 className="text-xl mb-2">Javier Rodriguez</h3>
              <div className="text-sm text-zinc-500 mb-3">Head of Care & Safety</div>
              <p className="text-sm text-zinc-400 mb-3">
                Sexual health educator and harm reduction specialist. Leads HOTMESS's care-first initiatives 
                and community safety programs.
              </p>
              <button className="text-hotmess-red hover:underline text-sm">
                Request Interview
              </button>
            </div>
          </div>
        </section>

        {/* FAQ for Press */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6 uppercase">FAQ for Journalists</h2>
          <div className="space-y-6">
            <details className="p-6 bg-zinc-900 border border-white/10">
              <summary className="cursor-pointer text-lg mb-4">How is HOTMESS different from Grindr or Scruff?</summary>
              <p className="text-zinc-400">
                HOTMESS isn't a dating or hookup app. We're a nightlife OS—commerce, events, music, and community tools 
                designed specifically for queer men's social lives outside of dating. Think Eventbrite + Etsy + Bandcamp, 
                but built with care-first principles and kink-positive aesthetics.
              </p>
            </details>

            <details className="p-6 bg-zinc-900 border border-white/10">
              <summary className="cursor-pointer text-lg mb-4">What does "care-first" mean in practice?</summary>
              <p className="text-zinc-400">
                Every feature includes safety, consent, and aftercare considerations. Buying kink gear? You see safety guides 
                before checkout. Attending an event? Pre-party safety checklists. Using substances? Harm reduction resources. 
                It's not performative—it's baked into the UX.
              </p>
            </details>

            <details className="p-6 bg-zinc-900 border border-white/10">
              <summary className="cursor-pointer text-lg mb-4">Why men-only?</summary>
              <p className="text-zinc-400">
                HOTMESS is built for the specific experiences, culture, and needs of queer masculine people. We're not 
                excluding anyone—we're intentionally creating space for a community that's often marginalized even within 
                LGBTQ+ spaces. Trans men are fully welcome and celebrated.
              </p>
            </details>

            <details className="p-6 bg-zinc-900 border border-white/10">
              <summary className="cursor-pointer text-lg mb-4">What's your business model?</summary>
              <p className="text-zinc-400">
                Three revenue streams: (1) Shopify-powered merchandise sales, (2) 12-20% marketplace fees on P2P sales, 
                (3) 15% affiliate commissions. We're transparent about this—see our Affiliate page for full details.
              </p>
            </details>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-3xl mb-6 uppercase">Media Contact</h2>
          <div className="p-8 bg-gradient-to-br from-hotmess-red/20 to-black border-2 border-hotmess-red">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl mb-4">Press Inquiries</h3>
                <div className="space-y-3 text-zinc-300">
                  <div>
                    <strong className="text-white">Email:</strong> press@hotmess.london
                  </div>
                  <div>
                    <strong className="text-white">Response time:</strong> Within 24 hours
                  </div>
                  <div>
                    <strong className="text-white">Available for:</strong> Interviews, quotes, background briefings
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl mb-4">Partnership Inquiries</h3>
                <div className="space-y-3 text-zinc-300">
                  <div>
                    <strong className="text-white">Email:</strong> partnerships@hotmess.london
                  </div>
                  <div>
                    <strong className="text-white">For:</strong> Sponsorships, collaborations, brand partnerships
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
