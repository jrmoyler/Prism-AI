"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PrismReport } from '../../lib/types'

const sections = [
  {
    key:     'strengths' as keyof PrismReport,
    title:   'Career Strengths',
    icon:    '◈',
    color:   '#818cf8',
    bg:      'rgba(99,102,241,0.06)',
    border:  'rgba(99,102,241,0.15)',
    dotColor:'#6366f1',
  },
  {
    key:     'jobRoles' as keyof PrismReport,
    title:   'Recommended Roles',
    icon:    '◎',
    color:   '#a78bfa',
    bg:      'rgba(139,92,246,0.06)',
    border:  'rgba(139,92,246,0.15)',
    dotColor:'#8b5cf6',
  },
  {
    key:     'skillRoadmap' as keyof PrismReport,
    title:   'Skills to Develop',
    icon:    '◇',
    color:   '#34d399',
    bg:      'rgba(52,211,153,0.06)',
    border:  'rgba(52,211,153,0.15)',
    dotColor:'#10b981',
  },
  {
    key:     'learningResources' as keyof PrismReport,
    title:   'Tools to Learn',
    icon:    '◉',
    color:   '#fbbf24',
    bg:      'rgba(251,191,36,0.06)',
    border:  'rgba(251,191,36,0.15)',
    dotColor:'#f59e0b',
  },
]

export default function ReportsPage() {
  const [report, setReport] = useState<PrismReport | null>(null)
  const [expanded, setExpanded] = useState<string | null>('strengths')

  useEffect(() => {
    const raw = localStorage.getItem('prism-report-v1')
    if (raw) {
      setReport(JSON.parse(raw))
    }
  }, [])

  if (!report) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-2xl p-10 text-center space-y-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <svg className="h-6 w-6 text-indigo-400" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">No report yet</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Complete the assessment first, then generate your AI career intelligence report.
            </p>
          </div>
          <motion.a
            href="/assessment"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.4)',
            }}
          >
            Take Assessment
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#818cf8',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI Career Intelligence Report
        </div>
        <h1 className="text-3xl font-bold text-white">Career Profile</h1>
        <p className="text-sm text-slate-500">
          Generated from your PRISM assessment · Powered by GPT-4o
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl p-6 space-y-3"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.05) 100%)',
          border: '1px solid rgba(99,102,241,0.12)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="currentColor" fillOpacity="0.8" />
            </svg>
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#818cf8' }}>
            Executive Summary
          </h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-sm">{report.summary}</p>
      </motion.div>

      {/* Divider */}
      <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

      {/* Expandable sections */}
      <div className="space-y-3">
        {sections.map((section, i) => {
          const items = report[section.key] as string[]
          const isOpen = expanded === section.key

          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: isOpen ? section.bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isOpen ? section.border : 'rgba(255,255,255,0.06)'}`,
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
            >
              {/* Header button */}
              <button
                onClick={() => setExpanded(isOpen ? null : section.key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-base"
                    style={{ color: section.color }}
                  >
                    {section.icon}
                  </span>
                  <span className="text-sm font-semibold text-white">{section.title}</span>
                  {items?.length > 0 && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        background: `${section.color}18`,
                        color: section.color,
                      }}
                    >
                      {items.length}
                    </span>
                  )}
                </div>
                <motion.svg
                  className="h-4 w-4 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: '#64748b' }}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>

              {/* Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-5 pb-5 space-y-2"
                      style={{ borderTop: `1px solid ${section.border}` }}
                    >
                      {items?.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.25 }}
                          className="flex items-start gap-3 pt-3"
                        >
                          <div
                            className="mt-[3px] h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ background: section.dotColor }}
                          />
                          <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="flex flex-wrap gap-3 pt-2"
      >
        <motion.a
          href="/assessment"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retake Assessment
        </motion.a>
        <motion.a
          href="/results"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          View Radar Chart
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </motion.div>
    </main>
  )
}
