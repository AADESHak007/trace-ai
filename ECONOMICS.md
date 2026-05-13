# ECONOMICS.md — Unit Economics
## SaaS Spend Audit Engine → Credex Revenue

All numbers are estimates with reasoning shown. Rough inputs beat no inputs.

---

## 1. What Is a Converted Lead Worth to Credex?

A "converted lead" = a company that runs an audit, books a consultation, and makes a credit purchase through Credex.

**Reasoning the LTV:**

The target customer is a Series A–B SaaS company, 25–150 employees, with $500–$5,000/mo in AI tool spend.

Credex captures value by routing that spend through credits instead of retail billing. Assume Credex earns a margin on credits — estimate 8–12% of spend routed, based on typical B2B procurement platform economics. Call it 10% for the model.

| Input | Estimate | Basis |
|---|---|---|
| Avg monthly AI tool spend per customer | $1,800/mo | ~30 seats × $60 avg blended per-seat cost (Cursor Pro, Claude Team, Copilot Business) |
| % of spend Credex can route via credits | 60% | Not all tools support credit purchase; conservative |
| Monthly spend routed through Credex | $1,080/mo | $1,800 × 60% |
| Credex margin on routed spend | 10% | Platform take rate estimate |
| Monthly revenue per customer | $108/mo | |
| Average customer retention | 18 months | Series A/B companies, moderate churn |
| **LTV per converted customer** | **$1,944** | $108 × 18 |

Round to **$2,000 LTV** per converted customer. This is conservative — a company that scales from 30 to 80 seats over 18 months grows the routed spend without Credex doing more work.

---

## 2. CAC by Channel

**Channel 1: Discord / Reddit organic seeding**

Time cost: ~4 hrs/week, 2 people, for 4 weeks = 32 person-hours. At $75/hr blended (founder time), that's $2,400 in time to acquire ~25 audit completions.

Audit → consultation conversion: 10% (1 in 10 people who completed audit are interested enough to talk)
Consultation → credit purchase: 25% (they understand the value, trust Credex)

Customers acquired: 25 × 10% × 25% = **0.6 customers**
Effective CAC: $2,400 / 0.6 = **$4,000**

This is high because it's seeding — the value is social proof and word-of-mouth downstream, not direct conversion. First-order CAC looks bad; second-order is what justifies it.

---

**Channel 2: Direct LinkedIn outreach (50 CTOs/Eng leads)**

Time cost: ~6 hrs to research + personalize 50 messages. At $75/hr = $450.
Response rate: 20% → 10 responses
Audit completion from responses: 60% → 6 audits
Consultation booking: 33% → 2 consultations
Credit purchase: 50% (these are warm, qualified leads) → 1 customer

CAC: $450 / 1 = **~$450 per customer acquired**

This is the most efficient channel in the GTM plan. High signal, low noise, zero media spend.

---

**Channel 3: HN / content post (Show HN week 4)**

Time cost: ~8 hrs to write + distribute the "30 teams audited" post = $600.
Expected audit completions from HN front page: 80–150 (based on typical Show HN traffic for a free tool)
Use midpoint: 115 audits.
Consultation rate: 5% (HN audience is skeptical, higher intent needed) → ~6 consultations
Credit purchase: 25% → 1.5 customers

CAC: $600 / 1.5 = **~$400 per customer acquired**

Secondary value: this content gets referenced in newsletters, shared on X, and drives ongoing organic audits for weeks after posting. The $600 pays dividends beyond week 4.

---

**Channel 4: Credex existing customer base (the unfair channel)**

Time cost: 2 hrs to draft email sequence + embed audit link in dashboard = $150.
Existing Credex customers who receive the audit prompt: assume 200 (conservative active customer base estimate).
Audit completion rate: 35% (trust already exists → much higher than cold) → 70 audits
Consultation booking: 20% → 14 consultations
Credit purchase: 60% (already a Credex customer, upgrade or expand) → 8.4 customers

CAC: $150 / 8.4 = **~$18 per customer acquired**

This is why the existing customer base is the unfair channel. CAC is 25× lower than Discord seeding because trust is already priced in.

---

**CAC Summary Table**

