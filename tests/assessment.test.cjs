const { test } = require('node:test')
const assert = require('node:assert/strict')
const ts = require('typescript')
const fs = require('node:fs')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename)
const { shuffleQuestionIds, sanitizeState } = require('../app/assessment/state.ts')
const { questions, QUESTION_COUNT } = require('../prism/questions.ts')
const ids = questions.map(question => question.id).sort((a, b) => a - b)

test('every seeded assessment contains every canonical question exactly once', () => {
  for (const seed of [0, -1, 2147483647, -2147483648, Date.now(), ...Array.from({ length: 1000 }, (_, i) => i)]) {
    const shuffled = shuffleQuestionIds(seed)
    assert.deepEqual([...shuffled].sort((a, b) => a - b), ids)
    assert.deepEqual(shuffleQuestionIds(seed), shuffled)
  }
})
test('resume preserves answers and stable question order, without trusting invalid values', () => {
  const randomizedQuestions = shuffleQuestionIds(42)
  const resumed = sanitizeState({ randomizedQuestions, answers: { 1: 5, 2: true, 3: '4', 4: 2.5, 5: 0, 6: 6, 999: 2, '07': 4 }, currentQuestionIndex: 12.8, completed: 'false' })
  assert.deepEqual(resumed.randomizedQuestions, randomizedQuestions)
  assert.deepEqual(resumed.answers, { 1: 5 })
  assert.equal(resumed.currentQuestionIndex, 12)
  assert.equal(resumed.completed, false)
})
test('malformed browser data recovers to a complete usable question sequence', () => {
  for (const raw of [null, false, [], 'invalid', {}, { randomizedQuestions: [1, 1, 999], currentQuestionIndex: -8 }]) {
    const state = sanitizeState(raw)
    assert.deepEqual([...state.randomizedQuestions].sort((a, b) => a - b), ids)
    assert.equal(state.currentQuestionIndex, 0)
    assert.equal(state.completed, false)
  }
  assert.equal(sanitizeState({ currentQuestionIndex: Infinity }).currentQuestionIndex, QUESTION_COUNT - 1)
  assert.equal(sanitizeState({ completed: true }).completed, true)
})
