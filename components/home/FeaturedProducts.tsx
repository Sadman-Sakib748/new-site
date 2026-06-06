'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

import { useProductStore } from '@/lib/stores/productStore'
import Image from 'next/image'

export default function FeaturedProducts() {
  const { products } = useProductStore()

  const featured = products.slice(0, 6)

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold">
            Featured Products
          </h2>
        </motion.div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-3 gap-5">

          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              viewport={{ once: true }}
              className="group bg-card border rounded-xl overflow-hidden"
            >

              {/* IMAGE */}
              <div className="aspect-[4/3] overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-cover group-hover:scale-110 transition"
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                <h3 className="font-semibold">
                  {product.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>

                {/* PRICE */}
                <div className="mt-2 font-bold">
                  ${product.price}
                </div>

                {/* VIEW BUTTON */}
                <Link
                  href={`/products/${product.id}`}
                  className="mt-4 block text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  View
                </Link>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  )
}