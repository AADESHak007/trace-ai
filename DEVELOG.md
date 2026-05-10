# Development Log

## Day 01 — 2026-05-07
**Hours worked:** ~4

**What I did:**
- Thoroughly analyzed the core task requirements and user needs to define a clear project scope.
- Designed the end-to-end system architecture and relational data models in Prisma to support complex audit trails.
- Initialized the repository and established the foundational project structure for Next.js and backend services.
- Set up Prisma ORM with PostgreSQL; successfully ran initial migrations and seeded test data to verify database integrity.

**What I learned:** How to properly configure Prisma 7 with the PostgreSQL adapter and the breaking changes it introduced.

**Blockers / what I'm stuck on:** None — clean setup day.

**Plan for tomorrow:** Validate the architecture with real-world feedback and start building the API layer.

---

## Day 02 — 2026-05-08
**Hours worked:** ~4

**What I did:**
- Engaged with industry connections to gather specialized insights into AI Audit tool pain points and perception.
- Evaluated the balance between deterministic algorithmic logic and LLM-driven analysis for the audit engine.
- Created a preliminary SOP for the audit engine — covers the core algorithm flow but is still a draft.
- Developed and tested the core `v1/audit` API routes to handle incoming form data and generate initial job IDs.

**What I learned:** The importance of separating math-based deterministic logic from AI-based subjective analysis in the engine design.

**Blockers / what I'm stuck on:** The audit engine SOP needs more iteration — edge cases and scoring thresholds are not yet finalized.

**Plan for tomorrow:** Set up the background job queue (Redis + BullMQ) and bridge it to the audit API.

---

## Day 03 — 2026-05-09
**Hours worked:** ~4

**What I did:**
- Finalized the SOP with more factors after further brainstorming.
- Researched trade-offs between Redis + BullMQ vs. Upstash — chose Redis + BullMQ for scale and cost-effectiveness at volume.
- Set up Redis locally using a Docker Compose file and integrated BullMQ into the project.
- Updated the Audit API to save inputs to the DB first and then enqueue the job using the audit's DB ID.
- Tested the full queue flow locally and pushed the code to GitHub.

**What I learned:** How BullMQ's job retry and backoff strategy works, and why `maxRetriesPerRequest: null` is required for ioredis with BullMQ.

**Blockers / what I'm stuck on:** None — everything tested successfully.

**Plan for tomorrow:** Implement the audit engine and complete the backend flow end-to-end.

---

## Day 04 — 2026-05-10
**Hours worked:** ~4

**What I did:**
- Implemented the status polling API (`GET /api/v1/audit/status/[jobId]`) for the client to track job progress.
- Scraped and verified pricing data for all target tools (Cursor, Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, OpenAI API) and documented them in `PRICING_DATA.md`.
- Translated all pricing data into a type-safe, code-readable format in `lib/data/pricing.ts` for the engine.
- Built the deterministic **Math Engine** (`lib/engine/math-engine.ts`) implementing all 5 audit cases from the SOP — Expected vs. Actual, Over-Provisioning, Annual Arbitrage, API Migration, and Alternative Tool Recommendation.
- Configured the BullMQ **Audit Worker** (`workers/audit-worker.ts`) to pick up jobs, run the Math Engine, and persist results back to the database.
- Tested the entire pipeline end-to-end locally — form → API → queue → worker → DB update → polling confirms completion.
- Decided on the frontend design direction and completed the Home Page (Navbar + Hero) using Tailwind CSS with a centralized token system.
- Posted on LinkedIn about the tool I am building to gather user requirements and insights on what features are most desired in an audit tool.

**What I learned:** Worker processes don't auto-load `.env` files — need to explicitly import `dotenv/config` at the top of the worker to avoid SASL authentication failures on the DB connection.

**Blockers / what I'm stuck on:** None — everything went smoothly today.

**Plan for tomorrow:** Polish the landing page UI, build the Audit Form, and design the results dashboard.
