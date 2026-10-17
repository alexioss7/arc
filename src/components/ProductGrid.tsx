import { ProductCard } from './ProductCard'
import type { Product } from '@/data/products'

interface ProductGridProps {
  products: Product[]
  cartIds: Set<string>
  onAdd: (product: Product) => void
  onRemove: (productId: string) => void
}

export function ProductGrid({ products, cartIds, onAdd, onRemove }: ProductGridProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
          Available Items
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          All prices in USDC on Arc Testnet
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            inCart={cartIds.has(product.id)}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}
