import { useState } from 'react';
import { ArrowLeft, AlertTriangle, Send, Shield, Eye, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { RouteId } from '../lib/routes';

interface AbuseReportingProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function AbuseReporting({ onNavigate }: AbuseReportingProps) {
  const [reportType, setReportType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reportTypes = [
    { id: 'underage', label: 'Underage User', icon: Shield, urgent: true },
    { id: 'harassment', label: 'Harassment / Abuse', icon: AlertTriangle, urgent: true },
    { id: 'hate_speech', label: 'Hate Speech / Discrimination', icon: MessageSquare, urgent: true },
    { id: 'sexual_content', label: 'Non-Consensual Sexual Content', icon: Eye, urgent: true },
    { id: 'fake_profile', label: 'Fake Profile / Catfishing', icon: User, urgent: false },
    { id: 'scam', label: 'Scam / Fraud', icon: AlertTriangle, urgent: true },
    { id: 'spam', label: 'Spam / Commercial Abuse', icon: MessageSquare, urgent: false },
    { id: 'other', label: 'Other Safety Concern', icon: Shield, urgent: false },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType || !description.trim()) {
      toast.error('Please select a report type and provide details');
      return;
    }

    setSubmitting(true);
    try {
      // In production, this would send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Report submitted. Our safety team will review within 24 hours.');
      setReportType('');
      setDescription('');
    } catch (error: any) {
      toast.error('Failed to submit report: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-24 py-16">
      <button
        onClick={() => onNavigate('legal')}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Legal
      </button>

      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-7xl uppercase tracking-tight mb-4" style={{ fontWeight: 900 }}>
          Report Abuse
        </h1>
        <p className="text-xl text-zinc-400 mb-12">
          Your safety is our priority. Report anything that violates our community standards.
        </p>

        {/* Emergency Notice */}
        <div className="p-6 bg-gradient-to-br from-red-950/30 to-black border-2 border-red-600 mb-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg mb-2 text-red-400">In Immediate Danger?</h3>
              <p className="text-zinc-300 mb-4">
                If you're in immediate danger, <strong className="text-white">call 999</strong> (UK) or your local emergency services.
                This form is for reporting platform violations, not emergencies.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-white">Emergency:</strong> 999
                </div>
                <div>
                  <strong className="text-white">Police Non-Emergency:</strong> 101
                </div>
                <div>
                  <strong className="text-white">Rape Crisis:</strong> 0808 802 9999
                </div>
                <div>
                  <strong className="text-white">Samaritans:</strong> 116 123
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl mb-6">What are you reporting?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setReportType(type.id)}
                    className={`p-4 border-2 text-left transition-all ${
                      reportType === type.id
                        ? 'border-hotmess-red bg-hotmess-red/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        type.urgent ? 'text-red-500' : 'text-hotmess-red'
                      }`} />
                      <div>
                        <div className="mb-1">{type.label}</div>
                        {type.urgent && (
                          <div className="text-xs text-red-500">Urgent - Priority Review</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-lg mb-3">
              Describe what happened <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide as much detail as possible. Include usernames, URLs, timestamps, or any other relevant information..."
              rows={8}
              className="w-full p-4 bg-zinc-900 border border-white/10 focus:border-hotmess-red outline-none resize-none"
              required
            />
            <p className="text-sm text-zinc-500 mt-2">
              The more detail you provide, the faster we can act. All reports are confidential.
            </p>
          </div>

          <div className="mb-8 p-4 bg-zinc-900 border border-white/10">
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">What Happens Next?</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>1. Your report is logged and assigned to our safety team</li>
              <li>2. Urgent reports (harassment, underage users) are reviewed within 1 hour</li>
              <li>3. Standard reports are reviewed within 24 hours</li>
              <li>4. We investigate and take action (warning, suspension, ban)</li>
              <li>5. You receive a confirmation email (if you provide contact info)</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={submitting || !reportType || !description.trim()}
            className="w-full md:w-auto px-8 py-4 bg-hotmess-red hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>

        {/* What We Act On */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6 uppercase">What We Act On</h2>
          <div className="space-y-6">
            <div className="p-6 bg-zinc-900 border-l-4 border-red-600">
              <h3 className="text-xl mb-2 text-red-400">Zero Tolerance</h3>
              <p className="text-zinc-400 mb-3">Immediate action. Usually permanent ban.</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
                <li>Underage users (under 18)</li>
                <li>Child sexual abuse material (CSAM)</li>
                <li>Non-consensual intimate images</li>
                <li>Violent threats or incitement</li>
                <li>Hate speech (racism, transphobia, etc.)</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900 border-l-4 border-orange-500">
              <h3 className="text-xl mb-2 text-orange-400">Serious Violations</h3>
              <p className="text-zinc-400 mb-3">Suspension or ban. Repeat offenses = permanent.</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
                <li>Harassment or stalking</li>
                <li>Doxxing (sharing personal info without consent)</li>
                <li>Scams or fraud</li>
                <li>Impersonation</li>
                <li>Coordinated abuse</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900 border-l-4 border-yellow-500">
              <h3 className="text-xl mb-2 text-yellow-400">Warnings & Strikes</h3>
              <p className="text-zinc-400 mb-3">First offense warning. Multiple = suspension.</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
                <li>Spam or commercial abuse</li>
                <li>Minor ToS violations</li>
                <li>Disrespectful behavior</li>
                <li>Off-topic content in wrong sections</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What We Don't Act On */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6 uppercase">What We Don't Act On</h2>
          <div className="p-6 bg-zinc-900 border border-white/10">
            <ul className="space-y-3 text-zinc-400">
              <li>
                <strong className="text-white">Disagreements:</strong> We're not referees for arguments. 
                Use block/mute features.
              </li>
              <li>
                <strong className="text-white">Consensual adult content:</strong> This is an 18+ platform 
                for queer men. Sexual content is allowed if consensual and tagged appropriately.
              </li>
              <li>
                <strong className="text-white">Kink/fetish content:</strong> Kink-positive means we don't 
                ban content just because it's "weird." Only report if it's non-consensual or harmful.
              </li>
              <li>
                <strong className="text-white">Political opinions:</strong> Unless it crosses into hate speech 
                or violence, we protect diverse viewpoints.
              </li>
            </ul>
          </div>
        </section>

        {/* False Reports */}
        <section className="mb-16">
          <div className="p-6 bg-orange-950/30 border-l-4 border-orange-500">
            <h3 className="text-xl mb-3 text-orange-400">False Reports</h3>
            <p className="text-zinc-300">
              <strong className="text-white">Don't abuse the reporting system.</strong> Filing false reports 
              to harass users or game the system will result in <strong className="text-white">your account 
              being suspended or banned</strong>. We log all reports and review patterns.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-3xl mb-6 uppercase">Other Ways to Contact Safety Team</h2>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 border border-white/10">
              <strong className="text-white">Email:</strong> safety@hotmess.london
              <p className="text-sm text-zinc-500 mt-1">For non-urgent reports or detailed inquiries</p>
            </div>
            <div className="p-4 bg-zinc-900 border border-white/10">
              <strong className="text-white">DPO (Data Protection):</strong> dpo@hotmess.london
              <p className="text-sm text-zinc-500 mt-1">For privacy violations or data concerns</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
