'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { TrendingUp, Users, ShoppingCart, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Sample analytics data
const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 240, customers: 24 },
  { month: 'Feb', revenue: 3000, orders: 221, customers: 29 },
  { month: 'Mar', revenue: 2000, orders: 229, customers: 20 },
  { month: 'Apr', revenue: 2780, orders: 200, customers: 22 },
  { month: 'May', revenue: 1890, orders: 229, customers: 25 },
  { month: 'Jun', revenue: 2390, orders: 200, customers: 21 },
]

const categoryData = [
  { name: 'Electronics', value: 35, color: '#1f6feb' },
  { name: 'Wearables', value: 28, color: '#79c0ff' },
  { name: 'Accessories', value: 37, color: '#58a6ff' },
]

const topProducts = [
  { name: 'Wireless Headphones', sales: 1200, rating: 4.8 },
  { name: 'Smart Watch Pro', sales: 980, rating: 4.6 },
  { name: '4K Webcam', sales: 850, rating: 4.7 },
  { name: 'USB-C Hub', sales: 720, rating: 4.5 },
  { name: 'Phone Stand', sales: 650, rating: 4.4 },
]

const metrics = [
  {
    title: 'Total Revenue',
    value: '$18,490',
    change: '+12.5%',
    positive: true,
    icon: DollarSign,
  },
  {
    title: 'Total Orders',
    value: '1,319',
    change: '+8.3%',
    positive: true,
    icon: ShoppingCart,
  },
  {
    title: 'Total Customers',
    value: '141',
    change: '+5.2%',
    positive: true,
    icon: Users,
  },
  {
    title: 'Avg Order Value',
    value: '$140.22',
    change: '-2.1%',
    positive: false,
    icon: TrendingUp,
  },
]

export default function AnalyticsDashboard() {
  const { isAuthenticated, user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser && !isAuthenticated) {
      try {
        const parsedUser = JSON.parse(savedUser)
        useAuthStore.setState({ user: parsedUser, isAuthenticated: true })
      } catch (e) {
        console.error('Failed to restore auth state')
      }
    }
    setIsLoading(false)
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to view analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your business metrics and performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
                    <div className="flex items-center gap-1">
                      {metric.positive ? (
                        <>
                          <ArrowUp className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-500">{metric.change}</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-500">{metric.change}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f6feb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1f6feb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="month" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `$${value}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1f6feb"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Orders and Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Orders Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="month" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="#1f6feb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Customers Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Customer Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="month" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#79c0ff"
                  strokeWidth={2}
                  dot={{ fill: '#79c0ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Performing Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Product Name</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Sales</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="border-b border-border hover:bg-secondary/50 transition"
                  >
                    <td className="py-3 px-4 text-sm text-foreground">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-right text-foreground font-semibold">{product.sales}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="inline-flex items-center gap-1 text-accent">
                        {'⭐'.repeat(Math.floor(product.rating))}
                        <span className="text-muted-foreground">{product.rating}</span>
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
