// Data Privacy & Account Management Pages
import { PageTemplate } from '../components/PageTemplate';
import { EmptyState } from '../components/EmptyState';
import { RouteId } from '../lib/routes';
import { Shield, Download, Trash, FileCheck, Flag, Users, Package, Settings, Bookmark, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { mockUser, mockOrders, formatPrice, formatDate } from '../lib/mockData';
import { useEffect, useState } from 'react';
import { SUPABASE_URL } from '../lib/env';
import { getAccessTokenAsync, getCurrentUser } from '../lib/auth';

type NavFunction = (route: RouteId, params?: Record<string, string>) => void;

// DATA PRIVACY HUB
export function DataPrivacyHub({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate 
      title="Data & Privacy Hub" 
      subtitle="Manage your data rights under GDPR" 
      icon={Shield}
      backRoute="legal"
      backLabel="Legal Hub"
      onNavigate={onNavigate}
    >
      <div className="max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6">
          <motion.button
            onClick={() => onNavigate('dataPrivacyDsar')}
            className="bg-white/5 border border-white/20 hover:border-hot p-8 text-left transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FileCheck size={32} className="text-hot mb-4" />
            <h3 className="text-white uppercase tracking-wider mb-3" style={{ fontWeight: 900 }}>
              Data Subject Access Request
            </h3>
            <p className="text-white/60 text-sm">Request a full copy of your personal data we hold.</p>
          </motion.button>

          <motion.button
            onClick={() => onNavigate('dataPrivacyExport')}
            className="bg-white/5 border border-white/20 hover:border-hot p-8 text-left transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Download size={32} className="text-hot mb-4" />
            <h3 className="text-white uppercase tracking-wider mb-3" style={{ fontWeight: 900 }}>
              Export My Data
            </h3>
            <p className="text-white/60 text-sm">Download all your data in machine-readable format (JSON).</p>
          </motion.button>

          <motion.button
            onClick={() => onNavigate('dataPrivacyDelete')}
            className="bg-hot/10 border border-hot/30 hover:bg-hot/20 p-8 text-left transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Trash size={32} className="text-hot mb-4" />
            <h3 className="text-hot uppercase tracking-wider mb-3" style={{ fontWeight: 900 }}>
              Delete My Data
            </h3>
            <p className="text-white/60 text-sm">Permanently delete your account and all associated data.</p>
          </motion.button>
        </div>

        {/* Info section */}
        <div className="mt-12 bg-white/5 border border-white/10 p-8">
          <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>Your Rights</h3>
          <ul className="text-white/80 space-y-2">
            <li>• <strong>Right to Access:</strong> You can request a copy of your personal data.</li>
            <li>• <strong>Right to Portability:</strong> You can export your data in JSON format.</li>
            <li>• <strong>Right to Erasure:</strong> You can delete your account and data.</li>
            <li>• <strong>Right to Rectification:</strong> You can correct inaccurate data in Account → Profile.</li>
            <li>• <strong>Right to Withdraw Consent:</strong> Manage in Account → Consents.</li>
          </ul>
          <p className="text-white/60 text-sm mt-4">
            We respond to all requests within 30 days as required by GDPR.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}

// DSAR
export function DSAR({ onNavigate }: { onNavigate: NavFunction }) {
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await getCurrentUser();
      if (!cancelled) setUserEmail(user?.email || '');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);
    try {
      const token = await getAccessTokenAsync();
      if (!token) {
        setError('Please sign in to submit a DSAR request.');
        return;
      }

      const res = await fetch(`${SUPABASE_URL}/functions/v1/make-server-a670c824/privacy/dsar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'export', details }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Failed to submit request');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate 
      title="Data Subject Access Request" 
      subtitle="Request a copy of your personal data" 
      icon={FileCheck}
      backRoute="dataPrivacy"
      backLabel="Data & Privacy Hub"
      onNavigate={onNavigate}
    >
      <div className="max-w-2xl">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/20 p-8 space-y-6">
            {error ? (
              <div className="bg-hot/10 border border-hot/30 p-4">
                <p className="text-white/80 text-sm">{error}</p>
              </div>
            ) : null}
            <div>
              <label className="text-white uppercase tracking-wider text-sm block mb-2" style={{ fontWeight: 700 }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={userEmail}
                readOnly
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
              />
            </div>

            <div>
              <label className="text-white uppercase tracking-wider text-sm block mb-2" style={{ fontWeight: 700 }}>
                Additional Details (Optional)
              </label>
              <textarea
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none h-32"
                placeholder="Specify what data you're requesting..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className="bg-hot/10 border border-hot/30 p-4">
              <p className="text-white/80 text-sm">
                We'll process this request within 30 days (UK GDPR). In this demo environment, you can also use “Export My Data” for an immediate JSON download.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hot hover:bg-white text-white hover:text-black h-14 uppercase tracking-wider transition-all"
              style={{ fontWeight: 900 }}
            >
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        ) : (
          <div className="bg-white/5 border border-white/20 p-12 text-center">
            <FileCheck size={64} className="text-hot mx-auto mb-6" />
            <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>
              Request Submitted
            </h3>
            <p className="text-white/60 mb-6">
              Your DSAR request has been recorded. You can download an immediate export via “Export My Data”.
            </p>
            <button
              onClick={() => onNavigate('dataPrivacyExport')}
              className="bg-white/10 border border-white/20 hover:border-hot px-6 py-3 text-white uppercase tracking-wider transition-all"
              style={{ fontWeight: 700 }}
            >
              Go to Export
            </button>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

// DATA EXPORT
export function DataExport({ onNavigate }: { onNavigate: NavFunction }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setError(null);
    setLoading(true);

    try {
      const token = await getAccessTokenAsync();
      if (!token) {
        setError('Please sign in to export your data.');
        return;
      }

      const res = await fetch(`${SUPABASE_URL}/functions/v1/make-server-a670c824/privacy/export`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to export data');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hotmess-data-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate 
      title="Export My Data" 
      subtitle="Download all your data in JSON format" 
      icon={Download}
      backRoute="dataPrivacy"
      backLabel="Data & Privacy Hub"
      onNavigate={onNavigate}
    >
      <div className="max-w-2xl">
        <div className="bg-white/5 border border-white/20 p-8">
          <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>What's included</h3>
          <ul className="text-white/80 space-y-2 mb-6">
            <li>• Profile information</li>
            <li>• Order history</li>
            <li>• Community posts</li>
            <li>• Consent records</li>
            <li>• Account metadata</li>
          </ul>

          {error ? (
            <div className="bg-hot/10 border border-hot/30 p-4 mb-6">
              <p className="text-white/80 text-sm">{error}</p>
            </div>
          ) : null}

          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full bg-hot hover:bg-white text-white hover:text-black h-14 uppercase tracking-wider flex items-center justify-center gap-3 transition-all"
            style={{ fontWeight: 900 }}
          >
            <Download size={24} />
            <span>{loading ? 'Preparing Export…' : 'Download JSON Export'}</span>
          </button>

          <p className="text-white/40 text-sm mt-4 text-center">
            This export is in machine-readable JSON format for portability.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}

// DATA DELETE
export function DataDelete({ onNavigate }: { onNavigate: NavFunction }) {
  const [confirmed, setConfirmed] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = await getAccessTokenAsync();
      if (!token) {
        setError('Please sign in to request deletion.');
        return;
      }

      const res = await fetch(`${SUPABASE_URL}/functions/v1/make-server-a670c824/privacy/dsar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'delete' }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Failed to submit deletion request');
      }

      setDeleted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit deletion request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate 
      title="Delete My Data" 
      subtitle="Request deletion of your account and personal data" 
      icon={Trash}
      backRoute="dataPrivacy"
      backLabel="Data & Privacy Hub"
      onNavigate={onNavigate}
    >
      <div className="max-w-2xl">
        {!deleted ? (
          <div className="bg-hot/10 border border-hot/30 p-8 space-y-6">
            {error ? (
              <div className="bg-black/30 p-4 border border-hot/30">
                <p className="text-white/80 text-sm">{error}</p>
              </div>
            ) : null}
            <div>
              <h3 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>⚠️ Warning</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                This will permanently delete:
              </p>
              <ul className="text-white/80 space-y-2">
                <li>• Your account and profile</li>
                <li>• All community posts</li>
                <li>• Order history (except records required for tax/fraud)</li>
                <li>• Consent records</li>
                <li>• All personal data</li>
              </ul>
              <p className="text-white/80 mt-4">
                <strong>This cannot be undone.</strong>
              </p>
            </div>

            <div className="flex items-start gap-3 bg-black/30 p-4">
              <input
                type="checkbox"
                id="confirm-delete"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="confirm-delete" className="text-white/80 text-sm">
                I understand this is permanent and cannot be reversed. I want to delete my account and all associated data.
              </label>
            </div>

            <button
              onClick={handleDelete}
              disabled={!confirmed}
              className="w-full bg-hot hover:bg-white text-white hover:text-black h-14 uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontWeight: 900 }}
            >
              Delete My Account
            </button>

            <button
              onClick={() => onNavigate('account')}
              className="w-full border border-white/20 hover:border-white text-white h-12 uppercase tracking-wider transition-all"
              style={{ fontWeight: 700 }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/20 p-12 text-center">
            <Trash size={64} className="text-hot mx-auto mb-6" />
            <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>
              Request Submitted
            </h3>
            <p className="text-white/60 mb-6">
              Your deletion request has been recorded. We will process it within 30 days (UK GDPR).
            </p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

// UGC MODERATION
export function UGCModeration({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate 
      title="UGC Moderation Policy" 
      subtitle="How we moderate user-generated content" 
      icon={Users}
      backRoute="legal"
      backLabel="Legal Hub"
      onNavigate={onNavigate}
    >
      <div className="max-w-4xl space-y-8 text-white/80 leading-relaxed">
        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Prohibited Content</h2>
          <ul className="space-y-2">
            <li>• Non-consensual content (sharing without permission)</li>
            <li>• Content involving minors</li>
            <li>• Doxxing, harassment, threats</li>
            <li>• Spam, scams, phishing</li>
            <li>• Hate speech targeting protected characteristics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>How we moderate</h2>
          <ul className="space-y-2">
            <li>• <strong>New users:</strong> First 3 posts are queued for review</li>
            <li>• <strong>Trusted users:</strong> Posts go live immediately</li>
            <li>• <strong>Reports:</strong> Reviewed within 24 hours</li>
            <li>• <strong>Removals:</strong> Content removed + user warned or banned</li>
          </ul>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Report content</h2>
          <button
            onClick={() => onNavigate('abuseReporting')}
            className="bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all"
            style={{ fontWeight: 900 }}
          >
            Report Abuse
          </button>
        </section>
      </div>
    </PageTemplate>
  );
}

// ABUSE REPORTING
export function AbuseReporting({ onNavigate }: { onNavigate: NavFunction }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTemplate 
      title="Abuse Reporting" 
      subtitle="Report content that violates our policies" 
      icon={Flag}
      backRoute="ugcModeration"
      backLabel="UGC Moderation Policy"
      onNavigate={onNavigate}
    >
      <div className="max-w-2xl">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/20 p-8 space-y-6">
            <div>
              <label className="text-white uppercase tracking-wider text-sm block mb-2" style={{ fontWeight: 700 }}>
                What are you reporting?
              </label>
              <select className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none">
                <option value="harassment">Harassment or threats</option>
                <option value="nonconsensual">Non-consensual content</option>
                <option value="minors">Content involving minors</option>
                <option value="hate">Hate speech</option>
                <option value="doxxing">Doxxing (sharing private info)</option>
                <option value="scam">Scam or fraud</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-white uppercase tracking-wider text-sm block mb-2" style={{ fontWeight: 700 }}>
                Link to content (optional)
              </label>
              <input
                type="url"
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
                placeholder="https://hotmesslondon.com/community/post/123"
              />
            </div>

            <div>
              <label className="text-white uppercase tracking-wider text-sm block mb-2" style={{ fontWeight: 700 }}>
                Details
              </label>
              <textarea
                required
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none h-32"
                placeholder="Describe the issue..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-hot hover:bg-white text-white hover:text-black h-14 uppercase tracking-wider transition-all"
              style={{ fontWeight: 900 }}
            >
              Submit Report
            </button>
          </form>
        ) : (
          <div className="bg-white/5 border border-white/20 p-12 text-center">
            <Flag size={64} className="text-hot mx-auto mb-6" />
            <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>
              Report Submitted
            </h3>
            <p className="text-white/60">
              We'll review this within 24 hours. Thank you for helping keep HOTMESS safe.
            </p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

// DMCA
export function DMCA({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate 
      title="DMCA Policy" 
      subtitle="Copyright infringement takedown procedure" 
      icon={Shield}
      backRoute="legal"
      backLabel="Legal Hub"
      onNavigate={onNavigate}
    >
      <div className="max-w-4xl space-y-8 text-white/80 leading-relaxed">
        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>File a DMCA Takedown</h2>
          <p>If you believe content on HOTMESS infringes your copyright, send a notice to:</p>
          <div className="bg-white/5 border border-white/20 p-6 mt-4">
            <p><strong>Email:</strong> dmca@hotmesslondon.com</p>
            <p className="mt-2">Your notice must include:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Your contact information</li>
              <li>• Description of the copyrighted work</li>
              <li>• URL of the infringing content</li>
              <li>• Statement that you believe in good faith the use is unauthorized</li>
              <li>• Statement that the information is accurate</li>
              <li>• Your signature (physical or electronic)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-hot uppercase tracking-wider mb-4" style={{ fontWeight: 900, fontSize: '24px' }}>Counter-Notice</h2>
          <p>If your content was removed and you believe it was a mistake, you can file a counter-notice to the same email.</p>
        </section>
      </div>
    </PageTemplate>
  );
}

// ACCOUNT PAGES
export function Account({ onNavigate }: { onNavigate: NavFunction }) {
  const accountPages = [
    { route: 'accountProfile' as RouteId, title: 'Profile', description: 'Edit your display name and details', icon: Settings },
    { route: 'notifications' as RouteId, title: 'Notifications', description: 'Activity feed and alerts', icon: Bell },
    { route: 'saved' as RouteId, title: 'Saved Content', description: 'Your saved beacons, records, and more', icon: Bookmark },
    { route: 'accountConsents' as RouteId, title: 'Privacy & Consents', description: 'Manage cookies and permissions', icon: Shield },
    { route: 'accountOrders' as RouteId, title: 'Orders', description: 'View your order history', icon: Package },
    { route: 'accountTickets' as RouteId, title: 'Support Tickets', description: 'DSAR requests and support', icon: FileCheck },
  ];

  return (
    <PageTemplate title="Account" subtitle={`Logged in as ${mockUser.displayName}`} onNavigate={onNavigate}>
      <div className="max-w-6xl">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/20 p-8">
            <div className="text-5xl text-hot mb-2" style={{ fontWeight: 900 }}>{mockUser.stats.level}</div>
            <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>Level</div>
          </div>
          <div className="bg-white/5 border border-white/20 p-8">
            <div className="text-5xl text-hot mb-2" style={{ fontWeight: 900 }}>{mockUser.stats.xp.toLocaleString()}</div>
            <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>XP</div>
          </div>
          <div className="bg-white/5 border border-white/20 p-8">
            <div className="text-5xl text-hot mb-2" style={{ fontWeight: 900 }}>{mockUser.stats.streak}D</div>
            <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>Streak</div>
          </div>
        </div>

        {/* Account sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {accountPages.map((page, i) => {
            const Icon = page.icon;
            return (
              <motion.button
                key={page.route}
                onClick={() => onNavigate(page.route)}
                className="bg-white/5 border border-white/20 hover:border-hot p-8 text-left transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Icon size={32} className="text-hot mb-4" />
                <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900 }}>{page.title}</h3>
                <p className="text-white/60 text-sm">{page.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </PageTemplate>
  );
}

export function AccountProfile({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Profile" icon={Settings} backRoute="account" backLabel="Account" onNavigate={onNavigate}>
      <div className="max-w-2xl">
        <form className="bg-white/5 border border-white/20 p-8 space-y-6">
          <div>
            <label className="text-white uppercase tracking-wider text-sm block mb-2" style={{ fontWeight: 700 }}>Email</label>
            <input type="email" defaultValue={mockUser.email} className="w-full bg-black border border-white/20 text-white px-4 py-3" disabled />
            <p className="text-white/40 text-xs mt-2">Cannot be changed</p>
          </div>
          <div>
            <label className="text-white uppercase tracking-wider text-sm block mb-2" style={{ fontWeight: 700 }}>Display Name</label>
            <input type="text" defaultValue={mockUser.displayName} className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none" />
          </div>
          <button type="submit" className="w-full bg-hot hover:bg-white text-white hover:text-black h-14 uppercase tracking-wider transition-all" style={{ fontWeight: 900 }}>
            Save Changes
          </button>
        </form>
      </div>
    </PageTemplate>
  );
}

export function AccountConsents({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Privacy & Consents" icon={Shield} backRoute="account" backLabel="Account" onNavigate={onNavigate}>
      <div className="max-w-2xl space-y-6">
        {Object.entries(mockUser.consents).map(([key, consent]) => (
          <div key={key} className="bg-white/5 border border-white/20 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-white uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <p className="text-white/40 text-sm">{consent.date ? `Granted ${formatDate(consent.date)}` : 'Not granted'}</p>
            </div>
            <input type="checkbox" checked={consent.granted} className="w-6 h-6" readOnly />
          </div>
        ))}
      </div>
    </PageTemplate>
  );
}

export function AccountOrders({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Orders" icon={Package} backRoute="account" backLabel="Account" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-6">
        {mockOrders.map(order => (
          <div key={order.id} className="bg-white/5 border border-white/20 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white uppercase tracking-wider mb-1" style={{ fontWeight: 900 }}>{order.id}</h3>
                <p className="text-white/60 text-sm">{order.date}</p>
              </div>
              <span className="px-3 py-1 bg-hot/20 border border-hot/40 text-hot text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                {order.status}
              </span>
            </div>
            <div className="space-y-3 mb-6">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-white/80">
                  <span>{item.qty}× {item.productTitle}</span>
                  <span style={{ fontWeight: 700 }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-6 border-t border-white/10">
              <span className="text-white uppercase tracking-wider" style={{ fontWeight: 900 }}>Total</span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '20px' }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </PageTemplate>
  );
}

export function AccountTickets({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Support Tickets" icon={FileCheck} backRoute="account" backLabel="Account" onNavigate={onNavigate}>
      <div className="max-w-2xl">
        <div className="bg-white/5 border border-white/20 p-12 text-center">
          <p className="text-white/60">No open tickets</p>
        </div>
      </div>
    </PageTemplate>
  );
}