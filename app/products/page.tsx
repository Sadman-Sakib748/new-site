'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import { useProductStore } from '@/lib/stores/productStore'
import { useCartStore } from '@/lib/stores/cartStore'
import { Star, ShoppingCart, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductsPage() {
  const { products, categories } = useProductStore()
  const { addToCart } = useCartStore()

  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
        )
        break
      case 'price-high':
        filtered = [...filtered].sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
        )
        break
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    return filtered
  }, [products, selectedCategory, searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">All Products</h1>

          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg"
          />
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 sticky top-4">

              <h3 className="flex items-center gap-2 font-semibold mb-6">
                <Filter className="w-4 h-4" />
                Filters
              </h3>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-4">Category</h4>

                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left px-3 py-2 rounded-lg ${
                    selectedCategory === '' ? 'bg-primary text-white' : ''
                  }`}
                >
                  All Categories
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      selectedCategory === cat.slug ? 'bg-primary text-white' : ''
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* SORT */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full border rounded-lg p-2"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price Low</option>
                <option value="price-high">Price High</option>
                <option value="rating">Top Rated</option>
              </select>

            </div>
          </aside>

          {/* PRODUCTS */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-card border rounded-xl overflow-hidden"
                  >

                    {/* IMAGE + LINK */}
                    <Link href={`/products/${product.id}`}>
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    </Link>

                    {/* CONTENT */}
                    <div className="p-6">

                      <h3 className="font-semibold mb-2">
                        {product.name}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description}
                      </p>

                      {/* RATING */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0)
                                ? 'fill-accent text-accent'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>

                      {/* PRICE */}
                      <div className="flex items-center gap-2 mb-4">
                        {product.discountPrice ? (
                          <>
                            <span className="font-bold text-accent">
                              ${product.discountPrice.toFixed(2)}
                            </span>
                            <span className="line-through text-muted-foreground">
                              ${product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-accent">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* STOCK */}
                      <div className="mb-4 text-sm">
                        {product.stock > 0 ? (
                          <span className="text-green-500">In Stock</span>
                        ) : (
                          <span className="text-red-500">Out of Stock</span>
                        )}
                      </div>

                      {/* BUTTON */}
                      <button
                        onClick={() =>
                          addToCart({ productId: product.id, quantity: 1 })
                        }
                        disabled={product.stock === 0}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>

                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="col-span-3 text-center text-muted-foreground">
                  No products found
                </p>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}