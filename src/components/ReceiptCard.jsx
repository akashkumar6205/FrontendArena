import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { FileText, GitMerge, ArrowRight, Clock, Calendar } from 'lucide-react'
import { ICON_MAP, COLOR_THEMES } from '../constants/theme'

/**
 * ReceiptCard component representing a single normalized receipt item.
 * Features glassmorphism, dynamic cursor spotlight highlight, GSAP 3D perspective tilt,
 * and a tactile scale punch on click.
 *
 * @param {Object} props
 * @param {Object} props.receipt - The normalized receipt object
 * @param {number} props.connectionCount - Number of discovered links for this receipt
 * @param {Function} props.onClick - Click callback to inspect this receipt
 * @param {Function} props.onSelectMoment - Click callback to open connected moment story
 */
export function ReceiptCard({ receipt, connectionCount = 0, onClick, onSelectMoment }) {
  const cardRef = useRef(null)
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 })
  const IconComponent = ICON_MAP[receipt.type] || FileText
  const theme = COLOR_THEMES[receipt.type] || COLOR_THEMES.note

  // GSAP 3D Card Tilt & Spotlight on Mouse Move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    
    setSpotlightPos({ x: offsetX, y: offsetY })

    const centerX = offsetX - rect.width / 2
    const centerY = offsetY - rect.height / 2
    
    // Calculate tilt angles based on cursor offset from card center
    const rotateX = -(centerY / rect.height) * 12
    const rotateY = (centerX / rect.width) * 12

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1.02,
      duration: 0.25,
      ease: 'power1.out',
      transformPerspective: 800
    })
  }

  // Restore Card rotation and scale on Mouse Leave
  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  // Tactile Click Punch Animation
  const handleClick = () => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.96 },
        { scale: 1, duration: 0.25, ease: 'back.out(2)' }
      )
    }
    if (onClick) onClick(receipt)
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`glass-card group relative rounded-2xl p-5 cursor-pointer will-change-transform flex flex-col justify-between shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/40`}
    >
      {/* Dynamic Cursor Spotlight Highlight */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(16, 185, 129, 0.14), transparent 75%)`
        }}
      />

      {/* Receipt Top Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg bg-black/40 border border-white/10 ${theme.accent}`}>
              <IconComponent className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              {receipt.type} RECEIPT
            </span>
          </div>
          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            {receipt.time}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-receipt font-bold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors line-clamp-1">
          {receipt.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {receipt.description}
        </p>

        {/* Metadata section (Amount or Details) */}
        <div className="mt-4 pt-3 border-t border-dashed border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
            <Calendar className="w-3 h-3 text-gray-400" />
            {receipt.date}
          </div>

          {receipt.amount !== null && (
            <div className="font-mono font-bold text-sm text-emerald-400">
              ${receipt.amount.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Connected indicator & Footer action */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
        {connectionCount > 0 ? (
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${theme.badge}`}>
            <GitMerge className="w-3 h-3" />
            {connectionCount} {connectionCount === 1 ? 'connection' : 'connections'}
          </span>
        ) : (
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wide">
            {receipt.category}
          </span>
        )}

        <button 
          onClick={(e) => {
            e.stopPropagation()
            if (onSelectMoment && connectionCount > 0) {
              onSelectMoment(receipt)
            } else if (onClick) {
              onClick(receipt)
            }
          }}
          className={`text-xs font-semibold flex items-center gap-1 ${theme.accent} group-hover:translate-x-1 transition-transform`}
        >
          <span>{connectionCount > 0 ? 'View Moment' : 'Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Decorative receipt barcode at bottom */}
      <div className="mt-3 pt-2 border-t border-dashed border-white/10 flex justify-between items-center opacity-30 group-hover:opacity-75 transition-opacity relative z-10">
        <div className="h-3 w-full bg-[repeating-linear-gradient(90deg,#9ca3af,#9ca3af_2px,transparent_2px,transparent_4px)]" />
        <span className="text-[9px] font-mono text-gray-400 ml-2 uppercase">
          #{receipt.id}
        </span>
      </div>
    </div>
  )
}
