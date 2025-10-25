'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProductStore } from '@/store/productStore'

const sanitize = (s: string) => s.replace(/</g,'&lt;').replace(/>/g,'&gt;')

const isValidName = (name: string) => /^[a-zA-Z0-9\s-]+$/.test(name)
const isPositiveNumber = (v: any) => !isNaN(v) && Number(v) > 0
const isPositiveInteger = (v: any) => Number.isInteger(Number(v)) && Number(v) > 0

export default function ProductForm(){
  const router = useRouter()
  const addProduct = useProductStore(state=>state.addProduct)
  const products = useProductStore(state=>state.products)
  const [form,setForm] = useState<any>({name:'',price:'',sku:'',category:'',brand:'',status:'Available',quantity:1,color:''})
  const [error,setError] = useState<string | null>(null)
  const handleSubmit = (e:any) => {
    e.preventDefault()
    setError(null)
    // validations
    if (!isValidName(form.name)) return setError('Name should contain only letters, numbers, spaces or hyphens')
    if (!isPositiveNumber(form.price)) return setError('Price must be a positive number')
    if (!isPositiveInteger(form.quantity)) return setError('Quantity must be a positive integer')
    const sku = (form.sku || '').trim() || `SKU-${Date.now()}`
    // check uniqueness against store and localStorage
    const local = JSON.parse(localStorage.getItem('products')||'[]')
    const skus = new Set<string>([...products.map((p:any)=>p.sku), ...local.map((p:any)=>p.sku)])
    if (skus.has(sku)) return setError('SKU must be unique')

    const payload = {
      name: sanitize(String(form.name).trim()),
      price: Number(form.price),
      sku: sanitize(sku),
      category: sanitize(String(form.category||'').trim()),
      brand: sanitize(String(form.brand||'').trim()),
      status: sanitize(String(form.status||'Available')),
      quantity: Number(form.quantity),
      color: sanitize(String(form.color||''))
    }

    // update store
    addProduct(payload)
    // persist
    const list = JSON.parse(localStorage.getItem('products')||'[]')
    list.unshift(payload)
    localStorage.setItem('products', JSON.stringify(list))
    router.push('/products')
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-lg bg-white p-4 rounded shadow">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block">Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 border mt-1" /></label>
      <label className="block mt-2">Price<input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full p-2 border mt-1" type="number" /></label>
      <label className="block mt-2">Quantity<input value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className="w-full p-2 border mt-1" type="number" /></label>
      <label className="block mt-2">Category<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full p-2 border mt-1" /></label>
      <label className="block mt-2">Brand<input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="w-full p-2 border mt-1" /></label>
      <label className="block mt-2">Status
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full p-2 border mt-1">
          <option>Available</option>
          <option>Out of Stock</option>
          <option>Coming Soon</option>
        </select>
      </label>
      <label className="block mt-2">Color<input value={form.color} onChange={e=>setForm({...form,color:e.target.value})} className="w-full p-2 border mt-1" /></label>
      <label className="block mt-2">SKU<input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="w-full p-2 border mt-1" /></label>
      <div className="mt-4"><button className="px-4 py-2 bg-blue-600 text-white rounded">Add</button></div>
    </form>
  )
}
