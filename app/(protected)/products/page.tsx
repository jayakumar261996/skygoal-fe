'use client'
import React, { useEffect, useMemo, useState } from 'react'
import ProductCard from '@/components/common/ProductCard'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { useProductStore } from '@/store/productStore'
import Link from 'next/link'

const PAGE_SIZE = 20

export default function ProductsPage(){
  const setProducts = useProductStore(state=>state.setProducts)
  const products = useProductStore(state=>state.products)
  const [query,setQuery] = useState('')
  const [category,setCategory] = useState('')
  const [status,setStatus] = useState('')
  const [brand,setBrand] = useState('')
  const [minPrice,setMinPrice] = useState('')
  const [maxPrice,setMaxPrice] = useState('')
  const [sort,setSort] = useState('')
  const [page,setPage] = useState(1)

  useEffect(()=>{
    // load static products and merge with localStorage persisted ones
    const load = async ()=>{
      const r = await fetch('/data/products.json')
      const data = await r.json()
      const local = JSON.parse(localStorage.getItem('products')||'[]')
      // local items are already in desired shape
      setProducts([...local, ...data])
    }
    load()
  },[setProducts])

  const categories = useMemo(()=> Array.from(new Set(products.map((p:any)=>p.category).filter(Boolean))),[products])
  const brands = useMemo(()=> Array.from(new Set(products.map((p:any)=>p.brand).filter(Boolean))),[products])

  const filtered = useMemo(()=>{
    let list = products.slice()
    if (query) list = list.filter(p=> p.name.toLowerCase().includes(query.toLowerCase()))
    if (category) list = list.filter(p=> p.category === category)
    if (status) list = list.filter(p=> p.status === status)
    if (brand) list = list.filter(p=> p.brand === brand)
    if (minPrice) list = list.filter(p=> Number(p.price) >= Number(minPrice))
    if (maxPrice) list = list.filter(p=> Number(p.price) <= Number(maxPrice))
    if (sort === 'rating_desc') list = list.sort((a:any,b:any)=> (b.rating||0) - (a.rating||0))
    if (sort === 'rating_asc') list = list.sort((a:any,b:any)=> (a.rating||0) - (b.rating||0))
    return list
  },[products,query,category,status,brand,minPrice,maxPrice,sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  useEffect(()=>{ setPage(1) },[query,category,status,brand,minPrice,maxPrice,sort])

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <div className="flex items-center gap-3">
            <Link href="/add-product" className="px-4 py-2 text-white rounded shadow" style={{ backgroundColor: 'rgb(var(--accent-color))' }}>Add product</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Widget price filter</h3>
                <button 
                  onClick={() => {
                    const button = document.querySelector('.reset-button');
                    button?.classList.add('filter-reset');
                    setTimeout(() => button?.classList.remove('filter-reset'), 300);
                    
                    setQuery('');
                    setCategory('');
                    setStatus('');
                    setBrand('');
                    setMinPrice('');
                    setMaxPrice('');
                    setSort('');
                  }} 
                  className="px-3 py-1.5 text-sm font-medium text-white rounded-md filter-button reset-button hover:opacity-90"
                  style={{ backgroundColor: 'rgb(var(--accent-color))' }}
                >
                  Reset All Filters
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={0} value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="w-1/2 p-2 border rounded price-input filter-transition" placeholder="Min" />
                <input type="number" min={0} value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="w-1/2 p-2 border rounded price-input filter-transition" placeholder="Max" />
              </div>
              <div className="mt-3 text-sm text-gray-600">Price: ₹{minPrice || 0} — ₹{maxPrice || 99999}</div>
              <button 
                onClick={()=>{setMinPrice(''); setMaxPrice('')}} 
                className="mt-3 px-3 py-1 border rounded text-sm hover:bg-gray-50 filter-button"
              >
                Clear Price
              </button>

              <hr className="my-4" />

              <h4 className="font-semibold mb-2">Product Categories</h4>
              <ul className="text-sm space-y-1">
                {categories.map(c=> (
                  <li key={c} className="flex items-center justify-between">
                    <button 
                      onClick={()=>setCategory(c)} 
                      className={`text-left filter-transition ${category===c? 'font-medium text-indigo-600 category-active':''}`}
                    >
                      {c}
                    </button>
                    <span className="text-gray-400 text-xs">›</span>
                  </li>
                ))}
              </ul>

              <hr className="my-4" />
              <h4 className="font-semibold mb-2">Product Status</h4>
              <div className="flex flex-col text-sm">
                <label className="inline-flex items-center filter-transition">
                  <input type="radio" name="status" value="" checked={status===""} onChange={()=>setStatus('')} className="mr-2 status-radio"/> All
                </label>
                <label className="inline-flex items-center filter-transition">
                  <input type="radio" name="status" value="Available" checked={status==='Available'} onChange={()=>setStatus('Available')} className="mr-2 status-radio"/> In Stock
                </label>
                <label className="inline-flex items-center filter-transition">
                  <input type="radio" name="status" value="On Sale" checked={status==='On Sale'} onChange={()=>setStatus('On Sale')} className="mr-2 status-radio"/> On Sale
                </label>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="md:col-span-9">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs bg-yellow-100 text-yellow-800 inline-block px-2 py-1 rounded mb-2">Only This Week</div>
                  <h2 className="text-xl font-bold">Grocery store with different treasures</h2>
                  <p className="text-sm text-gray-600 mt-1">We have prepared special discounts for you on grocery products.</p>
                </div>
                <div className="hidden sm:block w-48">
                  <img src="/auth-illustration.svg" alt="hero" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex-1 mr-4">
                <input placeholder="Search by name" value={query} onChange={e=>setQuery(e.target.value)} className="w-full p-3 border rounded" />
              </div>
              <div className="flex items-center gap-3">
                <select value={sort} onChange={e=>setSort(e.target.value)} className="p-3 border rounded">
                  <option value="">Sort</option>
                  <option value="rating_desc">Rating: High → Low</option>
                  <option value="rating_asc">Rating: Low → High</option>
                </select>
                <div className="text-sm text-gray-600">Found: <span className="font-medium text-gray-800">{filtered.length}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((p:any)=> <ProductCard key={p.sku} product={p} />)}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 border rounded">Prev</button>
              <div className="text-sm">Page <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span></div>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-4 py-2 border rounded">Next</button>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
