const { test } = require('node:test')
const assert = require('node:assert/strict')
const ts = require('typescript')
const fs = require('node:fs')
const Module = require('node:module')

// Compile the application TS modules in memory; no additional test dependency.
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, file)
const originalLoad = Module._load
let verified = null
Module._load = function (id, ...rest) {
  if (id === '@supabase/ssr') return { createServerClient: () => ({ auth: { getUser: async () => ({ data: { user: verified }, error: null }) } }) }
  if (id === 'next/headers') return { cookies: () => ({ getAll: () => [], set: () => {} }) }
  return originalLoad.call(this, id, ...rest)
}
const { validateAnswers, validScores } = require('../prism/validation.ts')
const { scoreAssessment } = require('../prism/scoring.ts')
const { questions } = require('../prism/questions.ts')
const { POST: score } = require('../app/api/prism-score/route.ts')
const { POST: report } = require('../app/api/prism-report/route.ts')
const { POST: updateStatus } = require('../app/api/candidates/status/route.ts')
const { middleware } = require('../middleware.ts')
const { NextRequest } = require('next/server')
const answers = Object.fromEntries(questions.map(q => [q.id, 3]))
function post(payload) { return new Request('http://localhost/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }) }

test('canonical assessment preserves 50 questions and deterministic per-role scores', () => {
  assert.equal(questions.length, 50)
  assert.equal(new Set(questions.map(q => q.id)).size, 50)
  assert.deepEqual(Object.values(scoreAssessment(answers)), [60, 60, 60, 60, 60])
  assert.deepEqual(Object.values(scoreAssessment(Object.fromEntries(questions.map(q => [q.id, 5])))), [100, 100, 100, 100, 100])
  for (let i = 0; i < 5; i++) assert.equal(new Set(questions.slice(i * 10, i * 10 + 10).map(q => q.role)).size, 1)
})
test('rejects incomplete, coerced, aliased, and out-of-range answers', () => {
  assert.deepEqual(validateAnswers(answers), answers)
  for (const bad of [null, [], {}, { ...answers, 1: true }, { ...answers, 1: '5' }, { ...answers, 1: 6 }, { ...answers, 1: 2.5 }]) assert.equal(validateAnswers(bad), null)
  const aliases = { ...answers, '01': 3 }; delete aliases[1]
  assert.equal(validateAnswers(aliases), null)
})
test('report scores require exactly the five known dimensions', () => {
  assert.equal(validScores(scoreAssessment(answers)), true)
  for (const bad of [{}, { architect: 80 }, { ...scoreAssessment(answers), surprise: 50 }, { ...scoreAssessment(answers), educator: '60' }]) assert.equal(validScores(bad), false)
})
test('guest scoring succeeds but never claims account persistence', async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const response = await score(post({ answers }))
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.equal(result.saved, false)
  assert.equal(result.normalizedScores.architect, 60)
  for (const bad of [null, {}, { answers: null }]) assert.equal((await score(post(bad))).status, 400)
})
test('guest report uses actual score ranking and labels guided generation', async () => {
  const response = await report(post({ primaryRole: 'architect', secondaryRole: 'designer', scores: { architect: 20, integrator: 30, designer: 40, educator: 100, consultant: 80 } }))
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.equal(result.source, 'guided')
  assert.equal(result.saved, false)
  assert.match(result.summary, /educator/)
  assert.ok(result.jobRoles.includes('Technical educator'))
  for (const bad of [null, {}, { primaryRole: 'architect', secondaryRole: 'designer', scores: {} }]) assert.equal((await report(post(bad))).status, 400)
})
test('candidate mutation rejects cross-origin and unauthenticated requests', async () => {
  assert.equal((await updateStatus(post({}))).status, 403)
  const request = new Request('http://localhost/api/candidates/status', { method: 'POST', headers: { origin: 'http://localhost' }, body: new URLSearchParams({ candidateId: 'demo-1', status: 'hired' }) })
  assert.equal((await updateStatus(request)).status, 403)
})
test('forged legacy cookie and ordinary accounts cannot access hiring pages', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
  verified = null
  let response = await middleware(new NextRequest('http://localhost/dashboard', { headers: { cookie: 'prism-auth=authenticated' } }))
  assert.match(response.headers.get('location'), /\/signin$/)
  verified = { id: 'candidate', app_metadata: {}, user_metadata: { role: 'admin' } }
  response = await middleware(new NextRequest('http://localhost/candidates'))
  assert.match(response.headers.get('location'), /admin_required/)
  verified = { id: 'admin', app_metadata: { role: 'admin' } }
  response = await middleware(new NextRequest('http://localhost/dashboard'))
  assert.equal(response.headers.get('location'), null)
  verified = null
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
})
