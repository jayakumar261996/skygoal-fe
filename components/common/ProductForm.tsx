 'use client'
import React, { useState, useRef } from 'react'
import { toast } from 'react-hot-toast'
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
  const [saved, setSaved] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  // Cleanup ObjectURL on unmount or when preview changes
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImage = (file?: File) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    
    if (!file) {
      setImagePreview(null)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    setImagePreview(url)
    setError(null)
  }

  const genSKU = () => {
    const sku = `SKU-${Math.random().toString(36).slice(2,8).toUpperCase()}-${Date.now().toString().slice(-4)}`
    setForm((s:any)=> ({...s, sku}))
  }

  const handleSubmit = (e:any) => {
    e.preventDefault()
    setError(null)
    setSaved(false)
    // validations
    if (!form.name.trim()) return setError('Name is required')
    if (!isValidName(form.name)) return setError('Name should contain only letters, numbers, spaces or hyphens')
    if (!form.category.trim()) return setError('Category is required')
    if (!form.brand.trim()) return setError('Brand is required')
    if (!form.status) return setError('Status is required')
    if (!form.price) return setError('Price is required')
    if (!isPositiveNumber(form.price)) return setError('Price must be a positive number')
    if (!form.quantity) return setError('Quantity is required')
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
      color: sanitize(String(form.color||'')),
      image: imagePreview || null
    }

    // update store
    addProduct(payload)
    // persist
    const list = JSON.parse(localStorage.getItem('products')||'[]')
    list.unshift(payload)
    localStorage.setItem('products', JSON.stringify(list))
  setSaved(true)
  toast.success('Product added')
  setTimeout(()=> router.push('/products'), 800)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-3xl mx-auto transition-all">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Add product</h2>
    
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {saved && <div className="text-green-700 mb-4">Product added ✓</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" placeholder="e.g. Fresh Bananas" />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Category <span className="text-red-500">*</span>
          </label>
          <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" placeholder="e.g. Grocery" />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Brand <span className="text-red-500">*</span>
          </label>
          <input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" placeholder="e.g. FarmFresh" />

          <label className="block text-sm font-medium text-gray-700 mt-4">Color</label>
          <input value={form.color} onChange={e=>setForm({...form,color:e.target.value})} className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" placeholder="e.g. Yellow" />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Status <span className="text-red-500">*</span>
          </label>
          <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400">
            <option>Available</option>
            <option>Out of Stock</option>
            <option>Coming Soon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <div className="mt-2 flex items-center gap-4">
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload product image"
              onClick={() => { if (fileRef.current) fileRef.current.click() }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (fileRef.current) fileRef.current.click() } }}
              className="w-32 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-indigo-400 transition-colors cursor-pointer"
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="preview" 
                  className="w-full h-full object-contain p-1" 
                  onError={() => {
                    setError('Failed to load image')
                    setImagePreview(null)
                  }}
                />
              ) : (
                <div className="text-gray-400 text-sm text-center p-2">
                  <svg className="w-8 h-8 mx-auto mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Click to upload
                </div>
              )}
            </div>
            <div>
              {/* hidden file input: box above triggers this */}
              <input 
                ref={fileRef} 
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={e=>{ const f = e.target.files?.[0]; if(f) handleImage(f)}} 
                className="hidden"
              />
              <div className="mt-2 text-xs text-gray-500">
                Max size: 5MB. Formats: JPG, PNG, WebP
              </div>
              {imagePreview && (
                <button 
                  type="button" 
                  onClick={()=>{ 
                    if (fileRef.current) { 
                      fileRef.current.value = ''
                      handleImage() 
                    } 
                  }} 
                  className="mt-2 px-3 py-1 border rounded-full text-xs text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} type="number" className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} type="number" className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mt-4">SKU</label>
          <div className="mt-1 flex gap-2">
            <input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" placeholder="Auto generate or enter" />
            <button type="button" onClick={genSKU} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">Generate</button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={()=> router.push('/products')} className="px-4 py-2 border rounded">Cancel</button>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transform active:scale-95" type="submit">Add product</button>
      </div>
    </form>
  )
}
