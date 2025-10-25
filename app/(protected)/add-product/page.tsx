'use client'
import React from 'react'
import ProductForm from '@/components/common/ProductForm'
import ProtectedRoute from '@/components/common/ProtectedRoute'

export default function AddProductPage(){
  return (
    <ProtectedRoute>
      <div className="p-6">
        <button className="text-2xl mb-4">Add Product</button>
        <ProductForm />
      </div>
    </ProtectedRoute>
  )
}
