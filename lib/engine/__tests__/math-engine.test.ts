import test from 'node:test';
import assert from 'node:assert';
import { runMathEngine } from '../math-engine.js';

test('Test 1: Optimized Spend (Zero Savings)', () => {
  const input = {
    toolKey: 'windsurf',
    planKey: 'pro',
    teamSize: 10,
    declaredBilling: 200,
    actualBilling: 200
  };

  const result = runMathEngine(input);
  assert.strictEqual(result.expectedBilling, 200);
  assert.strictEqual(result.totalSavingsMonthly, 0);
  assert.strictEqual(result.cases.case1.active, false);
});

test('Test 2: Billing Discrepancy (Overpayment)', () => {
  const input = {
    toolKey: 'windsurf',
    planKey: 'pro',
    teamSize: 10,
    declaredBilling: 300,
    actualBilling: 300
  };

  const result = runMathEngine(input);
  assert.strictEqual(result.expectedBilling, 200);
  assert.strictEqual(result.totalSavingsMonthly, 100);
  assert.strictEqual(result.cases.case1.active, true);
});

test('Test 3: Plan Downgrade (Over-provisioning)', () => {
  const input = {
    toolKey: 'claude',
    planKey: 'max', // $100/user
    teamSize: 5,
    declaredBilling: 500,
    actualBilling: 500
  };

  const result = runMathEngine(input);
  // Claude has 'team' plan at $30/user. 5 * 30 = $150.
  // Saving = $500 - $150 = $350.
  assert.strictEqual(result.cases.case2.active, true);
  assert.ok(result.totalSavingsMonthly >= 350);
});

test('Test 4: Annual Billing Arbitrage', () => {
  const input = {
    toolKey: 'github_copilot',
    planKey: 'pro',
    teamSize: 10,
    declaredBilling: 100, // Matching list price
    actualBilling: 100
  };

  const result = runMathEngine(input);
  // Copilot has ~21% annual discount in data.
  assert.strictEqual(result.cases.case3.active, true);
  assert.ok(result.totalSavingsMonthly > 0);
});

test('Test 5: Alternative Tool Recommendation', () => {
  const input = {
    toolKey: 'cursor',
    planKey: 'pro',
    teamSize: 10, // Small team to avoid Case 4 (API switch)
    declaredBilling: 200,
    actualBilling: 200
  };

  const result = runMathEngine(input);
  // Cursor has GitHub Copilot as alternative ($20 vs $10/seat)
  // Saving = $200 - $100 = $100 (50% saving > 20% threshold)
  assert.strictEqual(result.cases.case5.active, true);
  assert.strictEqual(result.cases.case5.savingsMonthly, 100);
});
