export default function Home(){

 return(
  <main className="h-screen flex flex-col items-center justify-center">

   <h1 className="text-5xl font-bold">
    PRISM
   </h1>

   <p className="mt-4">
    Professional Role Identification & Skill Mapping
   </p>

   <a
    href="/assessment"
    className="mt-6 px-6 py-3 bg-black text-white rounded"
   >
    Start Assessment
   </a>

  </main>
 )

}
