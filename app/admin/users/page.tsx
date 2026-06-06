'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, AlertCircle, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UsersAdminPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
      router.push('/login')
    }
  }, [user, router])

  // Mock users data
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-01',
      orders: 5,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'vendor',
      status: 'active',
      joinDate: '2024-01-05',
      orders: 12,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'customer',
      status: 'suspended',
      joinDate: '2024-01-10',
      orders: 0,
    },
    {
      id: '4',
      name: 'Alice Williams',
      email: 'alice@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-15',
      orders: 0,
    },
  ]

  const roleColors = {
    customer: 'bg-blue-500/20 text-blue-500',
    vendor: 'bg-purple-500/20 text-purple-500',
    admin: 'bg-red-500/20 text-red-500',
    'super-admin': 'bg-orange-500/20 text-orange-500',
  }

  const statusColors = {
    active: 'bg-green-500/20 text-green-500',
    suspended: 'bg-yellow-500/20 text-yellow-500',
    banned: 'bg-destructive/20 text-destructive',
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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage users, vendors, and admins
            </p>
          </motion.div>

          {/* Users Table */}
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
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Join Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border hover:bg-secondary/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{u.name}</div>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                          roleColors[u.role as keyof typeof roleColors]
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                          statusColors[u.status as keyof typeof statusColors]
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground">{u.orders}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(u.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {u.status === 'active' ? (
                            <button className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition">
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition">
                              <Shield className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Users</p>
              <h3 className="text-2xl font-bold text-foreground">{mockUsers.length}</h3>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Customers</p>
              <h3 className="text-2xl font-bold text-blue-500">
                {mockUsers.filter((u) => u.role === 'customer').length}
              </h3>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Vendors</p>
              <h3 className="text-2xl font-bold text-purple-500">
                {mockUsers.filter((u) => u.role === 'vendor').length}
              </h3>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Active</p>
              <h3 className="text-2xl font-bold text-green-500">
                {mockUsers.filter((u) => u.status === 'active').length}
              </h3>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
