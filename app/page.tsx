const features = [
  {
    title: 'Supabase Database',
    description: 'Production-ready data layer for candidates, scores, and hiring funnel states.',
  },
  {
    title: 'AI Career Report Generator',
    description: 'Generate role-fit narratives and action plans from assessment outcomes.',
  },
  {
    title: 'Candidate Pipeline',
    description: 'Track applicants across Applied, Screen, Interview, Offer, and Hired stages.',
  },
  {
    title: 'Admin Hiring Dashboard',
    description: 'Single-pane hiring operations with quick metrics and stage breakdowns.',
  },
  {
    title: 'Enterprise Analytics',
    description: 'Leadership-friendly pipeline conversion, velocity, and score analytics.',
  },
]

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-8 md:p-12">
      <h1 className="text-4xl font-bold">PRISM AI Hiring Platform</h1>
      <p className="mt-3 text-slate-600">Assess talent, generate AI insights, and manage enterprise recruiting in one place.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <section key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href="/assessment" className="rounded bg-slate-900 px-4 py-2 text-white">Start Assessment</a>
        <a href="/reports" className="rounded border border-slate-300 bg-white px-4 py-2">AI Career Reports</a>
        <a href="/candidates" className="rounded border border-slate-300 bg-white px-4 py-2">Candidate Pipeline</a>
        <a href="/admin" className="rounded border border-slate-300 bg-white px-4 py-2">Admin Dashboard</a>
      </div>
    </main>
  )
}
