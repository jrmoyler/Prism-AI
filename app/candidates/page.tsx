import { getCandidates } from '../../lib/supabase'

const stageStyles: Record<string, string> = {
  Applied: 'bg-slate-100 text-slate-700',
  Screen: 'bg-blue-100 text-blue-700',
  Interview: 'bg-amber-100 text-amber-700',
  Offer: 'bg-violet-100 text-violet-700',
  Hired: 'bg-emerald-100 text-emerald-700',
}

export default async function CandidatePipelinePage() {
  const candidates = await getCandidates()

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-semibold">Candidate Pipeline</h1>
      <p className="mt-2 text-slate-600">Backed by Supabase when configured, with resilient local fallback for development.</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{candidate.full_name}</td>
                <td className="px-4 py-3">{candidate.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${stageStyles[candidate.stage]}`}>{candidate.stage}</span>
                </td>
                <td className="px-4 py-3">{candidate.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
