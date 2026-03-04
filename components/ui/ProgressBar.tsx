"use client"

import { motion } from 'framer-motion'

interface Props {
  value: number      // 0–100
  className?: string
  showLabel?: boolean
  label?: string
}

export default function ProgressBar({ value, className = '', showLabel = false, label }: Props) {
  const pct = Math.min(100, Math.max(0, value))

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500">
          <span>{label ?? `${pct}% complete`}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-0.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  )
}
