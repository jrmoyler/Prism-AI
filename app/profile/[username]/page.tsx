import RadarChart from '../../../components/RadarChart'

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const chartData = [
    { role: 'architect', score: 84 },
    { role: 'integrator', score: 78 },
    { role: 'designer', score: 72 },
    { role: 'educator', score: 65 },
    { role: 'consultant', score: 80 },
  ]

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold">@{params.username} • PRISM Profile</h1>
      <p className="mt-2 text-slate-400">Primary role: Architect</p>
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <RadarChart data={chartData} />
      </div>
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="font-semibold">Skills</h2>
        <p className="mt-2 text-slate-300">System design, integration strategy, stakeholder communication, analytics execution.</p>
      </section>
    </main>
  )
}
