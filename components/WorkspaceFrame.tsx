'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const stages = [
  { href: '/assessment', label: 'Reflect', number: '01' },
  { href: '/results', label: 'Understand', number: '02' },
  { href: '/reports', label: 'Put it to work', number: '03' },
]
const labels: Record<string, string> = {
  '/': 'Career intelligence', '/assessment': 'Assessment', '/results': 'Role map',
  '/reports': 'Career field notes', '/candidates': 'Candidate directory',
  '/dashboard': 'Hiring workspace', '/admin': 'Hiring workspace',
  '/signin': 'Account access', '/login': 'Account access',
}
export default function WorkspaceFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const journey = stages.some(stage => stage.href === pathname)
  const label = labels[pathname] || (pathname.startsWith('/profile/') ? 'Profile preview' : 'Workspace')
  return <div className="workspace-frame" data-page={pathname.split('/')[1] || 'home'}>
    <div className="context-rail">
      <nav aria-label="Breadcrumb"><Link href="/">PRISM AI</Link><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>
      <a href="https://collectiveai.info/">A Collective AI platform <span aria-hidden="true">↗</span></a>
    </div>
    {journey && <nav className="journey-rail" aria-label="Your career exploration">{stages.map(stage => <Link key={stage.href} href={stage.href} aria-current={pathname === stage.href ? 'page' : undefined}><span>{stage.number}</span><b>{stage.label}</b></Link>)}</nav>}
    <div id="content-start" tabIndex={-1}>{children}</div>
    <footer className="ecosystem-footer">
      <div><Link className="wordmark" href="/">PRISM<span>AI</span></Link><p>Understand your interests.<br />Build your next direction.</p></div>
      <nav aria-label="Collective AI network"><span className="eyebrow">Continue exploring</span><a href="https://collectiveai.info/">The venture studio</a><a href="https://collective-ai-divisions-brown.vercel.app/hybrid-living/">Learning with Hybrid Living</a><a href="https://collective-ai-start.vercel.app/">All Collective AI destinations</a></nav>
      <p className="ecosystem-note">Self-reflection informs a conversation.<br />It does not define your potential.</p>
    </footer>
  </div>
}
