"use client"

import React from "react"
import { RadarChart as RC, Radar, PolarGrid, PolarAngleAxis } from "recharts"

type Item = { role:string, score:number }

export default function RadarChart({data}:{data:Item[]}){
 return (
  <RC width={500} height={400} data={data}>
    <PolarGrid/>
    <PolarAngleAxis dataKey="role"/>
    <Radar dataKey="score"/>
  </RC>
 )
}
