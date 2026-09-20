import React from 'react'
import { ChapterCard } from '../components/ChapterCard'
import { BookOpen } from 'lucide-react'

/**
 * Chapters page view controller.
 * Displays chronologically synthesized narrative eras with life themes and metrics.
 */
export function Chapters({ chapters, onOpenMoment }) {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="border-b border-dark-border pb-6">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Data-Driven Storytelling
        </span>
        <h1 className="text-3xl sm:text-4xl font-receipt font-bold text-white">
          Life Chapters & Narrative Eras
        </h1>
        <p className="text-xs text-gray-400 mt-1 max-w-2xl">
          Meaningful activity periods derived automatically from timestamp patterns, music vibes, spending habits, and notes.
        </p>
      </div>

      {/* Chapter Cards List */}
      <div className="space-y-8">
        {chapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            onOpenMoment={onOpenMoment}
          />
        ))}
      </div>
    </div>
  )
}
