'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QUESTION_COUNT } from '../prism/questions'

const disciplines = [
  { name: 'Architect', verb: 'Design the system.', description: 'Connect models, data, and infrastructure into systems that hold up in practice.', project: 'Map an AI service from input to evaluation, including its failure paths.', skills: 'Systems thinking / Architecture / Evaluation' },
  { name: 'Integrator', verb: 'Make it work together.', description: 'Bring AI into existing tools and workflows, with attention to the details between them.', project: 'Connect two tools into a useful workflow, then document where human review belongs.', skills: 'Automation / APIs / Workflow design' },
  { name: 'Designer', verb: 'Shape the experience.', description: 'Translate technical possibilities into interactions people can understand and use.', project: 'Prototype an AI interaction with clear feedback, recovery, and user control.', skills: 'Interaction / Prototyping / Research' },
  { name: 'Educator', verb: 'Help others understand.', description: 'Turn complex ideas into lessons, practice, and feedback that build confidence.', project: 'Teach one AI concept through a short lesson and a practical exercise.', skills: 'Communication / Learning design / Facilitation' },
  { name: 'Consultant', verb: 'Find the right problem.', description: 'Connect organizational needs with practical AI opportunities and measurable outcomes.', project: 'Write an adoption brief with a clear problem, success measure, and implementation risks.', skills: 'Strategy / Discovery / Change management' },
]

export default function HomePage() {
  const [selected, setSelected] = useState(0)
  const discipline = disciplines[selected]
  return (
    <main id="main-content" className="prism-home">
      <section className="fieldbook-hero" aria-labelledby="home-heading">
        <div className="hero-copy">
          <p className="eyebrow">Collective AI / Career intelligence</p>
          <h1 id="home-heading">Your strengths.<br />A clearer<br /><em>direction.</em></h1>
          <p className="hero-description">Find your place in AI through the work you want to do. Map your interests across five roles, then turn your results into a practical next step.</p>
          <div className="hero-actions"><Link className="action-primary" href="/assessment">Map my strengths <span aria-hidden="true">↗</span></Link><Link className="action-text" href="/profile/demo">Explore a sample profile</Link></div>
          <p className="hero-note">{QUESTION_COUNT} questions · Five role dimensions · Start without an account</p>
        </div>
        <aside className="role-index" aria-label="Explore the five PRISM roles">
          <div className="index-heading"><span className="eyebrow">The role fieldbook</span><span className="folio">01—05</span></div>
          <p className="index-intro">There is more than one way<br />to build with AI.</p>
          <div className="role-list" aria-label="Choose a role">
            {disciplines.map((role, index) => <button key={role.name} className={selected === index ? 'role-row is-selected' : 'role-row'} aria-pressed={selected === index} onClick={() => setSelected(index)}><span className="folio">0{index + 1}</span><span>{role.name}</span><span aria-hidden="true">{selected === index ? '−' : '+'}</span></button>)}
          </div>
          <div className="role-detail" aria-live="polite"><p className="eyebrow">{discipline.skills}</p><h2>{discipline.verb}</h2><p>{discipline.description}</p><div className="project-prompt"><span className="folio">Try this</span><p>{discipline.project}</p></div></div>
        </aside>
      </section>
      <section className="journey-section" aria-labelledby="journey-title">
        <div className="section-intro"><p className="eyebrow">From reflection to practice</p><h2 id="journey-title">A starting point.<br />Not a label.</h2><p>Your scores reflect your answers today. Use them to explore possibilities, not to limit what you can become.</p></div>
        <ol className="journey-list">
          <li><span className="folio">01 / Reflect</span><h3>Start with how you work.</h3><p>Respond to statements about your interests and preferences. Progress saves in this browser when storage is available.</p><Link href="/assessment">Open assessment <span aria-hidden="true">↗</span></Link></li>
          <li><span className="folio">02 / Understand</span><h3>Read your role map.</h3><p>Compare your five dimensions and explore where your interests overlap. These are self-reported scores, not verified skill ratings.</p><Link href="/results">View my results <span aria-hidden="true">↗</span></Link></li>
          <li><span className="folio">03 / Build</span><h3>Choose your next project.</h3><p>Use your career report to decide what to practice and which work samples to create next.</p><Link href="/reports">Open career report <span aria-hidden="true">↗</span></Link></li>
        </ol>
      </section>
      <section className="team-strip"><div><p className="eyebrow">For hiring teams</p><h2>See the person behind the profile.</h2><p>Review the candidate pipeline and use role preferences as one part of a broader conversation.</p></div><Link className="action-secondary" href="/dashboard">Open hiring workspace <span aria-hidden="true">↗</span></Link></section>
      <footer className="site-footer"><span>PRISM AI <span className="footer-expansion">/ Professional Role Identification &amp; Skill Mapping</span></span><span>Collective AI · {new Date().getFullYear()}</span></footer>
    </main>
  )
}
