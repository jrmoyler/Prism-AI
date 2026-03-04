import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PRISM AI Platform',
  description: 'Professional Role Identification & Skill Mapping for hiring teams.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4 text-sm">
            <a href="/" className="font-semibold">PRISM</a>
            <a href="/assessment">Assessment</a>
            <a href="/results">Results</a>
            <a href="/reports">AI Report</a>
            <a href="/candidates">Candidates</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/profile/demo" className="ml-auto">Public Profile</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
