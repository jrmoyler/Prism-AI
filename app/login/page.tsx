import GoogleSignIn from './GoogleSignIn'

const errors: Record<string,string> = {
  not_configured:'Sign-in is not configured for this deployment. You can still take a guest assessment.',
  admin_required:'Hiring workspaces are restricted to authorized administrators. Your account does not have hiring access.',
  auth_failed:'We could not complete sign-in. Request a new link and try again.',
  invalid_email:'Enter a valid email address to receive a sign-in link.',
  send_failed:'The sign-in link could not be sent. Please try again shortly.',
  rate_limited:'Too many sign-in attempts. Please wait a few minutes and try again.',
}

export default async function LoginPage({searchParams}: {searchParams:Promise<{error?:string;sent?:string}>}) {
  const params = await searchParams
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return <main className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-24">
    <section><p className="mb-6 font-mono text-xs uppercase tracking-[0.2em]" style={{color:'#D4A843'}}>PRISM / Your next direction</p><h1 className="max-w-lg text-5xl font-semibold leading-tight tracking-tight md:text-6xl">Return to your<br/>career workspace.</h1><p className="mt-6 max-w-md text-lg leading-relaxed text-slate-400">Use your account to save assessment results. Hiring administrators can also review their candidate pipeline.</p><div className="mt-10 border-t border-slate-700 pt-6"><p className="text-sm text-slate-400">Just exploring your role interests?</p><a href="/assessment" className="mt-2 inline-flex min-h-11 items-center text-sm underline underline-offset-4" style={{color:'#D4A843'}}>Take the assessment as a guest</a></div></section>
    <section aria-labelledby="signin-heading" className="border border-slate-700 p-6 md:p-8" style={{background:'#0D1326'}}><h2 id="signin-heading" className="text-2xl font-semibold">Sign in</h2><p className="mb-8 mt-2 text-sm text-slate-400">A secure link, sent to your inbox. No password required.</p>
      {!configured && <p role="status" className="mb-6 border-l-2 p-3 text-sm leading-relaxed text-slate-300" style={{borderColor:'#D4A843'}}>Account sign-in is unavailable on this deployment. The guest assessment is available.</p>}
      {params.error && <p role="alert" className="mb-6 text-sm text-red-300">{errors[params.error] ?? 'Sign-in could not be completed. Please try again.'}</p>}
      {params.sent === '1' && configured && <p role="status" className="mb-6 text-sm leading-relaxed" style={{color:'#00D9B5'}}>Check your inbox for a sign-in link. If it does not arrive, check your spam folder before requesting another.</p>}
      <form action="/api/auth/magic-link" method="POST" className="space-y-4"><label htmlFor="signin-email" className="block text-sm text-slate-300">Email address</label><input id="signin-email" name="email" type="email" autoComplete="email" maxLength={254} required disabled={!configured} placeholder="you@company.com" className="min-h-12 w-full border border-slate-600 px-4 text-white disabled:opacity-50" style={{background:'#050A18'}}/><button type="submit" disabled={!configured} className="min-h-12 w-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40" style={{background:'#D4A843',color:'#050A18'}}>Email me a sign-in link</button></form>
      {configured && <GoogleSignIn/>}
      <p className="mt-6 text-xs leading-relaxed text-slate-400">Only sign in on a device you trust. Guest results are stored in this browser until you clear them.</p>
    </section>
  </main>
}
