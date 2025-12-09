// HOTMESS LONDON — Welcome/Onboarding Flow
// Shown after user completes registration

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, User, MapPin, Calendar } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface WelcomePageProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
  userName?: string;
}

export function WelcomePage({ onNavigate, userName = 'mate' }: WelcomePageProps) {
  const [step, setStep] = useState<'welcome' | 'verify' | 'complete'>('welcome');

  const handleContinue = () => {
    if (step === 'welcome') {
      setStep('verify');
    } else if (step === 'verify') {
      setStep('complete');
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="bg-black min-h-screen w-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FF1744' }}
            >
              <Check className="w-12 h-12 text-black" strokeWidth={3} />
            </motion.div>

            {/* Title */}
            <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
              Welcome to HOTMESS,
              <br />
              <span style={{ color: '#FF1744' }}>{userName}</span>
            </h1>
            <div className="h-1 w-24 mx-auto mb-8" style={{ backgroundColor: '#FF1744' }} />

            {/* Description */}
            <p className="text-gray-300 mb-12 max-w-lg mx-auto" style={{ fontSize: '18px' }}>
              You've joined London's complete masculine nightlife OS for queer men 18+. Let's get you set up.
            </p>

            {/* Features */}
            <div className="grid gap-6 mb-12 text-left">
              {[
                { icon: MapPin, label: 'Scan beacons at venues', desc: 'Unlock exclusive drops & rewards' },
                { icon: Calendar, label: 'Discover events', desc: 'Find parties, clubs & community meetups' },
                { icon: User, label: 'Connect with others', desc: 'Build your crew in the community' }
              ].map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex gap-4 p-4 bg-zinc-900 border border-zinc-800"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800">
                    <feature.icon className="w-6 h-6" style={{ color: '#FF1744' }} />
                  </div>
                  <div>
                    <div className="text-white mb-1" style={{ fontWeight: 700 }}>{feature.label}</div>
                    <div className="text-gray-400 text-sm">{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleContinue}
              className="px-8 py-4 uppercase tracking-wider flex items-center gap-3 mx-auto"
              style={{ 
                fontWeight: 900,
                fontSize: '18px',
                backgroundColor: '#FF1744',
                color: '#000000'
              }}
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Email Verification Step */}
        {step === 'verify' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-zinc-900 border-2 flex items-center justify-center" style={{ borderColor: '#FF1744' }}>
              <div style={{ fontSize: '72px' }}>📧</div>
            </div>

            {/* Title */}
            <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
              Email Verification
            </h1>
            <div className="h-1 w-24 mx-auto mb-8" style={{ backgroundColor: '#FF1744' }} />

            {/* Info Box */}
            <div className="bg-zinc-900 border-2 p-8 mb-8 text-left" style={{ borderColor: '#FF1744' }}>
              <div className="mb-4">
                <div className="text-white mb-2" style={{ fontWeight: 700, fontSize: '18px' }}>Account Created Successfully! 🎉</div>
                <div className="text-gray-300">
                  Your account has been created and is ready to use.
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 mt-4">
                <div className="text-yellow-500 mb-2" style={{ fontWeight: 700 }}>⚠️ Email Server Not Configured</div>
                <div className="text-gray-400 text-sm">
                  Since this is a demo environment, we haven't set up email confirmation yet. 
                  Your account has been <span className="text-white" style={{ fontWeight: 700 }}>automatically verified</span> so you can start using HOTMESS immediately.
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 mt-4">
                <div className="text-gray-500 text-xs">
                  In production, you'd receive an email to verify your address. For now, you're all set!
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleContinue}
              className="px-8 py-4 uppercase tracking-wider flex items-center gap-3 mx-auto"
              style={{ 
                fontWeight: 900,
                fontSize: '18px',
                backgroundColor: '#FF1744',
                color: '#000000'
              }}
            >
              Continue to Profile Setup
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-32 h-32 mx-auto mb-8"
            >
              <div className="text-8xl">🔥</div>
            </motion.div>

            {/* Title */}
            <h1 className="text-white mb-4" style={{ fontWeight: 900 }}>
              You're all set!
            </h1>
            <div className="h-1 w-24 mx-auto mb-8" style={{ backgroundColor: '#FF1744' }} />

            <p className="text-gray-300 mb-12 max-w-lg mx-auto" style={{ fontSize: '18px' }}>
              Your profile is ready. Start exploring London's nightlife scene.
            </p>

            {/* Quick Actions */}
            <div className="grid gap-4 mb-12">
              <button
                onClick={() => onNavigate('beacons')}
                className="p-6 bg-zinc-900 border-2 hover:border-white transition-colors text-left"
                style={{ borderColor: '#FF1744' }}
              >
                <div className="text-white mb-2" style={{ fontWeight: 700, fontSize: '20px' }}>Scan Your First Beacon</div>
                <div className="text-gray-400">Visit a HOTMESS venue and unlock rewards</div>
              </button>

              <button
                onClick={() => onNavigate('events')}
                className="p-6 bg-zinc-900 border border-zinc-800 hover:border-white transition-colors text-left"
              >
                <div className="text-white mb-2" style={{ fontWeight: 700, fontSize: '20px' }}>Browse Events</div>
                <div className="text-gray-400">Find tonight's parties & meetups</div>
              </button>

              <button
                onClick={() => onNavigate('marketplace')}
                className="p-6 bg-zinc-900 border border-zinc-800 hover:border-white transition-colors text-left"
              >
                <div className="text-white mb-2" style={{ fontWeight: 700, fontSize: '20px' }}>Shop Marketplace</div>
                <div className="text-gray-400">Browse gear, merch & community goods</div>
              </button>
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-4 uppercase tracking-wider flex items-center gap-3 mx-auto"
              style={{ 
                fontWeight: 900,
                fontSize: '18px',
                backgroundColor: '#FF1744',
                color: '#000000'
              }}
            >
              Enter HOTMESS
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="mt-4 text-gray-500 hover:text-white transition-colors text-sm"
            >
              Skip for now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
