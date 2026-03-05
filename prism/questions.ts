export type PrismRole = 'architect' | 'integrator' | 'designer' | 'educator' | 'consultant'

export type Question = {
  id: number
  role: PrismRole
  text: string
}

// 50 unique questions — 10 per role, deterministic order
// Weights: 1 (low), 2 (medium), 3 (high) distributed evenly per role
export const questions: Question[] = [
  // ── ARCHITECT ──────────────────────────────────────────────────────────────
  { id:  1, role: 'architect', text: 'I enjoy designing scalable systems that can handle significant growth in users and data.' },
  { id:  2, role: 'architect', text: 'I think in terms of architecture boundaries and long-term technical maintainability.' },
  { id:  3, role: 'architect', text: 'I prefer solving problems at the infrastructure level rather than the application layer.' },
  { id:  4, role: 'architect', text: 'I naturally consider how data flows through a system before writing any code.' },
  { id:  5, role: 'architect', text: 'I enjoy evaluating trade-offs between different database and storage architectures.' },
  { id:  6, role: 'architect', text: 'I find deep satisfaction in creating systems that are resilient to failure and self-healing.' },
  { id:  7, role: 'architect', text: 'I prefer working on foundational platform components that enable other engineers to build faster.' },
  { id:  8, role: 'architect', text: 'I enjoy defining APIs and service contracts between components before implementation begins.' },
  { id:  9, role: 'architect', text: 'I regularly think about how a system will behave under 10x or 100x its current load.' },
  { id: 10, role: 'architect', text: 'I am energized by technical design reviews and writing architectural decision records.' },

  // ── INTEGRATOR ─────────────────────────────────────────────────────────────
  { id: 11, role: 'integrator', text: 'I can connect people, tools, and processes into one seamless, unified workflow.' },
  { id: 12, role: 'integrator', text: 'I am energized by API integrations and orchestrating complex automation pipelines.' },
  { id: 13, role: 'integrator', text: 'I enjoy building automation that eliminates manual, repetitive tasks across teams.' },
  { id: 14, role: 'integrator', text: 'I naturally look for gaps between disconnected systems and build bridges to close them.' },
  { id: 15, role: 'integrator', text: 'I take great satisfaction in watching all the pieces of a system work together harmoniously.' },
  { id: 16, role: 'integrator', text: 'I prefer building data pipelines and integrations over standalone product features.' },
  { id: 17, role: 'integrator', text: 'I often think about how to reduce friction in handoffs between tools and teams.' },
  { id: 18, role: 'integrator', text: 'I enjoy configuring webhooks, event triggers, and real-time automated sequences.' },
  { id: 19, role: 'integrator', text: 'I feel most productive when I can automate repetitive handoffs across systems.' },
  { id: 20, role: 'integrator', text: 'I naturally reach for integration platforms and middleware when solving business problems.' },

  // ── DESIGNER ───────────────────────────────────────────────────────────────
  { id: 21, role: 'designer', text: 'I care deeply about product experience and believe that visual craft directly impacts outcomes.' },
  { id: 22, role: 'designer', text: 'I iterate on user flows persistently until all unnecessary friction is removed.' },
  { id: 23, role: 'designer', text: 'I naturally empathize with users and constantly think about their mental models and expectations.' },
  { id: 24, role: 'designer', text: 'I treat aesthetics and usability as first-class requirements, not afterthoughts.' },
  { id: 25, role: 'designer', text: 'I enjoy rapid prototyping and validating ideas with real users as quickly as possible.' },
  { id: 26, role: 'designer', text: 'I immediately notice when an interface feels visually inconsistent or intuitively wrong.' },
  { id: 27, role: 'designer', text: 'I find deep satisfaction in improving a user journey until it feels effortless and delightful.' },
  { id: 28, role: 'designer', text: 'I prefer designing solutions from the user\'s perspective rather than the system\'s constraints.' },
  { id: 29, role: 'designer', text: 'I get excited by design systems that enforce visual consistency at scale across a product.' },
  { id: 30, role: 'designer', text: 'I think carefully about information architecture and how content should be structured for users.' },

  // ── EDUCATOR ───────────────────────────────────────────────────────────────
  { id: 31, role: 'educator', text: 'I genuinely enjoy teaching concepts and mentoring peers to accelerate their professional growth.' },
  { id: 32, role: 'educator', text: 'I can break down complex technical ideas into simple, teachable frameworks for any audience.' },
  { id: 33, role: 'educator', text: 'I feel most engaged when I am actively helping others expand their knowledge and skills.' },
  { id: 34, role: 'educator', text: 'I naturally adapt how I explain technical concepts based on my audience\'s background and level.' },
  { id: 35, role: 'educator', text: 'I enjoy creating documentation, learning guides, and educational resources that others rely on.' },
  { id: 36, role: 'educator', text: 'I feel genuine satisfaction when someone fully understands a concept I explained to them.' },
  { id: 37, role: 'educator', text: 'I prefer sharing knowledge publicly through talks, blog posts, or well-crafted written content.' },
  { id: 38, role: 'educator', text: 'I think carefully about how to make complex information more accessible and understandable.' },
  { id: 39, role: 'educator', text: 'I actively work to build a culture of continuous learning within every team I join.' },
  { id: 40, role: 'educator', text: 'I frequently find myself explaining technical concepts to non-technical stakeholders and peers.' },

  // ── CONSULTANT ─────────────────────────────────────────────────────────────
  { id: 41, role: 'consultant', text: 'I naturally align technical decisions with measurable business outcomes and strategic goals.' },
  { id: 42, role: 'consultant', text: 'I guide teams through strategic decision-making and help them prioritize the highest-impact work.' },
  { id: 43, role: 'consultant', text: 'I enjoy working directly with clients and stakeholders to surface and clarify their real needs.' },
  { id: 44, role: 'consultant', text: 'I evaluate technical decisions primarily through the lens of ROI and tangible business impact.' },
  { id: 45, role: 'consultant', text: 'I translate technical complexity into clear, compelling language that resonates with business audiences.' },
  { id: 46, role: 'consultant', text: 'I find it energizing to help organizations navigate ambiguous, high-stakes challenges.' },
  { id: 47, role: 'consultant', text: 'I naturally consider competitive positioning and market dynamics in my recommendations.' },
  { id: 48, role: 'consultant', text: 'I prefer having influence at the strategic level where organizational priorities are shaped.' },
  { id: 49, role: 'consultant', text: 'I can build genuine trust with senior executives and non-technical decision makers quickly.' },
  { id: 50, role: 'consultant', text: 'I feel most effective when my technical work directly shapes an organization\'s strategic direction.' },
]

// ── Validation (runs once at module load) ────────────────────────────────────
export function validateQuestions(): void {
  const qs = questions
  if (qs.length !== 50) {
    throw new Error(`PRISM: Expected exactly 50 questions, got ${qs.length}`)
  }

  const ids = qs.map(q => q.id)
  const uniqueIds = new Set(ids)
  if (uniqueIds.size !== qs.length) {
    const dupe = ids.find((id, i) => ids.indexOf(id) !== i)
    throw new Error(`PRISM: Duplicate question ID detected: ${dupe}`)
  }

  const texts = qs.map(q => q.text)
  const uniqueTexts = new Set(texts)
  if (uniqueTexts.size !== qs.length) {
    throw new Error('PRISM: Duplicate question text detected')
  }

  for (const q of qs) {
    if (!Number.isInteger(q.id) || q.id < 1) {
      throw new Error(`PRISM: Invalid question id: ${q.id}`)
    }
  }
}

validateQuestions()

export const QUESTION_COUNT = questions.length // 50
export const VALID_QUESTION_IDS = new Set(questions.map(q => q.id))
