interface Props { value: number; className?: string; showLabel?: boolean; label?: string }
export default function ProgressBar({ value, className = '', showLabel = false, label }: Props) {
  const percent = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0
  return <div className={`space-y-2 ${className}`}>{showLabel && <p className="text-xs text-slate-400">{label ?? `${Math.round(percent)}% complete`}</p>}<div role="progressbar" aria-label={label ?? 'Progress'} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="h-1 bg-white/10"><div style={{ width: `${percent}%`, height: '100%', background: '#D4A843' }} /></div></div>
}
