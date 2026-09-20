import React, { useState, useMemo } from 'react'
import { FilterBar } from '../components/FilterBar'
import { ReceiptCard } from '../components/ReceiptCard'
import { Layers, Sparkles, LayoutGrid, ScrollText } from 'lucide-react'

export function Explore({ receipts, connections, onSelectReceipt, onOpenMoment }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'spool'

  // Extract categories present strictly in the dataset
  const categories = useMemo(() => {
    const set = new Set(receipts.map(r => r.category))
    return ['all', ...Array.from(set)]
  }, [receipts])

  // Count connection for each receipt
  const connectionCounts = useMemo(() => {
    const counts = {}
    connections.forEach(c => {
      counts[c.source] = (counts[c.source] || 0) + 1
      counts[c.target] = (counts[c.target] || 0) + 1
    })
    return counts
  }, [connections])

  // Filter and sort receipts
  const filteredReceipts = useMemo(() => {
    let result = [...receipts]

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.location && r.location.name && r.location.name.toLowerCase().includes(q)) ||
        (r.metadata && JSON.stringify(r.metadata).toLowerCase().includes(q))
      )
    }

    // 2. Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(r => r.category === selectedCategory || r.type === selectedCategory)
    }

    // 3. Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => b.timestampMs - a.timestampMs)
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.timestampMs - b.timestampMs)
    } else if (sortBy === 'connected') {
      result.sort((a, b) => (connectionCounts[b.id] || 0) - (connectionCounts[a.id] || 0))
    }

    return result
  }, [receipts, searchQuery, selectedCategory, sortBy, connectionCounts])

  const handleReset = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSortBy('newest')
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Layers className="w-3.5 h-3.5" />
            Receipt Explorer
          </span>
          <h1 className="text-3xl sm:text-4xl font-receipt font-bold text-white">
            Explore Your Receipts
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Browse through individual music streams, transactions, places, expenses, and notes.
          </p>
        </div>

        {/* View Mode Toggles */}
        <div className="flex items-center gap-2 bg-dark-card p-1 rounded-xl border border-dark-border self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === 'grid' 
                ? 'bg-emerald-500 text-black font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('spool')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === 'spool' 
                ? 'bg-emerald-500 text-black font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Tape Spool</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleReset}
      />

      {/* Receipt Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
        <span>
          Showing <strong className="text-emerald-400">{filteredReceipts.length}</strong> of {receipts.length} receipts
        </span>
        {selectedCategory !== 'all' && (
          <span className="text-gray-400">
            Active Filter: <span className="text-white uppercase">{selectedCategory}</span>
          </span>
        )}
      </div>

      {/* Receipts Grid / Tape View */}
      {filteredReceipts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReceipts.map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                connectionCount={connectionCounts[receipt.id] || 0}
                onClick={onSelectReceipt}
                onSelectMoment={() => {
                  onSelectReceipt(receipt)
                }}
              />
            ))}
          </div>
        ) : (
          /* Continuous Tape Spool View */
          <div className="max-w-xl mx-auto space-y-4 bg-dark-paper border border-dark-border p-6 rounded-3xl shadow-2xl relative">
            <div className="text-center pb-4 border-b border-dashed border-dark-border">
              <span className="font-receipt font-bold text-white text-lg block">
                🧾 DIGITAL RECEIPT SPOOL
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                CHRONOLOGICAL RECORD LOG
              </span>
            </div>

            <div className="space-y-4">
              {filteredReceipts.map((receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  connectionCount={connectionCounts[receipt.id] || 0}
                  onClick={onSelectReceipt}
                />
              ))}
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="text-center py-16 p-8 bg-dark-card border border-dark-border rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-dark-bg border border-dark-border text-gray-400 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-xl font-receipt font-bold text-white">
            No Receipts Found
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            No receipt records match your current search query or category filter. Try clearing filters to see more.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold uppercase"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
