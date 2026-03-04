import { NextResponse } from 'next/server'
import { questions } from '../../../prism/questions'
import { calculateWeightedScores } from '../../../prism/scoring'

export async function POST(req: Request) {
  const body = (await req.json()) as { answers?: unknown }

  if (!Array.isArray(body.answers)) {
    return NextResponse.json({ error: 'answers must be an array' }, { status: 400 })
  }

  const answers = (body.answers as unknown[]).map((v) => {
    const n = Number(v)
    return Number.isFinite(n) ? Math.max(1, Math.min(5, n)) : 3
  })

  const result = calculateWeightedScores(answers, questions)
  return NextResponse.json(result)
}
