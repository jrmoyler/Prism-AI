"use client"

import { useEffect, useState } from 'react'
import RadarChart from '../../components/RadarChart'

type Scores = {
  architect: number
  integrator: number
  designer: number
  educator: number
  consultant: number
}

const emptyScores: Scores = {
  architect: 0,
  integrator: 0,
  designer: 0,
  educator: 0,
  consultant: 0,
}

export default function Results() {
  const [scores, setScores] = useState<Scores>(emptyScores)

  useEffect(() => {
    const raw = localStorage.getItem('prism')
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      setScores({ ...emptyScores, ...parsed })
    } catch {
      setScores(emptyScores)
    }
  }, [])

  const chartData = [
    { role: 'Architect', score: scores.architect },
    { role: 'Integrator', score: scores.integrator },
    { role: 'Designer', score: scores.designer },
    { role: 'Educator', score: scores.educator },
    { role: 'Consultant', score: scores.consultant },
  ]

  return (
    <div className="p-10">
      <h1 className="mb-6 text-3xl">PRISM Profile</h1>
      <RadarChart data={chartData} />
    </div>
  )
}
