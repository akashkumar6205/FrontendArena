import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, GitMerge } from 'lucide-react'

/**
 * HeroSection component for the Home page.
 * Features specular top lighting, headline typography, and primary CTA buttons.
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Page navigation callback
 */
export function HeroSection({ onNavigate }) {
  return (
    <section className="relative pt-8 sm:pt-14 text-center max-w-6xl mx-auto px-4">
      {/* Specular Top Lighting Reflection pill above Title */}
      <div className="mx-auto w-48 sm:w-96 h-10 bg-white/20 blur-2xl rounded-full mb-[-25px] pointer-events-none" />

      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-sans font-bold tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
          Your Life, In Receipts <br />
          <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
            One Story to Discover
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed font-normal">
          Hundreds of disconnected digital records — music streams, coffee runs, transactions, notes, and check-ins — transformed into one interactive personal archive.
        </p>
      </motion.div>

      {/* Hero Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex flex-row items-center justify-center gap-3 pt-6 pb-2"
      >
        {/* Primary CTA */}
        <button
          onClick={() => onNavigate('explore')}
          className="px-6 py-2.5 rounded-lg bg-[#E5E7EB] hover:bg-white text-zinc-900 font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <span>Explore the Story</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary CTA */}
        <button
          onClick={() => onNavigate('connections')}
          className="px-5 py-2.5 rounded-lg bg-[#22242a]/80 hover:bg-[#2d3038] border border-zinc-700/60 text-zinc-100 font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
        >
          <GitMerge className="w-4 h-4 text-zinc-300" />
          <span>Connect the Dots</span>
        </button>
      </motion.div>
    </section>
  )
}
