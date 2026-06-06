'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Eye, Printer } from 'lucide-react'
import { motion } from 'framer-motion'

export default function OrdersAdminPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
      router.push('/login')
    }
  }, [user, router])

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      total: 299.99,
      status: 'delivered',
      date: '2024-01-15',
      items: 3,
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      total: 599.99,
      status: 'processing',
      date: '2024-01-14',
      items: 2,
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      total: 199.99,
      status: 'shipped',
      date: '2024-01-13',
      items: 1,
    },
    {
      id: 'ORD-004',
      customer: 'Alice Williams',
      total: 449.99,
      status: 'pending',
      date: '2024-01-12',
      items: 4,
    },
  ]

  const filteredOrders = mockOrders.filter((order) =>
    filter === 'all' ? true : order.status === filter
  )

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    processing: 'bg-blue-500/20 text-blue-500',
    shipped: 'bg-purple-500/20 text-purple-500',
    delivered: 'bg-green-500/20 text-green-500',
    cancelled: 'bg-destructive/20 text-destructive',
    refunded: 'bg-orange-500/20 text-orange-500',
  }

  if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Order Management
            </h1>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-8 flex-wrap">
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg capitalize transition font-semibold ${
                    filter === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-accent'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border hover:bg-secondary/30 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {order.items} item{order.items !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-accent font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                          statusColors[order.status as keyof typeof statusColors]
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-foreground hover:bg-secondary/50 rounded-lg transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-foreground hover:bg-secondary/50 rounded-lg transition">
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
              <h3 className="text-2xl font-bold text-foreground">{mockOrders.length}</h3>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-500">
                {mockOrders.filter((o) => o.status === 'pending').length}
              </h3>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Processing</p>
              <h3 className="text-2xl font-bold text-blue-500">
                {mockOrders.filter((o) => o.status === 'processing').length}
              </h3>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Delivered</p>
              <h3 className="text-2xl font-bold text-green-500">
                {mockOrders.filter((o) => o.status === 'delivered').length}
              </h3>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
