"use client"

import { questions } from "../../prism/questions"
import { useState } from "react"
import QuestionCard from "../../components/QuestionCard"

export default function Assessment(){

 const [answers,setAnswers]=useState<number[]>(()=>Array(questions.length).fill(3))

 const submit=async()=>{

  const res=await fetch("/api/score",{
   method:"POST",
   headers:{ "Content-Type": "application/json" },
   body:JSON.stringify({answers})
  })

  const data=await res.json()

  localStorage.setItem("prism",JSON.stringify(data))

  window.location.href="/results"
 }

 return(

  <div className="p-10">

   {questions.map((q,i)=>(
    <QuestionCard
      key={i}
      question={q}
      value={answers[i]}
      onChange={(v)=>{
        const a=[...answers]
        a[i]=v
        setAnswers(a)
      }}
    />
   ))}

   <button
    onClick={submit}
    className="px-6 py-3 bg-black text-white"
   >
    Submit
   </button>

  </div>
 )

}
