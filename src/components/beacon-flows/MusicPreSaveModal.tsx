/**
 * MUSIC PRE-SAVE MODAL
 * Track unlock and pre-save flow for RAW CONVICT releases
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Music, Zap, Play, Pause, Heart, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Track {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  coverArt?: string;
  previewUrl?: string;
  label: string;
}

interface MusicPreSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
  xpEarned: number;
}

export function MusicPreSaveModal({
  isOpen,
  onClose,
  track,
  xpEarned,
}: MusicPreSaveModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [preSaved, setPreSaved] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = [
    { id: 'spotify', name: 'Spotify', icon: '🎵' },
    { id: 'apple', name: 'Apple Music', icon: '🍎' },
    { id: 'soundcloud', name: 'SoundCloud', icon: '☁️' },
  ];

  function togglePlatform(platformId: string) {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  }

  async function handlePreSave() {
    try {
      if (selectedPlatforms.length === 0) {
        toast.error('Please select at least one platform');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to pre-save');
        return;
      }

      // Store pre-save preference in scan_events with metadata
      const { error: presaveError } = await supabase
        .from('scan_events')
        .insert({
          beacon_id: track.id,
          user_id: session.user.id,
          source: 'music_presave'
        });

      if (presaveError && !presaveError.message.includes('duplicate') && !presaveError.code?.includes('23505')) {
        throw presaveError;
      }

      // Award XP for pre-save
      const { error: xpError } = await supabase
        .from('xp_ledger')
        .insert({
          user_id: session.user.id,
          beacon_id: track.id,
          reason: 'action',
          amount: xpEarned,
          meta: { 
            action: 'music_presave', 
            platforms: selectedPlatforms,
            track_title: track.title,
            artist: track.artist
          }
        });

      if (xpError && !xpError.message.includes('duplicate') && !xpError.code?.includes('23505')) {
        console.error('Failed to award XP:', xpError);
      }

      setPreSaved(true);
      toast.success('Track pre-saved! You\'ll be notified when it drops.');
    } catch (err: any) {
      console.error('Pre-save error:', err);
      toast.error(err.message || 'Failed to pre-save track');
    }
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
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-black border-2 border-hotmess-purple rounded-2xl w-full max-w-lg overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
              >
                <X className="size-5 text-white" />
              </button>

              {/* Cover Art Header */}
              <div className="relative h-80 overflow-hidden">
                {track.coverArt ? (
                  <>
                    {/* Blurred Background */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-50"
                      style={{ backgroundImage: `url(${track.coverArt})` }}
                    />
                    {/* Actual Cover */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <motion.div
                        initial={{ scale: 0.8, rotateY: -30 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        className="relative"
                      >
                        <img 
                          src={track.coverArt} 
                          alt={track.title}
                          className="w-64 h-64 object-cover rounded-xl shadow-2xl border-2 border-white/20"
                        />
                        {/* Play/Pause Button Overlay */}
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-hotmess-purple hover:bg-hotmess-purple/80 flex items-center justify-center transition-colors shadow-xl"
                        >
                          {isPlaying ? (
                            <Pause className="size-6 text-white" />
                          ) : (
                            <Play className="size-6 text-white ml-1" />
                          )}
                        </button>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-hotmess-purple to-hotmess-blue flex items-center justify-center">
                    <Music className="size-24 text-white/30" />
                  </div>
                )}

                {/* Label Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-hotmess-red">
                  <span className="text-[11px] font-black text-hotmess-red uppercase tracking-wider">
                    {track.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Track Info */}
                <div className="text-center">
                  <h2 className="text-white mb-1">
                    {track.title}
                  </h2>
                  <p className="text-[16px] text-white/70 mb-2">{track.artist}</p>
                  <p className="text-[13px] text-hotmess-purple">
                    Releases {new Date(track.releaseDate).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                {/* XP Badge */}
                <div className="flex items-center justify-center gap-2 p-3 bg-hotmess-yellow/10 border border-hotmess-yellow/30 rounded-lg">
                  <Zap className="size-4 text-hotmess-yellow" />
                  <span className="text-[13px] font-bold text-hotmess-yellow">
                    Earn +{xpEarned} XP by pre-saving
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {!preSaved ? (
                    <motion.div
                      key="pre-save"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Platform Selection */}
                      <div>
                        <p className="text-[13px] text-white/60 uppercase tracking-wider mb-3">
                          Select Platforms
                        </p>
                        <div className="space-y-2">
                          {platforms.map((platform) => (
                            <button
                              key={platform.id}
                              onClick={() => togglePlatform(platform.id)}
                              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                                selectedPlatforms.includes(platform.id)
                                  ? 'bg-hotmess-purple/20 border-hotmess-purple'
                                  : 'bg-white/5 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <span className="text-[24px]">{platform.icon}</span>
                              <span className="flex-1 text-left text-[15px] font-bold text-white">
                                {platform.name}
                              </span>
                              {selectedPlatforms.includes(platform.id) && (
                                <Check className="size-5 text-hotmess-purple" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pre-Save Button */}
                      <button
                        onClick={handlePreSave}
                        disabled={selectedPlatforms.length === 0}
                        className="w-full px-6 py-4 bg-hotmess-purple hover:bg-hotmess-purple/80 disabled:bg-white/10 disabled:text-white/40 rounded-xl text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <Heart className="size-5" />
                        Pre-Save Track
                      </button>

                      {/* Share Button */}
                      <button className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                        <Share2 className="size-4" />
                        Share
                      </button>
                    </motion.div>
                  ) : (
                    // Success State
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6 space-y-4"
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
                        <h3 className="text-white mb-2">Pre-Saved!</h3>
                        <p className="text-[14px] text-white/60">
                          You'll be notified when this track drops
                        </p>
                      </div>

                      {/* XP Earned */}
                      <div className="bg-gradient-to-br from-hotmess-yellow/20 to-hotmess-orange/20 border border-hotmess-yellow/30 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="size-5 text-hotmess-yellow" />
                          <span className="text-[24px] font-black text-hotmess-yellow">
                            +{xpEarned} XP
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={onClose}
                        className="w-full px-6 py-4 bg-hotmess-purple hover:bg-hotmess-purple/80 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                      >
                        Done
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
