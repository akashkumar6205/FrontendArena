import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ConnectionGraph } from '../components/ConnectionGraph'
import { ErrorState } from '../components/ErrorState'
import { GitMerge, Sparkles, CheckCircle2, ArrowRight, Share2 } from 'lucide-react'

export function Connections({ receipts = [], connections = [], onSelectReceipt }) {
  const cardsContainerRef = useRef(null)

  useEffect(() => {
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll('.connection-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      )
    }
  }, [connections.length])

  if (!connections || connections.length === 0) {
    return (
      <div className="space-y-8 pb-16">
        <div className="border-b border-dark-border pb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <GitMerge className="w-3.5 h-3.5" />
            Relationship Discovery Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-receipt font-bold text-white">
            Connect the Dots
          </h1>
        </div>

        <div className="text-center py-16 p-8 bg-dark-card border border-dark-border rounded-3xl space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#15171c] border border-dark-border text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            <Share2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">No Connections Discovered</h3>
          <p className="text-xs text-gray-400">
            No relationships matched the current temporal or proximity heuristics.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="border-b border-dark-border pb-6">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
          <GitMerge className="w-3.5 h-3.5" />
          Relationship Discovery Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-receipt font-bold text-white">
          Connect the Dots
        </h1>
        <p className="text-xs text-gray-400 mt-1 max-w-2xl">
          Visualizing hidden relationships across time, geography, music listening, transactions, and digital notes with interactive graph mechanics.
        </p>
      </div>

      {/* Interactive React Flow Graph */}
      <section>
        <ConnectionGraph
          receipts={receipts}
          connections={connections}
          onSelectReceipt={onSelectReceipt}
        />
      </section>

      {/* Discovered Connections List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-dark-border pb-3">
          <h2 className="text-xl font-receipt font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Top Discovered Relationships ({connections.length})
          </h2>
          <span className="text-xs font-mono text-gray-400">
            Ranked by Scored Proximity
          </span>
        </div>

        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.slice(0, 8).map((conn, idx) => (
            <div
              key={idx}
              onClick={() => onSelectReceipt(conn.r1)}
              className="connection-card p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-glow-emerald/20 shadow-xl space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold uppercase ${
                  conn.score >= 6 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {conn.strength}
                </span>

                <span className="text-xs font-mono font-bold text-white">
                  Score: +{conn.score}
                </span>
              </div>

              {/* Connected receipt pair */}
              <div className="flex items-center justify-between gap-2 text-xs font-receipt font-bold text-white">
                <span className="truncate group-hover:text-emerald-300 transition-colors">
                  {conn.r1.title}
                </span>
                <GitMerge className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate group-hover:text-emerald-300 transition-colors">
                  {conn.r2.title}
                </span>
              </div>

              {/* Reasons list */}
              <div className="pt-2 border-t border-dark-border/60 text-[11px] font-mono text-gray-400 space-y-1">
                {conn.reasons.map((r, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span className="flex items-center gap-1">
                  Inspect Moment <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
