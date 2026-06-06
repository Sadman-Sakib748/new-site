import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
}

const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@example.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  'vendor@example.com': {
    password: 'vendor123',
    user: {
      id: '2',
      email: 'vendor@example.com',
      name: 'Vendor User',
      role: 'vendor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vendor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  'customer@example.com': {
    password: 'customer123',
    user: {
      id: '3',
      email: 'customer@example.com',
      name: 'Customer User',
      role: 'customer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })

        await new Promise((r) => setTimeout(r, 400))

        const key = email.trim().toLowerCase()
        const found = mockUsers[key]

        if (!found || found.password !== password) {
          set({ isLoading: false })
          throw new Error('Invalid credentials')
        }

        set({
          user: found.user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      register: async (email, password, name) => {
        set({ isLoading: true })

        await new Promise((r) => setTimeout(r, 400))

        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          role: 'customer',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })

        localStorage.removeItem('auth-storage')
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)