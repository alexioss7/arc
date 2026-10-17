import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Loader2, ExternalLink, ArrowRight } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useUsdcPayment, MERCHANT_ADDRESS } from '@/hooks/useUsdcPayment'
import { buildTxExplorerUrl } from '@/onchain-facts'
import { arcTestnet } from 'viem/chains'
import type { Product } from '@/data/products'

interface PaymentSheetProps {
  isOpen: boolean
  items: Product[]
  total: string
  onClose: () => void
  onSuccess: (hash: string) => void
}

export function PaymentSheet({ isOpen, items, total, onClose, onSuccess }: PaymentSheetProps) {
  const { isConnected } = useAccount()
  const {
    pay,
    hash,
    isWritePending,
    isConfirming,
    isSuccess,
    error,
    reset,
    isWrongChain,
  } = useUsdcPayment()

  const handlePay = async () => {
    try {
      const txHash = await pay(total)
      if (txHash) {
        onSuccess(txHash)
      }
    } catch {
      // error state shown via `error` from hook
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const explorerUrl = hash ? buildTxExplorerUrl(arcTestnet.id, hash) : undefined

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isWritePending && !isConfirming ? handleClose : undefined}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-w-md mx-auto"
          >
            <div className="px-5 pt-4 pb-8 space-y-5">
              {/* Handle + close */}
              <div className="flex items-center justify-between">
                <div className="mx-auto w-10 h-1 bg-slate-200 rounded-full absolute left-1/2 -translate-x-1/2 top-3" />
                <div />
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Success state */}
              {isSuccess && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-3 py-4 text-center"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg text-slate-900">Payment complete!</p>
                    <p className="text-sm text-slate-500 mt-1">
                      ${total} USDC sent successfully on Arc Testnet
                    </p>
                  </div>
                  {explorerUrl && (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View on explorer <ExternalLink size={13} />
                    </a>
                  )}
                  <button
                    onClick={handleClose}
                    className="mt-2 w-full h-11 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              )}

              {/* Error state */}
              {error && !isSuccess && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Transaction failed</p>
                      <p className="text-xs text-red-600 mt-0.5 break-words">
                        {((error as {shortMessage?: string}).shortMessage) ?? (error as Error).message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => reset()}
                    className="w-full h-11 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Pending / idle */}
              {!isSuccess && !error && (
                <>
                  <div>
                    <p className="font-display font-bold text-xl text-slate-900">Confirm Payment</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {items.length} item{items.length !== 1 ? 's' : ''} — USDC on Arc Testnet
                    </p>
                  </div>

                  {/* Wrong chain warning */}
                  {isWrongChain && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                      <AlertCircle size={15} className="text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-800 font-medium">
                        Wallet is on the wrong network. Click Pay — it will switch automatically.
                      </p>
                    </div>
                  )}

                  {/* Order summary */}
                  <div className="bg-slate-50 rounded-xl px-4 py-3 space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 flex items-center gap-2">
                          <span>{item.emoji}</span>
                          {item.name}
                        </span>
                        <span className="font-medium text-slate-900 tabular-nums">${item.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="font-bold text-slate-900 tabular-nums">${total} USDC</span>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Recipient</span>
                    <span className="font-mono truncate max-w-[180px]">{MERCHANT_ADDRESS}</span>
                  </div>

                  {/* Not connected */}
                  {!isConnected && (
                    <p className="text-center text-sm text-slate-500">
                      Connect your wallet to pay
                    </p>
                  )}

                  {/* Pay button */}
                  {isConnected && (
                    <button
                      onClick={() => void handlePay()}
                      disabled={isWritePending || isConfirming}
                      className="w-full h-12 bg-slate-900 hover:bg-slate-700 disabled:bg-slate-300 transition-colors text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      {isWritePending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Waiting for wallet…
                        </>
                      ) : isConfirming ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Confirming…
                        </>
                      ) : (
                        <>
                          Pay ${total} USDC
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
