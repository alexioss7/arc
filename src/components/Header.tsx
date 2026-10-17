import { ConnectKitButton } from 'connectkit'
import { ShoppingCart, Zap } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useUsdcBalance } from '@/hooks/useUsdcBalance'

interface HeaderProps {
  cartCount: number
  onCartOpen: () => void
}

export function Header({ cartCount, onCartOpen }: HeaderProps) {
  const { isConnected } = useAccount()
  const { formatted, isLoading } = useUsdcBalance()

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
            <Zap size={16} className="text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-900">
            Arc Store
          </span>
          <span className="hidden sm:inline text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
            Testnet
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* USDC Balance */}
          {isConnected && (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Balance</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {isLoading ? (
                  <span className="inline-block w-12 h-3.5 bg-slate-200 rounded animate-pulse" />
                ) : (
                  `$${Number(formatted ?? 0).toFixed(2)} USDC`
                )}
              </span>
            </div>
          )}

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 transition-colors text-white rounded-full px-3 py-1.5 text-sm font-medium"
            aria-label={`Open cart (${cartCount} items)`}
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <ConnectKitButton />
        </div>
      </div>
    </header>
  )
}
