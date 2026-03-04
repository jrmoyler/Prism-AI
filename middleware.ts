import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  if (!isDashboard) return NextResponse.next()

  const authCookie = req.cookies.get('prism-auth')?.value
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
