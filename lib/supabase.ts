import type { Candidate, CandidateStatus, PrismReport } from './types'

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const headers = (useServiceRole = false) => {
  const token = useServiceRole ? serviceRoleKey : anonKey
  return {
    'Content-Type': 'application/json',
    apikey: token ?? '',
    Authorization: `Bearer ${token ?? ''}`,
  }
}

async function supabaseFetch<T>(path: string, init?: RequestInit, useServiceRole = false): Promise<T | null> {
  if (!projectUrl || !anonKey) return null

  const response = await fetch(`${projectUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...headers(useServiceRole),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) return null
  return (await response.json()) as T
}

export async function getCandidates(status?: CandidateStatus): Promise<Candidate[]> {
  const query = status
    ? `candidates?select=*&status=eq.${status}&order=created_at.desc`
    : 'candidates?select=*&order=created_at.desc'

  const data = await supabaseFetch<Candidate[]>(query)

  return (
    data ?? [
      {
        id: 'local-1',
        full_name: 'Alex Morgan',
        email: 'alex@example.com',
        desired_role: 'architect',
        status: 'review',
        score: 88,
        created_at: new Date().toISOString(),
      },
    ]
  )
}

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
      headers: { Prefer: 'return=representation' },
    },
    true,
  )
}

export function getSupabaseAuthUrls() {
  const redirectTo = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    : 'http://localhost:3000/auth/callback'

  const base = projectUrl ? `${projectUrl}/auth/v1` : ''

  return {
    magicLink: `${base}/otp?redirect_to=${encodeURIComponent(redirectTo)}`,
    google: `${base}/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`,
  }
}
