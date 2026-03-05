"use client"

import { useEffect, useMemo, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import dynamic from 'next/dynamic'
import ScoreBar from '../../components/ui/ScoreBar'
import type { PrismRole } from '../../prism/questions'

type Stored = {
  normalizedScores: Record<PrismRole, number>
  primaryRole:   PrismRole
  secondaryRole: PrismRole
}

const defaultData: Stored = {
  normalizedScores: { architect: 0, integrator: 0, designer: 0, educator: 0, consultant: 0 },
  primaryRole:   'architect',
  secondaryRole: 'integrator',
}

const roleConfig: Record<PrismRole, {
  label: string
  description: string
  color: string
  bg: string
  border: string
}> = {
  architect: {
    label: 'Architect',
    description: 'Scalable system designer with deep technical vision.',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
  },
  integrator: {
    label: 'Integrator',
    description: 'Automation-oriented bridge between people, tools, and workflow.',
    color: '#a78bfa',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
  },
  designer: {
    label: 'Designer',
    description: 'Experience-first creator focused on product craft.',
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.2)',
  },
  educator: {
    label: 'Educator',
    description: 'Knowledge multiplier who mentors and communicates AI concepts.',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
  },
  consultant: {
    label: 'Consultant',
    description: 'Business-aligned strategist who bridges AI and outcomes.',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
}


const RadarChart = dynamic(() => import('../../components/RadarChart'), {
  ssr: false,
  loading: () => <div className="h-[320px] rounded-xl bg-white/5 animate-pulse" />,
})
export default function ResultsPage() {
  const [result, setResult]   = useState<Stored>(defaultData)
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
        primaryRole:   result.primaryRole,
        secondaryRole: result.secondaryRole,
        scores:        result.normalizedScores,
      }),
    })
    const report = await response.json()
    localStorage.setItem('prism-report-v1', JSON.stringify(report))
    window.location.href = '/reports'
  }

  const primary   = roleConfig[result.primaryRole]   ?? roleConfig.architect
  const secondary = roleConfig[result.secondaryRole] ?? roleConfig.integrator

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 space-y-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
          Assessment Results
        </p>
        <h1 className="text-3xl font-bold text-white">Your PRISM Profile</h1>
        <p className="text-slate-500 text-sm">
          Based on your 50-question adaptive assessment
        </p>
      </motion.div>

      {/* Primary + Secondary Role cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 gap-4"
      >
        <RoleCard role={result.primaryRole}   label="Primary Role"   config={primary}   delay={0} />
        <RoleCard role={result.secondaryRole} label="Secondary Role" config={secondary} delay={0.1} />
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-2xl p-8"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white">Role Alignment Radar</h2>
            <p className="text-xs text-slate-600 mt-0.5">Normalized scores across all 5 PRISM dimensions</p>
          </div>
          <div
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#818cf8',
            }}
          >
            {result.primaryRole.charAt(0).toUpperCase() + result.primaryRole.slice(1)} aligned
          </div>
        </div>
        <RadarChart data={chartData} />
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 className="text-sm font-semibold text-white">Score Breakdown</h2>
        <div className="space-y-4">
          {chartData.map(({ role, score }, i) => (
            <ScoreBar
              key={role}
              role={role as PrismRole}
              score={score}
              delay={0.4 + i * 0.07}
            />
          ))}
        </div>
      </motion.div>

      {/* Generate report CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">Generate Your AI Career Report</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            GPT-4o powered insights — strengths, career paths, skills to develop, and tools to learn.
          </p>
        </div>
        <motion.button
          onClick={generateReport}
          disabled={loading}
          whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white flex-shrink-0"
          style={{
            background: loading
              ? 'rgba(99,102,241,0.4)'
              : 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
            boxShadow: loading
              ? 'none'
              : '0 0 0 1px rgba(99,102,241,0.5), 0 4px 16px rgba(99,102,241,0.25)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeDasharray="30 10" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              Generate AI Report
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </motion.button>
      </motion.div>
    </main>
  )
}

function RoleCard({
  role,
  label,
  config,
  delay,
}: {
  role: PrismRole
  label: string
  config: typeof roleConfig[PrismRole]
  delay: number
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl p-5 space-y-3"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: config.color, opacity: 0.7 }}
      >
        {label}
      </p>
      <div>
        <h3
          className="text-2xl font-bold"
          style={{ color: config.color }}
        >
          {config.label}
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{config.description}</p>
      </div>
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
        style={{
          background: `${config.color}18`,
          border: `1px solid ${config.border}`,
          color: config.color,
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: config.color }} />
        {role}
      </div>
    </motion.div>
  )
}
