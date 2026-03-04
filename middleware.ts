import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require an authenticated Supabase session
const PROTECTED_PREFIXES = ['/dashboard', '/candidates', '/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(prefix =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  if (!isProtected) return NextResponse.next()

  // Build a mutable response so Supabase can refresh cookies if needed
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  // If env vars are missing, fall back to legacy cookie check so the app still
  // works in environments that have not yet configured Supabase.
  if (!supabaseUrl || !supabaseAnon) {
    const legacyCookie = request.cookies.get('prism-auth')?.value
    if (!legacyCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value
      },
      set(name, value, options) {
        // Propagate refreshed tokens back to the browser
        response.cookies.set({ name, value, ...options })
      },
      remove(name, options) {
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Also accept the legacy cookie so existing sessions keep working during
    // the transition to Supabase session-based auth
    const legacyCookie = request.cookies.get('prism-auth')?.value
    if (!legacyCookie) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/candidates/:path*', '/admin/:path*'],
}
