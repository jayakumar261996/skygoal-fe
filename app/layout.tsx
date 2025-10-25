import './globals.css'
import React from 'react'
import dynamic from 'next/dynamic'
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
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProviderClient>
      </body>
    </html>
  )
}
