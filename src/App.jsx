import React, { useState, useMemo } from 'react'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { Connections } from './pages/Connections'
import { Chapters } from './pages/Chapters'
import { ReceiptDetailModal } from './components/ReceiptDetailModal'
import { MomentStoryModal } from './components/MomentStoryModal'
import { PageTransition } from './components/PageTransition'
import { getNormalizedReceipts } from './utils/normalizeData'
import { getAllConnections, getLifeMoments } from './utils/connections'
import { generateInsights } from './utils/insights'
import { getLifeChapters } from './utils/chapters'

/**
 * Root Application Container.
 * Computes normalized receipts, cross-event connection bonds, life moments,
 * behavioral insights, and chronological chapters with memoized state.
 * Directs top-level page routing and modal states with GSAP PageTransition.
 */
export default function App() {
  const [activePage, setActivePage] = useState('home')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [selectedMoment, setSelectedMoment] = useState(null)

  // Compute normalized datasets and derived stories once
  const receipts = useMemo(() => getNormalizedReceipts(), [])
  const connections = useMemo(() => getAllConnections(receipts), [receipts])
  const moments = useMemo(() => getLifeMoments(receipts, connections), [receipts, connections])
  const insights = useMemo(() => generateInsights(receipts, connections), [receipts, connections])
  const chapters = useMemo(() => getLifeChapters(receipts, moments), [receipts, moments])

  const stats = useMemo(() => ({
    totalReceipts: receipts.length,
    totalConnections: connections.length,
    totalMoments: moments.length,
    totalChapters: chapters.length
  }), [receipts, connections, moments, chapters])

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Global Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        stats={stats}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageTransition activeKey={activePage}>
          {activePage === 'home' && (
            <Home
              receipts={receipts}
              connections={connections}
              moments={moments}
              insights={insights}
              onNavigate={setActivePage}
              onSelectReceipt={setSelectedReceipt}
              onOpenMoment={setSelectedMoment}
            />
          )}

          {activePage === 'explore' && (
            <Explore
              receipts={receipts}
              connections={connections}
              onSelectReceipt={setSelectedReceipt}
              onOpenMoment={setSelectedMoment}
            />
          )}

          {activePage === 'connections' && (
            <Connections
              receipts={receipts}
              connections={connections}
              onSelectReceipt={setSelectedReceipt}
            />
          )}

          {activePage === 'chapters' && (
            <Chapters
              chapters={chapters}
              onOpenMoment={setSelectedMoment}
            />
          )}
        </PageTransition>
      </main>

      {/* Modal Views */}
      {selectedReceipt && (
        <ReceiptDetailModal
          receipt={selectedReceipt}
          connections={connections}
          onClose={() => setSelectedReceipt(null)}
          onSelectConnected={(r) => setSelectedReceipt(r)}
        />
      )}

      {selectedMoment && (
        <MomentStoryModal
          moment={selectedMoment}
          onClose={() => setSelectedMoment(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#23252a] py-8 bg-[#08090a] text-xs font-sans text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-4 h-4 -rotate-45 text-white"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 9V4s3.03.55 4 2c1.08 1.62 0 5 0 5" />
            </svg>
            <span className="font-bold text-white">Launch UI</span>
            <span className="text-zinc-500">— Premium React & Tailwind Blocks</span>
          </div>

          <div className="text-zinc-500 font-mono text-[11px]">
            React • Vite • Tailwind CSS • Framer Motion • Shadcn/ui
          </div>
        </div>
      </footer>
    </div>
  )
}
