import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { Receipt, GitMerge, Sparkles, Layers } from 'lucide-react'

const ICON_MAP = {
  receipts: Receipt,
  connections: GitMerge,
  moments: Sparkles,
  categories: Layers
}

const COLOR_MAP = {
  emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-glow-emerald/20',
  indigo: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10 shadow-glow-violet/20',
  amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-glow-amber/20',
  cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shadow-glow-cyan/20'
}

/**
 * StatsCard renders a KPI metric with glassmorphism, spotlight illumination,
 * GSAP numerical roll-up counters, and tactile 3D elevation on hover.
 */
export function StatsCard({ label, value, subtext, type = 'receipts', color = 'emerald' }) {
  const cardRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [displayedValue, setDisplayedValue] = useState(value)
  const IconComponent = ICON_MAP[type] || Receipt
  const colorStyles = COLOR_MAP[color] || COLOR_MAP.emerald

  // GSAP Animated Numerical Counter Roll-Up
  useEffect(() => {
    const rawStr = String(value || '')
    const match = rawStr.match(/^(\d+)(.*)$/)

    if (match) {
      const targetNum = parseInt(match[1], 10)
      const suffix = match[2]
      const countObj = { val: 0 }

      const tween = gsap.to(countObj, {
        val: targetNum,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          setDisplayedValue(`${Math.round(countObj.val)}${suffix}`)
        }
      })

      return () => tween.kill()
    } else {
      setDisplayedValue(value)
    }
  }, [value])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseEnter = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      scale: 1.03,
      y: -4,
      duration: 0.25,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out'
    })
  }

  const handleMouseDown = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      scale: 0.98,
      duration: 0.1,
      ease: 'power2.out'
    })
  }

  const handleMouseUp = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      scale: 1.03,
      duration: 0.15,
      ease: 'power2.out'
    })
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="glass-card rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors cursor-pointer select-none"
    >
      {/* Spotlight Hover Glow */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 75%)`
        }}
      />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
          {label}
        </span>
        <div className={`p-2 rounded-xl border ${colorStyles} transition-transform group-hover:scale-110 shadow-sm`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight group-hover:text-emerald-300 transition-colors relative z-10">
        {displayedValue}
      </div>

      <div className="text-xs text-zinc-400 mt-1 font-mono relative z-10">
        {subtext}
      </div>
    </div>
  )
}
