'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface MessBrainChatProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  safety_alerts?: {
    type: 'panic' | 'crowd_crush' | 'venue_flagged';
    message: string;
    distance_km?: number;
  }[];
}

export function MessBrainChat({ onClose }: MessBrainChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hey. I\'m MESS BRAIN — your gay city intelligence, slightly mean but on your side. Ask me where the heat really is, where it\'s safe to arrive solo, or which room to avoid.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Where\'s safest to arrive solo?',
    'Which club just spiked hardest?',
    'Best zone for kink + techno?',
    'Where did panic spike last night?',
  ];

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: messageText,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // TODO: Replace with actual API call
    // Simulate AI response
    setTimeout(() => {
      const mockResponses: Record<string, Message> = {
        'safest': {
          role: 'assistant',
          content: 'Based on right now: **Vauxhall** has 3 crowd-verified venues within 500m. Solo arrivals are common. No panic incidents in 7 days.\n\nAvoid **Peckham flat parties** tonight — 2 panics in last 3h, no crowd verification.',
          safety_alerts: [
            {
              type: 'panic',
              message: 'Flat party in Peckham triggered 2 panics in last 3h',
              distance_km: 2.3,
            },
          ],
        },
        'club': {
          role: 'assistant',
          content: '**Dalston Superstore** just went from 0 → 43 scans in 20 minutes. Heat spike detected. Expect queue.\n\n**The Glory** is steady at 28 scans, crowd-verified, music just switched to techno.',
        },
        'kink': {
          role: 'assistant',
          content: 'Best zone for **kink + techno** within 3km of you?\n\n**Vauxhall** is your answer. 2 darkrooms active, both crowd-verified. Techno sets running til 6am.\n\nMembers can see private kink rooms on the globe.',
        },
        'panic': {
          role: 'assistant',
          content: 'Last night saw 3 panic spikes:\n\n• **Shoreditch flat party** (11:30pm) — overcrowding\n• **Soho bar** (1:15am) — spiking concern (unconfirmed)\n• **Brixton venue** (3:45am) — verbal altercation\n\nAll resolved via Hand N Hand. No police involvement.',
          safety_alerts: [
            {
              type: 'venue_flagged',
              message: 'Soho bar had spiking concern last night (unconfirmed)',
              distance_km: 1.2,
            },
          ],
        },
      };

      // Match response
      const lowerMessage = messageText.toLowerCase();
      let response: Message;
      
      if (lowerMessage.includes('safe') || lowerMessage.includes('solo')) {
        response = mockResponses.safest;
      } else if (lowerMessage.includes('club') || lowerMessage.includes('spike')) {
        response = mockResponses.club;
      } else if (lowerMessage.includes('kink') || lowerMessage.includes('techno')) {
        response = mockResponses.kink;
      } else if (lowerMessage.includes('panic')) {
        response = mockResponses.panic;
      } else {
        response = {
          role: 'assistant',
          content: 'I can help you with:\n\n• Where it\'s safest to go solo\n• Which venues just spiked in heat\n• Best zones for specific vibes (kink, techno, etc.)\n• Recent panic incidents and safety history\n\nWhat do you want to know?',
        };
      }

      setMessages(prev => [...prev, response]);
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-hidden"
        style={{
          background: '#000000',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}>
              🧠 MESS BRAIN
            </div>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.6)',
            }}>
              Your gay city intelligence
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 transition-opacity hover:opacity-100"
            style={{ opacity: 0.6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div 
          className="overflow-y-auto px-6 py-4 space-y-4"
          style={{
            maxHeight: 'calc(90vh - 180px)',
          }}
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%]"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: message.role === 'user'
                      ? '#FF0080'
                      : 'rgba(255,255,255,0.08)',
                    color: message.role === 'user' ? '#000000' : '#ffffff',
                  }}
                >
                  <div style={{
                    fontSize: '14px',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {message.content}
                  </div>

                  {/* Safety Alerts */}
                  {message.safety_alerts && message.safety_alerts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.safety_alerts.map((alert, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 px-3 py-2"
                          style={{
                            background: 'rgba(255,23,68,0.15)',
                            border: '1px solid rgba(255,23,68,0.3)',
                            borderRadius: '8px',
                          }}
                        >
                          <div style={{ fontSize: '14px', marginTop: '2px' }}>⚠️</div>
                          <div>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              marginBottom: '2px',
                            }}>
                              {alert.type === 'panic' && 'Safety Alert'}
                              {alert.type === 'crowd_crush' && 'Crowd Risk'}
                              {alert.type === 'venue_flagged' && 'Venue Flagged'}
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.9 }}>
                              {alert.message}
                              {alert.distance_km && ` (${alert.distance_km}km away)`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSend(prompt)}
                className="flex-shrink-0 transition-all"
                style={{
                  padding: '8px 12px',
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '999px',
                  color: 'rgba(255,255,255,0.8)',
                  whiteSpace: 'nowrap',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me where the heat really is..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40"
              style={{
                borderRadius: '12px',
                fontSize: '14px',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="px-6 transition-all disabled:opacity-40"
              style={{
                background: '#FF0080',
                color: '#000000',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              SEND
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
