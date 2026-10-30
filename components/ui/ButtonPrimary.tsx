import { ReactNode } from 'react'
interface Props { children: ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'; className?: string; href?: string }
export default function ButtonPrimary({ children, onClick, disabled, type = 'button', className = '', href }: Props) {
  if (href && !disabled) return <a href={href} className={`action-primary ${className}`}>{children}</a>
  return <button type={type} onClick={onClick} disabled={disabled} className={`action-primary disabled:opacity-50 ${className}`}>{children}</button>
}
