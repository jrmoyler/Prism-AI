import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = (await req.json()) as { name?: string; background?: string }
  const name = String(body.name ?? '').trim().slice(0, 200) || 'Candidate'
  const background = String(body.background ?? '').trim().slice(0, 2000) || 'generalist profile'

  const summary = `${name} demonstrates strong potential based on a ${background} background. Focus on business impact, communication, and iterative delivery to accelerate progression.`

  return NextResponse.json({
    summary,
    strengths: ['Problem decomposition', 'Cross-functional collaboration', 'Data-informed decisions'],
    growthAreas: ['Executive storytelling', 'Domain specialization', 'Hiring-panel readiness'],
    recommendedRoles: ['AI Product Manager', 'Solutions Consultant', 'Analytics Lead'],
  })
}
