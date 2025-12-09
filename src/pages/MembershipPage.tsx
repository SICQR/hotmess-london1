// HOTMESS LONDON - Membership Page
// Tier selection and upgrade flow

import { useState } from 'react';
import { Check, Zap, Crown, Info } from 'lucide-react';
import { TierCard } from '../components/membership/TierCard';
import { HotmessButton } from '../components/hotmess/Button';
import { useMembership } from '../hooks/useMembership';
import { useAuth } from '../contexts/AuthContext';
import { LoadingState } from '../components/LoadingState';
import { MembershipTier } from '../types/membership';

interface MembershipPageProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export function MembershipPage({ onNavigate }: MembershipPageProps) {
  const { user, session } = useAuth();
  const { membership, currentLevel, loading } = useMembership(session?.access_token);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Sign in to upgrade</h2>
          <HotmessButton onClick={() => onNavigate('login')}>
            Sign In
          </HotmessButton>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Loading membership..." />;
  }

  const handleTierSelect = (tier: MembershipTier, cycle: 'monthly' | 'yearly') => {
    // In production, this would open Stripe checkout
    console.log(`Selected ${tier} - ${cycle}`);
    alert(`Stripe checkout for ${tier} (${cycle}) would open here`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-hot/20 to-transparent border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white mb-3 sm:mb-4">Upgrade Your Nightlife</h1>
            <p className="text-base sm:text-lg text-white/80 mb-6">
              Choose the membership that fits your lifestyle. More access, more XP, more power.
            </p>
            
            {/* Current Status */}
            {membership && (
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-neutral-900 border border-white/10 rounded-full flex-wrap justify-center">
                <span className="text-xl sm:text-2xl">
                  {membership.tier === 'free' && '🆓'}
                  {membership.tier === 'pro' && '⭐'}
                  {membership.tier === 'elite' && '👑'}
                </span>
                <div className="text-left">
                  <div className="text-xs sm:text-sm text-white/60">Current Plan</div>
                  <div className="text-sm sm:text-base text-white capitalize">{membership.tier}</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-left">
                  <div className="text-xs sm:text-sm text-white/60">Level</div>
                  <div className="text-sm sm:text-base text-white">{currentLevel}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-4 p-1.5 sm:p-2 bg-neutral-900 border border-white/10 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-hot text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-hot text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-400">(Save 17%)</span>
            </button>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto mb-10 sm:mb-12">
          <TierCard
            tier="free"
            currentTier={membership?.tier || 'free'}
            currentLevel={currentLevel}
            billingCycle={billingCycle}
            onSelect={handleTierSelect}
          />
          <TierCard
            tier="pro"
            currentTier={membership?.tier || 'free'}
            currentLevel={currentLevel}
            billingCycle={billingCycle}
            onSelect={handleTierSelect}
            featured
          />
          <TierCard
            tier="elite"
            currentTier={membership?.tier || 'free'}
            currentLevel={currentLevel}
            billingCycle={billingCycle}
            onSelect={handleTierSelect}
          />
        </div>

        {/* Features Comparison */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl text-white mb-4 sm:mb-6 text-center">Full Feature Comparison</h2>
          
          <div className="bg-neutral-900 border border-white/10 rounded-lg sm:rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white text-sm sm:text-base">Feature</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-white text-sm sm:text-base">Free</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-white text-sm sm:text-base bg-blue-950/20">Pro</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-white text-sm sm:text-base bg-yellow-950/20">Elite</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'City Rooms Access', free: '3 rooms', pro: 'Full city', elite: 'Global' },
                  { feature: 'Drop Access', free: 'Basic', pro: 'Early access', elite: 'First access' },
                  { feature: 'Seller Fees', free: '15%', pro: '12%', elite: '10%' },
                  { feature: 'Event Access', free: 'Standard', pro: 'Early tickets', elite: 'VIP + Free monthly' },
                  { feature: 'XP Boost', free: 'None', pro: '+10%', elite: '+20%' },
                  { feature: 'Merch Discount', free: 'None', pro: '10%', elite: '15%' },
                  { feature: 'Heatmap Access', free: 'None', pro: 'Limited', elite: 'Full' },
                  { feature: 'Priority Support', free: 'No', pro: 'Yes', elite: 'Dedicated' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-4 text-white/80">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-white/60">{row.free}</td>
                    <td className="px-6 py-4 text-center text-white bg-blue-950/10">{row.pro}</td>
                    <td className="px-6 py-4 text-center text-white bg-yellow-950/10">{row.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl text-white mb-6 text-center">FAQs</h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! You can cancel your subscription at any time. You\'ll keep your benefits until the end of your billing period.',
              },
              {
                q: 'What happens to my XP if I downgrade?',
                a: 'You keep all your XP! However, future XP earnings will no longer include the membership boost.',
              },
              {
                q: 'Do I need a minimum level to upgrade?',
                a: 'Yes. Pro requires Level 3+, Elite requires Level 6+. Keep earning XP to unlock higher tiers!',
              },
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-neutral-900 border border-white/10 rounded-xl">
                <h3 className="text-white mb-2 flex items-start gap-2">
                  <Info size={20} className="text-hot flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-white/70 text-sm pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
