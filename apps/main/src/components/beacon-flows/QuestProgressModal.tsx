/**
 * QUEST PROGRESS MODAL
 * Multi-step XP journey tracker
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Map, Check, Lock, Zap, Trophy, Star } from 'lucide-react';
import { useState } from 'react';

interface QuestStep {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  current: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  totalXP: number;
  currentStep: number;
  totalSteps: number;
  steps: QuestStep[];
  reward?: {
    title: string;
    description: string;
    imageUrl?: string;
  };
}

interface QuestProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest?: Quest;
  stepXPEarned?: number;
}

export function QuestProgressModal({
  isOpen,
  onClose,
  quest,
  stepXPEarned = 0,
}: QuestProgressModalProps) {
  if (!isOpen || !quest) return null;

  const currentQuest = quest as Quest;

  const progress = (currentQuest.currentStep / currentQuest.totalSteps) * 100;
  const isComplete = currentQuest.currentStep === currentQuest.totalSteps;

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
              className="bg-black border-2 border-hotmess-orange rounded-2xl w-full max-w-lg overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="size-5 text-white" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-br from-hotmess-orange/20 to-hotmess-red/20 border-b border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-hotmess-orange/30 flex items-center justify-center">
                    <Map className="size-6 text-hotmess-orange" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[18px] font-bold text-white">
                      {quest.title}
                    </h3>
                    <p className="text-[13px] text-white/60">
                      {quest.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] text-white/60 uppercase tracking-wider">
                      Progress
                    </span>
                    <span className="text-[13px] font-bold text-hotmess-orange">
                      {quest.currentStep} / {quest.totalSteps} steps
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-hotmess-orange to-hotmess-red relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Total XP */}
                <div className="flex items-center justify-between mt-4 p-3 bg-black/30 rounded-lg">
                  <span className="text-[13px] text-white/60 uppercase tracking-wider">
                    Total Quest XP
                  </span>
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-hotmess-yellow" />
                    <span className="text-[18px] font-black text-hotmess-yellow">
                      {quest.totalXP} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Steps List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {quest.steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative pl-8 ${
                      index < quest.steps.length - 1 ? 'pb-6' : ''
                    }`}
                  >
                    {/* Connector Line */}
                    {index < quest.steps.length - 1 && (
                      <div 
                        className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                          step.completed 
                            ? 'bg-hotmess-orange' 
                            : 'bg-white/10'
                        }`}
                      />
                    )}

                    {/* Step Content */}
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        step.completed 
                          ? 'bg-hotmess-orange border-2 border-hotmess-orange' 
                          : step.current
                          ? 'bg-white/10 border-2 border-hotmess-orange animate-pulse'
                          : 'bg-white/5 border-2 border-white/20'
                      }`}>
                        {step.completed ? (
                          <Check className="size-4 text-white" />
                        ) : step.current ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-hotmess-orange"
                          />
                        ) : (
                          <Lock className="size-4 text-white/40" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`text-[15px] font-bold ${
                            step.completed || step.current 
                              ? 'text-white' 
                              : 'text-white/40'
                          }`}>
                            {step.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Zap className={`size-3 ${
                              step.completed 
                                ? 'text-hotmess-yellow' 
                                : 'text-white/40'
                            }`} />
                            <span className={`text-[13px] font-bold ${
                              step.completed 
                                ? 'text-hotmess-yellow' 
                                : 'text-white/40'
                            }`}>
                              +{step.xp}
                            </span>
                          </div>
                        </div>
                        <p className={`text-[13px] ${
                          step.completed || step.current 
                            ? 'text-white/60' 
                            : 'text-white/30'
                        }`}>
                          {step.description}
                        </p>
                        
                        {/* Current Step Indicator */}
                        {step.current && !step.completed && (
                          <div className="mt-2 px-3 py-1.5 bg-hotmess-orange/20 border border-hotmess-orange/40 rounded-lg inline-block">
                            <span className="text-[11px] font-bold text-hotmess-orange uppercase tracking-wider">
                              Current Step
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-6 space-y-4">
                {/* Step Completion Notification */}
                {stepXPEarned > 0 && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-br from-hotmess-yellow/20 to-hotmess-orange/20 border border-hotmess-yellow/30 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Zap className="size-5 text-hotmess-yellow" />
                      <span className="text-[20px] font-black text-hotmess-yellow">
                        +{stepXPEarned} XP
                      </span>
                    </div>
                    <p className="text-[12px] text-white/60 text-center">
                      Step completed!
                    </p>
                  </motion.div>
                )}

                {/* Final Reward Preview */}
                {quest.reward && !isComplete && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Trophy className="size-6 text-hotmess-yellow" />
                      <div className="flex-1">
                        <p className="text-[13px] text-white/60 uppercase tracking-wider mb-0.5">
                          Quest Reward
                        </p>
                        <p className="text-[14px] font-bold text-white">
                          {quest.reward.title}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Complete Quest Badge */}
                {isComplete && quest.reward && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-br from-hotmess-yellow/20 to-hotmess-orange/20 border-2 border-hotmess-yellow rounded-xl p-6 text-center"
                  >
                    <Trophy className="size-12 text-hotmess-yellow mx-auto mb-3" />
                    <h4 className="text-white mb-2">Quest Complete!</h4>
                    <p className="text-[14px] text-white/70 mb-4">
                      {quest.reward.description}
                    </p>
                    <button className="px-6 py-3 bg-hotmess-yellow hover:bg-hotmess-yellow/80 rounded-xl text-black font-bold uppercase tracking-wider transition-colors">
                      Claim Reward
                    </button>
                  </motion.div>
                )}

                {/* Continue Button */}
                <button
                  onClick={onClose}
                  className="w-full px-6 py-4 bg-hotmess-orange hover:bg-hotmess-orange/80 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                >
                  {isComplete ? 'Complete' : 'Continue'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
