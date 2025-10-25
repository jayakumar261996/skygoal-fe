"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import AuthForm from '@/components/auth/AuthForm'

export default function LoginPage(){
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (email: string, password: string) => {
    await signIn(email, password)
    // redirect to products after successful login
    router.push('/products')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="max-w-4xl w-full mx-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col items-start p-8 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg">
          <div className="w-full flex items-center justify-between mb-6">
            <h1 className="text-4xl font-extrabold">Skygoal</h1>
          </div>
          <p className="opacity-90 mb-6">Manage products and more — sign in to continue to your dashboard.</p>
          <div className="w-full mt-auto">
            <img src="/auth-illustration.svg" alt="Skygoal illustration" className="w-full h-auto max-h-56 object-contain" />
          </div>
        </div>
        <AuthForm
          title="Login"
          submitLabel="Sign in"
          onSubmit={handleSubmit}
          altAction={{ label: "Don't have an account?", href: '/signup', linkText: 'Sign up' }}
        />
      </div>
    </div>
  )
}

