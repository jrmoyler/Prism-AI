'use client'

import { useState } from 'react'
import type { CandidateStatus } from '../lib/types'

const STATUSES: CandidateStatus[] = ['new', 'review', 'interview', 'hired', 'rejected']

export default function CandidateStatusSelect({ candidateId, candidateName, status, labelMap, style }: {
  candidateId: string
  candidateName?: string
  status: CandidateStatus
  labelMap: Record<CandidateStatus, string>
  style: React.CSSProperties
}) {
  const [selected, setSelected] = useState(status)
  const [saving, setSaving] = useState(false)
  return <form action="/api/candidates/status" method="POST" onSubmit={() => setSaving(true)} className="flex items-center gap-2">
    <input type="hidden" name="candidateId" value={candidateId} />
    <input type="hidden" name="status" value={selected} />
    <select value={selected} disabled={saving} aria-label={`Hiring stage for ${candidateName ?? 'candidate'}`} className="min-h-11 px-2 text-xs" style={style} onChange={event => setSelected(event.target.value as CandidateStatus)}>
      {STATUSES.map(value => <option key={value} value={value}>{labelMap[value]}</option>)}
    </select>
    <button type="submit" disabled={saving || selected === status} className="min-h-11 px-3 text-xs disabled:opacity-40" style={{border:'1px solid #344052',color:'#D4A843'}}>{saving ? 'Saving…' : 'Save'}</button>
  </form>
}
