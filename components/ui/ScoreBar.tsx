import type { PrismRole } from '../../prism/questions'
interface Props { role: PrismRole | string; score: number; label?: string; showValue?: boolean; delay?: number }
export default function ScoreBar({ role, score, label, showValue = true }: Props) {
  const percent = Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0
  return <div className="space-y-2"><div className="flex justify-between gap-4"><span className="text-sm text-slate-300 capitalize">{label ?? role}</span>{showValue && <span className="text-xs font-mono text-slate-400">{Math.round(percent)}/100</span>}</div><div className="h-1 bg-white/10"><div style={{ width: `${percent}%`, height: '100%', background: '#D4A843' }} /></div></div>
}
