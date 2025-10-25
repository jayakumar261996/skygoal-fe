'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'

export default function LoginPage(){
  const router = useRouter()
  const { signIn } = useAuth()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState<string | null>(null)
  const [loading,setLoading]=useState(false)

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    setError(null)
    try{
      setLoading(true)
      await signIn(email, password)
      router.push('/products')
    }catch(err:any){
      setError(err?.message || 'Login failed')
    }finally{ setLoading(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input className="w-full p-2 border mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border mb-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <button className="w-full p-2 bg-blue-600 text-white rounded">{loading ? 'Signing in...' : 'Login'}</button>
      </form>
    </div>
  )
}
