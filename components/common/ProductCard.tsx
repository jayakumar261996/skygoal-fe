import React from 'react'

export default function ProductCard({product}: any){
  // derive an old price for visual discount if not provided
  const oldPrice = product.mrp || Math.round(product.price * (1 + (10 + (product.price % 30)) / 100))
  const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100)

  return (
    <article className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-[1.01] duration-300">
      <div className="p-4">
        <div className="relative">
          <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">Image</div>
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">-{discount}%</div>
          <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:bg-white text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transform active:scale-95">Add</button>
          </div>
        </div>
      </div>
    </article>
  )
}
