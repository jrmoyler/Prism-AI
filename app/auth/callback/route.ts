import { NextResponse } from 'next/server'
import { getServerSupabase } from '../../../lib/server-auth'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const client = await getServerSupabase()
  if (code && client) {
    const { error } = await client.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL('/results', url.origin))
  }
  return NextResponse.redirect(new URL('/signin?error=auth_failed', url.origin))
}
