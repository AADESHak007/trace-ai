# GTM.md — Go-to-Market Strategy
## SaaS Spend Audit Engine

---

## 1. The Exact Target User

**Primary:** Head of Engineering or VP of Engineering at a Series A–B SaaS company (25–150 employees, $5M–$30M ARR).

They have enough tooling debt to have real savings, but no dedicated procurement team yet. They're the person who approved the Cursor Business seats last quarter and hasn't thought about it since. They own the AWS bill and three or four AI subscriptions, but finance is starting to ask questions they can't answer cleanly.

**Secondary:** The CFO or Head of Finance at the same company stage, specifically one who has just been asked to cut 10–15% of opex without touching headcount. They don't know what half the dev tools on the P&L are, and they resent that.

**Not:** Enterprise IT (has procurement). Not solo founders (no meaningful team spend). Not "startups" generically.

---

## 2. What They're Googling or Scrolling Right Before They'd Want This

- "cursor vs github copilot team plan worth it"
- "how much does claude team cost per user"
- "anthropic api vs claude pro which is cheaper for teams"
- "cut saas costs without losing tools"
- "saas spend review template engineering team"
- "openai api vs chatgpt team pricing"
- Scrolling a Hacker News thread: *"What AI tools does your team actually pay for?"*
- Their CFO just forwarded them a Slack or email: *"Can you explain this $4,200/mo line item for 'AI tools'?"*

The emotional state is mild guilt + mild defensiveness. They haven't optimized this intentionally; they just kept approving renewals.

---

## 3. Where They Hang Out Online

**Subreddits:**
- r/ExperiencedDevs — senior engineers discussing tooling tradeoffs
- r/sysadmin — IT/ops people dealing with software spend
- r/startups — founders and early eng leaders making tooling decisions
- r/ChatGPTPro — people actively comparing AI subscription tiers

**Slack Communities:**
- Rands Leadership Slack (#tools, #operations channels) — engineering managers
- Heavybit Slack — Series A/B SaaS founders and CTOs
- Software Lead Weekly community — engineering leaders who read newsletters
- Lenny's Slack — product and growth, but finance questions surface here too

**Discord:**
- Cursor's official Discord — people actively comparing plans, asking "is Business worth it for 5 people?"
- Buildspace — early-stage builders with real AI spend
- Developer DAO — engineers discussing tooling costs

**X (Twitter/Lists):**
- "AI tooling" lists curated by developers — people like swyx, Simon Willison, Lenny Rachitsky
- Threads from engineering leaders posting about their stack publicly

**Newsletter comment sections:**
- TLDR Tech, The Pragmatic Engineer, Pointer.io — readers are exactly this persona

---

## 4. First 100 Users in 30 Days, $0 Paid Budget

**Week 1: Plant in the exact conversation that's already happening**

Cursor's Discord has a live #pricing and #team channels where people ask "is the Business plan worth it for a 3-person team?" right now. Go answer those questions helpfully — not "use our tool," but an actual breakdown: "For 3 people on Business you're paying $120/mo; Pro is $60/mo and covers 99% of the same features unless you need SSO." Then: "I built a quick audit tool that does this math automatically if you want to run your full stack." That gets you 10–20 genuine first users who have immediate intent.

Do the same in r/ExperiencedDevs and r/startups — not as a launch post, but as a helpful comment in existing threads about AI spend.

**Week 2: The "post your audit result" loop**

The audit results page is designed to be screenshotted. Add a "Share your audit" button that generates a clean card: "I'm spending $X/mo on AI tools. Audit found $Y in savings. Built by [tool]." Post your own result publicly on X and tag 5 engineering leaders you know. When others share theirs, the audit tool is visible in every screenshot. This is zero-cost distribution through vanity — people like sharing that they found savings.

**Week 3: Direct outreach to 50 CTOs and Heads of Engineering**

Use LinkedIn to find Series A/B companies (Crunchbase filter: raised $3M–$20M in last 18 months). Find the Head of Engineering. Send a 3-line cold message: "I built a free tool that audits your AI tool spend against current pricing data — takes 2 minutes. Most teams find $200–$800/mo in waste. Happy to share if useful." 50 messages, expect 8–12 responses, 4–6 who run the audit. Those 4–6 become case studies.

**Week 4: One anchor piece of content with a real number in the title**

Write "We audited 30 engineering teams' AI spend — here's what we found" — use real aggregate data from weeks 1–3. No made-up stats. Post on HN (Show HN), cross-post to r/ExperiencedDevs. A real data post from a real tool gets traction where a launch post gets ignored. Target: one HN front page appearance.

**Total path to 100 users:** Discord/Reddit seeding (~25), share loop (~30), direct outreach (~15), HN post (~30). These overlap with real intent.

---

## 5. The Unfair Distribution Channel

**Credex's existing customer base.**

If Credex already serves companies that are buying SaaS on credits — they have a captive list of exactly the companies who (a) have real AI tool spend and (b) are already thinking about cost efficiency. An audit tool embedded in the Credex dashboard or sent as a "run your audit" email to existing customers converts at a fundamentally different rate than cold acquisition. Credex customers already trust the brand, already have the spend problem, and are already in the mindset of "let me optimize this."

No cold-traffic tool can replicate trust that's already been earned. That's the unfair advantage — and it's only Credex who can pull it.

**Secondary unfair channel:** Whoever at Credex has relationships with the finance influencer community on X (Lenny, Packy McCormick, Not Boring adjacent accounts). One authentic "I ran my stack through this" post from a trusted voice in the Series A ecosystem is worth more than 500 cold DMs. That's a warm intro that can't be bought.

---

## 6. What Week-1 Traction Looks Like If This Works

If the Discord seeding and share loop are working by end of week 1:

- **40–60 audits completed** (not signups — completed runs with results shown)
- **8–12 audit results shared publicly** on X or LinkedIn with the screenshot card
- **At least 1 HN comment thread** where someone posts the tool and gets upvotes without the founders doing it
- **2–3 inbound messages** from people asking "can this integrate with our billing system / Slack / Notion"
- **Average stated monthly savings found: $300+** (if the math engine is running correctly on real stacks)
- **1 company** that runs the audit, finds >$500/mo, and asks how to use Credex to capture it

What it does NOT look like: 1,000 signups with 20 audits completed. Volume without completion is a vanity metric. The number that matters is completed audits with a savings number shown — that's the unit of value delivered.

---

*Sources: Cursor pricing verified at cursor.com/pricing. GitHub Copilot at github.com/features/copilot/plans. Claude at claude.ai/pricing. All as of submission week.*