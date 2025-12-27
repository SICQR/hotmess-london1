/**
 * CONNECT MODULE - MAIN LANDING
 * Consent-first dating & hookup module for queer men 18+
 * REDESIGNED: Production-ready UI with improved flows
 */

import { useState, useEffect } from 'react';
import { RouteId } from '../lib/routes';
import { HMButton } from '../components/library/HMButton';
import { 
  Flame, 
  Users, 
  MessageCircle, 
  Shield, 
  Lock, 
  Sparkles, 
  Heart, 
  MapPin, 
  Tag,
  Plus,
  Inbox,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface ConnectProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function Connect({ onNavigate }: ConnectProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Escape hatch: many legacy tables are not represented in local DB typings.
  const sb = supabase as any;

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setLoading(false);
      return;
    }

    setUser(session.user);

    // Consent + age gate are now backed by profiles flags.
    // (This aligns with the App-level consent lock gate.)
    const { data: profileRow, error: profileError } = await sb
      .from('profiles')
      .select('consent_accepted, is_18_plus')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('[Connect] Failed to load profile flags:', profileError);
      setHasConsent(false);
    } else if (!profileRow) {
      // If profile row doesn't exist yet, create it (then treat as not consented).
      const { error: upsertError } = await sb
        .from('profiles')
        .upsert({ id: session.user.id }, { onConflict: 'id' });
      if (upsertError) {
        console.error('[Connect] Failed to create profile row:', upsertError);
      }
      setHasConsent(false);
    } else {
      const is18Plus = Boolean((profileRow as any).is_18_plus);
      const consentAccepted = Boolean((profileRow as any).consent_accepted);
      setHasConsent(is18Plus && consentAccepted);
      if (!is18Plus || !consentAccepted) {
        setShowConsentModal(true);
      }
    }

    // Membership tier remains in user metadata (until moved to profiles).
    const meta = session.user.user_metadata;
    const tier = meta?.membership_tier || 'free';
    setIsPremium(tier !== 'free');

    setLoading(false);
  }

  async function giveConsent() {
    if (!user) return;

    // Update DB-backed flags on profiles.
    const { error } = await sb
      .from('profiles')
      .update({
        consent_accepted: true,
        is_18_plus: true,
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to save consent');
      return;
    }

    setHasConsent(true);
    setShowConsentModal(false);
    toast.success('✓ Consent verified. Welcome to Connect!');
  }

  async function handleTelegramConnect() {
    if (!user?.id) {
      toast.error('Please sign in first');
      return;
    }

    try {
      const token = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
        .replace(/[^a-zA-Z0-9]/g, '');

      const { error } = await sb.from('bot_sessions').insert({
        user_id: user.id,
        token,
      });

      if (error) {
        toast.error('Failed to create Telegram link');
        return;
      }

      window.location.href = `https://t.me/HotmessConnectBot?start=${token}`;
    } catch {
      toast.error('Failed to connect Telegram');
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Flame className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <p className="text-white/60">Loading Connect...</p>
        </div>
      </div>
    );
  }

  // Not logged in - Redesigned landing
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent" />
          <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
            <Flame className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-6xl font-bold uppercase tracking-tighter mb-4">
              CONNECT
            </h1>
            <p className="text-xl text-white/70 mb-2">
              Consent-first connections at nightlife venues
            </p>
            <p className="text-sm text-white/50 max-w-xl mx-auto">
              For queer men 18+. Real people. Real venues. Real connections.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-white/5 border border-white/10">
              <Shield className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">Consent-First</h3>
              <p className="text-sm text-white/60">
                Both parties must explicitly opt-in. No stalking, no harassment, zero tolerance policy.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <MapPin className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">Venue-Based</h3>
              <p className="text-sm text-white/60">
                Only see intents from people at the same venue right now. Real connections in real time.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <Lock className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">Privacy-First</h3>
              <p className="text-sm text-white/60">
                Anonymous until mutual opt-in. Threads auto-delete after 7 days of inactivity.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <Users className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">Premium Community</h3>
              <p className="text-sm text-white/60">
                Premium members only. Verified profiles, quality standards, better moderation.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <HMButton 
              onClick={() => onNavigate('login')} 
              className="h-14 px-8"
              size="lg"
            >
              <Flame className="w-5 h-5" />
              SIGN IN TO CONNECT
            </HMButton>
            <p className="text-xs text-white/40">
              Must be 18+ and Premium member or higher
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Consent Modal (overlays main content)
  const ConsentModal = () => (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="mb-8 text-center">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">
              Age Verification & Consent
            </h1>
            <p className="text-white/60">
              Required to access Connect features
            </p>
          </div>

          {/* 18+ Warning */}
          <div className="p-6 bg-red-500/20 border-2 border-red-500 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">18+ ONLY - LEGAL REQUIREMENT</h3>
                <p className="text-sm text-white/80">
                  You must be at least 18 years old to use Connect. This is a legal requirement and strictly enforced.
                  False declarations result in permanent ban.
                </p>
              </div>
            </div>
          </div>

          {/* Consent Principles */}
          <div className="p-6 bg-white/5 border border-white/10 mb-6 space-y-4">
            <h3 className="font-bold uppercase tracking-wide">Consent-First Principles</h3>
            
            <div className="space-y-3 text-sm">
              {[
                { 
                  title: 'Mutual Opt-In Only', 
                  desc: 'Both parties must explicitly opt-in for a connection. No surprises.'
                },
                { 
                  title: 'Anonymous Until Match', 
                  desc: 'You cannot see who created an intent until mutual opt-in. No stalking.'
                },
                { 
                  title: 'Close Anytime', 
                  desc: 'Either party can close a thread at any time. No questions asked.'
                },
                { 
                  title: 'Zero Tolerance', 
                  desc: 'Harassment, stalking, or abuse results in immediate permanent ban.'
                },
                { 
                  title: 'Privacy-First', 
                  desc: 'Threads auto-delete after 7 days of inactivity. Your data, your control.'
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Agreement */}
          <div className="p-6 bg-white/5 border border-white/10 mb-6 space-y-3">
            <h3 className="font-bold uppercase tracking-wide">I Agree To:</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>✓ I am at least 18 years old</p>
              <p>✓ I will respect consent and boundaries at all times</p>
              <p>✓ I will not harass, stalk, or abuse other users</p>
              <p>✓ I will report inappropriate behavior immediately</p>
              <p>✓ I understand violations result in permanent ban</p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <HMButton
              onClick={giveConsent}
              className="w-full h-14"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              I AM 18+ AND AGREE TO ALL TERMS
            </HMButton>

            <button
              onClick={() => {
                setShowConsentModal(false);
                onNavigate('home');
              }}
              className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/20 text-white transition-colors"
            >
              Decline & Return Home
            </button>

            <p className="text-xs text-white/40 text-center">
              By continuing, you confirm you are 18+ and agree to our consent-first principles and community guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Premium Gate
  if (user && hasConsent && !isPremium) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">
              Premium Required
            </h1>
            <p className="text-white/60 text-lg">
              Upgrade your membership to access Connect
            </p>
          </div>

          {/* Premium Benefits */}
          <div className="space-y-6 mb-8">
            <div className="p-8 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30">
              <Lock className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="font-bold text-xl mb-3">Why Premium?</h3>
              <div className="space-y-3 text-sm text-white/70">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                  <span><strong className="text-white">Better Safety:</strong> Enhanced moderation and verification</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                  <span><strong className="text-white">Quality Community:</strong> Verified members only</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                  <span><strong className="text-white">Platform Support:</strong> Help us keep the lights on</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                  <span><strong className="text-white">Premium Features:</strong> Exclusive access to Connect + more</span>
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <HMButton
                onClick={() => onNavigate('pricing')}
                className="h-14 px-8"
                size="lg"
              >
                <Sparkles className="w-5 h-5" />
                VIEW MEMBERSHIP PLANS
              </HMButton>
              
              <button
                onClick={() => onNavigate('home')}
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Connect Dashboard - REDESIGNED
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Show consent modal if needed */}
      {showConsentModal && <ConsentModal />}

      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tight">Connect</h1>
                <p className="text-xs text-white/50">Consent-first connections</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleTelegramConnect}
                className="h-9 px-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs uppercase tracking-wide transition-colors"
              >
                Link Telegram
              </button>

              {isPremium && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-xs font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premium
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Actions - Redesigned */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Create Intent */}
          <button
            onClick={() => onNavigate('connectCreate')}
            className="group relative overflow-hidden h-32 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none transition-all"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            <div className="relative h-full flex flex-col items-center justify-center gap-3">
              <Plus className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg uppercase tracking-wide">Create Intent</div>
                <div className="text-xs text-white/80">Start connecting at a venue</div>
              </div>
            </div>
          </button>

          {/* My Threads */}
          <button
            onClick={() => onNavigate('connectThreads')}
            className="group relative overflow-hidden h-32 bg-white text-black hover:bg-white/90 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none transition-all"
          >
            <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform" />
            <div className="relative h-full flex flex-col items-center justify-center gap-3">
              <Inbox className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg uppercase tracking-wide">My Threads</div>
                <div className="text-xs text-black/60">View conversations</div>
              </div>
            </div>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white/5 border border-white/10 text-center">
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-white/50 uppercase tracking-wide">Active Nearby</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 text-center">
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-white/50 uppercase tracking-wide">Open Threads</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 text-center">
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-white/50 uppercase tracking-wide">This Week</div>
          </div>
        </div>

        {/* Nearby Intents - Redesigned */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold uppercase tracking-wide">Nearby Intents</h2>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <MapPin className="w-4 h-4" />
              <span>No venue selected</span>
            </div>
          </div>

          <div className="p-12 bg-white/5 border border-white/10 text-center">
            <Heart className="w-12 h-12 mx-auto text-white/10 mb-4" />
            <h3 className="font-bold mb-2">No Active Intents</h3>
            <p className="text-sm text-white/60 max-w-md mx-auto mb-6">
              Create an intent when you're out at a venue to see who else is around and looking to connect.
            </p>
            <HMButton 
              onClick={() => onNavigate('connectCreate')}
              variant="secondary"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Create Your First Intent
            </HMButton>
          </div>
        </div>

        {/* How It Works */}
        <div className="p-6 bg-white/5 border border-white/10 mb-8">
          <h3 className="font-bold uppercase tracking-wide mb-6">How Connect Works</h3>
          <div className="grid md:grid-cols-4 gap-6 text-sm">
            {[
              {
                num: '1',
                title: 'Create Intent',
                desc: 'Post an anonymous intent at a venue with optional tags'
              },
              {
                num: '2',
                title: 'Browse',
                desc: 'See intents from others at the same venue (anonymous)'
              },
              {
                num: '3',
                title: 'Mutual Opt-In',
                desc: 'If both opt-in, a private thread opens with profiles revealed'
              },
              {
                num: '4',
                title: 'Connect',
                desc: 'Chat, meet IRL. Either party can close thread anytime'
              }
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-red-500 text-white flex items-center justify-center font-bold text-lg">
                  {step.num}
                </div>
                <div className="font-bold text-white mb-1">{step.title}</div>
                <div className="text-xs text-white/60">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="p-4 bg-red-500/10 border border-red-500/30 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">Stay Safe</p>
              <p className="text-xs text-white/70">
                Always meet in public places. Tell friends where you're going. Trust your instincts. 
                Report inappropriate behavior immediately—we have zero tolerance for harassment.
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <button
          onClick={() => onNavigate('home')}
          className="text-white/60 hover:text-white transition-colors text-sm"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
