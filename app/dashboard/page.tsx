"use client";
import Dashboard from "@/components/dashboard/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-6xl font-syne font-black text-white tracking-tighter">
          System <span className="text-[#00ffd1]">Overview</span>
        </h1>
        <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.6em] mt-3">
          Melih-MacBook-Air // Neural_Kernel_Active
        </p>
      </header>
      <div className="h-[1px] w-full bg-white/5" />
      <Dashboard />
    </div>
  );
}
