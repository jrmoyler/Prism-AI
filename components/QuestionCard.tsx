"use client"

import React from "react"

type Props = {
  question: string
  value?: number
  onChange?: (v:number)=>void
}

export default function QuestionCard({question,value=3,onChange}:Props){
 return (
  <div className="mb-6">
    <p className="mb-2">{question}</p>
    <input
      type="range"
      min={1}
      max={5}
      value={value}
      onChange={(e)=>onChange?.(parseInt(e.target.value))}
    />
  </div>
 )
}
