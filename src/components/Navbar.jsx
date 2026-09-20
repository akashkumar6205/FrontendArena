import React, { useState } from 'react'
import { ChevronDown, Menu, X, Sparkles, Layers, GitMerge, BookOpen } from 'lucide-react'

/**
 * Global Navigation Bar component.
 * Provides primary view switching, dropdown menus, stats counters, and mobile drawer.
 */
export function Navbar({ activePage, setActivePage, stats }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const navItems = [
    { id: 'home', label: 'Overview', icon: Sparkles },
    { id: 'explore', label: 'Explore Receipts', icon: Layers, badge: stats?.totalReceipts },
    { id: 'connections', label: 'Connect the Dots', icon: GitMerge, badge: stats?.totalConnections },
    { id: 'chapters', label: 'Life Chapters', icon: BookOpen, badge: stats?.totalChapters }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#23252a]/80 bg-[#08090a]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Section: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Brand Logo - Styled with sleek minimalist typography */}
          <button 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#15171c] border border-[#272930] flex items-center justify-center text-base group-hover:scale-105 transition-transform shadow-sm">
              🧾
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold tracking-tight text-white text-base block group-hover:text-amber-400 transition-colors">
                Life Receipts
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links with ui.png style */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
            {/* Getting started / Overview Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('explore-dropdown')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'explore-dropdown' ? null : 'explore-dropdown')}
                className={`flex items-center gap-1 hover:text-white transition-colors py-2 ${
                  activePage === 'home' || activePage === 'explore' ? 'text-white font-semibold' : 'text-zinc-300'
                }`}
              >
                <span>Getting started</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${openDropdown === 'explore-dropdown' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'explore-dropdown' && (
                <div className="absolute top-full left-0 w-60 mt-1 bg-[#111215] border border-[#23252a] rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <button 
                    onClick={() => { setActivePage('home'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Overview Dashboard</div>
                      <div className="text-[11px] text-zinc-500">Summary & pattern insights</div>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button 
                    onClick={() => { setActivePage('explore'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Explore Receipts</div>
                      <div className="text-[11px] text-zinc-500">{stats?.totalReceipts || 0} Normalized records</div>
                    </div>
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Components / Chapters Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('chapters-dropdown')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'chapters-dropdown' ? null : 'chapters-dropdown')}
                className={`flex items-center gap-1 hover:text-white transition-colors py-2 ${
                  activePage === 'connections' || activePage === 'chapters' ? 'text-white font-semibold' : 'text-zinc-300'
                }`}
              >
                <span>Components</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${openDropdown === 'chapters-dropdown' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'chapters-dropdown' && (
                <div className="absolute top-full left-0 w-64 mt-1 bg-[#111215] border border-[#23252a] rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <button 
                    onClick={() => { setActivePage('connections'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Connect the Dots</div>
                      <div className="text-[11px] text-zinc-500">Interactive node network</div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">Graph</span>
                  </button>
                  <button 
                    onClick={() => { setActivePage('chapters'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Life Chapters</div>
                      <div className="text-[11px] text-zinc-500">Chronological moments</div>
                    </div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">Timeline</span>
                  </button>
                </div>
              )}
            </div>

            {/* Documentation / Explorer button */}
            {/* <button 
              onClick={() => setActivePage('explore')}
              className={`hover:text-white transition-colors ${activePage === 'explore' ? 'text-white font-semibold' : 'text-zinc-300'}`}
            >
              Documentation
            </button> */}
          </nav>
        </div>

        {/* Right Section: Sign in & Get Started in ui.png style */}
        <div className="hidden md:flex items-center gap-4">
          
          
          <button
            onClick={() => setActivePage('explore')}
            className="px-4 py-2 rounded-lg bg-[#E5E7EB] hover:bg-white text-zinc-900 text-sm font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
          >
            <span>Get Started</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0c0d10] border-b border-[#23252a] px-4 pt-3 pb-6 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id)
                  setMobileOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#1e2025] text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}

          <div className="pt-3 border-t border-[#23252a] flex items-center justify-between gap-3">
            <button
              onClick={() => { setActivePage('explore'); setMobileOpen(false); }}
              className="flex-1 py-2 text-center text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg"
            >
              Sign in
            </button>
            <button
              onClick={() => { setActivePage('explore'); setMobileOpen(false); }}
              className="flex-1 py-2 text-center text-sm font-semibold text-zinc-900 bg-[#E5E7EB] rounded-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
