"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import AuthForm from '@/components/auth/AuthForm'

export default function SignupPage(){
  const router = useRouter()
  const { signUp } = useAuth()

  const handleSubmit = async (email: string, password: string) => {
    await signUp(email, password)
    router.push('/products')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="max-w-4xl w-full mx-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col items-start p-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg">
          <div className="w-full flex items-center justify-between mb-6">
            <h1 className="text-4xl font-extrabold">Create account</h1>
          </div>
          <p className="opacity-90 mb-6">Join Skygoal and manage your products with ease.</p>
          <div className="w-full mt-auto">
            <img src="/auth-illustration.svg" alt="Skygoal illustration" className="w-full h-auto max-h-56 object-contain" />
          </div>
        </div>
        <AuthForm
          title="Sign Up"
          submitLabel="Create account"
          onSubmit={handleSubmit}
          altAction={{ label: 'Already have an account?', href: '/login', linkText: 'Login' }}
        />
      </div>
    </div>
  )
}
