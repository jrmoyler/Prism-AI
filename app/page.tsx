"use client"

import { motion } from 'framer-motion'

const roles = [
  { label: 'Architect',  color: '#818cf8', pct: 84 },
  { label: 'Integrator', color: '#a78bfa', pct: 72 },
  { label: 'Designer',   color: '#f472b6', pct: 65 },
  { label: 'Educator',   color: '#34d399', pct: 58 },
  { label: 'Consultant', color: '#fbbf24', pct: 79 },
]

const modules = [
  {
    title: 'Assessment Engine',
    description: '50-question adaptive assessment with autosave and real-time scoring across five PRISM dimensions.',
    href: '/assessment',
    cta: 'Start Assessment',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 8h6M5 5.5h4M5 10.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    accent: '#6366f1',
    accentBg: 'rgba(99,102,241,0.08)',
    accentBorder: 'rgba(99,102,241,0.2)',
  },
  {
    title: 'AI Career Report',
    description: 'GPT-4o powered career narratives with role-fit analysis, skill roadmaps, and curated resources.',
    href: '/reports',
    cta: 'View Report',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
        <path d="M13 7a5 5 0 0 1-5 5A5 5 0 0 1 3 7a5 5 0 0 1 5-5 5 5 0 0 1 5 5Z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: '#8b5cf6',
    accentBg: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.2)',
  },
  {
    title: 'Candidate Database',
    description: 'Supabase-backed candidate pipeline with status tracking, role tags, and score history.',
    href: '/candidates',
    cta: 'Browse Candidates',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.08)',
    accentBorder: 'rgba(16,185,129,0.2)',
  },
  {
    title: 'Hiring Dashboard',
    description: 'Real-time hiring funnel analytics with stage breakdowns, interview conversion, and role distribution.',
    href: '/dashboard',
    cta: 'Open Dashboard',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="9" width="3" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="6.5" y="5" width="3" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="11" y="2" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.2)',
  },
  {
    title: 'Public Profiles',
    description: 'Shareable PRISM radar chart profiles — built for social sharing and candidate showcase.',
    href: '/profile/demo',
    cta: 'See Demo',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    accent: '#f43f5e',
    accentBg: 'rgba(244,63,94,0.08)',
    accentBorder: 'rgba(244,63,94,0.2)',
  },
  {
    title: 'Talent Analytics',
    description: 'Pipeline conversion rates, role distribution, and quality scoring across your hiring funnel.',
    href: '/dashboard',
    cta: 'View Analytics',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 11l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.08)',
    accentBorder: 'rgba(6,182,212,0.2)',
  },
]

