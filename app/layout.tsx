import './globals.css'
import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import WorkspaceFrame from '../components/WorkspaceFrame'
import { AuthProvider } from '../providers/AuthProvider'

export const metadata: Metadata = {
  title: 'PRISM AI — Career Intelligence Platform',
  description: 'Professional Role Identification & Skill Mapping — AI-powered career assessment, candidate pipeline management, and enterprise analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">

      <body className="min-h-screen">
        <AuthProvider>
          <Navbar />
          <WorkspaceFrame>
            {children}
          </WorkspaceFrame>
        </AuthProvider>
      </body>
    </html>
  )
}
