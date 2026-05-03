"use client";
import { motion } from "framer-motion";
import { TrendingUp, Users, Activity, Target, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const metrics = [
    { label: "Neural Traffic", val: "142.8K", icon: Users, color: "#00ffd1" },
    { label: "AI Efficiency", val: "99.2%", icon: Activity, color: "#8b6cff" },
    { label: "Conversion Rate", val: "12.4%", icon: Target, color: "#ffcf00" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 hover:border-[#00ffd1]/40 transition-all">
            <ArrowLeft className="h-5 w-5 text-white/40" />
          </Link>
          <h1 className="text-4xl font-syne font-black text-white">Data <span className="text-[#00ffd1]">Intelligence</span></h1>
        </div>
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">System_Uptime: 99.9%</div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-white/5">
                <m.icon className="h-5 w-5" style={{ color: m.color }} />
              </div>
              <span className="text-[10px] font-mono text-accent">+4.2%</span>
            </div>
            <div className="text-[8px] font-mono text-white/20 uppercase mb-2">{m.label}</div>
            <div className="text-4xl font-syne font-black text-white">{m.val}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-12 rounded-[4rem] border border-white/5 bg-black/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <TrendingUp className="h-64 w-64 text-accent" />
        </div>
        <div className="relative z-10">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.6em] mb-12">Growth_Trajectory_Live</div>
          <div className="flex items-end gap-3 h-64">
            {[...Array(24)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }} 
                animate={{ height: `${20 + Math.random() * 80}%` }} 
                transition={{ duration: 1.5, delay: i * 0.05 }}
                className="flex-1 bg-gradient-to-t from-accent/5 to-accent/40 rounded-t-lg" 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
