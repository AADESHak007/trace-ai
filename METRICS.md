# METRICS.md — Growth & North Star Strategy

---

## 1. The North Star Metric
**Total Annual Savings Identified (TASI)**

Why? For a lead-gen tool like Trace AI, the value delivered is directly proportional to the "pain" uncovered. If we find $50,000 in annual waste for a company, the intent to capture those savings (via Credex) is high. This metric aligns engineering (engine accuracy), marketing (targeting the right company size), and sales (lead quality).

---

## 2. Driver Metrics (Input Metrics)

### A. Audit Completion Rate (ACR)
*The percentage of users who land on the audit page and reach the final result.*
If users drop off at the "Team Size" or "Actual Billing" fields, our UX is too high-friction. High ACR ensures we maximize the conversion of expensive traffic into leads.

### B. Viral K-Factor (Sharing Efficiency)
*The number of new audits generated per shared result page.*
Trace AI grows through "vanity sharing" on X/LinkedIn. If one shared audit doesn't lead to at least 0.2 new audits, the sharing card/copy isn't compelling enough to drive organic growth.

### C. High-Intent Lead Ratio (HILR)
*The percentage of audits where identified savings exceed $500/month.*
A "lead" with $20/mo in savings is a hobbyist. A "lead" with $800/mo is a business. This metric tells us if we are reaching the right persona (Heads of Engineering) vs. individual developers.

---

## 3. Immediate Instrumentation
To track these, I would instrument the following first:
1.  **Form Step Tracking**: Did they get stuck on the "Usage Pattern" textarea?
2.  **Screenshot/Share Button Clicks**: Are people actually sharing, or just looking?
3.  **Job Execution Time**: Does the "Worker" take too long (>10s)? Latency kills the "wow" factor of the result.

---

## 4. The Pivot Decision Trigger
**The "Pivot Number": < 15% Conversion from Audit → Share.**

If less than 15% of users who see a savings result click the "Share" or "Start Recovery" button, it means the output isn't "impressive" enough or the trust gap is too large. 

**Decision:** If we hit this number after 200 audits, we pivot from a "Self-Serve Audit" to a "Deep-Dive Consultant Tool" where we ask for an export of their CSV billing instead of a 2-minute form.
