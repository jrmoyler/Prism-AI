export { POST } from '../prism-report/route'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = (await req.json()) as { name?: string; background?: string }
  const name = body.name?.trim() || 'Candidate'
  const background = body.background?.trim() || 'generalist profile'

  const summary = `${name} demonstrates strong potential based on a ${background} background. Focus on business impact, communication, and iterative delivery to accelerate progression.`

  return NextResponse.json({
    summary,
    strengths: ['Problem decomposition', 'Cross-functional collaboration', 'Data-informed decisions'],
    growthAreas: ['Executive storytelling', 'Domain specialization', 'Hiring-panel readiness'],
    recommendedRoles: ['AI Product Manager', 'Solutions Consultant', 'Analytics Lead'],
  })
}
