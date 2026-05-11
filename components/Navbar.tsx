"use client"

import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="h-full w-full bg-white border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-8 flex items-center h-full gap-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-[18px] text-[#111] tracking-tight shrink-0 no-underline">
          <div className="grid grid-cols-2 gap-[3px]">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-[9px] h-[9px] rounded-[2px] ${i < 2 ? "bg-[#5b21b6]" : "bg-[#a78bfa]"}`}
              />
            ))}
          </div>
          TRACE
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {["Product", "How it works", "Features", "Pricing", "Resources"].map(label => (
            <Link
              key={label}
              href="#"
              className="text-[14px] font-medium text-[#444] hover:text-[#6d28d9] transition-colors no-underline"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="#" className="text-[14px] font-medium text-[#444] hover:text-[#6d28d9] transition-colors no-underline">
            Sign in
          </Link>
          <Link
            href="#"
            className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl transition-colors no-underline"
          >
            Book a demo
          </Link>
        </div>
      </div>
    </nav>
  );
};