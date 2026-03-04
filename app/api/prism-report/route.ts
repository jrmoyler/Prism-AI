import { NextResponse } from 'next/server'
import { createReport } from '../../../lib/supabase'
import type { PrismReport } from '../../../lib/types'
import type { PrismRole } from '../../../prism/questions'

const VALID_ROLES: PrismRole[] = [
  'architect',
  'integrator',
  'designer',
  'educator',
  'consultant',
]

const VALID_ROLES_SET = new Set<string>(VALID_ROLES)

function isValidRole(role: unknown): role is PrismRole {
  return typeof role === 'string' && VALID_ROLES_SET.has(role)
}

function isValidScores(scores: unknown): scores is Record<string, number> {
  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) return false
  return Object.values(scores as Record<string, unknown>).every(
    v => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100,
  )
}

// ── LLM report generation ─────────────────────────────────────────────────────

async function generateWithLLM(input: {
  primaryRole: PrismRole
  secondaryRole: PrismRole
  scores: Record<string, number>
}): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content:
              `Generate a 2-3 sentence career narrative for a PRISM assessment result. ` +
              `Primary role: ${input.primaryRole}. Secondary role: ${input.secondaryRole}. ` +
              `Normalized scores: ${JSON.stringify(input.scores)}. ` +
              `Return only the narrative text, no JSON.`,
          },
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('[prism-report] OpenAI error:', response.status)
      return null
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    return data.choices?.[0]?.message?.content?.trim() ?? null
  } catch (err) {
    console.error('[prism-report] LLM generation failed:', err)
    return null
  }
}

// ── POST /api/prism-report ────────────────────────────────────────────────────
//
// Body: { primaryRole, secondaryRole, scores, userId? }
//   primaryRole   — required, must be a valid PrismRole
//   secondaryRole — required, must be a valid PrismRole
//   scores        — required, Record<string, number> with values 0-100
//   userId        — optional; report stored in Supabase if provided

export async function POST(req: Request) {
  let body: {
    userId?: unknown
    primaryRole?: unknown
    secondaryRole?: unknown
    scores?: unknown
  }

  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ── Validate required fields ──────────────────────────────────────────────

  if (!isValidRole(body.primaryRole)) {
    return NextResponse.json(
      { error: `primaryRole must be one of: ${[...VALID_ROLES].join(', ')}` },
      { status: 400 },
    )
  }

  if (!isValidRole(body.secondaryRole)) {
    return NextResponse.json(
      { error: `secondaryRole must be one of: ${[...VALID_ROLES].join(', ')}` },
      { status: 400 },
    )
  }

  if (!isValidScores(body.scores)) {
    return NextResponse.json(
      { error: 'scores must be an object with numeric values between 0 and 100' },
      { status: 400 },
    )
  }

  const primaryRole   = body.primaryRole
  const secondaryRole = body.secondaryRole
  const scores        = body.scores as Record<string, number>

  // ── Generate narrative ────────────────────────────────────────────────────

  const narrative = await generateWithLLM({ primaryRole, secondaryRole, scores })

  const report: PrismReport = {
    summary:
      narrative ??
      `You show strongest alignment with ${primaryRole} and secondary momentum in ${secondaryRole}. ` +
      `Focus on deepening your core role capabilities while leveraging cross-functional strengths.`,
    strengths: [
      'Systems thinking and structured problem solving',
      'Cross-functional communication and collaboration',
      'Execution discipline and initiative',
    ],
    jobRoles: [
      'AI Product Manager',
      'Solutions Architect',
      'Technical Program Lead',
    ],
    skillRoadmap: [
      'Deepen SQL and data analytics fundamentals',
      'Practice executive-level communication and storytelling',
      'Ship two portfolio case studies in your primary role',
    ],
    learningResources: [
      'DeepLearning.AI short courses for AI fundamentals',
      'Reforge product strategy growth modules',
      'System design interview preparation resources',
    ],
  }

  // ── Persist report (non-fatal if it fails) ────────────────────────────────

  const userId =
    typeof body.userId === 'string' && body.userId.trim().length > 0
      ? body.userId.trim()
      : null

  if (userId) {
    try {
      await createReport(userId, report)
    } catch (err) {
      console.error('[prism-report] Failed to persist report:', err)
    }
  }

  return NextResponse.json(report, { status: 200 })
}
