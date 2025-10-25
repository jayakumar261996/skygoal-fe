'use client'
import React, { useEffect, useMemo, useState } from 'react'
import ProductCard from '@/components/common/ProductCard'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { useProductStore } from '@/store/productStore'

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
    <div className="p-6">
      <h1 className="text-2xl mb-4">Products</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input placeholder="Search by name" value={query} onChange={e=>setQuery(e.target.value)} className="p-2 border" />
        <select value={category} onChange={e=>setCategory(e.target.value)} className="p-2 border">
          <option value="">All categories</option>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="p-2 border">
          <option value="">Any status</option>
          <option>Available</option>
          <option>Out of Stock</option>
          <option>Coming Soon</option>
        </select>
        <select value={brand} onChange={e=>setBrand(e.target.value)} className="p-2 border">
          <option value="">All brands</option>
          {brands.map(b=> <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input placeholder="Min price" value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="p-2 border" type="number" />
        <input placeholder="Max price" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="p-2 border" type="number" />
        <select value={sort} onChange={e=>setSort(e.target.value)} className="p-2 border">
          <option value="">Sort</option>
          <option value="rating_desc">Rating: High → Low</option>
          <option value="rating_asc">Rating: Low → High</option>
        </select>
        <div className="p-2">Found: {filtered.length}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageItems.map((p:any)=> <ProductCard key={p.sku} product={p} />)}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 border rounded">Prev</button>
        <div>Page {page} / {totalPages}</div>
        <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
    </ProtectedRoute>
  )
}
