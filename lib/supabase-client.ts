import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

/**
 * Returns a singleton Supabase browser client.
 *
 * Uses a lazy getter so that `createBrowserClient` is only called the first
 * time this function is invoked — which happens inside a useEffect (client-
 * only) — rather than at module evaluation time on the server.
 *
 * Returns null when the required env vars are not configured, so callers can
 * degrade gracefully (e.g. when running without a Supabase project).
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (_client) return _client

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!url || !anon) return null

  _client = createBrowserClient(url, anon)
  return _client
}
