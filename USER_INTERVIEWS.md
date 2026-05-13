# User Interviews & Feedback

## Interview 01: The "Multi-Tool" Strategist
**Name:** DY (anonymous)    
**Duration:** 8 Minutes on call

### Key Quotes:
- "We don't just use one tool. I need to audit my ChatGPT, Claude, and Midjourney spend all in one go."
- "My team is small, but our 'Shadow AI' spend is everywhere. I can't track who has a personal Pro account."
- "I'm worried that if I audit one tool, I'm missing the bigger picture of our total AI burn."

### The Most Surprising Thing:
He insisted that he needed a "Multi-Tool" audit. I initially countered that most teams focus on one primary tool, but he revealed that his engineers were using ChatGPT and Claude interchangeably for the same tasks because "one is better for code, one for emails," resulting in $40/mo waste per user that went unnoticed.

### What it Changed:
This conversation led to a pivot in how we handle the `tasks` input. Instead of just looking at the primary tool, I updated the **Math Engine** and **LLM Engine** to look for **Redundancy (Case 2)**. The engine now specifically asks for usage context to see if a single, cheaper tool could replace the multi-tool mess.

---

## Interview 02: The "Harmony" Architect
**Name:** Haseeb Zaki  
**Role:** Co-founder Shorts-lol.com , 3Rigns , SWE @ Sparkonomy  
**Duration:** 20 Minutes

### Key Quotes:
- "Math is cold; it tells me I'm overpaying, but not *why* I should care. You need harmony between the numbers and the strategy."
- "Use the LLM to translate the Math. Don't let them be separate boxes."
- "The 'TASK' field is your most valuable data point. Use it to analyze if the team is actually using the features they pay for."

### The Most Surprising Thing:
Maya was less concerned with the "Official Price" of the plans and more concerned with the **Usage Intensity**. He suggested that the LLM should be the "Lead Auditor" that interprets the Math Engine's deterministic findings into prose that a CEO can actually read.

### What it Changed:
Based on this, I refactored `llm-engine.ts` to work in total harmony with `math-engine.ts`. The LLM now receives the full `MathEngineResult` as an input. I also updated the **LLM Prompt** to prioritize analyzing the `tasks` field to recommend specific tool migrations (Case 5) based on the team's actual workflow.

---

## Interview 03: The "Viral" Indie Hacker
**Name:** Chetan Singh  
**Role:** Co-founder Konnect , CTO @ Coderg  
**Duration:** 10 Minutes

### Key Quotes:
- "I'd share my savings score on Twitter in a heartbeat, but I don't want people to see my internal company name or my email."
- "A PDF report is a dead end. Give me a link that looks like a 'win' for my personal brand."
- "If the link looks like a professional dashboard, I'll trust the results more."

### The Most Surprising Thing:
Chetan cared more about the **SEO/OG Preview** of the shared link than he did about the actual data accuracy. He felt that the "Viral Loop" of showing off lean operations was the real value of an audit tool for early-stage founders.

### What it Changed:
This was the direct catalyst for the **Shareable UI Dashboard**. I updated the **Prisma Schema** to handle public IDs and created a dedicated, anonymized sharing route. I also implemented **Dynamic OG Images** that strip identifying details (Company/Email) so founders like Chetan can share their "Savings Score" without compromising privacy.
