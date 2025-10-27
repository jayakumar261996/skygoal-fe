"use client"
import React, { useState } from 'react'
import { useProductStore } from '@/store/productStore'
import { toast } from 'react-hot-toast'

export default function ProductCard({product}: any){
  const toggleFavorite = useProductStore(state => state.toggleFavorite)
  const favorites = useProductStore(state => state.favorites)
  const isFav = favorites.includes(product.sku)
  const [open, setOpen] = useState(false)
  const addToCart = useProductStore(state => state.addToCart)
  const [qty, setQty] = useState(1)
  // derive an old price for visual discount if not provided
  const oldPrice = product.mrp || Math.round(product.price * (1 + (10 + (product.price % 30)) / 100))
  const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100)

  return (
    <>
    <article onClick={()=>setOpen(true)} className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-[1.01] duration-300 cursor-pointer">
      <div className="p-4">
        <div className="relative">
          <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">Image</div>
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">-{discount}%</div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product.sku) }}
            aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
            className={`absolute top-3 right-3 p-2 rounded-full shadow filter-button transition-transform ${isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-red-500 hover:bg-white'} `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682 4.318 12.682a4.5 4.5 0 010-6.364z" />
            </svg>
          </button>
        </div>

        <div className="mt-3">
          <h3 className="font-semibold text-md text-gray-800 truncate">{product.name}</h3>
          <div className="text-sm text-gray-500">{product.category} • {product.brand}</div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</div>
              {oldPrice > product.price && (
                <div className="text-sm text-gray-400 line-through">₹{oldPrice.toLocaleString()}</div>
              )}
            </div>
            <div className="text-xs text-green-600 font-semibold">{product.status === 'Available' ? 'IN STOCK' : product.status.toUpperCase()}</div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="text-sm font-medium">{product.rating?.toFixed(1) ?? '-'}</div>
            </div>
            <button onClick={(e)=>{ e.stopPropagation(); addToCart(product.sku, 1); toast.success('Added to cart') }} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transform active:scale-95">Add</button>
          </div>
        </div>
      </div>
    </article>
    {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={()=>setOpen(false)}>
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6 relative" onClick={(e)=>e.stopPropagation()}>
          <button onClick={()=>setOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">✕</button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded-md h-48 flex items-center justify-center text-gray-400">Image</div>
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <div className="text-sm text-gray-500 mb-2">{product.category} • {product.brand}</div>
              <div className="text-lg font-semibold mb-2">₹{product.price.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mb-4">{product.description || 'No additional description available.'}</div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm">Qty</label>
                  <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value||1)))} className="w-20 p-2 border rounded" />
                </div>
                <div className="text-sm">Total: <span className="font-semibold">₹{(product.price * qty).toLocaleString()}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>{ toggleFavorite(product.sku); }} className={`px-3 py-1 rounded ${isFav ? 'bg-red-500 text-white' : 'bg-white border'}`}>{isFav ? 'Unfavorite' : 'Add to favorites'}</button>
                <button onClick={()=>{ addToCart(product.sku, qty); toast.success('Added to cart') }} className="px-3 py-1 bg-indigo-600 text-white rounded">Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
