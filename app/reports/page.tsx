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
    return <main className="mx-auto max-w-3xl p-8">No report yet. Complete assessment first.</main>
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold">AI Career Report</h1>
      <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">{report.summary}</p>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <Card title="Career Strengths" items={report.strengths} />
        <Card title="Recommended Job Roles" items={report.jobRoles} />
        <Card title="Skill Roadmap" items={report.skillRoadmap} />
        <Card title="Learning Resources" items={report.learningResources} />
      </section>
    </main>
  )
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-2 list-disc pl-5 text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
