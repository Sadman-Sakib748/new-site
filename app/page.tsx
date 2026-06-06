'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import Hero from '@/components/home/Hero'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Categories from '@/components/home/Categories'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function Home() {
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        useAuthStore.setState({ user, isAuthenticated: true })
      } catch (e) {
        localStorage.removeItem('auth_user')
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeaturedProducts />
      <Categories />
    </div>
  )
}
