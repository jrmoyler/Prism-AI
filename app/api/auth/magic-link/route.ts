import { NextResponse } from 'next/server'
import { getServerSupabase } from '../../../../lib/server-auth'
import { rateLimit, sameOrigin } from '../../../../lib/api-guard'

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limited = rateLimit(req, 'magic-link', 5)
  if (limited) return NextResponse.redirect(new URL('/signin?error=rate_limited', req.url), 303)
  const redirect = (query: string) => NextResponse.redirect(new URL(`/signin?${query}`, req.url), 303)
  let form: FormData
  try { form = await req.formData() } catch { return redirect('error=invalid_email') }
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return redirect('error=invalid_email')
  const client = await getServerSupabase()
  if (!client) return redirect('error=not_configured')
  try {
    const { error } = await client.auth.signInWithOtp({ email, options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin}/auth/callback`,
    } })
    return redirect(error ? 'error=send_failed' : 'sent=1')
  } catch { return redirect('error=send_failed') }
}
