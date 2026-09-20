import React from 'react'
import { ArrowUpRight, Clock } from 'lucide-react'

/**
 * FeaturedMoments renders high-density synchronized life moment cards on the Home page.
 *
 * @param {Object} props
 * @param {Array<Object>} props.moments - Synchronized Life Moments
 * @param {Function} props.onNavigate - Page navigation callback
 * @param {Function} props.onOpenMoment - Moment story opener callback
 */
export function FeaturedMoments({ moments = [], onNavigate, onOpenMoment }) {
  return (
    <section className="max-w-6xl mx-auto px-4 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#23252a] pb-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-widest block mb-1">
            Connect the Dots
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
            Featured Life Moments
          </h2>
        </div>

        <button
          onClick={() => onNavigate('chapters')}
          className="text-xs font-mono text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 transition-colors"
        >
          <span>View All Chapters</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Featured Moment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {moments.slice(0, 3).map((moment) => (
          <FeaturedMomentCard 
            key={moment.id} 
            moment={moment} 
            onOpenMoment={onOpenMoment} 
          />
        ))}
      </div>
    </section>
  )
}

/**
 * FeaturedMomentCard component with glassmorphism, spotlight illumination,
 * and GSAP hover physics.
 */
function FeaturedMomentCard({ moment, onOpenMoment }) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
  const cardRef = React.useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={() => onOpenMoment && onOpenMoment(moment)}
      className="glass-card border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group relative overflow-hidden active:scale-[0.98]"
    >
      {/* Spotlight Cursor Glow */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(260px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.09), transparent 75%)`
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
            {moment.receipts.length} Connected Receipts
          </span>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            {moment.durationMins} mins
          </span>
        </div>

        <h3 className="font-sans font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
          {moment.title}
        </h3>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-3">
          {moment.summary}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-400 relative z-10">
        <span>Play Moment Story</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  )
}
