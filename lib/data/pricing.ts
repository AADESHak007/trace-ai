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
