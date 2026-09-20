import { Music, CreditCard, Receipt, MapPin, FileText, Sparkles } from 'lucide-react'

/**
 * Global Category to Icon mapping for all receipt types.
 */
export const ICON_MAP = {
  music: Music,
  purchase: CreditCard,
  expense: Receipt,
  place: MapPin,
  note: FileText,
  moment: Sparkles
}

/**
 * Global Color Themes for UI elements, cards, badges, and glows.
 */
export const COLOR_THEMES = {
  music: {
    bg: 'from-purple-950/40 to-dark-card',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    accent: 'text-purple-400',
    nodeBorder: 'border-purple-500/50',
    nodeBg: 'bg-purple-950/80',
    glow: 'hover:shadow-glow-violet'
  },
  purchase: {
    bg: 'from-emerald-950/40 to-dark-card',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accent: 'text-emerald-400',
    nodeBorder: 'border-emerald-500/50',
    nodeBg: 'bg-emerald-950/80',
    glow: 'hover:shadow-glow-emerald'
  },
  expense: {
    bg: 'from-amber-950/40 to-dark-card',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accent: 'text-amber-400',
    nodeBorder: 'border-amber-500/50',
    nodeBg: 'bg-amber-950/80',
    glow: 'hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]'
  },
  place: {
    bg: 'from-cyan-950/40 to-dark-card',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    accent: 'text-cyan-400',
    nodeBorder: 'border-cyan-500/50',
    nodeBg: 'bg-cyan-950/80',
    glow: 'hover:shadow-glow-cyan'
  },
  note: {
    bg: 'from-indigo-950/40 to-dark-card',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    accent: 'text-indigo-400',
    nodeBorder: 'border-indigo-500/50',
    nodeBg: 'bg-indigo-950/80',
    glow: 'hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)]'
  },
  moment: {
    bg: 'from-amber-950/40 to-dark-card',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accent: 'text-amber-400',
    nodeBorder: 'border-amber-500/50',
    nodeBg: 'bg-amber-950/80',
    glow: 'hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)]'
  }
}

/**
 * Hex integer colors for Three.js 3D WebGL meshes and particle lights.
 */
export const TYPE_COLORS_INT = {
  music: 0x8b5cf6,    // Violet
  purchase: 0x10b981, // Emerald
  expense: 0xec4899,  // Pink
  place: 0x06b6d4,    // Cyan
  note: 0x6366f1,     // Indigo
  moment: 0xf59e0b    // Amber
}
