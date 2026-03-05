import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (code && supabaseUrl && supabaseAnon) {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnon,
        Authorization: `Bearer ${supabaseAnon}`,
      },
      body: JSON.stringify({ auth_code: code }),
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL('/signin?error=auth_failed', origin))
    }

    const data = (await response.json()) as { access_token?: string }
    const redirect = NextResponse.redirect(new URL('/dashboard', origin))

    if (data.access_token) {
      redirect.cookies.set('prism-access-token', data.access_token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    redirect.cookies.set('prism-auth', 'authenticated', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return redirect
  }

  return NextResponse.redirect(new URL('/signin', origin))
}
