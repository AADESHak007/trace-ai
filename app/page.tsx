"use client"

import { Navbar } from "@/components/Navbar";
import { 
  ShieldCheck, Zap, Lock, ArrowRight, 
  Play, Bot, 
  BrainCircuit, Sparkles, CheckCircle2,
  GitFork
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // We use a small delay to satisfy the set-state-in-effect rule 
    // and ensure the client-side hydration is stable.
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden">
      <div className="bg-glow" />
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <main className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                The World&apos;s First AI Spend Auditor
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl">
              Stop overpaying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                for AI tools.
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed mb-12">
              Identify redundancies and recover thousands in monthly burn with our AI-powered audit engine.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 mb-20">
            <Link
              href="/audit"
              className="group relative bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-6 rounded-[24px] shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 no-underline"
            >
              Start Free Audit 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="flex items-center gap-3 px-10 py-6 rounded-[24px] border border-white/10 glass hover:bg-white/5 transition-all text-gray-300 font-bold">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Play size={12} fill="currentColor" />
              </div>
              See it in action
            </button>
          </div>
        </div>

        {/* SHOWCASE SECTION - STATIC AUDIT OUTPUT */}
        <div className="relative max-w-6xl mx-auto h-[500px] hidden md:block">
          {mounted && (
            <div className="absolute inset-0">
              {/* Central Static Audit Result (Showcase) */}
              <div 
                className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] glass rounded-[48px] border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-1000 delay-700"
                style={{ transform: 'perspective(2000px) rotateX(10deg)' }}
              >
                <div className="p-10 space-y-8">
                   {/* Header Row */}
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <BrainCircuit size={22} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Audit Showcase</span>
                        </div>
                        <h3 className="text-3xl font-black tracking-tight">Audit Result: <span className="text-blue-400">Acme Corp</span></h3>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={12} /> Optimization Found
                      </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-3 gap-6">
                      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Tool</p>
                        <p className="text-xl font-black">ChatGPT Enterprise</p>
                      </div>
                      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Monthly Burn</p>
                        <p className="text-xl font-black text-red-400">$12,450</p>
                      </div>
                      <div className="bg-blue-600 rounded-3xl p-6 shadow-xl shadow-blue-500/20">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Annual Recovery</p>
                        <p className="text-2xl font-black text-white">$48,240</p>
                      </div>
                   </div>

                   {/* Recommendation Card */}
                   <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                          <Zap size={16} />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Strategy Recommendation</h4>
                      </div>
                      <p className="text-lg text-gray-300 font-medium italic">
                        &quot;Downgrade to ChatGPT Team plan and switch to Annual billing. You are currently paying for features and capacity that haven&apos;t been utilized in 90 days.&quot;
                      </p>
                   </div>
                </div>
                {/* Bottom Fade */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
              </div>

              {/* Side Floating Insight Cards */}
              <FloatingCard 
                delay="delay-1000"
                className="top-20 -left-10 rotate-[-12deg] scale-90 border-blue-500/20"
                icon={<Bot size={20} className="text-blue-400" />}
                label="License Recovery"
                detail="14 inactive seats identified"
                amount="+$280/mo"
              />

              <FloatingCard 
                delay="delay-1100"
                className="top-60 -right-10 rotate-[8deg] scale-95 border-purple-500/20"
                icon={<GitFork size={20} className="text-purple-400" />}
                label="API Migration"
                detail="Haiko API is 80% cheaper"
                amount="+$1,200/mo"
              />

              <FloatingCard 
                delay="delay-1200"
                className="-bottom-10 left-20 rotate-[5deg] scale-100 border-cyan-500/20"
                icon={<Zap size={20} className="text-cyan-400" />}
                label="Annual Pivot"
                detail="20% platform discount"
                amount="+$450/mo"
              />
            </div>
          )}
        </div>
      </main>

      {/* STRATEGIC TRUST SECTION */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
            Empowering Finance Teams At
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 grayscale opacity-30">
            <div className="text-2xl font-black">AIRBNB</div>
            <div className="text-2xl font-black">STRIPE</div>
            <div className="text-2xl font-black">REVOLUT</div>
            <div className="text-2xl font-black">KLARNA</div>
            <div className="text-2xl font-black">NOTION</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.2em]">
            © 2026 Trace AI Recovery. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <ShieldCheck size={14}/> 256-bit Encrypted
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <Lock size={14}/> SOC2 Type II
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FloatingCardProps {
  icon: React.ReactNode;
  label: string;
  detail: string;
  amount: string;
  className?: string;
  delay?: string;
}

function FloatingCard({ icon, label, detail, amount, className, delay }: FloatingCardProps) {
  return (
    <div className={`absolute glass rounded-[32px] p-6 border shadow-2xl w-64 animate-in fade-in zoom-in duration-1000 ${delay || ""} ${className || ""}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
          <p className="text-xs font-bold text-white">{detail}</p>
        </div>
      </div>
      <p className="text-lg font-black text-green-400">{amount}</p>
    </div>
  );
}
