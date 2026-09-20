import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

export function LoadingSkeleton({ count = 6 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const skeletons = containerRef.current.querySelectorAll('.skeleton-card')
    gsap.fromTo(
      skeletons,
      { opacity: 0.3, y: 10 },
      {
        opacity: 0.8,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      }
    )
  }, [count])

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx}
          className="skeleton-card bg-[#111216]/80 border border-[#23252a] rounded-2xl p-5 space-y-4 relative overflow-hidden"
        >
          {/* Animated scanner light sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

          {/* Top header line */}
          <div className="flex items-center justify-between pb-3 border-b border-[#23252a]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#23252a]" />
              <div className="w-20 h-3.5 rounded bg-[#23252a]" />
            </div>
            <div className="w-12 h-3 rounded bg-[#23252a]" />
          </div>

          {/* Main title & text */}
          <div className="space-y-2">
            <div className="w-3/4 h-4 rounded bg-[#272930]" />
            <div className="w-full h-3 rounded bg-[#1e2025]" />
            <div className="w-4/5 h-3 rounded bg-[#1e2025]" />
          </div>

          {/* Bottom line */}
          <div className="pt-3 border-t border-dashed border-[#23252a] flex items-center justify-between">
            <div className="w-16 h-3 rounded bg-[#23252a]" />
            <div className="w-12 h-4 rounded bg-[#272930]" />
          </div>
        </div>
      ))}
    </div>
  )
}
