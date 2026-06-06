import { create } from 'zustand'
import { Product, Category, Brand } from '@/types'

interface ProductStore {
  products: Product[]
  categories: Category[]
  brands: Brand[]
  loading: boolean
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addCategory: (category: Category) => void
  addBrand: (brand: Brand) => void
  setProducts: (products: Product[]) => void
  setCategories: (categories: Category[]) => void
  setBrands: (brands: Brand[]) => void
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'electronics',
    brand: 'TechBrand',
    price: 299.99,
    discountPrice: 249.99,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    rating: 4.5,
    reviews: 128,
    tags: ['wireless', 'headphones', 'audio'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Feature-rich smartwatch with health monitoring',
    category: 'wearables',
    brand: 'TechBrand',
    price: 399.99,
    discountPrice: 349.99,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    rating: 4.3,
    reviews: 95,
    tags: ['smartwatch', 'fitness'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: '4K Webcam',
    slug: '4k-webcam',
    description: 'Professional 4K webcam for streaming',
    category: 'electronics',
    brand: 'ProTech',
    price: 189.99,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1606933248051-5ce98d2e4d43?w=500'],
    rating: 4.7,
    reviews: 156,
    tags: ['webcam', 'streaming'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '4',
    name: 'Gaming Mouse RGB',
    slug: 'gaming-mouse-rgb',
    description: 'High precision gaming mouse with RGB lighting',
    category: 'accessories',
    brand: 'GameTech',
    price: 49.99,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'],
    rating: 4.6,
    reviews: 210,
    tags: ['gaming', 'mouse'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '5',
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    category: 'accessories',
    brand: 'GameTech',
    price: 99.99,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500'],
    rating: 4.8,
    reviews: 340,
    tags: ['keyboard', 'gaming'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '6',
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    description: 'Portable bluetooth speaker with deep bass',
    category: 'electronics',
    brand: 'SoundMax',
    price: 79.99,
    stock: 65,
    images: ['https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500'],
    rating: 4.4,
    reviews: 180,
    tags: ['speaker', 'audio'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '7',
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    description: 'True wireless earbuds with ANC',
    category: 'electronics',
    brand: 'SoundMax',
    price: 129.99,
    discountPrice: 99.99,
    stock: 90,
    images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500'],
    rating: 4.5,
    reviews: 260,
    tags: ['earbuds', 'wireless'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '8',
    name: 'Laptop Stand',
    slug: 'laptop-stand',
    description: 'Adjustable aluminum laptop stand',
    category: 'accessories',
    brand: 'OfficePro',
    price: 39.99,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'],
    rating: 4.3,
    reviews: 88,
    tags: ['office', 'laptop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '9',
    name: 'USB-C Hub',
    slug: 'usb-c-hub',
    description: '7-in-1 USB-C hub for laptops',
    category: 'accessories',
    brand: 'OfficePro',
    price: 59.99,
    stock: 70,
    images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500'],
    rating: 4.4,
    reviews: 145,
    tags: ['usb-c', 'hub'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '10',
    name: 'Fitness Tracker',
    slug: 'fitness-tracker',
    description: 'Track steps, heart rate, and sleep',
    category: 'wearables',
    brand: 'FitTech',
    price: 89.99,
    stock: 110,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'],
    rating: 4.2,
    reviews: 134,
    tags: ['fitness', 'tracker'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '11',
    name: 'Gaming Headset',
    slug: 'gaming-headset',
    description: 'Surround sound gaming headset',
    category: 'electronics',
    brand: 'GameTech',
    price: 119.99,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=500'],
    rating: 4.7,
    reviews: 312,
    tags: ['gaming', 'headset'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: '12',
    name: 'Portable SSD 1TB',
    slug: 'portable-ssd-1tb',
    description: 'High-speed external SSD storage',
    category: 'electronics',
    brand: 'DataPro',
    price: 149.99,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500'],
    rating: 4.9,
    reviews: 410,
    tags: ['ssd', 'storage'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Wearables', slug: 'wearables' },
  { id: '3', name: 'Accessories', slug: 'accessories' },
]

const mockBrands: Brand[] = [
  { id: '1', name: 'TechBrand', slug: 'techbrand' },
  { id: '2', name: 'ProTech', slug: 'protech' },
]

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,
  categories: mockCategories,
  brands: mockBrands,
  loading: false,

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  addBrand: (brand) =>
    set((state) => ({
      brands: [...state.brands, brand],
    })),

  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setBrands: (brands) => set({ brands }),
}))
