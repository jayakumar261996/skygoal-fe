import { create } from 'zustand'

type Product = {
  name: string
  price: number
  sku: string
  category?: string
  brand?: string
  status?: string
}

type Notification = {
  id: string
  message: string
  read: boolean
  sku?: string
  createdAt: number
}

type CartItem = {
  sku: string
  name: string
  price: number
  quantity: number
}

type State = {
  products: Product[]
  setProducts: (p: Product[]) => void
  addProduct: (p: Product) => void
  favorites: string[]
  setFavorites: (f: string[]) => void
  toggleFavorite: (sku: string) => void
  notifications: Notification[]
  setNotifications: (n: Notification[]) => void
  addNotification: (message: string, sku?: string) => void
  markAllRead: () => void
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
  addToCart: (sku: string, qty?: number) => void
  updateCartQuantity: (sku: string, qty: number) => void
  removeFromCart: (sku: string) => void
  clearCart: () => void
}

const readFavorites = () => {
  try {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('favorites') || '[]') as string[]
  } catch {
    return []
  }
}

const readNotifications = (): Notification[] => {
  try {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[]
  } catch {
    return []
  }
}

const readCart = (): CartItem[] => {
  try {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
  } catch {
    return []
  }
}

export const useProductStore = create<State>((set, get) => ({
  products: [],
  favorites: readFavorites(),
  cart: readCart(),
  setProducts: (p) => set({ products: p }),
  addProduct: (p) => set(state => ({ products: [p, ...state.products] })),
  setFavorites: (f) => {
    try { if (typeof window !== 'undefined') localStorage.setItem('favorites', JSON.stringify(f)) } catch {}
    set({ favorites: f })
  },
  toggleFavorite: (sku) => {
    const { favorites, products } = get()
    const exists = favorites.includes(sku)
    const next = exists ? favorites.filter(s => s !== sku) : [sku, ...favorites]
    try { if (typeof window !== 'undefined') localStorage.setItem('favorites', JSON.stringify(next)) } catch {}
    set({ favorites: next })

    // create notification
    const prod = products.find(p => p.sku === sku)
    const message = prod ? `${prod.name} ${exists ? 'removed from' : 'added to'} favorites` : `Product ${sku} ${exists ? 'removed from' : 'added to'} favorites`
    const notif: Notification = { id: String(Date.now()) + Math.random().toString(36).slice(2), message, read: false, sku, createdAt: Date.now() }
    const current = readNotifications()
    const nextNotifs = [notif, ...current]
    try { if (typeof window !== 'undefined') localStorage.setItem('notifications', JSON.stringify(nextNotifs)) } catch {}
    set({ notifications: nextNotifs })
  },

  // notifications
  notifications: readNotifications(),
  setNotifications: (n: Notification[]) => {
    try { if (typeof window !== 'undefined') localStorage.setItem('notifications', JSON.stringify(n)) } catch {}
    set({ notifications: n })
  },
  addNotification: (message: string, sku?: string) => {
    const notif: Notification = { id: String(Date.now()) + Math.random().toString(36).slice(2), message, read: false, sku, createdAt: Date.now() }
    const current = readNotifications()
    const nextNotifs = [notif, ...current]
    try { if (typeof window !== 'undefined') localStorage.setItem('notifications', JSON.stringify(nextNotifs)) } catch {}
    set({ notifications: nextNotifs })
  },
  markAllRead: () => {
    const current = readNotifications()
    const next = current.map(n => ({ ...n, read: true }))
    try { if (typeof window !== 'undefined') localStorage.setItem('notifications', JSON.stringify(next)) } catch {}
    set({ notifications: next })
  }
  ,
  // cart
  setCart: (c: CartItem[]) => {
    try { if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(c)) } catch {}
    set({ cart: c })
  },
  addToCart: (sku: string, qty = 1) => {
    const { cart, products } = get()
    const prod = products.find(p => p.sku === sku)
    if (!prod) return
    const existing = cart.find(ci => ci.sku === sku)
    let next: CartItem[]
    if (existing) {
      next = cart.map(ci => ci.sku === sku ? { ...ci, quantity: ci.quantity + qty } : ci)
    } else {
      next = [{ sku, name: prod.name, price: prod.price, quantity: qty }, ...cart]
    }
    try { if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(next)) } catch {}
    set({ cart: next })
  },
  updateCartQuantity: (sku: string, qty: number) => {
    const { cart } = get()
    let next = cart.map(ci => ci.sku === sku ? { ...ci, quantity: Math.max(0, qty) } : ci)
    // remove 0 quantity
    next = next.filter(ci => ci.quantity > 0)
    try { if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(next)) } catch {}
    set({ cart: next })
  },
  removeFromCart: (sku: string) => {
    const { cart } = get()
    const next = cart.filter(ci => ci.sku !== sku)
    try { if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(next)) } catch {}
    set({ cart: next })
  },
  clearCart: () => {
    try { if (typeof window !== 'undefined') localStorage.removeItem('cart') } catch {}
    set({ cart: [] })
  }
}))
