import './globals.css'
import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import { AuthProvider } from '../providers/AuthProvider'

export const metadata: Metadata = {
  title: 'PRISM AI — Career Intelligence Platform',
  description: 'Professional Role Identification & Skill Mapping — AI-powered career assessment, candidate pipeline management, and enterprise analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <Navbar />
          <div id="content-start" tabIndex={-1}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
