import { ReactNode } from 'react'
interface Props { children: ReactNode; className?: string; hover?: boolean; glow?: boolean; delay?: number; onClick?: () => void }
export default function GlassCard({ children, className = '', onClick }: Props) {
  return onClick ? <button onClick={onClick} className={`glass text-left ${className}`}>{children}</button> : <section className={`glass ${className}`}>{children}</section>
}
