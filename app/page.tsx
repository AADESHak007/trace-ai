"use client"

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ShieldCheck, Zap, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-white text-[#111] overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .shimmer { animation: shimmer 1.5s infinite; background: linear-gradient(90deg,#f0ebff 25%,#ddd6fe 50%,#f0ebff 75%); background-size: 200% 100%; }
      `}</style>

      {/* NAVBAR — 10vh */}
      <div className="h-[10vh] shrink-0">
        <Navbar />
      </div>

      {/* HERO — 80vh */}
      <div className="h-[80vh] shrink-0">
        <Hero />
      </div>

      {/* FOOTER — 10vh */}
      <footer className="h-[10vh] shrink-0 border-t border-gray-100 bg-white flex flex-col items-center justify-center gap-2">
        <p className="text-[12px] text-[#888]">No sign-up. No credit card. Just the numbers.</p>
        <div className="flex items-center gap-8">
          {[
            { Icon: ShieldCheck, label: "100% Free" },
            { Icon: Zap,         label: "Results in minutes" },
            { Icon: Lock,        label: "Your data stays private" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[13px] text-[#555] font-medium">
              <Icon size={14} className="text-[#888]" /> {label}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
