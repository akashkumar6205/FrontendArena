import React, { useState, useMemo, useCallback } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Filter, Info, X, GitMerge, FileText } from 'lucide-react'
import { ICON_MAP, COLOR_THEMES } from '../constants/theme'

/**
 * Custom Node component rendered by React Flow for individual receipts.
 */
function CustomReceiptNode({ data }) {
  const IconComponent = ICON_MAP[data.type] || FileText
  const theme = COLOR_THEMES[data.type] || COLOR_THEMES.note

  return (
    <div className={`px-4 py-3 rounded-xl border ${theme.nodeBorder || 'border-zinc-700'} ${theme.nodeBg || 'bg-[#111216]'} text-zinc-300 shadow-xl backdrop-blur-md max-w-[220px] transition-all hover:scale-105 hover:border-emerald-400`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-emerald-400" />
      <div className="flex items-center gap-2 mb-1">
        <IconComponent className="w-3.5 h-3.5" />
        <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
          {data.type}
        </span>
        <span className="text-[10px] font-mono text-gray-400 ml-auto">
          {data.time}
        </span>
      </div>

      <div className="text-xs font-receipt font-bold text-white truncate">
        {data.title}
      </div>

      <div className="text-[10px] text-gray-400 truncate mt-0.5">
        {data.date}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-emerald-400" />
    </div>
  )
}

const nodeTypes = {
  customReceipt: CustomReceiptNode
}

/**
 * Interactive React Flow graph for discovering connections across receipts.
 */
export function ConnectionGraph({ receipts, connections, onSelectReceipt }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [minScore, setMinScore] = useState(2) // 2: all, 4: possible+, 6: strong only
  const [selectedEdge, setSelectedEdge] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  // Dynamically calculate graph nodes & edges arranged in a radial layout
  useMemo(() => {
    const filteredConnections = connections.filter(c => c.score >= minScore)
    const connectedNodeIds = new Set()
    filteredConnections.forEach(c => {
      connectedNodeIds.add(c.source)
      connectedNodeIds.add(c.target)
    })

    // Radial layout calculation for node distribution
    const activeReceipts = receipts.filter(r => connectedNodeIds.has(r.id))
    const total = activeReceipts.length
    const radius = Math.min(window.innerWidth * 0.3, 340)
    const centerX = 400
    const centerY = 300

    const graphNodes = activeReceipts.map((r, idx) => {
      const angle = (idx / Math.max(total, 1)) * 2 * Math.PI
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      return {
        id: r.id,
        type: 'customReceipt',
        position: { x, y },
        data: r
      }
    })

    const graphEdges = filteredConnections.map((conn) => ({
      id: `edge-${conn.source}-${conn.target}`,
      source: conn.source,
      target: conn.target,
      label: conn.reasons[0] || 'connected',
      labelStyle: { fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' },
      labelBgStyle: { fill: '#111726', fillOpacity: 0.85, rx: 4 },
      style: {
        stroke: conn.score >= 6 ? '#10B981' : conn.score >= 4 ? '#F59E0B' : '#6B7280',
        strokeWidth: conn.score >= 6 ? 2.5 : 1.5,
      },
      animated: conn.score >= 4,
      data: conn
    }))

    setNodes(graphNodes)
    setEdges(graphEdges)
  }, [receipts, connections, minScore])

  // React Flow state handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data)
    setSelectedEdge(null)
  }

  const onEdgeClick = (_, edge) => {
    setSelectedEdge(edge.data)
    setSelectedNode(null)
  }

  return (
    <div className="relative w-full h-[650px] bg-dark-bg border border-dark-border rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* Top Graph Controls Bar */}
      <div className="p-4 bg-dark-card/90 border-b border-dark-border flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-receipt font-bold text-white text-base">
              Connect the Dots Graph
            </h3>
            <span className="text-xs font-mono text-gray-400">
              {edges.length} Discovered Relationships ({nodes.length} Connected Receipts)
            </span>
          </div>
        </div>

        {/* Filter buttons by score threshold */}
        <div className="flex items-center gap-2 bg-dark-bg p-1.5 rounded-xl border border-dark-border">
          <span className="text-[11px] font-mono text-gray-400 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Min Score:
          </span>
          <button
            onClick={() => setMinScore(2)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              minScore === 2 
                ? 'bg-emerald-500 text-black shadow-glow-emerald' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All (2+)
          </button>
          <button
            onClick={() => setMinScore(4)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              minScore === 4 
                ? 'bg-amber-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Possible (4+)
          </button>
          <button
            onClick={() => setMinScore(6)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              minScore === 6 
                ? 'bg-purple-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Strong (6+)
          </button>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-dark-bg"
        >
          <Background color="#1f293d" gap={20} size={1} />
          <Controls className="!bg-dark-card !border-dark-border !fill-white" />
        </ReactFlow>

        {/* Selected Node Floating Details Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-dark-card/95 border border-emerald-500/50 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-dark-border pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                {selectedNode.type} Details
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="font-receipt font-bold text-white text-base">
                {selectedNode.title}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                {selectedNode.description}
              </p>
            </div>

            <div className="text-[11px] font-mono text-gray-300 space-y-1 pt-2 border-t border-dark-border">
              <div>Date: {selectedNode.date} {selectedNode.time}</div>
              {selectedNode.amount && <div>Amount: ${selectedNode.amount.toFixed(2)}</div>}
              {selectedNode.location?.name && <div>Venue: {selectedNode.location.name}</div>}
            </div>

            <button
              onClick={() => onSelectReceipt && onSelectReceipt(selectedNode)}
              className="w-full py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all uppercase"
            >
              Open Full Receipt View
            </button>
          </div>
        )}

        {/* Selected Edge Floating Bond Panel */}
        {selectedEdge && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-dark-card/95 border border-amber-500/50 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-dark-border pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                Connection Bond (+{selectedEdge.score} pts)
              </span>
              <button
                onClick={() => setSelectedEdge(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-xs font-bold text-white">
                {selectedEdge.r1.title} ↔ {selectedEdge.r2.title}
              </div>
              <span className="text-[10px] font-mono uppercase text-gray-400 mt-1 block">
                Strength: {selectedEdge.strength}
              </span>
            </div>

            <div className="text-xs text-gray-300 space-y-1.5 pt-2 border-t border-dark-border">
              <div className="text-[11px] font-mono text-gray-400 uppercase">
                Why They Are Connected:
              </div>
              {selectedEdge.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-emerald-300">
                  <span>•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectReceipt && onSelectReceipt(selectedEdge.r1)}
              className="w-full py-2 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition-all uppercase"
            >
              Inspect First Receipt
            </button>
          </div>
        )}

        {/* Canvas Helper Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-dark-card/90 border border-dark-border p-3 rounded-2xl backdrop-blur-md text-[11px] font-mono text-gray-400 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Click any node or link line to inspect bond properties</span>
          </div>
        </div>
      </div>
    </div>
  )
}
