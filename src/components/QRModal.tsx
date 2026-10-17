import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { MERCHANT_ADDRESS } from '@/hooks/useUsdcPayment'
import type { Product } from '@/data/products'

interface QRModalProps {
  isOpen: boolean
  items: Product[]
  total: string
  onClose: () => void
}

export function QRModal({ isOpen, items, total, onClose }: QRModalProps) {
  const [copied, setCopied] = useState(false)

  const memo = items.map(i => i.name).join(', ')
  const params = new URLSearchParams({ to: MERCHANT_ADDRESS, amount: total, memo })
  const paymentUrl = `${window.location.origin}?${params.toString()}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-slate-900">Payment QR</h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* QR */}
              <div className="flex items-center justify-center bg-white border border-slate-100 rounded-2xl p-4">
                <QRCodeSVG
                  value={paymentUrl}
                  size={200}
                  level="M"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>

              {/* Details */}
              <div className="bg-slate-50 rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total</span>
                  <span className="font-bold text-slate-900 tabular-nums">${total} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Items</span>
                  <span className="text-slate-700 text-right max-w-[160px] truncate">{memo}</span>
                </div>
              </div>

              {/* Copy link */}
              <button
                onClick={() => void handleCopy()}
                className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={15} className="text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy payment link
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
