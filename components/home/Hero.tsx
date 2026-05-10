import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 md:px-8 pt-36 pb-20">
      {/* Glowing Background Blobs */}
      <div className="absolute top-[20%] left-[20%] w-[400px] height-[400px] bg-radial-[circle,_var(--primary)_0%,_transparent_70%] blur-[80px] opacity-15 animate-float"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[500px] height-[500px] bg-radial-[circle,_var(--secondary)_0%,_transparent_70%] blur-[100px] opacity-15 animate-[float_12s_infinite_alternate-reverse]"></div>
      
      <div className="relative z-10 max-w-[900px] text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-[var(--card-border)] rounded-full text-xs font-semibold text-[var(--primary)] mb-10">
          <span className="w-2 h-2 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)] animate-pulse"></span>
          v2.0 Now Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-8">
          Stop Overpaying for <br />
          <span className="bg-gradient-to-r from-[var(--primary)] via-white to-[var(--secondary)] bg-clip-text text-transparent">AI Infrastructure</span>
        </h1>
        
        <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[620px] mx-auto mb-14">
          Trace AI audits your enterprise AI spend with surgical precision. 
          Identify orphaned seats, optimize token usage, and reclaim 30%+ of your budget in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-24">
          {/* Primary CTA */}
          <Link
            href="/audit"
            className="group flex items-center gap-2.5 px-8 py-3.5 bg-[var(--primary)] text-[var(--background)] rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_var(--primary-glow)] hover:bg-white"
          >
            Run Free Audit
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 px-8 py-3.5 bg-transparent border border-white/10 text-[var(--text-secondary)] rounded-xl font-medium text-sm tracking-wide backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:text-[var(--text-primary)]"
          >
            View Demo
          </Link>
        </div>
        
        <div className="w-full border-t border-white/[0.06] pt-10">
          <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
            <div className="flex flex-col items-center gap-1.5 px-6 py-2">
              <span className="text-2xl md:text-3xl font-black text-[var(--primary)] tabular-nums">$2.4M+</span>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.15em] font-medium">Monthly Savings</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-6 py-2">
              <span className="text-2xl md:text-3xl font-black text-[var(--primary)] tabular-nums">150+</span>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.15em] font-medium">Tools Audited</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-6 py-2">
              <span className="text-2xl md:text-3xl font-black text-[var(--primary)] tabular-nums">99.9%</span>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.15em] font-medium">Precision Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
