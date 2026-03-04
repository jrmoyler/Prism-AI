"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartRadar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type Item = { role: string; score: number }

const roleLabels: Record<string, string> = {
  architect:  'Architect',
  integrator: 'Integrator',
  designer:   'Designer',
  educator:   'Educator',
  consultant: 'Consultant',
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: Item }> }) {
  if (!active || !payload?.length) return null
  const { role, score } = payload[0].payload
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#0d111e]/90 backdrop-blur-md px-3 py-2 text-sm shadow-xl">
      <p className="font-medium text-slate-200 capitalize">{roleLabels[role] ?? role}</p>
      <p className="text-indigo-400 font-mono">{score.toFixed(0)}</p>
    </div>
  )
}

export default function RadarChart({ data }: { data: Item[] }) {
  const normalized = data.map(d => ({ ...d, role: roleLabels[d.role] ?? d.role }))

  return (
    <div className="h-80 w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <RechartRadar data={normalized} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <PolarGrid
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="0"
          />
          <PolarAngleAxis
            dataKey="role"
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />
          <Radar
            dataKey="score"
            stroke="#818cf8"
            strokeWidth={1.5}
            fill="url(#radarGradient)"
            fillOpacity={1}
            filter="url(#glow)"
          />
          <Tooltip content={<CustomTooltip />} />
        </RechartRadar>
      </ResponsiveContainer>
    </div>
  )
}
