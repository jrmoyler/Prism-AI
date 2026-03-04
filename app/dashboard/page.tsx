import { getCandidates } from '../../lib/supabase'
import type { CandidateStatus } from '../../lib/types'

const statuses: CandidateStatus[] = ['new', 'review', 'interview', 'hired', 'rejected']

const statusStyles: Record<CandidateStatus, string> = {
  new: 'bg-slate-700/50 text-slate-300 border-slate-600',
  review: 'bg-blue-900/40 text-blue-300 border-blue-700',
  interview: 'bg-amber-900/40 text-amber-300 border-amber-700',
  hired: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
  rejected: 'bg-red-900/40 text-red-300 border-red-700',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { status?: CandidateStatus }
}) {
  const selected = searchParams.status
  const candidates = await getCandidates(selected)

  const avgScore =
    candidates.length
      ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length)
      : 0

  const interviewRate = Math.round(
    ((candidates.filter((c) => c.status === 'interview').length || 0) / Math.max(candidates.length, 1)) * 100,
  )

  const roleDistribution = candidates.reduce(
    (acc, candidate) => {
      acc[candidate.desired_role] = (acc[candidate.desired_role] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Admin Hiring Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Real-time hiring funnel analytics and candidate management</p>
        </div>
        <a href="/candidates" className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
          All Candidates
        </a>
      </div>

      {/* Status filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href="/dashboard"
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!selected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          All
        </a>
        {statuses.map((status) => (
          <a
            key={status}
            href={`/dashboard?status=${status}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${selected === status ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {status}
          </a>
        ))}
      </div>

      {/* Metrics */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric title="Total Candidates" value={String(candidates.length)} subtitle="in current view" />
        <Metric title="Average Score" value={String(avgScore)} subtitle="across all roles" />
        <Metric title="Interview Rate" value={`${interviewRate}%`} subtitle="pipeline conversion" />
      </section>

      {/* Analytics */}
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">Role Distribution</h2>
          <ul className="space-y-2">
            {Object.entries(roleDistribution).map(([role, total]) => (
              <li key={role} className="flex items-center justify-between">
                <span className="capitalize text-slate-300 text-sm">{role}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 rounded-full bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-indigo-500"
                      style={{ width: `${(total / Math.max(candidates.length, 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400 w-4 text-right">{total}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">Pipeline by Status</h2>
          <ul className="space-y-2">
            {statuses.map((status) => {
              const count = candidates.filter((c) => c.status === status).length
              return (
                <li key={status} className="flex items-center justify-between">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
                    {status}
                  </span>
                  <span className="text-sm text-slate-400">{count}</span>
                </li>
              )
            })}
          </ul>
        </article>
      </section>

      {/* Candidate table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 text-slate-400 font-medium">Candidate</th>
              <th className="px-4 py-3 text-slate-400 font-medium">Role</th>
              <th className="px-4 py-3 text-slate-400 font-medium">Status</th>
              <th className="px-4 py-3 text-slate-400 font-medium">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-100">{candidate.full_name}</div>
                  <div className="text-xs text-slate-500">{candidate.email}</div>
                </td>
                <td className="px-4 py-3 capitalize text-slate-300">{candidate.desired_role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[candidate.status]}`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 font-medium">{candidate.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function Metric({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  )
}
