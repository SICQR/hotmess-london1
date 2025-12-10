'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Download, Trash2, Eye, Cookie, MapPin, Lock, FileText, CheckCircle2, AlertCircle, ExternalLink, BarChart3, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

export default function PrivacyHubPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  async function handleExportData() {
    setExportLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to export your data');
        router.push('/login');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/privacy/export/json`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hotmess_data_export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Data exported successfully!', {
        description: 'Your data has been downloaded as a JSON file.',
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Failed to export data', {
        description: error.message,
      });
    } finally {
      setExportLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      toast.error('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to delete your account');
        router.push('/login');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/privacy/deletion/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            confirmation: 'DELETE MY ACCOUNT',
            reason: deleteReason,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      toast.success('Account deleted', {
        description: 'Your account and data have been permanently deleted.',
      });

      // Sign out and redirect
      await supabase.auth.signOut();
      router.push('/');
    } catch (error: any) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const privacyTools = [
    {
      icon: Download,
      title: 'Export Your Data',
      description: 'Download all your personal data in JSON format',
      action: handleExportData,
      loading: exportLoading,
      color: 'text-[#FF0080]',
      bgColor: 'bg-[#FF0080]/10',
      borderColor: 'border-[#FF0080]/20',
      gdprArticle: 'Article 15 & 20',
    },
    {
      icon: Eye,
      title: 'Consent Log',
      description: 'View your complete consent history',
      action: () => router.push('/settings/privacy/consent-log'),
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      gdprArticle: 'Article 7',
    },
    {
      icon: Cookie,
      title: 'Cookie Preferences',
      description: 'Manage cookies and tracking technologies',
      action: () => router.push('/settings/privacy/cookies'),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      gdprArticle: 'ePrivacy Directive',
    },
    {
      icon: MapPin,
      title: 'Location Consent',
      description: 'Control how we use your location data',
      action: () => router.push('/settings?tab=privacy'),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      gdprArticle: 'Article 6',
    },
    {
      icon: Lock,
      title: 'Privacy Settings',
      description: 'Control what others can see on your profile',
      action: () => router.push('/settings?tab=privacy'),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      gdprArticle: 'Article 6',
    },
    {
      icon: Users,
      title: 'Third-Party Services',
      description: 'Manage external integrations and data sharing',
      action: () => router.push('/privacy-hub/third-party'),
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      gdprArticle: 'Article 28',
    },
  ];

  const yourRights = [
    {
      title: 'Right to Access',
      description: 'Request a copy of your personal data',
      article: 'Article 15',
      action: 'Export Data',
    },
    {
      title: 'Right to Rectification',
      description: 'Correct inaccurate personal data',
      article: 'Article 16',
      action: 'Edit Profile',
    },
    {
      title: 'Right to Erasure',
      description: 'Delete your personal data ("right to be forgotten")',
      article: 'Article 17',
      action: 'Delete Account',
    },
    {
      title: 'Right to Portability',
      description: 'Export your data in a machine-readable format',
      article: 'Article 20',
      action: 'Export Data',
    },
    {
      title: 'Right to Object',
      description: 'Object to processing of your personal data',
      article: 'Article 21',
      action: 'Contact DPO',
    },
    {
      title: 'Right to Withdraw Consent',
      description: 'Withdraw consent for data processing at any time',
      article: 'Article 7(3)',
      action: 'Manage Consents',
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
                  key={tool.title}
                  className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all ${tool.borderColor}`}
                >
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-lg ${tool.bgColor} border ${tool.borderColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <h3 className="uppercase tracking-tight mb-2" style={{ fontWeight: 800, fontSize: '1rem' }}>
                      {tool.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-2" style={{ fontWeight: 400 }}>
                      {tool.description}
                    </p>
                    <p className="text-xs text-white/40 mb-4" style={{ fontWeight: 400 }}>
                      {tool.gdprArticle}
                    </p>
                    <Button
                      onClick={tool.action}
                      disabled={tool.loading}
                      variant="ghost"
                      className="w-full text-left justify-start p-0 h-auto text-sm text-white/40 hover:text-white hover:bg-transparent"
                    >
                      {tool.loading ? 'Processing...' : 'Manage →'}
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
                      <p className="text-sm text-white/60 mb-1" style={{ fontWeight: 400 }}>
                        {right.description}
                      </p>
                      <button
                        className="text-xs text-[#FF0080] hover:underline"
                        onClick={() => {
                          if (right.action === 'Export Data') handleExportData();
                          else if (right.action === 'Edit Profile') router.push('/settings');
                          else if (right.action === 'Delete Account') {
                            const deleteBtn = document.getElementById('delete-account-trigger');
                            deleteBtn?.click();
                          } else if (right.action === 'Manage Consents') router.push('/settings/privacy/consent-log');
                          else if (right.action === 'Contact DPO') window.location.href = 'mailto:privacy@hotmessldn.com';
                        }}
                      >
                        {right.action} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6 bg-white/10" />

              <div>
                <p className="text-sm text-white/60" style={{ fontWeight: 400 }}>
                  <strong className="text-white" style={{ fontWeight: 700 }}>Need help exercising your rights?</strong> Contact our Data Protection Officer at{' '}
                  <a href="mailto:privacy@hotmessldn.com" className="text-[#FF0080] hover:underline">
                    privacy@hotmessldn.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delete Account Section */}
        <div className="mb-12">
          <h2 className="uppercase tracking-tight mb-6" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
            DANGER ZONE
          </h2>
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="uppercase tracking-tight mb-2" style={{ fontWeight: 800, fontSize: '1rem' }}>
                    DELETE ACCOUNT
                  </h3>
                  <p className="text-sm text-white/60 mb-4" style={{ fontWeight: 400 }}>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <ul className="text-sm text-white/50 space-y-1 mb-4" style={{ fontWeight: 400 }}>
                    <li>• All your profile data will be deleted</li>
                    <li>• Your beacons will be anonymized</li>
                    <li>• Messages will be redacted</li>
                    <li>• XP and rewards will be lost</li>
                    <li>• Consent logs kept for 7 years (legal requirement)</li>
                  </ul>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        id="delete-account-trigger"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Delete My Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black border-red-500/30">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="uppercase text-white" style={{ fontWeight: 800 }}>
                          ⚠️ CONFIRM ACCOUNT DELETION
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                          This will permanently delete your account and all data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="space-y-4 my-4">
                        <div>
                          <label className="text-sm text-white/80 mb-2 block" style={{ fontWeight: 600 }}>
                            Type "DELETE MY ACCOUNT" to confirm:
                          </label>
                          <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="DELETE MY ACCOUNT"
                            className="bg-white/5 border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80 mb-2 block" style={{ fontWeight: 600 }}>
                            Reason for deletion (optional):
                          </label>
                          <Input
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            placeholder="Help us improve..."
                            className="bg-white/5 border-white/20 text-white"
                          />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/20">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={loading || deleteConfirmation !== 'DELETE MY ACCOUNT'}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          {loading ? 'Deleting...' : 'Delete Forever'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
            {[
              { standard: 'GDPR', fullName: 'General Data Protection Regulation', region: 'European Union', icon: '🇪🇺' },
              { standard: 'CCPA', fullName: 'California Consumer Privacy Act', region: 'California, USA', icon: '🇺🇸' },
              { standard: 'ePrivacy', fullName: 'ePrivacy Directive (Cookie Law)', region: 'European Union', icon: '🍪' },
            ].map((compliance, index) => (
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
                      COMPLIANT
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Documents */}
        <div className="mb-12">
          <h2 className="uppercase tracking-tight mb-6" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
            LEGAL DOCUMENTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Privacy Policy', updated: 'Updated: Dec 2024', href: '/legal' },
              { title: 'Cookie Policy', updated: 'Updated: Dec 2024', href: '/legal' },
              { title: 'Terms of Service', updated: 'Updated: Nov 2024', href: '/legal' },
              { title: 'Data Processing Agreement', updated: 'Updated: Dec 2024', href: '/legal' },
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
        <Card className="bg-[#FF0080]/10 border-[#FF0080]/20 mb-12">
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
                    onClick={() => window.location.href = 'mailto:privacy@hotmessldn.com'}
                    className="bg-[#FF0080] hover:bg-[#FF0080]/80 uppercase tracking-tight"
                    style={{ fontWeight: 800 }}
                  >
                    Email DPO
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={exportLoading}
                    className="border-[#FF0080]/30 text-white hover:bg-[#FF0080]/10"
                  >
                    {exportLoading ? 'Exporting...' : 'Download My Data'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-white/50" style={{ fontWeight: 400 }}>
            Last updated: December 6, 2024 · HOTMESS LONDON · Care-First Nightlife OS
          </p>
        </div>
      </div>
    </div>
  );
}
