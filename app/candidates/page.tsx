import { getCandidateCollection } from '../../lib/supabase'
import CandidateDirectory from './CandidateDirectory'
import WorkspaceNotice from './WorkspaceNotice'

export const dynamic = 'force-dynamic'

export default async function CandidatesPage() {
  const {candidates, source} = await getCandidateCollection()
  return <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
    <header className="flex flex-wrap items-end justify-between gap-6"><div className="max-w-2xl"><p className="mb-4 font-mono text-xs uppercase tracking-[0.2em]" style={{color:'#D4A843'}}>PRISM / Hiring workspace</p><h1 className="text-4xl font-semibold tracking-tight md:text-5xl">People, beyond a score.</h1><p className="mt-4 leading-relaxed text-slate-400">Find candidates by name, role interest or hiring stage. Keep the evidence behind each decision in view.</p></div><a href="/dashboard" className="inline-flex min-h-11 items-center border border-slate-600 px-5 text-sm">View pipeline</a></header>
    <WorkspaceNotice source={source}/>
    {(source === 'demo' || source === 'live') && <CandidateDirectory candidates={candidates} editable={source === 'live'}/>}
  </main>
}
