'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE, divisionUrl } from '../lib/links'
import { Tile } from './Marks'

const DIVS = [
  ['zenflow', 'ZenFlow'], ['the-collective', 'The Collective'], ['hybrid-living', 'Hybrid Living'],
  ['nexus-labs', 'Nexus Labs'], ['terra-axis', 'Terra Axis'], ['binary-loom', 'Binary Loom'],
  ['obsidian-arc', 'Obsidian Arc'], ['kinetic-edge', 'Kinetic Edge'], ['quantum-ledger', 'Quantum Ledger'], ['juris-guard', 'Juris Guard'], ['signal-velocity', 'Signal Velocity'],
]

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
    <section className="context-rail" aria-label="Where you are">
      <nav aria-label="Breadcrumb"><Link href="/">PRISM AI</Link><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>
      <a href={SITE.main}>A Collective AI platform</a>
    </section>
    {journey && <nav className="journey-rail" aria-label="Your career exploration">{stages.map(stage => <Link key={stage.href} href={stage.href} aria-current={pathname === stage.href ? 'page' : undefined}><span>{stage.number}</span><b>{stage.label}</b></Link>)}</nav>}
    <div id="content-start" tabIndex={-1}>{children}</div>
    <footer className="ecosystem-footer">
      <div>
        <a className="parent-mark" href={SITE.main}><Tile mark="parent" size={40} /><span><b>Collective AI Inc</b><i>Architecting a Humane Future</i></span></a>
        <p>PRISM AI (Professional Role Identification and Skill Mapping) is a career intelligence platform from Collective AI Inc., Columbus, Ohio. Self-reflection informs a conversation. It does not define your potential.</p>
        <a className="hub-link" href={SITE.hub}>Not sure where to start? Start here</a>
      </div>
      <nav aria-label="Collective AI network"><span className="footer-label">Elsewhere</span><a href={SITE.main}>Main site</a><a href={SITE.hub}>Start here</a><a href={`${SITE.divisions}/`}>Division directory</a><a href={divisionUrl('hybrid-living')}>Learn with Hybrid Living</a><a href={SITE.audit}>Free AI readiness audit</a></nav>
      <nav aria-label="Divisions"><span className="footer-label">The divisions</span>{DIVS.map(([slug, name]) => <a key={slug} href={divisionUrl(slug)}><Tile mark={slug} size={22} />{name}</a>)}</nav>
      <p className="legal">&copy; {new Date().getFullYear()} Collective AI Inc, an Ohio C-Corporation. Sheet P-01, PRISM AI.</p>
    </footer>
  </div>
}
