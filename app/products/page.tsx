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
  const [selectedCategory, setSelectedCategory] = useState<string>('')
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

    // Sort
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
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl font-bold text-foreground mb-4">All Products</h1>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card border border-border rounded-xl p-6 sticky top-4">
                <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Category</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === ''
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === cat.slug
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-all"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden bg-secondary/20 aspect-square">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discountPrice && (
                          <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-lg text-sm font-semibold">
                            Sale
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition line-clamp-2 mb-2">
                          {product.name}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                                  ? 'fill-accent text-accent'
                                  : 'text-muted'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {product.reviews}
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center gap-3 mb-6">
                          {product.discountPrice ? (
                            <>
                              <span className="text-xl font-bold text-accent">
                                ${product.discountPrice.toFixed(2)}
                              </span>
                              <span className="text-sm line-through text-muted-foreground">
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-accent">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Stock */}
                        <div className="text-sm text-muted-foreground mb-6">
                          {product.stock > 0 ? (
                            <span className="text-green-500">In Stock</span>
                          ) : (
                            <span className="text-destructive">Out of Stock</span>
                          )}
                        </div>
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1 text-center px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition"
                        >
                          View
                        </Link>
                        {/* Actions */}
                        <button
                          onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                          disabled={product.stock === 0}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground text-lg">No products found</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
