import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getServerSupabase(request?: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const store = await cookies()
  return createServerClient(url, key, {
    ...(request?.headers.get('authorization')?.startsWith('Bearer ') ? { global: { headers: { Authorization: request.headers.get('authorization')! } } } : {}),
    cookies: {
      getAll: () => store.getAll(),
      setAll: (entries) => {
        try { entries.forEach(({ name, value, options }) => store.set(name, value, options)) }
        catch { /* Server components cannot set cookies; middleware refreshes them. */ }
      },
    },
  })
}

export async function verifiedUser(request?: Request) {
  const client = await getServerSupabase(request)
  if (!client) return null
  const bearer = request?.headers.get('authorization')
  const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : undefined
  try {
    const { data, error } = await client.auth.getUser(token)
    return error ? null : data.user
  } catch { return null }
}

export async function isHiringAdmin(request?: Request) {
  const user = await verifiedUser(request)
  return user?.app_metadata?.role === 'admin'
}
