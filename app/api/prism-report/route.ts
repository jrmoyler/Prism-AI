import { NextResponse } from 'next/server'
import { createReport } from '../../../lib/supabase'
import type { PrismReport } from '../../../lib/types'
import type { PrismRole } from '../../../prism/questions'

const VALID_ROLES: PrismRole[] = ['architect', 'integrator', 'designer', 'educator', 'consultant']

function isValidRole(role: unknown): role is PrismRole {
  return typeof role === 'string' && (VALID_ROLES as string[]).includes(role)
}

async function generateWithLLM(input: { primaryRole: PrismRole; secondaryRole: PrismRole; scores: Record<string, number> }) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

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
          content: `Create a concise career report for a PRISM assessment. Primary role: ${input.primaryRole}, secondary role: ${input.secondaryRole}, normalized scores: ${JSON.stringify(input.scores)}. Return only a 2-3 sentence narrative.`,
        },
      ],
      max_tokens: 200,
    }),
  })

  if (!response.ok) return null

  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  return data.choices?.[0]?.message?.content ?? null
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    userId?: unknown
    primaryRole?: unknown
    secondaryRole?: unknown
    scores?: unknown
  }

  const primaryRole = isValidRole(body.primaryRole) ? body.primaryRole : 'architect'
  const secondaryRole = isValidRole(body.secondaryRole) ? body.secondaryRole : 'integrator'
  const scores =
    body.scores && typeof body.scores === 'object' && !Array.isArray(body.scores)
      ? (body.scores as Record<string, number>)
      : {}

  const narrative = await generateWithLLM({ primaryRole, secondaryRole, scores })

  const report: PrismReport = {
    summary:
      narrative ??
      `You show strongest alignment with ${primaryRole} and secondary momentum in ${secondaryRole}. Focus on deepening your core role capabilities while leveraging cross-functional strengths.`,
    strengths: ['Systems thinking', 'Cross-functional communication', 'Execution discipline'],
    jobRoles: ['AI Product Manager', 'Solutions Architect', 'Technical Program Lead'],
    skillRoadmap: ['Deepen SQL + analytics', 'Practice executive communication', 'Ship 2 portfolio case studies'],
    learningResources: ['DeepLearning.AI short courses', 'Reforge product strategy modules', 'System design interview prep'],
  }

  const userId = typeof body.userId === 'string' ? body.userId : '00000000-0000-0000-0000-000000000000'
  await createReport(userId, report)
  return NextResponse.json(report)
}
