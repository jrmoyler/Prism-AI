"use client"

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { questions, QUESTION_COUNT } from '../../prism/questions'
import { getSupabaseBrowserClient } from '../../lib/supabase-client'
import { STORAGE_KEY, defaultState, sanitizeState, type AssessmentState } from './state'

const responseLabels: Record<number, { short: string; long: string }> = {
  1: { short: 'Strongly\nDisagree', long: 'Strongly Disagree' },
  2: { short: 'Disagree', long: 'Disagree' },
  3: { short: 'Neutral', long: 'Neutral' },
  4: { short: 'Agree', long: 'Agree' },
  5: { short: 'Strongly\nAgree', long: 'Strongly Agree' },
}

function loadState(): AssessmentState {
  try {
    return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'))
  } catch {
    return defaultState()
  }
}

export default function AssessmentPage() {
  const [state, setState] = useState<AssessmentState>(defaultState)
  const [hydrated, setHydrated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [storageWarning, setStorageWarning] = useState('')
  useEffect(() => {
    const loaded = loadState()
    setState(loaded.completed ? defaultState() : loaded)
    setHydrated(true)
  }, [])
  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
    catch { setStorageWarning('Browser storage is unavailable. Keep this page open to retain your answers. Saving results requires browser storage.') }
  }, [state, hydrated])
  const index = state.currentQuestionIndex
  const current = questions.find(question => question.id === state.randomizedQuestions[index]) ?? questions[0]
  const selected = state.answers[current.id]
  const answeredCount = Object.keys(state.answers).length
  const progress = answeredCount / QUESTION_COUNT * 100
  const firstUnanswered = state.randomizedQuestions.findIndex(id => !state.answers[id])
  const answer = useCallback((response: number) => {
    if (submitting) return
    setState(previous => ({ ...previous, answers: { ...previous.answers, [previous.randomizedQuestions[previous.currentQuestionIndex]]: response } }))
  }, [submitting])
  const move = useCallback((delta: number) => {
    if (submitting) return
    setState(previous => ({ ...previous, currentQuestionIndex: Math.max(0, Math.min(QUESTION_COUNT - 1, previous.currentQuestionIndex + delta)) }))
  }, [submitting])
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (submitting || event.altKey || event.ctrlKey || event.metaKey || target.closest('input,textarea,select,button,a,[contenteditable="true"]')) return
      if (['1', '2', '3', '4', '5'].includes(event.key)) { event.preventDefault(); answer(Number(event.key)) }
      if (event.key === 'ArrowRight' && selected && index < QUESTION_COUNT - 1) { event.preventDefault(); move(1) }
      if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); move(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answer, move, selected, index, submitting])
  async function submit() {
    if (submitting || answeredCount !== QUESTION_COUNT) return
    setSubmitting(true); setError('')
    try {
      const supabase = getSupabaseBrowserClient()
      const session = supabase ? (await supabase.auth.getSession()).data.session : null
      const response = await fetch('/api/prism-score', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) }, body: JSON.stringify({ answers: state.answers, questionIds: state.randomizedQuestions }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'Unable to score your assessment. Please try again.')
      localStorage.setItem('prism-results-v1', JSON.stringify(payload))
      localStorage.removeItem('prism-report-v1')
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, completed: true }))
      window.location.assign('/results')
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to save your results. Please try again.'); setSubmitting(false) }
  }
  if (!hydrated) return <main className="mx-auto max-w-4xl px-6 py-16" aria-busy="true">Restoring your assessment…</main>
  return <main className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-16">
    <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
      <aside className="space-y-6"><p className="text-xs uppercase tracking-widest text-[#D4A843]">PRISM / Assessment</p><h1 className="text-3xl md:text-4xl leading-tight">Start with how<br className="hidden lg:block" /> you work.</h1><p className="text-sm leading-relaxed text-slate-300">Think about your current interests and habits. There are no right answers. Choose the response that describes you best.</p><div className="border-t border-[#35415A] pt-5"><p className="text-sm text-slate-300 mb-3">{answeredCount} of {QUESTION_COUNT} answered</p><progress max={QUESTION_COUNT} value={answeredCount} className="w-full h-2" style={{ accentColor: '#D4A843' }} aria-label="Assessment completion" /><p className="font-mono text-xs text-[#D4A843] mt-2">{Math.round(progress)}% complete</p></div><p role="status" className="text-xs text-slate-300">{storageWarning || 'Progress is saved in this browser.'}</p><Link href="/" className="inline-block text-sm underline underline-offset-4 text-slate-300">{storageWarning ? 'Leave assessment' : 'Save and leave'}</Link></aside>
      <section aria-label="Assessment question" className="space-y-6">
        <details className="border border-[#35415A] bg-[#0D1326]">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold">Question overview <span className="font-normal text-slate-300"> / {answeredCount} answered</span></summary>
          <div className="border-t border-[#35415A] p-5">
            <p className="mb-4 text-sm text-slate-300">Jump to any question to review or change your answer. Answered questions are marked.</p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">{state.randomizedQuestions.map((id, questionIndex) => <button key={id} type="button" disabled={submitting} aria-current={questionIndex === index ? 'step' : undefined} aria-label={`Question ${questionIndex + 1}, ${state.answers[id] ? 'answered' : 'unanswered'}${questionIndex === index ? ', current question' : ''}`} onClick={() => setState(previous => ({ ...previous, currentQuestionIndex: questionIndex }))} className={`min-h-11 border text-sm font-mono ${questionIndex === index ? 'border-[#D4A843] bg-[#D4A843] text-[#050A18]' : state.answers[id] ? 'border-[#00D9B5] text-[#00D9B5]' : 'border-[#35415A] text-slate-300'}`}>{questionIndex + 1}{state.answers[id] && <span aria-hidden="true"> ·</span>}</button>)}</div>
          </div>
        </details>
        <div className="flex justify-between text-xs uppercase tracking-widest text-slate-300"><span>Question {String(index + 1).padStart(2, '0')}</span><span>of {QUESTION_COUNT}</span></div>
        <fieldset disabled={submitting} className="border border-[#35415A] bg-[#0D1326] p-5 md:p-9 space-y-8">
          <legend className="sr-only">Question {index + 1}</legend><h2 className="text-2xl md:text-3xl leading-snug min-h-[110px]" aria-live="polite">{current.text}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2" role="group" aria-label="Select your agreement level">{[1, 2, 3, 4, 5].map(response => <button key={response} type="button" aria-pressed={selected === response} onClick={() => answer(response)} className="flex sm:flex-col items-center gap-3 p-3 min-h-[48px] sm:min-h-[108px] border text-left sm:text-center" style={{ background: selected === response ? '#D4A843' : '#050A18', color: selected === response ? '#050A18' : '#DCE3ED', borderColor: selected === response ? '#D4A843' : '#35415A' }}><span className="font-mono text-lg">{response}</span><span className="text-xs leading-snug">{responseLabels[response].long}</span></button>)}</div>
          <p role="status" className="text-sm text-slate-300">{selected ? `Your response: ${responseLabels[selected].long}` : 'Choose one response to continue.'}</p>
        </fieldset>
        {index === QUESTION_COUNT - 1 && firstUnanswered !== -1 && <p className="text-sm text-slate-300">{QUESTION_COUNT - answeredCount} remaining. <button type="button" className="text-[#00D9B5] underline underline-offset-4" onClick={() => setState(previous => ({ ...previous, currentQuestionIndex: firstUnanswered }))}>Go to first unanswered question</button></p>}
        {error && <p role="alert" className="border border-red-900 p-4 text-red-300">{error}</p>}
        <div className="flex justify-between gap-4"><button type="button" disabled={index === 0 || submitting} onClick={() => move(-1)} className="border border-[#35415A] px-5 py-3 disabled:opacity-40">Previous</button>{index < QUESTION_COUNT - 1 ? <button type="button" onClick={() => move(1)} disabled={!selected || submitting} className="bg-[#D4A843] text-[#050A18] px-6 py-3 font-semibold disabled:opacity-40">Next question</button> : <button type="button" onClick={submit} disabled={submitting || answeredCount !== QUESTION_COUNT} className="bg-[#D4A843] text-[#050A18] px-6 py-3 font-semibold disabled:opacity-40">{submitting ? 'Scoring…' : 'See my results'}</button>}</div>
        <p className="text-xs text-slate-300">Keyboard: use 1–5 to answer and the left/right arrows to move between questions when a control is not focused.</p>
      </section>
    </div>
  </main>
}
