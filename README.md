# Trace AI — The SaaS Spend Audit Engine

**Trace AI is a high-fidelity audit engine designed for engineering leaders to recover thousands in annual AI tool overpayments.** It analyzes your team's usage of tools like Cursor, ChatGPT, and Claude against a live pricing benchmark database to find redundancies and strategic downgrade opportunities.

---

## 🚀 Live Demo
**[Trace AI Live Dashboard](https://trace-ai.vercel.app)**

> [!IMPORTANT]
> **Deployment Note:** Since the background workers are hosted on Render's free tier, they may "sleep" due to inactivity. The first audit request can take **up to 5 minutes** to spin up the workers. Subsequent requests will be near-instant.
> 
> **Rate Limiting:** To prevent abuse, the live demo is limited to **7 audit requests per hour per IP**.

---

## 📸 Screenshots

![Landing Page](file:///c:/Users/91774/Desktop/trace-ai/public/Screenshot%202026-05-13%20102743.png)
*Modern, high-fidelity landing page with Bento-grid showcase.*

![Audit Results](file:///c:/Users/91774/Desktop/trace-ai/public/Screenshot%202026-05-13%20115949.png)
*Deterministic math-driven savings report with strategic AI insights.*

![Viral Sharing](file:///c:/Users/91774/Desktop/trace-ai/public/Screenshot%202026-05-13%20120014.png)
*Anonymized sharing dashboard designed for viral organic growth.*

---

## 🛠 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on the provided schema:
```env
DATABASE_URL="postgresql://..."
REDIS_URL="rediss://..."
GOOGLE_AI_KEY="your-gemini-key"
SMTP_HOST="smtp.gmail.com"
...
```

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Locally
You need three terminal windows:
```bash
# Terminal 1: Frontend & API
npm run dev

# Terminal 2: Audit Worker
npm run worker:audit

# Terminal 3: Email Worker
npm run worker:email
```

---

## 🧠 Strategic Decisions & Trade-offs

1.  **Deterministic vs. Subjective Analysis**: I decoupled the audit logic into two distinct engines. The **Math Engine** handles 100% accurate financial calculations (list pricing, team size math), while the **LLM Engine** handles the "strategy" and "tone," ensuring the audit result is both mathematically sound and professionally readable.
2.  **Persistent Queue vs. Serverless**: I chose **BullMQ + Redis** over standard Next.js API timeouts. This ensures that even if the Gemini API or the Database is slow, the audit is never lost and can be retried automatically in the background.
3.  **Render "Web Service" Hack**: To keep the project running for free, I implemented a dummy HTTP server inside the workers to satisfy Render's free-tier health checks, allowing background processing without the $7/mo cost per worker.
4.  **Bento Grid Dashboard**: I prioritized a premium, high-fidelity Bento Grid UI over a standard "table-and-text" layout. Based on user interviews, visual trust is the primary driver for users to share their results, which fuels the viral loop.
5.  **Anonymized Public Sharing**: I implemented a dedicated sharing route using unique IDs and partial data masking. This allows founders to show off their "Lean Ops Score" on social media without leaking their team size or internal company names.

---

## 📊 Documentation
*   **[GTM.md](GTM.md)**: Path to 100 users with $0 spend.
*   **[ECONOMICS.md](ECONOMICS.md)**: Unit economics (6.4x LTV:CAC).
*   **[TESTS.md](TESTS.md)**: Automated engine test suite documentation.
*   **[PRICING_DATA.md](PRICING_DATA.md)**: Verified benchmark pricing for top AI tools.
*   **[DEVELOG.md](DEVELOG.md)**: 7-day development audit trail.