| Channel | Customers Acquired | Cost | CAC |
|---|---|---|---|
| Discord / Reddit seeding | 0.6 | $2,400 | $4,000 |
| LinkedIn direct outreach | 1.0 | $450 | $450 |
| HN / content | 1.5 | $600 | $400 |
| Credex existing base | 8.4 | $150 | $18 |
| **Blended (Month 1)** | **11.5** | **$3,600** | **$313** |

Blended CAC of **~$313** against LTV of **~$2,000** = **LTV:CAC ratio of 6.4×**.
Healthy SaaS benchmark is 3×. This model clears it — driven almost entirely by the existing customer channel.

---

## 3. Conversion Rate Math: Audit → Consultation → Purchase

For the model to work, three conversion rates must hold simultaneously:

| Stage | Required Rate | Reasoning |
|---|---|---|
| Audit completed → consultation booked | 8–10% | Person found real savings ($300+/mo), has a reason to talk. Below 8% = tool isn't surfacing compelling enough findings. Above 12% = exceptionally good. |
| Consultation booked → credit purchase | 30–40% | Credex needs to explain the credit mechanism clearly. If the person doesn't understand how credits work in one call, this drops to <20%. |
| Audit completed → credit purchase (combined) | **2.4–4%** | 10% × 30% = 3% base case |

At 3% end-to-end conversion: every **33 completed audits** produces **1 paying customer**.

At $2,000 LTV per customer, each audit has an **expected value of $60** to Credex ($2,000 / 33). Generating audits at a marginal cost below $60 each is profitable. At the channels above, Discord seeding is the only one that's marginally negative on direct basis — it's justified by the content and social proof it creates.

**The lever that matters most:** consultation → purchase conversion. If this drops from 35% to 15%, the whole model shifts from 3% end-to-end to 1.5% — you need 67 audits per customer instead of 33. Monitor this rate weekly in months 1–3.

---

## 4. What Would Have to Be True to Drive $1M ARR in 18 Months

$1M ARR = $83,333/mo in recurring revenue to Credex.

At $108/mo revenue per customer (from section 1): **772 active customers needed at month 18**.

Working backwards from month 18 with assumed 5%/month churn:

To have 772 customers active at month 18, you need to have acquired roughly **1,100 total customers** over 18 months (accounting for churn). That's ~61 new customers per month by month 18, ramping from ~11/month in month 1.

**Is 61 new customers/month achievable by month 18?**

It requires the audit tool to be generating **~2,000 completed audits per month** by month 12 (61 customers / 3% conversion = 2,033 audits needed).

Month 1 baseline: ~115 audits (GTM plan).
To reach 2,000 audits/month by month 12: **17.4× growth in 12 months** = ~26% month-over-month audit volume growth.

26% MoM is aggressive but not unrealistic for a free tool with a strong share loop, IF:

1. **The share loop compounds.** Every screenshotted audit result drives 2–5 new audits from the person's network. If average virality coefficient (K) > 0.3, organic growth sustains 20%+ MoM without additional spend.
2. **Credex runs the existing-customer email to 1,000+ customers, not 200.** At 1,000 existing customers, the unfair channel alone produces 50+ new Credex customers in month 1. That accelerates the ramp dramatically.
3. **The consultation → purchase rate holds at 30%+.** This is the most fragile assumption. It requires a skilled sales motion, not just a booking link.
4. **Pricing data stays fresh.** The audit's credibility depends on current numbers. If pricing drifts and audits become inaccurate, trust collapses fast. PRICING_DATA.md needs a refresh cadence — at minimum monthly.

**$1M ARR scenario summary:**

| Metric | Month 1 | Month 6 | Month 12 | Month 18 |
|---|---|---|---|---|
| Audits/month | 115 | 310 | 850 | 2,100 |
| New customers/month | 3 | 9 | 25 | 63 |
| Active customers | 11 | 52 | 190 | 772 |
| Monthly Credex revenue | $1,188 | $5,616 | $20,520 | $83,376 |
| ARR run rate | $14,256 | $67,392 | $246,240 | **$1,000,512** |

This is achievable. It is not easy. The difference between hitting it and missing it is whether the existing-customer channel is activated aggressively in month 1, and whether the consultation conversion rate is treated as a first-class metric from day one.

---

*All inputs are estimates. LTV assumes 10% Credex margin and 18-month retention — both should be validated against actual Credex economics before committing to this model. The 3% end-to-end conversion rate is the number to instrument and optimize first.*