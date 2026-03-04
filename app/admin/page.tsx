import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/dashboard')
import { getCandidates } from '../../lib/supabase'

export default async function AdminDashboardPage() {
  const candidates = await getCandidates()

  const totals = candidates.reduce(
    (acc, candidate) => {
      acc.total += 1
      acc.score += candidate.score
      acc.byStage[candidate.stage] = (acc.byStage[candidate.stage] || 0) + 1
      return acc
    },
    {
      total: 0,
      score: 0,
      byStage: {} as Record<string, number>,
    },
  )

  const avgScore = totals.total ? Math.round(totals.score / totals.total) : 0

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-semibold">Admin Hiring Dashboard</h1>
      <p className="mt-2 text-slate-600">Enterprise analytics across candidate quality and funnel progress.</p>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total candidates</p>
          <p className="mt-1 text-2xl font-semibold">{totals.total}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Average candidate score</p>
          <p className="mt-1 text-2xl font-semibold">{avgScore}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Offer conversion</p>
          <p className="mt-1 text-2xl font-semibold">
            {totals.total ? Math.round(((totals.byStage.Offer || 0) / totals.total) * 100) : 0}%
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Pipeline by Stage</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {['Applied', 'Screen', 'Interview', 'Offer', 'Hired'].map((stage) => (
            <div key={stage} className="rounded border border-slate-200 p-3">
              <p className="text-sm text-slate-600">{stage}</p>
              <p className="text-xl font-semibold">{totals.byStage[stage] || 0}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
