"use client"

import { Navbar } from "@/components/Navbar";
import { 
  ShieldCheck, Zap, Lock, ArrowLeft, ArrowRight,
  Bot, GitFork, FileText, Laptop, Cpu, BrainCircuit, Terminal,
  Trash2, Plus, Search, Code
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
        <div className="max-w-[780px] mx-auto">

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

          {/* ── RESULTS ──────────────────────────────────────────────── */}
          {step === "results" && apiData && (
            <div className="space-y-8 pb-20">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                {/* Header Section */}
                <div className="bg-[#111] p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#6d28d9] blur-[100px] opacity-20 -mr-20 -mt-20" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h1 className="text-[32px] font-extrabold tracking-tight mb-2">Audit Report: {company}</h1>
                        <p className="text-gray-400 text-[15px] font-medium flex items-center gap-2">
                          <ShieldCheck size={16} className="text-[#10b981]" /> Verified by Trace AI Engine
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-[14px] font-extrabold text-[#10b981]">Optimization Ready</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Recovery</p>
                        <p className="text-[44px] font-extrabold text-[#fff] tracking-tight">
                          ${Number(apiData.output_monthly_saving ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-[#6d28d9] rounded-2xl p-6 border border-white/10 shadow-lg shadow-[#6d28d9]/20">
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Annual Recovery</p>
                        <p className="text-[44px] font-extrabold text-white tracking-tight">
                          ${Number(apiData.output_annual_saving ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Findings Section */}
                <div className="p-10 space-y-10">
                  {/* Verdict Banner */}
                  <div className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                      <Zap size={24} className="text-[#6d28d9]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Executive Verdict</p>
                      <p className="text-[18px] font-bold text-[#111] leading-snug">{apiData.output_recommendation}</p>
                    </div>
                  </div>

                  {/* Split findings */}
                  <div className="grid grid-cols-1 gap-4">
                    <h3 className="text-[14px] font-extrabold text-[#111] uppercase tracking-[0.2em] mb-2 flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-[#6d28d9]" /> Detailed Findings
                    </h3>
                    
                    {apiData.output_savings_reason?.split(" | ").map((reason: string, idx: number) => {
                      const isStrategic = reason.toLowerCase().includes("redundancy") || 
                                          reason.toLowerCase().includes("overlap") || 
                                          reason.toLowerCase().includes("efficiency") || 
                                          reason.toLowerCase().includes("opportunity") || 
                                          reason.toLowerCase().includes("compliance") || 
                                          reason.toLowerCase().includes("potential");
                      
                      return (
                        <div key={idx} className={`p-6 rounded-2xl border transition-all hover:shadow-md flex items-start gap-4 ${
                          isStrategic 
                            ? "bg-[#f5f3ff]/50 border-[#ddd6fe] hover:border-[#6d28d9]" 
                            : "bg-white border-gray-100 hover:border-gray-300"
                        }`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isStrategic ? "bg-[#6d28d9] text-white" : "bg-[#10b981] text-white"
                          }`}>
                            {isStrategic ? <BrainCircuit size={16} /> : <ShieldCheck size={16} />}
                          </div>
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                              isStrategic ? "text-[#6d28d9]" : "text-[#10b981]"
                            }`}>
                              {isStrategic ? "Strategic Insight" : "Financial Optimization"}
                            </p>
                            <p className="text-[15px] text-[#444] leading-relaxed font-medium">{reason}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Footer */}
                  <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
                    <div className="max-w-[300px]">
                      <p className="font-bold text-[18px] mb-1">Claim your $${Number(apiData.output_annual_saving ?? 0).toLocaleString()} savings?</p>
                      <p className="text-[14px] text-[#666]">Our auditors handle the cancellation and negotiation for you.</p>
                    </div>
                    <button className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-[#6d28d9]/20 flex items-center gap-3">
                      Talk to an expert <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* RAW OUTPUT (Collapsed by default) */}
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-[14px] font-bold text-[#666]">
                    <Code size={18} />
                    Technical Raw Response
                  </div>
                  <span className={`text-[#999] text-[12px] transition-transform ${showRaw ? "rotate-180" : ""}`}>▼</span>
                </button>
                {showRaw && (
                  <div className="px-8 pb-8">
                    <div className="bg-[#1e1e1e] rounded-2xl p-6 overflow-x-auto border border-[#333]">
                      <pre className="text-[13px] text-[#d4d4d4] font-mono leading-relaxed">
                        {JSON.stringify(apiData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
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
