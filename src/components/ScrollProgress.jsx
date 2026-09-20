import React, { useState, useEffect } from 'react'

/**
 * ScrollProgress renders a sleek glassmorphic progress bar at the top of the viewport
 * that dynamically animates as the user scrolls down the page.
 */
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100
        setScrollProgress(currentProgress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-white/5 pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-500 transition-all duration-75 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
