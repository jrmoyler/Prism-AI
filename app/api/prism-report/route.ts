import { NextResponse } from 'next/server'
import { validScores } from '../../../prism/validation'
import { verifiedUser } from '../../../lib/server-auth'
import { rateLimit } from '../../../lib/api-guard'
import { createReport } from '../../../lib/supabase'
import type { PrismReport } from '../../../lib/types'
import type { PrismRole } from '../../../prism/questions'

const VALID_ROLES: PrismRole[] = ['architect', 'integrator', 'designer', 'educator', 'consultant']
const VALID_ROLES_SET = new Set<string>(VALID_ROLES)

function isValidRole(role: unknown): role is PrismRole {
  return typeof role === 'string' && VALID_ROLES_SET.has(role)
}

function safeList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback
  const normalized = value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim().slice(0, 500))
    .slice(0, 3)

  return normalized.length > 0 ? normalized : fallback
}

function safeSummary(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim().slice(0, 2000) : fallback
}

async function generateWithLLM(input: {
  primaryRole: PrismRole
  secondaryRole: PrismRole
  scores: Record<string, number>
}): Promise<Partial<PrismReport> | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  const prompt = [
    'You are a career exploration assistant. These are self-reported interests, not validated skills or hiring predictions. Avoid claims about aptitude or guaranteed outcomes.',
    'Return strict JSON with keys: summary, strengths, jobRoles, skillRoadmap, learningResources.',
    'Each list should contain exactly 3 items.',
    `Primary role: ${input.primaryRole}. Secondary role: ${input.secondaryRole}.`,
    `Scores: ${JSON.stringify(input.scores)}.`,
  ].join(' ')

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
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

    const parsed: unknown = JSON.parse(content)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const candidate = parsed as Partial<PrismReport>
    if (typeof candidate.summary !== 'string' || !candidate.summary.trim()) return null
    return candidate
  } catch (error) {
    console.error('[prism-report] generation failed', error)
    return null
  }
}

export async function POST(req: Request) {
  const limited = rateLimit(req, 'report', 5)
  if (limited) return limited
  let body: { primaryRole?: unknown; secondaryRole?: unknown; scores?: unknown }

  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body || !isValidRole(body.primaryRole) || !isValidRole(body.secondaryRole)) {
    return NextResponse.json({ error: 'Invalid role payload' }, { status: 400 })
  }

  if (!validScores(body.scores)) {
    return NextResponse.json({ error: 'scores must contain all five PRISM roles with numeric values between 0 and 100' }, { status: 400 })
  }

  const user = await verifiedUser(req)
  const ranking = Object.entries(body.scores).sort((a, b) => b[1] - a[1])
  const primaryRole = ranking[0][0] as PrismRole
  const secondaryRole = ranking[1][0] as PrismRole
  const aiReport = user ? await generateWithLLM({
    primaryRole,
    secondaryRole,
    scores: body.scores,
  }) : null

  const guidance: Record<PrismRole, { strengths: string[]; roles: string[]; project: string }> = {
    architect: { strengths: ['Interest in system boundaries', 'Attention to technical trade-offs', 'Preference for infrastructure work'], roles: ['Solutions architect', 'Platform engineer', 'AI systems engineer'], project: 'Design a small AI service and document its data flow, failure modes, and cost limits.' },
    integrator: { strengths: ['Interest in connected workflows', 'Attention to handoffs', 'Preference for automation'], roles: ['Integration engineer', 'Automation specialist', 'AI implementation consultant'], project: 'Connect two tools with a documented, retry-safe workflow and measure the time it saves.' },
    designer: { strengths: ['Interest in user experience', 'Attention to usability', 'Preference for prototyping'], roles: ['Product designer', 'Conversation designer', 'UX researcher'], project: 'Prototype an AI-assisted workflow and observe three people completing a task with it.' },
    educator: { strengths: ['Interest in teaching', 'Attention to clear explanations', 'Preference for mentoring'], roles: ['Technical educator', 'Developer advocate', 'Learning experience designer'], project: 'Teach one AI concept in a short workshop, then revise it using learner feedback.' },
    consultant: { strengths: ['Interest in business context', 'Attention to stakeholder needs', 'Preference for advisory work'], roles: ['AI adoption consultant', 'Business analyst', 'AI product strategist'], project: 'Write an AI adoption brief for a real workflow with costs, risks, and a small pilot plan.' },
  }
  const selected = guidance[primaryRole]
  const fallbackSummary = `Your responses show the strongest interest in ${primaryRole} work, followed by ${secondaryRole}. Use this as a starting point for exploration. These scores describe self-reported preferences, not demonstrated skill or a hiring recommendation.`
  const fallbackStrengths = selected.strengths
  const fallbackJobRoles = selected.roles
  const fallbackRoadmap = [selected.project, 'Ask a practitioner to review your work against real role expectations.', 'Use that feedback to choose one skill to practice next.']
  const fallbackResources = ['Official documentation for the tools used in your project', 'Public case studies from practitioners in your chosen role', 'A portfolio review with a mentor or peer']

  const report: PrismReport = {
    summary: safeSummary(aiReport?.summary, fallbackSummary),
    strengths: safeList(aiReport?.strengths, fallbackStrengths),
    jobRoles: safeList(aiReport?.jobRoles, fallbackJobRoles),
    skillRoadmap: safeList(aiReport?.skillRoadmap, fallbackRoadmap),
    learningResources: safeList(aiReport?.learningResources, fallbackResources),
  }

  let saved = false

  if (user) {
    try {
      saved = await createReport(user.id, report, req)
    } catch (error) {
      console.error('[prism-report] persistence failed', error)
    }
  }

  return NextResponse.json({ ...report, saved, source: aiReport ? 'ai' : 'guided' })
}
