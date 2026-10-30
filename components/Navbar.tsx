'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider'

const links = [{ href: '/assessment', label: 'Assessment' }, { href: '/results', label: 'My results' }, { href: '/reports', label: 'Career report' }, { href: '/candidates', label: 'Candidates' }, { href: '/dashboard', label: 'Hiring workspace' }]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const [error, setError] = useState('')
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [])
  return <header className="site-header"><a className="skip-link" href="#content-start">Skip to content</a><nav className="site-nav" aria-label="Main navigation"><Link className="wordmark" href="/" aria-label="Prism AI home">PRISM<span>AI</span></Link><button className="menu-toggle" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button><div id="primary-navigation" className={`nav-links ${open ? 'is-open' : ''}`}>{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}<div className="nav-account">{!loading && user ? <button onClick={async () => { try { await signOut() } catch { setError('Sign out failed. Please try again.') } }}>Sign out</button> : <Link href="/signin">Sign in</Link>}</div>{error && <p role="alert">{error}</p>}</div></nav></header>
}
