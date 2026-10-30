import { getCandidateCollection } from '../../lib/supabase'
import DashboardAnalytics from '../../components/DashboardAnalytics'
import CandidateDirectory from '../candidates/CandidateDirectory'
import WorkspaceNotice from '../candidates/WorkspaceNotice'
import type { CandidateStatus } from '../../lib/types'

export const dynamic = 'force-dynamic'
const statuses: CandidateStatus[] = ['new', 'review', 'interview', 'hired', 'rejected']
const roles = ['architect', 'integrator', 'designer', 'educator', 'consultant']

export default async function DashboardPage({searchParams}: {searchParams:Promise<{error?:string;updated?:string}>}) {
  const params = await searchParams
  const {candidates, source} = await getCandidateCollection()
  const total = candidates.length
  const average = total ? Math.round(candidates.reduce((sum, candidate) => sum + candidate.score, 0) / total) : null
  const needsReview = candidates.filter(candidate => candidate.status === 'new' || candidate.status === 'review').length
  const roleDistribution = roles.map(role => ({role, count:candidates.filter(candidate => candidate.desired_role === role).length}))
  const pipelineDistribution = statuses.map(status => ({status, count:candidates.filter(candidate => candidate.status === status).length}))
  const averageScoreByRole = roles.map(role => {const matching = candidates.filter(candidate => candidate.desired_role === role);return {role, score:matching.length ? Math.round(matching.reduce((sum,candidate) => sum + candidate.score,0)/matching.length) : 0}})
  return <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
    <header className="flex flex-wrap items-end justify-between gap-6"><div><p className="mb-4 font-mono text-xs uppercase tracking-[0.2em]" style={{color:'#D4A843'}}>PRISM / Hiring workspace</p><h1 className="text-4xl font-semibold tracking-tight md:text-5xl">A clearer view of talent.</h1><p className="mt-4 max-w-2xl text-slate-400">Review the pipeline, understand role interests and move candidates forward with intention.</p></div><a href="/candidates" className="inline-flex min-h-11 items-center border border-slate-600 px-5 text-sm">Open directory</a></header>
    <WorkspaceNotice source={source}/>
    {params.updated === '1' && <p role="status" className="border border-emerald-400/30 p-4 text-sm" style={{color:'#00D9B5'}}>Candidate stage saved.</p>}
    {params.error && <p role="alert" className="border border-red-400/40 p-4 text-sm text-red-300">{params.error === 'invalid_status' ? 'That stage change was not valid. Choose a stage and save again.' : 'The stage change could not be saved. The current records below reflect the last saved state.'}</p>}
    {(source === 'demo' || source === 'live') && <>
      <section aria-label="Workspace totals" className="grid divide-y divide-slate-700 border border-slate-700 md:grid-cols-3 md:divide-x md:divide-y-0" style={{background:'#0D1326'}}>
        {[{title:'Candidates',value:total,note:'All records in this workspace'},{title:'Awaiting review',value:needsReview,note:'New and review stages'},{title:'Average self-assessment',value:average === null ? '—' : `${average}/100`,note:'Preference signal, not proficiency'}].map(metric => <article key={metric.title} className="p-6"><h2 className="text-sm text-slate-400">{metric.title}</h2><p className="my-4 font-mono text-4xl" style={{color:'#D4A843'}}>{metric.value}</p><p className="text-xs text-slate-400">{metric.note}</p></article>)}
      </section>
      <DashboardAnalytics roleDistribution={roleDistribution} pipelineDistribution={pipelineDistribution} averageScoreByRole={averageScoreByRole}/>
      <CandidateDirectory candidates={candidates} editable={source === 'live'}/>
    </>}
  </main>
}
