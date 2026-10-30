'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { PrismReport } from '../../lib/types'
const sections = [{ key: 'strengths', title: 'Strengths to explore' }, { key: 'jobRoles', title: 'Roles to investigate' }, { key: 'skillRoadmap', title: 'Your practice roadmap' }, { key: 'learningResources', title: 'Learning resources' }] as const

export default function ReportsPage() {
  const [report, setReport] = useState<(PrismReport & { source?: 'ai' | 'guided' }) | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('prism-report-v1') ?? 'null')
      if (parsed && typeof parsed.summary === 'string' && sections.every(({ key }) => Array.isArray(parsed[key]) && parsed[key].every((entry: unknown) => typeof entry === 'string'))) setReport(parsed)
    } catch { /* Corrupt or inaccessible browser storage is handled below. */ }
    setReady(true)
  }, [])
  if (!ready) return <main className="mx-auto max-w-4xl px-6 py-16" aria-busy="true">Loading your report…</main>
  if (!report) return <main className="mx-auto max-w-3xl px-6 py-20 space-y-6"><p className="text-xs uppercase tracking-widest text-[#D4A843]">Career report</p><h1 className="text-4xl">Build your next step.</h1><p className="text-slate-300">No report is saved in this browser. Generate one from your assessment results, or take the assessment to begin.</p><div className="flex flex-wrap gap-4"><Link href="/results" className="bg-[#D4A843] text-[#050A18] px-6 py-3 font-semibold">View my results</Link><Link href="/assessment" className="px-6 py-3 border border-[#35415A]">Take assessment</Link></div></main>
  return <main className="mx-auto max-w-5xl px-6 py-12 space-y-10">
    <header className="space-y-3"><p className="text-xs uppercase tracking-widest text-[#D4A843]">02 / Career field notes</p><h1 className="text-4xl md:text-5xl">A plan you can put to work.</h1><p className="text-slate-300">{report.source === 'ai' ? 'AI-assisted guidance based on your PRISM responses.' : report.source === 'guided' ? 'Standard role guidance based on your PRISM responses.' : 'Guidance based on your PRISM responses. Generation method was not recorded for this report.'}</p></header>
    <section className="border-l-2 border-[#D4A843] bg-[#0D1326] p-6 md:p-8"><h2 className="text-xs uppercase tracking-widest text-[#D4A843] mb-4">Your starting point</h2><p className="text-lg text-slate-200 leading-relaxed">{report.summary}</p></section>
    <div className="grid md:grid-cols-2 gap-6">{sections.map(({ key, title }, index) => <section key={key} className="border border-[#263147] p-6 bg-[#0D1326]"><p className="font-mono text-xs text-[#00D9B5] mb-5">0{index + 1}</p><h2 className="text-xl mb-5">{title}</h2><ul className="space-y-4 list-disc pl-5 text-slate-300">{report[key].map((entry, i) => <li key={i} className="pl-1 leading-relaxed">{entry}</li>)}</ul></section>)}</div>
    <p className="text-sm text-slate-300">Treat these suggestions as prompts for exploration. Validate them through projects, conversations, and your own goals; this report does not verify skills or guarantee employment.</p>
    <div className="flex flex-wrap gap-4 border-t border-[#263147] pt-6"><Link href="/results" className="border border-[#35415A] px-5 py-3">Return to role map</Link><button onClick={() => window.print()} className="px-5 py-3 bg-[#D4A843] text-[#050A18] font-semibold">Print report</button><Link href="/assessment" className="px-5 py-3 underline underline-offset-4">New assessment</Link></div>
  </main>
}
