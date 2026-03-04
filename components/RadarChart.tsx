"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartRadar, ResponsiveContainer } from 'recharts'

type Item = { role: string; score: number }

export default function RadarChart({ data }: { data: Item[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <RechartRadar data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="role" />
          <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
        </RechartRadar>
      </ResponsiveContainer>
    </div>
  )
}
