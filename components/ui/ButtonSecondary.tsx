"use client"

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
  href?: string
}

export default function ButtonSecondary({ children, onClick, disabled, type = 'button', className = '', href }: Props) {
  const base =
    'relative inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium ' +
    'text-slate-300 hover:text-white ' +
    'border border-white/[0.08] hover:border-white/[0.15] ' +
    'bg-white/[0.03] hover:bg-white/[0.06] ' +
    'transition-all duration-200 ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ' +
    'focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent'

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={`${base} ${className}`}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${base} ${className}`}
    >
      {children}
    </motion.button>
  )
}
