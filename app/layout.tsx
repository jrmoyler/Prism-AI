import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PRISM AI Hiring Platform',
  description: 'AI-powered career reporting, candidate pipeline management, and enterprise analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}
