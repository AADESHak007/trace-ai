"use client"

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="h-20 w-full glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-full gap-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-black text-xl text-white tracking-tighter shrink-0 no-underline">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-md bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
            <div className="w-5 h-5 rounded-md bg-blue-400 opacity-80" />
          </div>
          TRACE
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {["Audit Engine",].map(label => (
            <Link
              key={label}
              href="#"
              className="text-[13px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all no-underline"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="#"
            className="bg-white hover:bg-blue-50 text-blue-600 text-[13px] font-black px-6 py-3 rounded-xl transition-all no-underline shadow-xl shadow-blue-500/10"
          >
            FREE AUDIT
          </Link>
        </div>
      </div>
    </nav>
  );
};