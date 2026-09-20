import React from 'react'
import { Search, Filter, ArrowUpDown, X } from 'lucide-react'

/**
 * FilterBar provides search inputs, sorting toggles, and category filter chips
 * with glassmorphism and tactile micro-interactions.
 */
export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  onReset
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Top Search Bar & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, artist, merchant, category, location..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans transition-all backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="w-4 h-4 text-emerald-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono font-semibold text-zinc-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer backdrop-blur-md"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="connected">Most Connected</option>
          </select>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 overflow-x-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Category:
          </span>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald'
                    : 'glass-pill text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Reset Filter Button */}
        {(searchQuery || selectedCategory !== 'all' || sortBy !== 'newest') && (
          <button
            onClick={onReset}
            className="text-[11px] font-mono text-zinc-400 hover:text-emerald-400 whitespace-nowrap transition-colors underline shrink-0 px-2"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
