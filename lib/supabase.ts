import type { Candidate, CandidateStatus, PrismReport } from './types'
import type { PrismRole } from '../prism/questions'
import type { RoleScores } from '../prism/scoring'

const projectUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey        = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// ── Header factory ────────────────────────────────────────────────────────────

function makeHeaders(useServiceRole = false): Record<string, string> {
  const token = useServiceRole ? (serviceRoleKey ?? anonKey) : anonKey
  return {
    'Content-Type': 'application/json',
    apikey: token ?? '',
    Authorization: `Bearer ${token ?? ''}`,
  }
}

// ── Generic REST fetch wrapper ────────────────────────────────────────────────

async function supabaseFetch<T>(
  path: string,
  init?: RequestInit,
  useServiceRole = false,
): Promise<T | null> {
  if (!projectUrl || !anonKey) {
    console.warn('[supabase] Missing env vars — NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return null
  }
  try {
    const response = await fetch(`${projectUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        ...makeHeaders(useServiceRole),
        ...(init?.headers ?? {}),
      },
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      console.error(`[supabase] ${path} → HTTP ${response.status}`, text)
      return null
    }
    const text = await response.text()
    if (!text || text === 'null') return null
    return JSON.parse(text) as T
  } catch (err) {
    console.error('[supabase] Fetch error:', err)
    return null
  }
}

// ── Mock fallback data ────────────────────────────────────────────────────────

export const mockCandidates: Candidate[] = [
  {
    id: 'mock-1',
    full_name: 'Alex Morgan',
    email: 'alex@example.com',
    desired_role: 'architect',
    status: 'review',
    score: 88,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    full_name: 'Jordan Lee',
    email: 'jordan@example.com',
    desired_role: 'integrator',
    status: 'interview',
    score: 75,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    full_name: 'Casey Rivera',
    email: 'casey@example.com',
    desired_role: 'designer',
    status: 'new',
    score: 91,
    created_at: new Date().toISOString(),
  },
]

// ── Candidate queries ─────────────────────────────────────────────────────────

export async function getCandidates(status?: CandidateStatus): Promise<Candidate[]> {
  const query = status
    ? `candidates?select=*&status=eq.${encodeURIComponent(status)}&order=created_at.desc`
    : 'candidates?select=*&order=created_at.desc'

  const data = await supabaseFetch<Candidate[]>(query)
  return data ?? mockCandidates
}

// ── Report persistence ────────────────────────────────────────────────────────

export async function createReport(userId: string, payload: PrismReport) {
  return supabaseFetch(
    'reports',
    {
      method: 'POST',
      body: JSON.stringify([
        {
          user_id: userId,
          summary: payload.summary,
          strengths: payload.strengths,
          job_roles: payload.jobRoles,
          skill_roadmap: payload.skillRoadmap,
          learning_resources: payload.learningResources,
        },
      ]),
      headers: {
        // upsert-style: if a report for this user already exists, merge it
        Prefer: 'return=representation,resolution=merge-duplicates',
      },
    },
    true, // service role bypasses RLS
  )
}

// ── Assessment + score persistence ───────────────────────────────────────────

export type SaveAssessmentInput = {
  userId: string
  answers: number[]
  normalizedScores: RoleScores
  primaryRole: PrismRole
  secondaryRole: PrismRole
}

/**
 * Persist a completed assessment and its computed scores to Supabase.
 *
 * Flow:
 *  1. Insert row into `assessments` → get its generated UUID
 *  2. Insert row into `scores` linked to that assessment
 *
 * Runs server-side with the service-role key to bypass RLS.
 * Returns true on success, false on any failure.
 */
export async function saveAssessmentResult(
  input: SaveAssessmentInput,
): Promise<boolean> {
  const { userId, answers, normalizedScores, primaryRole, secondaryRole } = input

  // Step 1 — Insert assessment
  const assessmentRows = await supabaseFetch<{ id: string }[]>(
    'assessments',
    {
      method: 'POST',
      body: JSON.stringify([{ user_id: userId, answers }]),
      headers: { Prefer: 'return=representation' },
    },
    true,
  )

  if (!assessmentRows || assessmentRows.length === 0) {
    console.error('[supabase] saveAssessmentResult: assessment insert failed')
    return false
  }

  const assessmentId = assessmentRows[0].id

  // Step 2 — Insert scores
  const scoreResult = await supabaseFetch(
    'scores',
    {
      method: 'POST',
      body: JSON.stringify([
        {
          assessment_id:  assessmentId,
          architect:      normalizedScores.architect,
          integrator:     normalizedScores.integrator,
          designer:       normalizedScores.designer,
          educator:       normalizedScores.educator,
          consultant:     normalizedScores.consultant,
          primary_role:   primaryRole,
          secondary_role: secondaryRole,
        },
      ]),
      headers: { Prefer: 'return=minimal' },
    },
    true,
  )

  if (scoreResult === null) {
    console.error('[supabase] saveAssessmentResult: scores insert failed')
    return false
  }

  return true
}

// ── Auth URL helpers ──────────────────────────────────────────────────────────

export function getSupabaseAuthUrls() {
  const redirectTo = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    : 'http://localhost:3000/auth/callback'

  const base = projectUrl ? `${projectUrl}/auth/v1` : ''

  return {
    magicLink: `${base}/otp?redirect_to=${encodeURIComponent(redirectTo)}`,
    google:    `${base}/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`,
  }
}
