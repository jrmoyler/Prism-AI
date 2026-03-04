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
import { useState } from 'react'

type ReportResponse = {
  summary: string
  strengths: string[]
  growthAreas: string[]
  recommendedRoles: string[]
}

export default function ReportsPage() {
  const [name, setName] = useState('')
  const [background, setBackground] = useState('')
  const [report, setReport] = useState<ReportResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    const res = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, background }),
    })
    const data = (await res.json()) as ReportResponse
    setReport(data)
    setLoading(false)
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-semibold">AI Career Report Generator</h1>
      <p className="mt-2 text-slate-600">Create tailored career guidance for candidates and internal talent mobility.</p>

      <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Candidate name"
          className="rounded border border-slate-300 px-3 py-2"
        />
        <textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="Candidate background"
          className="min-h-28 rounded border border-slate-300 px-3 py-2"
        />
        <button onClick={generate} disabled={loading} className="w-fit rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60">
          {loading ? 'Generating...' : 'Generate report'}
        </button>
      </div>

      {report && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Report Summary</h2>
          <p className="mt-2 text-slate-700">{report.summary}</p>
          <p className="mt-4 font-medium">Strengths</p>
          <ul className="list-disc pl-6 text-slate-700">{report.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="mt-4 font-medium">Growth Areas</p>
          <ul className="list-disc pl-6 text-slate-700">{report.growthAreas.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="mt-4 font-medium">Recommended Roles</p>
          <ul className="list-disc pl-6 text-slate-700">{report.recommendedRoles.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}
    </main>
  )
}
