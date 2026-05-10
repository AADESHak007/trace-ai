import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--background)]">
      <Navbar />
      <Hero />
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-[1]"></div>
      <div className="fixed inset-0 bg-radial-[circle_at_center,_transparent_0%,_rgba(3,5,8,0.8)_100%] pointer-events-none z-[2]"></div>
    </main>
  );
}
