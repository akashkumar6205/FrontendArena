import React from 'react'
import { motion } from 'framer-motion'
import { X, Clock, Calendar, MapPin, GitMerge, ArrowRight } from 'lucide-react'

/**
 * Inspection modal for examining individual receipt metadata and connected life events.
 */
export function ReceiptDetailModal({ receipt, connections = [], onClose, onSelectConnected }) {
  if (!receipt) return null

  // Find all connections involving this receipt
  const relevantConns = connections.filter(
    c => c.source === receipt.id || c.target === receipt.id
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              {receipt.type} RECEIPT
            </span>
            <span className="text-xs font-mono text-zinc-400">
              ID: #{receipt.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1 space-y-6 flex-1">
          {/* Main Title & Description */}
          <div>
            <h2 className="text-2xl font-receipt font-bold text-white">
              {receipt.title}
            </h2>
            <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
              {receipt.description}
            </p>
          </div>

          {/* Time & Location Pill */}
          <div className="p-4 rounded-2xl glass-card space-y-2 font-mono text-xs text-zinc-300">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Date: {receipt.date}
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Time: {receipt.time}
              </span>
            </div>

            {receipt.amount !== null && (
              <div className="pt-2 border-t border-dark-border flex justify-between items-center text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-emerald-400">${receipt.amount.toFixed(2)} {receipt.currency}</span>
              </div>
            )}

            {receipt.location && (
              <div className="pt-2 border-t border-dark-border flex items-start gap-1.5 text-cyan-300">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{receipt.location.name}</span>
                  <div className="text-[11px] text-gray-400">{receipt.location.address}</div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Section */}
          <div>
            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
              Raw Record Metadata
            </h4>
            <div className="bg-dark-paper border border-dark-border rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto space-y-1">
              {Object.entries(receipt.metadata || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="text-gray-400">{key}:</span>
                  <span className="text-white font-semibold truncate">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Receipts Section */}
          {relevantConns.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
                Discovered Connections ({relevantConns.length})
              </h4>

              <div className="space-y-2">
                {relevantConns.map((conn, idx) => {
                  const other = conn.r1.id === receipt.id ? conn.r2 : conn.r1
                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectConnected && onSelectConnected(other)}
                      className="p-3 rounded-xl bg-dark-card border border-dark-border hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-receipt font-bold text-white">
                          {other.title}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                          {conn.reasons[0]}
                        </div>
                      </div>

                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-dark-border text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-dark-card border border-dark-border text-xs font-semibold text-gray-300 hover:text-white"
          >
            Close Receipt
          </button>
        </div>
      </motion.div>
    </div>
  )
}
