import dynamic from 'next/dynamic'
import { getCandidates } from '../../lib/supabase'
import CandidateStatusSelect from '../../components/CandidateStatusSelect'
import type { CandidateStatus } from '../../lib/types'

const DashboardAnalytics = dynamic(() => import('../../components/DashboardAnalytics'), {
  ssr: false,
  loading: () => <div className="h-[280px] rounded-2xl bg-white/5 animate-pulse" />,
})

const statuses: CandidateStatus[] = ['new', 'review', 'interview', 'hired', 'rejected']

const statusConfig: Record<CandidateStatus, { label: string; color: string; bg: string; border: string }> = {
  new: { label: 'New', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  review: { label: 'Review', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
  interview: { label: 'Interview', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  hired: { label: 'Hired', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  rejected: { label: 'Rejected', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
}

const roleConfig: Record<string, { color: string; bg: string; border: string }> = {
  architect: { color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
  integrator: { color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
  designer: { color: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.2)' },
  educator: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  consultant: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { status?: CandidateStatus }
}) {
  const selected = searchParams.status
  const candidates = await getCandidates(selected)

  const totalCount = candidates.length
  const avgScore = totalCount
    ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / totalCount)
    : 0
  const interviewRate = Math.round(
    (candidates.filter((c) => c.status === 'interview').length / Math.max(totalCount, 1)) * 100,
  )

  const roleDistribution = Object.entries(
    candidates.reduce((acc, c) => {
      acc[c.desired_role] = (acc[c.desired_role] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  ).map(([role, count]) => ({ role, count }))

  const pipelineDistribution = statuses.map((status) => ({
    status,
    count: candidates.filter((candidate) => candidate.status === status).length,
  }))

  const averageScoreByRole = Object.keys(roleConfig).map((role) => {
    const byRole = candidates.filter((candidate) => candidate.desired_role === role)
    const score = byRole.length ? Math.round(byRole.reduce((acc, row) => acc + row.score, 0) / byRole.length) : 0
    return { role, score }
  })

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
            Admin
          </p>
          <h1 className="text-3xl font-bold text-white">Hiring Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time pipeline analytics and candidate management</p>
        </div>
        <a
          href="/candidates"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          All Candidates
        </a>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <MetricCard title="Total Candidates" value={String(totalCount)} sub="in current view" color="#818cf8" />
        <MetricCard title="Average Score" value={String(avgScore)} sub="across all roles" color="#34d399" />
        <MetricCard title="Interview Rate" value={`${interviewRate}%`} sub="pipeline conversion" color="#fbbf24" />
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href="/dashboard"
          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
          style={{
            background: !selected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
            border: !selected ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
            color: !selected ? '#818cf8' : '#64748b',
          }}
        >
          All
        </a>
        {statuses.map((status) => {
          const cfg = statusConfig[status]
          const active = selected === status
          return (
            <a
              key={status}
              href={`/dashboard?status=${status}`}
              className="rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all"
              style={{
                background: active ? cfg.bg : 'rgba(255,255,255,0.04)',
                border: active ? `1px solid ${cfg.border}` : '1px solid rgba(255,255,255,0.07)',
                color: active ? cfg.color : '#64748b',
              }}
            >
              {cfg.label}
            </a>
          )
        })}
      </div>

      <DashboardAnalytics
        roleDistribution={roleDistribution}
        pipelineDistribution={pipelineDistribution}
        averageScoreByRole={averageScoreByRole}
      />

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
            Candidates
          </h2>
          <span className="text-xs text-slate-600 font-mono">{totalCount} total</span>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
              {['Candidate', 'Role', 'Status', 'Score'].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-medium" style={{ color: '#475569' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, i) => {
              const roleCfg = roleConfig[candidate.desired_role] ?? roleConfig.architect
              const statusCfg = statusConfig[candidate.status as CandidateStatus] ?? statusConfig.new
              const scoreColor = candidate.score >= 75 ? '#34d399' : candidate.score >= 50 ? '#fbbf24' : '#f87171'

              return (
                <tr
                  key={candidate.id}
                  className="group transition-colors"
                  style={{
                    borderBottom: i < candidates.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-100 text-sm">{candidate.full_name}</div>
                    <div className="text-xs text-slate-600">{candidate.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                      style={{
                        background: roleCfg.bg,
                        color: roleCfg.color,
                        border: `1px solid ${roleCfg.border}`,
                      }}
                    >
                      {candidate.desired_role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <CandidateStatusSelect
                      candidateId={candidate.id}
                      status={candidate.status}
                      labelMap={{
                        new: statusConfig.new.label,
                        review: statusConfig.review.label,
                        interview: statusConfig.interview.label,
                        hired: statusConfig.hired.label,
                        rejected: statusConfig.rejected.label,
                      }}
                      style={{
                        background: statusCfg.bg,
                        color: statusCfg.color,
                        border: `1px solid ${statusCfg.border}`,
                      }}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono" style={{ color: scoreColor }}>
                      {candidate.score}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function MetricCard({ title, value, sub, color }: { title: string; value: string; sub: string; color: string }) {
  return (
    <div
      className="rounded-2xl p-5 space-y-2"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: '#64748b' }}>
        {title}
      </p>
      <p className="text-4xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: '#475569' }}>
        {sub}
      </p>
    </div>
  )
}
