type AnalyticsProps = {
  roleDistribution: Array<{ role: string; count: number }>
  pipelineDistribution: Array<{ status: string; count: number }>
  averageScoreByRole: Array<{ role: string; score: number }>
}

export default function DashboardAnalytics({roleDistribution, pipelineDistribution, averageScoreByRole}: AnalyticsProps) {
  const total = roleDistribution.reduce((sum, row) => sum + row.count, 0)
  return <section aria-label="Pipeline breakdown" className="grid gap-6 lg:grid-cols-2">
    <article className="border border-slate-700 p-6" style={{background:'#0D1326'}}>
      <h2 className="mb-2 text-xl font-semibold">Where candidates stand</h2><p className="mb-6 text-sm text-slate-400">Current stage, not historical conversion.</p>
      <dl className="space-y-5">{pipelineDistribution.map(row => <div key={row.status}><div className="mb-2 flex justify-between gap-3"><dt className="capitalize text-slate-300">{row.status}</dt><dd className="font-mono text-sm">{row.count}<span className="ml-3 text-slate-400">{total ? Math.round(row.count / total * 100) : 0}%</span></dd></div><div aria-hidden="true" className="h-1.5 bg-slate-800"><div className="h-full" style={{width:`${total ? row.count / total * 100 : 0}%`,background:'#D4A843'}} /></div></div>)}</dl>
    </article>
    <article className="border border-slate-700 p-6" style={{background:'#0D1326'}}><h2 className="mb-2 text-xl font-semibold">Role interests</h2><p className="mb-6 text-sm text-slate-400">Candidate count and average self-assessment score.</p><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-700 text-slate-400"><th scope="col" className="pb-3 font-normal">Role</th><th scope="col" className="pb-3 text-right font-normal">People</th><th scope="col" className="pb-3 text-right font-normal">Avg. / 100</th></tr></thead><tbody>{averageScoreByRole.map(row => {const count = roleDistribution.find(distribution => distribution.role === row.role)?.count ?? 0; return <tr key={row.role} className="border-b border-slate-800"><th scope="row" className="py-4 font-normal capitalize text-slate-300">{row.role}</th><td className="text-right font-mono">{count}</td><td className="text-right font-mono" style={{color:'#00D9B5'}}>{count ? row.score : '—'}</td></tr>})}</tbody></table></article>
  </section>
}
