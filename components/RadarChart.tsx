'use client'

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RechartRadar, ResponsiveContainer } from 'recharts'

type Item = { role: string; score: number }

export default function RadarChart({ data }: { data: Item[] }) {
  const normalized = data.map(entry => ({ ...entry, role: entry.role.charAt(0).toUpperCase() + entry.role.slice(1), score: Math.max(0, Math.min(100, entry.score)) }))
  return <figure aria-label="Role alignment radar, scored from 0 to 100">
    <div className="h-72 sm:h-80 w-full" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><RechartRadar data={normalized} outerRadius="65%" margin={{ top: 20, right: 28, bottom: 20, left: 28 }}>
      <PolarGrid stroke="#35415A" /><PolarAngleAxis dataKey="role" tick={{ fill: '#B7C2D3', fontSize: 11 }} tickLine={false} axisLine={false} /><PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} /><Radar dataKey="score" stroke="#D4A843" strokeWidth={2} fill="#D4A843" fillOpacity={0.16} isAnimationActive={false} />
    </RechartRadar></ResponsiveContainer></div>
    <figcaption className="sr-only">{normalized.map(entry => `${entry.role}: ${entry.score} out of 100`).join('; ')}</figcaption>
  </figure>
}
