import { ReactNode } from 'react'
interface Props { children: ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'; className?: string; href?: string }
export default function ButtonSecondary({ children, onClick, disabled, type = 'button', className = '', href }: Props) {
  if (href && !disabled) return <a href={href} className={`action-secondary ${className}`}>{children}</a>
  return <button type={type} onClick={onClick} disabled={disabled} className={`action-secondary disabled:opacity-50 ${className}`}>{children}</button>
}
