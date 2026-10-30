'use client'

import { useId } from 'react'
type Props = { question: string; value?: number; onChange?: (response: number) => void }
export default function QuestionCard({ question, value = 3, onChange }: Props) {
  const id = useId()
  return <div className="mb-6"><label htmlFor={id} className="block mb-2">{question}</label><input id={id} type="range" min={1} max={5} value={value} aria-valuetext={['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'][value - 1]} onChange={event => onChange?.(Number(event.target.value))} /></div>
}
