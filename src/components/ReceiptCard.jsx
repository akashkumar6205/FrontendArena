import React from 'react'
import { Music, CreditCard, Receipt, MapPin, FileText, GitMerge, ArrowRight, Clock, Calendar } from 'lucide-react'

const ICON_MAP = {
  music: Music,
  purchase: CreditCard,
  expense: Receipt,
  place: MapPin,
  note: FileText
}

const COLOR_THEMES = {
  music: {
    bg: 'from-purple-950/40 to-dark-card',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    accent: 'text-purple-400',
    glow: 'hover:shadow-glow-violet'
  },
  purchase: {
    bg: 'from-emerald-950/40 to-dark-card',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accent: 'text-emerald-400',
    glow: 'hover:shadow-glow-emerald'
  },
  expense: {
    bg: 'from-amber-950/40 to-dark-card',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accent: 'text-amber-400',
    glow: 'hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]'
  },
  place: {
    bg: 'from-cyan-950/40 to-dark-card',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    accent: 'text-cyan-400',
    glow: 'hover:shadow-glow-cyan'
  },
  note: {
    bg: 'from-indigo-950/40 to-dark-card',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    accent: 'text-indigo-400',
    glow: 'hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)]'
  }
}

export function ReceiptCard({ receipt, connectionCount = 0, onClick, onSelectMoment }) {
  const IconComponent = ICON_MAP[receipt.type] || FileText
  const theme = COLOR_THEMES[receipt.type] || COLOR_THEMES.note

  return (
    <div 
      onClick={() => onClick && onClick(receipt)}
      className={`group relative bg-gradient-to-b ${theme.bg} border ${theme.border} rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${theme.glow} flex flex-col justify-between`}
    >
      {/* Receipt Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-dark-border/80">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg bg-dark-bg/80 border ${theme.border} ${theme.accent}`}>
              <IconComponent className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              {receipt.type} RECEIPT
            </span>
          </div>
          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            {receipt.time}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-receipt font-bold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors line-clamp-1">
          {receipt.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {receipt.description}
        </p>

        {/* Metadata section (Amount or Details) */}
        <div className="mt-4 pt-3 border-t border-dashed border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
            <Calendar className="w-3 h-3 text-gray-400" />
            {receipt.date}
          </div>

          {receipt.amount !== null && (
            <div className="font-mono font-bold text-sm text-emerald-400">
              ${receipt.amount.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Connected indicator & Footer action */}
      <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-between">
        {connectionCount > 0 ? (
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${theme.badge}`}>
            <GitMerge className="w-3 h-3" />
            {connectionCount} {connectionCount === 1 ? 'connection' : 'connections'}
          </span>
        ) : (
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wide">
            {receipt.category}
          </span>
        )}

        <button 
          onClick={(e) => {
            e.stopPropagation()
            if (onSelectMoment && connectionCount > 0) {
              onSelectMoment(receipt)
            } else if (onClick) {
              onClick(receipt)
            }
          }}
          className={`text-xs font-semibold flex items-center gap-1 ${theme.accent} group-hover:translate-x-1 transition-transform`}
        >
          <span>{connectionCount > 0 ? 'View Moment' : 'Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Decorative receipt barcode at bottom */}
      <div className="mt-3 pt-2 border-t border-dashed border-dark-border/40 flex justify-between items-center opacity-30 group-hover:opacity-70 transition-opacity">
        <div className="h-3 w-full bg-[repeating-linear-gradient(90deg,#9ca3af,#9ca3af_2px,transparent_2px,transparent_4px)]" />
        <span className="text-[9px] font-mono text-gray-400 ml-2 uppercase">
          #{receipt.id}
        </span>
      </div>
    </div>
  )
}
