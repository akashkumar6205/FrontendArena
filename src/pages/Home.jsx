import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  GitMerge, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  ArrowUpRight, 
  Plus, 
  Mail, 
  PanelLeft, 
  ChevronDown, 
  Activity, 
  Code2, 
  Copy, 
  CheckCircle2, 
  Clock,
  Compass
} from 'lucide-react'
import { StatsCard } from '../components/StatsCard'
import { InsightCard } from '../components/InsightCard'
import { LifeConstellation } from '../components/LifeConstellation'

export function Home({ receipts, connections, moments, insights, onNavigate, onSelectReceipt, onOpenMoment }) {
  const [activeMockupTab, setActiveMockupTab] = useState('canvas')
  const [selectedVault, setSelectedVault] = useState('Personal Vault')
  const [vaultDropdownOpen, setVaultDropdownOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // Metrics styled in the exact ui.png 4-card format using the project's real data
  const dashboardStats = [
    { label: 'Total Receipts', value: `${receipts.length} Records`, badge: '+12.5%', isPositive: true, subtext: '+12.5% vs last period' },
    { label: 'Discovered Connections', value: `${connections.length} Bonds`, badge: '+18.0%', isPositive: true, subtext: 'Contextual relationships found' },
    { label: 'Life Moments', value: `${moments.length} Stories`, badge: '+12.5%', isPositive: true, subtext: '+20% synchronized clusters' },
    { label: 'Active Categories', value: '5 Types', badge: '+4.5%', isPositive: true, subtext: 'Music, Spending, Places, Notes' }
  ]

  const handleCopy = () => {
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="relative min-h-screen text-gray-100 space-y-24 pb-24 overflow-x-hidden">
      
      {/* ---------------------------------------------------- */}
      {/* AMBIENT WARM COPPER/AMBER GLOW (Rising behind Mockup) */}
      {/* ---------------------------------------------------- */}
      <div 
        className="pointer-events-none absolute top-[280px] sm:top-[220px] left-1/2 -translate-x-1/2 w-[1100px] h-[550px] -z-10"
        style={{
          background: 'radial-gradient(ellipse 75% 55% at 50% 60%, rgba(217, 119, 6, 0.26) 0%, rgba(180, 83, 9, 0.14) 40%, rgba(8, 9, 10, 0) 75%)',
          filter: 'blur(35px)'
        }}
      />

      {/* ---------------------------------------------------- */}
      {/* HERO SECTION - Styled with ui.png typography & layout */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-8 sm:pt-14 text-center max-w-6xl mx-auto px-4">
        
        {/* Specular Top Lighting Reflection pill above Title */}
        <div className="mx-auto w-48 sm:w-96 h-10 bg-white/20 blur-2xl rounded-full mb-[-25px] pointer-events-none" />

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-sans font-bold tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
            Your Life, In Receipts <br />
            <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
              One Story to Discover
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed font-normal">
            Hundreds of disconnected digital records — music streams, coffee runs, transactions, notes, and check-ins — transformed into one interactive personal archive.
          </p>
        </motion.div>

        {/* Hero Action Buttons - Exact ui.png styling */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-row items-center justify-center gap-3 pt-6 pb-2"
        >
          {/* Primary CTA - Solid light rounded button */}
          <button
            onClick={() => onNavigate('explore')}
            className="px-6 py-2.5 rounded-lg bg-[#E5E7EB] hover:bg-white text-zinc-900 font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span>Explore the Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary CTA - Dark translucent rounded button */}
          <button
            onClick={() => onNavigate('connections')}
            className="px-5 py-2.5 rounded-lg bg-[#22242a]/80 hover:bg-[#2d3038] border border-zinc-700/60 text-zinc-100 font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            <GitMerge className="w-4 h-4 text-zinc-300" />
            <span>Connect the Dots</span>
          </button>
        </motion.div>

        {/* ---------------------------------------------------- */}
        {/* DASHBOARD MOCKUP WINDOW - Mirrored from ui.png       */}
        {/* ---------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-12 rounded-2xl border border-[#23252a] bg-[#0c0d10]/95 p-3 sm:p-5 shadow-2xl backdrop-blur-xl text-left relative z-10"
        >
          {/* Top Bar of Dashboard Mockup */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#23252a]">
            
            {/* Left Controls: Vault dropdown + Quick Create pill + Mail button */}
            <div className="flex items-center gap-2.5">
              {/* Vault Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setVaultDropdownOpen(!vaultDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#15171c] hover:bg-[#1e2026] border border-[#272930] text-xs font-semibold text-zinc-200 transition-colors"
                >
                  <div className="w-4 h-4 rounded-full border border-zinc-400 flex items-center justify-center text-[10px]">
                    ○
                  </div>
                  <span>{selectedVault}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {vaultDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[#15171c] border border-[#272930] rounded-xl shadow-xl p-1.5 z-30 text-xs">
                    {['Personal Vault', 'All Receipts Archive', 'Travel & Coffee Runs', 'Financial Highlights'].map((vault) => (
                      <button
                        key={vault}
                        onClick={() => { setSelectedVault(vault); setVaultDropdownOpen(false); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                          selectedVault === vault ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                      >
                        {vault}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Create / Quick Add Button (Light Gray Pill) */}
              <button
                onClick={() => onNavigate('explore')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5E7EB] hover:bg-white text-zinc-900 text-xs font-semibold transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Quick Create</span>
              </button>

              {/* Messages / Alerts Button */}
              <button 
                onClick={() => onNavigate('explore')}
                className="p-1.5 rounded-lg bg-[#15171c] hover:bg-[#1e2026] border border-[#272930] text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Notifications & Synchronized Records"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>

            {/* Middle / Right Navigation Bar */}
            <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
              {/* Documents Breadcrumb */}
              <div className="flex items-center gap-2 text-zinc-300 font-medium">
                <PanelLeft className="w-4 h-4 text-zinc-400" />
                <span>Documents</span>
              </div>

              {/* Live Graph Shortcut */}
              <button
                onClick={() => onNavigate('connections')}
                className="text-zinc-400 hover:text-white font-medium transition-colors flex items-center gap-1"
              >
                <span>Live Graph</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Metric Stats Cards Row (Matches ui.png) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
            {dashboardStats.map((item, idx) => (
              <StatsCard key={idx} {...item} />
            ))}
          </div>

          {/* Interactive Mockup Content Area / Tabs */}
          <div className="bg-[#090a0d] border border-[#23252a] rounded-xl p-4 sm:p-5">
            
            {/* Tab controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#23252a] pb-3 mb-4">
              <div className="flex items-center gap-1.5 bg-[#15171c] p-1 rounded-lg border border-[#272930]">
                <button
                  onClick={() => setActiveMockupTab('canvas')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeMockupTab === 'canvas' ? 'bg-[#23252a] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Live Constellation</span>
                </button>
                <button
                  onClick={() => setActiveMockupTab('table')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeMockupTab === 'table' ? 'bg-[#23252a] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recent Records</span>
                </button>
                <button
                  onClick={() => setActiveMockupTab('spec')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeMockupTab === 'spec' ? 'bg-[#23252a] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Archive Schema</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('connections')}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <span>Open Interactive Graph</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tab 1: Live Interactive Constellation Canvas */}
            {activeMockupTab === 'canvas' && (
              <div className="space-y-2">
                <LifeConstellation 
                  onSelectReceipt={(id) => {
                    const found = receipts.find(r => r.id === id)
                    if (found) onSelectReceipt(found)
                  }}
                  onOpenGraph={() => onNavigate('connections')}
                />
              </div>
            )}

            {/* Tab 2: Recent Records Table */}
            {activeMockupTab === 'table' && (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-[#23252a] text-zinc-400">
                        <th className="pb-2 font-medium">Record / Title</th>
                        <th className="pb-2 font-medium">Category</th>
                        <th className="pb-2 font-medium">Date & Time</th>
                        <th className="pb-2 font-medium text-right">Amount / Metric</th>
                        <th className="pb-2 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2025]">
                      {receipts.slice(0, 5).map((r) => (
                        <tr key={r.id} className="hover:bg-[#15171c]/60 transition-colors group">
                          <td className="py-2.5 font-medium text-zinc-200 group-hover:text-white flex items-center gap-2">
                            <span>{r.icon || '📄'}</span>
                            <span>{r.title}</span>
                          </td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#1e2025] text-zinc-300 border border-zinc-700/50">
                              {r.category}
                            </span>
                          </td>
                          <td className="py-2.5 text-zinc-400 font-mono text-[11px]">{r.date}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-amber-400">
                            {r.total ? `$${r.total}` : 'Synchronized'}
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => onSelectReceipt(r)}
                              className="text-[11px] text-zinc-400 hover:text-white font-medium underline"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Schema / Component Code Preview */}
            {activeMockupTab === 'spec' && (
              <div className="bg-[#0e1014] border border-[#23252a] rounded-lg p-4 font-mono text-xs text-zinc-300 space-y-3">
                <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-[11px] text-zinc-400 font-mono ml-2">NormalizedReceipt.ts</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-[11px]"
                  >
                    {copiedCode ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Schema'}</span>
                  </button>
                </div>
                <pre className="text-zinc-300 overflow-x-auto leading-relaxed">
{`export interface NormalizedReceipt {
  id: string
  title: string
  merchant: string
  category: 'spending' | 'music' | 'places' | 'notes'
  timestamp: string
  location?: { lat: number; lng: number; name: string }
  connections: string[] // Connected receipt IDs
  insights: string[]
}`}
                </pre>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION: PATTERN RECOGNITION & DISCOVERIES          */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-[#23252a] pb-4">
          <div>
            <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-widest block mb-1">
              Pattern Recognition
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
              Things We Discovered
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            100% Empirical Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION: FEATURED LIFE STORIES / MOMENTS             */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-[#23252a] pb-4">
          <div>
            <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-widest block mb-1">
              Connect the Dots
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
              Featured Life Moments
            </h2>
          </div>

          <button
            onClick={() => onNavigate('chapters')}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>View All Chapters</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {moments.slice(0, 3).map((moment) => (
            <div
              key={moment.id}
              onClick={() => onOpenMoment(moment)}
              className="bg-[#111215]/90 border border-[#23252a] hover:border-amber-500/40 rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                    {moment.receipts.length} Connected Receipts
                  </span>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {moment.durationMins} mins
                  </span>
                </div>

                <h3 className="font-sans font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                  {moment.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-3">
                  {moment.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#23252a] flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>Play Moment Story</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
