'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/stores/cartStore'
import { useProductStore } from '@/lib/stores/productStore'
import { useAuthStore } from '@/lib/stores/authStore'
import { ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, appliedCoupon } = useCartStore()
  const { products } = useProductStore()
  const { user } = useAuthStore()
  const [step, setStep] = useState<'shipping' | 'billing' | 'payment' | 'confirmation'>(
    'shipping'
  )
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    shippingAddress: user?.address || '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'United States',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'United States',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

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
      (appliedCoupon.discountType === 'percentage' ? appliedCoupon.discountValue / 100 : 0)
    : 0
  const total = subtotal + tax + shipping - discount

  if (cartItems.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add items to your cart before checking out
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.shippingAddress && formData.shippingCity && formData.shippingZip) {
      setStep('billing')
    }
  }

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (sameAsShipping || (formData.billingAddress && formData.billingCity)) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create order
    const order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id || 'guest',
      items: items,
      status: 'processing' as const,
      total: total,
      tax: tax,
      shipping: shipping,
      shippingAddress: `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingState} ${formData.shippingZip}`,
      billingAddress: sameAsShipping
        ? `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingState} ${formData.shippingZip}`
        : `${formData.billingAddress}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`,
      timeline: [
        {
          status: 'processing' as const,
          timestamp: new Date().toISOString(),
          description: 'Order has been placed and is being processed',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save order to localStorage (in a real app, this would be sent to a backend)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))

    // Clear cart and navigate to confirmation
    clearCart()
    setStep('confirmation')
    setIsProcessing(false)
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. We&apos;ve sent a confirmation email to{' '}
                <span className="font-semibold text-foreground">{formData.email}</span>
              </p>

              <div className="bg-card border border-border rounded-xl p-8 mb-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Order Number
                    </h3>
                    <p className="text-2xl font-bold text-foreground">
                      {JSON.parse(localStorage.getItem('orders') || '[]').pop()?.id || 'N/A'}
                    </p>
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Order Total
                    </h3>
                    <p className="text-2xl font-bold text-accent">${total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                    Shipping Address
                  </h3>
                  <p className="text-foreground">
                    {formData.firstName} {formData.lastName}
                    <br />
                    {formData.shippingAddress}
                    <br />
                    {formData.shippingCity}, {formData.shippingState} {formData.shippingZip}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'billing', label: 'Billing' },
    { id: 'payment', label: 'Payment' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      index <= currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-secondary'
                    }`}
                  />
                  {index === steps.length - 1 && (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        index <= currentStepIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              {steps.map((s) => (
                <span key={s.id} className="text-muted-foreground">
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {/* Shipping Form */}
              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Shipping Address</h2>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="shippingState"
                          value={formData.shippingState}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="shippingZip"
                          value={formData.shippingZip}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Country
                      </label>
                      <select
                        name="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2 mt-6"
                    >
                      Continue to Billing
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Billing Form */}
              {step === 'billing' && (
                <form onSubmit={handleBillingSubmit} className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Billing Address</h2>

                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="w-4 h-4 border border-border rounded"
                      />
                      <span className="text-foreground">Same as shipping address</span>
                    </label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="billingState"
                            value={formData.billingState}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="billingZip"
                            value={formData.billingZip}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2"
                    >
                      Continue to Payment
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Payment Form */}
              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Payment Method</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="Full name on card"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cardCVC"
                          value={formData.cardCVC}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep('billing')}
                        className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50"
                      >
                        {isProcessing ? 'Processing...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card border border-border rounded-xl p-6 sticky top-4">
                <h2 className="text-lg font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.product?.name} x{item.quantity}
                      </span>
                      <span className="text-foreground font-semibold">
                        $
                        {(
                          (item.product?.discountPrice || item.product?.price || 0) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 pb-6 border-b border-border text-sm">
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

                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
