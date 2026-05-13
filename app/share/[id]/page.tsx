import { prisma } from "@/lib/prisma";
import { TOOL_PRICING } from "@/lib/data/pricing";
import { Metadata } from "next";
import { 
  TrendingUp, Zap, ArrowRight, 
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

type Props = {
  params: Promise<{ id: string }>;
};

// 1. Dynamic Metadata for Social Sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await prisma.audit.findUnique({
    where: { id },
    select: {
      input_tool: true,
      output_annual_saving: true,
      output_recommendation: true,
    }
  });

  if (!audit) return { title: "Audit Not Found | Trace AI" };

  const savings = Number(audit.output_annual_saving || 0).toLocaleString();
  const toolName = TOOL_PRICING[audit.input_tool]?.name || audit.input_tool;

  return {
    title: `I found $${savings} in annual ${toolName} overpayments!`,
    description: audit.output_recommendation || "Run your own AI audit to see how much you can save.",
    openGraph: {
      title: `Audit Result: $${savings}/year Saved`,
      description: `Analyzing ${toolName} stack. Run your own audit in 60 seconds.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Audit Result: $${savings}/year Saved`,
      description: `Run your own AI audit on Trace AI.`,
    }
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const audit = await prisma.audit.findUnique({
    where: { id },
  });

  if (!audit || audit.status !== "completed") {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-[#6d28d9]/20 rounded-full animate-ping absolute inset-0" />
            <div className="w-16 h-16 border-4 border-[#6d28d9] border-t-transparent rounded-full animate-spin relative z-10" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-gray-400">Decrypting Audit...</h1>
        </div>
      </div>
    );
  }

  const toolName = TOOL_PRICING[audit.input_tool]?.name || audit.input_tool;
  const savingsAnnual = Number(audit.output_annual_saving || 0);
  const aiSummary = (audit.llm_raw_response as { summary?: string })?.summary || audit.output_recommendation;

  return (
    <div className="h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col relative">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6d28d9]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10b981]/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      <main className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full relative z-10 flex flex-col gap-6">
        
        {/* TOP ROW: Header & Primary Savings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[35%] min-h-[280px]">
          {/* Headline Panel */}
          <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-[32px] p-10 flex flex-col justify-center backdrop-blur-md relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={180} className="text-[#6d28d9]" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#6d28d9]">
                Live Performance Audit
              </div>
              <h1 className="text-[36px] md:text-[54px] font-black leading-[1.05] tracking-tighter">
                Recover <span className="text-[#10b981]">${savingsAnnual.toLocaleString()}</span>/year <br/> from this {toolName} stack.
              </h1>
            </div>
          </div>

          {/* Quick Metrics Panel */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#6d28d9] to-[#4c1d95] rounded-[32px] p-8 flex flex-col justify-between shadow-2xl shadow-[#6d28d9]/20 relative overflow-hidden group">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             <div className="relative z-10">
               <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Financial Impact</p>
               <h2 className="text-[48px] font-black tracking-tighter">${savingsAnnual.toLocaleString()}</h2>
             </div>
             <div className="relative z-10 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between text-[12px] font-bold mb-2">
                  <span>Efficiency Score</span>
                  <span className="text-[#10b981]">62%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-white w-[62%] animate-pulse" />
                </div>
             </div>
          </div>
        </div>

        {/* BOTTOM ROW: The Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* STRATEGY (Large) */}
          <div className="lg:col-span-6 bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-md flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#6d28d9]/20 text-[#6d28d9] flex items-center justify-center border border-[#6d28d9]/30">
                <BrainCircuit size={18} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">AI Intelligence Report</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
              <p className="text-[17px] md:text-[19px] text-gray-200 leading-[1.7] font-medium italic">
                &quot;{aiSummary}&quot;
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
              Generated by Trace Engine v4.2
            </div>
          </div>

          {/* STACK PROFILE */}
          <div className="lg:col-span-3 bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-md flex flex-col justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Stack Context</h3>
            <div className="space-y-6">
              {[
                { label: "Deployment", value: toolName },
                { label: "Tier", value: audit.input_plan, highlight: true },
                { label: "Seat Count", value: `${audit.input_team_size} Units` },
                { label: "Monthly Burn", value: `$${Number(audit.input_actual_billing || 0).toLocaleString()}`, danger: true },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                  <span className={`text-[16px] font-black ${item.highlight ? 'text-[#6d28d9] capitalize' : item.danger ? 'text-red-500' : 'text-white'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* VIRAL CTA */}
          <div className="lg:col-span-3 bg-[#6d28d9] rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer border border-white/20">
            <Link href="/audit" className="absolute inset-0 z-10" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-20 space-y-6">
              <div className="w-16 h-16 bg-white text-[#6d28d9] rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500">
                <TrendingUp size={32} />
              </div>
              <div>
                <h3 className="text-[20px] font-black leading-tight mb-2">Run Your Own Audit</h3>
                <p className="text-white/70 text-[13px] font-medium px-4">See how much your team is leaving on the table.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest">
                Start Analysis <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] px-4">
          <span>&copy; 2026 Trace AI by Credex</span>
          <div className="flex gap-6">
            <span>Security Encrypted</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </main>
    </div>
  );
}
