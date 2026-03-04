"use client"

import { useEffect, useMemo, useState } from 'react'
import RadarChart from '../../components/RadarChart'
import type { PrismRole } from '../../prism/questions'

type Stored = {
  normalizedScores: Record<PrismRole, number>
  primaryRole: PrismRole
  secondaryRole: PrismRole
}

const defaultData: Stored = {
  normalizedScores: { architect: 0, integrator: 0, designer: 0, educator: 0, consultant: 0 },
  primaryRole: 'architect',
  secondaryRole: 'integrator',
}

export default function ResultsPage() {
  const [result, setResult] = useState<Stored>(defaultData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('prism-results-v1')
    if (!raw) return
    setResult({ ...defaultData, ...JSON.parse(raw) })
  }, [])

  const chartData = useMemo(
    () => Object.entries(result.normalizedScores).map(([role, score]) => ({ role, score })),
    [result.normalizedScores],
  )

  const generateReport = async () => {
    setLoading(true)
    const response = await fetch('/api/prism-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        primaryRole: result.primaryRole,
        secondaryRole: result.secondaryRole,
        scores: result.normalizedScores,
      }),
    })
    const report = await response.json()
    localStorage.setItem('prism-report-v1', JSON.stringify(report))
    window.location.href = '/reports'
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Assessment Results</h1>
      <p className="mt-2 text-slate-400">Primary Role: <strong className="text-white">{result.primaryRole}</strong> • Secondary Role: <strong className="text-white">{result.secondaryRole}</strong></p>
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <RadarChart data={chartData} />
      </section>
      <button className="mt-6 rounded bg-indigo-600 px-4 py-2 text-white" onClick={generateReport}>
        {loading ? 'Generating...' : 'Generate AI Career Report'}
      </button>
    </main>
  )
}
