import Link from 'next/link'
import { notFound } from 'next/navigation'
import RadarChart from '../../../components/RadarChart'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  if (username !== 'demo') notFound()
  const chartData = [{ role: 'architect', score: 84 }, { role: 'integrator', score: 78 }, { role: 'designer', score: 72 }, { role: 'educator', score: 65 }, { role: 'consultant', score: 80 }]
  return <main className="mx-auto max-w-5xl px-6 py-12 space-y-10">
    <header className="space-y-4"><p className="text-xs uppercase tracking-widest text-[#D4A843]">Profile preview / Illustrative data</p><h1 className="text-4xl md:text-5xl">See a different side of your work.</h1><p className="text-slate-300 max-w-2xl">This example shows how PRISM maps responses across five role dimensions. These are sample scores, not a real candidate or a published personal profile.</p></header>
    <section className="grid md:grid-cols-2 border border-[#263147] bg-[#0D1326] p-5 md:p-8 gap-8"><div><p className="text-xs uppercase tracking-widest text-slate-300">Example strongest alignment</p><h2 className="text-4xl text-[#D4A843] mt-4">Architect</h2><p className="text-slate-300 leading-relaxed mt-5">An interest in systems, technical decisions, and how the pieces of an AI product fit together.</p><p className="text-sm text-slate-300 mt-8">Role alignment reflects self-reported preferences. It does not verify technical proficiency or suitability for a hiring decision.</p></div><RadarChart data={chartData} /></section>
    <section aria-label="Example scores" className="grid grid-cols-2 sm:grid-cols-5 gap-3">{chartData.map(({ role, score }) => <article key={role} className="border-t border-[#35415A] pt-4"><p className="text-3xl font-mono text-[#D4A843]">{score}<span className="text-xs text-slate-300"> / 100</span></p><h2 className="capitalize text-sm mt-2">{role}</h2></article>)}</section>
    <section className="border-t border-[#263147] pt-8 flex flex-wrap gap-6 justify-between items-center"><div><h2 className="text-2xl">Find your own starting point.</h2><p className="text-slate-300 mt-2">50 questions. Five dimensions. Your responses.</p></div><Link href="/assessment" className="px-6 py-3 bg-[#D4A843] text-[#050A18] font-semibold">Take the assessment</Link></section>
  </main>
}
