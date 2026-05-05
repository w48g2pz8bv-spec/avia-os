"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "../app-context";
import { useToast } from "@/lib/toast-context";
import PageHeader from "@/components/shared/page-header";
import { 
  Rocket, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Activity, 
  Layout, 
  MessageSquare, 
  Mic, 
  ArrowUpRight,
  MonitorCheck,
  Database,
  Cpu,
  Globe,
  Clock,
  UserCheck,
  Workflow,
  Sparkles,
  Brain,
  AlertCircle,
  Box
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { selectedSector, activityLogs, efficiencyStats, addActivity } = useApp();
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pipelineNodes = [
    { id: 'campaign', label: 'Campaign Start', icon: Rocket, detail: 'Summer Growth Active' },
    { id: 'builder', label: 'Auto-Architect', icon: Layout, detail: 'Dynamic Pages Ready' },
    { id: 'agent', label: 'Neural Agent', icon: Mic, detail: `${efficiencyStats.tasksCompleted / 10} Calls Handled` },
    { id: 'automation', label: 'Decision Engine', icon: Workflow, detail: 'Rulebooks Active' }
  ];

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader 
        title="Autonomous Command" 
        statusText={`Neural Loop: ACTIVE // ${efficiencyStats.hoursSaved} Human-Hours Saved`}
        action={
          <div className="flex items-center gap-4">
             <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <Clock size={12} className="text-[#00ffd1]" />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Efficiency: +${(efficiencyStats.successRate * 4).toFixed(0)}%</span>
             </div>
          </div>
        }
      />

      <div className="glass-panel p-10 mb-8 relative overflow-hidden bg-black/40">
        <div className="absolute inset-0 bg-[radial-gradient(#00ffd105_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
        <div className="flex items-center justify-between relative z-10">
          {pipelineNodes.map((node, i) => (
            <div key={node.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-4 group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-1000 ${
                  pulseIndex === i ? 'bg-[#00ffd1] border-[#00ffd1] text-black shadow-[0_0_40px_rgba(0,255,209,0.4)] scale-110' : 'bg-white/5 border-white/10 text-white/20'
                }`}>
                  <node.icon size={28} />
                </div>
                <div className="text-center">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${pulseIndex === i ? 'text-[#00ffd1]' : 'text-white/40'}`}>{node.label}</p>
                  <p className="text-[8px] font-mono text-white/20 uppercase italic">{node.detail}</p>
                </div>
              </div>
              {i < pipelineNodes.length - 1 && (
                <div className="flex-1 flex justify-center px-4">
                   <div className="h-px w-full bg-white/5 relative">
                      <div className={`absolute top-0 h-px bg-gradient-to-r from-transparent via-[#00ffd1] to-transparent transition-all duration-[3000ms] ${
                        pulseIndex === i ? 'w-full opacity-100' : 'w-0 opacity-0'
                      }`} />
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* PROACTIVE INTELLIGENCE COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           
           {/* PREDICTIVE GROWTH ENGINE */}
           <div className="glass-panel p-10 space-y-8 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffd1]/30 to-transparent" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#00ffd1]/5 rounded-full blur-[100px] group-hover:bg-[#00ffd1]/10 transition-all duration-1000" />
              
              <div className="flex items-center justify-between relative z-10">
                 <div className="space-y-1">
                    <h3 className="text-3xl font-syne font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
                        Neural Future Projections
                        <TrendingUp size={24} className="text-[#00ffd1] animate-bounce" />
                    </h3>
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Sector: {selectedSector.label} // Predictive_Mode: ACTIVE</p>
                 </div>
                 <button 
                    onClick={() => {
                        addActivity(`Simulating 30-Day Growth for ${selectedSector.label}...`, 'system');
                        toast("Synthesizing Market Data...", "info");
                    }}
                    className="flex items-center gap-3 bg-[#00ffd1] text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,209,0.3)]"
                 >
                    <Sparkles size={14} /> Simulate Growth
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                 {/* Visual Projection Chart */}
                 <div className="space-y-6 p-6 bg-black/40 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-end mb-8">
                        <div className="space-y-1">
                            <span className="text-[9px] font-mono text-white/20 uppercase">Conversion Lift</span>
                            <p className="text-2xl font-black text-[#00ffd1] tracking-tighter">+24.5% <span className="text-[10px] text-white/20 not-italic uppercase font-mono ml-2">Expected</span></p>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Confidence: 94%</span>
                        </div>
                    </div>
                    <div className="h-32 flex items-end gap-3 px-2 border-b border-white/5 pb-2">
                        {[40, 60, 45, 90, 70, 100, 85, 95, 110, 105].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05, duration: 1 }}
                                className={`flex-1 rounded-t-lg transition-all duration-500 ${i >= 7 ? 'bg-[#00ffd1] shadow-[0_0_20px_rgba(0,255,209,0.5)]' : 'bg-white/10 group-hover:bg-white/20'}`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-white/10 uppercase tracking-[0.3em]">
                        <span>Staging</span>
                        <span>Projection Window</span>
                        <span>Market Peak</span>
                    </div>
                 </div>

                 {/* Neural Recommendations */}
                 <div className="space-y-4">
                    {[
                        { label: 'Dynamic Scaling', desc: 'Predicted peak volume at 14:00. Auto-scaling Agent lab capacity.', icon: Zap, status: 'Active' },
                        { label: 'Sentiment Fix', desc: 'Pattern detected in reviews. Initiating auto-recovery loop.', icon: Brain, status: 'Queued' },
                        { label: 'Visual Pivot', desc: 'High-contrast DNA outperforms current builder state. Update ready.', icon: Layout, status: 'Ready' }
                    ].map((rec, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:border-[#00ffd1]/20 transition-all cursor-pointer group">
                            <div className="p-3 bg-black rounded-2xl text-white/20 group-hover:text-[#00ffd1] transition-all border border-white/5">
                                <rec.icon size={18} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-mono font-black text-white group-hover:text-[#00ffd1] transition-all uppercase tracking-widest">{rec.label}</h4>
                                    <span className="text-[8px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded">{rec.status}</span>
                                </div>
                                <p className="text-[10px] text-white/40 leading-relaxed italic">{rec.desc}</p>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* MATRIX SYNERGY MODULE */}
           <div className="glass-panel p-10 bg-black/40 relative">
              <div className="flex items-center gap-3 mb-10">
                 <Workflow size={20} className="text-[#00ffd1]" />
                 <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.5em] uppercase italic">Neural Synergy Matrix</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6 group hover:border-[#00ffd1]/20 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400"><MonitorCheck size={20} /></div>
                            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Builder ↔ Sync</span>
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-[#00ffd1] animate-pulse shadow-[0_0_10px_#00ffd1]" />
                    </div>
                    <p className="text-[11px] text-white/40 font-mono italic leading-relaxed">
                        "Every architectural shift in the Architect is being dynamically queued for production deployment."
                    </p>
                 </div>
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6 group hover:border-blue-400/20 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400"><MessageSquare size={20} /></div>
                            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Sentiment ↔ Auto</span>
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_#60a5fa]" />
                    </div>
                    <p className="text-[11px] text-white/40 font-mono italic leading-relaxed">
                        "AI is monitoring customer sentiment 24/7. Negative flags trigger auto-recovery sequences instantly."
                    </p>
                 </div>
              </div>
           </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-8">
           <div className="glass-panel p-8 space-y-8 bg-[#00ffd1]/5 border-[#00ffd1]/20">
              <div className="flex items-center gap-3">
                 <Workflow size={18} className="text-[#00ffd1]" />
                 <p className="text-[10px] font-mono font-black text-[#00ffd1] tracking-[0.4em] uppercase italic underline underline-offset-8">Pipeline_Health</p>
              </div>
              <div className="space-y-4">
                 {[
                    { label: 'Campaign Engine', pct: 100 },
                    { label: 'Website Architect', pct: 100 },
                    { label: 'Neural Voice Core', pct: (efficiencyStats.successRate - 4) },
                    { label: 'Decision Rulebook', pct: 100 }
                 ].map((p, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
                          <span className="text-white/40">{p.label}</span>
                          <span className="text-white/60 font-black">{p.pct.toFixed(0)}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00ffd1] transition-all duration-[2000ms]" style={{ width: `${p.pct}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
              <button 
                 onClick={() => router.push('/sync')}
                 className="w-full py-5 bg-[#00ffd1] text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_40px_rgba(0,255,209,0.2)] flex items-center justify-center gap-3"
              >
                 <ShieldCheck size={18} /> Authorize Deployment
              </button>
           </div>

           <div className="glass-panel p-8 space-y-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00ffd1]/5 to-transparent opacity-20" />
              <Globe size={32} className="mx-auto text-white/10 animate-pulse" />
              <div className="space-y-2 relative z-10">
                 <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] italic">Cluster_Sync_Active</p>
                 <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest leading-relaxed">
                    AIVA Neural OS is monitoring {selectedSector.label} 24/7 across 12 global nodes.
                 </p>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}