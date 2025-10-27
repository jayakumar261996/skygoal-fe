"use client"
import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { useProductStore } from '@/store/productStore'

export default function Header(){
  const { user, signOut } = useAuth()
  const favCount = useProductStore(state => state.favorites.length)
  const notifications = useProductStore(state => state.notifications)
  const markAllRead = useProductStore(state => state.markAllRead)
  const cart = useProductStore(state => state.cart)
  const updateCartQuantity = useProductStore(state => state.updateCartQuantity)
  const removeFromCart = useProductStore(state => state.removeFromCart)
  const [inboxOpen, setInboxOpen] = useState(false)
  const inboxRef = useRef<HTMLDivElement | null>(null)
  const cartRef = useRef<HTMLDivElement | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const unread = notifications.filter(n=>!n.read).length
  const cartCount = cart.reduce((s,ci)=> s + (ci.quantity||0), 0)
  const cartTotal = cart.reduce((s,ci)=> s + (ci.quantity||0) * (ci.price||0), 0)
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

  useEffect(()=>{
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node
      if (inboxRef.current && !inboxRef.current.contains(target)) setInboxOpen(false)
      if (cartRef.current && !cartRef.current.contains(target)) setCartOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  },[inboxRef])

  return (
    <header className="w-full bg-white/60 backdrop-blur sticky top-0 z-20 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products" className="text-2xl font-bold hover:opacity-90 transition-opacity text-[rgb(var(--text-color))] no-underline">Skygoal</Link>
          {/* favorites icon moved next to brand */}
          <Link href="/favorites" className="hidden sm:flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.5 2.09C12.09 5 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            {favCount > 0 && <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{favCount}</span>}
          </Link>
          <nav className="hidden sm:flex items-center gap-2">
            <Link href="/products" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors header-nav-link">Products</Link>
            <Link href="/add-product" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors header-nav-link">Add product</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user && <div className="text-sm text-gray-700 hidden sm:block">{user.email ?? user.uid}</div>}
          {/* cart icon / dropdown */}
          <div className="relative" ref={cartRef as any}>
            <button onClick={()=>setCartOpen(o=>!o)} className="px-3 py-2 rounded hover:bg-gray-100 transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h13" />
              </svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 text-xs bg-green-600 text-white rounded-full px-2 py-0.5">{cartCount}</span>}
            </button>

            {cartOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow-lg z-30">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Cart</div>
                    <div className="text-sm text-gray-600">Total: <span className="font-semibold">₹{cartTotal.toLocaleString()}</span></div>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {cart.length === 0 && <div className="text-sm text-gray-500">Cart is empty</div>}
                    {cart.map(ci=> (
                      <div key={ci.sku} className="p-2 rounded mb-1 border-b flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{ci.name}</div>
                          <div className="text-xs text-gray-500">₹{ci.price.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={()=>updateCartQuantity(ci.sku, Math.max(0, ci.quantity-1))} className="px-2 py-1 border rounded">-</button>
                          <div className="px-2">{ci.quantity}</div>
                          <button onClick={()=>updateCartQuantity(ci.sku, ci.quantity+1)} className="px-2 py-1 border rounded">+</button>
                          <button onClick={()=>removeFromCart(ci.sku)} className="ml-2 text-red-500">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right">
                    <button onClick={()=>{ toast.success('Checkout not implemented'); }} className="px-3 py-2 bg-indigo-600 text-white rounded">Checkout</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* inbox / notifications */}
          <div className="relative" ref={inboxRef as any}>
            <button onClick={()=>setInboxOpen(o=>!o)} className="px-3 py-2 rounded hover:bg-gray-100 transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {unread > 0 && <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{unread}</span>}
            </button>

            {inboxOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-30">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Notifications</div>
                    <button onClick={()=>{ markAllRead(); }} className="text-sm text-indigo-600">Mark all as read</button>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {notifications.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
                    {notifications.map(n=> (
                      <div key={n.id} className={`p-2 rounded mb-1 ${!n.read ? 'bg-gray-50' : ''}`}>
                        <div className="text-sm">{n.message}</div>
                        <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleSignOut} className="px-3 py-2 text-white rounded transform active:scale-95 transition" style={{ backgroundColor: 'rgb(var(--accent-color))' }}>Sign out</button>
        </div>
      </div>
    </header>
  )
}
