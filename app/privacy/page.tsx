'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Cookie, FileText, Download, Trash2, Eye, Lock, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function PrivacyHubPage() {
  const router = useRouter();

  const privacyTools = [
    {
      icon: MapPin,
      title: 'Location Consent',
      description: 'Control how we use your location data',
      href: '/settings?tab=privacy',
      color: 'text-[#FF0080]',
      bgColor: 'bg-[#FF0080]/10',
      borderColor: 'border-[#FF0080]/20',
    },
    {
      icon: Cookie,
      title: 'Cookie Preferences',
      description: 'Manage cookies and tracking technologies',
      href: '/settings/privacy/cookies',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: Eye,
      title: 'Consent Log',
      description: 'View your complete consent history',
      href: '/settings/privacy/consent-log',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: Download,
      title: 'Export Your Data',
      description: 'Download all your data in JSON format',
      href: '/settings?tab=data',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: Trash2,
      title: 'Delete Account',
      description: 'Permanently delete your account and data',
      href: '/settings?tab=data',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    {
      icon: Lock,
      title: 'Privacy Settings',
      description: 'Control what others can see on your profile',
      href: '/settings?tab=privacy',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
  ];

  const yourRights = [
    {
      title: 'Right to Access',
      description: 'Request a copy of your personal data',
      article: 'Article 15',
    },
    {
      title: 'Right to Rectification',
      description: 'Correct inaccurate personal data',
      article: 'Article 16',
    },
    {
      title: 'Right to Erasure',
      description: 'Delete your personal data ("right to be forgotten")',
      article: 'Article 17',
    },
    {
      title: 'Right to Portability',
      description: 'Export your data in a machine-readable format',
      article: 'Article 20',
    },
    {
      title: 'Right to Object',
      description: 'Object to processing of your personal data',
      article: 'Article 21',
    },
    {
      title: 'Right to Withdraw Consent',
      description: 'Withdraw consent for data processing at any time',
      article: 'Article 7(3)',
    },
  ];

  const complianceInfo = [
    {
      standard: 'GDPR',
      fullName: 'General Data Protection Regulation',
      region: 'European Union',
      icon: '🇪🇺',
      status: 'Compliant',
    },
    {
      standard: 'CCPA',
      fullName: 'California Consumer Privacy Act',
      region: 'California, USA',
      icon: '🇺🇸',
      status: 'Compliant',
    },
    {
      standard: 'ePrivacy',
      fullName: 'ePrivacy Directive (Cookie Law)',
      region: 'European Union',
      icon: '🍪',
      status: 'Compliant',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#FF0080]/10 border-2 border-[#FF0080] flex items-center justify-center">
              <Shield className="w-10 h-10 text-[#FF0080]" />
            </div>
          </div>
          <h1 className="uppercase tracking-tight mb-4" style={{ fontWeight: 900, fontSize: '3rem' }}>
            PRIVACY HUB
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto" style={{ fontWeight: 400, fontSize: '1.125rem' }}>
            Your privacy matters. Control your data, manage your consents, and exercise your rights under GDPR.
          </p>
        </div>

        {/* Privacy Tools Grid */}
        <div className="mb-12">
          <h2 className="uppercase tracking-tight mb-6" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
            PRIVACY TOOLS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {privacyTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.href}
                  className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer ${tool.borderColor}`}
                  onClick={() => router.push(tool.href)}
                >
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-lg ${tool.bgColor} border ${tool.borderColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <h3 className="uppercase tracking-tight mb-2" style={{ fontWeight: 800, fontSize: '1rem' }}>
                      {tool.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-4" style={{ fontWeight: 400 }}>
                      {tool.description}
                    </p>
                    <Button variant="ghost" className="w-full text-left justify-start p-0 h-auto text-sm text-white/40 hover:text-white hover:bg-transparent">
                      Manage →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Your Privacy Rights */}
        <div className="mb-12">
          <h2 className="uppercase tracking-tight mb-6" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
            YOUR PRIVACY RIGHTS
          </h2>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {yourRights.map((right, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FF0080]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF0080]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="uppercase tracking-tight" style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                          {right.title}
                        </span>
                        <span className="text-xs text-white/40">
                          {right.article}
                        </span>
                      </div>
                      <p className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                        {right.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                  <strong className="text-white" style={{ fontWeight: 700 }}>Need help exercising your rights?</strong> Contact our Data Protection Officer at{' '}
                  <a href="mailto:privacy@hotmesslondon.com" className="text-[#FF0080] hover:underline">
                    privacy@hotmesslondon.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Standards */}
        <div className="mb-12">
          <h2 className="uppercase tracking-tight mb-6" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
            COMPLIANCE & STANDARDS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {complianceInfo.map((compliance, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{compliance.icon}</span>
                    <div>
                      <div className="uppercase tracking-tight" style={{ fontWeight: 800, fontSize: '1rem' }}>
                        {compliance.standard}
                      </div>
                      <div className="text-xs text-white/40">{compliance.region}</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-3" style={{ fontWeight: 400 }}>
                    {compliance.fullName}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-400 uppercase tracking-tight" style={{ fontWeight: 700 }}>
                      {compliance.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How We Protect Your Data */}
        <div className="mb-12">
          <h2 className="uppercase tracking-tight mb-6" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
            HOW WE PROTECT YOUR DATA
          </h2>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="uppercase tracking-tight mb-3" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    🔒 ENCRYPTION
                  </h3>
                  <p className="text-sm text-white/60 mb-4" style={{ fontWeight: 400 }}>
                    All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Passwords are hashed using bcrypt with salt rounds.
                  </p>
                </div>

                <div>
                  <h3 className="uppercase tracking-tight mb-3" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    🛡️ SECURITY
                  </h3>
                  <p className="text-sm text-white/60 mb-4" style={{ fontWeight: 400 }}>
                    Row-level security (RLS) ensures users only access their own data. Regular security audits and penetration testing.
                  </p>
                </div>

                <div>
                  <h3 className="uppercase tracking-tight mb-3" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    📊 MINIMAL DATA
                  </h3>
                  <p className="text-sm text-white/60 mb-4" style={{ fontWeight: 400 }}>
                    We only collect data necessary for our services. No selling to third parties. Anonymous analytics where possible.
                  </p>
                </div>

                <div>
                  <h3 className="uppercase tracking-tight mb-3" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    🕐 RETENTION
                  </h3>
                  <p className="text-sm text-white/60 mb-4" style={{ fontWeight: 400 }}>
                    Data is retained only as long as necessary. Consent logs kept for 7 years (GDPR requirement). Inactive accounts purged after 2 years.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Documents */}
        <div className="mb-12">
          <h2 className="uppercase tracking-tight mb-6" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
            LEGAL DOCUMENTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Privacy Policy', updated: 'Updated: Dec 2024', href: '/legal/privacy' },
              { title: 'Cookie Policy', updated: 'Updated: Dec 2024', href: '/legal/cookies' },
              { title: 'Terms of Service', updated: 'Updated: Nov 2024', href: '/legal/terms' },
              { title: 'Data Processing Agreement', updated: 'Updated: Dec 2024', href: '/legal/dpa' },
            ].map((doc, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => router.push(doc.href)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5 text-[#FF0080]" />
                        <span className="uppercase tracking-tight" style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                          {doc.title}
                        </span>
                      </div>
                      <p className="text-xs text-white/40" style={{ fontWeight: 400 }}>
                        {doc.updated}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/40" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact DPO */}
        <Card className="bg-[#FF0080]/10 border-[#FF0080]/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FF0080]/20 border border-[#FF0080]/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-[#FF0080]" />
              </div>
              <div className="flex-1">
                <h3 className="uppercase tracking-tight mb-2" style={{ fontWeight: 800, fontSize: '1rem' }}>
                  QUESTIONS ABOUT YOUR PRIVACY?
                </h3>
                <p className="text-sm text-white/80 mb-4" style={{ fontWeight: 400 }}>
                  Our Data Protection Officer is here to help. Contact us for:
                </p>
                <ul className="text-sm text-white/70 space-y-1 mb-4" style={{ fontWeight: 400 }}>
                  <li>• Data Subject Access Requests (DSAR)</li>
                  <li>• Privacy concerns or complaints</li>
                  <li>• Questions about how we use your data</li>
                  <li>• Requests to exercise your GDPR rights</li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => window.location.href = 'mailto:privacy@hotmesslondon.com'}
                    className="bg-[#FF0080] hover:bg-[#FF0080]/80 uppercase tracking-tight"
                    style={{ fontWeight: 800 }}
                  >
                    Email DPO
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/settings?tab=data')}
                    className="border-[#FF0080]/30 text-white hover:bg-[#FF0080]/10"
                  >
                    Download My Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/50" style={{ fontWeight: 400 }}>
            Last updated: December 4, 2024 · HOTMESS LONDON · Care-First Nightlife OS
          </p>
        </div>
      </div>
    </div>
  );
}
