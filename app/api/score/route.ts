import { NextResponse } from 'next/server'
import { questions, QUESTION_COUNT, VALID_QUESTION_IDS } from '../../../prism/questions'
import { calculateWeightedScores } from '../../../prism/scoring'

// ── POST /api/score ───────────────────────────────────────────────────────────
//
// Body: { answers: number[], questionIds?: number[] }
//   answers     — exactly QUESTION_COUNT integers coerced to [1, 5]
//   questionIds — optional; if present, validated against the known question set
//
// Returns: { rawScores, normalizedScores, primaryRole, secondaryRole }

export async function POST(req: Request) {
  let body: { answers?: unknown; questionIds?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ── Validate answers array ────────────────────────────────────────────────

  if (!Array.isArray(body.answers)) {
    return NextResponse.json(
      { error: 'answers must be an array' },
      { status: 400 },
    )
  }

  if (body.answers.length !== QUESTION_COUNT) {
    return NextResponse.json(
      {
        error: `answers must contain exactly ${QUESTION_COUNT} items, received ${body.answers.length}`,
      },
      { status: 400 },
    )
  }

  // Coerce and clamp each value to [1, 5]; default to 3 (neutral) if invalid
  const answers = (body.answers as unknown[]).map((v) => {
    const n = Number(v)
    return Number.isFinite(n) ? Math.max(1, Math.min(5, Math.round(n))) : 3
  })

  // ── Optional: validate submitted question IDs ─────────────────────────────

  if (Array.isArray(body.questionIds)) {
    const ids = body.questionIds as unknown[]
    if (ids.length !== QUESTION_COUNT) {
      return NextResponse.json(
        { error: 'questionIds length must match answers length' },
        { status: 400 },
      )
    }
    for (const id of ids) {
      if (!VALID_QUESTION_IDS.has(Number(id))) {
        return NextResponse.json(
          { error: `Unknown question id: ${id}` },
          { status: 400 },
        )
      }
    }
  }

  const result = calculateWeightedScores(answers, questions)
  return NextResponse.json(result, { status: 200 })
}
