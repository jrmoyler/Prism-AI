"use client"

import { useEffect, useMemo, useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions, QUESTION_COUNT } from '../../prism/questions'
import { getSupabaseBrowserClient } from '../../lib/supabase-client'

const STORAGE_KEY = 'prism-assessment-v2'

type AssessmentState = {
  answers: Record<number, number>
  currentQuestionIndex: number
  randomizedQuestions: number[]
  completed: boolean
}

const responseLabels: Record<number, { short: string; long: string }> = {
  1: { short: 'Strongly\nDisagree', long: 'Strongly Disagree' },
  2: { short: 'Disagree', long: 'Disagree' },
  3: { short: 'Neutral', long: 'Neutral' },
  4: { short: 'Agree', long: 'Agree' },
  5: { short: 'Strongly\nAgree', long: 'Strongly Agree' },
}

function createSeededRandom(seed: number) {
  let state = seed || 1
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return Math.abs(state) / 0x7fffffff
  }
}

function shuffleQuestionIds(seed: number) {
  const arr = questions.map((q) => q.id)
  const random = createSeededRandom(seed)

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

function defaultState(): AssessmentState {
  const seed = Date.now()
  return {
    answers: {},
    currentQuestionIndex: 0,
    randomizedQuestions: shuffleQuestionIds(seed),
    completed: false,
  }
}

function sanitizeState(input: Partial<AssessmentState>): AssessmentState {
  const fallback = defaultState()
  const questionIds = new Set(questions.map((q) => q.id))

  const randomizedQuestions = Array.isArray(input.randomizedQuestions)
    ? input.randomizedQuestions.filter((id): id is number => Number.isInteger(id) && questionIds.has(id))
    : []

  const uniqueRandomizedQuestions = Array.from(new Set(randomizedQuestions))

  const answers = Object.entries(input.answers ?? {}).reduce<Record<number, number>>((acc, [rawId, rawAnswer]) => {
    const id = Number(rawId)
    const answer = Number(rawAnswer)

    if (!questionIds.has(id)) return acc
    if (!Number.isInteger(answer) || answer < 1 || answer > 5) return acc

    acc[id] = answer
    return acc
  }, {})

  return {
    answers,
    currentQuestionIndex: Math.max(
      0,
      Math.min(QUESTION_COUNT - 1, Number(input.currentQuestionIndex) || 0),
    ),
    randomizedQuestions:
      uniqueRandomizedQuestions.length === QUESTION_COUNT
        ? uniqueRandomizedQuestions
        : fallback.randomizedQuestions,
    completed: Boolean(input.completed),
  }
}

function loadState(): AssessmentState {
  if (typeof window === 'undefined') return defaultState()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()

    return sanitizeState(JSON.parse(raw) as Partial<AssessmentState>)
  } catch {
    return defaultState()
  }
}

const ResponseButton = memo(function ResponseButton({
  val,
  isSelected,
  onSelect,
}: {
  val: number
  isSelected: boolean
  onSelect: (value: number) => void
}) {
  return (
    <motion.button
      onClick={() => onSelect(val)}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium transition-all duration-200 select-none"
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.2))'
          : 'rgba(255,255,255,0.03)',
        border: isSelected
          ? '1px solid rgba(99,102,241,0.3)'
          : '1px solid rgba(255,255,255,0.07)',
        color: isSelected ? '#818cf8' : '#64748b',
        boxShadow: isSelected
          ? '0 0 0 1px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.2)'
          : 'none',
      }}
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold"
        style={{
          background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
          color: isSelected ? '#818cf8' : 'rgba(255,255,255,0.3)',
        }}
      >
        {val}
      </span>
      <span className="text-center leading-tight whitespace-pre-line hidden sm:block" style={{ fontSize: '10px' }}>
        {responseLabels[val].short}
      </span>
    </motion.button>
  )
})

const QuestionPrompt = memo(function QuestionPrompt({ text }: { text: string }) {
  return <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">{text}</p>
})

