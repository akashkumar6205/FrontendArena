import React, { useState } from 'react'
import { ThreeConstellation } from './ThreeConstellation'
import { motion } from 'framer-motion'
import { Music, CreditCard, MapPin, FileText, Sparkles, Receipt, ArrowRight, Box, Compass } from 'lucide-react'

const NODE_TYPES = [
  { icon: Music, label: 'Music Stream', type: 'music', color: '#8B5CF6', x: 20, y: 30, receiptId: 'spotify-101' },
  { icon: CreditCard, label: 'Card Transaction', type: 'purchase', color: '#10B981', x: 45, y: 15, receiptId: 'tx-201' },
  { icon: MapPin, label: 'GPS Check-in', type: 'place', color: '#06B6D4', x: 75, y: 35, receiptId: 'loc-401' },
  { icon: FileText, label: 'Personal Note', type: 'note', color: '#6366F1', x: 30, y: 70, receiptId: 'note-501' },
  { icon: Sparkles, label: 'Life Moment', type: 'moment', color: '#F59E0B', x: 55, y: 55, receiptId: 'moment-2024-11-12-spotify-101' },
  { icon: Receipt, label: 'Expense Record', type: 'expense', color: '#EC4899', x: 80, y: 75, receiptId: 'exp-303' }
]

const EDGES = [
  { from: 0, to: 1, reason: 'within 8 minutes' },
  { from: 1, to: 4, reason: 'same location' },
  { from: 4, to: 3, reason: 'same 3 AM session' },
  { from: 2, to: 4, reason: 'same date' },
  { from: 0, to: 3, reason: 'soundtrack match' },
  { from: 4, to: 5, reason: 'software bill' }
]

export function LifeConstellation({ receipts = [], connections = [], onSelectReceipt, onOpenGraph }) {
  const [viewFormat, setViewFormat] = useState('3d') // '3d' | '2d'
  const [activeNode, setActiveNode] = useState(NODE_TYPES[4])

  return (
    <div className="space-y-3">
      {/* Format Toggle Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewFormat('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewFormat === '3d'
                ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald'
                : 'bg-[#15171c] text-zinc-400 border border-[#272930] hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Three.js 3D Orbit</span>
          </button>
          <button
            onClick={() => setViewFormat('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewFormat === '2d'
                ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald'
                : 'bg-[#15171c] text-zinc-400 border border-[#272930] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>2D Planar Diagram</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline-block">
          {viewFormat === '3d' ? 'Interactive WebGL Canvas Engine' : '2D Schematic Node Map'}
        </span>
      </div>

      {/* View Mode 1: Three.js 3D Constellation */}
      {viewFormat === '3d' ? (
        <ThreeConstellation
          receipts={receipts}
          connections={connections}
          onSelectReceipt={onSelectReceipt}
          onOpenGraph={onOpenGraph}
        />
      ) : (
        /* View Mode 2: 2D Interactive Planar Diagram */
        <div className="relative w-full rounded-2xl border border-dark-border bg-gradient-to-b from-dark-card/90 to-dark-bg/95 p-6 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

          {/* Header Bar */}
          <div className="flex items-center justify-between z-10 relative mb-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                Planar Constellation
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Life Data Nodes & Relationships
              </h3>
            </div>

            <button
              onClick={onOpenGraph}
              className="text-xs font-mono text-gray-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors border border-dark-border px-3 py-1.5 rounded-lg hover:border-emerald-500/40"
            >
              <span>Open Full Graph View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Node Graph Area */}
          <div className="relative w-full h-[320px] sm:h-[380px] z-10 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {EDGES.map((edge, idx) => {
                const source = NODE_TYPES[edge.from]
                const target = NODE_TYPES[edge.to]
                const isActive = activeNode && (activeNode.type === source.type || activeNode.type === target.type)

                return (
                  <g key={idx}>
                    <line
                      x1={`${source.x}%`}
                      y1={`${source.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke={isActive ? '#10B981' : '#1F293D'}
                      strokeWidth={isActive ? 2 : 1}
                      strokeDasharray={isActive ? '4,4' : 'none'}
                      className="transition-all duration-300"
                    />
                  </g>
                )
              })}
            </svg>

            {NODE_TYPES.map((node, idx) => {
              const IconComponent = node.icon
              const isSelected = activeNode?.label === node.label

              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: isSelected ? 1.15 : 1,
                    opacity: 1,
                    y: [0, idx % 2 === 0 ? -6 : 6, 0]
                  }}
                  transition={{
                    y: {
                      duration: 4 + (idx % 3),
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }
                  }}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`
                  }}
                  onClick={() => {
                    setActiveNode(node)
                    const found = receipts.find(r => r.id === node.receiptId)
                    if (onSelectReceipt && found) onSelectReceipt(found)
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div 
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-lg ${
                      isSelected 
                        ? 'scale-110 shadow-glow-emerald bg-dark-card border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/50' 
                        : 'bg-dark-bg/90 border-dark-border text-gray-400 hover:text-white hover:border-gray-500 hover:scale-105'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap pointer-events-none transition-all ${
                    isSelected 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 opacity-100' 
                      : 'bg-dark-card text-gray-400 border border-dark-border opacity-0 group-hover:opacity-100'
                  }`}>
                    {node.label}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {activeNode && (
            <div className="mt-4 p-4 rounded-xl bg-dark-bg/90 border border-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                  <activeNode.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                    Selected Node: {activeNode.label}
                  </div>
                  <div className="text-xs text-gray-400">
                    Connected to other life receipts in this period.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const found = receipts.find(r => r.id === activeNode.receiptId)
                  if (onSelectReceipt && found) onSelectReceipt(found)
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors self-end sm:self-auto"
              >
                Inspect Node →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
