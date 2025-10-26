import './globals.css'
import React from 'react'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
const AuthProviderClient = dynamic(() => import('@/components/auth/AuthProviderClient'), { ssr: false })

export const metadata = {
  title: 'Skygoal',
  description: 'Skygoal frontend assignment scaffold'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProviderClient>
          <main className="min-h-screen">{children}</main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProviderClient>
      </body>
    </html>
  )
}
