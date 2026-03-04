"use client"

import { useEffect, useMemo, useState } from 'react'
import { questions } from '../../prism/questions'
import { questions } from "../../prism/questions"
import { useState } from "react"
import QuestionCard from "../../components/QuestionCard"

const STORAGE_KEY = 'prism-assessment-v1'

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
      <h1 className="text-3xl font-semibold">PRISM Assessment</h1>
      <p className="mt-2 text-sm text-slate-400">50 questions • 1-5 scale • autosave enabled</p>

      <div className="mt-6 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-sm text-slate-400">Question {index + 1} of {questions.length}</p>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-lg">{current.text}</p>
        <input
          className="mt-5 w-full"
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
        <div className="mt-2 text-sm text-slate-400">Score: {answers[index]}</div>
      </section>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => setIndex((v) => Math.max(0, v - 1))} className="rounded border border-slate-700 px-4 py-2" disabled={index === 0}>Previous</button>
        {index < questions.length - 1 ? (
          <button onClick={() => setIndex((v) => Math.min(questions.length - 1, v + 1))} className="rounded bg-indigo-600 px-4 py-2 text-white">Next</button>
        ) : (
          <button onClick={submit} className="rounded bg-emerald-600 px-4 py-2 text-white">Submit Assessment</button>
        )}
      </div>
    </main>
  )
}
