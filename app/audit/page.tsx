"use client"

import { Navbar } from "@/components/Navbar";
import { 
  ShieldCheck, Zap, Lock, ArrowLeft,
  Bot, GitFork, FileText, Laptop, Cpu, BrainCircuit, Terminal,
  ChevronRight, CheckCircle2, Search,
  Mail, Building2, User, DollarSign, LucideIcon
} from "lucide-react";
import { useState } from "react";
import { TOOL_PRICING } from "@/lib/data/pricing";

const getIcon = (toolKey: string): LucideIcon => {
  const map: Record<string, LucideIcon> = {
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
  tool: string;       
  teamSize: number;   
  plan: string;       
  billing: number;    
  actualBilling: number; 
  planPricing: number;   
  tasks: string;      
  email: string;      
  company: string;    
  role: string;       
  _hp: string;        
};

export default function AuditPage() {
  const [tool, setTool]       = useState("chatgpt");
  const [plan, setPlan]       = useState("plus");
  const [billing, setBilling] = useState<number>(20);
  const [teamSize, setTeamSize] = useState<number>(10);        
  const [tasks, setTasks]     = useState("");                  
  const [email, setEmail]     = useState("");                  
  const [company, setCompany] = useState("");                  
  const [role, setRole]       = useState("");                  
  const [hp, setHp]           = useState("");                  

  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [progress, setProgress] = useState(0);
  const [apiData, setApiData]   = useState<Record<string, unknown> | null>(null);
  const [copied, setCopied]     = useState(false);

  const selectedToolData = TOOL_PRICING[tool];

  const handleToolChange = (toolKey: string) => {
    setTool(toolKey);
    const firstPlan = Object.keys(TOOL_PRICING[toolKey].plans)[0];
    setPlan(firstPlan);
    setBilling(TOOL_PRICING[toolKey].plans[firstPlan].price);
  };

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
        role,
        _hp: hp,
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
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message);
      }
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
          setApiData(result.data as Record<string, unknown>);
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
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-blue-500/30 selection:text-blue-200">
      <div className="bg-glow" />
      
      {/* NAVBAR */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => setStep("form")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {step === "results" ? "Restart Audit" : "Back to Home"}
          </button>
          
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-blue-500 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
            <ShieldCheck size={12} />
            Enterprise Guard Active
          </div>
        </div>

        {/* ── FORM STEP ────────────────────────────────────────────────── */}
        {step === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Introduction & Tool Selection (7 Cols) */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
                  AI Stack <span className="text-blue-500">Audit</span>.
                </h1>
                <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                  Identify redundancies, over-provisioning, and hidden costs in your AI subscription portfolio.
                </p>
              </div>

              <div className="glass rounded-[40px] p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Zap size={18} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">Target Tool Analysis</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {ALL_TOOLS.map(t => {
                    const active = tool === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleToolChange(t.id)}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all group ${
                          active
                            ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                            : "border-white/5 bg-white/[0.02] text-gray-500 hover:border-white/10 hover:bg-white/[0.04]"
                        }`}
                      >
                        <t.Icon size={24} className={active ? "text-blue-400" : "group-hover:text-gray-300"} />
                        <span className="text-[12px] font-bold tracking-tight">{t.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Subscription Plan" icon={<FileText size={14}/>}>
                    <select
                      value={plan} onChange={e => handlePlanChange(e.target.value)}
                      className={inputCls}
                    >
                      {planOptions.map(p => (
                        <option key={p} value={p} className="bg-[#111] capitalize">{p}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-500 mt-2 font-medium">
                      List Price: ${selectedToolData?.plans[plan]?.price}/{selectedToolData?.plans[plan]?.type === 'per_user' ? 'seat' : 'mo'}
                    </p>
                  </Field>

                  <Field label="Team Size" icon={<User size={14}/>}>
                    <input
                      type="number" min={1} placeholder="10"
                      value={teamSize} onChange={e => setTeamSize(parseInt(e.target.value) || 1)}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Right: Personal Info & Submit (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass rounded-[40px] p-8 space-y-6 border-blue-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">Audit Intelligence</h3>
                </div>

                <div className="space-y-4">
                  <Field label="Work Email">
                    <input
                      type="email" placeholder="alex@company.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Company">
                      <input
                        type="text" placeholder="Acme Inc"
                        value={company} onChange={e => setCompany(e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Your Role">
                      <input
                        type="text" placeholder="CTO"
                        value={role} onChange={e => setRole(e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Actual Monthly Spend">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                      <input
                        type="number" min={0}
                        value={billing} onChange={e => setBilling(parseFloat(e.target.value) || 0)}
                        className={inputCls + " pl-8"}
                      />
                    </div>
                  </Field>

                  <Field label="Usage Patterns / Tasks">
                    <textarea
                      rows={3} placeholder="E.g. Engineering team uses it for legacy code refactoring and PR reviews."
                      value={tasks} onChange={e => setTasks(e.target.value)}
                      className={inputCls + " resize-none min-h-[100px]"}
                    />
                  </Field>

                  {/* Honeypot */}
                  <input type="text" value={hp} onChange={e => setHp(e.target.value)} className="hidden" tabIndex={-1} />

                  <button
                    onClick={handleAnalyze}
                    disabled={!email || !company || !tool || !plan || !teamSize}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_40px_rgba(59,130,246,0.3)] mt-6 group"
                  >
                    Start Analysis <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LOADING STEP ─────────────────────────────────────────────── */}
        {step === "loading" && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-12">
            <div className="relative">
              <div className="w-32 h-32 rounded-[40px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 animate-pulse">
                <Search size={48} />
              </div>
              <div className="absolute inset-0 rounded-[40px] border border-blue-500/50 animate-ping opacity-20" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight">
                {progress < 40 ? "Initializing Secure Audit..." : `Processing ${company} Data...`}
              </h2>
              <p className="text-gray-400 text-lg">
                Our math engine is verifying pricing tiers against standard benchmarks.
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
                <span>Engines Primed</span>
                <span>{progress}% Complete</span>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS STEP ─────────────────────────────────────────────── */}
        {step === "results" && apiData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* 1. HERO BENTO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Verdict Card (2 Cols) */}
              <div className="lg:col-span-2 glass rounded-[48px] p-10 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] -mr-20 -mt-20 group-hover:bg-blue-500/20 transition-all duration-700" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl">
                      <BrainCircuit size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Executive Summary</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] max-w-2xl">
                    {apiData.output_recommendation as string}
                  </h2>
                </div>
                <div className="relative z-10 mt-12 pt-8 border-t border-white/5 flex items-center gap-6">
                  <div className="flex items-center gap-3 text-gray-400 font-medium italic">
                    <CheckCircle2 size={18} className="text-green-500" />
                    Verified by Trace AI Engine
                  </div>
                </div>
              </div>

              {/* Savings Card (1 Col) */}
              <div className="bg-blue-600 rounded-[48px] p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(59,130,246,0.3)]">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Annual Recovery</span>
                  <div className="text-6xl font-black tracking-tighter text-white">
                    ${Number(apiData.output_annual_saving ?? 0).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-white/80 font-bold leading-tight">
                    We&apos;ve identified potential savings of ${Number(apiData.output_monthly_saving).toLocaleString()} per month.
                  </div>
                  <button className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl hover:scale-105 transition-all">
                    Claim Refund
                  </button>
                </div>
              </div>
            </div>

            {/* 2. DETAIL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (8 Cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Strategic Breakdown */}
                <div className="glass rounded-[40px] p-10 space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                    Intelligence Breakdown
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(() => {
                      const rawReasons = (apiData.output_savings_reason as string) || "";
                      const reasons = rawReasons.split(" | ");
                      return reasons.map((raw: string, i: number) => {
                        const reason = raw.replace(/\[CASE\d+\]/gi, "").trim();
                        const hasArrow = reason.includes(" \u2192 ");
                        const parts = hasArrow ? reason.split(" \u2192 ") : ["Analysis", reason];
                        
                        return (
                          <div key={i} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-4 hover:bg-white/[0.05] transition-all group">
                            <div className="flex items-center justify-between">
                              <div className="p-2 rounded-lg bg-white/5 text-blue-400 group-hover:scale-110 transition-transform">
                                <Zap size={16} />
                              </div>
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{parts[0]}</span>
                            </div>
                            <p className="text-[15px] font-bold text-gray-200 leading-relaxed">
                              {parts[1] || parts[0]}
                            </p>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Right Column (4 Cols) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Audit Context */}
                <div className="glass rounded-[40px] p-8 border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Audit Profile</h3>
                  <div className="space-y-6">
                    <ContextRow label="Entity" value={apiData.input_company as string} icon={<Building2 size={14}/>} />
                    <ContextRow label="Seats" value={`${apiData.input_team_size as number} Users`} icon={<User size={14}/>} />
                    <ContextRow 
                      label="Current Tool" 
                      value={(apiData.input_tool_key as string)?.replace("_", " ")} 
                      icon={(() => {
                        const Icon = getIcon(apiData.input_tool_key as string);
                        return <Icon size={14} />;
                      })()} 
                    />
                    <ContextRow label="Monthly Burn" value={`$${Number(apiData.input_actual_billing).toLocaleString()}`} icon={<DollarSign size={14}/>} color="text-red-400" />
                  </div>
                </div>

                {/* Additional Insight if case 5 exists */}
                {Number((apiData.llm_raw_response as { additionalMonthlySavings: number })?.additionalMonthlySavings ?? 0) > 0 && (
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-8 space-y-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex items-center gap-3 relative z-10">
                      <GitFork size={20} className="text-white" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Migration Arbitrage</span>
                    </div>
                    <h4 className="text-xl font-bold text-white relative z-10 leading-tight">
                      Switching to an alternative vendor could recover an extra <span className="text-yellow-300">${Number((apiData.llm_raw_response as { additionalMonthlySavings: number }).additionalMonthlySavings * 12).toLocaleString()}/year.</span>
                    </h4>
                  </div>
                )}
              </div>
            </div>

            {/* 3. FINAL ACTION BAR */}
            <div className="glass rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Ready to secure these savings?</h3>
                <p className="text-gray-400 text-sm">Our team handles the vendor negotiations and migration strategy.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-5 rounded-2xl shadow-lg transition-all">
                  Start Recovery
                </button>
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/share/${apiData.id as string}`;
                    navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`flex-1 md:flex-none font-bold px-8 py-5 rounded-2xl border-2 transition-all ${
                    copied 
                      ? "bg-green-500/10 border-green-500 text-green-500" 
                      : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                  }`}
                >
                  {copied ? "URL Copied!" : "Share Analysis"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-12 text-gray-500">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
              <ShieldCheck size={14}/> 100% Secure
            </div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
              <Zap size={14}/> Real-time Data
            </div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
              <Lock size={14}/> Private Session
            </div>
          </div>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
            © 2026 Trace AI Recovery. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── STYLES & HELPERS ────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600";

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function ContextRow({ label, value, icon, color = "text-white" }: { label: string; value: string; icon: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-gray-500">
        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-[13px] font-black capitalize ${color}`}>{value}</span>
    </div>
  );
}
