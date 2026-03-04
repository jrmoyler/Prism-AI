export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
        <h1 className="text-4xl font-bold">PRISM: AI Career Assessment Platform</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Production-grade platform for assessment scoring, AI career reporting, candidate operations, and hiring analytics.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/assessment" className="rounded bg-indigo-600 px-4 py-2 text-white">Start Assessment</a>
          <a href="/dashboard" className="rounded border border-slate-700 px-4 py-2">Open Dashboard</a>
          <a href="/login" className="rounded border border-slate-700 px-4 py-2">Sign in</a>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          'Assessment Engine',
          'AI Career Report Generator',
          'Candidate Database',
          'Admin Hiring Dashboard',
          'Talent Analytics',
          'Viral Public Profiles',
        ].map((item) => (
          <article key={item} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold">{item}</h2>
          </article>
        ))}
      </section>
    </main>
  )
}
