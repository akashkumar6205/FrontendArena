import React from 'react'
import { Moon, Music, CreditCard, MapPin, Sparkles, TrendingUp } from 'lucide-react'

const ICON_MAP = {
  time: Moon,
  music: Music,
  finance: CreditCard,
  place: MapPin
}

const COLOR_MAP = {
  indigo: 'from-indigo-950/30 via-[#111215]/80 to-[#111215]/80 border-indigo-500/30 hover:border-indigo-500/60 text-indigo-400 hover:shadow-glow-violet/25',
  emerald: 'from-emerald-950/30 via-[#111215]/80 to-[#111215]/80 border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:shadow-glow-emerald/25',
  amber: 'from-amber-950/35 via-[#111215]/80 to-[#111215]/80 border-amber-500/30 hover:border-amber-500/60 text-amber-400 hover:shadow-glow-amber/25',
  cyan: 'from-cyan-950/30 via-[#111215]/80 to-[#111215]/80 border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:shadow-glow-cyan/25'
}

/**
 * InsightCard component rendering an empirical behavioral pattern
 * with glassmorphism, accent glow, and hover micro-interactions.
 */
export function InsightCard({ insight }) {
  const IconComponent = ICON_MAP[insight.type] || Sparkles
  const colorStyles = COLOR_MAP[insight.accentColor] || COLOR_MAP.amber

  return (
    <div className={`glass-card relative bg-gradient-to-br ${colorStyles} border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-xl group overflow-hidden`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full glass-pill text-zinc-300 flex items-center gap-1.5 shadow-sm">
            <IconComponent className="w-3.5 h-3.5 text-amber-400" />
            {insight.badge}
          </span>

          <div className="text-right">
            <div className="font-sans font-bold text-xl text-white group-hover:text-amber-300 transition-colors">
              {insight.stat}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              {insight.statLabel}
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-amber-200 transition-colors">
          {insight.title}
        </h3>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {insight.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          Empirical Data Discovery
        </span>
        <span className="text-zinc-500 font-medium">Verified</span>
      </div>
    </div>
  )
}
