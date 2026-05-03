"use client";
import { motion } from "framer-motion";
import { Zap, Activity, Globe, Shield } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Neural Traffic", val: "142K", change: "+12.4%", icon: Zap },
    { label: "AI Response", val: "99.8%", change: "Stable", icon: Activity },
    { label: "Sync Nodes", val: "24", change: "+4", icon: Globe }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="glass-panel p-10 relative overflow-hidden group border-white/5 hover:border-[#00ffd1]/30 transition-all">
            <div className="text-[10px] font-mono text-white/20 uppercase mb-6 tracking-widest">{s.label}</div>
            <div className="flex justify-between items-end">
              <span className="text-5xl font-syne font-black text-white">{s.val}</span>
              <span className="text-[10px] font-mono text-[#00ffd1] bg-[#00ffd1]/10 px-3 py-1 rounded-full">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-10 border-white/5">
        <div className="flex items-center gap-3 mb-10">
          <Shield className="text-[#00ffd1]" size={18} />
          <h3 className="text-sm font-syne font-bold uppercase tracking-[0.4em]">Neural_Activity_Feed</h3>
        </div>
        <div className="space-y-4">
          {[
            "AI Agent successfully processed dental lead for +90 532...",
            "Web Architect generated SEO-optimized template.",
            "Content Distro rendered batch: shorts_pack_v4.mp4"
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 font-mono text-[10px] text-white/40">
              <span className="text-[#00ffd1]">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
