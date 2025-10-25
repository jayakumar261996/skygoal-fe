import React from 'react'

export default function ProductCard({product}: any){
  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-[1.01] duration-300">
      <div className="p-4 flex gap-4">
        <div className="w-28 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-md flex items-center justify-center text-gray-400 text-sm">No image</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
          <div className="text-sm text-gray-500">{product.category} • {product.brand}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">₹{product.price}</div>
            <div className="text-xs text-gray-500">SKU: {product.sku}</div>
          </div>
        </div>
      </div>
    </article>
  )
}
