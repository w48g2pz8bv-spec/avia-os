"use client";
import { useState, useEffect, useMemo } from "react";
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
  Box,
  ChevronRight,
  Terminal,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { selectedSector, activityLogs, efficiencyStats, addActivity, analyticsEvents, trackEvent, supabase, autonomousPlanning } = useApp();
  const [realStats, setRealStats] = useState({ vapiCalls: 0, automationRuns: 0, memoryVectors: 0 });
  const [omniCommand, setOmniCommand] = useState("");
  const [omniResponse, setOmniResponse] = useState<string | null>(null);
  const [isOmniThinking, setIsOmniThinking] = useState(false);
  const [neuralPlan, setNeuralPlan] = useState<any>(null);

  // LOAD REAL DATA FOR DASHBOARD
  useEffect(() => {
    const fetchRealData = async () => {
        if (!supabase) return;
        const [{ count: vapiCount }, { count: autoCount }, { count: vectorCount }] = await Promise.all([
            supabase.from('vapi_calls').select('*', { count: 'exact', head: true }),
            supabase.from('automation_logs').select('*', { count: 'exact', head: true }),
            supabase.from('document_chunks').select('*', { count: 'exact', head: true })
        ]);
        setRealStats({
            vapiCalls: vapiCount || 0,
            automationRuns: autoCount || 0,
            memoryVectors: vectorCount || 0
        });
    };
    fetchRealData();
  }, [supabase]);

  // SITUATION AWARENESS: Auto-trigger planning for anomalies
  useEffect(() => {
    const detectAndPlan = async () => {
        if (efficiencyStats.conversionRate < 10) { // e.g. Anomaly detected
            const plan = await autonomousPlanning("Low lead conversion detected in regional nodes. Need aggressive multi-platform recovery strategy.");
            setNeuralPlan(plan);
        }
    };
    detectAndPlan();
  }, [efficiencyStats.conversionRate]);

  const neuralROI = useMemo(() => {
    const hoursSaved = (efficiencyStats.tasksCompleted * 0.5).toFixed(1);
    const estimatedValue = (efficiencyStats.tasksCompleted * 45).toLocaleString();
    return { hoursSaved, estimatedValue };
  }, [efficiencyStats]);

  const dynamicInsights = useMemo(() => {
    const insights = [];
    
    // Injected Intelligence
    insights.push({ 
        id: 'anomaly',
        type: 'ANOMALY', 
        title: 'Conversion Dip Detected', 
        desc: neuralPlan ? "Neural Planner has formulated a recovery strategy." : "AIVA is analyzing current bottleneck nodes.", 
        icon: AlertCircle, 
        action: neuralPlan ? "Apply Neural Strategy" : "Analyzing..."
    });

    const ctaClicks = analyticsEvents.filter(e => e.name === 'cta_click').length;
    const newLeads = 0; // leads.filter(l => l.status === 'New').length;

    if (newLeads > 0) {
        insights.push({
            id: 'leads',
            title: `PROBLEM: Düşük Müşteri Akışı Saptandı`,
            desc: `ÇÖZÜM: Neural Scraper bölgeyi taradı ve ${newLeads} yüksek potansiyelli aday buldu. Otomatik teklif sürecini başlatmak ister misin?`,
            icon: Sparkles,
            action: 'Sorunu Gider'
        });
    }

    if (ctaClicks > 5) {
        insights.push({
            id: 'conversion',
            title: 'DARBOĞAZ: Manuel Randevu Kayıpları',
            desc: `Web sitende yüksek trafik var ama randevular manuel. Vapi sesli asistanını 7/24 aktif ederek bu kaçağı sıfırlayalım.`,
            icon: Zap,
            action: 'Otonom Çözümü Devreye Al'
        });
    }

    if (insights.length === 0) {
        insights.push({
            id: 'baseline',
            title: 'Sistem Durumu: Optimizasyon Gerekmiyor',
            desc: 'Şu an sistem %98 verimlilikle çalışıyor. AI ajanların tüm süreçleri sorunsuz yönetiyor.',
            icon: ShieldCheck,
            action: 'Derin Taramayı Başlat'
        });
    }

    return insights;
  }, [analyticsEvents, efficiencyStats, neuralPlan]);

  const handleOmniSubmit = async () => {
    if (!omniCommand.trim() || isOmniThinking) return;
    setIsOmniThinking(true);
    setOmniResponse(null);
    try {
        const res = await fetch('/api/omni', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: omniCommand, context: realStats })
        });
        const data = await res.json();
        setOmniResponse(data.reply);
        setOmniCommand("");
    } catch (e: any) {
        toast(`Omni Error: ${e.message}`, "error");
    } finally {
        setIsOmniThinking(false);
    }
  };

  const handleExecuteAction = async (id: string) => {
    addActivity(`Neural Execution Authorized: ${id}`, 'system');
    toast(`Executing AI Strategy: ${id}`, "success");
    await trackEvent('advisor_action_execute', { insight_id: id });
    
    if (id === 'leads') router.push('/reviews');
    if (id === 'conversion') router.push('/vapi');
  };

  const pipelineNodes = [
    { id: 'campaign', label: 'Campaign Start', icon: Rocket, detail: 'Summer Growth Active' },
    { id: 'builder', label: 'Auto-Architect', icon: Layout, detail: 'Dynamic Pages Ready' },
    { id: 'agent', label: 'Neural Agent', icon: Mic, detail: `${efficiencyStats.tasksCompleted / 10} Calls Handled` },
    { id: 'automation', label: 'Decision Engine', icon: Workflow, detail: 'Rulebooks Active' }
  ];

  return (
    <div className="animate-in fade-in duration-1000">
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

      {/* OMNI-COMMAND LINE (NATURAL LANGUAGE TERMINAL) */}
      <div className="glass-panel p-8 mb-8 relative overflow-hidden bg-black/60 border border-[#00ffd1]/20">
         <div className="absolute inset-0 bg-[radial-gradient(#00ffd110_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
         <div className="relative z-10 flex flex-col gap-4">
             <div className="flex items-center gap-3 mb-2">
                 <Terminal size={18} className="text-[#00ffd1]" />
                 <h2 className="text-[10px] font-mono font-black text-[#00ffd1] uppercase tracking-[0.4em] italic">Omni-Command // God Mode</h2>
             </div>
             
             {omniResponse && (
                 <div className="p-4 bg-[#00ffd1]/10 border border-[#00ffd1]/30 rounded-xl mb-4">
                     <p className="text-xs font-mono text-[#00ffd1] whitespace-pre-line">{omniResponse}</p>
                 </div>
             )}
             
             <div className="relative">
                 <input 
                    type="text"
                    value={omniCommand}
                    onChange={e => setOmniCommand(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleOmniSubmit()}
                    placeholder="E.g., 'Sistemin genel durumunu özetle' veya 'Bugün kaç çağrı yaptık?'"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-6 pr-40 text-sm font-mono text-white placeholder:text-white/20 outline-none focus:border-[#00ffd1]/40 focus:bg-[#00ffd1]/5 transition-all shadow-inner"
                    disabled={isOmniThinking}
                 />
                 <button 
                    onClick={handleOmniSubmit}
                    disabled={isOmniThinking || !omniCommand.trim()}
                    className="absolute right-3 top-3 bottom-3 bg-[#00ffd1] text-black px-8 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,209,0.3)] disabled:opacity-50"
                 >
                     {isOmniThinking ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} 
                     {isOmniThinking ? 'Executing...' : 'Execute'}
                 </button>
             </div>
         </div>
      </div>

      {/* THE LIVE AUTONOMY STREAM (CROSS-MODULE MATRIX) */}
      <div className="glass-panel p-6 mb-8 bg-black/80 font-mono relative overflow-hidden border-l-4 border-[#00ffd1]">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Activity size={16} className="text-[#00ffd1]" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Live Autonomy Stream</span>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-[#00ffd1] uppercase animate-pulse">
                <div className="w-1.5 h-1.5 bg-[#00ffd1] rounded-full" /> Synchronizing 4 Modules
            </div>
        </div>
        <div className="h-24 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
            <div className="space-y-2 animate-slide-up">
                <p className="text-[10px] text-white/60"><span className="text-indigo-400">[VAPI]</span> Analyzing Call #4812... User objected to pricing.</p>
                <p className="text-[10px] text-white/60"><span className="text-emerald-400">[KNOWLEDGE_BASE]</span> Generating new 'Financing Options' objection handler.</p>
                <p className="text-[10px] text-[#00ffd1] font-bold"><span className="text-amber-400">[BUILDER]</span> Autonomously injected 10% Discount Banner to Homepage.</p>
                <p className="text-[10px] text-white/60"><span className="text-red-400">[AUTOMATIONS]</span> Pushed lead to 'High-Ticket Nurture' workflow.</p>
                <p className="text-[10px] text-white/60"><span className="text-indigo-400">[VAPI]</span> Dialing next lead in queue (Confidence: 84%)...</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* PROACTIVE INTELLIGENCE COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           
           {/* NEURAL ROI & BUSINESS VALUE MATRIX */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel p-8 space-y-6 bg-[#00ffd1]/5 border-[#00ffd1]/20 group hover:bg-[#00ffd1]/10 transition-all duration-700">
                  <div className="flex items-center gap-3">
                      <Cpu size={18} className="text-[#00ffd1]" />
                      <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.4em] uppercase italic">Saved Man-Hours</h3>
                  </div>
                  <div className="flex items-end justify-between">
                      <p className="text-5xl font-black text-white italic tracking-tighter">+{neuralROI.hoursSaved}h</p>
                      <div className="text-right">
                          <p className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest font-black">Efficiency Lift</p>
                          <p className="text-xs font-bold text-white/60">+84%</p>
                      </div>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '84%' }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-transparent via-[#00ffd1] to-[#00ffd1] shadow-[0_0_20px_rgba(0,255,209,0.5)]"
                      />
                  </div>
                  <p className="text-[9px] font-mono text-white/20 italic">AIVA has autonomously handled {efficiencyStats.tasksCompleted} repetitive business nodes.</p>
              </div>

              <div className="glass-panel p-8 space-y-6 bg-amber-500/5 border-amber-500/20 group hover:bg-amber-500/10 transition-all duration-700">
                  <div className="flex items-center gap-3">
                      <Rocket size={18} className="text-amber-500" />
                      <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.4em] uppercase italic">Estimated Growth Value</h3>
                  </div>
                  <div className="flex items-end justify-between">
                      <p className="text-5xl font-black text-white italic tracking-tighter">${neuralROI.estimatedValue}</p>
                      <div className="text-right">
                          <p className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-black">Active ROI</p>
                          <p className="text-xs font-bold text-white/60">4.8x Cap</p>
                      </div>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '62%' }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-transparent via-amber-500 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                      />
                  </div>
                  <p className="text-[9px] font-mono text-white/20 italic">Based on current lead velocity and conversion optimization loops.</p>
              </div>
           </div>

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

           {/* NEURAL ADVISOR - SELF HEALING UI */}
           <div className="glass-panel p-10 bg-black/40 relative border-l-4 border-l-[#00ffd1] overflow-hidden">
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#00ffd1]/5 rounded-full blur-[80px]" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex items-center gap-3">
                    <Brain size={20} className="text-[#00ffd1] animate-pulse" />
                    <h3 className="text-[10px] font-mono font-black text-white/60 tracking-[0.4em] uppercase italic">Neural Advisor Core</h3>
                 </div>
                 <span className="text-[8px] font-mono text-[#00ffd1] bg-[#00ffd1]/10 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Scanning Active...</span>
              </div>
              
              <div className="space-y-6 relative z-10">
                 {dynamicInsights.map((advice, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-[#00ffd1]/20 transition-all group">
                       <div className="p-4 bg-black rounded-2xl text-[#00ffd1] group-hover:scale-110 transition-transform h-fit">
                          <advice.icon size={22} />
                       </div>
                       <div className="flex-1 space-y-2">
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">{advice.title}</h4>
                          <p className="text-[11px] text-white/40 leading-relaxed italic">{advice.desc}</p>
                          <div className="pt-2">
                             <button 
                                onClick={() => handleExecuteAction(advice.id)}
                                className="text-[9px] font-mono font-black text-[#00ffd1] uppercase tracking-widest hover:underline flex items-center gap-2"
                             >
                                {advice.action} <ChevronRight size={12} />
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* MATRIX SYNERGY MODULE */}
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-8">
           <div className="glass-panel p-8 space-y-8 bg-[#00ffd1]/5 border-[#00ffd1]/20">
              <div className="flex items-center gap-3">
                 <Workflow size={18} className="text-[#00ffd1]" />
                 <p className="text-[10px] font-mono font-black text-[#00ffd1] tracking-[0.4em] uppercase italic underline underline-offset-8">Pipeline_Health</p>
              </div>
              <div className="space-y-4">
                 {[
                    { label: 'Neural Voice Calls', val: realStats.vapiCalls },
                    { label: 'Automation Executions', val: realStats.automationRuns },
                    { label: 'Knowledge Vectors', val: realStats.memoryVectors }
                 ].map((p, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
                          <span className="text-white/40">{p.label}</span>
                          <span className="text-[#00ffd1] font-black text-sm">{p.val} <span className="text-[7px] text-white/30 ml-1">UNITS</span></span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-transparent to-[#00ffd1] transition-all duration-[2000ms]" style={{ width: `100%` }} />
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