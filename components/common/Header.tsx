"use client"
import React from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'

export default function Header(){
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out')
      router.push('/login')
    } catch (err:any) {
      console.error(err)
      toast.error(err?.message || 'Failed to sign out')
    }
  }

  return (
    <header className="w-full bg-white/60 backdrop-blur sticky top-0 z-20 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products" className="text-2xl font-bold hover:opacity-90 transition-opacity text-[rgb(var(--text-color))] no-underline">Skygoal</Link>
          <nav className="hidden sm:flex items-center gap-2">
            <Link href="/products" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors header-nav-link">Products</Link>
            <Link href="/add-product" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors header-nav-link">Add product</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user && <div className="text-sm text-gray-700 hidden sm:block">{user.email ?? user.uid}</div>}
          <button onClick={handleSignOut} className="px-3 py-2 text-white rounded transform active:scale-95 transition" style={{ backgroundColor: 'rgb(var(--accent-color))' }}>Sign out</button>
        </div>
      </div>
    </header>
  )
}
