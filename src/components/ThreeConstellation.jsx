import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Sparkles, RotateCcw, ZoomIn, ZoomOut, AlertCircle, RefreshCw } from 'lucide-react'
import { ConstellationEngine } from '../engine/ConstellationEngine'

/**
 * ThreeConstellation acts as the React UI wrapper around the Three.js WebGL ConstellationEngine.
 * Manages category filters, HUD controls, floating tooltips, loading/empty/error states,
 * and delegates all WebGL 3D rendering and physics to the dedicated Three.js engine.
 *
 * @param {Object} props
 * @param {Array<Object>} props.receipts - Normalized life receipt records
 * @param {Array<Object>} props.connections - Scored connection bonds
 * @param {Function} props.onSelectReceipt - Receipt selection callback
 * @param {Function} props.onOpenGraph - Graph navigation callback
 */
export function ThreeConstellation({
  receipts = [],
  connections = [],
  onSelectReceipt,
  onOpenGraph
}) {
  const mountRef = useRef(null)
  const engineRef = useRef(null)

  // UI State
  const [isLoading, setIsLoading] = useState(true)
  const [webglError, setWebglError] = useState(null)
  const [hoveredData, setHoveredData] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Available Category Filters
  const filterCategories = ['all', 'music', 'purchase', 'place', 'note', 'expense']

  // Filtered dataset for constellation nodes
  const activeReceipts = useMemo(() => {
    if (selectedFilter === 'all') return receipts.slice(0, 32)
    return receipts.filter(r => r.type === selectedFilter || r.category?.toLowerCase() === selectedFilter).slice(0, 32)
  }, [receipts, selectedFilter])

  // Initialize the Three.js Constellation Engine
  const startEngine = useCallback(() => {
    if (!mountRef.current) return

    try {
      setIsLoading(true)
      setWebglError(null)

      // Dispose any prior engine instance
      if (engineRef.current) {
        engineRef.current.dispose()
        engineRef.current = null
      }

      // Instantiate dedicated Three.js Engine
      const engine = new ConstellationEngine(mountRef.current, {
        onHover: (receipt) => {
          setHoveredData(receipt)
        },
        onSelect: (receipt) => {
          if (onSelectReceipt) {
            onSelectReceipt(receipt)
          }
        }
      })

      engineRef.current = engine

      // Hydrate with active data
      engine.updateData({ receipts: activeReceipts, connections })

      // Brief smooth transition out of loading
      setTimeout(() => setIsLoading(false), 200)

    } catch (err) {
      console.error('Three.js Engine Initialization Error:', err)
      setWebglError('Unable to initialize WebGL context. Please check hardware acceleration or browser compatibility.')
      setIsLoading(false)
    }
  }, [activeReceipts, connections, onSelectReceipt])

  // Mount engine on canvas container
  useEffect(() => {
    startEngine()

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose()
        engineRef.current = null
      }
    }
  }, [startEngine])

  // Update Three.js engine whenever active receipts or connections change
  useEffect(() => {
    if (engineRef.current && !isLoading && !webglError) {
      engineRef.current.updateData({ receipts: activeReceipts, connections })
    }
  }, [activeReceipts, connections, isLoading, webglError])

  // Pointer Event Forwarders to Three.js Engine
  const handlePointerMove = (e) => {
    if (!mountRef.current || !engineRef.current) return
    const rect = mountRef.current.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    engineRef.current.handlePointerMove(e.clientX, e.clientY)
  }

  const handlePointerDown = (e) => {
    if (engineRef.current) {
      engineRef.current.handlePointerDown(e.clientX, e.clientY)
    }
  }

  const handlePointerUp = () => {
    if (engineRef.current) {
      engineRef.current.handlePointerUp()
    }
  }

  const handleClick = (e) => {
    if (engineRef.current) {
      engineRef.current.handleClick(e.clientX, e.clientY)
    }
  }

  // Camera HUD actions
  const handleZoom = (direction) => {
    if (engineRef.current) {
      engineRef.current.zoom(direction)
    }
  }

  const handleResetCamera = () => {
    if (engineRef.current) {
      engineRef.current.resetCamera()
    }
  }

  return (
    <div className="relative w-full rounded-3xl glass-panel border border-white/10 p-4 sm:p-6 overflow-hidden shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial-at-c from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Top Header Bar & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3 h-3" />
              Three.js 3D Engine
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {activeReceipts.length} Constellation Nodes
            </span>
          </div>
          <h3 className="text-lg font-sans font-bold text-white mt-1">
            Interactive Celestial Archive
          </h3>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 glass-pill p-1 rounded-xl">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all duration-200 active:scale-95 ${
                selectedFilter === cat
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-[#060709] shadow-inner">
        
        {/* Loading State: WebGL Loader */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#090a0d]/90 backdrop-blur-md space-y-3">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Initializing Celestial Constellation...
            </div>
            <div className="text-[11px] text-zinc-500">
              Generating WebGL particle system and 3D node coordinates
            </div>
          </div>
        )}

        {/* Error State: WebGL Fallback */}
        {webglError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#090a0d] p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="max-w-sm">
              <h4 className="text-sm font-bold text-white font-sans">WebGL Canvas Error</h4>
              <p className="text-xs text-rose-300/80 mt-1">{webglError}</p>
            </div>
            <button
              onClick={startEngine}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry WebGL Engine</span>
            </button>
          </div>
        )}

        {/* Empty State: Zero Nodes for selected category */}
        {!isLoading && !webglError && activeReceipts.length === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#090a0d]/80 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl glass-card border border-white/10 text-zinc-400 flex items-center justify-center text-xl">
              🌌
            </div>
            <h4 className="text-sm font-bold text-white">No Celestial Nodes in Sector</h4>
            <p className="text-xs text-zinc-400 max-w-xs">
              There are no receipts in the "{selectedFilter}" category. Clear filter to view all constellation nodes.
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-glow-emerald active:scale-95"
            >
              Reset Sector Filter
            </button>
          </div>
        )}

        {/* The Three.js WebGL Mount Element */}
        <div
          ref={mountRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        />

        {/* Floating 3D Tooltip on Hover */}
        {hoveredData && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-xl glass-panel border border-emerald-500/40 shadow-2xl backdrop-blur-2xl text-left min-w-[180px] max-w-xs transition-all duration-75"
            style={{
              left: `${Math.max(100, Math.min(tooltipPos.x, (mountRef.current?.clientWidth || 600) - 100))}px`,
              top: `${Math.max(60, tooltipPos.y)}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-white/10 text-[10px] font-mono">
              <span className="text-emerald-400 uppercase font-bold">{hoveredData.type}</span>
              <span className="text-zinc-400">{hoveredData.time}</span>
            </div>
            <div className="text-xs font-bold text-white truncate">
              {hoveredData.title}
            </div>
            <div className="text-[11px] text-zinc-400 truncate mt-0.5">
              {hoveredData.category} • {hoveredData.date}
            </div>
            <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
              <span>Click to inspect node</span>
              <span>→</span>
            </div>
          </div>
        )}

        {/* Camera HUD Controls (Zoom In, Zoom Out, Reset Center) */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 glass-panel border border-white/15 p-1.5 rounded-xl backdrop-blur-md shadow-lg">
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-white/10 transition-colors active:scale-95"
            title="Reset Camera Orientation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Orbit Guidance Badge */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 glass-pill px-2.5 py-1 rounded-lg border border-white/10">
          <span>Drag to rotate 3D orbit</span>
          <span>•</span>
          <span>Click node to fly & inspect</span>
        </div>
      </div>

      {/* Active Selection Strip */}
      <div className="mt-4 p-3 sm:p-4 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
              {hoveredData ? `Inspecting: ${hoveredData.title}` : 'Ready for Navigation'}
            </div>
            <div className="text-xs text-zinc-400">
              {hoveredData 
                ? `${hoveredData.description || 'Occurred on ' + hoveredData.date}` 
                : 'Hover or click on any celestial sphere to focus camera and reveal deep contextual bonds.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hoveredData && onSelectReceipt && (
            <button
              onClick={() => onSelectReceipt(hoveredData)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-glow-emerald active:scale-95"
            >
              Inspect Receipt →
            </button>
          )}

          {onOpenGraph && (
            <button
              onClick={onOpenGraph}
              className="px-3 py-1.5 rounded-xl glass-pill text-zinc-300 hover:text-white text-xs font-medium transition-colors border border-white/10 hover:border-white/20 active:scale-95"
            >
              Open Full 2D Graph
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
