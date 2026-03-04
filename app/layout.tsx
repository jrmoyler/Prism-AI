import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PRISM AI Platform',
  description: 'Professional Role Identification & Skill Mapping — AI-powered career assessment, candidate pipeline management, and enterprise analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
          <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4 text-sm">
            <a href="/" className="font-bold text-indigo-400 tracking-wide">PRISM</a>
            <a href="/assessment" className="text-slate-300 hover:text-white transition-colors">Assessment</a>
            <a href="/results" className="text-slate-300 hover:text-white transition-colors">Results</a>
            <a href="/reports" className="text-slate-300 hover:text-white transition-colors">AI Report</a>
            <a href="/candidates" className="text-slate-300 hover:text-white transition-colors">Candidates</a>
            <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
            <a href="/profile/demo" className="ml-auto text-slate-400 hover:text-white transition-colors">Public Profile</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
