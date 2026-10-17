import { ShoppingCart, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
  inCart: boolean
  onAdd: (product: Product) => void
  onRemove: (productId: string) => void
}

export function ProductCard({ product, inCart, onAdd, onRemove }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
    >
      {/* Product visual */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 h-36 flex items-center justify-center text-5xl select-none">
        {product.emoji}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
              {product.category}
            </p>
            <h3 className="font-display font-bold text-slate-900 text-sm leading-tight">
              {product.name}
            </h3>
          </div>
          <span className="text-sm font-bold text-blue-600 tabular-nums whitespace-nowrap">
            ${product.price}
          </span>
        </div>

        <p className="text-xs text-slate-500 text-pretty leading-relaxed flex-1">
          {product.description}
        </p>

        <button
          onClick={() => inCart ? onRemove(product.id) : onAdd(product)}
          className={[
            'mt-1 w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all',
            inCart
              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
              : 'bg-slate-900 text-white hover:bg-slate-700',
          ].join(' ')}
        >
          {inCart ? (
            <>
              <Check size={14} />
              Added
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
