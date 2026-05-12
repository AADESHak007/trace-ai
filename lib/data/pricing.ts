export type PricingType = "per_user" | "flat_rate" | "usage_based";

export interface PlanPricing {
  price: number;
  type: PricingType;
  interval: "monthly" | "annual";
  inputPrice?: number; // for usage_based (per 1M tokens)
  outputPrice?: number; // for usage_based (per 1M tokens)
}

export interface ToolPricing {
  name: string;
  plans: Record<string, PlanPricing>;
  source: string;
  lastVerified: string;
}

/**
 * GROUND TRUTH PRICING DATA
 * This object is used by the Audit Engine to calculate potential savings.
 * All prices are in USD.
 */
export const TOOL_PRICING: Record<string, ToolPricing> = {
  cursor: {
    name: "Cursor",
    plans: {
      hobby: { price: 0, type: "flat_rate", interval: "monthly" },
      pro: { price: 20, type: "per_user", interval: "monthly" },
      pro_plus: { price: 60, type: "per_user", interval: "monthly" },
      ultra: { price: 200, type: "per_user", interval: "monthly" },
      business: { price: 40, type: "per_user", interval: "monthly" },
    },
    source: "https://www.cursor.com/pricing",
    lastVerified: "2026-05-10",
  },
  github_copilot: {
    name: "GitHub Copilot",
    plans: {
      free: { price: 0, type: "flat_rate", interval: "monthly" },
      pro: { price: 10, type: "per_user", interval: "monthly" },
      pro_plus: { price: 39, type: "per_user", interval: "monthly" },
      business: { price: 19, type: "per_user", interval: "monthly" },
      enterprise: { price: 39, type: "per_user", interval: "monthly" },
    },
    source: "https://github.com/features/copilot/plans",
    lastVerified: "2026-05-10",
  },
  claude: {
    name: "Claude",
    plans: {
      free: { price: 0, type: "flat_rate", interval: "monthly" },
      pro: { price: 20, type: "per_user", interval: "monthly" },
      max: { price: 100, type: "per_user", interval: "monthly" },
      team: { price: 30, type: "per_user", interval: "monthly" },
    },
    source: "https://claude.ai/pricing",
    lastVerified: "2026-05-10",
  },
  chatgpt: {
    name: "ChatGPT",
    plans: {
      free: { price: 0, type: "flat_rate", interval: "monthly" },
      plus: { price: 20, type: "flat_rate", interval: "monthly" },
      team: { price: 25, type: "per_user", interval: "monthly" },
    },
    source: "https://chatgpt.com/pricing/",
    lastVerified: "2026-05-10",
  },
  anthropic_api: {
    name: "Anthropic API",
    plans: {
      opus: { price: 0, type: "usage_based", interval: "monthly", inputPrice: 5.0, outputPrice: 25.0 },
      sonnet: { price: 0, type: "usage_based", interval: "monthly", inputPrice: 3.0, outputPrice: 15.0 },
      haiku: { price: 0, type: "usage_based", interval: "monthly", inputPrice: 1.0, outputPrice: 5.0 },
    },
    source: "https://claude.com/pricing#api",
    lastVerified: "2026-05-10",
  },
  openai_api: {
    name: "OpenAI API",
    plans: {
      gpt55: { price: 0, type: "usage_based", interval: "monthly", inputPrice: 5.0, outputPrice: 30.0 },
      gpt54: { price: 0, type: "usage_based", interval: "monthly", inputPrice: 2.5, outputPrice: 15.0 },
      gpt54mini: { price: 0, type: "usage_based", interval: "monthly", inputPrice: 0.75, outputPrice: 4.5 },
    },
    source: "https://openai.com/api/pricing/",
    lastVerified: "2026-05-10",
  },
  gemini: {
    name: "Google Gemini",
    plans: {
      free: { price: 0, type: "flat_rate", interval: "monthly" },
      ai_plus: { price: 10, type: "flat_rate", interval: "monthly" },
      ai_pro: { price: 20, type: "flat_rate", interval: "monthly" },
      ai_ultra: { price: 30, type: "flat_rate", interval: "monthly" },
    },
    source: "https://gemini.google/subscriptions/",
    lastVerified: "2026-05-10",
  },
  windsurf: {
    name: "Windsurf",
    plans: {
      free: { price: 0, type: "flat_rate", interval: "monthly" },
      pro: { price: 20, type: "per_user", interval: "monthly" },
      max: { price: 200, type: "per_user", interval: "monthly" },
    },
    source: "https://windsurf.com/pricing",
    lastVerified: "2026-05-10",
  },
};

/**
 * ANNUAL BILLING DISCOUNTS
 * Percentage savings when switching from monthly to annual billing.
 */
export const TOOL_ANNUAL_DISCOUNTS: Record<string, number> = {
  cursor: 0,           // No annual discount currently
  claude: 0,           // No annual billing toggle currently
  github_copilot: 0.21, // ~21% ($10/mo vs $7.92/mo)
  chatgpt: 0.20,       // Estimated 20% for Plus/Team
  gemini: 0.15,        // Estimated
  windsurf: 0,
};

/**
 * COMPETITOR ALTERNATIVES
 * Used for Case 5 recommendations.
 */
export const TOOL_ALTERNATIVES: Record<string, { toolKey: string; reason: string }[]> = {
  cursor: [
    { toolKey: "github_copilot", reason: "Similar AI code completion, lower per-seat cost at team scale" },
    { toolKey: "windsurf",        reason: "Comparable agentic coding features at identical price point" },
  ],
  chatgpt: [
    { toolKey: "claude",  reason: "Comparable general-purpose LLM capability" },
    { toolKey: "gemini",  reason: "Lower cost at flat-rate plans for individual users" },
  ],
  claude: [
    { toolKey: "chatgpt", reason: "Market-leading multimodal capabilities" },
    { toolKey: "gemini",  reason: "Deeper integration with Google Workspace" },
  ],
};
