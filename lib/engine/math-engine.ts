import { TOOL_PRICING, TOOL_ALTERNATIVES, TOOL_ANNUAL_DISCOUNTS } from "../data/pricing";

export interface MathEngineInput {
  toolKey: string;
  planKey: string;
  teamSize: number;
  declaredBilling: number;  // monthly (fallback if actualBilling not provided)
  actualBilling?: number;   // what they actually pay per month
  planPricing?: number;     // override price per unit (optional)
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
    case1: CaseResult; // Billing discrepancy (overpaying vs list price)
    case2: CaseResult; // Over-provisioning (cheaper plan from same vendor)
    case3: CaseResult; // Annual billing arbitrage (real per-tool discount)
    case4: CaseResult; // API vs subscription (token-based estimate)
    case5: CaseResult; // Alternative tool recommendation (cross-vendor)
  };

  totalSavingsMonthly: number;
  heroVerdict: string;
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Calculate the monthly cost of a plan for a given team size.
 * Returns Infinity for unknown plan types so they never win a min() comparison.
 */
function planCost(planKey: string, toolKey: string, teamSize: number): number {
  const tool = TOOL_PRICING[toolKey];
  if (!tool) return Infinity;
  const plan = tool.plans[planKey];
  if (!plan) return Infinity;

  if (plan.type === "per_user") return plan.price * teamSize;
  if (plan.type === "flat_rate") return plan.price;
  return Infinity; // usage_based plans can't be compared without token data
}

/**
 * Estimate monthly API cost from token-based pricing.
 * Token assumptions (documented in PRICING_DATA.md):
 *   light  → 300K input  + 50K output  tokens/user/month
 *   medium → 800K input  + 150K output tokens/user/month
 *   heavy  → 2M   input  + 500K output tokens/user/month
 * Prices are per 1M tokens.
 */
function estimateApiCost(
  toolKey: string,
  planKey: string,
  teamSize: number,
  usagePattern: "light" | "medium" | "heavy"
): number {
  const tool = TOOL_PRICING[toolKey];
  if (!tool) return Infinity;
  const plan = tool.plans[planKey];
  if (!plan || plan.type !== "usage_based") return Infinity;
  if (plan.inputPrice === undefined || plan.outputPrice === undefined) return Infinity;

  const TOKEN_ASSUMPTIONS = {
    light:  { inputM: 0.3,  outputM: 0.05  },
    medium: { inputM: 0.8,  outputM: 0.15  },
    heavy:  { inputM: 2.0,  outputM: 0.5   },
  };

  const { inputM, outputM } = TOKEN_ASSUMPTIONS[usagePattern];
  const costPerUser = (plan.inputPrice * inputM) + (plan.outputPrice * outputM);
  return costPerUser * teamSize;
}

// ---------------------------------------------------------------------------
// MAIN ENGINE
// ---------------------------------------------------------------------------

