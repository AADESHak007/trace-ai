import { TOOL_PRICING, } from "../data/pricing";

export interface MathEngineInput {
  toolKey: string;
  planKey: string;
  teamSize: number;
  declaredBilling: number; // monthly (fallback)
  actualBilling?: number;  // what they actually pay
  planPricing?: number;    // price per unit of the plan
  usagePattern?: "light" | "medium" | "heavy";
}

export interface CaseResult {
  active: boolean;
  message: string;
  savingsMonthly: number;
}

export interface MathEngineResult {
  toolKey: string;
  planKey: string;
  teamSize: number;
  declaredBilling: number;
  expectedBilling: number;
  
  cases: {
    case1: CaseResult;
    case2: CaseResult;
    case3: CaseResult;
    case4: CaseResult;
  };
  
  totalSavingsMonthly: number;
  heroVerdict: string;
}

// MATH ENGINE LOGIC ...

export function runMathEngine(input: MathEngineInput): MathEngineResult {
  const { toolKey, planKey, teamSize, declaredBilling, actualBilling, planPricing, usagePattern = "medium" } = input;
  const tool = TOOL_PRICING[toolKey];
  
  // The value we compare against...
  const actualSpend = actualBilling ?? declaredBilling;
  
  // Default empty result...
  const result: MathEngineResult = {
    toolKey,
    planKey,
    teamSize,
    declaredBilling: actualSpend,
    expectedBilling: 0,
    cases: {
      case1: { active: false, message: "", savingsMonthly: 0 },
      case2: { active: false, message: "", savingsMonthly: 0 },
      case3: { active: false, message: "", savingsMonthly: 0 },
      case4: { active: false, message: "", savingsMonthly: 0 },
    },
    totalSavingsMonthly: 0,
    heroVerdict: "",
  };

  if (!tool || !tool.plans[planKey]) {
    result.heroVerdict = "Invalid tool or plan specified.";
    return result;
  }

  const plan = tool.plans[planKey];
  const unitPrice = planPricing ?? plan.price;
  
  // Calculate expected billing
  let expectedBilling = 0;
  if (plan.type === "per_user") {
    expectedBilling = teamSize * unitPrice;
  } else if (plan.type === "flat_rate") {
    expectedBilling = unitPrice;
  } else if (plan.type === "usage_based") {
    // Basic estimation if they selected an API plan directly (rare for this form, but handled)
    expectedBilling = actualSpend > 0 ? actualSpend : teamSize * 5; 
  }
  result.expectedBilling = expectedBilling;

  // Track if we found an actionable savings step to respect the "stop at first actionable finding" rule
  let foundActionableSavings = false;
  let totalSavings = 0;

  // --- CASE 1: Expected vs Actual Discrepancy ---
  const delta = expectedBilling - actualSpend;
  const deltaPct = expectedBilling > 0 ? delta / expectedBilling : 0;
  
  if (deltaPct < -0.05) {
    // Overpaying (delta is negative, meaning declared > expected)
    const overpayment = declaredBilling - expectedBilling;
    result.cases.case1 = {
      active: true,
      savingsMonthly: overpayment,
      message: `You're paying $${actualSpend}/mo but expected $${expectedBilling}/mo for ${teamSize} seats on ${tool.name} ${planKey}. Likely cause: orphaned seats, hidden fees, or legacy pricing.`,
    };
    totalSavings += overpayment;
  } else if (deltaPct > 0.05) {
    // Underpaying
    result.cases.case1 = {
      active: true,
      savingsMonthly: 0,
      message: `You're paying $${actualSpend}/mo but expected $${expectedBilling}/mo for ${teamSize} seats on ${tool.name} ${planKey}. Likely cause: grandfathered plan or volume discount. Protect this plan!`,
    };
  } else {
    // Healthy
    result.cases.case1 = {
      active: false,
      savingsMonthly: 0,
      message: "Spend matches expected pricing exactly.",
    };
  }

  const isHealthyOrOverpaying = deltaPct <= 0.05;
  const isClean = Math.abs(deltaPct) <= 0.05;

  // --- CASE 2: Over-Provisioning (Plan Downgrade) ---
  if (!foundActionableSavings && isHealthyOrOverpaying) {
    let downgradePlanKey: string | null = null;
    
    // Logic for downgrades
    if (teamSize <= 3 && (planKey.includes("business") || planKey.includes("team") || planKey === "enterprise")) {
      // Find a "pro" or "plus" plan
      downgradePlanKey = Object.keys(tool.plans).find(k => k.includes("pro") || k.includes("plus")) || null;
    } else if (teamSize <= 1 && (planKey.includes("team") || planKey.includes("pro"))) {
      // Find a "free" or "hobby" plan
      downgradePlanKey = Object.keys(tool.plans).find(k => k.includes("free") || k.includes("hobby")) || null;
    }

    if (downgradePlanKey) {
      const lowerPlan = tool.plans[downgradePlanKey];
      const lowerPlanUnitPrice = planPricing ?? lowerPlan.price; // Use planPricing if provided, but this is for downgrades so might be tricky
      const lowerPlanCost = lowerPlan.type === "per_user" ? lowerPlan.price * teamSize : lowerPlan.price;
      const savings = actualSpend - lowerPlanCost;
      
      if (savings > 0) {
        result.cases.case2 = {
          active: true,
          savingsMonthly: savings,
          message: `At ${teamSize} seats, ${tool.name} ${planKey} gives you centralized features you may not need. Dropping to ${downgradePlanKey} saves $${savings}/mo — $${savings * 12}/yr.`,
        };
        totalSavings += savings;
        foundActionableSavings = true;
      }
    }
  }

  // --- CASE 3: Annual Billing Arbitrage ---
  if (!foundActionableSavings && isClean && expectedBilling > 0) {
    // If they are paying exactly the monthly expected rate
    if (Math.abs(actualSpend - expectedBilling) < 2) {
      const savings = actualSpend * 0.20; // 20% savings assumption
      result.cases.case3 = {
        active: true,
        savingsMonthly: savings,
        message: `You appear to be on monthly billing. Switching to annual saves ~20% — that's $${savings.toFixed(2)}/mo or $${(savings * 12).toFixed(2)}/yr at your current spend.`,
      };
      totalSavings += savings;
      foundActionableSavings = true;
    }
  }

  // --- CASE 4: API vs Subscription Threshold ---
  if (!foundActionableSavings && teamSize > 20) {
    if (usagePattern === "light" || usagePattern === "medium") {
      // Estimate API cost per user (e.g., $5/mo for light usage)
      const apiEstimatedCostPerUser = 5; 
      const apiEstimatedTotal = teamSize * apiEstimatedCostPerUser;
      const savings = actualSpend - apiEstimatedTotal;

      if (savings > 0) {
        result.cases.case4 = {
          active: true,
          savingsMonthly: savings,
          message: `At ${teamSize} developers on ${planKey} ($${actualSpend}/mo total), switching to API-based access at ~$${apiEstimatedCostPerUser}/user/mo saves ~$${savings}/mo. Only viable if usage is light — confirm with your team before switching.`,
        };
        totalSavings += savings;
        foundActionableSavings = true;
      }
    }
  }

  // Calculate final totals and hero string...
  result.totalSavingsMonthly = totalSavings;

  if (totalSavings > 500) {
    result.heroVerdict = `Massive optimization opportunity found. You can save $${totalSavings.toFixed(2)}/mo. Surface Credex prominently.`;
  } else if (totalSavings >= 100) {
    result.heroVerdict = `Solid savings identified. You can save $${totalSavings.toFixed(2)}/mo.`;
  } else if (totalSavings > 0) {
    result.heroVerdict = `Minor optimizations found ($${totalSavings.toFixed(2)}/mo).`;
  } else {
    result.heroVerdict = "You're spending well — no obvious financial waste found.";
  }

  return result;
}
