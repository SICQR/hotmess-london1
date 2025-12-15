'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface PanicOverlayProps {
  onClose: () => void;
}

export function PanicOverlay({ onClose }: PanicOverlayProps) {
  const [breathePhase, setBreathePhase] = useState<'in' | 'hold' | 'out'>('in');
  const [feeling, setFeeling] = useState<'unsafe' | 'overwhelmed' | 'unsure' | null>(null);

  // Breathing animation cycle
  useEffect(() => {
    const cycle = () => {
      setBreathePhase('in');
      setTimeout(() => setBreathePhase('hold'), 4000);
      setTimeout(() => setBreathePhase('out'), 7000);
    };

    cycle();
    const interval = setInterval(cycle, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCareMessage = () => {
    // TODO: Open Hand N Hand chat
    console.log('Opening Hand N Hand care room...');
  };

  const handleTrustedContact = () => {
    // TODO: Send SMS to trusted contact
    console.log('Notifying trusted contact...');
  };

  const handleJustCalm = () => {
    // User just needs to breathe
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100]"
      style={{
        background: 'linear-gradient(180deg, #001a2e 0%, #000000 100%)',
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        {/* Breathing Circle */}
        <motion.div
          animate={{
            scale: breathePhase === 'in' ? 1.5 : breathePhase === 'hold' ? 1.5 : 1,
            opacity: breathePhase === 'in' ? 0.6 : breathePhase === 'hold' ? 0.8 : 0.4,
          }}
          transition={{
            duration: breathePhase === 'in' ? 4 : breathePhase === 'hold' ? 3 : 3,
            ease: 'easeInOut',
          }}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,200,255,0.3), transparent)',
            border: '2px solid rgba(100,200,255,0.5)',
            marginBottom: '48px',
          }}
        />

        {/* Breathing Instruction */}
        <div 
          className="mb-8 text-center"
          style={{
            fontSize: '14px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          {breathePhase === 'in' && 'BREATHE IN...'}
          {breathePhase === 'hold' && 'HOLD...'}
          {breathePhase === 'out' && 'BREATHE OUT...'}
        </div>

        {/* Main Message */}
        <div className="mb-12 text-center max-w-md">
          <h1 style={{
            fontSize: '32px',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '16px',
            color: '#ffffff',
          }}>
            HAND N HAND IS HERE.
          </h1>
          
          <p style={{
            fontSize: '16px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '16px',
          }}>
            You&apos;re safe enough to breathe. We hold the room while you find the ground.
          </p>

          <p style={{
            fontSize: '12px',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.5)',
          }}>
            We&apos;re not emergency services. If you&apos;re in danger, call your local emergency number. We help you think, breathe and get home.
          </p>
        </div>

        {/* Feeling Selection (if not selected) */}
        {!feeling && (
          <div className="mb-8 w-full max-w-md">
            <div style={{
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '12px',
              textAlign: 'center',
            }}>
              What&apos;s going wrong?
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setFeeling('unsafe')}
                className="w-full px-6 py-4 transition-all text-left"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  Feel unsafe / want out
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                  We&apos;ll help you leave safely and get home
                </div>
              </button>

              <button
                onClick={() => setFeeling('overwhelmed')}
                className="w-full px-6 py-4 transition-all text-left"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  Overwhelmed / spun out
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                  Too much happening, need to slow down
                </div>
              </button>

              <button
                onClick={() => setFeeling('unsure')}
                className="w-full px-6 py-4 transition-all text-left"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  Need to talk, not sure why
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                  Something feels off, want someone to listen
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons (after feeling selected) */}
        {feeling && (
          <div className="space-y-3 w-full max-w-md">
            <button
              onClick={handleCareMessage}
              className="w-full px-6 py-4 transition-all"
              style={{
                background: '#00C853',
                color: '#000000',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
              }}
            >
              MESSAGE HAND N HAND
            </button>

            <button
              onClick={handleTrustedContact}
              className="w-full px-6 py-4 transition-all"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              TEXT A TRUSTED CONTACT
            </button>

            <button
              onClick={handleJustCalm}
              className="w-full px-6 py-4 transition-all"
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              I&apos;M OK, JUST NEED TO CALM DOWN
            </button>
          </div>
        )}

        {/* Close Button (small, bottom) */}
        <button
          onClick={onClose}
          className="mt-12"
          style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            background: 'none',
            border: 'none',
            padding: '8px',
          }}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
