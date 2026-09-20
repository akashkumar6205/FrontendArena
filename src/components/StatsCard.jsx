import React from 'react'
import { motion } from 'framer-motion'
import { Receipt, GitMerge, Sparkles, Layers } from 'lucide-react'

const ICON_MAP = {
  receipts: Receipt,
  connections: GitMerge,
  moments: Sparkles,
  categories: Layers
}

const COLOR_MAP = {
  emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  indigo: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
  amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
}

export function StatsCard({ label, value, subtext, type = 'receipts', color = 'emerald' }) {
  const IconComponent = ICON_MAP[type] || Receipt
  const colorStyles = COLOR_MAP[color] || COLOR_MAP.emerald

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 font-semibold">
          {label}
        </span>
        <div className={`p-2 rounded-xl border ${colorStyles}`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="font-receipt font-bold text-3xl sm:text-4xl text-white tracking-tight group-hover:text-emerald-300 transition-colors">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.span>
      </div>

      <div className="text-xs text-gray-400 mt-1 font-mono">
        {subtext}
      </div>
    </div>
  )
}
