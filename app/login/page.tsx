import { getSupabaseAuthUrls } from '../../lib/supabase'

export default function LoginPage() {
  const { google } = getSupabaseAuthUrls()

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center p-6">
      <section className="w-full rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">Sign in to PRISM</h1>

        <form action="/api/auth/magic-link" method="POST" className="mt-5 space-y-3">
          <input name="email" type="email" required placeholder="you@company.com" className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button className="w-full rounded bg-indigo-600 px-4 py-2 text-white">Send magic link</button>
        </form>

        <a href={google} className="mt-3 block w-full rounded border border-slate-700 px-4 py-2 text-center">Continue with Google</a>
      </section>
    </main>
  )
}
