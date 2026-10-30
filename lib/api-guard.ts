import { NextResponse } from 'next/server'

const windows = new Map<string, { count: number; expires: number }>()

// Per-instance backstop. Configure a shared edge limit before scaling across replicas.
export function rateLimit(request: Request, bucket: string, limit = 30) {
  const now = Date.now()
  windows.forEach((entry, key) => { if (entry.expires <= now) windows.delete(key) })
  const key = `${bucket}:${request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'}`
  const entry = windows.get(key) ?? { count: 0, expires: now + 60_000 }
  entry.count += 1
  windows.set(key, entry)
  if (entry.count > limit || windows.size > 10_000) return NextResponse.json(
    { error: 'Too many requests. Please wait a minute.' },
    { status: 429, headers: { 'Retry-After': '60' } },
  )
  return null
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  const allowed = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin
  try { return new URL(origin).origin === new URL(allowed).origin } catch { return false }
}
