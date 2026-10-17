import { useState } from 'react'
import { X, Droplets } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useUsdcBalance } from '@/hooks/useUsdcBalance'

export function FaucetBanner() {
  const { isConnected } = useAccount()
  const { formatted, isLoading } = useUsdcBalance()
  const [dismissed, setDismissed] = useState(false)

  const isZero = !isLoading && formatted !== undefined && Number(formatted) === 0

  if (!isConnected || !isZero || dismissed) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3">
      <Droplets size={18} className="text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900">Your USDC balance is zero</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Get free testnet USDC from the{' '}
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 font-medium hover:text-amber-900"
          >
            Circle Faucet
          </a>{' '}
          or use Arc Studio&apos;s built-in &quot;Get test USDC&quot; button in the sidebar.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="text-amber-500 hover:text-amber-700 shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  )
}