const stats = [
  { value: '50', label: 'Questions', sub: 'Adaptive assessment' },
  { value: '5',  label: 'Dimensions', sub: 'PRISM role mapping' },
  { value: 'AI', label: 'Powered', sub: 'GPT-4o insights' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
}

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
}

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">

      {/* Background ambient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)', filter: 'blur(100px)' }}
        />
      </div>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left column */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: '#818cf8',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
                Professional Role Identification &amp; Skill Mapping
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp} className="space-y-3">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                <span className="text-white">PRISM</span>
                <span
                  className="block mt-1"
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 60%, #818cf8 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradientX 4s ease infinite',
                  }}
                >
                  AI
                </span>
              </h1>
              <p className="text-xl text-slate-400 font-light leading-relaxed max-w-md">
                Discover where you belong in the AI workforce.
              </p>
            </motion.div>

            {/* Subtext */}
            <motion.p variants={fadeUp} className="text-base text-slate-500 leading-relaxed max-w-md">
              A precision career intelligence platform. 50 adaptive questions. 5 PRISM dimensions.
              AI-generated role-fit insights for the next era of work.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <motion.a
                href="/assessment"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.5), 0 4px 16px rgba(99,102,241,0.3)',
                }}
              >
                Start Assessment
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
              <motion.a
                href="/profile/demo"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-slate-300 hover:text-white transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                View Example Profile
              </motion.a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeUp} className="flex items-center gap-6 pt-2">
              {stats.map(({ value, label, sub }, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column – Radar preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:block"
          >
            <HeroRadarPreview />
          </motion.div>
        </div>
      </section>

      {/* ── Platform Modules ─────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.15em] mb-3"
            style={{ color: '#64748b' }}
          >
            Platform Modules
          </p>
          <h2 className="text-2xl font-semibold text-white">Everything you need</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
        >
          {modules.map((mod) => (
            <motion.a
              key={mod.title}
              href={mod.href}
              variants={fadeUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="group relative rounded-xl p-5 flex flex-col gap-4 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = mod.accentBg
                el.style.border = `1px solid ${mod.accentBorder}`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'rgba(255,255,255,0.02)'
                el.style.border = '1px solid rgba(255,255,255,0.06)'
              }}
            >
              {/* Icon */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                style={{
                  background: mod.accentBg,
                  border: `1px solid ${mod.accentBorder}`,
                  color: mod.accent,
                }}
              >
                {mod.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">{mod.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{mod.description}</p>
              </div>

              {/* CTA */}
              <div
                className="flex items-center gap-1 text-xs font-medium transition-colors duration-200 group-hover:gap-2"
                style={{ color: mod.accent }}
              >
                {mod.cta}
                <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* ── Stats Banner ────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-7xl px-6 pb-24"
      >
        <div
          className="rounded-2xl p-8 md:p-10 grid md:grid-cols-3 gap-8 text-center"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {[
            { value: '50', label: 'Assessment Questions', desc: 'Calibrated across 5 PRISM roles', color: '#818cf8' },
            { value: '5',  label: 'Role Dimensions',      desc: 'Architect · Integrator · Designer · Educator · Consultant', color: '#a78bfa' },
            { value: 'AI', label: 'Powered Reports',      desc: 'GPT-4o career intelligence engine', color: '#c084fc' },
          ].map(({ value, label, desc, color }) => (
            <div key={label} className="space-y-2">
              <p className="text-4xl font-bold" style={{ color }}>{value}</p>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </main>
  )
}

/* ── Radar preview component ──────────────────────────── */
function HeroRadarPreview() {
  const cx = 200
  const cy = 200
  const r  = 150

  const points = roles.map((role, i) => {
    const angle = (i * 2 * Math.PI) / roles.length - Math.PI / 2
    return {
      ...role,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      fx: cx + (r * role.pct / 100) * Math.cos(angle),
      fy: cy + (r * role.pct / 100) * Math.sin(angle),
    }
  })

  const polygon = points.map(p => `${p.fx},${p.fy}`).join(' ')
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div
        className="relative rounded-2xl p-6"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="text-xs font-medium text-slate-500 mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Role Alignment Radar
        </div>

        <svg width="400" height="400" viewBox="0 0 400 400" className="overflow-visible">
          <defs>
            <linearGradient id="heroRadarGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.25} />
            </linearGradient>
            <filter id="heroGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid rings */}
          {gridLevels.map((lvl, i) => {
            const gridPts = roles.map((_, ri) => {
              const angle = (ri * 2 * Math.PI) / roles.length - Math.PI / 2
              return `${cx + r * lvl * Math.cos(angle)},${cy + r * lvl * Math.sin(angle)}`
            }).join(' ')
            return (
              <polygon
                key={i}
                points={gridPts}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            )
          })}

          {/* Axis lines */}
          {points.map((p, i) => (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={p.x} y2={p.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Data polygon */}
          <motion.polygon
            points={polygon}
            fill="url(#heroRadarGrad)"
            stroke="#818cf8"
            strokeWidth="1.5"
            filter="url(#heroGlow)"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Data points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.fx} cy={p.fy}
              r="4"
              fill={p.color}
              stroke="#070a12"
              strokeWidth="2"
              filter="url(#heroGlow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            />
          ))}

          {/* Labels */}
          {points.map((p, i) => {
            const lx = cx + (r + 28) * Math.cos((i * 2 * Math.PI) / roles.length - Math.PI / 2)
            const ly = cy + (r + 28) * Math.sin((i * 2 * Math.PI) / roles.length - Math.PI / 2)
            return (
              <text
                key={i}
                x={lx} y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={p.color}
                fontSize="12"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
                opacity="0.9"
              >
                {p.label}
              </text>
            )
          })}
        </svg>

        {/* Score legend */}
        <div className="mt-4 grid grid-cols-5 gap-1">
          {roles.map(r => (
            <div key={r.label} className="text-center">
              <div className="text-xs font-semibold" style={{ color: r.color }}>{r.pct}</div>
              <div className="text-[10px] text-slate-600 truncate">{r.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
