export type PrismRole = 'architect' | 'integrator' | 'designer' | 'educator' | 'consultant'

export type PrismQuestion = {
  id: number
  role: PrismRole
  text: string
  weight: number
}

const roleCycle: PrismRole[] = ['architect', 'integrator', 'designer', 'educator', 'consultant']

const prompts = [
  'I enjoy designing scalable systems that can handle growth.',
  'I can connect people, tools, and processes into one workflow.',
  'I care deeply about product experience and visual craft.',
  'I like teaching concepts and mentoring peers.',
  'I naturally align technical work with business outcomes.',
  'I think in terms of architecture boundaries and long-term maintainability.',
  'I am energized by API integrations and workflow orchestration.',
  'I iterate on user flows until friction is removed.',
  'I can simplify complex ideas into teachable frameworks.',
  'I guide teams on strategic decision-making and prioritization.',
]

export const questions: PrismQuestion[] = Array.from({ length: 50 }, (_, index) => {
  const role = roleCycle[index % roleCycle.length]
  const prompt = prompts[index % prompts.length]

  return {
    id: index + 1,
    role,
    text: `${prompt} (Q${index + 1})`,
    weight: (index % 3) + 1,
  }
})
