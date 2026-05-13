import { GoogleGenerativeAI } from "@google/generative-ai";
import { MathEngineResult } from "./math-engine";

export interface LLMEngineInput {
  tool: string;       // display name e.g. "Cursor"
  toolKey: string;    // pricing key e.g. "cursor"
  plan: string;       // plan display name e.g. "Business"
  teamSize: number;
  tasks: string;      // user-described usage context
  mathResults: MathEngineResult;
}

export interface LLMEngineResult {
  recommendation: string;          // hero verdict from math engine
  savingsReason: string;           // full findings string (all active cases)
  additionalMonthlySavings: number; // Case 5 cross-vendor savings (if any)
  summary: string;                  // ~100-word AI-generated paragraph
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Build a flat, pipe-separated findings string from all active cases.
 * Strips the arrow-format prefix so Gemini gets clean prose inputs.
 */
function buildFindings(mathResults: MathEngineResult): string {
  return Object.entries(mathResults.cases)
    .filter(([, c]) => c.active && c.message.length > 0)
    .map(([, c]) => {
      // Extract just the "Reason:" portion for LLM input — cleaner signal
      const reasonMatch = c.message.match(/Reason:\s*([\s\S]+)$/);
      return reasonMatch
        ? reasonMatch[1].trim()
        : c.message;
    })
    .join(" | ");
}

/**
 * Contextual signal flags derived from user's task description.
 * Used to enrich the LLM prompt without hallucinating numbers.
 */
function deriveContextFlags(tasks: string, plan: string, teamSize: number) {
  const t = tasks.toLowerCase();
  const p = plan.toLowerCase();
  return {
    isRedundant:      t.includes("redundancy") || t.includes("overlap"),
    hasFeatureOverlap: (t.includes("basic") || t.includes("simple")) && (p.includes("enterprise") || p.includes("ultra")),
    canDownscale:     teamSize > 10 && (t.includes("light") || t.includes("occasional")),
    needsEnterprise:  t.includes("security") || t.includes("compliance") || t.includes("sso") || t.includes("audit log"),
    isHighGrowth:     t.includes("growing") || t.includes("scaling") || t.includes("hiring"),
  };
}

/**
 * Assemble the full context reasoning string that feeds both the LLM
 * and the savingsReason field in the output.
 */
function buildFullReasons(
  findings: string,
  flags: ReturnType<typeof deriveContextFlags>,
  plan: string,
  teamSize: number
): string {
  const parts = [findings];

  if (flags.isRedundant)
    parts.push("Stack redundancy detected: you are likely paying for overlapping features across multiple tools in your current stack.");
  if (flags.hasFeatureOverlap)
    parts.push(`Feature over-provisioning: the ${plan} tier includes advanced administrative controls (SSO, audit logs, org-wide policies) that are unnecessary for your described use case.`);
  if (flags.canDownscale)
    parts.push(`Efficiency opportunity: with ${teamSize} seats at light usage, a meaningful portion of your team may not require full licensed access — consider a mixed-tier rollout.`);
  if (flags.needsEnterprise)
    parts.push("Compliance justification: your security or compliance requirements validate the current plan tier. Cost reduction options are limited without a scope change.");
  if (flags.isHighGrowth)
    parts.push("Growth note: if team size is expected to grow significantly in the next 6 months, an annual commitment now may lock in current per-seat rates before a potential price increase.");

  return parts.filter(Boolean).join(" | ");
}

// ---------------------------------------------------------------------------
// PROMPT — full version stored in PROMPTS.md
// ---------------------------------------------------------------------------

function buildGeminiPrompt(
  tool: string,
  plan: string,
  teamSize: number,
  actualSpend: number,
  totalSavingsMonthly: number,
  reasons: string,
  tasks: string
): string {
  const annualSpend = actualSpend * 12;
  const annualSavings = totalSavingsMonthly * 12;

  return `You are a Senior CFO advising a company on SaaS spend efficiency.
Write a single professional paragraph of 90–110 words summarizing the audit below.

Rules:
- Use ONLY the figures provided. Do not round, invent, or add numbers.
- Do not use bullet points, headers, or lists.
- Do not use emojis.
- Reference the tool name, plan, and team size at least once.
- If savings are zero, be honest and affirming — do not manufacture urgency.
- End with a single, clear next-step recommendation.

<audit>
  <tool>${tool}</tool>
  <plan>${plan}</plan>
  <team_size>${teamSize} seats</team_size>
  <monthly_spend>$${actualSpend.toFixed(2)}</monthly_spend>
  <annual_spend>$${annualSpend.toFixed(2)}</annual_spend>
  <monthly_savings_identified>$${totalSavingsMonthly.toFixed(2)}</monthly_savings_identified>
  <annual_savings_identified>$${annualSavings.toFixed(2)}</annual_savings_identified>
  <findings>${reasons}</findings>
  <usage_context>${tasks}</usage_context>
</audit>

Write the summary paragraph now:`;
}

// ---------------------------------------------------------------------------
// FALLBACK SUMMARY — always ~100 words, handles both savings and no-savings cases
// ---------------------------------------------------------------------------

function buildFallbackSummary(
  tool: string,
  plan: string,
  teamSize: number,
  actualSpend: number,
  totalSavingsMonthly: number,
  reasons: string,
  tasks: string
): string {
  const annualSavings = (totalSavingsMonthly * 12).toFixed(2);
  const hasSavings = totalSavingsMonthly > 0;
  const primaryFinding = reasons.split(" | ")[0]?.replace(/^\[CASE\d\]\s*/i, "").trim() || "";

  if (hasSavings) {
    return (
      `Our audit of your ${tool} ${plan} subscription — ${teamSize} seats at $${actualSpend.toFixed(2)}/month — ` +
      `identified $${annualSavings} in potential annual savings. ` +
      `${primaryFinding ? `The primary opportunity is: ${primaryFinding}. ` : ""}` +
      `Given your team's focus on ${tasks}, we recommend addressing the highest-impact item before your next renewal. ` +
      `Locking in changes at renewal avoids mid-cycle repricing penalties and maximizes annualized benefit.`
    );
  } else {
    const growthThreshold = Math.ceil(teamSize * 1.3);
    return (
      `Our audit of your ${tool} ${plan} subscription — ${teamSize} seats at $${actualSpend.toFixed(2)}/month — ` +
      `found no obvious financial waste. Your plan aligns well with your team size and described usage pattern (${tasks}). ` +
      `No immediate action is required. We recommend revisiting this audit if your team grows beyond ${growthThreshold} seats, ` +
      `your usage pattern shifts materially, or a new vendor tier becomes available. ` +
      `You are currently spending efficiently.`
    );
  }
}

// ---------------------------------------------------------------------------
// MAIN ENGINE
// ---------------------------------------------------------------------------

export async function runLLMEngine(input: LLMEngineInput): Promise<LLMEngineResult> {
  const { tool, plan, teamSize, tasks, mathResults } = input;
  const actualSpend = mathResults.declaredBilling;

  // Build structured findings from math engine output
  const findings = buildFindings(mathResults);

  // Derive contextual flags from user-provided task description
  const flags = deriveContextFlags(tasks, plan, teamSize);

  // Full reasoning string — feeds both LLM and the savingsReason output field
  const fullReasons = buildFullReasons(findings, flags, plan, teamSize);

  // Case 5 (alternative tool) savings surface as "additional" savings —
  // they require vendor switching, so they're reported separately
  const case5Savings = mathResults.cases.case5?.savingsMonthly ?? 0;

  // -------------------------------------------------------------------------
  // AI SUMMARY — Gemini with structured prompt, graceful fallback
  // -------------------------------------------------------------------------
  let summary = "";

  try {
    const apiKey = process.env.GOOGLE_AI_KEY;
    if (!apiKey) throw new Error("GOOGLE_AI_KEY environment variable is not set.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = buildGeminiPrompt(
      tool,
      plan,
      teamSize,
      actualSpend,
      mathResults.totalSavingsMonthly,
      fullReasons,
      tasks
    );

    const geminiResult = await model.generateContent(prompt);
    const raw = geminiResult.response.text().trim();

    // Sanity check: reject if Gemini returns something too short or clearly broken
    if (raw.length < 50) throw new Error("Gemini response too short — using fallback.");

    summary = raw;

  } catch (error) {
    // Log for observability but never surface to user
    console.error("[LLMEngine] Gemini call failed, using fallback summary:", error);

    summary = buildFallbackSummary(
      tool,
      plan,
      teamSize,
      actualSpend,
      mathResults.totalSavingsMonthly,
      fullReasons,
      tasks
    );
  }

  return {
    recommendation: mathResults.heroVerdict,
    savingsReason: fullReasons,
    additionalMonthlySavings: case5Savings,
    summary,
  };
}