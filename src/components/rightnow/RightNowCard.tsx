'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { RightNowPost } from '@/types/rightnow';

interface RightNowCardProps {
  post: RightNowPost;
}

export function RightNowCard({ post }: RightNowCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [progress, setProgress] = useState<number>(100);

  // Calculate time remaining
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const expires = new Date(post.expires_at).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeRemaining('EXPIRED');
        setProgress(0);
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const created = new Date(post.created_at).getTime();
      const total = expires - created;
      const elapsed = now - created;
      const progressPercent = ((total - elapsed) / total) * 100;

      setTimeRemaining(`${minutes} MIN`);
      setProgress(progressPercent);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, [post]);

  // Intent emoji
  const getIntentEmoji = () => {
    switch (post.intent) {
      case 'hookup': return '🔥';
      case 'crowd': return '👥';
      case 'drop': return '🛍';
      case 'ticket': return '🎟';
      case 'radio': return '📻';
      case 'care': return '🧴';
      default: return '💬';
    }
  };

  // Heat glow color
  const getHeatColor = () => {
    if (post.heat_score >= 80) return 'rgba(255,23,68,0.35)';
    if (post.heat_score >= 60) return 'rgba(255,215,0,0.25)';
    return 'rgba(255,255,255,0.08)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px',
      }}
      onClick={() => {
        // TODO: Open detail sheet
        console.log('Open post:', post.id);
      }}
    >
      {/* Heat Glow Background */}
      <div 
        className="absolute inset-0 transition-opacity"
        style={{
          background: `radial-gradient(circle at top right, ${getHeatColor()}, transparent 70%)`,
          opacity: post.heat_score / 100,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Top Row: Distance + Heat + Crowd Verified */}
        <div className="flex items-center gap-2 mb-3">
          {/* Distance */}
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.68)',
          }}>
            0.4KM
          </div>

          {/* Heat Indicator */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                style={{
                  width: '4px',
                  height: '12px',
                  background: i <= post.heat_score / 20
                    ? '#FF1744'
                    : 'rgba(255,255,255,0.15)',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>

          {/* Crowd Verified Badge */}
          {post.crowd_verified && (
            <div 
              className="flex items-center gap-1 px-2 py-1"
              style={{
                background: 'rgba(0,0,0,0.82)',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: '999px',
                fontSize: '8px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#ffffff',
              }}
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.8)',
              }} />
              CROWD VERIFIED
            </div>
          )}
        </div>

        {/* Center: Intent + Message */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '20px' }}>{getIntentEmoji()}</span>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {post.intent}
            </div>
          </div>
          
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            color: '#ffffff',
          }}>
            {post.text}
          </div>

          {/* Tags */}
          {post.safe_tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {post.safe_tags.map(tag => (
                <div
                  key={tag}
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.6)',
                    padding: '4px 8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '999px',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Row: TTL + XP */}
        <div className="flex items-center justify-between">
          {/* TTL Progress Ring */}
          <div className="flex items-center gap-3">
            <div className="relative" style={{ width: '48px', height: '48px' }}>
              {/* Background circle */}
              <svg className="absolute inset-0" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                {/* Progress circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke={progress > 20 ? '#FFD600' : '#FF1744'}
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 24 24)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              
              {/* Time text */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  color: '#ffffff',
                }}
              >
                {timeRemaining}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
              EXPIRES IN {timeRemaining}
            </div>
          </div>

          {/* XP Reward */}
          <div 
            className="flex items-center gap-1 px-3 py-1"
            style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '999px',
            }}
          >
            <span style={{ color: '#FFD600' }}>★</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#FFD600',
            }}>
              +{post.xp_reward} XP
            </span>
          </div>
        </div>

        {/* Panic Nearby Warning */}
        {post.panic_nearby && (
          <div 
            className="mt-3 flex items-center gap-2 px-3 py-2"
            style={{
              background: 'rgba(255,23,68,0.1)',
              border: '1px solid rgba(255,23,68,0.3)',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '14px' }}>⚠️</div>
            <div style={{
              fontSize: '10px',
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.8)',
            }}>
              Safety incident nearby in last 60min. Check Hand N Hand for details.
            </div>
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div 
        className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all pointer-events-none"
        style={{ borderRadius: '12px' }}
      />
    </motion.div>
  );
}
