"use client"

import {
  Sparkles, ArrowRight, Check,
  Bot, Palette, GitFork, FileText,
  UserCircle, Upload, Search, BarChart3,
} from "lucide-react";
import Link from "next/link";

/* ── Sparkline ─────────────────────────────────────────── */
const trendData = [10, 14, 12, 18, 16, 22, 28, 35, 42, 52, 61, 72];

function SparkLine() {
  const w = 100, h = 36;
  const max = Math.max(...trendData);
  const min = Math.min(...trendData);
  const pts = trendData.map((v, i) => {
    const x = (i / (trendData.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={pts.join(" ")} />
      <polygon fill="url(#sg)" points={`0,${h} ${pts.join(" ")} ${w},${h}`} />
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────────── */
const overpayments = [
  { Icon: Bot,      name: "ChatGPT Team Plan",        sub: "Usage doesn't match plan",  amt: "$6,480 /mo" },
  { Icon: Palette,  name: "Midjourney Standard Plan",  sub: "Unused GPU time",           amt: "$3,240 /mo" },
  { Icon: GitFork,  name: "GitHub Copilot",            sub: "Inactive seats detected",   amt: "$2,880 /mo" },
  { Icon: FileText, name: "Notion AI",                 sub: "Paying for add-ons unused", amt: "$1,920 /mo" },
];
const stackIcons = [Bot, Palette, GitFork, FileText];
const howSteps = [
  { Icon: Upload,    step: "1. Add your tools", desc: "Tell us what you use and what you pay" },
  { Icon: Search,    step: "2. We analyze",     desc: "Our AI compares plans, usage and industry data" },
  { Icon: BarChart3, step: "3. Get savings",    desc: "See overpayments and exact savings instantly" },
];

/* ── Hero ────────────────────────────────────────────────── */
export const Hero = () => {
  return (
    <div className="h-full flex overflow-hidden">

      {/* ══ LEFT HALF ══════════════════════════════════════════ */}
      <div className="w-1/2 h-full flex flex-col justify-center px-16 xl:px-20 shrink-0">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#ede9fe] text-[#6d28d9] text-[12px] font-semibold px-3 py-1 rounded-full mb-4 w-fit">
          <Sparkles size={12} className="fill-[#6d28d9]" />
          AI Spend Auditor for Modern Teams
        </div>

        {/* Headline */}
        <h1 className="text-[48px] font-extrabold leading-[1.08] tracking-[-2px] text-[#111] mb-3">
          Stop overpaying<br />
          for <span className="text-[#6d28d9]">AI tools.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[15px] text-[#555] leading-[1.6] mb-5 max-w-[340px]">
          TRACE audits your AI tool stack and tells you exactly where you&apos;re overpaying, how much, and how to fix it.
        </p>

        {/* Checklist */}
        <ul className="space-y-2 mb-6">
          {[
            "Know if you're on the right plan",
            "See where you're overpaying and by how much",
            "Get exact savings in $/month and $/year",
          ].map(t => (
            <li key={t} className="flex items-center gap-2.5 text-[14px] text-[#333]">
              <span className="w-[18px] h-[18px] shrink-0 rounded-full border-2 border-[#6d28d9] flex items-center justify-center">
                <Check size={10} strokeWidth={3} className="text-[#6d28d9]" />
              </span>
              {t}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-semibold text-[14px] px-5 py-2.5 rounded-xl transition-colors no-underline"
          >
            Run your free audit
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
          <button className="text-[14px] font-semibold text-[#111] border border-[#e5e7eb] hover:border-[#6d28d9] hover:bg-[#f5f3ff] px-5 py-2.5 rounded-xl transition-colors bg-white">
            See how it works
          </button>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {["#6d28d9", "#8b5cf6", "#a78bfa", "#c4b5fd"].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white" style={{ background: c, marginLeft: i > 0 ? "-7px" : "0" }} />
            ))}
          </div>
          <span className="text-[12px] text-[#666]">Trusted by teams saving thousands every month</span>
        </div>
      </div>

      {/* ══ RIGHT HALF ═════════════════════════════════════════ */}
      <div className="w-1/2 h-full flex gap-3 overflow-hidden px-6 xl:px-8 py-5">

        {/* MAIN CARDS COLUMN */}
        <div className="flex flex-col flex-1 gap-3 min-w-0 min-h-0">

          {/* Audit Overview */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] shrink-0">
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-bold text-[13.5px] text-[#111]">Audit Overview</span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full">
                Completed ✓
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-[#aaa] font-bold uppercase tracking-wider mb-1">Total Potential Savings</p>
                <p className="text-[26px] font-extrabold tracking-tight leading-none text-[#111]">
                  $24,540 <span className="text-[13px] font-medium text-[#999]">/month</span>
                </p>
                <p className="text-[12px] text-[#666] mt-1">$294,480 <span className="text-[#ccc] text-[11px]">/year</span></p>
              </div>
              <div className="text-right">
                <p className="text-[#15803d] text-[10.5px] font-bold mb-1">+$24,540</p>
                <SparkLine />
              </div>
            </div>
          </div>

          {/* Top Overpayments */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] flex-1 min-h-0 flex flex-col">
            <div className="flex justify-between items-center mb-2.5 shrink-0">
              <span className="font-bold text-[13.5px] text-[#111]">Top Overpayments</span>
              <Link href="#" className="text-[#6d28d9] text-[12px] font-semibold hover:underline no-underline">View all</Link>
            </div>
            <div className="flex flex-col justify-between flex-1 min-h-0">
              {overpayments.map((o, i) => (
                <div key={i} className={`flex items-center gap-2.5 py-1.5 ${i < overpayments.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="w-8 h-8 rounded-lg bg-[#f5f3ff] flex items-center justify-center shrink-0">
                    <o.Icon size={15} strokeWidth={2.5} className="text-[#6d28d9]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-[#111] truncate">{o.name}</p>
                    <p className="text-[10.5px] text-[#999] truncate">{o.sub}</p>
                  </div>
                  <span className="text-[#dc2626] font-bold text-[12px] shrink-0">{o.amt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How TRACE works */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] shrink-0">
            <p className="font-bold text-[13.5px] text-[#111] mb-3">How TRACE works</p>
            <div className="flex items-start">
              {howSteps.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                  {i < 2 && (
                    <div className="absolute top-[17px] left-[62%] flex items-center z-0">
                      <div className="h-[1.5px] w-[50%] bg-[#ddd6fe]" />
                      <ArrowRight size={10} strokeWidth={2.5} className="text-[#c4b5fd] -ml-1" />
                    </div>
                  )}
                  <div className="w-9 h-9 rounded-xl bg-[#6d28d9] flex items-center justify-center text-white mb-1.5 relative z-10 shadow-md shadow-[#6d28d9]/20">
                    <s.Icon size={16} strokeWidth={2.5} />
                  </div>
                  <p className="text-[10.5px] font-bold text-[#111] mb-0.5 leading-tight">{s.step}</p>
                  <p className="text-[9.5px] text-[#888] leading-tight px-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDE CARDS COLUMN */}
        <div className="w-[168px] shrink-0 flex flex-col gap-3 min-h-0">

          {/* Your Stack */}
          <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] shrink-0">
            <p className="font-bold text-[13px] text-[#111] mb-0.5">Your Stack</p>
            <p className="text-[10.5px] text-[#999] mb-2.5">11 tools analyzed</p>
            <div className="flex flex-wrap gap-1.5">
              {stackIcons.map((Ic, i) => (
                <div key={i} className="w-8 h-8 rounded-lg border border-gray-100 bg-white shadow-sm flex items-center justify-center">
                  <Ic size={14} strokeWidth={2} className="text-[#444]" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-lg bg-[#f5f3ff] border border-[#ede9fe] flex items-center justify-center text-[11px] font-bold text-[#6d28d9]">
                +7
              </div>
            </div>
          </div>

          {/* Profile card */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] shrink-0">
            <div className="h-[88px] bg-gradient-to-br from-[#ede9fe] to-[#ddd6fe] flex items-center justify-center">
              <div className="w-[52px] h-[52px] rounded-full border-[3px] border-white shadow-md bg-[#c4b5fd]/60 flex items-center justify-center">
                <UserCircle size={46} strokeWidth={1} className="text-[#6d28d9]" />
              </div>
            </div>
          </div>

          {/* Notification */}
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.07)] flex items-start gap-2 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-[#6d28d9] shrink-0 flex items-center justify-center mt-0.5">
              <div className="grid grid-cols-2 gap-[2px]">
                {[0,1,2,3].map(k => <div key={k} className="w-[3.5px] h-[3.5px] rounded-[1px] bg-white/90" />)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10.5px] font-bold text-[#111] leading-tight">TRACE found savings!</span>
                <span className="text-[8.5px] text-[#bbb] shrink-0 font-medium">Just now</span>
              </div>
              <p className="text-[9.5px] text-[#777] mt-0.5 leading-tight">You could save $24,540 /month across your 11 AI tools.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};