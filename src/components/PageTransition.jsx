import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

export function PageTransition({ children, activeKey }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out'
      }
    )
  }, [activeKey])

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  )
}
