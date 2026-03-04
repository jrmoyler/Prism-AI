import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl  = new URL(request.url)
  const code        = requestUrl.searchParams.get('code')
  const origin      = requestUrl.origin

  const cookieStore = cookies()

  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (code && supabaseUrl && supabaseAnon) {
    // Exchange the auth code for a real Supabase session.
    // createServerClient will write the session tokens into the cookies
    // automatically via the cookie interface below.
    const supabase = createServerClient(supabaseUrl, supabaseAnon, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    })

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error.message)
      // Redirect to login with an error param so the UI can surface it
      return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
    }

    // Also set the legacy cookie so the existing middleware fallback keeps
    // working during any transition period
    const response = NextResponse.redirect(new URL('/dashboard', origin))
    response.cookies.set('prism-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response
  }

  // No code — redirect to login
  return NextResponse.redirect(new URL('/login', origin))
}
