import { NextResponse } from 'next/server'
import { questions } from '../../../prism/questions'
import { calculateWeightedScores } from '../../../prism/scoring'
import { NextResponse } from "next/server"
import { calculateScores } from "../../../prism/scoring"

export async function POST(req: Request) {
  const body = (await req.json()) as { answers?: number[] }
  const answers = body.answers ?? []

  const result = calculateWeightedScores(answers, questions)
  return NextResponse.json(result)
}
