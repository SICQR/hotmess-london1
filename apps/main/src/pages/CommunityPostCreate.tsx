import { motion } from 'motion/react';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RouteId } from '../lib/routes';
import { ConsentGate } from '../components/ConsentGate';
import { toast } from 'sonner';

interface CommunityPostCreateProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function CommunityPostCreate({ onNavigate }: CommunityPostCreateProps) {
  const [showConsentGate, setShowConsentGate] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check if user has already given consent
  useEffect(() => {
    const consent = localStorage.getItem('hotmess_community_consent');
    const explicitConsent = localStorage.getItem('hotmess_explicit_consent');
    
    if (consent === 'true' && explicitConsent === 'true') {
      setConsentGiven(true);
    } else {
      // Show consent gate on mount
      setShowConsentGate(true);
    }
  }, []);

  const handleConsentAccept = () => {
    localStorage.setItem('hotmess_community_consent', 'true');
    localStorage.setItem('hotmess_explicit_consent', 'true');
    setConsentGiven(true);
    setShowConsentGate(false);
    toast.success('Thanks for respecting the rules');
  };

  const handleConsentDecline = () => {
    toast('Not in the headspace? That\'s okay.');
    onNavigate('radio');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      toast.error('Both title and body are required');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In production: POST /api/posts
      toast.success('Post submitted — thanks for keeping it kind');
      setSubmitting(false);
      onNavigate('community');
    }, 1000);
  };

  if (!consentGiven) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertTriangle size={64} className="text-hot mx-auto mb-6" />
          <p className="text-white/60">Checking consent...</p>
        </div>
        
        <ConsentGate
          type="community-rules"
          isOpen={showConsentGate}
          onAccept={handleConsentAccept}
          onDecline={handleConsentDecline}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-6">
        <button
          onClick={() => onNavigate('community')}
          className="flex items-center gap-2 text-white/60 hover:text-hot transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
            Back to Community
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-3xl">
          <h1 
            className="text-white uppercase tracking-wider mb-4"
            style={{ fontWeight: 900, fontSize: 'clamp(42px, 8vw, 72px)' }}
          >
            Create Post
          </h1>

          <p className="text-white/60 mb-12 text-lg">
            Share your story. Keep it respectful. No doxxing, no coercion, no non-consensual content.
          </p>

          {/* Reminder banner */}
          <motion.div 
            className="bg-hot/10 border border-hot/30 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <AlertTriangle size={24} className="text-hot flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-hot uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '14px' }}>
                  Quick Reminder
                </h3>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• Consent first. Always.</li>
                  <li>• No racism, misogyny, or phobia of any flavour.</li>
                  <li>• Privacy is sacred — no doxxing.</li>
                  <li>• We're honest about what happens, but we don't celebrate harm.</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Title */}
            <div>
              <label 
                htmlFor="title"
                className="text-white uppercase tracking-wider mb-3 block"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a title..."
                className="w-full bg-white/5 border border-white/20 focus:border-hot text-white px-6 py-4 outline-none transition-colors"
                style={{ fontWeight: 700 }}
                maxLength={100}
                required
              />
              <p className="text-white/40 text-xs mt-2">{title.length}/100</p>
            </div>

            {/* Body */}
            <div>
              <label 
                htmlFor="body"
                className="text-white uppercase tracking-wider mb-3 block"
                style={{ fontWeight: 900, fontSize: '14px' }}
              >
                Your Story
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share what's on your mind..."
                className="w-full bg-white/5 border border-white/20 focus:border-hot text-white px-6 py-4 outline-none transition-colors min-h-64 resize-y"
                style={{ fontWeight: 400, lineHeight: '1.8' }}
                maxLength={2000}
                required
              />
              <p className="text-white/40 text-xs mt-2">{body.length}/2000</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-hot hover:bg-white text-white hover:text-black h-14 uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: 900 }}
              >
                <Send size={20} />
                <span>{submitting ? 'Submitting...' : 'Submit Post'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('community')}
                className="border border-white/20 hover:border-hot text-white h-14 px-8 uppercase tracking-wider transition-all"
                style={{ fontWeight: 700 }}
              >
                Cancel
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-white/40 text-sm leading-relaxed">
              By submitting, you confirm that your post follows our community guidelines. 
              Posts from new users are reviewed before going live. We typically respond within 24 hours.
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}