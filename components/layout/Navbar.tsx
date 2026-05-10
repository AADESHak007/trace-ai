import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-16 flex items-center justify-between px-8 rounded-2xl z-[1000] glass">
      <Link href="/" className="text-xl font-black tracking-tight text-[var(--text-primary)]">
        TRACE <span className="text-[var(--primary)] drop-shadow-[0_0_8px_var(--primary-glow)]">AI</span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link href="/audit" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Services</Link>
        <Link href="/audit" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Pricing</Link>

        {/* Premium bordered CTA */}
        <Link
          href="/audit"
          className="relative group flex items-center gap-2 px-5 py-2 rounded-xl border border-[var(--primary)] text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-[var(--background)] hover:shadow-[0_0_24px_var(--primary-glow)] hover:-translate-y-0.5"
        >
          {/* Subtle inner glow layer */}
          <span className="absolute inset-0 rounded-xl bg-[var(--primary)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <span>Start Audit</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </nav>
  );
};

