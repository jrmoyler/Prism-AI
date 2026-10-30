import type { Candidate, CandidateStatus, PrismReport } from './types'
import { getServerSupabase, isHiringAdmin, verifiedUser } from './server-auth'

export const mockCandidates: Candidate[] = [
  { id: 'demo-1', full_name: 'Alex Morgan', email: 'alex@example.com', desired_role: 'architect', status: 'review', score: 88, created_at: '2026-01-12T00:00:00Z' },
  { id: 'demo-2', full_name: 'Jordan Lee', email: 'jordan@example.com', desired_role: 'integrator', status: 'interview', score: 75, created_at: '2026-01-14T00:00:00Z' },
  { id: 'demo-3', full_name: 'Casey Rivera', email: 'casey@example.com', desired_role: 'designer', status: 'new', score: 91, created_at: '2026-01-16T00:00:00Z' },
]

export async function getCandidateCollection(status?: CandidateStatus): Promise<{
  candidates: Candidate[]
  source: 'live' | 'demo' | 'unavailable' | 'forbidden' | 'unauthenticated'
}> {
  const client = await getServerSupabase()
  if (!client) return { candidates: mockCandidates.filter(c => !status || c.status === status), source: 'demo' }
  const user = await verifiedUser()
  if (!user) return { candidates: [], source: 'unauthenticated' }
  if (user.app_metadata?.role !== 'admin') return { candidates: [], source: 'forbidden' }
  let query = client.from('candidates').select('id,full_name,email,role,status,score,created_at').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  try {
    const { data, error } = await query
    if (error) return { candidates: [], source: 'unavailable' }
    return {
      candidates: (data ?? []).map(c => ({ ...c, full_name: c.full_name ?? 'Unnamed candidate', email: c.email ?? '', desired_role: c.role ?? 'architect', score: Number(c.score ?? 0) })),
      source: 'live',
    }
  } catch { return { candidates: [], source: 'unavailable' } }
}

export async function getCandidates(status?: CandidateStatus) {
  return (await getCandidateCollection(status)).candidates
}

export async function updateCandidateStatus(candidateId: string, status: CandidateStatus, request?: Request): Promise<boolean> {
  const client = await getServerSupabase(request)
  if (!client || !await isHiringAdmin(request)) return false
  const { data, error } = await client.from('candidates').update({ status }).eq('id', candidateId).select('id')
  return !error && data?.length === 1
}

export async function createReport(userId: string, payload: PrismReport, request?: Request) {
  const client = await getServerSupabase(request)
  if (!client) return false
  const { error } = await client.from('reports').upsert({
    user_id: userId, summary: payload.summary, strengths: payload.strengths,
    job_roles: payload.jobRoles, skill_roadmap: payload.skillRoadmap,
    learning_resources: payload.learningResources,
  }, { onConflict: 'user_id' })
  return !error
}
