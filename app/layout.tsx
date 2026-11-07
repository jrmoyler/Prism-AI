import './globals.css'
import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import WorkspaceFrame from '../components/WorkspaceFrame'
import { AuthProvider } from '../providers/AuthProvider'
import { SITE } from '../lib/links'
import { Tile } from '../components/Marks'

export const metadata: Metadata = {
  title: 'PRISM AI | Career intelligence from Collective AI',
  description: 'Professional Role Identification and Skill Mapping: a 50-question assessment that maps your interests across five AI roles, with a career report and a hiring workspace.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">

      <body className="min-h-screen">
        <AuthProvider>
          <nav className="parent-strip" aria-label="Collective AI network"><div className="in">
            <a href={SITE.main}><Tile mark="parent" size={22} /><span>A Collective AI Inc. platform</span></a>
            <span className="strip-links"><a href={`${SITE.divisions}/`}>All divisions</a><a className="hub" href={SITE.hub}>Not sure? Start here</a></span>
          </div></nav>
          <Navbar />
          <WorkspaceFrame>
            {children}
          </WorkspaceFrame>
        </AuthProvider>
      </body>
    </html>
  )
}
