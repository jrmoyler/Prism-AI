import type { PrismQuestion, PrismRole } from './questions'

export type RoleScores = Record<PrismRole, number>

export const emptyScores = (): RoleScores => ({
  architect: 0,
  integrator: 0,
  designer: 0,
  educator: 0,
  consultant: 0,
})

export function calculateWeightedScores(answers: number[], questions: PrismQuestion[]) {
  const rawScores = emptyScores()

  questions.forEach((question, index) => {
    const answer = Math.max(1, Math.min(5, answers[index] ?? 3))
    rawScores[question.role] += answer * question.weight
  })

  const maxScore = Math.max(...Object.values(rawScores), 1)
  const normalizedScores = Object.entries(rawScores).reduce((acc, [role, score]) => {
    acc[role as PrismRole] = Number(((score / maxScore) * 100).toFixed(2))
    return acc
  }, emptyScores())

  const sorted = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1]) as [PrismRole, number][]

  return {
    rawScores,
    normalizedScores,
    primaryRole: sorted[0]?.[0] ?? 'architect',
    secondaryRole: sorted[1]?.[0] ?? 'integrator',
  }
}
