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

export default function ButtonPrimary({ children, onClick, disabled, type = 'button', className = '', href }: Props) {
  const base =
    'relative inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white ' +
    'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 ' +
    'transition-all duration-200 ' +
    'shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_2px_8px_rgba(99,102,241,0.2)] ' +
    'hover:shadow-[0_0_0_1px_rgba(99,102,241,0.6),0_4px_16px_rgba(99,102,241,0.35)] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent'

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
