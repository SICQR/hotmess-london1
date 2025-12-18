/**
 * EVENT RSVP MODAL
 * Quick RSVP and guestlist management for event beacons
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Clock, Users, Zap, Check, Star } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Event {
  id: string;
  name: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  imageUrl?: string;
  price: number;
  capacity: number;
  attending: number;
  isGuestlist?: boolean;
}

interface EventRSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  xpEarned: number;
}

export function EventRSVPModal({
  isOpen,
  onClose,
  event,
  xpEarned,
}: EventRSVPModalProps) {
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');
  const [plusOnes, setPlusOnes] = useState(0);

  async function handleRSVP() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to RSVP');
        return;
      }

      // Create a scan event for the RSVP
      // This records the user's intent to attend
      const { error: rsvpError } = await supabase
        .from('scan_events')
        .insert({
          beacon_id: event.id,
          user_id: session.user.id,
          source: 'rsvp'
        });

      if (rsvpError) {
        // PostgreSQL unique constraint violation code
        const isDuplicateError = rsvpError.code === '23505';
        if (!isDuplicateError) {
          throw rsvpError;
        }
      }

      // Award XP for RSVP
      const { error: xpError } = await supabase
        .from('xp_ledger')
        .insert({
          user_id: session.user.id,
          beacon_id: event.id,
          reason: 'action',
          amount: xpEarned,
          meta: { action: 'event_rsvp', plus_ones: plusOnes }
        });

      if (xpError && xpError.code !== '23505') {
        console.error('Failed to award XP:', xpError);
        // Don't fail the RSVP if XP fails
      }

      setStep('success');
    } catch (err: any) {
      console.error('RSVP error:', err);
      toast.error(err.message || 'Failed to create RSVP');
    }
  }

  const spotsLeft = event.capacity - event.attending;
  const percentFull = (event.attending / event.capacity) * 100;

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
              className="bg-black border-2 border-hotmess-red rounded-2xl w-full max-w-lg overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm transition-colors"
              >
                <X className="size-5 text-white" />
              </button>

              {/* Event Image Header */}
              {event.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Guestlist Badge */}
                  {event.isGuestlist && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-hotmess-red/90 backdrop-blur-sm rounded-full border border-hotmess-red flex items-center gap-1.5">
                      <Star className="size-3.5 text-white" />
                      <span className="text-[11px] font-black text-white uppercase tracking-wider">
                        Guestlist
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {step === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Event Info */}
                      <div>
                        <h2 className="text-white mb-4">
                          {event.name}
                        </h2>

                        {/* Details Grid */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="size-5 text-hotmess-red mt-0.5" />
                            <div>
                              <p className="text-[15px] font-bold text-white">{event.venue}</p>
                              <p className="text-[13px] text-white/60">{event.address}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar className="size-5 text-hotmess-purple" />
                            <p className="text-[15px] text-white">
                              {new Date(event.date).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Clock className="size-5 text-hotmess-blue" />
                            <p className="text-[15px] text-white">{event.time}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Users className="size-5 text-hotmess-orange" />
                            <div className="flex-1">
                              <p className="text-[15px] text-white mb-1">
                                {event.attending} / {event.capacity} attending
                              </p>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentFull}%` }}
                                  className="h-full bg-gradient-to-r from-hotmess-orange to-hotmess-red"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Capacity Warning */}
                      {spotsLeft < 50 && spotsLeft > 0 && (
                        <div className="bg-hotmess-orange/10 border border-hotmess-orange/30 rounded-lg p-3">
                          <p className="text-[13px] text-hotmess-orange font-bold text-center">
                            ⚡ Only {spotsLeft} spots left!
                          </p>
                        </div>
                      )}

                      {/* XP Badge */}
                      <div className="flex items-center gap-2 p-3 bg-hotmess-yellow/10 border border-hotmess-yellow/30 rounded-lg">
                        <Zap className="size-4 text-hotmess-yellow" />
                        <span className="text-[13px] font-bold text-hotmess-yellow">
                          Earn +{xpEarned} XP by attending
                        </span>
                      </div>

                      {/* Plus Ones */}
                      <div>
                        <p className="text-[13px] text-white/60 uppercase tracking-wider mb-3">
                          Bringing friends?
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPlusOnes(Math.max(0, plusOnes - 1))}
                            disabled={plusOnes === 0}
                            className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-bold text-[20px] transition-colors"
                          >
                            −
                          </button>
                          <div className="flex-1 text-center">
                            <p className="text-[24px] font-black text-white">{plusOnes}</p>
                            <p className="text-[11px] text-white/40 uppercase tracking-wider">
                              Plus Ones
                            </p>
                          </div>
                          <button
                            onClick={() => setPlusOnes(Math.min(5, plusOnes + 1))}
                            disabled={plusOnes >= 5 || spotsLeft <= plusOnes + 1}
                            className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-bold text-[20px] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <span className="text-[15px] text-white/60">Total</span>
                        <span className="text-[24px] font-black text-white">
                          {event.price === 0 ? 'FREE' : `£${(event.price * (plusOnes + 1)).toFixed(2)}`}
                        </span>
                      </div>

                      {/* RSVP Button */}
                      <button
                        onClick={() => setStep('confirm')}
                        disabled={spotsLeft === 0}
                        className="w-full px-6 py-4 bg-hotmess-red hover:bg-hotmess-red/80 disabled:bg-white/10 disabled:text-white/40 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                      >
                        {spotsLeft === 0 ? 'Sold Out' : event.isGuestlist ? 'Join Guestlist' : 'RSVP Now'}
                      </button>
                    </motion.div>
                  )}

                  {step === 'confirm' && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <h3 className="text-white mb-2">Confirm RSVP</h3>
                        <p className="text-[14px] text-white/60">
                          You're RSVPing for {plusOnes + 1} {plusOnes === 0 ? 'person' : 'people'}
                        </p>
                      </div>

                      {/* Summary */}
                      <div className="bg-white/5 rounded-xl p-5 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[14px] text-white/60">Event</span>
                          <span className="text-[14px] font-bold text-white">{event.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[14px] text-white/60">Date</span>
                          <span className="text-[14px] font-bold text-white">
                            {new Date(event.date).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[14px] text-white/60">Guests</span>
                          <span className="text-[14px] font-bold text-white">{plusOnes + 1}</span>
                        </div>
                        <div className="border-t border-white/10 pt-3 flex justify-between">
                          <span className="text-[15px] font-bold text-white">Total</span>
                          <span className="text-[20px] font-black text-hotmess-red">
                            {event.price === 0 ? 'FREE' : `£${(event.price * (plusOnes + 1)).toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={handleRSVP}
                          className="w-full px-6 py-4 bg-hotmess-red hover:bg-hotmess-red/80 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                        >
                          Confirm RSVP
                        </button>
                        <button
                          onClick={() => setStep('details')}
                          className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 font-bold uppercase tracking-wider transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-6"
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
                        <h3 className="text-white mb-2">You're In!</h3>
                        <p className="text-[14px] text-white/60 mb-1">
                          {event.isGuestlist ? "You're on the guestlist" : 'Your RSVP is confirmed'}
                        </p>
                        <p className="text-[13px] text-white/40">
                          Check your email for details
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

                      {/* Calendar Reminder */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-[13px] text-white/60 mb-2">Add to calendar</p>
                        <div className="flex gap-2">
                          <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[12px] font-bold text-white uppercase tracking-wider transition-colors">
                            Google
                          </button>
                          <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[12px] font-bold text-white uppercase tracking-wider transition-colors">
                            Apple
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={onClose}
                        className="w-full px-6 py-4 bg-hotmess-red hover:bg-hotmess-red/80 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
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
