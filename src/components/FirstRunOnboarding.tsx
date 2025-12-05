'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, MapPin, Cookie, Bell, CheckCircle2, Sparkles } from 'lucide-react';
import { LocationConsentModal } from '@/components/LocationConsentModal';
import { useLocationConsent } from '@/hooks/useLocationConsent';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export function FirstRunOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({
    analytics: false,
    marketing: false,
    functional: true,
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    beacons: true,
    messages: true,
    drops: true,
  });
  const locationConsent = useLocationConsent();

  useEffect(() => {
    checkFirstRun();
  }, []);

  async function checkFirstRun() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, created_at')
        .eq('id', user.id)
        .single();

      // Show onboarding if:
      // 1. Never completed before
      // 2. Account created in last 24 hours (fresh user)
      const isNewUser = profile && new Date(profile.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
      const needsOnboarding = !profile?.onboarding_completed && isNewUser;

      if (needsOnboarding) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Check first run error:', error);
    }
  }

  async function completeOnboarding() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use NEW RPC for cookie consent (atomically updates profile + logs)
      await supabase.rpc('set_cookie_consent', {
        p_user_id: user.id,
        p_action: 'granted',
        p_preferences: {
          essential: true,
          ...cookiePrefs,
        },
        p_metadata: {
          source: 'onboarding',
          user_agent: navigator.userAgent,
        },
      });

      // Update remaining profile fields separately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          notification_preferences: {
            email_marketing: cookiePrefs.marketing,
            email_updates: true,
            email_tickets: true,
            push_beacons: notificationPrefs.beacons,
            push_messages: notificationPrefs.messages,
            push_drops: notificationPrefs.drops,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Welcome to HOTMESS LONDON! 🔥');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Complete onboarding error:', error);
      toast.error('Failed to save preferences');
    }
  }

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'WELCOME TO HOTMESS',
      description: 'London\'s queer nightlife OS',
      icon: Sparkles,
      content: (
        <div className="space-y-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#FF0080]/20 border-2 border-[#FF0080] flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-[#FF0080]" />
            </div>
          </div>
          <div>
            <h2 className="uppercase tracking-tight mb-3" style={{ fontWeight: 900, fontSize: '2rem' }}>
              HOTMESS LONDON
            </h2>
            <p className="text-white/70 mb-6" style={{ fontWeight: 400, fontSize: '1rem' }}>
              Your complete masculine nightlife operating system for queer men 18+
            </p>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="text-sm" style={{ fontWeight: 700 }}>🎯 HOOKUP BEACONS</div>
              <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>Create time-limited signals on a 3D globe</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="text-sm" style={{ fontWeight: 700 }}>💬 REAL-TIME MESSAGING</div>
              <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>Connect with the community instantly</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="text-sm" style={{ fontWeight: 700 }}>🎫 C2C TICKET RESALE</div>
              <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>Buy and sell event tickets securely</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="text-sm" style={{ fontWeight: 700 }}>📻 HOTMESS RADIO</div>
              <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>Curated music from queer DJs</div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/80 text-left" style={{ fontWeight: 400 }}>
                <strong style={{ fontWeight: 700 }}>Care-First Platform:</strong> We prioritize your safety, privacy, and consent above all else.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'location',
      title: 'LOCATION CONSENT',
      description: 'Required for beacons and discovery',
      icon: MapPin,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="uppercase tracking-tight mb-3" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
              LOCATION PERMISSIONS
            </h3>
            <p className="text-white/70 mb-6" style={{ fontWeight: 400 }}>
              Choose how HOTMESS can use your location. You can change this anytime in Settings.
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              {locationConsent.mode === 'off' && (
                <>
                  <MapPin className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-400" style={{ fontWeight: 700 }}>Location Off</div>
                    <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>No location tracking</div>
                  </div>
                </>
              )}
              {locationConsent.mode === 'approximate' && (
                <>
                  <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-blue-400" style={{ fontWeight: 700 }}>Approximate Location</div>
                    <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>City-level only</div>
                  </div>
                </>
              )}
              {locationConsent.mode === 'precise' && (
                <>
                  <MapPin className="w-6 h-6 text-[#FF0080] flex-shrink-0" />
                  <div>
                    <div className="text-sm text-[#FF0080]" style={{ fontWeight: 700 }}>Precise Location</div>
                    <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>GPS coordinates enabled</div>
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={() => setShowLocationModal(true)}
              variant="outline"
              className="w-full border-white/20"
            >
              {locationConsent.mode === 'off' ? 'Enable Location' : 'Change Location Mode'}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="text-sm uppercase tracking-tight text-white/80" style={{ fontWeight: 700 }}>
              FEATURES REQUIRING LOCATION:
            </div>
            <ul className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
              <li className="flex items-start gap-2">
                <span className="text-[#FF0080]">•</span>
                <span>Hookup beacons on 3D globe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF0080]">•</span>
                <span>Discovery grid (nearby users)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF0080]">•</span>
                <span>Heat maps (venue activity)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF0080]">•</span>
                <span>Location-based notifications</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-white/70" style={{ fontWeight: 400 }}>
            <Shield className="w-4 h-4 inline mr-2 text-blue-400" />
            We never sell your location data. Read our <a href="/legal/privacy" className="text-[#FF0080] hover:underline">Privacy Policy</a>.
          </div>
        </div>
      ),
    },
    {
      id: 'cookies',
      title: 'COOKIE PREFERENCES',
      description: 'Choose what cookies we can use',
      icon: Cookie,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="uppercase tracking-tight mb-3" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
              COOKIE CONSENT
            </h3>
            <p className="text-white/70 mb-6" style={{ fontWeight: 400 }}>
              We use cookies to improve your experience. Essential cookies are always enabled.
            </p>
          </div>

          <div className="space-y-3">
            {/* Essential - Always On */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg opacity-60">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm" style={{ fontWeight: 700 }}>Essential Cookies</div>
                <div className="text-xs text-green-400 uppercase" style={{ fontWeight: 700 }}>ALWAYS ON</div>
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                Required for login, security, and core functionality
              </div>
            </div>

            {/* Analytics */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm" style={{ fontWeight: 700 }}>Analytics Cookies</div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cookiePrefs.analytics}
                    onChange={(e) => setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0080]"></div>
                </label>
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                Help us improve by tracking page views and performance
              </div>
            </div>

            {/* Marketing */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm" style={{ fontWeight: 700 }}>Marketing Cookies</div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cookiePrefs.marketing}
                    onChange={(e) => setCookiePrefs({ ...cookiePrefs, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0080]"></div>
                </label>
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                Show personalized ads and measure campaign effectiveness
              </div>
            </div>

            {/* Functional */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm" style={{ fontWeight: 700 }}>Functional Cookies</div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cookiePrefs.functional}
                    onChange={(e) => setCookiePrefs({ ...cookiePrefs, functional: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0080]"></div>
                </label>
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                Remember your preferences and settings
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      title: 'NOTIFICATIONS',
      description: 'Choose what alerts you receive',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="uppercase tracking-tight mb-3" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
              NOTIFICATION PREFERENCES
            </h3>
            <p className="text-white/70 mb-6" style={{ fontWeight: 400 }}>
              Stay updated with push notifications. You can change these later in Settings.
            </p>
          </div>

          <div className="space-y-3">
            {/* Beacons */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm" style={{ fontWeight: 700 }}>Beacon Alerts</div>
                  <div className="text-xs text-white/50" style={{ fontWeight: 400 }}>New beacons near you</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.beacons}
                    onChange={(e) => setNotificationPrefs({ ...notificationPrefs, beacons: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0080]"></div>
                </label>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm" style={{ fontWeight: 700 }}>Message Notifications</div>
                  <div className="text-xs text-white/50" style={{ fontWeight: 400 }}>New messages in threads</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.messages}
                    onChange={(e) => setNotificationPrefs({ ...notificationPrefs, messages: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0080]"></div>
                </label>
              </div>
            </div>

            {/* Drops */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm" style={{ fontWeight: 700 }}>Drop Alerts</div>
                  <div className="text-xs text-white/50" style={{ fontWeight: 400 }}>New drops and releases</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.drops}
                    onChange={(e) => setNotificationPrefs({ ...notificationPrefs, drops: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0080]"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60" style={{ fontWeight: 400 }}>
            💡 You can enable/disable individual notification types in Settings at any time.
          </div>
        </div>
      ),
    },
    {
      id: 'complete',
      title: 'ALL SET!',
      description: 'You\'re ready to explore',
      icon: CheckCircle2,
      content: (
        <div className="space-y-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div>
            <h2 className="uppercase tracking-tight mb-3" style={{ fontWeight: 900, fontSize: '2rem' }}>
              YOU'RE ALL SET!
            </h2>
            <p className="text-white/70 mb-6" style={{ fontWeight: 400, fontSize: '1rem' }}>
              Your preferences have been saved. You can change them anytime in Settings.
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-left">
            <div className="text-sm uppercase tracking-tight text-white/80 mb-3" style={{ fontWeight: 700 }}>
              YOUR SETTINGS:
            </div>
            <div className="space-y-2 text-sm text-white/60" style={{ fontWeight: 400 }}>
              <div className="flex items-center justify-between">
                <span>Location Mode:</span>
                <span className="text-[#FF0080]" style={{ fontWeight: 700 }}>{locationConsent.mode.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Analytics Cookies:</span>
                <span className={cookiePrefs.analytics ? 'text-green-400' : 'text-gray-400'} style={{ fontWeight: 700 }}>
                  {cookiePrefs.analytics ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Marketing Cookies:</span>
                <span className={cookiePrefs.marketing ? 'text-green-400' : 'text-gray-400'} style={{ fontWeight: 700 }}>
                  {cookiePrefs.marketing ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Beacon Notifications:</span>
                <span className={notificationPrefs.beacons ? 'text-green-400' : 'text-gray-400'} style={{ fontWeight: 700 }}>
                  {notificationPrefs.beacons ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FF0080]/10 border border-[#FF0080]/20 rounded-lg">
            <div className="text-sm text-white/80" style={{ fontWeight: 400 }}>
              🔥 <strong style={{ fontWeight: 700 }}>Welcome to the community!</strong> Start exploring beacons, discover events, and connect with queer London.
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black border-2 border-[#FF0080] max-w-2xl text-white max-h-[90vh] overflow-y-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40 uppercase tracking-tight" style={{ fontWeight: 700 }}>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-xs text-white/40" style={{ fontWeight: 400 }}>
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-white/10" />
          </div>

          {/* Step Icon & Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FF0080]/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#FF0080]" />
              </div>
              <div>
                <h3 className="uppercase tracking-tight" style={{ fontWeight: 900, fontSize: '1.25rem' }}>
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-6">
            {currentStepData.content}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="border-white/20"
              >
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 bg-[#FF0080] hover:bg-[#FF0080]/80 uppercase tracking-tight"
                style={{ fontWeight: 800 }}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                className="flex-1 bg-green-600 hover:bg-green-700 uppercase tracking-tight"
                style={{ fontWeight: 800 }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Start Exploring
              </Button>
            )}
          </div>

          {/* Skip Link */}
          <div className="text-center mt-4">
            <button
              onClick={completeOnboarding}
              className="text-sm text-white/40 hover:text-white transition-colors"
              style={{ fontWeight: 400 }}
            >
              Skip for now
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Consent Modal */}
      <LocationConsentModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onConsent={(mode) => {
          locationConsent.updateMode(mode);
          setShowLocationModal(false);
        }}
        currentMode={locationConsent.mode}
        feature="HOTMESS features"
      />
    </>
  );
}