"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import getAuthClient from './firebase'

type AuthContextValue = {
  user: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const isFirebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isFirebaseConfigured) {
      // mock auth using localStorage token
      const stored = localStorage.getItem('mock_user')
      if (stored) setUser(JSON.parse(stored))
      setLoading(false)
      return
    }

    let unsub: any = null
    ;(async () => {
      try{
        const auth = await getAuthClient()
        if (!auth) { setLoading(false); return }
        try{
          // hide static import from bundler using eval so build doesn't fail when firebase
          // package is intentionally absent (we support mock auth)
          // eslint-disable-next-line no-eval
          const firebaseAuth = await eval("import('firebase/auth')")
          const { onAuthStateChanged } = firebaseAuth
          unsub = onAuthStateChanged(auth, (u:any) => {
          setUser(u)
          setLoading(false)
        })
        }catch(err){
          // fallback to mock if dynamic import fails
          const stored = localStorage.getItem('mock_user')
          if (stored) setUser(JSON.parse(stored))
          setLoading(false)
        }
      }catch(err){
        // if dynamic import fails, fallback to mock
        const stored = localStorage.getItem('mock_user')
        if (stored) setUser(JSON.parse(stored))
        setLoading(false)
      }
    })()

    return () => { if (unsub) unsub() }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      const mock = { uid: 'mock-'+email, email }
      localStorage.setItem('mock_user', JSON.stringify(mock))
      setUser(mock as any)
      return
    }
    const auth = await getAuthClient()
    if (!auth) throw new Error('Firebase auth not available')
  // dynamic import via eval to avoid build-time resolution when firebase is absent
  // eslint-disable-next-line no-eval
  const firebaseAuth = await eval("import('firebase/auth')")
  const { signInWithEmailAndPassword } = firebaseAuth
  await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      const mock = { uid: 'mock-'+email, email }
      localStorage.setItem('mock_user', JSON.stringify(mock))
      setUser(mock as any)
      return
    }
    const auth = await getAuthClient()
    if (!auth) throw new Error('Firebase auth not available')
  // eslint-disable-next-line no-eval
  const firebaseAuth = await eval("import('firebase/auth')")
  const { createUserWithEmailAndPassword } = firebaseAuth
  await createUserWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem('mock_user')
      setUser(null)
      return
    }
    const auth = await getAuthClient()
    if (!auth) return
  // eslint-disable-next-line no-eval
  const firebaseAuth = await eval("import('firebase/auth')")
  const { signOut: fbSignOut } = firebaseAuth
  await fbSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default useAuth
