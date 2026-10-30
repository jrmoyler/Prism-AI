'use client'

import { useState } from 'react'
import { getSupabaseBrowserClient } from '../../lib/supabase-client'

export default function GoogleSignIn() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function signIn() {
    setPending(true)
    setError('')
    try {
      const client = getSupabaseBrowserClient()
      if (!client) throw new Error('Sign-in is not configured.')
      const {error: authError} = await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${window.location.origin}/auth/callback`}})
      if (authError) throw authError
    } catch {
      setError('Google sign-in could not be started. Try again or use an email link.')
      setPending(false)
    }
  }
  return <><button type="button" onClick={signIn} disabled={pending} className="mt-4 flex min-h-12 w-full items-center justify-center border border-slate-600 px-4 text-sm disabled:opacity-50">{pending ? 'Opening Google…' : 'Continue with Google'}</button>{error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}</>
}
