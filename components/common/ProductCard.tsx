import React from 'react'

export default function ProductCard({product}: any){
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm">{product.category} • {product.brand}</p>
      <p className="mt-2">₹{product.price}</p>
      <p className="text-xs mt-2">SKU: {product.sku}</p>
    </div>
  )
}
