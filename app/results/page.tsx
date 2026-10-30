'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RadarChart from '../../components/RadarChart'
import type { PrismRole } from '../../prism/questions'
import { getSupabaseBrowserClient } from '../../lib/supabase-client'

const roles: PrismRole[] = ['architect', 'integrator', 'designer', 'educator', 'consultant']
type Stored = { normalizedScores: Record<PrismRole, number>; primaryRole: PrismRole; secondaryRole: PrismRole; saveError?: string }
const panel = { background: '#0D1326', border: '1px solid #263147' }

export default function ResultsPage() {
  const [result, setResult] = useState<Stored | null>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('prism-results-v1') ?? 'null')
      if (parsed && roles.includes(parsed.primaryRole) && roles.includes(parsed.secondaryRole) && roles.every(role => typeof parsed.normalizedScores?.[role] === 'number' && Number.isFinite(parsed.normalizedScores[role]) && parsed.normalizedScores[role] >= 0 && parsed.normalizedScores[role] <= 100)) setResult(parsed)
    } catch { /* Invalid or inaccessible local data has an explicit empty state. */ }
    setReady(true)
  }, [])

  async function generateReport() {
    if (!result || loading) return
    setLoading(true); setError('')
    try {
      const supabase = getSupabaseBrowserClient()
      const session = supabase ? (await supabase.auth.getSession()).data.session : null
      const response = await fetch('/api/prism-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ primaryRole: result.primaryRole, secondaryRole: result.secondaryRole, scores: result.normalizedScores }),
      })
      const report = await response.json()
      if (!response.ok) throw new Error(report.error || 'Unable to generate your report. Please try again.')
      localStorage.setItem('prism-report-v1', JSON.stringify(report))
      window.location.assign('/reports')
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to save your report. Enable browser storage and try again.'); setLoading(false) }
  }
  if (!ready) return <main className="mx-auto max-w-5xl px-6 py-16" aria-busy="true">Loading your results…</main>
  if (!result) return <main className="mx-auto max-w-3xl px-6 py-20 space-y-6"><p className="text-xs uppercase tracking-widest text-[#D4A843]">Your assessment</p><h1 className="text-4xl">Your profile starts here.</h1><p className="text-slate-300">No valid assessment is saved in this browser. Complete the 50 questions to see your role alignment.</p><Link className="inline-block bg-[#D4A843] px-6 py-3 text-[#050A18] font-semibold" href="/assessment">Take the assessment</Link></main>
  const chartData = roles.map(role => ({ role, score: result.normalizedScores[role] }))
  return <main className="mx-auto max-w-6xl px-6 py-12 space-y-10">
    <header className="space-y-3"><p className="text-xs uppercase tracking-widest text-[#D4A843]">01 / Your role map</p><h1 className="text-4xl md:text-5xl">A direction to explore.</h1><p className="max-w-2xl text-slate-300">Your answers suggest where your interests and working preferences align. Use this profile to choose what to practice next.</p></header>
    {typeof result.saveError === 'string' && <p role="status" className="border border-[#D4A843] p-4 text-[#D4A843]">{result.saveError}</p>}
    <section className="grid md:grid-cols-2 gap-px bg-[#263147] border border-[#263147]" aria-label="Strongest role alignment">
      {[['Strongest alignment', result.primaryRole], ['Supporting alignment', result.secondaryRole]].map(([label, role], i) => <article key={label} className="p-7 bg-[#0D1326]"><p className="text-xs uppercase tracking-widest text-slate-300">{label}</p><h2 className={`text-3xl capitalize mt-4 ${i === 0 ? 'text-[#D4A843]' : 'text-[#00D9B5]'}`}>{role}</h2><p className="mt-2 text-slate-300 font-mono">{result.normalizedScores[role as PrismRole].toFixed(0)} / 100</p></article>)}
    </section>
    <section className="grid lg:grid-cols-2 gap-8 p-5 md:p-8" style={panel}>
      <div><h2 className="text-xl">Five dimensions, one profile.</h2><RadarChart data={chartData} /></div>
      <div className="space-y-5"><h2 className="text-xl">Your score breakdown</h2>{chartData.map(({ role, score }) => <div key={role}><div className="flex justify-between mb-2 text-sm"><span className="capitalize">{role}</span><span className="font-mono text-[#D4A843]">{score.toFixed(0)} / 100</span></div><meter className="w-full h-3" style={{ accentColor: '#D4A843' }} min={0} max={100} value={score} aria-label={`${role} alignment`}>{score}</meter></div>)}<p className="text-sm text-slate-300 leading-relaxed">Scores are self-reported agreement relative to the maximum response score. They are not percentiles, a skills test, or a prediction of job performance. Equal scores can occur.</p></div>
    </section>
    <section className="flex flex-col md:flex-row gap-6 justify-between items-start border-t border-[#263147] pt-8"><div><h2 className="text-2xl">Turn reflection into a plan.</h2><p className="text-slate-300 mt-2">Generate a career report with roles, practice areas, and learning resources.</p></div><button onClick={generateReport} disabled={loading} className="px-6 py-3 bg-[#D4A843] text-[#050A18] font-semibold disabled:opacity-50 whitespace-nowrap">{loading ? 'Preparing report…' : 'Generate career report'}</button></section>
    {error && <p role="alert" className="text-red-300">{error}</p>}
    <Link href="/assessment" className="inline-block underline underline-offset-4 text-slate-300">Take a new assessment</Link>
  </main>
}
