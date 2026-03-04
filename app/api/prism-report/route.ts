import { NextResponse } from 'next/server'
import { createReport } from '../../../lib/supabase'
import type { PrismReport } from '../../../lib/types'

async function generateWithLLM(input: { primaryRole: string; secondaryRole: string; scores: Record<string, number> }) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      input: `Create a concise career report for a PRISM assessment. Primary role: ${input.primaryRole}, secondary role: ${input.secondaryRole}, normalized scores: ${JSON.stringify(input.scores)}`,
    }),
  })

  if (!response.ok) return null

  const data = (await response.json()) as { output_text?: string }
  return data.output_text ?? null
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    userId?: string
    primaryRole?: string
    secondaryRole?: string
    scores?: Record<string, number>
  }

  const narrative = await generateWithLLM({
    primaryRole: body.primaryRole ?? 'architect',
    secondaryRole: body.secondaryRole ?? 'integrator',
    scores: body.scores ?? {},
  })

  const report: PrismReport = {
    summary:
      narrative ??
      `You show strongest alignment with ${body.primaryRole ?? 'Architect'} and secondary momentum in ${body.secondaryRole ?? 'Integrator'}.`,
    strengths: ['Systems thinking', 'Cross-functional communication', 'Execution discipline'],
    jobRoles: ['AI Product Manager', 'Solutions Architect', 'Technical Program Lead'],
    skillRoadmap: ['Deepen SQL + analytics', 'Practice executive communication', 'Ship 2 portfolio case studies'],
    learningResources: ['DeepLearning.AI short courses', 'Reforge product strategy modules', 'System design interview prep'],
  }

  await createReport(body.userId ?? '00000000-0000-0000-0000-000000000000', report)
  return NextResponse.json(report)
}
