import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { InsightCard } from '../InsightCard'

/**
 * PatternDiscoveries renders algorithmic behavioral discoveries and habit insights.
 *
 * @param {Object} props
 * @param {Array<Object>} props.insights - Factual behavioral insights
 */
export function PatternDiscoveries({ insights = [] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#23252a] pb-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-widest block mb-1">
            Pattern Recognition
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
            Things We Discovered
          </h2>
        </div>

        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          100% Empirical Data
        </span>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </section>
  )
}
