"use client"

import { useEffect, useMemo, useState } from 'react'
import { questions } from '../../prism/questions'

const STORAGE_KEY = 'prism-assessment-v1'

const roleLabels: Record<string, string> = {
  architect: 'Architect',
  integrator: 'Integrator',
  designer: 'Designer',
  educator: 'Educator',
  consultant: 'Consultant',
}

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(3))
  const [index, setIndex] = useState(0)
  const current = questions[index]

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as { answers: number[]; index: number }
      if (parsed.answers?.length === questions.length) {
        setAnswers(parsed.answers)
        setIndex(parsed.index ?? 0)
      }
    } catch {
      // noop
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index }))
  }, [answers, index])

  const progress = useMemo(() => Math.round(((index + 1) / questions.length) * 100), [index])

  const submit = async () => {
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
    const data = await res.json()
    localStorage.setItem('prism-results-v1', JSON.stringify(data))
    window.location.href = '/results'
  }

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">PRISM Assessment</h1>
        <p className="mt-2 text-sm text-slate-400">50 questions · 1–5 scale · autosave enabled</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Question {index + 1} of {questions.length}</span>
          <span>{progress}% complete</span>
        </div>
      </div>

      {/* Question card */}
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-indigo-600/20 px-2.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/30">
            {roleLabels[current.role] ?? current.role}
          </span>
          <span className="text-xs text-slate-500">Weight: {current.weight}/3</span>
        </div>
        <p className="text-lg leading-relaxed">{current.text}</p>
        <div className="mt-6">
          <input
            className="w-full accent-indigo-500 cursor-pointer"
            type="range"
            min={1}
            max={5}
            value={answers[index]}
            onChange={(event) => {
              const next = [...answers]
              next[index] = Number(event.target.value)
              setAnswers(next)
            }}
          />
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>1 — Strongly disagree</span>
            <span className="font-semibold text-indigo-400 text-sm">{answers[index]}</span>
            <span>5 — Strongly agree</span>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:border-slate-600 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={index === 0}
        >
          ← Previous
        </button>
        {index < questions.length - 1 ? (
          <button
            onClick={() => setIndex((v) => Math.min(questions.length - 1, v + 1))}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={submit}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-white font-medium hover:bg-emerald-500 transition-colors"
          >
            Submit Assessment
          </button>
        )}
      </div>
    </main>
  )
}
