import type { PrismRole } from '../../prism/questions'
interface Props { role: PrismRole | string; size?: 'sm' | 'md' | 'lg'; dot?: boolean }
export default function RoleBadge({ role, size = 'md' }: Props) {
  return <span className={`inline-flex border border-[#465166] text-[#D4A843] capitalize ${size === 'lg' ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'}`}>{role}</span>
}
