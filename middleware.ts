import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if this is an auth page (login or signup)
  const isAuthPage = request.nextUrl.pathname.startsWith('/signup') || 
                    request.nextUrl.pathname.startsWith('/login')

  // Get the auth session token
  const isAuthenticated = request.cookies.has('mock_current_user') || 
                         request.cookies.has('session') // firebase cookie

  // For auth pages (login/signup): redirect to /products if already logged in
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/products', request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/signup/:path*', '/login/:path*']
}