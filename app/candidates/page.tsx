import { getCandidates } from '../../lib/supabase'

const statusStyles: Record<string, string> = {
  new: 'bg-slate-700/50 text-slate-300 border-slate-600',
  review: 'bg-blue-900/40 text-blue-300 border-blue-700',
  interview: 'bg-amber-900/40 text-amber-300 border-amber-700',
  hired: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
  rejected: 'bg-red-900/40 text-red-300 border-red-700',
}

export default async function CandidatesPage() {
  const candidates = await getCandidates()

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Candidate Database</h1>
      <p className="mt-2 text-slate-400">Supabase-backed candidate records with local fallback for development.</p>

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
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[candidate.status] ?? statusStyles.new}`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{candidate.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
