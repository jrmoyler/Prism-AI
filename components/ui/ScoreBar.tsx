"use client"

import { motion } from 'framer-motion'
import type { PrismRole } from '../../prism/questions'

const roleBarColor: Record<string, string> = {
  architect:  'from-indigo-500 to-indigo-400',
  integrator: 'from-violet-500 to-violet-400',
  designer:   'from-pink-500 to-pink-400',
  educator:   'from-emerald-500 to-emerald-400',
  consultant: 'from-amber-500 to-amber-400',
}

interface Props {
  role: PrismRole | string
  score: number
  label?: string
  showValue?: boolean
  delay?: number
}

export default function ScoreBar({ role, score, label, showValue = true, delay = 0 }: Props) {
  const gradient = roleBarColor[role] ?? 'from-slate-500 to-slate-400'
  const displayLabel = label ?? (role.charAt(0).toUpperCase() + role.slice(1))
  const pct = Math.min(100, Math.max(0, score))

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300 capitalize">{displayLabel}</span>
        {showValue && (
          <span className="text-xs font-mono text-slate-500 tabular-nums">{pct.toFixed(0)}</span>
        )}
      </div>
      <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  )
}
