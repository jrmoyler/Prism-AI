import { getCandidates } from '../../lib/supabase'
import type { CandidateStatus } from '../../lib/types'

const statuses: CandidateStatus[] = ['new', 'review', 'interview', 'hired', 'rejected']

export default async function DashboardPage({ searchParams }: { searchParams: { status?: CandidateStatus } }) {
  const selected = searchParams.status
  const candidates = await getCandidates(selected)

  const avgScore = candidates.length ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length) : 0

  const roleDistribution = candidates.reduce((acc, candidate) => {
    acc[candidate.desired_role] = (acc[candidate.desired_role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Admin Hiring Dashboard</h1>

      <div className="mt-4 flex gap-2">
        <a href="/dashboard" className={`rounded px-3 py-1 ${!selected ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>All</a>
        {statuses.map((status) => (
          <a key={status} href={`/dashboard?status=${status}`} className={`rounded px-3 py-1 ${selected === status ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>
            {status}
          </a>
        ))}
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric title="Candidates" value={String(candidates.length)} />
        <Metric title="Average score" value={String(avgScore)} />
        <Metric title="Pipeline interview rate" value={`${Math.round(((candidates.filter((c) => c.status === 'interview').length || 0) / Math.max(candidates.length, 1)) * 100)}%`} />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="font-semibold">Role Distribution</h2>
          <ul className="mt-3 space-y-1 text-slate-300">
            {Object.entries(roleDistribution).map(([role, total]) => (
              <li key={role}>{role}: {total}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="font-semibold">Candidate Pipeline</h2>
          <ul className="mt-3 space-y-1 text-slate-300">
            {statuses.map((status) => (
              <li key={status}>{status}: {candidates.filter((c) => c.status === status).length}</li>
            ))}
          </ul>
        </article>
      </section>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2">Candidate</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-t border-slate-800">
                <td className="px-3 py-2">{candidate.full_name}<div className="text-xs text-slate-400">{candidate.email}</div></td>
                <td className="px-3 py-2 capitalize">{candidate.desired_role}</td>
                <td className="px-3 py-2">{candidate.status}</td>
                <td className="px-3 py-2">{candidate.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}
