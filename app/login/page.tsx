import { getSupabaseAuthUrls } from '../../lib/supabase'

export default function LoginPage() {
  const { google } = getSupabaseAuthUrls()

  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-6">

        {/* Logo mark */}
        <div className="text-center space-y-2">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.5), 0 8px 24px rgba(99,102,241,0.3)',
            }}
          >
            <svg className="h-6 w-6 text-white" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="currentColor" fillOpacity="0.9" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Sign in to PRISM</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            AI career intelligence platform
          </p>
        </div>

        {/* Auth card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
          }}
        >
          {/* Magic link form */}
          <form action="/api/auth/magic-link" method="POST" className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>
                Work email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: '#f1f5f9',
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 2px 8px rgba(99,102,241,0.2)',
              }}
            >
              Send magic link
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs" style={{ color: '#475569' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Google OAuth */}
          <a
            href={google}
            className="flex items-center justify-center gap-3 w-full rounded-lg py-2.5 text-sm font-medium transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: '#cbd5e1',
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>
        </div>

        <p className="text-center text-xs" style={{ color: '#334155' }}>
          By signing in, you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </main>
  )
}
