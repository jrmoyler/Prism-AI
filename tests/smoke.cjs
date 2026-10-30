const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const base = 'http://127.0.0.1:3100'
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3100'], { env: { ...process.env, NEXT_PUBLIC_APP_URL: base, NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_ANON_KEY: '', OPENAI_API_KEY: '' }, stdio: 'ignore' })
;(async () => {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { await fetch(base); break } catch { await new Promise(resolve => setTimeout(resolve, 250)) }
  }
  for (const [path, status, phrase] of [['/', 200, 'Your strengths.'], ['/assessment', 200, 'PRISM'], ['/results', 200, 'PRISM'], ['/reports', 200, 'PRISM'], ['/dashboard', 200, 'sample'], ['/candidates', 200, 'sample'], ['/login', 200, 'Sign'], ['/profile/demo', 200, 'Illustrative'], ['/profile/not-real', 404, 'available']]) {
    const response = await fetch(base + path)
    assert.equal(response.status, status, path)
    assert((await response.text()).toLowerCase().includes(phrase.toLowerCase()), path)
    console.log(path, status)
  }
  const answers = Object.fromEntries(Array.from({ length: 50 }, (_, index) => [index + 1, 3]))
  const response = await fetch(base + '/api/prism-score', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ answers }) })
  assert.equal(response.status, 200)
  const score = await response.json()
  assert.equal(score.saved, false)
  const denied = await fetch(base + '/api/candidates/status', { method: 'POST', headers: { 'content-type': 'application/json', origin: base }, body: JSON.stringify({ id: 'demo', status: 'hired' }) })
  assert.equal(denied.status, 403)
  assert.equal((await denied.json()).error, 'Administrator access required')
  const report = await fetch(base + '/api/prism-report', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scores: { architect: 60, integrator: 60, designer: 60, educator: 60, consultant: 60 }, primaryRole: 'architect', secondaryRole: 'integrator' }) })
  assert.equal(report.status, 200)
  assert.equal((await report.json()).source, 'guided')
  console.log('Guest score/report and unauthorized mutation smoke checks passed')
})().catch(error => { console.error(error); process.exitCode = 1 }).finally(() => server.kill())
