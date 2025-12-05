import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, ExternalLink, AlertTriangle, CheckCircle, Phone } from 'lucide-react';

export type AftercareTriggerType = 
  | 'post_purchase_shop'
  | 'post_purchase_market'
  | 'post_ticket_purchase'
  | 'high_risk_product'
  | 'kink_product'
  | 'substance_content'
  | 'post_event_reminder'
  | 'extended_session';

interface AftercareTriggerProps {
  type: AftercareTriggerType;
  productName?: string;
  eventName?: string;
  onDismiss: () => void;
  onVisitCare: () => void;
  autoShow?: boolean;
}

const TRIGGER_CONTENT: Record<AftercareTriggerType, {
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  resources: Array<{ label: string; route: string }>;
  emergencyNumbers?: boolean;
}> = {
  post_purchase_shop: {
    title: 'Looking good is one thing. Feeling safe is everything.',
    message: 'You just grabbed some new gear—nice choice. Before you head out, make sure you\'re prepared. Hydration, protection, and knowing your limits aren\'t optional.',
    urgency: 'low',
    resources: [
      { label: 'Pre-Party Prep Guide', route: '?route=care' },
      { label: 'Body Safety Tips', route: '?route=care' },
      { label: 'HNH MESS Aftercare', route: '?route=hnhMess' },
    ],
  },
  post_purchase_market: {
    title: 'New gear secured. Now make sure you\'re ready to use it.',
    message: 'Whether it\'s club wear or play gear, preparation matters. Check out our guides on safe use, aftercare, and knowing when to take a break.',
    urgency: 'medium',
    resources: [
      { label: 'Care Resources', route: '?route=care' },
      { label: 'Community Support', route: '?route=community' },
      { label: 'Harm Reduction', route: '?route=care' },
    ],
  },
  post_ticket_purchase: {
    title: 'Event confirmed. Let\'s make sure it\'s a good night, not just a wild one.',
    message: 'You\'re going out—hell yes. But before you do, take 5 minutes to prep. Know the venue, plan your exit, tell someone where you\'ll be. Basic stuff that saves lives.',
    urgency: 'medium',
    resources: [
      { label: 'Event Safety Checklist', route: '?route=care' },
      { label: 'Buddy System Guide', route: '?route=care' },
      { label: 'Emergency Contacts', route: '?route=care' },
    ],
  },
  high_risk_product: {
    title: 'This item requires extra care and knowledge.',
    message: 'You just purchased something that\'s not for beginners. Before you use it, read the safety guides. Seriously—this isn\'t a suggestion, it\'s essential.',
    urgency: 'high',
    resources: [
      { label: 'Product Safety Guide', route: '?route=care' },
      { label: 'Care Disclaimer', route: '?route=legalCareDisclaimer' },
      { label: 'Community Forums', route: '?route=community' },
    ],
  },
  kink_product: {
    title: 'Kink culture requires care culture.',
    message: 'You\'re exploring kink aesthetics or gear—that\'s valid and celebrated here. But it comes with responsibility. Understand consent, negotiate boundaries, and prioritize aftercare. Always.',
    urgency: 'high',
    resources: [
      { label: 'Kink Safety Essentials', route: '?route=care' },
      { label: 'Consent Framework', route: '?route=care' },
      { label: 'Aftercare for Scenes', route: '?route=care' },
      { label: 'Care Disclaimer', route: '?route=legalCareDisclaimer' },
    ],
    emergencyNumbers: true,
  },
  substance_content: {
    title: 'Harm reduction is not encouragement—it\'s survival.',
    message: 'You\'re accessing substance-related content. We\'re not here to judge or preach. We\'re here to keep you alive. If you\'re using, use smart. Test your gear. Know your dose. Never use alone.',
    urgency: 'critical',
    resources: [
      { label: 'Harm Reduction Guide', route: '?route=care' },
      { label: 'Overdose Prevention', route: '?route=care' },
      { label: 'Testing Resources', route: '?route=care' },
      { label: 'Addiction Support', route: '?route=care' },
    ],
    emergencyNumbers: true,
  },
  post_event_reminder: {
    title: 'The party\'s over. Now comes the important part.',
    message: 'Aftercare isn\'t optional—it\'s how you recover physically and emotionally. Rest, hydrate, eat, and check in with yourself. If something feels off, reach out.',
    urgency: 'medium',
    resources: [
      { label: 'Post-Party Recovery', route: '?route=care' },
      { label: 'Mental Health Check-In', route: '?route=care' },
      { label: 'HNH MESS Products', route: '?route=hnhMess' },
    ],
    emergencyNumbers: true,
  },
  extended_session: {
    title: 'You\'ve been here a while. Check in with yourself.',
    message: 'Take a break. Drink water. Step away from the screen. Your wellbeing is more important than scrolling.',
    urgency: 'low',
    resources: [
      { label: 'Digital Wellness', route: '?route=care' },
      { label: 'Take a Break', route: '?route=care' },
    ],
  },
};

