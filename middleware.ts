import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const protectedRoute = ['/dashboard', '/candidates', '/admin'].some(
    (prefix) => request.nextUrl.pathname === prefix || request.nextUrl.pathname.startsWith(`${prefix}/`),
  )
  if (!url || !key) return response // Unconfigured hiring screens contain labeled, read-only demo data.
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (entries) => {
        entries.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        entries.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  let user = null
  try { user = (await client.auth.getUser()).data.user } catch { /* Fail closed. */ }
  if (protectedRoute && (!user || user.app_metadata?.role !== 'admin')) {
    const redirect = NextResponse.redirect(new URL(user ? '/signin?error=admin_required' : '/signin', request.url))
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie))
    return redirect
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|woff2)$).*)'],
}
