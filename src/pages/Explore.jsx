import React, { useState, useMemo, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { FilterBar } from '../components/FilterBar'
import { ReceiptCard } from '../components/ReceiptCard'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'
import { Layers, LayoutGrid, ScrollText, SearchX, RotateCcw } from 'lucide-react'

export function Explore({ receipts = [], connections = [], onSelectReceipt, onOpenMoment }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'spool'
  const [isSearching, setIsSearching] = useState(false)

  const emptyStateRef = useRef(null)
  const emptyIconRef = useRef(null)

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

  // Simulated brief loading animation when category changes
  const handleCategoryChange = (category) => {
    setIsSearching(true)
    setSelectedCategory(category)
    setTimeout(() => {
      setIsSearching(false)
    }, 280)
  }

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
    setIsSearching(true)
    setSearchQuery('')
    setSelectedCategory('all')
    setSortBy('newest')
    setTimeout(() => {
      setIsSearching(false)
    }, 250)
  }

  // GSAP animation for empty state
  useEffect(() => {
    if (filteredReceipts.length === 0 && emptyStateRef.current) {
      gsap.fromTo(
        emptyStateRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.5)' }
      )
    }

    if (emptyIconRef.current) {
      gsap.to(emptyIconRef.current, {
        y: -8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    }
  }, [filteredReceipts.length])

  if (!receipts || receipts.length === 0) {
    return (
      <div className="py-16">
        <ErrorState
          title="No Receipts Loaded"
          message="The receipts dataset is empty or could not be loaded from memory."
          onRetry={handleReset}
        />
      </div>
    )
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
            Browse through individual music streams, transactions, places, expenses, and notes with tactile 3D hover feedback.
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
        setSelectedCategory={handleCategoryChange}
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

      {/* Loading State Skeleton */}
      {isSearching ? (
        <LoadingSkeleton count={6} />
      ) : (
        /* Receipts Grid / Tape View */
        filteredReceipts.length > 0 ? (
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
          /* Rich GSAP-Animated Empty State */
          <div 
            ref={emptyStateRef}
            className="text-center py-16 p-8 bg-dark-card border border-dark-border rounded-3xl space-y-5 max-w-lg mx-auto shadow-2xl backdrop-blur-md"
          >
            <div 
              ref={emptyIconRef}
              className="w-16 h-16 rounded-2xl bg-[#15171c] border border-dark-border text-emerald-400 flex items-center justify-center mx-auto shadow-glow-emerald/30"
            >
              <SearchX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-sans font-bold text-white">
                No Matching Receipts Found
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 leading-relaxed">
                We couldn't find any receipt records matching <span className="text-emerald-400 font-mono">"{searchQuery || selectedCategory}"</span>. Try adjusting your search query or reset filters.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase transition-all shadow-lg active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )
      )}
    </div>
  )
}
