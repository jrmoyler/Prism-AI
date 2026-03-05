"use client"

import type { CandidateStatus } from '../lib/types'

const STATUSES: CandidateStatus[] = ['new', 'review', 'interview', 'hired', 'rejected']

export default function CandidateStatusSelect({
  candidateId,
  status,
  labelMap,
  style,
}: {
  candidateId: string
  status: CandidateStatus
  labelMap: Record<CandidateStatus, string>
  style: React.CSSProperties
}) {
  return (
    <form action="/api/candidates/status" method="POST" className="inline">
      <input type="hidden" name="candidateId" value={candidateId} />
      <select
        name="status"
        defaultValue={status}
        className="rounded-md px-2 py-1 text-xs"
        style={style}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {STATUSES.map((item) => (
          <option key={item} value={item}>
            {labelMap[item]}
          </option>
        ))}
      </select>
    </form>
  )
}
