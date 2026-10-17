import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Trash2, History } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildTxExplorerUrl } from '@/onchain-facts'
import { arcTestnet } from 'viem/chains'
import type { TxRecord } from '@/hooks/useTxHistory'

interface TxHistoryProps {
  records: TxRecord[]
  onClear: () => void
}

function truncateHash(hash: string) {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TxHistory({ records, onClear }: TxHistoryProps) {
  const [expanded, setExpanded] = useState(false)

  if (records.length === 0) return null

  return (
    <section>
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <div className="flex items-center gap-2">
          <History size={16} className="text-slate-400" />
          <span className="font-display font-bold text-slate-900">Purchase History</span>
          <span className="text-xs font-medium bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
            {records.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pb-4">
              {records.map(tx => (
                <div
                  key={tx.hash}
                  className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 tabular-nums">
                        ${tx.total} USDC
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(tx.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{tx.items}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="font-mono text-[11px] text-slate-400">
                        {truncateHash(tx.hash)}
                      </span>
                      <a
                        href={buildTxExplorerUrl(arcTestnet.id, tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="View on explorer"
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={onClear}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors py-2"
              >
                <Trash2 size={13} />
                Clear history
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
