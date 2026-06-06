'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

import { useAuthStore } from '@/lib/stores/authStore'
import { useProductStore } from '@/lib/stores/productStore'

import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()

  const { user } = useAuthStore()
  const { products } = useProductStore()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!user) {
      router.replace('/login')
      return
    }

    if (
      user.role !== 'admin' &&
      user.role !== 'super-admin'
    ) {
      router.replace('/login')
    }
  }, [mounted, user, router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-medium">Loading...</h2>
      </div>
    )
  }

  if (!user) return null

  const stats = [
    {
      label: 'Total Revenue',
      value: '$125,430',
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      label: 'Orders',
      value: '1,234',
      icon: ShoppingCart,
      color: 'text-blue-500',
    },
    {
      label: 'Products',
      value: products.length.toString(),
      icon: Package,
      color: 'text-purple-500',
    },
    {
      label: 'Users',
      value: '5,678',
      icon: Users,
      color: 'text-orange-500',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user.name}
            </h1>

            <p className="text-muted-foreground">
              Here&apos;s your business overview
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {stat.label}
                      </p>

                      <h3 className="text-2xl font-bold">
                        {stat.value}
                      </h3>
                    </div>

                    <div
                      className={`p-3 rounded-lg bg-secondary/50 ${stat.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <Link href="/admin/products">
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition group"
              >
                <Package className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition" />

                <h3 className="font-semibold mb-2">
                  Product Management
                </h3>

                <p className="text-sm text-muted-foreground">
                  Create, edit, and manage your product catalog
                </p>
              </motion.div>
            </Link>

            <Link href="/admin/orders">
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition group"
              >
                <ShoppingCart className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition" />

                <h3 className="font-semibold mb-2">
                  Order Management
                </h3>

                <p className="text-sm text-muted-foreground">
                  Track and manage customer orders
                </p>
              </motion.div>
            </Link>

            <Link href="/admin/users">
              <motion.div
                whileHover={{ y: -5 }}
                className="cursor-pointer bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition group"
              >
                <Users className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition" />

                <h3 className="font-semibold mb-2">
                  User Management
                </h3>

                <p className="text-sm text-muted-foreground">
                  Manage customers, vendors, and admins
                </p>
              </motion.div>
            </Link>

          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-6">
              Recent Activity
            </h3>

            <div className="space-y-4">
              {[
                {
                  event: 'New order received',
                  time: '2 hours ago',
                },
                {
                  event: 'Product inventory updated',
                  time: '4 hours ago',
                },
                {
                  event: 'Customer review added',
                  time: '6 hours ago',
                },
                {
                  event: 'New vendor application',
                  time: 'Yesterday',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-4 border-b border-border last:border-b-0"
                >
                  <span>{item.event}</span>

                  <span className="text-sm text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  )
}