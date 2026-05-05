"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { 
  ShieldCheck, 
  Search, 
  Activity, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  ChevronRight,
  Target,
  Clock,
  ExternalLink,
  Brain,
  ShieldAlert,
  Terminal,
  Cpu,
  Globe,
  Database,
  BarChart3,
  Scale,
  Flame,
  ArrowUpRight
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function AuditPage() {
  const context = useApp();
  const { toast } = useToast();
  const addStrategicFinding = context?.addStrategicFinding || (() => {});

  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<any>(null);

  const scanSteps = [
    "Initializing Neural Link...", 
    "Infecting Competitor Data Nodes...", 
    "Analyzing Conversion Anchors...", 
    "Calculating Profit Leakage Matrix..."
  ];

  const handleStartScan = async () => {
    if (!url) {
      toast("Please enter a URL", "error");
      return;
    }
    setIsScanning(true);
    setScanStep(0);
    
    // Neural progression simulation
    const interval = setInterval(() => {
      setScanStep(prev => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
        const response = await fetch('/api/audit', {
            method: 'POST',
            body: JSON.stringify({ url, deepCompare: true }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        // Simulating the "Deep Upgrade" logic: Competitive Benchmark
        setBenchmarkData({
            yourScore: 64,
            avgCompetitorScore: 78,
            profitGap: "₺124,500/mo",
            topLeakingNode: "Lead Conversion Speed"
        });

        setTimeout(() => {
            clearInterval(interval);
            setResults(data);
            setIsScanning(false);
            toast("Deep Neural Probe Complete", "success");
        }, 2000);
    } catch (error) {
        setIsScanning(false);
        clearInterval(interval);
        toast("Audit failed.", "error");
    }
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000 pb-20">
      <PageHeader 
        title="Neural System Audit" 
        statusText="Mode: COMPETITIVE_BENCHMARK // Depth: DEEP // Nodes: ACTIVE"
      />

      {/* INPUT AREA */}
      <div className="mb-12 p-10 glass-panel border border-[#00ffd1]/20 bg-gradient-to-br from-[#00ffd1]/10 to-transparent rounded-[3rem]">
        <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-1 space-y-4 w-full">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] ml-2 font-black italic">Target_Domain_Selection</label>
                <div className="relative group">
                    <input 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://your-clinic-domain.com"
                        className="w-full bg-black/60 border border-white/10 rounded-[2rem] py-6 px-10 text-white focus:border-[#00ffd1]/40 outline-none transition-all placeholder:text-white/10 font-mono text-sm"
                    />
                    <Globe className="absolute right-10 top-1/2 -translate-y-1/2 text-white/10 group-hover:text-[#00ffd1] transition-colors" size={24} />
                </div>
            </div>
            <button 
                onClick={handleStartScan}
                disabled={isScanning}
                className="px-14 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center gap-4 bg-[#00ffd1] text-black shadow-[0_0_50px_rgba(0,255,209,0.2)] hover:scale-105"
            >
                {isScanning ? <Activity className="animate-spin" size={18} /> : <Search size={18} />}
                RUN COMPETITIVE AUDIT
            </button>
        </div>
      </div>

      {isScanning && (
          <div className="flex flex-col items-center justify-center py-20 space-y-10">
              <div className="relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-48 h-48 rounded-full border-t-2 border-r-2 border-[#00ffd1] blur-sm opacity-50" />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border-b-2 border-l-2 border-indigo-500 blur-sm opacity-30" />
                  <Brain size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse text-[#00ffd1]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{scanSteps[scanStep]}</h3>
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">Correlating Market Intelligence...</p>
              </div>
          </div>
      )}

      {benchmarkData && !isScanning && (
          <div className="grid grid-cols-12 gap-8 mb-12 animate-in zoom-in duration-700">
              {/* PROFIT GAP ANALYSIS */}
              <div className="col-span-12 lg:col-span-5 flex flex-col">
                  <div className="glass-panel p-10 bg-red-500/5 border-red-500/20 rounded-[3rem] h-full flex flex-col justify-between group overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
                          <Flame size={150} />
                      </div>
                      <div className="space-y-8 relative z-10">
                          <div className="flex items-center gap-3">
                              <ShieldAlert size={20} className="text-red-500" />
                              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Profit Leakage Matrix</h3>
                          </div>
                          <div>
                              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 italic">Monthly Revenue Loss vs. Competitors</p>
                              <h2 className="text-6xl font-black text-red-500 italic tracking-tighter">{benchmarkData.profitGap}</h2>
                          </div>
                          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Primary Leak Source</p>
                              <p className="text-sm font-black text-white italic uppercase tracking-tight">{benchmarkData.topLeakingNode}</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* COMPETITIVE SCOREBAR */}
              <div className="col-span-12 lg:col-span-7 flex flex-col">
                  <div className="glass-panel p-10 bg-white/[0.01] border-white/5 rounded-[3rem] h-full flex flex-col space-y-10">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <Scale size={20} className="text-[#00ffd1]" />
                              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Competitive Benchmarking</h3>
                          </div>
                          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Industry_Avg: 78.2</span>
                      </div>
                      
                      <div className="space-y-12 flex-1 flex flex-col justify-center">
                          <div className="space-y-4">
                              <div className="flex justify-between items-end">
                                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Your Strategy Score</span>
                                  <span className="text-2xl font-black text-white italic">{benchmarkData.yourScore}%</span>
                              </div>
                              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex">
                                  <div className="h-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" style={{ width: `${benchmarkData.yourScore}%` }} />
                              </div>
                          </div>
                          <div className="space-y-4">
                              <div className="flex justify-between items-end">
                                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Top Competitor Performance</span>
                                  <span className="text-2xl font-black text-[#00ffd1] italic">{benchmarkData.avgCompetitorScore}%</span>
                              </div>
                              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex">
                                  <div className="h-full bg-[#00ffd1] shadow-[0_0_20px_rgba(0,255,209,0.5)]" style={{ width: `${benchmarkData.avgCompetitorScore}%` }} />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {results.length > 0 && !isScanning && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="flex items-center gap-4 mb-2">
                  <Database size={20} className="text-[#00ffd1]" />
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Strategic Vulnerability Nodes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((finding, i) => (
                      <div key={i} className="glass-panel p-10 border bg-black/40 border-white/5 hover:border-[#00ffd1]/20 rounded-[3rem] transition-all group flex flex-col justify-between min-h-[350px]">
                          <div className="space-y-6">
                              <div className="flex justify-between items-start">
                                  <span className="text-[8px] font-mono font-black uppercase tracking-widest px-4 py-1.5 rounded-full italic bg-red-500/10 text-red-500 border border-red-500/20">
                                      CRITICAL_LEAK
                                  </span>
                                  <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-[#00ffd1] group-hover:text-black transition-all">
                                      <Zap size={20} />
                                  </div>
                              </div>
                              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">{finding.title}</h3>
                              <p className="text-sm text-white/40 leading-relaxed italic line-clamp-3">"{finding.impact}"</p>
                          </div>
                          <div className="pt-8 border-t border-white/5 flex justify-between items-center mt-auto">
                              <span className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest font-black italic">AIVA Antidote Ready</span>
                              <ArrowUpRight size={16} className="text-white/10 group-hover:text-[#00ffd1] group-hover:translate-x-1 transition-all" />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
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
