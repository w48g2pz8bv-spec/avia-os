"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { 
  Target, 
  TrendingUp, 
  Search, 
  Zap, 
  Globe, 
  ChevronRight, 
  ArrowUpRight, 
  Activity, 
  Cpu, 
  BarChart3,
  Dna,
  Radar,
  Sword,
  Gem,
  ArrowRight,
  Database,
  Terminal,
  Layers,
  BrainCircuit,
  ShieldAlert,
  Flame,
  Scale
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function IntelligencePage() {
  const { selectedSector, activityLogs, toast } = useApp();

  const [activeTab, setActiveTab] = useState("COMPETITORS");
  const [isScanning, setIsScanning] = useState(false);

  const [competitors, setCompetitors] = useState<any[]>([]);
  const [inferenceLogs, setInferenceLogs] = useState<string[]>([]);
  const [knowledgeContext, setKnowledgeContext] = useState("");
  const [marketInsights, setMarketInsights] = useState<any>({
    dominanceLevel: "ANALYZING",
    growthPotential: "0%",
    summary: "Initiate probe to see market insights..."
  });

  // Fetch Knowledge Base for Context
  useEffect(() => {
    const fetchKB = async () => {
        const { data } = await supabase.from('documents').select('content').limit(5);
        if (data) {
            setKnowledgeContext(data.map(d => d.content).join("\n"));
        }
    };
    fetchKB();
  }, []);

  const handleDeepProbe = async () => {
    setIsScanning(true);
    setInferenceLogs(prev => [`[BRAIN] Accessing Knowledge Base...`, `[SYSTEM] Analyzing ${selectedSector.label} market with corporate memory...`, ...prev]);
    toast(`Syncing Corporate Memory for Probe...`, "info");
    
    try {
        const res = await fetch('/api/intelligence/probe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sector: selectedSector.label,
                context: knowledgeContext || "Generic Industry Data"
            })
        });
        const data = await res.json();
        
        if (data.competitors) {
            setCompetitors(data.competitors);
            setMarketInsights(data.marketInsights);
            setInferenceLogs(prev => [
                `[INTEL] Found ${data.competitors.length} major competitors.`,
                `[BRAIN] Strategy mapped: ${data.marketInsights.dominanceLevel} approach selected.`,
                ...prev
            ]);
            toast("Cross-Competitor Analysis Complete", "success");
            addActivity(`${selectedSector.label} sektörü için derin rakip analizi tamamlandı.`, 'agent');
        }
    } catch (error) {
        toast("Analysis failed", "error");
    } finally {
        setIsScanning(false);
    }
  };

  // Initial scan
  useEffect(() => {
    if (competitors.length === 0 && !isScanning) {
        handleDeepProbe();
    }
  }, [selectedSector]);

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000 pb-20">
      <PageHeader 
        title="Intelligence HQ" 
        statusText={`Market Analysis: DEEP // Competitors Tracked: ${competitors.length} // Dominance: ELITE`}
        action={
            <button 
                onClick={handleDeepProbe}
                disabled={isScanning}
                className="flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all bg-white text-black hover:bg-[#00ffd1] shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
                {isScanning ? <RefreshCcw className="animate-spin" size={14} /> : <Target size={14} />}
                INITIATE COMPETITIVE PROBE
            </button>
        }
      />

      <div className="grid grid-cols-12 gap-8">
          
          {/* COMPETITOR DOMINANCE MATRIX */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="glass-panel p-10 bg-[#050506] border-white/5 rounded-[3rem] relative overflow-hidden">
                  <div className="flex justify-between items-center mb-12">
                      <div className="flex items-center gap-4">
                          <Scale size={20} className="text-[#00ffd1]" />
                          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Competitor Dominance Matrix</h3>
                      </div>
                      <div className="flex gap-4">
                          {["COMPETITORS", "MARKET_FLOW", "STRATEGY"].map(tab => (
                              <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-[10px] font-mono font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-[#00ffd1] shadow-[inset_0_-2px_0_#00ffd1]' : 'text-white/20'}`}
                              >
                                  {tab}
                              </button>
                          ))}
                      </div>
                  </div>

                              </div>
                              
                              <div className="p-6 bg-[#00ffd1]/5 border border-[#00ffd1]/10 rounded-2xl flex items-center justify-between relative z-10">
                                  <div className="flex items-center gap-4">
                                      <Sword size={16} className="text-[#00ffd1]" />
                                      <div className="space-y-1">
                                          <p className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest font-black">AIVA Strategic Advantage</p>
                                          <p className="text-sm text-white/80 font-medium italic">{comp.aivaEdge}</p>
                                      </div>
                                  </div>
                                  <ArrowRight size={16} className="text-white/10 group-hover:translate-x-2 transition-all group-hover:text-[#00ffd1]" />
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* INTELLIGENCE SIDEBAR */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* SECTOR DOMINANCE RADAR */}
              <div className="glass-panel p-10 bg-black/40 border-white/5 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,209,0.05)_0%,transparent_70%)]" />
                  <div className="relative w-48 h-48 mx-auto">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
                        className="absolute inset-0 border-2 border-dashed border-[#00ffd1]/20 rounded-full" 
                      />
                      <motion.div 
                        animate={{ rotate: -360 }} 
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                        className="absolute inset-4 border border-indigo-500/10 rounded-full" 
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-1">Dominance</p>
                          <h4 className="text-4xl font-black text-[#00ffd1] italic tracking-tighter uppercase">{marketInsights.dominanceLevel}</h4>
                          <p className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest mt-2">{marketInsights.growthPotential} Growth</p>
                      </div>
                  </div>
                  <div className="space-y-4 relative z-10">
                      <p className="text-xs text-white/60 leading-relaxed italic px-4">
                          {marketInsights.summary}
                      </p>
                  </div>
              </div>

              {/* LIVE INFERENCE STREAM */}
              <div className="glass-panel p-8 bg-black/60 border-white/5 rounded-[2.5rem] flex flex-col h-[350px]">
                  <div className="flex items-center gap-3 mb-6">
                      <Terminal size={14} className="text-[#00ffd1]" />
                      <h4 className="text-[10px] font-mono font-black text-white/20 uppercase tracking-widest italic">Live Inference Stream</h4>
                  </div>
                  <div className="flex-1 space-y-4 font-mono text-[9px] text-white/30 overflow-y-auto scrollbar-hide">
                      {inferenceLogs.length === 0 ? (
                        <div className="animate-pulse">❯ [LISTENING] Awaiting market synchronization...</div>
                      ) : (
                        inferenceLogs.map((log, i) => (
                            <div key={i} className="flex gap-4 animate-in slide-in-from-left duration-300">
                                <span className={i === 0 ? "text-[#00ffd1]" : "text-white/20"}>❯</span>
                                <span>{log}</span>
                            </div>
                        ))
                      )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

function RefreshCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  )
}
