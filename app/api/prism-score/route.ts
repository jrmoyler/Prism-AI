import { NextResponse } from 'next/server'
import { questions, QUESTION_COUNT } from '../../../prism/questions'
import { scoreAssessment } from '../../../prism/scoring'
import { validateAnswers } from '../../../prism/validation'
import { getServerSupabase, verifiedUser } from '../../../lib/server-auth'
import { rateLimit } from '../../../lib/api-guard'

export async function POST(req: Request) {
  const limited = rateLimit(req, 'score')
  if (limited) return limited
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }
  const answers = validateAnswers(body && typeof body === 'object' ? (body as { answers?: unknown }).answers : undefined)
  if (!answers) return NextResponse.json({ error: `answers must include exactly ${QUESTION_COUNT} numeric responses with values 1–5` }, { status: 400 })
  const normalizedScores = scoreAssessment(answers)
  const ordered = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1])
  const user = await verifiedUser(req)
  let saved = false
  let saveError: string | undefined
  if (user) {
    const client = await getServerSupabase(req)
    try {
      const { error } = await client!.rpc('save_prism_assessment', { responses: questions.map(q => answers[q.id]) })
      saved = !error
    } catch { saved = false }
    if (!saved) saveError = 'Your results are available on this device, but could not be saved to your account.'
  }
  return NextResponse.json({ normalizedScores, primaryRole: ordered[0][0], secondaryRole: ordered[1][0], saved, saveError })
}
