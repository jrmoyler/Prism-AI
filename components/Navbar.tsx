"use client"

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/assessment', label: 'Assessment' },
  { href: '/results',    label: 'Results' },
  { href: '/reports',    label: 'AI Report' },
  { href: '/candidates', label: 'Candidates' },
]

const rightLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/signin',     label: 'Sign in', primary: true },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(7,10,18,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center gap-1 px-6 h-16">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 mr-8 flex-shrink-0 group">
          <div className="relative h-7 w-7 flex-shrink-0">
            {/* Prism logo mark */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 opacity-90" />
            <div className="absolute inset-[1px] rounded-[7px] bg-gradient-to-br from-indigo-400 to-violet-500 opacity-80" />
            <svg className="absolute inset-0 m-auto h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-wide text-white">
            PRISM
          </span>
          <span
            className="hidden sm:inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wider"
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#818cf8',
            }}
          >
            AI
          </span>
        </a>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <NavLink key={href} href={href} label={label} active={active} />
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {rightLinks.map(({ href, label, primary }) =>
            primary ? (
              <motion.a
                key={href}
                href={href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-all"
                style={{
                  background: 'rgba(99,102,241,0.9)',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.5), 0 2px 8px rgba(99,102,241,0.2)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(99,102,241,1)'
                  el.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.7), 0 4px 12px rgba(99,102,241,0.3)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(99,102,241,0.9)'
                  el.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.5), 0 2px 8px rgba(99,102,241,0.2)'
                }}
              >
                {label}
              </motion.a>
            ) : (
              <NavLink key={href} href={href} label={label} active={pathname === href} />
            )
          )}
        </div>
      </nav>
    </header>
  )
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className="relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 group"
      style={{ color: active ? '#f1f5f9' : '#64748b' }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#cbd5e1' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#64748b' }}
    >
      {label}
      {/* Active indicator */}
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-md"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      {/* Hover underline */}
      <span
        className="absolute bottom-0.5 left-3 right-3 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: active ? 'rgba(129,140,248,0.6)' : 'rgba(255,255,255,0.15)' }}
      />
    </a>
  )
}
