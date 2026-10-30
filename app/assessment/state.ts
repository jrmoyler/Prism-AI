import { questions, QUESTION_COUNT } from '../../prism/questions'

export const STORAGE_KEY = 'prism-assessment-v2'

export type AssessmentState = {
  answers: Record<number, number>
  currentQuestionIndex: number
  randomizedQuestions: number[]
  completed: boolean
}

function createSeededRandom(seed: number) {
  let state = seed || 1
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 0x100000000
  }
}

export function shuffleQuestionIds(seed: number) {
  const arr = questions.map((q) => q.id)
  const random = createSeededRandom(seed)

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

export function defaultState(): AssessmentState {
  const seed = Date.now()
  return {
    answers: {},
    currentQuestionIndex: 0,
    randomizedQuestions: shuffleQuestionIds(seed),
    completed: false,
  }
}

export function sanitizeState(raw: unknown): AssessmentState {
  const fallback = defaultState()
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fallback
  const input = raw as Partial<AssessmentState>
  const questionIds = new Set(questions.map((q) => q.id))

  const randomizedQuestions = Array.isArray(input.randomizedQuestions)
    ? input.randomizedQuestions.filter((id): id is number => Number.isInteger(id) && questionIds.has(id))
    : []

  const uniqueRandomizedQuestions = Array.from(new Set(randomizedQuestions))

  const answers = Object.entries(input.answers ?? {}).reduce<Record<number, number>>((acc, [rawId, rawAnswer]) => {
    const id = Number(rawId)
    const answer = rawAnswer

    if (!questionIds.has(id) || String(id) !== rawId) return acc
    if (typeof answer !== 'number' || !Number.isInteger(answer) || answer < 1 || answer > 5) return acc

    acc[id] = answer
    return acc
  }, {})

  return {
    answers,
    currentQuestionIndex: Math.max(
      0,
      Math.min(QUESTION_COUNT - 1, Math.floor(Number(input.currentQuestionIndex)) || 0),
    ),
    randomizedQuestions:
      uniqueRandomizedQuestions.length === QUESTION_COUNT
        ? uniqueRandomizedQuestions
        : fallback.randomizedQuestions,
    completed: input.completed === true,
  }
}

