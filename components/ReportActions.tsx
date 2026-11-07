'use client'

import { useState } from 'react'
import type { PrismReport } from '../lib/types'

export default function ReportActions({ report }: { report: PrismReport }) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  async function copy() {
    setBusy(true)
    const text = ['PRISM AI — Career field notes', report.summary,
      ...([['strengths', 'Strengths to explore'], ['jobRoles', 'Roles to investigate'], ['skillRoadmap', 'Your practice roadmap'], ['learningResources', 'Learning resources']] as const)
        .flatMap(([key, title]) => [title, ...report[key].map(item => `• ${item}`)])].join('\n\n')
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setStatus('Report copied. You can paste it into your notes.')
    } catch { setStatus('Copy is unavailable in this browser. Use Print report to save a PDF, or select the report text.') }
    finally { setBusy(false) }
  }
  return <div className="report-actions"><div><button onClick={copy} disabled={busy} className="action-primary">{busy ? 'Copying…' : 'Copy report text'}</button><button onClick={() => window.print()} className="action-secondary">Print report</button></div><p role="status">{status}</p></div>
}
