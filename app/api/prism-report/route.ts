import { NextResponse } from 'next/server'
import { createReport } from '../../../lib/supabase'
import type { PrismReport } from '../../../lib/types'
import type { PrismRole } from '../../../prism/questions'

const VALID_ROLES: PrismRole[] = ['architect', 'integrator', 'designer', 'educator', 'consultant']
const VALID_ROLES_SET = new Set<string>(VALID_ROLES)

function isValidRole(role: unknown): role is PrismRole {
  return typeof role === 'string' && VALID_ROLES_SET.has(role)
}

function isValidScores(scores: unknown): scores is Record<string, number> {
  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) return false
  return Object.values(scores as Record<string, unknown>).every(
    (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100,
  )
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

async function generateWithLLM(input: {
  primaryRole: PrismRole
  secondaryRole: PrismRole
  scores: Record<string, number>
}): Promise<Partial<PrismReport> | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  const prompt = [
    'You are a career strategy assistant.',
    'Return strict JSON with keys: summary, strengths, jobRoles, skillRoadmap, learningResources.',
    'Each list should contain exactly 3 items.',
    `Primary role: ${input.primaryRole}. Secondary role: ${input.secondaryRole}.`,
    `Scores: ${JSON.stringify(input.scores)}.`,
  ].join(' ')

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 650,
      }),
    })

    if (!response.ok) return null

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    const parsed = JSON.parse(content) as Partial<PrismReport>
    return parsed
  } catch (error) {
    console.error('[prism-report] generation failed', error)
    return null
  }
}

export async function POST(req: Request) {
  let body: { primaryRole?: unknown; secondaryRole?: unknown; scores?: unknown }

  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isValidRole(body.primaryRole) || !isValidRole(body.secondaryRole)) {
    return NextResponse.json({ error: 'Invalid role payload' }, { status: 400 })
  }

  if (!isValidScores(body.scores)) {
    return NextResponse.json({ error: 'scores must contain numeric values between 0 and 100' }, { status: 400 })
  }

  const aiReport = await generateWithLLM({
    primaryRole: body.primaryRole,
    secondaryRole: body.secondaryRole,
    scores: body.scores,
  })

  const report: PrismReport = {
    summary:
      aiReport?.summary ??
      `Your strongest alignment is ${body.primaryRole}, with meaningful overlap in ${body.secondaryRole}. Build depth in your primary role while developing cross-functional strengths for long-term career leverage.`,
    strengths: aiReport?.strengths?.slice(0, 3) ?? [
      'Structured problem solving and strategic thinking',
      'Cross-functional collaboration and communication',
      'Execution discipline with measurable outcomes',
    ],
    jobRoles: aiReport?.jobRoles?.slice(0, 3) ?? [
      'AI Product Manager',
      'Solutions Architect',
      'Technical Program Manager',
    ],
    skillRoadmap: aiReport?.skillRoadmap?.slice(0, 3) ?? [
      'Year 1: Strengthen AI and analytics fundamentals',
      'Year 2: Ship high-impact cross-functional initiatives',
      'Year 3: Lead strategy and mentor emerging talent',
    ],
    learningResources: aiReport?.learningResources?.slice(0, 3) ?? [
      'DeepLearning.AI practical AI courses',
      'Reforge strategy and product programs',
      'Hands-on portfolio projects with measurable outcomes',
    ],
  }

  const userId = await getAuthenticatedUserId(req)
  if (userId) {
    try {
      await createReport(userId, report)
    } catch (error) {
      console.error('[prism-report] persistence failed', error)
    }
  }

  return NextResponse.json(report)
}