export default function AssessmentPage() {
  const [state, setState] = useState<AssessmentState>(defaultState)
  const [dir, setDir] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const loaded = loadState()
    setState(loaded.completed ? defaultState() : loaded)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }, 200)

    return () => window.clearTimeout(timer)
  }, [state, hydrated])

  const index = state.currentQuestionIndex
  const questionId = state.randomizedQuestions[index]
  const current = questions.find((question) => question.id === questionId) ?? questions[0]
  const selectedAnswer = state.answers[current.id]
  const answeredCount = Object.keys(state.answers).length

  const progress = useMemo(
    () => ((index + 1) / QUESTION_COUNT) * 100,
    [index],
  )

  const handleAnswer = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.randomizedQuestions[prev.currentQuestionIndex]]: value,
      },
    }))
  }, [])

  const goNext = useCallback(() => {
    setDir(1)
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.min(QUESTION_COUNT - 1, prev.currentQuestionIndex + 1),
    }))
  }, [])

  const goPrev = useCallback(() => {
    setDir(-1)
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
    }))
  }, [])

  const submit = async () => {
    if (answeredCount !== QUESTION_COUNT) {
      setSubmitError('Please answer all 50 questions before submitting.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const session = supabase ? (await supabase.auth.getSession()).data.session : null

      const res = await fetch('/api/prism-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ answers: state.answers, questionIds: state.randomizedQuestions }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? `Score API returned ${res.status}`)
      }

      const data = await res.json()
      localStorage.setItem('prism-results-v1', JSON.stringify(data))
      setState((prev) => ({ ...prev, completed: true }))
      window.location.href = '/results'
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        handleAnswer(Number(e.key))
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (index < QUESTION_COUNT - 1 && selectedAnswer) goNext()
      } else if (e.key === 'ArrowLeft') {
        if (index > 0) goPrev()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleAnswer, goNext, goPrev, index, selectedAnswer])

  if (!hydrated) return null

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#070a12' }}>
      <div className="fixed top-16 inset-x-0 z-40 h-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
                PRISM Assessment
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                Question <span className="text-slate-300 font-medium">{index + 1}</span> of{' '}
                <span className="text-slate-300 font-medium">{QUESTION_COUNT}</span>
              </p>
            </div>
            <span className="text-xs text-slate-500">Answered {answeredCount}/{QUESTION_COUNT}</span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: dir * 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir * -40, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div
                className="rounded-2xl p-8 md:p-10 space-y-8"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
                }}
              >
                <QuestionPrompt text={current.text} />

                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <ResponseButton
                      key={val}
                      val={val}
                      isSelected={selectedAnswer === val}
                      onSelect={handleAnswer}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <span
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: selectedAnswer ? '#818cf8' : '#64748b' }}
                  >
                    {selectedAnswer ? `Selected: ${responseLabels[selectedAnswer].long}` : 'Select your response above'}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {submitError && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.3)',
                color: '#f87171',
              }}
            >
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <motion.button
              onClick={goPrev}
              disabled={index === 0}
              whileHover={index > 0 ? { x: -2 } : {}}
              whileTap={index > 0 ? { scale: 0.97 } : {}}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: index === 0 ? '#374151' : '#94a3b8',
                cursor: index === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </motion.button>

            <div className="flex items-center">
              <span className="text-xs text-slate-600 font-mono">{Math.round(progress)}%</span>
            </div>

            {index < QUESTION_COUNT - 1 ? (
              <motion.button
                onClick={goNext}
                disabled={!selectedAnswer}
                whileHover={selectedAnswer ? { x: 2 } : {}}
                whileTap={selectedAnswer ? { scale: 0.97 } : {}}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 2px 8px rgba(99,102,241,0.2)',
                  opacity: selectedAnswer ? 1 : 0.5,
                  cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                }}
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                onClick={submit}
                disabled={submitting || answeredCount !== QUESTION_COUNT}
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all"
                style={{
                  background: submitting
                    ? 'rgba(16,185,129,0.5)'
                    : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                  boxShadow: '0 0 0 1px rgba(16,185,129,0.4), 0 2px 8px rgba(16,185,129,0.2)',
                  opacity: submitting || answeredCount !== QUESTION_COUNT ? 0.7 : 1,
                  cursor: submitting || answeredCount !== QUESTION_COUNT ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Scoring...' : 'Submit Assessment'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
