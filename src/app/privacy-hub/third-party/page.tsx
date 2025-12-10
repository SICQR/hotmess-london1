'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ExternalLink, Shield, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { projectId } from '@/utils/supabase/info';

interface ThirdPartyIntegration {
  name: string;
  purpose: string;
  data_shared: string[];
  opt_out: boolean;
  privacy_policy: string;
  icon: string;
  connected?: boolean;
}

export default function ThirdPartyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([]);

  useEffect(() => {
    loadIntegrations();
  }, []);

  async function loadIntegrations() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/privacy/third-party/list`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load integrations');
      }

      const data = await response.json();
      setIntegrations(data.integrations || []);
    } catch (error: any) {
      console.error('Load integrations error:', error);
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  }

  async function toggleIntegration(name: string, enabled: boolean) {
    toast.info('Coming soon', {
      description: 'Integration management will be available in a future update.',
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF0080] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Privacy Hub
        </Button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="uppercase tracking-tight" style={{ fontWeight: 900, fontSize: '2.5rem' }}>
                THIRD-PARTY SERVICES
              </h1>
              <p className="text-white/60" style={{ fontWeight: 400, fontSize: '1rem' }}>
                Control which external services can access your data
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-500/5 border-blue-500/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-white/80" style={{ fontWeight: 600 }}>
                  GDPR Transparency
                </p>
                <p className="text-sm text-white/60 mt-1" style={{ fontWeight: 400 }}>
                  Under GDPR Article 28, you have the right to know which third parties process your data. Some integrations are required for core functionality and cannot be disabled.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations List */}
        <div className="space-y-4">
          {integrations.map((integration, index) => (
            <Card
              key={index}
              className={`bg-white/5 border-white/10 ${
                !integration.opt_out ? 'border-l-4 border-l-[#FF0080]' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className="text-4xl flex-shrink-0">
                      {integration.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="uppercase tracking-tight" style={{ fontWeight: 800, fontSize: '1.125rem' }}>
                          {integration.name}
                        </h3>
                        {!integration.opt_out && (
                          <span className="px-2 py-1 bg-[#FF0080]/10 border border-[#FF0080]/30 rounded text-xs text-[#FF0080] uppercase tracking-tight" style={{ fontWeight: 700 }}>
                            Required
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-white/70 mb-3" style={{ fontWeight: 400 }}>
                        {integration.purpose}
                      </p>

                      <div className="mb-3">
                        <p className="text-xs text-white/50 mb-2 uppercase tracking-tight" style={{ fontWeight: 700 }}>
                          Data Shared:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {integration.data_shared.map((data, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/70"
                            >
                              {data}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a
                        href={integration.privacy_policy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#FF0080] hover:underline"
                      >
                        View Privacy Policy
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="flex flex-col items-end gap-2">
                    {integration.opt_out ? (
                      <>
                        <Switch
                          checked={integration.connected !== false}
                          onCheckedChange={(enabled) => toggleIntegration(integration.name, enabled)}
                        />
                        <span className="text-xs text-white/40">
                          {integration.connected !== false ? 'Connected' : 'Disconnected'}
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-white/60">Always Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="bg-white/5 border-white/10 mt-8">
          <CardContent className="pt-6">
            <p className="text-sm text-white/60" style={{ fontWeight: 400 }}>
              <strong className="text-white" style={{ fontWeight: 700 }}>Note:</strong> Some services are essential for HOTMESS LONDON to function and cannot be disabled. These include payment processing (Stripe) and commerce infrastructure (Shopify). Optional integrations can be disabled at any time.
            </p>
          </CardContent>
        </Card>

        {/* Data Processing Agreements */}
        <div className="mt-12">
          <h2 className="uppercase tracking-tight mb-4" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
            DATA PROCESSING AGREEMENTS
          </h2>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <p className="text-sm text-white/60 mb-4" style={{ fontWeight: 400 }}>
                All third-party processors have signed Data Processing Agreements (DPAs) as required by GDPR Article 28. These agreements ensure your data is protected to the same standard as our own systems.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                  onClick={() => window.open('/legal', '_blank')}
                >
                  View Full DPA List
                </Button>
                <Button
                  variant="ghost"
                  className="text-white/60"
                  onClick={() => window.location.href = 'mailto:privacy@hotmessldn.com?subject=DPA%20Request'}
                >
                  Request DPA Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
