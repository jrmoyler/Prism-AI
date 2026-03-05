import { questions, type PrismRole } from './questions'

export type RoleScores = Record<PrismRole, number>

export const emptyScores = (): RoleScores => ({
  architect: 0,
  integrator: 0,
  designer: 0,
  educator: 0,
  consultant: 0,
})

export function scoreAssessment(answers: Record<number, number>) {
  const totals = emptyScores()
  const counts = emptyScores()

  for (const question of questions) {
    const answer = answers[question.id]
    if (!Number.isFinite(answer)) continue

    const clamped = Math.max(1, Math.min(5, Math.round(answer)))
    totals[question.role] += clamped
    counts[question.role] += 1
  }

  const normalizedScores = (Object.keys(totals) as PrismRole[]).reduce((acc, role) => {
    const maxRoleScore = counts[role] * 5
    acc[role] = maxRoleScore > 0 ? Number(((totals[role] / maxRoleScore) * 100).toFixed(2)) : 0
    return acc
  }, emptyScores())

  return normalizedScores
}
