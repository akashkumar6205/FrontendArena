import React, { useRef, useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import gsap from 'gsap'

export function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while rendering or loading data. Please try again.", 
  onRetry 
}) {
  const containerRef = useRef(null)
  const iconRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
      )
    }

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotate: [0, -8, 8, -4, 4, 0],
        duration: 0.8,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 2.5
      })
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="p-8 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center max-w-lg mx-auto shadow-2xl backdrop-blur-md space-y-4"
    >
      <div 
        ref={iconRef}
        className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto"
      >
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-white font-sans">
          {title}
        </h3>
        <p className="text-xs text-rose-300/80 mt-1 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs transition-all shadow-lg hover:shadow-rose-500/25 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  )
}
