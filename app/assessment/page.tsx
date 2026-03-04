"use client"

import { useEffect, useMemo, useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions, QUESTION_COUNT } from '../../prism/questions'

// ── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'prism-assessment-v1'

type AssessmentState = {
  currentQuestion: number
  answers: number[]
  completed: boolean
}

function defaultState(): AssessmentState {
  return {
    currentQuestion: 0,
    answers: Array<number>(QUESTION_COUNT).fill(3),
    completed: false,
  }
}

function loadState(): AssessmentState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<AssessmentState>

    const answers = Array.isArray(parsed.answers) ? parsed.answers : []

    // Guard against wrong-length arrays (e.g. from an old question set)
    if (answers.length !== QUESTION_COUNT) return defaultState()

    // Clamp each answer to the valid [1,5] range
    const safeAnswers = answers.map(v => {
      const n = Number(v)
      return Number.isFinite(n) ? Math.max(1, Math.min(5, Math.round(n))) : 3
    })

    return {
      currentQuestion: Math.max(
        0,
        Math.min(QUESTION_COUNT - 1, Number(parsed.currentQuestion) || 0),
      ),
      answers: safeAnswers,
      completed: Boolean(parsed.completed),
    }
  } catch {
    return defaultState()
  }
}

function saveState(state: AssessmentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage quota exceeded or private browsing — continue without persistence
  }
}

// ── Style maps ────────────────────────────────────────────────────────────────

const roleColors: Record<string, string> = {
  architect:  'rgba(99,102,241,0.15)',
  integrator: 'rgba(139,92,246,0.15)',
  designer:   'rgba(244,114,182,0.15)',
  educator:   'rgba(52,211,153,0.15)',
  consultant: 'rgba(251,191,36,0.15)',
}
const roleTextColors: Record<string, string> = {
  architect:  '#818cf8',
  integrator: '#a78bfa',
  designer:   '#f472b6',
  educator:   '#34d399',
  consultant: '#fbbf24',
}
const roleBorderColors: Record<string, string> = {
  architect:  'rgba(99,102,241,0.3)',
  integrator: 'rgba(139,92,246,0.3)',
  designer:   'rgba(244,114,182,0.3)',
  educator:   'rgba(52,211,153,0.3)',
  consultant: 'rgba(251,191,36,0.3)',
}
const roleLabels: Record<string, string> = {
  architect:  'Architect',
  integrator: 'Integrator',
  designer:   'Designer',
  educator:   'Educator',
  consultant: 'Consultant',
}

const responseLabels: Record<number, { short: string; long: string }> = {
  1: { short: 'Strongly\nDisagree', long: 'Strongly Disagree' },
  2: { short: 'Disagree',           long: 'Disagree' },
  3: { short: 'Neutral',            long: 'Neutral' },
  4: { short: 'Agree',              long: 'Agree' },
  5: { short: 'Strongly\nAgree',    long: 'Strongly Agree' },
}

// ── Memoized response button ──────────────────────────────────────────────────

