"use client"

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  delay?: number
  onClick?: () => void
}

export default function GlassCard({ children, className = '', hover = false, glow = false, delay = 0, onClick }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.10)' } : {}}
      onClick={onClick}
      className={[
        'rounded-xl',
        'border border-white/[0.07]',
        'bg-white/[0.03]',
        'backdrop-blur-sm',
        glow ? 'shadow-[0_0_0_1px_rgba(99,102,241,0.15),0_4px_24px_rgba(99,102,241,0.08)]' : 'shadow-[0_1px_4px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)]',
        hover ? 'cursor-pointer transition-all duration-300' : '',
        'overflow-hidden',
        className,
      ].join(' ')}
    >
      {children}
    </motion.div>
  )
}
