import { RouteId } from '../lib/routes';
import { Check, Zap, Star, Shield, Package, Percent, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  route?: RouteId;
}

interface FeeStructure {
  tier: string;
  fee: string;
  description: string;
}

export function Pricing({ onNavigate }: PricingProps) {
  const beaconTiers: PricingTier[] = [
    {
      name: 'Free',
      price: '£0',
      description: 'Create beacons for personal events and gatherings',
      features: [
        'Create up to 3 active beacons',
        'Basic location markers',
        'QR code generation',
        '48-hour beacon lifetime',
        'Community visibility',
        'Standard support',
      ],
      cta: 'Get Started',
      route: 'register',
    },
    {
      name: 'Verified Host',
      price: '£25',
      period: '/month',
      description: 'For regular hosts and event organizers',
      features: [
        'Unlimited active beacons',
        'Priority map placement',
        'Custom beacon branding',
        '7-day beacon lifetime',
        'Advanced analytics',
        'Verified host badge',
        'Priority support',
        'Ticket integration',
      ],
      cta: 'Apply Now',
      highlighted: true,
      route: 'applyHost',
    },
    {
      name: 'Vendor/Sponsor',
      price: 'Custom',
      description: 'For venues, brands, and commercial partners',
      features: [
        'Everything in Verified Host',
        'Permanent beacons',
        'White-label branding',
        'Premium map placement',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'Revenue share opportunities',
      ],
      cta: 'Contact Us',
      route: 'about',
    },
  ];

  const messMarketFees: FeeStructure[] = [
    {
      tier: 'Standard Seller',
      fee: '5% + Stripe fees',
      description: 'Perfect for individual sellers and small operations',
    },
    {
      tier: 'White-Label Partner',
      fee: '10% + Stripe fees',
      description: 'Premium seller mode with custom branding and enhanced visibility',
    },
  ];

  const shopAffiliateCommission = [
    { category: 'RAW', rate: '12%', minOrder: '£50' },
    { category: 'HUNG', rate: '15%', minOrder: '£75' },
    { category: 'HIGH', rate: '10%', minOrder: '£40' },
    { category: 'SUPER', rate: '18%', minOrder: '£100' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1
              className="text-white mb-6"
              style={{
                fontSize: 'clamp(56px, 10vw, 120px)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
              }}
            >
              TRANSPARENT
              <br />
              PRICING
            </h1>
            <p className="text-white/60 text-xl max-w-3xl mx-auto">
              No hidden fees. No surprises. Just honest pricing for creators, hosts, and sellers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Beacon Hosting Pricing */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-hot/20 border border-hot mb-4">
              <Zap className="w-4 h-4 text-hot" />
              <span className="text-hot uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                Beacon Hosting
              </span>
            </div>
            <h2
              className="text-white mb-4"
              style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em' }}
            >
              Host Events Your Way
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              From intimate gatherings to large-scale events, we have a plan for every host.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {beaconTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-white/5 border transition-all ${
                  tier.highlighted
                    ? 'border-hot scale-105 md:scale-110'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {tier.highlighted && (
                  <div className="bg-hot text-white text-center py-2">
                    <span className="uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3
                    className="text-white mb-2"
                    style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.01em' }}
                  >
                    {tier.name}
                  </h3>
                  <div className="mb-4">
                    <span
                      className="text-white"
                      style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em' }}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-white/60 text-lg">{tier.period}</span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-6">{tier.description}</p>

                  <button
                    onClick={() => tier.route && onNavigate(tier.route)}
                    className={`w-full py-3 mb-8 uppercase tracking-wider transition-all ${
                      tier.highlighted
                        ? 'bg-hot hover:bg-white text-white hover:text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    style={{ fontSize: '12px', fontWeight: 700 }}
                  >
                    {tier.cta}
                  </button>

                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                        <Check className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MessMarket Seller Fees */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-hot/20 border border-hot mb-4">
              <Package className="w-4 h-4 text-hot" />
              <span className="text-hot uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                MessMarket Fees
              </span>
            </div>
            <h2
              className="text-white mb-4"
              style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em' }}
            >
              Sell on Your Terms
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Fair, transparent fees for community sellers. Keep more of what you earn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {messMarketFees.map((fee, index) => (
              <motion.div
                key={fee.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 hover:border-hot/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-hot/20 p-3">
                    <Percent className="w-6 h-6 text-hot" />
                  </div>
                  <h3
                    className="text-white"
                    style={{ fontSize: '20px', fontWeight: 700 }}
                  >
                    {fee.tier}
                  </h3>
                </div>
                <div className="mb-4">
                  <span
                    className="text-hot"
                    style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em' }}
                  >
                    {fee.fee}
                  </span>
                </div>
                <p className="text-white/60 text-sm">{fee.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('sellerDashboard')}
              className="px-8 py-4 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              Start Selling
            </button>
          </div>
        </div>
      </section>

      {/* Shop Affiliate Commission */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-hot/20 border border-hot mb-4">
              <TrendingUp className="w-4 h-4 text-hot" />
              <span className="text-hot uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                Affiliate Program
              </span>
            </div>
            <h2
              className="text-white mb-4"
              style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em' }}
            >
              Earn by Sharing
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Join our affiliate program and earn commission on shop sales across all categories.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                      Category
                    </th>
                    <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                      Commission
                    </th>
                    <th className="text-left px-6 py-4 text-white/60 uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                      Min Order
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shopAffiliateCommission.map((item, index) => (
                    <tr
                      key={item.category}
                      className={`${
                        index !== shopAffiliateCommission.length - 1 ? 'border-b border-white/5' : ''
                      } hover:bg-white/5 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-bold text-lg">{item.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-hot font-bold text-xl">{item.rate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/60">{item.minOrder}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('affiliate')}
              className="px-8 py-4 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              Join Affiliate Program
            </button>
          </div>
        </div>
      </section>

      {/* RAW CONVICT RECORDS Revenue Split */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-hot/20 border border-hot mb-4">
              <Star className="w-4 h-4 text-hot" />
              <span className="text-hot uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
                RAW CONVICT RECORDS
              </span>
            </div>
            <h2
              className="text-white mb-4"
              style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em' }}
            >
              Artist-First Revenue
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              We believe artists should keep most of what they earn. No major label bullshit.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-12">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div
                    className="text-hot mb-2"
                    style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em' }}
                  >
                    70%
                  </div>
                  <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
                    Artist
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-white mb-2"
                    style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em' }}
                  >
                    30%
                  </div>
                  <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>
                    Label
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-white/80 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                  <span>Artists retain all rights to their masters</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                  <span>Transparent monthly payouts via Stripe</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                  <span>No hidden fees or deductions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-hot flex-shrink-0 mt-0.5" />
                  <span>Full analytics and sales reporting</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('records')}
              className="px-8 py-4 bg-hot hover:bg-white text-white hover:text-black transition-all uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              Browse Releases
            </button>
          </div>
        </div>
      </section>

      {/* FAQ / Final CTA */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <Shield className="w-16 h-16 text-hot mx-auto mb-6" />
          <h2
            className="text-white mb-4"
            style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em' }}
          >
            Questions About Pricing?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            We're here to help. Get in touch with our team for custom plans or any pricing questions.
          </p>
          <button
            onClick={() => onNavigate('about')}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white transition-all uppercase tracking-wider"
            style={{ fontSize: '14px', fontWeight: 700 }}
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}
