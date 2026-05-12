"use client"

import { Navbar } from "@/components/Navbar";
import { 
  ShieldCheck, Zap, Lock, ArrowLeft, ArrowRight,
  Bot, GitFork, FileText, Laptop, Cpu, BrainCircuit, Terminal,
  Trash2, Plus, Search, Code, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { TOOL_PRICING } from "@/lib/data/pricing";

const getIcon = (toolKey: string) => {
  const map: Record<string, any> = {
    chatgpt: Bot, claude: BrainCircuit, cursor: Laptop,
    windsurf: Terminal, github_copilot: GitFork,
    openai_api: Cpu, anthropic_api: Cpu, gemini: Bot,
  };
  return map[toolKey] ?? FileText;
};

const ALL_TOOLS = Object.entries(TOOL_PRICING).map(([key, val]) => ({
  id: key,
  name: val.name,
  Icon: getIcon(key),
  plans: Object.keys(val.plans),
}));

type ApiPayload = {
  tool: string;       // input_tool  → String
  teamSize: number;   // input_team_size → Int
  plan: string;       // input_plan  → String
  billing: number;    // input_billing → Decimal (fallback)
  actualBilling: number; // what they pay
  planPricing: number;   // ground-truth plan price
  tasks: string;      // input_tasks → String (Text)
  email: string;      // input_email → String
  company: string;    // input_company → String
};

export default function AuditPage() {


  const [tool, setTool]       = useState("chatgpt");
  const [plan, setPlan]       = useState("plus");
  const [billing, setBilling] = useState<number>(20);
  const [teamSize, setTeamSize] = useState<number>(10);        
  const [tasks, setTasks]     = useState("");                  
  const [email, setEmail]     = useState("");                  
  const [company, setCompany] = useState("");                  

  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [progress, setProgress] = useState(0);
  const [apiData, setApiData]   = useState<any>(null);
  const [showRaw, setShowRaw]   = useState(false);

  const selectedToolData = TOOL_PRICING[tool];
  const SelectedIcon = getIcon(tool);

  // When tool changes, reset plan + billing to the tool's first plan ....
  const handleToolChange = (toolKey: string) => {
    setTool(toolKey);
    const firstPlan = Object.keys(TOOL_PRICING[toolKey].plans)[0];
    setPlan(firstPlan);
    setBilling(TOOL_PRICING[toolKey].plans[firstPlan].price);
  };

  // When plan changes, auto-fill billing from ground-truth data ....
  const handlePlanChange = (planKey: string) => {
    setPlan(planKey);
    setBilling(TOOL_PRICING[tool].plans[planKey].price);
  };

  const handleAnalyze = async () => {
    setStep("loading");
    setProgress(10);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

      const payload: ApiPayload = {
        tool,
        teamSize: Number(teamSize),
        plan,
        billing: Number(billing),
        actualBilling: Number(billing),
        planPricing: TOOL_PRICING[tool].plans[plan].price,
        tasks,
        email,
        company,
      };

      const res = await fetch(`${baseUrl}/api/v1/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const init = await res.json();
      if (!init.success) throw new Error(init.message || "Audit failed to start");

      setProgress(30);
      pollStatus(init.jobId);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
      setStep("form");
    }
  };

  const pollStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${baseUrl}/api/v1/audit/status/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          clearInterval(interval);
          setApiData(result.data);
          setProgress(100);
          setTimeout(() => setStep("results"), 500);
        } else {
          setProgress(p => Math.min(p + 5, 95));
        }
      } catch (e) { console.error(e); }
    }, 2000);
  };

  const planOptions = selectedToolData ? Object.keys(selectedToolData.plans) : [];

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] text-[#111] overflow-hidden font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'DM Sans', system-ui, sans-serif; }
      `}</style>

      {/* NAVBAR — 10vh */}
      <div className="h-[10vh] shrink-0 bg-white border-b border-gray-100">
        <Navbar />
      </div>

      {/* MAIN — 80vh */}
      <main className="h-[80vh] overflow-y-auto px-6 py-10">
        <div className="max-w-[1400px] mx-auto">

          <div className={step === "results" ? "" : "max-w-[780px] mx-auto"}>
            <button
              onClick={() => setStep("form")}
              className="inline-flex items-center gap-2 text-[#666] hover:text-[#6d28d9] transition-colors mb-8 text-[14px] font-semibold group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
              {step === "results" ? "Start over" : "Back to home"}
            </button>

            {/* ── FORM ──────────────────────────────────────────────────── */}
            {step === "form" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-10 space-y-8">
                <div>
                  <h1 className="text-[30px] font-extrabold tracking-tight mb-1">Run your AI Audit</h1>
                  <p className="text-[#666] text-[15px]">Each field maps directly to what our engine needs.</p>
                </div>

                {/* ROW 1: email + company */}
                <div className="grid grid-cols-2 gap-5">
                  <Field label="email" hint="input_email · String">
                    <input
                      type="email" placeholder="alex@acme.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="company" hint="input_company · String">
                    <input
                      type="text" placeholder="Acme Inc."
                      value={company} onChange={e => setCompany(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* ROW 2: tool selector */}
                <Field label="tool" hint="input_tool · String — the AI tool being audited">
                  <div className="grid grid-cols-4 gap-3">
                    {ALL_TOOLS.map(t => {
                      const active = tool === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => handleToolChange(t.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-[12px] font-bold ${
                            active
                              ? "border-[#6d28d9] bg-[#f5f3ff] text-[#6d28d9]"
                              : "border-gray-100 bg-[#F9FAFB] text-[#666] hover:border-[#6d28d9]/30"
                          }`}
                        >
                          <t.Icon size={20} />
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {/* ROW 3: Plan, Team Size, Actual Spend (3 columns) */}
                <div className="grid grid-cols-3 gap-5">
                  <Field label="plan" hint="input_plan">
                    <select
                      value={plan} onChange={e => handlePlanChange(e.target.value)}
                      className={inputCls}
                    >
                      {planOptions.map(p => (
                        <option key={p} value={p} className="capitalize">{p}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-[#999] mt-1 font-medium">Official price: ${selectedToolData?.plans[plan]?.price}/{selectedToolData?.plans[plan]?.type === 'per_user' ? 'user' : 'mo'}</p>
                  </Field>

                  <Field label="teamSize" hint="input_team_size">
                    <input
                      type="number" min={1} placeholder="10"
                      value={teamSize} onChange={e => setTeamSize(parseInt(e.target.value) || 1)}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="actual billing" hint="input_billing">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] font-bold text-[15px]">$</span>
                      <input
                        type="number" min={0}
                        value={billing} onChange={e => setBilling(parseFloat(e.target.value) || 0)}
                        className={inputCls + " pl-8"}
                      />
                    </div>
                    <p className="text-[10px] text-[#999] mt-1 font-medium italic">What you actually pay monthly</p>
                  </Field>
                </div>

                {/* ROW 5: tasks */}
                <Field label="tasks" hint="input_tasks · String (Text) — how the team uses this tool">
                  <textarea
                    rows={3} placeholder="E.g. Engineers use it for code completion, 8h/day..."
                    value={tasks} onChange={e => setTasks(e.target.value)}
                    className={inputCls + " resize-none"}
                  />
                </Field>

                {/* SUBMIT */}
                <button
                  onClick={handleAnalyze}
                  disabled={!email || !company || !tool || !plan || !teamSize}
                  className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#6d28d9]/20 text-[16px]"
                >
                  Analyze Overpayments <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* ── LOADING ──────────────────────────────────────────────── */}
            {step === "loading" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#f5f3ff] rounded-2xl flex items-center justify-center text-[#6d28d9] mb-6 animate-bounce">
                  <Search size={32} />
                </div>
                <h2 className="text-[24px] font-extrabold mb-2">Analyzing {company}'s stack...</h2>
                <p className="text-[#666] mb-8">Running math engine across your audit data.</p>
                <div className="w-full max-w-md bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#6d28d9] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[12px] font-bold text-[#6d28d9] mt-3 uppercase tracking-widest">{progress}% complete</p>
              </div>
            )}
          </div>

          {/* ── RESULTS ──────────────────────────────────────────────── */}
          {step === "results" && apiData && (
            <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
              {/* 1. HERO VERDICT BAR */}
              <div className="bg-[#111] rounded-[32px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-white/10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#6d28d9]/20 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[14px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">Audit Verdict</p>
                  <h2 className="text-[28px] md:text-[36px] font-extrabold leading-tight max-w-[700px]">
                    {apiData.output_recommendation}
                  </h2>
                </div>
                <div className="flex gap-12 relative z-10 shrink-0">
                  <div className="text-center md:text-right">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-[#10b981] mb-1">Annual Recovery</p>
                    <p className="text-[48px] font-black tracking-tighter text-white">
                      ${Number(apiData.output_annual_saving ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. MAIN INTELLIGENCE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT: AI SUMMARY (60%) */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] flex items-center justify-center">
                        <BrainCircuit size={22} />
                      </div>
                      <h3 className="text-[16px] font-extrabold text-[#111] uppercase tracking-widest">Executive Strategy</h3>
                    </div>
                    <div className="text-[18px] text-[#444] leading-[1.8] font-medium italic">
                      {apiData.llm_raw_response?.summary || apiData.output_recommendation || "Our analysis indicates significant opportunities for stack optimization and billing recovery across your current toolset."}
                    </div>
                  </div>

                  {/* FINANCIAL RECOVERY GRID */}
                  {(() => {
                    const reasons = apiData.output_savings_reason?.split(" | ") || [];
                    const strategicKeys = ["redundancy", "overlap", "efficiency", "opportunity", "compliance", "potential", "growth", "security"];
                    const financial = reasons.filter((r: string) => !strategicKeys.some(k => r.toLowerCase().includes(k)));

                    return financial.length > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                          <h3 className="text-[14px] font-extrabold text-[#111] uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-[#10b981]" /> Financial Optimizations
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {financial.map((reasonRaw: string, idx: number) => {
                            const reason = reasonRaw.replace(/\[CASE\d+\]/gi, "").trim();
                            const hasArrow = reason.includes(" \u2192 ");
                            
                            const [spend, action, impactWithReason] = hasArrow 
                              ? reason.split(" \u2192 ") 
                              : ["Current Setup", reason, ""];
                              
                            const [impact, detailReason] = impactWithReason ? impactWithReason.split(". Reason: ") : [impactWithReason || "", ""];
                            
                            return (
                              <div key={idx} className="p-8 rounded-[32px] border border-gray-100 bg-white hover:shadow-2xl hover:border-[#10b981]/20 transition-all flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                  <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 text-[#10b981] flex items-center justify-center">
                                    <ShieldCheck size={22} />
                                  </div>
                                  {impact && <div className="bg-[#111] text-white text-[11px] font-bold px-3 py-1 rounded-full max-w-[150px] truncate">{impact}</div>}
                                </div>
                                <div className="space-y-3">
                                  {spend && <p className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">{spend}</p>}
                                  {spend && <div className="w-6 h-[2px] bg-gray-200" />}
                                  <p className="text-[17px] font-extrabold text-[#111] leading-snug">{action}</p>
                                </div>
                                {detailReason && <p className="text-[13px] text-gray-500 leading-relaxed italic border-l-2 border-gray-100 pl-4">"{detailReason}"</p>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* RIGHT: METRICS & STRATEGIC (40%) */}
                <div className="lg:col-span-5 space-y-8">
                  {/* AUDIT CONTEXT BOX */}
                  <div className="bg-[#f8fafc] rounded-[40px] p-10 border border-[#e2e8f0] grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Company</p>
                      <p className="text-[16px] font-bold text-[#111]">{apiData.input_company || "Audit Entity"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Team Size</p>
                      <p className="text-[16px] font-bold text-[#111]">{apiData.input_team_size} Seats</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Current Tool</p>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const Icon = getIcon(apiData.input_tool_key);
                          return <Icon size={16} className="text-[#6d28d9]" />;
                        })()}
                        <p className="text-[16px] font-bold text-[#111] capitalize">{apiData.input_tool_key?.replace("_", " ")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Monthly Burn</p>
                      <p className="text-[16px] font-bold text-red-500">${Number(apiData.input_actual_billing).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* STRATEGIC INSIGHTS LIST */}
                  {(() => {
                    const reasons = apiData.output_savings_reason?.split(" | ") || [];
                    const strategicKeys = ["redundancy", "overlap", "efficiency", "opportunity", "compliance", "potential", "growth", "security"];
                    const strategic = reasons.filter((r: string) => strategicKeys.some(k => r.toLowerCase().includes(k)));

                    return strategic.length > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                          <h3 className="text-[14px] font-extrabold text-[#111] uppercase tracking-[0.2em]">Strategic Insights</h3>
                        </div>
                        <div className="space-y-4">
                          {strategic.map((reasonRaw: string, idx: number) => {
                            const reason = reasonRaw.replace(/\[CASE\d+\]/gi, "").trim();
                            const isRedundant = reason.toLowerCase().includes("redundancy");
                            const isGrowth = reason.toLowerCase().includes("growth");
                            return (
                              <div key={idx} className="p-6 rounded-3xl border border-[#ede9fe] bg-white flex items-start gap-4 hover:border-[#6d28d9]/30 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-[#f5f3ff] text-[#6d28d9] flex items-center justify-center shrink-0">
                                  {isRedundant ? <Zap size={18} /> : isGrowth ? <TrendingUp size={18} /> : <Lock size={18} />}
                                </div>
                                <p className="text-[14px] text-[#4c1d95] font-medium leading-relaxed">{reason}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* 3. CASE 5 BONUS FOOTER */}
              {apiData.llm_raw_response?.additionalMonthlySavings > 0 && (
                <div className="bg-gradient-to-br from-[#6d28d9] to-[#4c1d95] p-12 rounded-[40px] text-white relative overflow-hidden shadow-2xl group">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 blur-[100px] -mr-40 -mt-40 group-hover:opacity-10 transition-opacity" />
                  <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                          <GitFork size={32} />
                        </div>
                        <h4 className="text-[16px] font-extrabold uppercase tracking-[0.3em]">Bonus Recovery</h4>
                      </div>
                      <h3 className="text-[32px] md:text-[40px] font-black leading-tight">Switch tools and save an extra ${Number(apiData.llm_raw_response.additionalMonthlySavings * 12).toLocaleString()}/year.</h3>
                      <p className="text-[18px] text-white/70 max-w-[600px] leading-relaxed">
                        We found a competitor with matching capabilities at a fraction of the cost.
                        We handle the migration for you.
                      </p>
                    </div>
                    <button className="bg-white text-[#111] text-[18px] font-black px-10 py-6 rounded-[24px] hover:scale-105 transition-all shadow-2xl flex items-center gap-3 shrink-0">
                      Explore Tool <ArrowRight size={24} />
                    </button>
                  </div>
                </div>
              )}

              {/* 4. STICKY CTA FOOTER */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h4 className="text-[20px] font-bold mb-1">Ready to capture these savings?</h4>
                  <p className="text-gray-400">Our expert auditors handle the full implementation & negotiation.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="bg-[#6d28d9] text-white font-black px-8 py-4 rounded-2xl hover:bg-[#5b21b6] transition-all shadow-lg shadow-[#6d28d9]/20">
                    Start Recovery Process
                  </button>
                  <button className="text-gray-400 font-bold px-6 py-4 hover:text-black transition-all">
                    Download PDF Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER — 10vh */}
      <footer className="h-[10vh] shrink-0 border-t border-gray-100 bg-white flex flex-col items-center justify-center gap-1.5">
        <p className="text-[12px] text-[#888]">No sign-up. No credit card. Just the numbers.</p>
        <div className="flex items-center gap-8">
          {([
            { Icon: ShieldCheck, label: "100% Free" },
            { Icon: Zap, label: "Results in minutes" },
            { Icon: Lock, label: "Your data stays private" },
          ] as const).map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[13px] text-[#555] font-medium">
              <Icon size={14} className="text-[#888]" /> {label}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── Tiny helpers ────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#6d28d9]/20 focus:border-[#6d28d9] transition-all";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-3">
        <label className="text-[13px] font-extrabold text-[#111] uppercase tracking-wider">{label}</label>
        {hint && <span className="text-[10px] text-[#aaa] font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
