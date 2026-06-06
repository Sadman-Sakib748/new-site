'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  ShoppingCart,
  Menu,
  ChevronDown,
  User,
  Package,
  LogOut,
} from 'lucide-react'

import { useAuthStore } from '@/lib/stores/authStore'
import { useCartStore } from '@/lib/stores/cartStore'
import Image from 'next/image'

export default function Header() {
  const router = useRouter()

  const { user, logout } = useAuthStore()
  const { items } = useCartStore()

  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const cartCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  // FIX: hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setProfileOpen(false)
    window.addEventListener('click', handleClick)

    return () =>
      window.removeEventListener('click', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    setMenuOpen(false)

    router.push('/login')
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-primary-foreground">
                E
              </span>
            </div>

            <span className="hidden text-xl font-bold sm:block">
              ECommerce Pro
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products">Products</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/about">About</Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* CART */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER */}
            {user ? (
              <div
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted"
                >

                  <Image
                    src={user.avatar || '/placeholder.png'}
                    alt={user.name || 'User'}
                    className="h-9 w-9 rounded-full"
                    fill
                  />

                  <span className="hidden sm:block text-sm">
                    {user.name}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 transition ${profileOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-card shadow-lg z-50">

                    {/* USER INFO */}
                    <div className="border-b p-4">
                      <p className="font-semibold">
                        {user.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    {/* DASHBOARD (ROLE BASED) */}
                    <Link
                      href={`/${user.role}/dashboard`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>

                    {/* ORDERS */}
                    <Link
                      href="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted"
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">Login</Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* MOBILE MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

          </div>
        </div>

        {/* MOBILE NAV */}
        {menuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">

              <Link href="/products" onClick={() => setMenuOpen(false)}>
                Products
              </Link>

              <Link href="/categories" onClick={() => setMenuOpen(false)}>
                Categories
              </Link>

              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>

              {!user && (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/register">Sign Up</Link>
                </>
              )}

              {user && (
                <button
                  onClick={handleLogout}
                  className="text-left text-red-500"
                >
                  Logout
                </button>
              )}

            </div>
          </div>
        )}

      </div>
    </header>
  )
}