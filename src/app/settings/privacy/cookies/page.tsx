'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ArrowLeft, Cookie, Shield, CheckCircle2, XCircle } from 'lucide-react';

interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function CookiePreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser(authUser);

      // Load cookie preferences from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('cookie_preferences')
        .eq('id', authUser.id)
        .single();

      if (profile?.cookie_preferences) {
        setPreferences({
          essential: true, // Always true
          ...profile.cookie_preferences,
        });
      }
    } catch (error: any) {
      console.error('Load preferences error:', error);
      toast.error('Failed to load cookie preferences');
    } finally {
      setLoading(false);
    }
  }

  async function savePreferences() {
    try {
      setSaving(true);

      if (!user) throw new Error('Not authenticated');

      // Use NEW RPC function that atomically updates profile + logs consent
      const { error } = await supabase.rpc('set_cookie_consent', {
        p_user_id: user.id,
        p_action: 'updated', // Use enum value
        p_preferences: preferences,
        p_metadata: {
          source: 'settings_page',
          user_agent: navigator.userAgent,
        },
      });

      if (error) throw error;

      // Apply cookie settings to browser
      applyCookieSettings();

      toast.success('Cookie preferences saved');
    } catch (error: any) {
      console.error('Save preferences error:', error);
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  function applyCookieSettings() {
    // Set cookie consent flags in localStorage for other scripts to read
    localStorage.setItem('hotmess_cookie_consent', JSON.stringify({
      essential: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      functional: preferences.functional,
      timestamp: new Date().toISOString(),
    }));

    // Disable analytics tracking if user opts out
    if (!preferences.analytics) {
      // @ts-ignore
      window['ga-disable-GA_MEASUREMENT_ID'] = true;
    }

    toast.info('Cookie settings applied. Refresh page to take full effect.');
  }

  function acceptAll() {
    setPreferences({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  }

  function rejectAll() {
    setPreferences({
      essential: true, // Cannot disable essential
      analytics: false,
      marketing: false,
      functional: false,
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading cookie preferences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/settings')}
            className="mb-4 text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="uppercase tracking-tight mb-2" style={{ fontWeight: 900, fontSize: '2.25rem' }}>
                COOKIE PREFERENCES
              </h1>
              <p className="text-white/60" style={{ fontWeight: 400, fontSize: '1rem' }}>
                Control how we use cookies and tracking technologies
              </p>
            </div>
          </div>
        </div>

        {/* GDPR Notice */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/80" style={{ fontWeight: 400 }}>
                <strong style={{ fontWeight: 700 }}>Cookie Consent:</strong> Under GDPR and ePrivacy Directive, we need your consent for non-essential cookies. You can change these preferences at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex gap-3">
          <Button
            onClick={acceptAll}
            className="flex-1 bg-green-600 hover:bg-green-700 uppercase tracking-tight"
            style={{ fontWeight: 800 }}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Accept All
          </Button>
          <Button
            onClick={rejectAll}
            variant="outline"
            className="flex-1 border-white/20 uppercase tracking-tight"
            style={{ fontWeight: 800 }}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject All
          </Button>
        </div>

        {/* Essential Cookies */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-[#FF0080]" />
                  Essential Cookies
                </CardTitle>
                <CardDescription className="text-white/60 mt-2">
                  Required for the website to function. Cannot be disabled.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-400 uppercase tracking-tight" style={{ fontWeight: 700 }}>
                  ALWAYS ACTIVE
                </span>
                <Switch checked={true} disabled />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
              <p><strong className="text-white">Purpose:</strong> Authentication, security, session management</p>
              <p><strong className="text-white">Examples:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Supabase authentication tokens</li>
                <li>Session identifiers</li>
                <li>Security tokens (CSRF protection)</li>
                <li>Cookie consent preferences</li>
              </ul>
              <p><strong className="text-white">Retention:</strong> Session or up to 1 year</p>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cookies */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analytics Cookies</CardTitle>
                <CardDescription className="text-white/60 mt-2">
                  Help us understand how visitors interact with our website
                </CardDescription>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
              <p><strong className="text-white">Purpose:</strong> Measure site performance and user behavior</p>
              <p><strong className="text-white">Examples:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Google Analytics (anonymized)</li>
                <li>Page view tracking</li>
                <li>Click event tracking</li>
                <li>Performance monitoring</li>
              </ul>
              <p><strong className="text-white">Retention:</strong> Up to 2 years</p>
              <p className="text-white/50 text-xs mt-3">
                ℹ️ We anonymize IP addresses and don't track personal information
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Cookies */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Marketing Cookies</CardTitle>
                <CardDescription className="text-white/60 mt-2">
                  Used to deliver personalized ads and track campaign effectiveness
                </CardDescription>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
              <p><strong className="text-white">Purpose:</strong> Show relevant ads and measure campaigns</p>
              <p><strong className="text-white">Examples:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Facebook Pixel</li>
                <li>Google Ads tracking</li>
                <li>Retargeting cookies</li>
                <li>Conversion tracking</li>
              </ul>
              <p><strong className="text-white">Retention:</strong> Up to 1 year</p>
              <p className="text-white/50 text-xs mt-3">
                ℹ️ Third-party cookies may be set by ad networks
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Functional Cookies */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Functional Cookies</CardTitle>
                <CardDescription className="text-white/60 mt-2">
                  Enable enhanced functionality and personalization
                </CardDescription>
              </div>
              <Switch
                checked={preferences.functional}
                onCheckedChange={(checked) => setPreferences({ ...preferences, functional: checked })}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-white/70" style={{ fontWeight: 400 }}>
              <p><strong className="text-white">Purpose:</strong> Remember your preferences and choices</p>
              <p><strong className="text-white">Examples:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Language preferences</li>
                <li>Theme settings (dark/light mode)</li>
                <li>Volume and playback settings</li>
                <li>Chat widget preferences</li>
              </ul>
              <p><strong className="text-white">Retention:</strong> Up to 1 year</p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            onClick={savePreferences}
            disabled={saving}
            className="flex-1 bg-[#FF0080] hover:bg-[#FF0080]/80 uppercase tracking-tight"
            style={{ fontWeight: 800 }}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
          <Button
            onClick={() => router.push('/settings/privacy/consent-log')}
            variant="outline"
            className="border-white/20"
          >
            View Consent Log
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/60" style={{ fontWeight: 400 }}>
              <strong className="text-white" style={{ fontWeight: 700 }}>Your Control:</strong> You can change these settings at any time. Your preferences are stored locally and synced to your account. For more information, read our <a href="/legal/privacy" className="text-[#FF0080] hover:underline">Privacy Policy</a> and <a href="/legal/cookies" className="text-[#FF0080] hover:underline">Cookie Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}