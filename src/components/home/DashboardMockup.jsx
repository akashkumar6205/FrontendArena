import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  ArrowUpRight, 
  Plus, 
  Mail, 
  PanelLeft, 
  ChevronDown, 
  Activity, 
  Code2, 
  Copy, 
  CheckCircle2 
} from 'lucide-react'
import { StatsCard } from '../StatsCard'
import { LifeConstellation } from '../LifeConstellation'

/**
 * DashboardMockup component renders the central interactive window on the Home page.
 * Includes the vault selector, KPI stat cards, and multi-tab interactive views
 * (Three.js 3D Constellation, recent records table, schema viewer).
 *
 * @param {Object} props
 * @param {Array<Object>} props.receipts - All normalized receipts
 * @param {Array<Object>} props.connections - Scored connections
 * @param {Array<Object>} props.moments - Synchronized life moments
 * @param {Function} props.onNavigate - Page navigation callback
 * @param {Function} props.onSelectReceipt - Receipt selection callback
 */
export function DashboardMockup({ 
  receipts = [], 
  connections = [], 
  moments = [], 
  onNavigate, 
  onSelectReceipt 
}) {
  const [activeMockupTab, setActiveMockupTab] = useState('canvas')
  const [selectedVault, setSelectedVault] = useState('Personal Vault')
  const [vaultDropdownOpen, setVaultDropdownOpen] = useState(false)
  const [isVaultLoading, setIsVaultLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // Asynchronous vault switching simulation
  const handleVaultChange = (vault) => {
    setSelectedVault(vault)
    setVaultDropdownOpen(false)
    setIsVaultLoading(true)
    setTimeout(() => {
      setIsVaultLoading(false)
    }, 450)
  }

  // Copy TypeScript schema to clipboard
  const handleCopy = () => {
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // Dashboard KPI metrics
  const dashboardStats = [
    { label: 'Total Receipts', value: `${receipts.length} Records`, badge: '+12.5%', isPositive: true, subtext: '+12.5% vs last period' },
    { label: 'Discovered Connections', value: `${connections.length} Bonds`, badge: '+18.0%', isPositive: true, subtext: 'Contextual relationships found' },
    { label: 'Life Moments', value: `${moments.length} Stories`, badge: '+12.5%', isPositive: true, subtext: '+20% synchronized clusters' },
    { label: 'Active Categories', value: '5 Types', badge: '+4.5%', isPositive: true, subtext: 'Music, Spending, Places, Notes' }
  ]

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      {/* Ambient Warm Glow behind the Mockup */}
      <div 
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] -z-10"
        style={{
          background: 'radial-gradient(ellipse 75% 55% at 50% 60%, rgba(217, 119, 6, 0.26) 0%, rgba(180, 83, 9, 0.14) 40%, rgba(8, 9, 10, 0) 75%)',
          filter: 'blur(35px)'
        }}
      />

      {/* Dashboard Mockup Window */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="rounded-3xl glass-panel p-4 sm:p-6 shadow-2xl text-left relative z-10"
      >
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
          {/* Left Controls */}
          <div className="flex items-center gap-2.5">
            {/* Vault Dropdown */}
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
                      onClick={() => handleVaultChange(vault)}
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

            {/* Quick Create Button */}
            <button
              onClick={() => onNavigate('explore')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5E7EB] hover:bg-white text-zinc-900 text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Quick Create</span>
            </button>

            {/* Notification / Alert Icon */}
            <button 
              onClick={() => onNavigate('explore')}
              className="p-1.5 rounded-lg bg-[#15171c] hover:bg-[#1e2026] border border-[#272930] text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Notifications & Synchronized Records"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
            <div className="flex items-center gap-2 text-zinc-300 font-medium">
              <PanelLeft className="w-4 h-4 text-zinc-400" />
              <span>Documents</span>
            </div>

            <button
              onClick={() => onNavigate('connections')}
              className="text-zinc-400 hover:text-white font-medium transition-colors flex items-center gap-1"
            >
              <span>Live Graph</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Metric Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
          {dashboardStats.map((item, idx) => (
            <StatsCard key={idx} {...item} />
          ))}
        </div>

        {/* Interactive Tabs Content */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 relative min-h-[300px]">
          {/* Vault Loading Overlay */}
          {isVaultLoading && (
            <div className="absolute inset-0 z-40 bg-[#090a0d]/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="w-9 h-9 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Hydrating {selectedVault}...
              </span>
            </div>
          )}

          {/* Tab Selector Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-1.5 glass-pill p-1 rounded-xl">
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

          {/* Tab 1: Live Interactive Three.js Constellation Canvas */}
          {activeMockupTab === 'canvas' && (
            <div className="space-y-2">
              <LifeConstellation 
                receipts={receipts}
                connections={connections}
                onSelectReceipt={(receipt) => {
                  if (typeof receipt === 'string') {
                    const found = receipts.find(r => r.id === receipt)
                    if (found) onSelectReceipt(found)
                  } else if (receipt) {
                    onSelectReceipt(receipt)
                  }
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
                          {r.amount !== null ? `$${r.amount.toFixed(2)}` : 'Synchronized'}
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

          {/* Tab 3: Schema Code Preview */}
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
  type: 'music' | 'purchase' | 'expense' | 'place' | 'note'
  title: string
  description: string
  date: string
  time: string
  datetime: string
  timestampMs: number
  location?: { lat: number; lng: number; name: string }
  amount: number | null
  currency: string | null
  category: string
  metadata: Record<string, any>
  tags: string[]
}`}
              </pre>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
