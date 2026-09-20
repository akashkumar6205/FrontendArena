import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ArrowRight, GitMerge, Sparkles } from 'lucide-react'

/**
 * HeroSection component for the Home page.
 * Enhanced with modern GSAP animations:
 * - Orchestrated timeline entrance for eyebrow, headline, and subtitle
 * - GSAP magnetic physics on CTA buttons (smooth cursor attraction & elastic spring return)
 * - Sinusoidal floating ambient glow orbs
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Page navigation callback
 */
export function HeroSection({ onNavigate }) {
  const containerRef = useRef(null)
  const badgeRef = useRef(null)
  const headlineRef = useRef(null)
  const subtitleRef = useRef(null)
  const actionsRef = useRef(null)
  const primaryBtnRef = useRef(null)
  const secondaryBtnRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Orchestrated Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 }
      )
      .fromTo(
        headlineRef.current,
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
        '-=0.4'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )
      .fromTo(
        actionsRef.current?.children || [],
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' },
        '-=0.4'
      )

      // 2. Ambient Floating Orbs GSAP Animation
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 25,
          y: -18,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -25,
          y: 20,
          scale: 1.08,
          duration: 6.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.8
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // GSAP Magnetic Button Effect Helper
  const attachMagneticEffect = (btnRef) => {
    if (!btnRef.current) return {}

    const handleMouseMove = (e) => {
      const rect = btnRef.current.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)

      gsap.to(btnRef.current, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(btnRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      })
    }

    return { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
  }

  const primaryMagnetic = attachMagneticEffect(primaryBtnRef)
  const secondaryMagnetic = attachMagneticEffect(secondaryBtnRef)

  return (
    <section ref={containerRef} className="relative pt-8 sm:pt-14 text-center max-w-6xl mx-auto px-4">
      {/* GSAP-Driven Floating Ambient Glass Orbs */}
      <div 
        ref={orb1Ref}
        className="absolute top-10 left-1/4 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        ref={orb2Ref}
        className="absolute top-20 right-1/4 translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" 
      />

      {/* Specular Top Lighting Reflection pill above Title */}
      <div className="mx-auto w-48 sm:w-96 h-10 bg-white/20 blur-2xl rounded-full mb-[-25px] pointer-events-none" />

      {/* Floating Eyebrow Pill */}
      <div
        ref={badgeRef}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-mono text-zinc-300 mb-6 shadow-sm cursor-default select-none transition-all hover:border-emerald-500/40"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Contextual Life Intelligence Engine</span>
      </div>

      {/* Hero Headline & Subtitle */}
      <div className="space-y-6">
        <h1 
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-sans font-bold tracking-tight text-white leading-[1.08] max-w-5xl mx-auto"
        >
          Your Life, In Receipts <br />
          <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
            One Story to Discover
          </span>
        </h1>

        <p 
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Hundreds of disconnected digital records — music streams, coffee runs, transactions, notes, and check-ins — transformed into one interactive personal archive.
        </p>
      </div>

      {/* Hero Action Buttons with GSAP Magnetic Interaction */}
      <div
        ref={actionsRef}
        className="flex flex-row items-center justify-center gap-3 pt-6 pb-2"
      >
        {/* Primary Magnetic CTA */}
        <button
          ref={primaryBtnRef}
          {...primaryMagnetic}
          onClick={() => onNavigate('explore')}
          className="group relative px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-sm transition-shadow duration-300 shadow-lg hover:shadow-white/25 active:scale-95 flex items-center gap-2 will-change-transform"
        >
          <span>Explore the Story</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary Magnetic CTA */}
        <button
          ref={secondaryBtnRef}
          {...secondaryMagnetic}
          onClick={() => onNavigate('connections')}
          className="group px-5 py-2.5 rounded-xl glass-pill hover:bg-white/10 text-zinc-100 font-medium text-sm transition-colors duration-300 flex items-center gap-2 shadow-sm hover:border-emerald-500/40 active:scale-95 will-change-transform"
        >
          <GitMerge className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span>Connect the Dots</span>
        </button>
      </div>
    </section>
  )
}
