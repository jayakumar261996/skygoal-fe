"use client"
import React from 'react'
import { AuthProvider } from '@/lib/useAuth'

export default function AuthProviderClient({ children }: { children: React.ReactNode }){
  return (
    <AuthProvider>{children}</AuthProvider>
  )
}
