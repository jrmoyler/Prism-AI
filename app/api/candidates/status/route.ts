import { NextResponse } from 'next/server'
import { updateCandidateStatus } from '../../../../lib/supabase'
import type { CandidateStatus } from '../../../../lib/types'

const VALID_STATUSES: CandidateStatus[] = ['new', 'review', 'interview', 'hired', 'rejected']

export async function POST(req: Request) {
  const form = await req.formData()
  const candidateId = String(form.get('candidateId') ?? '')
  const status = String(form.get('status') ?? '') as CandidateStatus

  if (!candidateId || !VALID_STATUSES.includes(status)) {
    return NextResponse.redirect(new URL('/dashboard?error=invalid_status', req.url))
  }

  const success = await updateCandidateStatus(candidateId, status)
  if (!success) {
    return NextResponse.redirect(new URL('/dashboard?error=update_failed', req.url))
  }

  return NextResponse.redirect(new URL('/dashboard', req.url))
}
