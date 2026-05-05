"use client";
import { motion } from "framer-motion";
import { Zap, Activity, Globe, Shield, Cpu, Terminal, BarChart3, Radio } from "lucide-react";
import dynamic from 'next/dynamic';
const TrafficChart = dynamic(() => import('./analytics-charts').then(mod => mod.TrafficChart), { ssr: false });

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-4 h-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. Main Neural Traffic (Large Bento) */}
      <div className="md:col-span-3 md:row-span-1 glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffd1]/20 to-transparent animate-scan" />
        <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
                <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-[0.4em] font-black">Neural_Traffic_Analysis</p>
                <h2 className="text-4xl font-syne font-black italic uppercase">142.8K <span className="text-xs text-white/20 not-italic">Nodes/sec</span></h2>
            </div>
            <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-[#00ffd1] animate-pulse" />
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Live_Connection</span>
            </div>
        </div>
        <div className="h-48">
            <TrafficChart />
        </div>
      </div>

      {/* 2. System Status (Small Bento) */}
      <div className="md:col-span-1 md:row-span-1 glass-panel p-8 flex flex-col justify-between group hover:border-[#00ffd1]/40 transition-all">
        <div className="space-y-4">
            <Cpu size={24} className="text-[#00ffd1] opacity-50 group-hover:opacity-100 transition-opacity" />
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">System Stability Index</p>
        </div>
        <div>
            <div className="text-5xl font-syne font-black text-white italic">99<span className="text-xl text-[#00ffd1]">.8%</span></div>
            <p className="text-[8px] font-mono text-[#00ffd1]/40 mt-2 uppercase tracking-tighter">Architecture v4.5.2 Stable</p>
        </div>
      </div>

      {/* 3. Activity Feed (Medium Bento) */}
      <div className="md:col-span-2 md:row-span-1 glass-panel p-8 overflow-hidden relative group">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Terminal size={14} className="text-white/20" />
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Protocol_Log</p>
            </div>
            <Radio size={12} className="text-red-500 animate-pulse" />
         </div>
         <div className="space-y-4 font-mono text-[9px] text-white/40 uppercase">
            {[
                { time: "14:22:01", msg: "Neural Link Established with Sector_Dental" },
                { time: "14:21:44", msg: "AI Builder: Template Rendered in 1.2s" },
                { time: "14:19:32", msg: "Cloud Sync: Node 04 Response Optimized" }
            ].map((log, i) => (
                <div key={i} className="flex gap-4 border-b border-white/5 pb-3">
                    <span className="text-[#00ffd1]/40">[{log.time}]</span>
                    <span className="truncate">{log.msg}</span>
                </div>
            ))}
         </div>
      </div>

      {/* 4. Global Reach (Medium Bento) */}
      <div className="md:col-span-2 md:row-span-1 glass-panel p-8 group relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#8b6cff]/5 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
                <Globe size={18} className="text-white/20 group-hover:rotate-90 transition-transform duration-1000" />
                <div className="text-right">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Active Regions</p>
                    <p className="text-xl font-syne font-black italic">GLOBAL_SYNC</p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.random() * 100}%` }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            className="h-full bg-[#00ffd1]/40"
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
}

