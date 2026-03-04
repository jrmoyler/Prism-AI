import type { PrismRole } from '../prism/questions'

export type CandidateStatus = 'new' | 'review' | 'interview' | 'hired' | 'rejected'

export type Candidate = {
  id: string
  full_name: string
  email: string
  desired_role: PrismRole
  status: CandidateStatus
  score: number
  created_at: string
}

export type PrismReport = {
  summary: string
  strengths: string[]
  jobRoles: string[]
  skillRoadmap: string[]
  learningResources: string[]
}
