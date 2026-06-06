'use client'

import Link from 'next/link'
import { useProductStore } from '@/lib/stores/productStore'
import { motion } from 'framer-motion'
import { Package, Watch, Zap } from 'lucide-react'

export default function Categories() {
  const { categories } = useProductStore()

  const categoryIcons = {
    electronics: Zap,
    wearables: Watch,
    accessories: Package,
  }

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse products across our main categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, i) => {
            const Icon =
              categoryIcons[category.slug as keyof typeof categoryIcons] ||
              Package
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block bg-card border border-border rounded-xl p-8 hover:border-accent transition-all h-full"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
