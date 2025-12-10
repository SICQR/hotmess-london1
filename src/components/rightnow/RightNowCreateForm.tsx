'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Camera } from 'lucide-react';
import type { RightNowIntent, RightNowVisibility } from '@/types/rightnow';

export function RightNowCreateForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Form state
  const [intent, setIntent] = useState<RightNowIntent | null>(null);
  const [text, setText] = useState('');
  const [location, setLocation] = useState<'home' | 'venue' | 'street'>('home');
  const [beaconScanned, setBeaconScanned] = useState(false);
  const [ttl, setTtl] = useState<15 | 30 | 45 | 60 | 90>(30);
  const [showInGlobe, setShowInGlobe] = useState(true);
  const [telegramMirror, setTelegramMirror] = useState(false);
  const [safeTags, setSafeTags] = useState<string[]>([]);

  const intentOptions: { value: RightNowIntent; label: string; emoji: string; desc: string }[] = [
    { value: 'hookup', label: 'Hookup', emoji: '🔥', desc: 'Looking for men, no small talk' },
    { value: 'crowd', label: 'Crowd', emoji: '👥', desc: 'Party / flat gathering' },
    { value: 'drop', label: 'Drop', emoji: '🛍', desc: 'Selling / trading gear' },
    { value: 'ticket', label: 'Ticket', emoji: '🎟', desc: 'Event / club night' },
    { value: 'radio', label: 'Radio', emoji: '📻', desc: 'Listening / vibing at home' },
    { value: 'care', label: 'Care', emoji: '🧴', desc: 'Need aftercare / someone to talk' },
  ];

  const handleSubmit = async () => {
    if (!intent || !text.trim()) return;

    try {
      // Get user's location (simplified for now)
      const city = 'London'; // In production, detect from browser geolocation
      
      const response = await fetch(
        'https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/hotmess-os/right-now',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // In production, add: 'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            mode: intent,
            text: text.trim(),
            city,
            ttl_minutes: ttl,
            visibility: location === 'home' ? 'near' : location === 'venue' ? 'city' : 'local',
            show_in_globe: showInGlobe,
            telegram_mirror: telegramMirror,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to create post:', error);
        alert(error.error || 'Failed to create post. Please try again.');
        return;
      }

      const data = await response.json();
      console.log('Post created successfully:', data);
      
      // Redirect back to feed
      router.push('/right-now');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const canProceedStep1 = intent !== null;
  const canProceedStep2 = text.trim().length > 0 && text.length <= 120;
  const canProceedStep3 = true;
  const canSubmit = canProceedStep1 && canProceedStep2 && canProceedStep3;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep((step - 1) as any) : router.back()}
            className="p-2 -ml-2"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            POST RIGHT NOW
          </div>
          
          <div style={{ width: '40px' }} /> {/* Spacer */}
        </div>

        {/* Progress */}
        <div className="flex gap-1 mt-4">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className="flex-1 h-1 transition-all"
              style={{
                background: s <= step ? '#FF0080' : 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pt-32 pb-24 px-6">
        {/* Step 1: Intent */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 900,
              marginBottom: '8px',
            }}>
              What&apos;s your 60-minute truth?
            </h2>
            
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.68)',
              marginBottom: '32px',
            }}>
              Pick your intent. This isn&apos;t permanent — it&apos;s what you want right now.
            </p>

            <div className="space-y-3">
              {intentOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setIntent(option.value)}
                  className="w-full text-left transition-all"
                  style={{
                    padding: '16px',
                    background: intent === option.value
                      ? 'rgba(255,0,128,0.15)'
                      : 'rgba(255,255,255,0.03)',
                    border: intent === option.value
                      ? '2px solid #FF0080'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontSize: '24px' }}>{option.emoji}</span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}>
                      {option.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.6)',
                    paddingLeft: '36px',
                  }}>
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Message */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 900,
              marginBottom: '8px',
            }}>
              Say it quick
            </h2>
            
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.68)',
              marginBottom: '32px',
            }}>
              120 characters. No essays. Just what&apos;s happening or what you want.
            </p>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 120))}
              placeholder="TOP FLOOR / NOW"
              className="w-full px-4 py-4 bg-white/5 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 resize-none"
              rows={4}
              style={{
                borderRadius: '12px',
                fontSize: '16px',
              }}
            />

            <div className="flex items-center justify-between mt-2">
              <div style={{
                fontSize: '11px',
                letterSpacing: '0.05em',
                color: 'rgba(255,255,255,0.5)',
              }}>
                {text.length} / 120
              </div>
              
              {text.length >= 100 && (
                <div style={{
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  color: text.length >= 120 ? '#FF1744' : '#FFD600',
                }}>
                  {120 - text.length} remaining
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 900,
              marginBottom: '8px',
            }}>
              Where are you?
            </h2>
            
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.68)',
              marginBottom: '32px',
            }}>
              Scan a venue QR to crowd-verify. Or just say where you are.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setLocation('home')}
                className="w-full text-left transition-all"
                style={{
                  padding: '16px',
                  background: location === 'home'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.03)',
                  border: location === 'home'
                    ? '2px solid rgba(255,255,255,0.4)'
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                  🏠 At home / private flat
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  Your general area (location rounded)
                </div>
              </button>

              <button
                onClick={() => {
                  setLocation('venue');
                  // TODO: Open QR scanner
                  console.log('Opening QR scanner...');
                }}
                className="w-full text-left transition-all"
                style={{
                  padding: '16px',
                  background: location === 'venue'
                    ? 'rgba(0,200,83,0.15)'
                    : 'rgba(255,255,255,0.03)',
                  border: location === 'venue'
                    ? '2px solid #00C853'
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>
                    📍 At venue (scan QR)
                  </div>
                  <Camera size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  {beaconScanned
                    ? '✅ Venue scanned — crowd verification active'
                    : 'Scan venue beacon to verify location & boost visibility'}
                </div>
              </button>

              <button
                onClick={() => setLocation('street')}
                className="w-full text-left transition-all"
                style={{
                  padding: '16px',
                  background: location === 'street'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.03)',
                  border: location === 'street'
                    ? '2px solid rgba(255,255,255,0.4)'
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                  🚶 On the move / street
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  General area (updates as you move)
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Duration & Settings */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 900,
              marginBottom: '8px',
            }}>
              How long?
            </h2>
            
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.68)',
              marginBottom: '32px',
            }}>
              Your post auto-deletes after this time. No permanent record.
            </p>

            {/* TTL Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[15, 30, 45, 60, 90].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => setTtl(minutes as any)}
                    className="transition-all"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: ttl === minutes ? '#ffffff' : 'rgba(255,255,255,0.5)',
                      fontWeight: ttl === minutes ? 700 : 400,
                    }}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
              
              <input
                type="range"
                min="15"
                max="90"
                step="15"
                value={ttl}
                onChange={(e) => setTtl(parseInt(e.target.value) as any)}
                className="w-full"
                style={{
                  height: '4px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '999px',
                  outline: 'none',
                  appearance: 'none',
                }}
              />
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                    Show in globe heat
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                    Appear on the global heat map
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showInGlobe}
                  onChange={(e) => setShowInGlobe(e.target.checked)}
                  className="w-12 h-6"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                    Mirror to Telegram
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                    Post to your city Telegram room (members only)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={telegramMirror}
                  onChange={(e) => setTelegramMirror(e.target.checked)}
                  className="w-12 h-6"
                />
              </label>
            </div>

            {/* Safety */}
            <div className="mt-8 p-4 border" style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
            }}>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  required
                />
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                  I can leave this situation safely if it feels wrong. I understand this is a temporary pulse, not a permanent profile.
                </div>
              </label>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/10 px-6 py-4">
        {step < 4 ? (
          <button
            onClick={() => {
              if (step === 1 && canProceedStep1) setStep(2);
              if (step === 2 && canProceedStep2) setStep(3);
              if (step === 3 && canProceedStep3) setStep(4);
            }}
            disabled={
              (step === 1 && !canProceedStep1) ||
              (step === 2 && !canProceedStep2) ||
              (step === 3 && !canProceedStep3)
            }
            className="w-full py-4 transition-all disabled:opacity-40"
            style={{
              background: '#FF0080',
              color: '#000000',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            CONTINUE
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-4 transition-all disabled:opacity-40"
            style={{
              background: '#00C853',
              color: '#000000',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              boxShadow: '0 0 20px rgba(0,200,83,0.3)',
            }}
          >
            POST RIGHT NOW • +{intent === 'care' ? 5 : intent === 'crowd' ? 10 : 15} XP
          </button>
        )}
      </div>
    </div>
  );
}