import { create } from 'zustand'

type Product = {
  name: string
  price: number
  sku: string
  category?: string
  brand?: string
  status?: string
}

type State = {
  products: Product[]
  setProducts: (p: Product[]) => void
  addProduct: (p: Product) => void
}

export const useProductStore = create<State>((set)=>({
  products: [],
  setProducts: (p)=> set({products:p}),
  addProduct: (p)=> set(state => ({ products: [p, ...state.products] }))
}))
