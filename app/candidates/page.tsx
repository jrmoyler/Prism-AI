import { getCandidates } from '../../lib/supabase'

export default async function CandidatesPage() {
  const candidates = await getCandidates()

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Candidate Database</h1>
      <p className="mt-2 text-slate-400">Supabase-backed candidate records used by the dashboard analytics.</p>
      <ul className="mt-5 space-y-2">
        {candidates.map((candidate) => (
          <li key={candidate.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="font-medium">{candidate.full_name} <span className="text-sm text-slate-400">({candidate.email})</span></div>
            <div className="text-sm text-slate-300">Role: {candidate.desired_role} • Status: {candidate.status} • Score: {candidate.score}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}
