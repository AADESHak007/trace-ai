# Automated Tests

This document lists the automated tests for the Trace AI Audit Engine. All tests are written using Node.js's built-in test runner and `tsx` for TypeScript support.

## Test Summary
- **Test File**: [lib/engine/__tests__/math-engine.test.ts](file:///c:/Users/91774/Desktop/trace-ai/lib/engine/__tests__/math-engine.test.ts)
- **Framework**: Node.js Test Runner + `assert`
- **Total Tests**: 5

## Test Coverage

| Test ID | Name | Coverage | Input Scenario |
| :--- | :--- | :--- | :--- |
| **Test 1** | Optimized Spend | Verifies that the engine reports $0 savings when the user is already on the correct list price and no other optimizations apply. | Windsurf Pro, 10 users, $200 spend. |
| **Test 2** | Billing Discrepancy | Verifies that the engine detects when a user is paying MORE than the standard list price (Case 1). | Windsurf Pro, 10 users, $300 spend ($100 overpayment). |
| **Test 3** | Plan Downgrade | Verifies that the engine suggests a cheaper plan from the same vendor (Case 2) when one is available. | Claude Max ($100/seat) → Claude Team ($30/seat). |
| **Test 4** | Annual Arbitrage | Verifies that the engine suggests switching to annual billing (Case 3) if the vendor offers a verified discount. | GitHub Copilot Pro (~21% discount available). |
| **Test 5** | Alternative Tool | Verifies that the engine recommends a cheaper competitor (Case 5) if the savings exceed the 20% threshold. | Cursor Pro ($20/seat) → GitHub Copilot ($10/seat). |

## How to Run Tests

### 1. Prerequisites
Ensure you have the project dependencies installed:
```bash
npm install
```

### 2. Run All Tests
Execute the following command to run the audit engine tests:
```bash
npm run test
```

### 3. CI/CD Integration
These tests are automatically executed on every push to the `main` branch via GitHub Actions. You can view the latest status in the **Actions** tab of the repository.
