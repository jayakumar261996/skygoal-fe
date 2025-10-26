"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Header from './Header'

export default function ProtectedRoute({ children }: { children: React.ReactNode }){
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(()=>{
    if (!loading && !user) {
      router.replace('/signup')
    }
  },[loading,user,router])

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return null
  return (
    <>
      <Header />
      {children}
    </>
  )
}
