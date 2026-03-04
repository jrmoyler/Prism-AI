import { NextResponse } from "next/server"
import { calculateScores } from "../../../prism/scoring"

export async function POST(req:Request){

 const body=await req.json()

 const scores=calculateScores(body.answers)

 return NextResponse.json(scores)

}
