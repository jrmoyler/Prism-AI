"use client"

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

type AnalyticsProps = {
  roleDistribution: Array<{ role: string; count: number }>
  pipelineDistribution: Array<{ status: string; count: number }>
  averageScoreByRole: Array<{ role: string; score: number }>
}

const roleColors = ['#818cf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24']

export default function DashboardAnalytics({
  roleDistribution,
  pipelineDistribution,
  averageScoreByRole,
}: AnalyticsProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <ChartCard title="Role Distribution">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={roleDistribution} dataKey="count" nameKey="role" innerRadius={55} outerRadius={90}>
              {roleDistribution.map((item, idx) => (
                <Cell key={item.role} fill={roleColors[idx % roleColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Candidate Pipeline">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={pipelineDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Average Score by Role">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={averageScoreByRole}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="role" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
