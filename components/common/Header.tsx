"use client"
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'

export default function Header(){
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="w-full bg-white/60 backdrop-blur sticky top-0 z-20 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products" className="text-2xl font-bold text-indigo-600 hover:opacity-90 transition-opacity">Skygoal</Link>
          <nav className="hidden sm:flex items-center gap-2">
            <Link href="/products" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors">Products</Link>
            <Link href="/add-product" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors">Add product</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user && <div className="text-sm text-gray-700 hidden sm:block">{user.email ?? user.uid}</div>}
          <button onClick={handleSignOut} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transform active:scale-95 transition">Sign out</button>
        </div>
      </div>
    </header>
  )
}
