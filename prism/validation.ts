import { questions, QUESTION_COUNT } from './questions'
import type { RoleScores } from './scoring'
export function validateAnswers(raw: unknown): Record<number, number> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const entries = Object.entries(raw)
  if (entries.length !== QUESTION_COUNT) return null
  const validIds = new Set(questions.map(q => String(q.id)))
  const answers: Record<number, number> = {}
  for (const [id, answer] of entries) {
    if (!validIds.has(id) || typeof answer !== 'number' || !Number.isInteger(answer) || answer < 1 || answer > 5) return null
    answers[Number(id)] = answer
  }
  return answers
}
export function validScores(scores: unknown): scores is RoleScores {
  const roles = ['architect', 'integrator', 'designer', 'educator', 'consultant']
  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) return false
  const entries = Object.entries(scores)
  return entries.length === roles.length && entries.every(([role, score]) => roles.includes(role) && typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 100)
}
