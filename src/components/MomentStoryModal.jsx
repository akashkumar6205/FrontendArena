import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Sparkles, Clock, Calendar, GitMerge, CheckCircle2 } from 'lucide-react'
import confetti from 'canvas-confetti'

/**
 * Interactive step-by-step story modal walking through a synchronized Life Moment.
 * Culminates in celebratory confetti when reaching the moment revelation.
 */
export function MomentStoryModal({ moment, onClose }) {
  const [step, setStep] = useState(0)

  if (!moment) return null

  const items = moment.receipts || []
  const totalSteps = items.length + 1 // Receipt steps + final Revelation step

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1)
      if (step + 1 === totalSteps - 1) {
        // Trigger celebratory confetti on reveal
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    }
  }

  const handlePrev = () => {
    if (step > 0) setStep(prev => prev - 1)
  }

  const currentItem = items[step]
  const isFinalStep = step === items.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[500px]"
      >
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between z-10 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Life Moment Story
              </span>
              <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {moment.date}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-receipt font-bold text-white mt-2">
              {moment.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-card border border-dark-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-2 mb-8 z-10">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step 
                  ? 'w-8 bg-emerald-400 shadow-glow-emerald' 
                  : idx < step 
                    ? 'w-4 bg-emerald-600/50' 
                    : 'w-2 bg-dark-border'
              }`}
            />
          ))}
          <span className="text-[11px] font-mono text-gray-400 ml-auto">
            Step {step + 1} of {totalSteps}
          </span>
        </div>

        {/* Story Step Content */}
        <div className="flex-1 flex flex-col justify-center z-10 py-4">
          <AnimatePresence mode="wait">
            {!isFinalStep && currentItem ? (
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest px-3 py-1 rounded-lg bg-dark-card border border-dark-border">
                    {currentItem.type} record
                  </span>
                  <span className="text-sm font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <Clock className="w-4 h-4" />
                    {currentItem.time}
                  </span>
                </div>

                {/* Styled thermal receipt card view */}
                <div className="bg-gradient-to-b from-dark-card to-dark-paper border border-dark-border rounded-2xl p-6 shadow-xl relative">
                  <h3 className="text-xl font-receipt font-bold text-white mb-2">
                    {currentItem.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {currentItem.description}
                  </p>

                  {currentItem.amount && (
                    <div className="text-lg font-mono font-bold text-emerald-400">
                      Amount: ${currentItem.amount.toFixed(2)}
                    </div>
                  )}

                  {currentItem.location && (
                    <div className="text-xs font-mono text-cyan-400 mt-2">
                      📍 Location: {currentItem.location.name} ({currentItem.location.address})
                    </div>
                  )}

                  {/* Connection indicator */}
                  <div className="mt-4 pt-3 border-t border-dashed border-dark-border flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <GitMerge className="w-4 h-4" />
                    <span>Chronologically bound to next moment in sequence</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Final Revelation Step */
              <motion.div
                key="final-revelation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-emerald">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-1">
                    Discovery Complete
                  </span>
                  <h3 className="text-2xl font-receipt font-bold text-white">
                    What These Moments Reveal
                  </h3>
                </div>

                <div className="p-6 rounded-2xl bg-dark-card border border-emerald-500/30 text-left text-sm text-gray-200 leading-relaxed space-y-3 shadow-xl">
                  <p className="font-medium text-white">
                    {moment.summary}
                  </p>
                  <p className="text-xs text-gray-300 bg-dark-bg/80 p-4 rounded-xl border border-dark-border">
                    💡 <span className="font-semibold text-emerald-300">Data Connection:</span> {moment.revelation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between border-t border-dark-border pt-4 z-10">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              step === 0 
                ? 'opacity-40 cursor-not-allowed text-gray-400' 
                : 'text-gray-300 hover:text-white hover:bg-dark-card border border-dark-border'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {!isFinalStep ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-glow-emerald"
            >
              <span>Next Record</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-glow-emerald"
            >
              <span>Done Exploring</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
