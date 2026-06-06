export type UserRole = 'customer' | 'vendor' | 'admin' | 'super-admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  banner?: string
  parent?: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  brand: string
  price: number
  discountPrice?: number
  stock: number
  images: string[]
  video?: string
  variants?: ProductVariant[]
  specifications?: Record<string, string>
  rating?: number
  reviews?: number
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  color?: string
  size?: string
  sku: string
  stock: number
  price?: number
}

export interface CartItem {
  productId: string
  quantity: number
  variant?: ProductVariant
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  total: number
  tax: number
  shipping: number
  discountCode?: string
  discountAmount?: number
  shippingAddress: string
  billingAddress: string
  timeline: OrderTimeline[]
  createdAt: string
  updatedAt: string
}

export interface OrderTimeline {
  status: Order['status']
  timestamp: string
  description: string
}

export interface Coupon {
  id: string
  code: string
  discountType: 'fixed' | 'percentage'
  discountValue: number
  maxUses?: number
  usedCount: number
  expiryDate?: string
  minOrderValue?: number
  active: boolean
}

export interface WishlistItem {
  productId: string
  addedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'order' | 'product' | 'system' | 'promotion'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface DashboardStats {
  revenue: number
  orders: number
  products: number
  users: number
  vendors: number
  inventory: number
}
