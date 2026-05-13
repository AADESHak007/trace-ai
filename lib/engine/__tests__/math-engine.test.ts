import test from 'node:test';
import assert from 'node:assert';
import { runMathEngine } from '../math-engine.js';

test('Math Engine: Calculates correct expected billing for per_user plans', () => {
  const input = {
    toolKey: 'windsurf', // Windsurf has no alternatives or annual discount in data
    planKey: 'pro',
    teamSize: 10,
    declaredBilling: 200,
    actualBilling: 200
  };

  const result = runMathEngine(input);
  
  // 10 users * $20/user = $200
  assert.strictEqual(result.expectedBilling, 200);
  assert.strictEqual(result.totalSavingsMonthly, 0);
});

test('Math Engine: Detects overpayment discrepancy', () => {
  const input = {
    toolKey: 'windsurf',
    planKey: 'pro',
    teamSize: 10,
    declaredBilling: 300,
    actualBilling: 300
  };

  const result = runMathEngine(input);
  
  // 10 users * $20/user = $200. Paid $300. Saving = $100.
  assert.strictEqual(result.expectedBilling, 200);
  assert.strictEqual(result.totalSavingsMonthly, 100);
  assert.strictEqual(result.cases.case1.active, true);
});