export function runMathEngine(input: MathEngineInput): MathEngineResult {
  const {
    toolKey,
    planKey,
    teamSize,
    declaredBilling,
    actualBilling,
    planPricing,
    usagePattern = "medium",
  } = input;

  const tool = TOOL_PRICING[toolKey];
  const actualSpend = actualBilling ?? declaredBilling;

  // Default empty result
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
      case5: { active: false, message: "", savingsMonthly: 0 },
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

  // --- Expected billing from pricing data ---
  let expectedBilling = 0;
  if (plan.type === "per_user") {
    expectedBilling = teamSize * unitPrice;
  } else if (plan.type === "flat_rate") {
    expectedBilling = unitPrice;
  } else if (plan.type === "usage_based") {
    // For usage_based plans entered directly, derive from token estimate
    const estimated = estimateApiCost(toolKey, planKey, teamSize, usagePattern);
    expectedBilling = estimated < Infinity ? estimated : actualSpend;
  }
  result.expectedBilling = expectedBilling;

  let foundActionableSavings = false;
  let totalSavings = 0;

  // -------------------------------------------------------------------------
  // CASE 1: Billing discrepancy — are they paying more or less than list price?
  // -------------------------------------------------------------------------
  const delta = expectedBilling - actualSpend;
  const deltaPct = expectedBilling > 0 ? delta / expectedBilling : 0;

  if (deltaPct < -0.05) {
    // Paying MORE than list price → billing error or unknown add-ons
    const overpayment = actualSpend - expectedBilling;
    result.cases.case1 = {
      active: true,
      savingsMonthly: overpayment,
      message:
        `$${actualSpend.toFixed(2)}/mo actual spend \u2192 Investigate Billing \u2192 $${overpayment.toFixed(2)}/mo potential savings. ` +
        `Reason: Your spend exceeds the standard list price of $${expectedBilling.toFixed(2)}/mo ` +
        `for ${teamSize} seats on the ${planKey} plan (source: ${tool.source}). ` +
        `Review your invoice for unknown add-ons, legacy overages, or billing errors.`,
    };
    totalSavings += overpayment;
    foundActionableSavings = true;

  } else if (deltaPct > 0.05) {
    // Paying LESS than list price → grandfathered or negotiated rate
    const discount = expectedBilling - actualSpend;
    result.cases.case1 = {
      active: true,
      savingsMonthly: 0, // already saving — no additional savings to capture
      message:
        `$${actualSpend}/mo actual spend → Maintain Current Plan → $0 additional savings. ` +
        `Reason: You are paying $${discount.toFixed(2)}/mo less than the current list price of ` +
        `$${expectedBilling.toFixed(2)}/mo. This indicates a grandfathered or negotiated rate. ` +
        `Do not upgrade, downgrade, or renegotiate — any plan change will reprice you to current rates.`,
    };
    // Not flagging as foundActionableSavings — this is informational only
  }

  // Gates for downstream cases
  const isOverpayingOrClean = deltaPct <= 0.05;   // not on a discount — eligible for optimization
  const isClean = Math.abs(deltaPct) <= 0.05;      // paying close to list price

  // -------------------------------------------------------------------------
  // CASE 2: Over-provisioning — is there a cheaper plan from the same vendor?
  // Scan ALL plans in pricing data; pick the cheapest one that costs less than
  // actual spend. No team-size heuristics — let the numbers decide.
  // -------------------------------------------------------------------------
  if (!foundActionableSavings && isOverpayingOrClean) {
    const cheaperEntries = Object.entries(tool.plans)
      .filter(([key, p]) => key !== planKey && p.price > 0) // exclude current and free/hobby plans
      .map(([key, p]) => {
        const cost =
          p.type === "per_user" ? p.price * teamSize :
          p.type === "flat_rate" ? p.price :
          Infinity;
        return { key, cost };
      })
      .filter(({ cost }) => cost < actualSpend && cost < Infinity)
      .sort((a, b) => a.cost - b.cost); // ascending: cheapest first

    if (cheaperEntries.length > 0) {
      const best = cheaperEntries[0];
      const savings = actualSpend - best.cost;

      // Only flag if savings are material (>5% of spend) — avoids noise
      if (savings / actualSpend > 0.05) {
        result.cases.case2 = {
          active: true,
          savingsMonthly: savings,
          message:
            `$${actualSpend}/mo spend → Downgrade to ${tool.name} ${best.key} plan → ` +
            `$${savings.toFixed(2)}/mo savings ($${(savings * 12).toFixed(2)}/yr). ` +
            `Reason: The ${best.key} plan costs $${best.cost.toFixed(2)}/mo for ${teamSize} seats — ` +
            `$${savings.toFixed(2)} less than your current ${planKey} plan — and covers the same core functionality ` +
            `unless you specifically require ${planKey}-exclusive features (source: ${tool.source}).`,
        };
        totalSavings += savings;
        foundActionableSavings = true;
      }
    }
  }

  // -------------------------------------------------------------------------
  // CASE 3: Annual billing arbitrage — switch to annual if vendor offers a discount.
  // Uses real per-tool discount from TOOL_ANNUAL_DISCOUNTS — no flat 20% assumption.
  // -------------------------------------------------------------------------
  if (!foundActionableSavings && isClean && expectedBilling > 0) {
    const annualDiscount = TOOL_ANNUAL_DISCOUNTS[toolKey] ?? 0;

    if (annualDiscount > 0) {
      const savings = actualSpend * annualDiscount;
      const discountPct = Math.round(annualDiscount * 100);
      result.cases.case3 = {
        active: true,
        savingsMonthly: savings,
        message:
          `$${actualSpend}/mo spend → Switch to Annual Billing → $${savings.toFixed(2)}/mo savings ` +
          `($${(savings * 12).toFixed(2)}/yr). ` +
          `Reason: ${tool.name} offers a verified ${discountPct}% discount for annual commitment ` +
          `(source: ${tool.source}). You are currently billed monthly at list price.`,
      };
      totalSavings += savings;
      foundActionableSavings = true;

    } else {
      // Vendor offers no annual discount — don't manufacture savings
      // Case 3 stays inactive; engine moves to Case 4
    }
  }

  // -------------------------------------------------------------------------
  // CASE 4: API vs subscription — for large teams with light/medium usage,
  // token-based API billing may be cheaper than per-seat subscriptions.
  // Token assumptions documented in PRICING_DATA.md.
  // Only applies to tools that have a known API equivalent.
  // -------------------------------------------------------------------------
  if (!foundActionableSavings && teamSize > 15 && plan.type === "per_user") {
    if (usagePattern === "light" || usagePattern === "medium") {

      // Find the cheapest API tool that's a known equivalent for this tool
      const API_EQUIVALENTS: Record<string, { toolKey: string; planKey: string; label: string }> = {
        claude:     { toolKey: "anthropic_api", planKey: "haiku",    label: "Anthropic API (Haiku)" },
        chatgpt:    { toolKey: "openai_api",    planKey: "gpt54mini", label: "OpenAI API (GPT-4o mini)" },
        cursor:     { toolKey: "anthropic_api", planKey: "sonnet",   label: "Anthropic API (Sonnet)" },
        github_copilot: { toolKey: "openai_api", planKey: "gpt54mini", label: "OpenAI API (GPT-4o mini)" },
      };

      const apiEquiv = API_EQUIVALENTS[toolKey];
      if (apiEquiv) {
        const apiEst = estimateApiCost(apiEquiv.toolKey, apiEquiv.planKey, teamSize, usagePattern);
        if (apiEst < Infinity) {
          const savings = actualSpend - apiEst;
          if (savings > 0 && savings / actualSpend > 0.20) {
            // Only flag if >20% cheaper — switching vendors has real migration cost
            result.cases.case4 = {
              active: true,
              savingsMonthly: savings,
              message:
                `$${actualSpend}/mo spend → Switch to ${apiEquiv.label} → ` +
                `~$${savings.toFixed(2)}/mo savings (~$${(savings * 12).toFixed(2)}/yr). ` +
                `Reason: At ${usagePattern} usage (~${usagePattern === "light" ? "300K input / 50K output" : "800K input / 150K output"} ` +
                `tokens/user/month), ${teamSize} seats on a token-based API costs an estimated ` +
                `$${apiEst.toFixed(2)}/mo vs your current $${actualSpend}/mo fixed subscription. ` +
                `Token assumptions documented in PRICING_DATA.md. Validate against your actual usage logs before switching.`,
            };
            totalSavings += savings;
            foundActionableSavings = true;
          }
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // CASE 5: Alternative tool — is there a substantially cheaper vendor with
  // equivalent capability? Only fires if savings > 20% of current spend.
  // Cross-vendor map defined in pricing.ts → TOOL_ALTERNATIVES.
  // -------------------------------------------------------------------------
  if (!foundActionableSavings) {
    const alternatives = TOOL_ALTERNATIVES[toolKey] ?? [];

    let bestAlt: { toolKey: string; cost: number; reason: string; planKey: string } | null = null;

    for (const alt of alternatives) {
      const altTool = TOOL_PRICING[alt.toolKey];
      if (!altTool) continue;

      // Find cheapest paid plan from the alternative tool for this team size
      const cheapestPaid = Object.entries(altTool.plans)
        .map(([key, p]) => ({
          key,
          cost:
            p.type === "per_user" ? p.price * teamSize :
            p.type === "flat_rate" ? p.price :
            Infinity,
        }))
        .filter(({ cost }) => cost > 0 && cost < Infinity) // exclude free & usage_based
        .sort((a, b) => a.cost - b.cost)[0];

      if (!cheapestPaid) continue;

      const savingsPct = (actualSpend - cheapestPaid.cost) / actualSpend;
      if (savingsPct > 0.20 && cheapestPaid.cost < actualSpend) {
        if (!bestAlt || cheapestPaid.cost < bestAlt.cost) {
          bestAlt = {
            toolKey: alt.toolKey,
            cost: cheapestPaid.cost,
            reason: alt.reason,
            planKey: cheapestPaid.key,
          };
        }
      }
    }

    if (bestAlt) {
      const altTool = TOOL_PRICING[bestAlt.toolKey]!;
      const savings = actualSpend - bestAlt.cost;
      result.cases.case5 = {
        active: true,
        savingsMonthly: savings,
        message:
          `$${actualSpend}/mo spend → Switch to ${altTool.name} (${bestAlt.planKey} plan) → ` +
          `$${savings.toFixed(2)}/mo savings ($${(savings * 12).toFixed(2)}/yr). ` +
          `Reason: ${bestAlt.reason}. ` +
          `${altTool.name} ${bestAlt.planKey} costs $${bestAlt.cost.toFixed(2)}/mo for ${teamSize} seats ` +
          `(source: ${altTool.source}). Migration effort should be weighed against annualized savings.`,
      };
      totalSavings += savings;
      // Note: Case 5 always runs independently — it's additive cross-vendor insight,
      // not blocked by foundActionableSavings, so we don't set that flag here.
    }
  }

  // -------------------------------------------------------------------------
  // HERO VERDICT
  // -------------------------------------------------------------------------
  result.totalSavingsMonthly = totalSavings;

  if (totalSavings > 500) {
    result.heroVerdict =
      `Significant optimization opportunity identified. You can save $${totalSavings.toFixed(2)}/mo ` +
      `($${(totalSavings * 12).toFixed(2)}/yr). Surface Credex prominently as the vehicle to capture these savings.`;
  } else if (totalSavings >= 100) {
    result.heroVerdict =
      `Solid savings identified. You can save $${totalSavings.toFixed(2)}/mo ($${(totalSavings * 12).toFixed(2)}/yr).`;
  } else if (totalSavings > 0) {
    result.heroVerdict =
      `Minor optimizations found. You can save $${totalSavings.toFixed(2)}/mo ($${(totalSavings * 12).toFixed(2)}/yr).`;
  } else {
    result.heroVerdict =
      `You're spending well — no obvious financial waste found on ${tool.name} ${planKey}.`;
  }

  return result;
}