const ResponseButton = memo(function ResponseButton({
  val,
  isSelected,
  roleColor,
  roleText,
  roleBorder,
  onSelect,
}: {
  val: number
  isSelected: boolean
  roleColor: string
  roleText: string
  roleBorder: string
  onSelect: (v: number) => void
}) {
  return (
    <motion.button
      onClick={() => onSelect(val)}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium transition-all duration-200 select-none"
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${roleColor.replace('0.15)', '0.3)')}, ${roleColor.replace('0.15)', '0.2)')})`
          : 'rgba(255,255,255,0.03)',
        border: isSelected
          ? `1px solid ${roleBorder}`
          : '1px solid rgba(255,255,255,0.07)',
        color: isSelected ? roleText : '#64748b',
        boxShadow: isSelected
          ? `0 0 0 1px ${roleBorder}, 0 4px 12px rgba(0,0,0,0.2)`
          : 'none',
      }}
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold"
        style={{
          background: isSelected ? roleColor : 'rgba(255,255,255,0.05)',
          color: isSelected ? roleText : 'rgba(255,255,255,0.3)',
        }}
      >
        {val}
      </span>
      <span
        className="text-center leading-tight whitespace-pre-line hidden sm:block"
        style={{ fontSize: '10px' }}
      >
        {responseLabels[val].short}
      </span>
    </motion.button>
  )
})

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AssessmentPage() {
  const [state,       setState]      = useState<AssessmentState>(defaultState)
  const [dir,         setDir]        = useState(1)
  const [submitting,  setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [hydrated,    setHydrated]   = useState(false)

  // Load persisted state after hydration (avoids SSR mismatch)
  useEffect(() => {
    const loaded = loadState()
    // If the previous session was already completed, wipe it so the user retakes
    if (loaded.completed) {
      const fresh = defaultState()
      setState(fresh)
      saveState(fresh)
    } else {
      setState(loaded)
    }
    setHydrated(true)
  }, [])

  // Persist every state change
  useEffect(() => {
    if (hydrated) saveState(state)
  }, [state, hydrated])

  const { currentQuestion: index, answers } = state
  const current = questions[index]

  const progress = useMemo(
    () => ((index + 1) / QUESTION_COUNT) * 100,
    [index],
  )

  const handleAnswer = useCallback((value: number) => {
    setState(prev => {
      const next = [...prev.answers]
      next[prev.currentQuestion] = value
      return { ...prev, answers: next }
    })
  }, [])

  const goNext = useCallback(() => {
    setDir(1)
    setState(prev => ({
      ...prev,
      currentQuestion: Math.min(QUESTION_COUNT - 1, prev.currentQuestion + 1),
    }))
  }, [])

  const goPrev = useCallback(() => {
    setDir(-1)
    setState(prev => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }))
  }, [])

  const submit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(
          (err as { error?: string }).error ?? `Score API returned ${res.status}`,
        )
      }

      const data = await res.json()
      localStorage.setItem('prism-results-v1', JSON.stringify(data))

      // Mark as completed before redirecting
      setState(prev => ({ ...prev, completed: true }))

      window.location.href = '/results'
    } catch (err) {
      console.error('[assessment] submit error:', err)
      setSubmitError(
        err instanceof Error ? err.message : 'Submission failed. Please try again.',
      )
      setSubmitting(false)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        handleAnswer(Number(e.key))
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (index < QUESTION_COUNT - 1) goNext()
      } else if (e.key === 'ArrowLeft') {
        if (index > 0) goPrev()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleAnswer, goNext, goPrev, index])

  const roleColor  = roleColors[current.role]      ?? 'rgba(99,102,241,0.15)'
  const roleText   = roleTextColors[current.role]   ?? '#818cf8'
  const roleBorder = roleBorderColors[current.role] ?? 'rgba(99,102,241,0.3)'
  const selectedAnswer = answers[index]

  // Suppress SSR / hydration flash
  if (!hydrated) return null

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#070a12' }}>

      {/* Progress bar */}
      <div className="fixed top-16 inset-x-0 z-40 h-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
                PRISM Assessment
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                Question <span className="text-slate-300 font-medium">{index + 1}</span>
                {' '}of{' '}
                <span className="text-slate-300 font-medium">{QUESTION_COUNT}</span>
              </p>
            </div>

            {/* Role badge */}
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: roleColor,
                border: `1px solid ${roleBorder}`,
                color: roleText,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: roleText }} />
              {roleLabels[current.role] ?? current.role}
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: dir * 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0,         scale: 1 }}
              exit={{   opacity: 0, x: dir * -40,  scale: 0.98 }}
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
                {/* Question text */}
                <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                  {current.text}
                </p>

                {/* Response buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <ResponseButton
                      key={val}
                      val={val}
                      isSelected={selectedAnswer === val}
                      roleColor={roleColor}
                      roleText={roleText}
                      roleBorder={roleBorder}
                      onSelect={handleAnswer}
                    />
                  ))}
                </div>

                {/* Response label */}
                <div className="text-center">
                  <span
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: selectedAnswer ? roleText : '#64748b' }}
                  >
                    {selectedAnswer
                      ? `Selected: ${responseLabels[selectedAnswer].long}`
                      : 'Select your response above'
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Submit error banner */}
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

          {/* Navigation */}
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
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Previous
            </motion.button>

            {/* Progress % indicator */}
            <div className="flex items-center">
              <span className="text-xs text-slate-600 font-mono">
                {Math.round(progress)}%
              </span>
            </div>

            {index < QUESTION_COUNT - 1 ? (
              <motion.button
                onClick={goNext}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 2px 8px rgba(99,102,241,0.2)',
                }}
              >
                Next
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                onClick={submit}
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.02, y: -1 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all"
                style={{
                  background: submitting
                    ? 'rgba(16,185,129,0.5)'
                    : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                  boxShadow: submitting
                    ? 'none'
                    : '0 0 0 1px rgba(16,185,129,0.4), 0 2px 8px rgba(16,185,129,0.2)',
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeDasharray="30 10" />
                    </svg>
                    Scoring...
                  </>
                ) : (
                  <>
                    Submit Assessment
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-xs text-slate-700">
            Press{' '}
            <kbd className="rounded px-1 py-0.5 text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>1</kbd>–
            <kbd className="rounded px-1 py-0.5 text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>5</kbd> to answer &nbsp;·&nbsp;
            <kbd className="rounded px-1 py-0.5 text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>←</kbd>&nbsp;
            <kbd className="rounded px-1 py-0.5 text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>→</kbd> to navigate
          </p>
        </div>
      </div>
    </main>
  )
}
