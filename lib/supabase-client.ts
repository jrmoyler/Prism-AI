type AuthSession = {
  access_token: string
  user: { id: string; email?: string }
}

type AuthChangeCallback = (_event: string, session: AuthSession | null) => void

class SupabaseBrowserClientLike {
  private listeners = new Set<AuthChangeCallback>()

  auth = {
    getSession: async (): Promise<{ data: { session: AuthSession | null } }> => {
      const token = this.getAccessToken()
      if (!token) return { data: { session: null } }

      const user = await this.getUser(token)
      if (!user) return { data: { session: null } }

      return { data: { session: { access_token: token, user } } }
    },

    signInWithOtp: async ({
      email,
      options,
    }: {
      email: string
      options?: { emailRedirectTo?: string }
    }) => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
      if (!url || !anon) return { error: { message: 'Supabase is not configured' } }

      const response = await fetch(`${url}/auth/v1/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: anon,
          Authorization: `Bearer ${anon}`,
        },
        body: JSON.stringify({ email, create_user: true, email_redirect_to: options?.emailRedirectTo }),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => 'Failed to send magic link')
        return { error: { message: text } }
      }

      return { error: null }
    },

    signOut: async () => {
      document.cookie = 'prism-auth=; path=/; max-age=0; samesite=lax'
      document.cookie = 'prism-access-token=; path=/; max-age=0; samesite=lax'
      this.emit('SIGNED_OUT', null)
      return { error: null }
    },

    onAuthStateChange: (callback: AuthChangeCallback) => {
      this.listeners.add(callback)
      return {
        data: {
          subscription: {
            unsubscribe: () => { this.listeners.delete(callback) },
          },
        },
      }
    },
  }

  private emit(event: string, session: AuthSession | null) {
    this.listeners.forEach((listener) => listener(event, session))
  }

  private getAccessToken() {
    const tokenMatch = document.cookie.match(/(?:^|; )prism-access-token=([^;]+)/)
    return tokenMatch ? decodeURIComponent(tokenMatch[1]) : null
  }

  private async getUser(accessToken: string): Promise<{ id: string; email?: string } | null> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    if (!url || !anon) return null

    const response = await fetch(`${url}/auth/v1/user`, {
      headers: {
        apikey: anon,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) return null
    const data = (await response.json()) as { id: string; email?: string }
    return data
  }
}

let _client: SupabaseBrowserClientLike | null = null

export function getSupabaseBrowserClient() {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (!url || !anon) return null

  _client = new SupabaseBrowserClientLike()
  return _client
}
