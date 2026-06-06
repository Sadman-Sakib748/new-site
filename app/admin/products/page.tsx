'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { useProductStore } from '@/lib/stores/productStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Edit2, Trash2, Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProductsAdminPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProductStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
  })

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
      router.push('/login')
    }
  }, [user, router])

  if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
    return null
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateProduct(editingId, {
        ...formData,
        price: parseFloat(formData.price.toString()),
        discountPrice: parseFloat(formData.discountPrice.toString()),
        stock: parseInt(formData.stock.toString()),
      })
      setEditingId(null)
    } else {
      addProduct({
        id: Math.random().toString(36).substr(2, 9),
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...formData,
        price: parseFloat(formData.price.toString()),
        discountPrice: parseFloat(formData.discountPrice.toString()),
        stock: parseInt(formData.stock.toString()),
      } as any)
    }
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      discountPrice: 0,
      stock: 0,
    })
    setShowForm(false)
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock,
    })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Product Management
              </h1>
              <p className="text-muted-foreground">
                Manage your product catalog
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
                setFormData({
                  name: '',
                  description: '',
                  category: '',
                  price: 0,
                  discountPrice: 0,
                  stock: 0,
                })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </motion.div>

          {/* Product Table */}
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
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border hover:bg-secondary/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">
                          {product.name}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground font-semibold">
                          ${product.price.toFixed(2)}
                        </div>
                        {product.discountPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ${product.discountPrice.toFixed(2)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 0
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-destructive/20 text-destructive'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-foreground hover:bg-secondary/50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
                          >
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

          {/* Add/Edit Form Modal */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {editingId ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: parseFloat(e.target.value) })
                        }
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Discount Price
                      </label>
                      <input
                        type="number"
                        value={formData.discountPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, discountPrice: parseFloat(e.target.value) })
                        }
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
                    >
                      {editingId ? 'Update' : 'Add'} Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
