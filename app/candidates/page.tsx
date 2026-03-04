import { getCandidates } from '../../lib/supabase'
import type { CandidateStatus } from '../../lib/types'

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: 'New',       color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  review:    { label: 'Review',    color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.2)'  },
  interview: { label: 'Interview', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
  hired:     { label: 'Hired',     color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)'  },
  rejected:  { label: 'Rejected',  color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
}

const roleConfig: Record<string, { color: string; bg: string; border: string }> = {
  architect:  { color: '#818cf8', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.2)'  },
  integrator: { color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)'  },
  designer:   { color: '#f472b6', bg: 'rgba(244,114,182,0.1)',border: 'rgba(244,114,182,0.2)' },
  educator:   { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)'  },
  consultant: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)'  },
}

export default async function CandidatesPage() {
  const candidates = await getCandidates()

  const statusCounts = candidates.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
            Talent Pipeline
          </p>
          <h1 className="text-3xl font-bold text-white">Candidate Database</h1>
          <p className="text-sm text-slate-500">
            Supabase-backed candidate records with role scoring and pipeline tracking.
          </p>
        </div>
        <a
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          Dashboard
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => {
          const cfg = statusConfig[status] ?? statusConfig.new
          return (
            <div
              key={status}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ background: `${cfg.color}25` }}
              >
                {count}
              </span>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
            {candidates.length} Candidates
          </span>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
              {['Candidate', 'Role', 'Status', 'Score', 'Joined'].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-medium" style={{ color: '#475569' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, i) => {
              const roleCfg   = roleConfig[candidate.desired_role] ?? roleConfig.architect
              const statusCfg = statusConfig[candidate.status]     ?? statusConfig.new
              const scoreColor = candidate.score >= 75 ? '#34d399' : candidate.score >= 50 ? '#fbbf24' : '#f87171'
              const joined = new Date(candidate.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })

              return (
                <tr
                  key={candidate.id}
                  className="transition-colors"
                  style={{ borderBottom: i < candidates.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: roleCfg.bg, color: roleCfg.color }}
                      >
                        {candidate.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{candidate.full_name}</div>
                        <div className="text-xs text-slate-600">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                      style={{ background: roleCfg.bg, color: roleCfg.color, border: `1px solid ${roleCfg.border}` }}
                    >
                      {candidate.desired_role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}
                    >
                      {statusCfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-14 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${candidate.score}%`, background: scoreColor }}
                        />
                      </div>
                      <span className="text-xs font-mono tabular-nums" style={{ color: scoreColor }}>
                        {candidate.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: '#475569' }}>
                    {joined}
                  </td>
                </tr>
              )
            })}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-600">
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
