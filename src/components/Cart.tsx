import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ShoppingBag, QrCode } from 'lucide-react'
import type { Product } from '@/data/products'

interface CartProps {
  isOpen: boolean
  items: Product[]
  total: string
  onClose: () => void
  onRemove: (id: string) => void
  onClear: () => void
  onPay: () => void
  onShowQR: () => void
}

export function Cart({ isOpen, items, total, onClose, onRemove, onClear, onPay, onShowQR }: CartProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-slate-600" />
                <h2 className="font-display font-bold text-slate-900">Your Cart</h2>
                {items.length > 0 && (
                  <span className="text-xs font-medium bg-blue-100 text-blue-600 rounded-full px-2 py-0.5">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <ShoppingBag size={40} className="text-slate-200" />
                  <p className="text-slate-400 text-sm">Your cart is empty</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.category}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">${item.price}</span>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors ml-1"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-5 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums">${total} USDC</span>
                </div>

                <button
                  onClick={onPay}
                  className="w-full h-12 bg-slate-900 hover:bg-slate-700 transition-colors text-white rounded-xl font-semibold text-sm"
                >
                  Pay with USDC
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={onShowQR}
                    className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <QrCode size={15} />
                    Share QR
                  </button>
                  <button
                    onClick={onClear}
                    className="flex-1 h-10 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={14} />
                    Clear
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
