import { MathEngineResult } from "./math-engine";

export interface LLMEngineInput {
  tool: string;
  plan: string;
  teamSize: number;
  tasks: string;
  mathResults: MathEngineResult;
}

export interface LLMEngineResult {
  recommendation: string;
  savingsReason: string;
  additionalMonthlySavings: number;
}

export async function runLLMEngine(input: LLMEngineInput): Promise<LLMEngineResult> {
  const { tool, plan, teamSize, tasks, mathResults } = input;
  
  // CASE 5 ...
  // Re-evaluating alternative tools based on task context
  const hasAlternative = Object.values(mathResults.cases).some(c => c.active && c.savingsMonthly > 0);
  
  // CASE 6 ...
  // Stack consolidation check for redundant tools
  const isRedundant = tasks.toLowerCase().includes("overlap") || tasks.toLowerCase().includes("also use");
  
  // CASE 7 ...
  // Feature overlap analysis
  const hasFeatureOverlap = tasks.toLowerCase().includes("basic") && plan.toLowerCase().includes("enterprise");
  
  // CASE 8 ...
  // Training vs Downscaling analysis
  const canDownscale = teamSize > 10 && tasks.toLowerCase().includes("light");
  
  // CASE 9 ...
  // Compliance and enterprise tier validation
  const needsEnterprise = tasks.toLowerCase().includes("security") || tasks.toLowerCase().includes("compliance");

  // Constructing the strategy based on LLM logic
  let strategy = mathResults.heroVerdict;
  let reasons = Object.values(mathResults.cases)
    .filter(c => c.active)
    .map(c => c.message)
    .join(" | ");

  if (isRedundant) {
    reasons += " | Potential stack redundancy detected. You are likely paying for overlapping features across multiple tools.";
  }
  
  if (hasFeatureOverlap) {
    reasons += " | Feature Overlap. You are using an Enterprise-tier plan for basic tasks that don't require advanced administrative overhead.";
  }

  if (canDownscale) {
    reasons += " | Efficiency Opportunity. Based on your light usage pattern, a significant portion of your team could transition to a lower-cost tier.";
  }

  if (needsEnterprise) {
    reasons += " | Compliance Match. Your use of the tool for security/compliance tasks justifies your current high-tier spend—protect this configuration.";
  }

  return {
    recommendation: strategy,
    savingsReason: reasons,
    additionalMonthlySavings: 0
  };
}
