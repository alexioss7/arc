export interface Product {
  id: string
  name: string
  description: string
  price: string // human-readable USDC, e.g. "0.50"
  category: string
  emoji: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'arc-tee',
    name: 'Arc T-Shirt',
    description: 'Soft cotton tee with the Arc logo. Ships in 3–5 days.',
    price: '1.00',
    category: 'Apparel',
    emoji: '👕',
  },
  {
    id: 'arc-mug',
    name: 'Arc Coffee Mug',
    description: 'Ceramic mug, 12 oz. Perfect for morning builds.',
    price: '0.75',
    category: 'Accessories',
    emoji: '☕',
  },
  {
    id: 'arc-cap',
    name: 'Arc Snapback Cap',
    description: 'Adjustable snap, structured brim. One size fits most.',
    price: '0.50',
    category: 'Apparel',
    emoji: '🧢',
  },
  {
    id: 'arc-sticker',
    name: 'Arc Sticker Pack',
    description: '5 holographic stickers. Weatherproof vinyl.',
    price: '0.10',
    category: 'Collectibles',
    emoji: '✨',
  },
  {
    id: 'arc-hoodie',
    name: 'Arc Hoodie',
    description: 'Heavyweight fleece. Kangaroo pocket.',
    price: '1.50',
    category: 'Apparel',
    emoji: '🧥',
  },
  {
    id: 'arc-notebook',
    name: 'Arc Dev Notebook',
    description: 'Dot-grid, 160 pages. Lay-flat binding.',
    price: '0.25',
    category: 'Accessories',
    emoji: '📓',
  },
]
