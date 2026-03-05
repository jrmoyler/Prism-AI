import { NextResponse } from 'next/server'
import { QUESTION_COUNT, questions } from '../../../prism/questions'
import { scoreAssessment } from '../../../prism/scoring'

function validateAnswersPayload(raw: unknown): Record<number, number> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const entries = Object.entries(raw as Record<string, unknown>)
  if (entries.length !== QUESTION_COUNT) return null

  const validQuestionIds = new Set(questions.map((question) => question.id))
  const answers: Record<number, number> = {}

  for (const [rawId, rawValue] of entries) {
    const id = Number(rawId)
    const value = Number(rawValue)
    if (!validQuestionIds.has(id)) return null
    if (!Number.isInteger(value) || value < 1 || value > 5) return null
    answers[id] = value
  }

  return Object.keys(answers).length === QUESTION_COUNT ? answers : null
}

async function getAuthenticatedUserId(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (!supabaseUrl || !supabaseAnon) return null

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnon,
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) return null
  const user = (await response.json()) as { id?: string }
  return user.id ?? null
}

async function hasExistingAssessment(userId: string): Promise<boolean> {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!projectUrl || !serviceRoleKey) return false

  const response = await fetch(
    `${projectUrl}/rest/v1/assessments?select=id&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) return false
  const data = (await response.json()) as Array<{ id: string }>
  return data.length > 0
}

async function persistAssessment(input: {
  userId: string
  answers: Record<number, number>
  normalizedScores: ReturnType<typeof scoreAssessment>
}) {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!projectUrl || !serviceRoleKey) return

  const answersArray = questions.map((question) => input.answers[question.id])

  const assessmentResponse = await fetch(`${projectUrl}/rest/v1/assessments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify([{ user_id: input.userId, answers: answersArray }]),
  })

  if (!assessmentResponse.ok) throw new Error('Failed to persist assessment')

  const inserted = (await assessmentResponse.json()) as Array<{ id: string }>
  const assessmentId = inserted[0]?.id
  if (!assessmentId) throw new Error('Missing assessment id after insert')

  const ordered = Object.entries(input.normalizedScores).sort((a, b) => b[1] - a[1])

  const scoreResponse = await fetch(`${projectUrl}/rest/v1/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify([
      {
        assessment_id: assessmentId,
        architect: input.normalizedScores.architect,
        integrator: input.normalizedScores.integrator,
        designer: input.normalizedScores.designer,
        educator: input.normalizedScores.educator,
        consultant: input.normalizedScores.consultant,
        primary_role: ordered[0]?.[0],
        secondary_role: ordered[1]?.[0],
      },
    ]),
  })

  if (!scoreResponse.ok) throw new Error('Failed to persist score')
}

export async function POST(req: Request) {
  let body: { answers?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const answers = validateAnswersPayload(body.answers)
  if (!answers) {
    return NextResponse.json({ error: `answers must include exactly ${QUESTION_COUNT} responses with values 1-5` }, { status: 400 })
  }

  const normalizedScores = scoreAssessment(answers)
  const ordered = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1])

  const userId = await getAuthenticatedUserId(req)
  let saved = false

  if (userId) {
    if (await hasExistingAssessment(userId)) {
      return NextResponse.json({ error: 'Assessment already submitted for this user' }, { status: 409 })
    }

    try {
      await persistAssessment({ userId, answers, normalizedScores })
      saved = true
    } catch (error) {
      console.error('[prism-score] persistence failed', error)
    }
  }

  return NextResponse.json({
    normalizedScores,
    primaryRole: ordered[0]?.[0] ?? 'architect',
    secondaryRole: ordered[1]?.[0] ?? 'integrator',
    saved,
  })
}
