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

const roleColors: Record<PrismRole, string> = {
  architect: 'text-indigo-400 bg-indigo-600/20 border-indigo-500/30',
  integrator: 'text-violet-400 bg-violet-600/20 border-violet-500/30',
  designer: 'text-rose-400 bg-rose-600/20 border-rose-500/30',
  educator: 'text-emerald-400 bg-emerald-600/20 border-emerald-500/30',
  consultant: 'text-amber-400 bg-amber-600/20 border-amber-500/30',
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

      {/* Role badges */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div>
          <span className="text-xs text-slate-500 block mb-1">Primary Role</span>
          <span className={`rounded-full px-3 py-1 text-sm font-medium border ${roleColors[result.primaryRole]}`}>
            {result.primaryRole.charAt(0).toUpperCase() + result.primaryRole.slice(1)}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block mb-1">Secondary Role</span>
          <span className={`rounded-full px-3 py-1 text-sm font-medium border ${roleColors[result.secondaryRole]}`}>
            {result.secondaryRole.charAt(0).toUpperCase() + result.secondaryRole.slice(1)}
          </span>
        </div>
      </div>

      {/* Radar chart */}
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-sm font-medium text-slate-400 mb-4">Role Alignment Radar</h2>
        <RadarChart data={chartData} />
      </section>

      {/* Score breakdown */}
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-sm font-medium text-slate-400 mb-4">Score Breakdown</h2>
        <div className="space-y-3">
          {chartData.map(({ role, score }) => (
            <div key={role}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize text-slate-300">{role}</span>
                <span className="text-slate-400">{score.toFixed(0)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800">
                <div
                  className="h-1.5 rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={generateReport}
        disabled={loading}
      >
        {loading ? 'Generating AI Report...' : 'Generate AI Career Report →'}
      </button>
    </main>
  )
}
