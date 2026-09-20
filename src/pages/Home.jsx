import React from 'react'
import { HeroSection } from '../components/home/HeroSection'
import { DashboardMockup } from '../components/home/DashboardMockup'
import { PatternDiscoveries } from '../components/home/PatternDiscoveries'
import { FeaturedMoments } from '../components/home/FeaturedMoments'

/**
 * Home page view controller.
 * Composes modular sub-components:
 * 1. HeroSection — Specular lighting, typography, and primary CTA actions
 * 2. DashboardMockup — Interactive window featuring the Three.js 3D Constellation
 * 3. PatternDiscoveries — Empirical behavioral insights and habit analysis
 * 4. FeaturedMoments — High-density synchronized life stories
 *
 * @param {Object} props
 * @param {Array<Object>} props.receipts - Normalized receipts dataset
 * @param {Array<Object>} props.connections - Scored connection bonds
 * @param {Array<Object>} props.moments - Synchronized Life Moments
 * @param {Array<Object>} props.insights - Behavioral empirical insights
 * @param {Function} props.onNavigate - View navigation callback
 * @param {Function} props.onSelectReceipt - Receipt inspector callback
 * @param {Function} props.onOpenMoment - Moment story opener callback
 */
export function Home({
  receipts = [],
  connections = [],
  moments = [],
  insights = [],
  onNavigate,
  onSelectReceipt,
  onOpenMoment
}) {
  return (
    <div className="relative min-h-screen text-gray-100 space-y-24 pb-24 overflow-x-hidden">
      {/* 1. Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Interactive Dashboard Window (Three.js Constellation, Stats & Tables) */}
      <DashboardMockup
        receipts={receipts}
        connections={connections}
        moments={moments}
        onNavigate={onNavigate}
        onSelectReceipt={onSelectReceipt}
      />

      {/* 3. Pattern Recognition & Behavioral Insights */}
      <PatternDiscoveries insights={insights} />

      {/* 4. Featured Synchronized Life Moments */}
      <FeaturedMoments
        moments={moments}
        onNavigate={onNavigate}
        onOpenMoment={onOpenMoment}
      />
    </div>
  )
}
