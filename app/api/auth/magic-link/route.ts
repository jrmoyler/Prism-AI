import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const email = String(form.get('email') ?? '')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/auth/callback`

  if (url && anon && email) {
    await fetch(`${url}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anon,
      },
      body: JSON.stringify({ email, create_user: true, options: { emailRedirectTo: redirectTo } }),
    })
  }

  return NextResponse.redirect(new URL('/login?sent=1', req.url))
}
