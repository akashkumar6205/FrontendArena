import React, { useState, useMemo, useCallback } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Music, CreditCard, MapPin, FileText, Receipt, Sparkles, Filter, Info, X, GitMerge, CheckCircle } from 'lucide-react'

// Custom Node Component for Receipts
function CustomReceiptNode({ data }) {
  const ICON_MAP = {
    music: Music,
    purchase: CreditCard,
    expense: Receipt,
    place: MapPin,
    note: FileText
  }

  const COLOR_THEMES = {
    music: 'bg-purple-950/80 border-purple-500/50 text-purple-300',
    purchase: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
    expense: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
    place: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
    note: 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
  }

  const IconComponent = ICON_MAP[data.type] || FileText
  const theme = COLOR_THEMES[data.type] || COLOR_THEMES.note

  return (
    <div className={`px-4 py-3 rounded-xl border ${theme} shadow-xl backdrop-blur-md max-w-[220px] transition-all hover:scale-105 hover:border-emerald-400`}>
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

export function ConnectionGraph({ receipts, connections, onSelectReceipt }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [minScore, setMinScore] = useState(2) // 2: all, 4: possible+, 6: strong only
  const [selectedEdge, setSelectedEdge] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  // Build graph nodes & edges dynamically based on receipts & connection thresholds
  useMemo(() => {
    const filteredConnections = connections.filter(c => c.score >= minScore)
    const connectedNodeIds = new Set()
    filteredConnections.forEach(c => {
      connectedNodeIds.add(c.source)
      connectedNodeIds.add(c.target)
    })

    // Layout calculation (circle / grid arrangement for node positions)
    const activeReceipts = receipts.filter(r => connectedNodeIds.has(r.id))
    const total = activeReceipts.length
    const radius = Math.min(window.innerWidth * 0.3, 340)
    const centerX = 400
    const centerY = 300

    const graphNodes = activeReceipts.map((r, idx) => {
      const angle = (idx / total) * 2 * Math.PI
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      return {
        id: r.id,
        type: 'customReceipt',
        position: { x, y },
        data: r
      }
    })

    const graphEdges = filteredConnections.map((conn, idx) => ({
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
            <Filter className="w-3 h-3 text-emerald-400" />
            Strength Filter:
          </span>
          <button
            onClick={() => setMinScore(2)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              minScore === 2 
                ? 'bg-emerald-500 text-black font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All (2+)
          </button>
          <button
            onClick={() => setMinScore(4)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              minScore === 4 
                ? 'bg-amber-500 text-black font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Possible (4+)
          </button>
          <button
            onClick={() => setMinScore(6)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              minScore === 6 
                ? 'bg-purple-500 text-white font-bold shadow-glow-violet' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Strong (6+)
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background color="#1F293D" gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Selected Edge / Node Inspector Drawer */}
      {(selectedEdge || selectedNode) && (
        <div className="absolute bottom-4 right-4 z-30 w-full max-w-sm bg-dark-card/95 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 border-b border-dark-border pb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {selectedEdge ? 'Connection Discovered' : 'Receipt Node Details'}
            </span>
            <button
              onClick={() => {
                setSelectedEdge(null)
                setSelectedNode(null)
              }}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedEdge && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
                  {selectedEdge.strength}
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  Score: +{selectedEdge.score}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-2">
                <div className="text-xs font-bold text-white">
                  {selectedEdge.r1.title} ↔ {selectedEdge.r2.title}
                </div>
                <ul className="space-y-1">
                  {selectedEdge.reasons.map((reason, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-1.5 font-mono">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectReceipt && onSelectReceipt(selectedEdge.r1)}
                className="w-full text-xs font-semibold py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
              >
                Inspect Connected Receipts →
              </button>
            </div>
          )}

          {selectedNode && (
            <div className="space-y-3">
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase">
                  {selectedNode.type} RECEIPT
                </span>
                <h4 className="text-base font-receipt font-bold text-white">
                  {selectedNode.title}
                </h4>
                <p className="text-xs text-gray-300 mt-1">
                  {selectedNode.description}
                </p>
              </div>

              <div className="text-xs font-mono text-emerald-400 pt-2 border-t border-dark-border">
                Timestamp: {selectedNode.date} at {selectedNode.time}
              </div>

              <button
                onClick={() => onSelectReceipt && onSelectReceipt(selectedNode)}
                className="w-full text-xs font-semibold py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
              >
                View Full Receipt →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
