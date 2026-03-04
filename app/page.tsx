const modules = [
  {
    title: 'Assessment Engine',
    description: 'Interactive 50-question assessment with autosave, progress tracking, and 1–5 scale responses across five PRISM roles.',
    href: '/assessment',
    cta: 'Take Assessment',
    accent: 'indigo',
  },
  {
    title: 'AI Career Report Generator',
    description: 'LLM-powered career reports with role-fit narratives, strengths analysis, skill roadmaps, and curated learning resources.',
    href: '/reports',
    cta: 'View Reports',
    accent: 'violet',
  },
  {
    title: 'Candidate Database',
    description: 'Supabase-backed candidate records with graceful local fallback, status tracking, and score history.',
    href: '/candidates',
    cta: 'Browse Candidates',
    accent: 'emerald',
  },
  {
    title: 'Admin Hiring Dashboard',
    description: 'Real-time hiring funnel analytics with stage breakdowns, average scores, and interview conversion metrics.',
    href: '/dashboard',
    cta: 'Open Dashboard',
    accent: 'amber',
  },
  {
    title: 'Talent Analytics',
    description: 'Pipeline conversion rates, role distribution, and candidate quality scoring across your entire hiring funnel.',
    href: '/dashboard',
    cta: 'View Analytics',
    accent: 'cyan',
  },
  {
    title: 'Viral Public Profiles',
    description: 'Shareable PRISM radar chart profiles showing role alignment and skill dimensions — built for social sharing.',
    href: '/profile/demo',
    cta: 'See Demo Profile',
    accent: 'rose',
  },
]

const accentClasses: Record<string, string> = {
  indigo: 'border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-950/20',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-950/20',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-950/20',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-950/20',
  cyan: 'border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-950/20',
  rose: 'border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-950/20',
}

const dotClasses: Record<string, string> = {
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
  rose: 'bg-rose-500',
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      {/* Hero */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-8 md:p-12">
        <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-4">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-400"></span>
          Professional Role Identification &amp; Skill Mapping
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          PRISM AI
          <span className="block text-slate-400 text-2xl md:text-3xl font-normal mt-2">Career Assessment Platform</span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300 text-lg leading-relaxed">
          Production-grade platform for AI-powered assessment scoring, career reporting, candidate operations, and enterprise hiring analytics.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/assessment"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Start Assessment
          </a>
          <a
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            Open Dashboard
          </a>
          <a
            href="/login"
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            Sign In
          </a>
        </div>
      </section>

      {/* Module Grid */}
      <section className="mt-8">
        <h2 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">Platform Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <a
              key={mod.title}
              href={mod.href}
              className={`group rounded-xl border bg-slate-900 p-5 transition-all ${accentClasses[mod.accent]}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-block h-2 w-2 rounded-full ${dotClasses[mod.accent]}`}></span>
                <h3 className="font-semibold text-white">{mod.title}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{mod.description}</p>
              <span className="mt-4 inline-block text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                {mod.cta} →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">
          <p className="text-3xl font-bold text-indigo-400">50</p>
          <p className="mt-1 text-sm text-slate-400">Assessment Questions</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">5</p>
          <p className="mt-1 text-sm text-slate-400">PRISM Role Dimensions</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">
          <p className="text-3xl font-bold text-violet-400">AI</p>
          <p className="mt-1 text-sm text-slate-400">Powered Career Reports</p>
        </div>
      </section>
    </main>
  )
}
