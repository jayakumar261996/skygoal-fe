"use client"
import React from 'react'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import ProductCard from '@/components/common/ProductCard'
import { useProductStore } from '@/store/productStore'
import Link from 'next/link'

export default function FavoritesPage(){
  const products = useProductStore(state => state.products)
  const favorites = useProductStore(state => state.favorites)

  const favProducts = products.filter(p => favorites.includes(p.sku))

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Favorites</h1>
          <div>
            <Link href="/products" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors">Back to products</Link>
          </div>
        </div>

        {favProducts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-lg font-medium mb-2">No favorites yet</div>
            <div className="text-sm text-gray-600">Click the heart on any product card to add it to your favorites.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProducts.map((p:any) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
