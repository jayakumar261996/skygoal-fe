'use client'
import React from 'react'
import ProductForm from '@/components/common/ProductForm'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Header from '@/components/common/Header'

export default function AddProductPage(){
  return (
    <ProtectedRoute>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Add product</h1>
        <ProductForm />
      </div>
    </ProtectedRoute>
  )
}
