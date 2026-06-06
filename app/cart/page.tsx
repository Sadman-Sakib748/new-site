'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/stores/cartStore'
import { useProductStore } from '@/lib/stores/productStore'
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, appliedCoupon } =
    useCartStore()
  const { products } = useProductStore()

  const cartItems = items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product)

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.product?.discountPrice || item.product?.price || 0) * item.quantity,
    0
  )

  const tax = subtotal * 0.1
  const shipping = subtotal > 100 ? 0 : 10
  const discount = appliedCoupon
    ? subtotal *
    (appliedCoupon.discountType === 'percentage'
      ? appliedCoupon.discountValue / 100
      : 0)
    : 0
  const total = subtotal + tax + shipping - discount

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Start shopping to add items to your cart
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {cartItems.map((item, i) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-6 border-b border-border last:border-b-0"
                  >
                    {/* Product Image */}
                    <Image
                      src={item.product?.images?.[0] || '/placeholder.png'}
                      alt={item.product?.name || 'Product'}
                      width={100}
                      height={100}
                      className="object-cover rounded-lg"
                    />
                    <div className="aspect-[4/3] overflow-hidden relative">

                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        ${(item.product?.discountPrice || item.product?.price || 0).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="p-1 text-muted-foreground hover:text-foreground transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-foreground font-semibold min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="p-1 text-muted-foreground hover:text-foreground transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent mb-4">
                        $
                        {(
                          (item.product?.discountPrice || item.product?.price || 0) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => clearCart()}
                className="mt-6 text-sm text-destructive hover:text-destructive/80 transition"
              >
                Clear Cart
              </button>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card border border-border rounded-xl p-6 sticky top-4">
                <h2 className="text-lg font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold mb-4"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="block text-center px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
