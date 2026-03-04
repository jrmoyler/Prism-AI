'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from './supabase-client'

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthContextValue = {
  /** Authenticated user, or null when logged out / Supabase not configured */
  user: User | null
  /** Current Supabase session, or null when logged out / not configured */
  session: Session | null
  /** True while the initial session check is in progress */
  loading: boolean
  /** Send a magic-link OTP to the given email */
  signIn: (email: string) => Promise<{ error: string | null }>
  /** Sign out and clear the session */
  signOut: () => Promise<void>
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
})

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // getSupabaseBrowserClient() is called here — inside useEffect — so it
    // never runs on the server and won't throw on missing env vars.
    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      // Supabase not configured — auth is unavailable, stop loading spinner
      setLoading(false)
      return
    }

    // Hydrate the session from Supabase storage
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Keep state in sync with auth events (sign-in, token refresh, sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)
      },
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string) => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return { error: 'Authentication is not configured' }

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })

    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext)
}