export function AftercareTrigger({ 
  type, 
  productName, 
  eventName, 
  onDismiss, 
  onVisitCare,
  autoShow = true 
}: AftercareTriggerProps) {
  const [show, setShow] = useState(autoShow);
  const content = TRIGGER_CONTENT[type];

  const handleDismiss = () => {
    setShow(false);
    setTimeout(onDismiss, 300); // Wait for animation
  };

  const handleVisitCare = () => {
    onVisitCare();
    handleDismiss();
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onDismiss, 300); // Wait for animation
  };

  const urgencyColors = {
    low: 'border-blue-500',
    medium: 'border-orange-500',
    high: 'border-red-500',
    critical: 'border-red-600',
  };

  const urgencyIcons = {
    low: Heart,
    medium: AlertTriangle,
    high: AlertTriangle,
    critical: AlertTriangle,
  };

  const Icon = urgencyIcons[content.urgency];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div className={`max-w-2xl w-full bg-black border-2 ${urgencyColors[content.urgency]} pointer-events-auto relative`}>
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="text-hot" size={32} />
                    <h2 className="uppercase tracking-wider text-white" style={{ fontWeight: 900, fontSize: '24px' }}>
                      {content.title}
                    </h2>
                  </div>
                  {productName && (
                    <div className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
                      Product: <span className="text-white">{productName}</span>
                    </div>
                  )}
                  {eventName && (
                    <div className="text-white/60" style={{ fontWeight: 400, fontSize: '13px' }}>
                      Event: <span className="text-white">{eventName}</span>
                    </div>
                  )}
                </div>

                {/* Message */}
                <p className="text-white/80 leading-relaxed mb-6" style={{ fontWeight: 400, fontSize: '16px' }}>
                  {content.message}
                </p>

                {/* Resources */}
                <div className="mb-6">
                  <h3 className="text-white/60 uppercase tracking-wider mb-3" style={{ fontWeight: 700, fontSize: '12px' }}>
                    Recommended Resources
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.resources.map((resource, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onVisitCare(); // Navigate to care/specific route
                          handleDismiss();
                        }}
                        className="p-4 bg-black border border-white/10 hover:border-hotmess-red transition-colors text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm group-hover:text-hotmess-red transition-colors">
                            {resource.label}
                          </span>
                          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-hotmess-red transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emergency Numbers */}
                {content.emergencyNumbers && (
                  <div className="p-4 bg-red-950/30 border-l-4 border-red-600 mb-6">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm text-red-400 mb-2">Emergency Contacts</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <strong className="text-white">Emergency:</strong> 999
                          </div>
                          <div>
                            <strong className="text-white">Samaritans:</strong> 116 123
                          </div>
                          <div>
                            <strong className="text-white">NHS 111:</strong> Option 2
                          </div>
                          <div>
                            <strong className="text-white">FRANK:</strong> 0300 123 6600
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleVisitCare}
                    className="flex-1 px-6 py-4 bg-hotmess-red hover:bg-red-600 transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Visit Care Hub
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 transition-colors uppercase tracking-wider"
                  >
                    I Understand
                  </button>
                </div>

                {/* Persistence Note */}
                {content.urgency === 'high' || content.urgency === 'critical' ? (
                  <p className="text-xs text-zinc-600 text-center mt-4">
                    You must acknowledge this before continuing
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for triggering aftercare modals
export function useAftercareTrigger() {
  const [activeTrigger, setActiveTrigger] = useState<{
    type: AftercareTriggerType;
    productName?: string;
    eventName?: string;
  } | null>(null);

  const trigger = (
    type: AftercareTriggerType, 
    metadata?: { productName?: string; eventName?: string }
  ) => {
    setActiveTrigger({ type, ...metadata });
  };

  const dismiss = () => {
    setActiveTrigger(null);
  };

  return { activeTrigger, trigger, dismiss };
}

// Persistent session monitor (triggers after extended browsing)
export function SessionMonitor({ onTrigger }: { onTrigger: () => void }) {
  useEffect(() => {
    const SESSION_THRESHOLD = 60 * 60 * 1000; // 1 hour
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= SESSION_THRESHOLD) {
        onTrigger();
        clearInterval(interval);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [onTrigger]);

  return null;
}