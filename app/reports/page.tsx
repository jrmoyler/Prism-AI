"use client"

import { useEffect, useState } from 'react'
import type { PrismReport } from '../../lib/types'

export default function ReportsPage() {
  const [report, setReport] = useState<PrismReport | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('prism-report-v1')
    if (raw) setReport(JSON.parse(raw))
  }, [])

  if (!report) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">No report yet.</p>
          <p className="mt-2 text-sm text-slate-500">Complete the assessment first, then generate your AI career report from the results page.</p>
          <a href="/assessment" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 transition-colors">
            Take Assessment
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold">AI Career Report</h1>
      <p className="mt-2 text-sm text-slate-400">Generated from your PRISM assessment results</p>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-2">Summary</h2>
        <p className="text-slate-200 leading-relaxed">{report.summary}</p>
      </div>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <Card title="Career Strengths" items={report.strengths} accent="indigo" />
        <Card title="Recommended Job Roles" items={report.jobRoles} accent="violet" />
        <Card title="Skill Roadmap" items={report.skillRoadmap} accent="emerald" />
        <Card title="Learning Resources" items={report.learningResources} accent="amber" />
      </section>

      <div className="mt-6 flex gap-3">
        <a href="/assessment" className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm">
          Retake Assessment
        </a>
        <a href="/results" className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm">
          View Radar Chart
        </a>
      </div>
    </main>
  )
}

function Card({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  const accentMap: Record<string, string> = {
    indigo: 'text-indigo-400',
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
  }
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className={`text-xs font-medium uppercase tracking-widest mb-3 ${accentMap[accent] ?? 'text-slate-400'}`}>{title}</h2>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="mt-1 text-slate-600">•</span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}
