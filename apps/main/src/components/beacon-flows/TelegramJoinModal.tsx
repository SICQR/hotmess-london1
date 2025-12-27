/**
 * TELEGRAM JOIN MODAL
 * Scan-to-join flow for Telegram community rooms
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Users, Zap, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';

interface TelegramRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  telegramUrl: string;
  category: string;
}

interface TelegramJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: TelegramRoom;
  xpEarned?: number;
}

export function TelegramJoinModal({
  isOpen,
  onClose,
  room,
  xpEarned = 0,
}: TelegramJoinModalProps) {
  const [joined, setJoined] = useState(false);

  if (!isOpen || !room) return null;

  const currentRoom = room as TelegramRoom;

  const telegramUrl = currentRoom.telegramUrl;

  function handleJoin() {
    // Track join event
    setJoined(true);
    
    // Open Telegram in new tab
    window.open(telegramUrl, '_blank');
    
    // Close modal after a delay
    setTimeout(() => {
      onClose();
    }, 3000);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black border-2 border-hotmess-blue rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="size-5 text-white" />
              </button>

              <AnimatePresence mode="wait">
                {!joined ? (
                  <motion.div
                    key="join"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-br from-hotmess-blue/20 to-hotmess-purple/20 border-b border-white/10 p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-hotmess-blue/30 flex items-center justify-center">
                          <MessageCircle className="size-6 text-hotmess-blue" />
                        </div>
                        <div>
                          <h3 className="text-[16px] font-bold text-white uppercase tracking-wider">
                            Join Community
                          </h3>
                          <p className="text-[13px] text-white/60">
                            Scan to join Telegram room
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Room Image */}
                      {room.imageUrl ? (
                        <div className="aspect-video rounded-xl overflow-hidden">
                          <img 
                            src={room.imageUrl} 
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video rounded-xl bg-gradient-to-br from-hotmess-blue/20 to-hotmess-purple/20 flex items-center justify-center">
                          <MessageCircle className="size-16 text-white/30" />
                        </div>
                      )}

                      {/* Room Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-hotmess-blue/20 border border-hotmess-blue/40 rounded text-[11px] font-bold text-hotmess-blue uppercase tracking-wider">
                            {room.category}
                          </span>
                        </div>
                        <h2 className="text-white mb-2">
                          {room.name}
                        </h2>
                        <p className="text-[14px] text-white/60 mb-4">
                          {room.description}
                        </p>

                        {/* Member Count */}
                        <div className="flex items-center gap-2 text-white/60">
                          <Users className="size-4" />
                          <span className="text-[13px]">
                            {room.memberCount.toLocaleString()} members
                          </span>
                        </div>
                      </div>

                      {/* XP Badge */}
                      <div className="flex items-center gap-2 p-3 bg-hotmess-yellow/10 border border-hotmess-yellow/30 rounded-lg">
                        <Zap className="size-4 text-hotmess-yellow" />
                        <span className="text-[13px] font-bold text-hotmess-yellow">
                          Earn +{xpEarned} XP by joining
                        </span>
                      </div>

                      {/* Info */}
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <p className="text-[13px] text-white/60 leading-relaxed">
                          <strong className="text-white">What to expect:</strong><br />
                          Join our Telegram community to connect with other members, get event updates, 
                          share experiences, and stay in the loop with all things HOTMESS.
                        </p>
                      </div>

                      {/* Join Button */}
                      <button
                        onClick={handleJoin}
                        className="w-full px-6 py-4 bg-hotmess-blue hover:bg-hotmess-blue/80 rounded-xl text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="size-5" />
                        Open Telegram
                      </button>

                      {/* Fine Print */}
                      <p className="text-[11px] text-white/40 text-center leading-relaxed">
                        By joining, you agree to follow our community guidelines and 
                        Telegram's Terms of Service
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  // Success State
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center space-y-6"
                  >
                    {/* Success Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                    >
                      <Check className="size-10 text-green-500" />
                    </motion.div>

                    <div>
                      <h3 className="text-white mb-2">Opening Telegram...</h3>
                      <p className="text-[14px] text-white/60">
                        Join the room to complete your XP reward
                      </p>
                    </div>

                    {/* XP Badge */}
                    <div className="bg-gradient-to-br from-hotmess-yellow/20 to-hotmess-orange/20 border border-hotmess-yellow/30 rounded-xl p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="size-5 text-hotmess-yellow" />
                        <span className="text-[24px] font-black text-hotmess-yellow">
                          +{xpEarned} XP
                        </span>
                      </div>
                      <p className="text-[12px] text-white/40 mt-1">
                        Awarded after joining
                      </p>
                    </div>

                    {/* Auto-closing message */}
                    <p className="text-[12px] text-white/40">
                      This window will close automatically...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
