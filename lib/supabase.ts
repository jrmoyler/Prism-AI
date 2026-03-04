export type Candidate = {
  id: string
  full_name: string
  role: string
  stage: 'Applied' | 'Screen' | 'Interview' | 'Offer' | 'Hired'
  score: number
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    full_name: 'Ava Patel',
    role: 'AI Product Manager',
    stage: 'Interview',
    score: 87,
    created_at: '2026-02-18T12:00:00.000Z',
  },
  {
    id: '2',
    full_name: 'Liam Chen',
    role: 'ML Engineer',
    stage: 'Screen',
    score: 81,
    created_at: '2026-02-20T15:20:00.000Z',
  },
  {
    id: '3',
    full_name: 'Sofia Reyes',
    role: 'Data Scientist',
    stage: 'Offer',
    score: 91,
    created_at: '2026-02-25T09:45:00.000Z',
  },
]

async function fetchCandidatesFromSupabase(): Promise<Candidate[] | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  const endpoint = `${supabaseUrl}/rest/v1/candidates?select=id,full_name,role,stage,score,created_at&order=created_at.desc`
  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as Candidate[]
  return data
}

export async function getCandidates(): Promise<Candidate[]> {
  try {
    const candidates = await fetchCandidatesFromSupabase()
    return candidates && candidates.length ? candidates : mockCandidates
  } catch {
    return mockCandidates
  }
}
