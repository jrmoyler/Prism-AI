'use client'

import { useMemo, useState } from 'react'
import type { Candidate, CandidateStatus } from '../../lib/types'
import CandidateStatusSelect from '../../components/CandidateStatusSelect'

const labels: Record<CandidateStatus, string> = { new: 'New', review: 'Review', interview: 'Interview', hired: 'Hired', rejected: 'Rejected' }

export default function CandidateDirectory({ candidates, editable = false }: { candidates: Candidate[]; editable?: boolean }) {
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('all')
  const [role, setRole] = useState('all')
  const visible = useMemo(() => candidates.filter(candidate =>
    (stage === 'all' || candidate.status === stage) &&
    (role === 'all' || candidate.desired_role === role) &&
    `${candidate.full_name} ${candidate.email}`.toLowerCase().includes(query.toLowerCase().trim())), [candidates, query, stage, role])
  const fieldStyle = { background: '#050A18', border: '1px solid #344052', color: '#F5F5F5', minHeight: 44 }

  return <section aria-labelledby="directory-heading" className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 id="directory-heading" className="text-xl font-semibold">Candidate directory</h2>
      <p role="status" className="text-sm text-slate-400">{visible.length} of {candidates.length} records</p>
    </div>
    <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
      <label className="grid gap-2 text-sm text-slate-300">Search name or email<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a candidate" className="w-full px-3" style={fieldStyle} /></label>
      <label className="grid gap-2 text-sm text-slate-300">Stage<select value={stage} onChange={event => setStage(event.target.value)} className="px-3" style={fieldStyle}><option value="all">All stages</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="grid gap-2 text-sm text-slate-300">Role<select value={role} onChange={event => setRole(event.target.value)} className="px-3 capitalize" style={fieldStyle}><option value="all">All roles</option>{['architect','integrator','designer','educator','consultant'].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
    </div>
    <div className="overflow-x-auto border border-slate-700" tabIndex={0} role="region" aria-label="Candidate records, scroll horizontally on small screens">
      <table className="w-full min-w-[680px] text-left text-sm" style={{background:'#0D1326'}}>
        <caption className="sr-only">Candidate names, preferred roles, hiring stages, assessment scores and joined dates</caption>
        <thead><tr className="border-b border-slate-700 text-slate-400">{['Candidate', 'Role', 'Stage', 'Score / 100', 'Joined'].map(label => <th scope="col" key={label} className="px-5 py-4 font-normal">{label}</th>)}</tr></thead>
        <tbody>{visible.map(candidate => <tr key={candidate.id} className="border-b border-slate-800 last:border-0">
          <th scope="row" className="px-5 py-5 font-normal"><span className="block font-medium text-white">{candidate.full_name}</span><span className="text-xs text-slate-400">{candidate.email}</span></th>
          <td className="px-5 py-5 capitalize text-slate-200">{candidate.desired_role}</td>
          <td className="px-5 py-5">{editable ? <CandidateStatusSelect candidateId={candidate.id} candidateName={candidate.full_name} status={candidate.status} labelMap={labels} style={fieldStyle} /> : <span className="text-slate-300">{labels[candidate.status]}</span>}</td>
          <td className="px-5 py-5 font-mono" style={{color:'#D4A843'}}>{candidate.score}</td>
          <td className="px-5 py-5 text-slate-400">{new Date(candidate.created_at).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})}</td>
        </tr>)}</tbody>
      </table>
      {visible.length === 0 && <div className="px-5 py-12 text-center"><p className="text-white">{candidates.length ? 'No candidates match these filters.' : 'No candidate records yet.'}</p>{candidates.length > 0 && <button className="mt-4 min-h-11 underline underline-offset-4" style={{color:'#D4A843'}} onClick={() => {setQuery('');setStage('all');setRole('all')}}>Clear filters</button>}</div>}
    </div>
    <p className="max-w-3xl text-xs leading-relaxed text-slate-400">Scores reflect self-reported preferences, not verified proficiency or hiring recommendations. Review work samples and interview evidence before making a decision.</p>
  </section>
}
