import React from 'react'
import { Calendar, Compass, Moon, BookOpen, ArrowRight, Sparkles, MapPin, Layers } from 'lucide-react'

const ICON_MAP = {
  Moon: Moon,
  BookOpen: BookOpen,
  Compass: Compass
}

export function ChapterCard({ chapter, onOpenMoment }) {
  const IconComponent = ICON_MAP[chapter.icon] || Compass

  return (
    <div className="relative bg-gradient-to-b from-dark-card to-dark-paper border border-dark-border rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-emerald-500/40">
      
      {/* Chapter Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shrink-0"
            style={{ backgroundColor: `${chapter.themeColor}20`, border: `1px solid ${chapter.themeColor}50`, color: chapter.themeColor }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {chapter.dateRange}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-receipt font-bold text-white mt-1">
              {chapter.title}
            </h2>
          </div>
        </div>

        <button
          onClick={() => onOpenMoment && onOpenMoment(chapter.highlightMoment)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-glow-emerald shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore Era Story</span>
        </button>
      </div>

      {/* Subtitle & Narrative Summary */}
      <div className="py-5 space-y-3">
        <p className="text-sm font-medium text-gray-200 leading-relaxed">
          "{chapter.subtitle}"
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">
          {chapter.summary}
        </p>
      </div>

      {/* Key Era Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-4 rounded-2xl bg-dark-bg/80 border border-dark-border">
        <div>
          <div className="text-[10px] font-mono text-gray-400 uppercase">
            Receipts Tracked
          </div>
          <div className="text-lg font-receipt font-bold text-white mt-0.5">
            {chapter.stats.receiptsCount}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-gray-400 uppercase">
            Strong Bonds
          </div>
          <div className="text-lg font-receipt font-bold text-emerald-400 mt-0.5">
            {chapter.stats.strongConnections}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-gray-400 uppercase">
            Top Category
          </div>
          <div className="text-xs font-mono text-gray-200 mt-1 truncate">
            {chapter.stats.dominantCategory}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-gray-400 uppercase">
            Primary Location
          </div>
          <div className="text-xs font-mono text-cyan-400 mt-1 truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            {chapter.stats.topLocation}
          </div>
        </div>
      </div>

      {/* Key Receipts Horizontal Reel */}
      <div className="mt-6 pt-4 border-t border-dark-border">
        <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Representative Records in Chapter
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {chapter.keyReceipts.map((r) => (
            <div 
              key={r.id}
              className="px-3 py-2 rounded-xl bg-dark-bg border border-dark-border hover:border-emerald-500/40 min-w-[170px] shrink-0 text-left"
            >
              <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                {r.type}
              </div>
              <div className="text-xs font-receipt font-bold text-white truncate mt-0.5">
                {r.title}
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                {r.date} — {r.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
