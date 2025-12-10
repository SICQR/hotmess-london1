/**
 * CONNECT - Main discovery page
 * Premium feature for consensual connections at nightlife venues
 * 18+ only, consent-first, privacy-respecting
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Users, MessageCircle, Settings, Sparkles, Lock, Shield, Heart } from 'lucide-react';
import { BrutalistCard } from '@/components/BrutalistCard';
import { BrutalistHeader } from '@/components/BrutalistHeader';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

interface ConnectIntent {
  public_id: string;
  tags: string[];
  beacon_name: string;
  venue: string;
  city: string;
  created_at: string;
  expires_at: string;
}

export default function ConnectPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [intents, setIntents] = useState<ConnectIntent[]>([]);
  const [activeBeacon, setActiveBeacon] = useState<any>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login?redirect=/connect');
      return;
    }

    setUser(session.user);

    // Check age verification and consent
    const profile = session.user.user_metadata;
    const age18Plus = profile?.age_verified || false;
    const consentGiven = profile?.connect_consent || false;
    
    setHasConsent(age18Plus && consentGiven);

    // Check membership tier
    const tier = profile?.membership_tier || 'free';
    setIsPremium(tier !== 'free');

    setLoading(false);

    // If verified, load nearby intents
    if (age18Plus && consentGiven && tier !== 'free') {
      loadNearbyIntents();
    }
  }

  async function loadNearbyIntents() {
    // This would fetch nearby beacons with active intents
    // For now, show placeholder
    setIntents([]);
  }

  async function giveConsent() {
    const supabase = createClient();
    
    // Update user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        connect_consent: true,
        age_verified: true,
        consent_timestamp: new Date().toISOString()
      }
    });

    if (error) {
      toast.error('Failed to save consent');
      return;
    }

    setHasConsent(true);
    toast.success('Consent saved. You can now use Connect.');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Age verification + consent screen
  if (!hasConsent) {
    return (
      <div className="min-h-screen bg-black text-white">
        <BrutalistHeader
          icon={Shield}
          label="CONNECT"
          title="AGE & CONSENT VERIFICATION"
          subtitle="Required for Connect features"
        />

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <BrutalistCard variant="section">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-red-500/10 border-2 border-red-500">
                <Shield className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-bold">18+ ONLY</h3>
                  <p className="text-sm text-white/70">
                    You must be at least 18 years old to use Connect features.
                    This is a legal requirement and strictly enforced.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">CONSENT-FIRST PRINCIPLES</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white/50 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-white/70">
                      <strong className="text-white">Opt-in only:</strong> Both parties must explicitly opt-in for a connection to happen
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white/50 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-white/70">
                      <strong className="text-white">No stalking:</strong> You cannot see who created an intent until mutual opt-in
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white/50 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-white/70">
                      <strong className="text-white">Close anytime:</strong> Either party can close a thread at any time, no questions asked
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white/50 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-white/70">
                      <strong className="text-white">Zero tolerance:</strong> Harassment, unsolicited content, or abusive behavior results in permanent ban
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white/50 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-white/70">
                      <strong className="text-white">Privacy-first:</strong> Your data is never sold. Threads auto-delete after 7 days of inactivity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t-2 border-white/10">
                <h3 className="font-bold text-lg">YOUR RESPONSIBILITIES</h3>
                
                <div className="space-y-2 text-sm text-white/70">
                  <p>✓ I am at least 18 years old</p>
                  <p>✓ I will respect consent and boundaries</p>
                  <p>✓ I will not harass, stalk, or abuse other users</p>
                  <p>✓ I will report inappropriate behavior</p>
                  <p>✓ I understand that violations result in permanent ban</p>
                </div>
              </div>

              <Button
                onClick={giveConsent}
                className="w-full bg-white text-black hover:bg-white/90 h-14 text-lg font-bold"
              >
                I AGREE - I AM 18+ AND WILL RESPECT CONSENT
              </Button>

              <p className="text-xs text-white/50 text-center">
                By clicking above, you confirm you are 18+ and agree to our consent-first principles.
                We take violations seriously and will cooperate with law enforcement if needed.
              </p>
            </div>
          </BrutalistCard>
        </div>
      </div>
    );
  }

  // Premium required screen
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-black text-white">
        <BrutalistHeader
          icon={Sparkles}
          label="CONNECT"
          title="PREMIUM REQUIRED"
          subtitle="Upgrade to access Connect features"
        />

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <BrutalistCard variant="section">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white/5 border-2 border-white/20">
                <Lock className="w-6 h-6 text-white/70 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-bold">PREMIUM FEATURE</h3>
                  <p className="text-sm text-white/70">
                    Connect is available exclusively to Premium, Pro, and Elite members.
                    This helps maintain quality and safety in the community.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold">WHY PREMIUM?</h3>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• Better moderation and safety</p>
                  <p>• Verified profiles only</p>
                  <p>• Quality community standards</p>
                  <p>• Support platform development</p>
                </div>
              </div>

              <Button
                onClick={() => router.push('/membership')}
                className="w-full bg-white text-black hover:bg-white/90 h-12 font-bold"
              >
                VIEW MEMBERSHIP PLANS
              </Button>
            </div>
          </BrutalistCard>
        </div>
      </div>
    );
  }

  // Main Connect discovery view
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <BrutalistHeader
        icon={Flame}
        label="CONNECT"
        title="DISCOVER & CONNECT"
        subtitle="Consent-first connections at nightlife venues"
      />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push('/connect/create')}
            className="h-20 bg-red-500 hover:bg-red-600 text-white border-2 border-black flex flex-col items-center justify-center gap-2"
          >
            <Flame className="w-6 h-6" />
            <span className="font-bold">CREATE INTENT</span>
          </Button>

          <Button
            onClick={() => router.push('/connect/threads')}
            className="h-20 bg-white text-black hover:bg-white/90 border-2 border-black flex flex-col items-center justify-center gap-2"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="font-bold">MY THREADS</span>
          </Button>
        </div>

        {/* Active intents */}
        <BrutalistCard variant="section">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl">NEARBY INTENTS</h2>
              <Badge variant="outline" className="border-white/20">
                <Users className="w-3 h-3 mr-1" />
                {intents.length}
              </Badge>
            </div>

            {intents.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Heart className="w-12 h-12 mx-auto text-white/20" />
                <div className="space-y-2">
                  <p className="text-white/70">No active intents nearby right now</p>
                  <p className="text-sm text-white/50">
                    Create an intent when you're out at a venue, or check back later
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {intents.map((intent) => (
                  <div
                    key={intent.public_id}
                    className="p-4 bg-white/5 border-2 border-white/10 hover:border-white/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-red-500" />
                          <span className="font-bold">{intent.beacon_name}</span>
                        </div>
                        <p className="text-sm text-white/70">
                          {intent.venue} • {intent.city}
                        </p>
                        <div className="flex gap-2">
                          {intent.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-white/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" className="bg-white text-black hover:bg-white/90">
                        OPT-IN
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </BrutalistCard>

        {/* How it works */}
        <BrutalistCard variant="section">
          <div className="space-y-4">
            <h3 className="font-bold">HOW IT WORKS</h3>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20 flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-bold text-white mb-1">CREATE INTENT</p>
                  <p>When you're at a venue, create an anonymous intent with optional tags (vibes, interests, etc)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20 flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-bold text-white mb-1">BROWSE INTENTS</p>
                  <p>See intents from others at the same venue. They're anonymous until mutual opt-in.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20 flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-bold text-white mb-1">MUTUAL OPT-IN</p>
                  <p>If you both opt-in to each other's intents, a private thread is created and identities revealed.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20 flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <p className="font-bold text-white mb-1">CHAT & MEET</p>
                  <p>Message in the thread, arrange to meet IRL. Either party can close thread anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </BrutalistCard>

        {/* Safety info */}
        <div className="p-4 bg-white/5 border-2 border-white/10">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">STAY SAFE</p>
              <p className="text-xs text-white/70">
                Meet in public. Tell friends. Trust your instincts. Report inappropriate behavior immediately.
                We have zero tolerance for harassment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
