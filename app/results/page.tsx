"use client"

import { RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts"

export default function Results(){

 const data=JSON.parse(localStorage.getItem("prism")||"{}")

 const chartData=[
  {role:"Architect",score:data.architect||0},
  {role:"Integrator",score:data.integrator||0},
  {role:"Designer",score:data.designer||0},
  {role:"Educator",score:data.educator||0},
  {role:"Consultant",score:data.consultant||0}
 ]

 return(

  <div className="p-10">

   <h1 className="text-3xl mb-6">
    PRISM Profile
   </h1>

   <RadarChart width={500} height={400} data={chartData}>
    <PolarGrid/>
    <PolarAngleAxis dataKey="role"/>
    <Radar dataKey="score"/>
   </RadarChart>

  </div>

 )

}
