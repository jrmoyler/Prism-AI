import RadarChart from '../../../components/RadarChart'

const roleConfig: Record<string, { color: string; bg: string; border: string; description: string }> = {
  architect:  {
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
    description: 'Scalable system designer with deep technical vision and architectural thinking.',
  },
  integrator: {
    color: '#a78bfa',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    description: 'Automation-oriented bridge builder connecting people, tools, and workflows.',
  },
  designer:   {
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.2)',
    description: 'Experience-first creator focused on product craft and user delight.',
  },
  educator:   {
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
    description: 'Knowledge multiplier who mentors and communicates complex AI concepts.',
  },
  consultant: {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
    description: 'Business-aligned strategist bridging AI capabilities with real outcomes.',
  },
}

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const chartData = [
    { role: 'architect',  score: 84 },
    { role: 'integrator', score: 78 },
    { role: 'designer',   score: 72 },
    { role: 'educator',   score: 65 },
    { role: 'consultant', score: 80 },
  ]

  const primaryRole = 'architect'
  const cfg = roleConfig[primaryRole]

  const skills = [
    'System design', 'Integration strategy',
    'Stakeholder communication', 'Analytics execution',
    'API architecture', 'Cloud infrastructure',
  ]

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#818cf8',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            PRISM Public Profile
          </div>
          <h1 className="text-3xl font-bold text-white">@{params.username}</h1>
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: cfg.color }} />
              {primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)}
            </div>
            <span className="text-sm text-slate-600">Primary role</span>
          </div>
        </div>

        {/* Share button */}
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium cursor-pointer flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#64748b',
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M11.5 2.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM4.5 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11.5 9.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6.4 7.1l3.2-1.7M6.4 8.9l3.2 1.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Share Profile
        </div>
      </div>

      {/* Role description card */}
      <div
        className="rounded-2xl p-5"
        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
      >
        <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>{cfg.description}</p>
      </div>

      {/* Radar Chart */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white">Role Alignment Radar</h2>
            <p className="text-xs text-slate-600 mt-0.5">5 PRISM dimensions · normalized scores</p>
          </div>
        </div>
        <RadarChart data={chartData} />
      </div>

      {/* Score grid */}
      <div className="grid grid-cols-5 gap-3">
        {chartData.map(({ role, score }) => {
          const c = roleConfig[role]
          return (
            <div
              key={role}
              className="rounded-xl p-3 text-center space-y-1"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              <div className="text-xl font-bold" style={{ color: c.color }}>{score}</div>
              <div className="text-[10px] font-medium capitalize" style={{ color: c.color, opacity: 0.7 }}>
                {role}
              </div>
            </div>
          )
        })}
      </div>

      {/* Core skills */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
          Core Competencies
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span
              key={skill}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center pt-4">
        <a
          href="/assessment"
          className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
            boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 4px 16px rgba(99,102,241,0.2)',
          }}
        >
          Create your PRISM profile
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </main>
  )
}
