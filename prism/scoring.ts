export const roleMap: Record<string, number[]> = {
  architect: [1,6,11,16,21,26,31,36,41,46],
  integrator: [2,7,12,17,22,27,32,37,42,47],
  designer: [3,8,13,18,23,28,33,38,43,48],
  educator: [4,9,14,19,24,29,34,39,44,49],
  consultant: [5,10,15,20,25,30,35,40,45,50]
}

export function calculateScores(answers: number[]){

 const scores:any={
  architect:0,
  integrator:0,
  designer:0,
  educator:0,
  consultant:0
 }

 Object.entries(roleMap).forEach(([role,qs])=>{
   qs.forEach((q:number)=>{
     scores[role]+=answers[q-1]||0
   })
 })

 return scores
}
