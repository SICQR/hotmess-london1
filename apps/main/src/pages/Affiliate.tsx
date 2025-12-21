import { useState } from 'react';
import { DollarSign, Users, TrendingUp, Gift, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface AffiliateProps {
  onNavigate: (route: string) => void;
}

export function Affiliate({ onNavigate }: AffiliateProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const benefits = [
    {
      icon: DollarSign,
      title: '15% Commission',
      description: 'Earn 15% on all Shop purchases, 10% on MessMarket, 8% on Records'
    },
    {
      icon: Users,
      title: 'Lifetime Attribution',
      description: 'Get credit for every purchase your referrals make, forever'
    },
    {
      icon: TrendingUp,
      title: 'Performance Bonuses',
      description: '£500+/month = 20% commission tier + exclusive perks'
    },
    {
      icon: Gift,
      title: 'Free Gear',
      description: 'Early access to drops, free shipping, VIP event invites'
    },
  ];

  const tiers = [
    {
      name: 'Starter',
      threshold: '£0 - £499/mo',
      commission: '15% Shop | 10% Market | 8% Records',
      perks: ['Dashboard access', 'Link tracking', 'Monthly payouts']
    },
    {
      name: 'Pro',
      threshold: '£500 - £1,999/mo',
      commission: '20% Shop | 12% Market | 10% Records',
      perks: ['Priority support', 'Custom landing pages', 'Bi-weekly payouts', 'Free shipping']
    },
    {
      name: 'Elite',
      threshold: '£2,000+/mo',
      commission: '25% Shop | 15% Market | 12% Records',
      perks: ['Dedicated account manager', 'Co-branded content', 'Weekly payouts', 'VIP event access', 'Exclusive merch']
    },
  ];

  const copyAffiliateCode = () => {
    navigator.clipboard.writeText('HOTMESS-DEMO-2024');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-16">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.85] mb-6"
            style={{ fontWeight: 900 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            AFFILIATE<br />PROGRAM
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/80 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Make money promoting gear, tickets, and music to the <span className="text-hotmess-red">right audience</span>.
          </motion.p>
        </div>
      </section>

      <div className="px-6 md:px-16 lg:px-24 py-24">
        {/* Overview */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl mb-8 uppercase">How It Works</h2>
              <div className="space-y-6 text-lg text-zinc-300">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-hotmess-red flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white mb-2">Sign Up</h4>
                    <p>Create your affiliate account and get your unique tracking link</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-hotmess-red flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white mb-2">Share</h4>
                    <p>Promote products via social media, blog posts, or your own channels</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-hotmess-red flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white mb-2">Earn</h4>
                    <p>Get paid monthly via bank transfer or PayPal. No minimum threshold.</p>
                  </div>
                </div>
              </div>

              <button className="mt-8 px-8 py-4 bg-hotmess-red hover:bg-red-600 transition-colors uppercase tracking-wider">
                Apply Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="p-6 bg-zinc-900 border border-hotmess-red/20 hover:border-hotmess-red/50 transition-colors"
                  >
                    <Icon className="w-8 h-8 text-hotmess-red mb-3" />
                    <h4 className="mb-2">{benefit.title}</h4>
                    <p className="text-sm text-zinc-500">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Commission Tiers */}
        <section className="mb-32">
          <h2 className="text-4xl md:text-5xl mb-12 uppercase text-center">Commission Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`p-8 border-2 ${
                  i === 1
                    ? 'bg-hotmess-red/10 border-hotmess-red'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {i === 1 && (
                  <div className="mb-4 px-3 py-1 bg-hotmess-red inline-block text-xs uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-3xl mb-2">{tier.name}</h3>
                <div className="text-sm text-zinc-500 mb-4">{tier.threshold}</div>
                <div className="text-lg text-hotmess-red mb-6" style={{ fontWeight: 600 }}>
                  {tier.commission}
                </div>
                <ul className="space-y-3">
                  {tier.perks.map((perk, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-zinc-300">
                      <CheckCircle className="w-4 h-4 text-hotmess-red flex-shrink-0 mt-0.5" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Cross-Linking */}
        <section className="mb-32">
          <h2 className="text-4xl md:text-5xl mb-12 uppercase">What You Can Promote</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => onNavigate('?route=shop')}
              className="p-8 bg-zinc-900 border-2 border-transparent hover:border-hotmess-red transition-colors text-left group"
            >
              <h3 className="text-2xl mb-3 group-hover:text-hotmess-red transition-colors">Shop</h3>
              <p className="text-zinc-400 mb-4">RAW, HUNG, HIGH collections. 15% base commission.</p>
              <div className="flex items-center gap-2 text-hotmess-red text-sm">
                View Shop
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('?route=messmarket')}
              className="p-8 bg-zinc-900 border-2 border-transparent hover:border-hotmess-red transition-colors text-left group"
            >
              <h3 className="text-2xl mb-3 group-hover:text-hotmess-red transition-colors">MessMarket</h3>
              <p className="text-zinc-400 mb-4">P2P marketplace gear. 10% commission on sales.</p>
              <div className="flex items-center gap-2 text-hotmess-red text-sm">
                Browse Market
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('?route=records')}
              className="p-8 bg-zinc-900 border-2 border-transparent hover:border-hotmess-red transition-colors text-left group"
            >
              <h3 className="text-2xl mb-3 group-hover:text-hotmess-red transition-colors">Records</h3>
              <p className="text-zinc-400 mb-4">Music releases + downloads. 8% commission.</p>
              <div className="flex items-center gap-2 text-hotmess-red text-sm">
                Explore Records
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>
          </div>
        </section>

        {/* Example Link */}
        <section className="mb-32">
          <div className="p-12 bg-gradient-to-br from-hotmess-red/20 to-black border-2 border-hotmess-red">
            <h3 className="text-3xl mb-6 text-center">Your Affiliate Link</h3>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 p-4 bg-black border border-white/10 mb-4">
                <input
                  type="text"
                  value="https://hotmess.london/?ref=HOTMESS-DEMO-2024"
                  readOnly
                  className="flex-1 bg-transparent border-none outline-none text-zinc-400"
                />
                <button
                  onClick={copyAffiliateCode}
                  className="px-4 py-2 bg-hotmess-red hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  {copiedCode ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-zinc-500 text-center">
                Share this link to earn commission on purchases
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-32">
          <h2 className="text-4xl md:text-5xl mb-12 uppercase">FAQs</h2>
          <div className="space-y-6 max-w-4xl">
            <details className="p-6 bg-zinc-900 border border-white/10">
              <summary className="cursor-pointer text-lg mb-4">When do I get paid?</summary>
              <p className="text-zinc-400">
                Payouts are processed monthly on the 15th. Elite tier affiliates get weekly payouts.
              </p>
            </details>

            <details className="p-6 bg-zinc-900 border border-white/10">
              <summary className="cursor-pointer text-lg mb-4">Is there a minimum payout?</summary>
              <p className="text-zinc-400">
                No minimum! You'll get paid regardless of how much you earn.
              </p>
            </details>

            <details className="p-6 bg-zinc-900 border border-white/10">
              <summary className="cursor-pointer text-lg mb-4">Can I promote on social media?</summary>
              <p className="text-zinc-400">
                Yes! Instagram, Twitter, TikTok, YouTube—anywhere your audience hangs out. Just follow our brand guidelines.
              </p>
            </details>

            <details className="p-6 bg-zinc-900 border border-white/10">
              <summary className="cursor-pointer text-lg mb-4">Do commissions stack with other promotions?</summary>
              <p className="text-zinc-400">
                Yes. You earn commission on the final sale price, even during sales or with discount codes.
              </p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-4xl md:text-5xl mb-6 uppercase">Ready to Get Started?</h2>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join 200+ affiliates earning commission on HOTMESS products.
          </p>
          <button className="px-12 py-5 bg-hotmess-red hover:bg-red-600 transition-colors uppercase tracking-wider text-lg">
            Apply for Affiliate Program
          </button>
          <div className="mt-6 text-sm text-zinc-500">
            Questions? <button onClick={() => onNavigate('?route=care')} className="text-white underline">Contact our team</button>
          </div>
        </section>
      </div>
    </div>
  );
}
