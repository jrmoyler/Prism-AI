import { NextResponse } from 'next/server'
import { updateCandidateStatus } from '../../../../lib/supabase'
import { isHiringAdmin } from '../../../../lib/server-auth'
import { sameOrigin, rateLimit } from '../../../../lib/api-guard'
import type { CandidateStatus } from '../../../../lib/types'

const statuses: CandidateStatus[] = ['new', 'review', 'interview', 'hired', 'rejected']
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  if (!await isHiringAdmin(req)) return NextResponse.json({ error: 'Administrator access required' }, { status: 403 })
  const limited = rateLimit(req, 'candidate-status')
  if (limited) return limited
  let form: FormData
  try { form = await req.formData() } catch { return NextResponse.json({ error: 'Invalid form' }, { status: 400 }) }
  const candidateId = String(form.get('candidateId') ?? '')
  const status = String(form.get('status') ?? '') as CandidateStatus
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(candidateId) || !statuses.includes(status)) {
    return NextResponse.redirect(new URL('/dashboard?error=invalid_status', req.url), 303)
  }
  const success = await updateCandidateStatus(candidateId, status, req)
  return NextResponse.redirect(new URL(success ? '/dashboard?updated=1' : '/dashboard?error=update_failed', req.url), 303)
}
