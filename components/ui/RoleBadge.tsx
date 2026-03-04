import type { PrismRole } from '../../prism/questions'

const roleConfig: Record<PrismRole, { label: string; classes: string }> = {
  architect:  { label: 'Architect',  classes: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25 ring-indigo-500/10' },
  integrator: { label: 'Integrator', classes: 'text-violet-400 bg-violet-500/10 border-violet-500/25 ring-violet-500/10' },
  designer:   { label: 'Designer',   classes: 'text-pink-400   bg-pink-500/10   border-pink-500/25   ring-pink-500/10' },
  educator:   { label: 'Educator',   classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 ring-emerald-500/10' },
  consultant: { label: 'Consultant', classes: 'text-amber-400  bg-amber-500/10  border-amber-500/25  ring-amber-500/10' },
}

const dotConfig: Record<PrismRole, string> = {
  architect:  'bg-indigo-400',
  integrator: 'bg-violet-400',
  designer:   'bg-pink-400',
  educator:   'bg-emerald-400',
  consultant: 'bg-amber-400',
}

interface Props {
  role: PrismRole | string
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

export default function RoleBadge({ role, size = 'md', dot = false }: Props) {
  const config = roleConfig[role as PrismRole] ?? {
    label: role.charAt(0).toUpperCase() + role.slice(1),
    classes: 'text-slate-400 bg-slate-500/10 border-slate-500/25',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${config.classes}`}>
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotConfig[role as PrismRole] ?? 'bg-slate-400'} flex-shrink-0`} />
      )}
      {config.label}
    </span>
  )
}
