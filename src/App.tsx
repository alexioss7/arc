import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { Header } from '@/components/Header'
import { ProductGrid } from '@/components/ProductGrid'
import { Cart } from '@/components/Cart'
import { PaymentSheet } from '@/components/PaymentSheet'
import { QRModal } from '@/components/QRModal'
import { TxHistory } from '@/components/TxHistory'
import { FaucetBanner } from '@/components/FaucetBanner'
import { useTxHistory } from '@/hooks/useTxHistory'
import { useUsdcBalance } from '@/hooks/useUsdcBalance'
import { PRODUCTS, type Product } from '@/data/products'

export default function App() {
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)

  const { records, addRecord, clearHistory } = useTxHistory()
  const { refetch: refetchBalance } = useUsdcBalance()

  const cartIds = useMemo(() => new Set(cartItems.map(i => i.id)), [cartItems])

  const total = useMemo(
    () =>
      cartItems
        .reduce((sum, item) => sum + parseFloat(item.price), 0)
        .toFixed(2),
    [cartItems],
  )

  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => (prev.find(i => i.id === product.id) ? prev : [...prev, product]))
    toast.success(`${product.name} added to cart`)
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const handlePaySuccess = useCallback(
    (hash: string) => {
      addRecord({
        hash,
        items: cartItems.map(i => i.name).join(', '),
        total,
        timestamp: Date.now(),
      })
      setPayOpen(false)
      setCartOpen(false)
      clearCart()
      void refetchBalance()
      toast.success('Payment confirmed! Check your history below.')
    },
    [addRecord, cartItems, total, clearCart, refetchBalance],
  )

  return (
    <div className="min-h-dvh bg-slate-50 font-body">
      <Header cartCount={cartItems.length} onCartOpen={() => setCartOpen(true)} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Faucet banner */}
        <FaucetBanner />

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 70% 30%, #60a5fa 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-2">
              Powered by Arc Testnet
            </p>
            <h1 className="font-display font-bold text-3xl tracking-tight text-balance">
              Pay instantly with USDC.
              <br />No ETH needed.
            </h1>
            <p className="text-slate-300 text-sm mt-3 text-pretty max-w-xs">
              Sub-second finality. USDC as the gas token. Shop and pay in one asset.
            </p>
          </div>
        </div>

        {/* Products */}
        <ProductGrid
          products={PRODUCTS}
          cartIds={cartIds}
          onAdd={addToCart}
          onRemove={removeFromCart}
        />

        {/* TX History */}
        <TxHistory records={records} onClear={clearHistory} />
      </main>

      {/* Cart drawer */}
      <Cart
        isOpen={cartOpen}
        items={cartItems}
        total={total}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onClear={clearCart}
        onPay={() => { setCartOpen(false); setPayOpen(true) }}
        onShowQR={() => { setCartOpen(false); setQrOpen(true) }}
      />

      {/* Payment sheet */}
      <PaymentSheet
        isOpen={payOpen}
        items={cartItems}
        total={total}
        onClose={() => setPayOpen(false)}
        onSuccess={handlePaySuccess}
      />

      {/* QR modal */}
      <QRModal
        isOpen={qrOpen}
        items={cartItems}
        total={total}
        onClose={() => setQrOpen(false)}
      />
    </div>
  )
}
