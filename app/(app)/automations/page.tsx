"use client";
import { useState, useEffect } from "react";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { 
  Plus, 
  ArrowRight, 
  Zap, 
  Play, 
  Settings2, 
  Shield, 
  Share2, 
  MessageCircle, 
  Clock, 
  Split, 
  GitBranch, 
  Activity, 
  ChevronDown,
  Terminal,
  Filter,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  MapPin,
  Sparkles,
  Globe,
  UserCheck
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

type Node = {
    type: "Condition" | "Action" | "Logic";
    label: string;
    next: string;
    status?: 'idle' | 'running' | 'success';
};

type Workflow = {
    title: string;
    trigger: string;
    logic: Node[];
    stats: { exec: string, success: string, runs: string };
    status: string;
    category: string;
};

export default function AutomationsPage() {
  const { user, supabase, addActivity, addToQueue, toast } = useApp();
  const [selectedFlowTitle, setSelectedFlowTitle] = useState("Omni-Channel Lead Acquisition");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    { 
        title: "Omni-Channel Lead Acquisition", 
        trigger: "Goal: Maximize Inbound Conversion", 
        logic: [
            { type: "Condition", label: "Intent == 'High' / Sector == 'Dental'", next: "Deploy Vapi Agent" },
            { type: "Action", label: "Neural Voice Qualification", next: "Knowledge Base Sync" },
            { type: "Logic", label: "Self-Healing: A/B Test Objection Handling", next: "CRM Push" }
        ],
        stats: { exec: "12ms", success: "94.2%", runs: "1,242" },
        status: "Active",
        category: "Growth"
    },
    { 
        title: "Reputation Crisis Shield", 
        trigger: "Goal: Neutralize 1-Star Threats < 15m", 
        logic: [
            { type: "Condition", label: "Sentiment Velocity Drop Detected", next: "Auto-Draft AI Defense" },
            { type: "Logic", label: "Cross-Reference KB Protocol", next: "Execute Vapi Apology Call" },
            { type: "Action", label: "Send 30% Retention Offer (SMS)", next: "Monitor Click" }
        ],
        stats: { exec: "8ms", success: "99.1%", runs: "452" },
        status: "Active",
        category: "Reputation"
    },
    { 
        title: "Appointment No-Show Recovery", 
        trigger: "Goal: Re-book 50% No-Shows in 24h", 
        logic: [
            { type: "Condition", label: "No-Show Detected (CRM)", next: "Wait 15m" },
            { type: "Action", label: "Vapi: Empathy Check Call", next: "Analyze Transcript" },
            { type: "Logic", label: "If Excused -> Reschedule & Update Builder UI", next: "Success" }
        ],
        stats: { exec: "21ms", success: "76.4%", runs: "89" },
        status: "Active",
        category: "Retention"
    },
    { 
        title: "Competitor Lead Hijacking", 
        trigger: "Goal: Steal Market Share locally", 
        logic: [
            { type: "Action", label: "Scrape 1-Star Google Reviews (5km)", next: "Filter High Intent" },
            { type: "Condition", label: "Intent == 'Looking for Alternative'", next: "Generate Custom Offer" },
            { type: "Logic", label: "Dispatch Targeted Insta-Ad", next: "Capture Lead" }
        ],
        stats: { exec: "42ms", success: "18.2%", runs: "204" },
        status: "Active",
        category: "Aggressive Growth"
    }
  ]);

  const currentFlow = workflows.find(f => f.title === selectedFlowTitle) || workflows[0];

  const addLog = (msg: string) => {
    setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // LOAD WORKFLOWS FROM DATABASE
  useEffect(() => {
    const loadWorkflows = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('automations')
            .select('*')
            .order('created_at', { descending: false });

        if (data && !error && data.length > 0) {
            setWorkflows(data.map((d: any) => ({
                ...d.config,
                id: d.id,
                status: d.status
            })));
        }
    };
    loadWorkflows();
  }, [user]);

  const saveWorkflow = async (flow: Workflow) => {
    if (!user) return;
    const { data, error } = await supabase.from('automations').upsert([{
        user_id: user.id,
        title: flow.title,
        config: flow,
        status: 'Active'
    }]);
    if (!error) toast("Automation Synced to Cloud", "success");
  };

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLogs([]);
    addLog(`[SYSTEM] LISTENING FOR EVENT: ${currentFlow.trigger}`);
    addActivity(`Automation Triggered: ${currentFlow.title}`, 'system');
    
    // Simulate incoming webhook payload
    setTimeout(() => {
        addLog(`[WEBHOOK] Payload Received: { source: "${currentFlow.trigger}", timestamp: "${new Date().toISOString()}" }`);
    }, 500);

    let step = 0;
    const interval = setInterval(() => {
        if (step < currentFlow.logic.length) {
            setActiveNodeIndex(step);
            const node = currentFlow.logic[step];
            addLog(`[EXECUTING: ${node.type.toUpperCase()}] ${node.label}`);
            
            if (node.label.includes("Vapi")) {
                addLog(`[VAPI_API] Outbound AI voice link active.`);
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance("Automated outbound call sequence active.");
                    utterance.lang = "en-US";
                    window.speechSynthesis.speak(utterance);
                }
            }
            
            step++;
        } else {
            clearInterval(interval);
            setIsSimulating(false);
            setActiveNodeIndex(null);
            addLog(`[FLOW_COMPLETE] Logic stream finalized successfully.`);
            toast("Automation Executed Successfully", "success");
        }
    }, 1800);
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader 
        title="Decision Tree Engine" 
        statusText={`Current Node: ${selectedFlowTitle} // Logic Stable`}
        action={
          <div className="flex gap-4">
            <button 
                onClick={() => setIsEditorOpen(true)}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                <Plus size={14} /> New Workflow
            </button>
            <button 
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex items-center gap-2 bg-[#00ffd1]/10 border border-[#00ffd1]/20 text-[#00ffd1] px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] hover:text-black transition-all"
            >
                {isSimulating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Test Logic
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8 relative">
        
        {/* WORKFLOW DESIGNER OVERLAY */}
        {isEditorOpen && (
            <div className="fixed inset-y-0 right-0 w-[500px] bg-[#050506] border-l border-white/10 p-10 z-[100] animate-in slide-in-from-right duration-500 shadow-[-50px_0_100px_rgba(0,0,0,0.8)] overflow-y-auto">
                <div className="flex justify-between items-center mb-12">
                    <div className="space-y-1">
                        <h3 className="text-[12px] font-mono font-black text-[#00ffd1] uppercase tracking-widest">Logic Designer</h3>
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Building Autonomous Workforce</p>
                    </div>
                    <button onClick={() => setIsEditorOpen(false)} className="text-white/20 hover:text-white transition-colors"><Plus className="rotate-45" size={24} /></button>
                </div>

                <div className="space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Workflow Title</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white outline-none focus:border-[#00ffd1]/40" placeholder="e.g. 5-Star Loyalty Loop" />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-widest flex justify-between">
                            <span>Primary Neural Objective</span>
                            <span className="text-white/20">Non-Linear</span>
                        </label>
                        <select className="w-full bg-[#00ffd1]/5 border border-[#00ffd1]/20 rounded-2xl p-5 text-sm text-[#00ffd1] outline-none focus:border-[#00ffd1]/40 appearance-none font-bold italic">
                            <option>Goal: Maximize Inbound Conversion</option>
                            <option>Goal: Neutralize 1-Star Threats</option>
                            <option>Goal: Recover No-Shows < 24h</option>
                            <option>Goal: Steal Market Share</option>
                        </select>
                        <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest italic mt-2">
                            *AIVA will autonomously select the best tools (Vapi, Builder, Rep) to achieve this goal.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Permitted AI Actions</label>
                            <button className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest hover:underline">+ Grant Permission</button>
                        </div>
                        <div className="space-y-3">
                            {['Voice Agent (Vapi)', 'Website Mutation (Builder)', 'SMS / Email (Omni)'].map((step, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-[#00ffd1]/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono ${i===0 ? 'bg-indigo-500/20 text-indigo-400' : i===1 ? 'bg-[#00ffd1]/20 text-[#00ffd1]' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {i===0 ? <MessageCircle size={14} /> : i===1 ? <Globe size={14} /> : <Zap size={14} />}
                                        </div>
                                        <span className="text-xs font-black text-white/80 uppercase">{step}</span>
                                    </div>
                                    <div className="w-3 h-3 rounded-full bg-[#00ffd1] shadow-[0_0_10px_#00ffd1]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5">
                        <button 
                            onClick={async () => {
                                toast("Neural Workflow Deployed to Workforce", "success");
                                setIsEditorOpen(false);
                            }}
                            className="w-full py-5 bg-[#00ffd1] text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(0,255,209,0.3)]"
                        >
                            Deploy Objective
                        </button>
                    </div>
                </div>
            </div>
        )}
        
        {/* LEFT: FLOW REGISTRY */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Neural_Loops // Registry</h2>
          </div>

          <div className="space-y-4">
            {workflows.map((flow) => (
              <div 
                key={flow.title} 
                onClick={() => { setSelectedFlowTitle(flow.title); setSimulationLogs([]); }}
                className={`glass-panel p-8 cursor-pointer transition-all border-l-4 ${selectedFlowTitle === flow.title ? 'border-l-[#00ffd1] bg-[#00ffd1]/5 border-[#00ffd1]/20' : 'border-l-transparent hover:border-l-white/20'}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-white/20"><GitBranch size={16} /></div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-syne font-black uppercase italic text-white">{flow.title}</h3>
                        <p className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest italic">{flow.trigger}</p>
                    </div>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${flow.status === 'Active' ? 'bg-[#00ffd1] animate-pulse shadow-[0_0_10px_#00ffd1]' : 'bg-white/10'}`} />
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <div><p className="text-[8px] font-mono text-white/10 uppercase mb-1">Goal Success</p><p className="text-xs font-black text-white">{flow.stats.success}</p></div>
                    <div><p className="text-[8px] font-mono text-white/10 uppercase mb-1">Compute Latency</p><p className="text-xs font-black text-[#00ffd1]">{flow.stats.exec}</p></div>
                    <div><p className="text-[8px] font-mono text-white/10 uppercase mb-1">Daily Executions</p><p className="text-xs font-black text-white">{flow.stats.runs}</p></div>
                </div>
              </div>
            ))}
          </div>

          {/* SIMULATION TERMINAL */}
          <div className="glass-panel p-6 bg-black/60 font-mono space-y-4">
            <div className="flex items-center gap-2 text-[#00ffd1]/40 border-b border-white/5 pb-4">
                <Terminal size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Omni-Channel Execution_Logs</span>
            </div>
            <div className="space-y-2 min-h-[120px]">
                {simulationLogs.length === 0 ? (
                    <p className="text-[10px] text-white/5 italic italic uppercase">Awaiting neural trigger...</p>
                ) : (
                    simulationLogs.map((log, i) => (
                        <p key={i} className="text-[10px] text-white/60 animate-in slide-in-from-left-2 duration-300">
                            <span className="text-[#00ffd1]">[{i}]</span> {log}
                        </p>
                    ))
                )}
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE LOGIC VISUALIZER */}
        <div className="col-span-12 lg:col-span-6">
           <div className="glass-panel h-full min-h-[700px] flex flex-col p-10 relative overflow-hidden bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px]">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12"><Cpu size={300} /></div>
                
                <div className="border-b border-white/5 pb-8 mb-12 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#00ffd1]/10 rounded-lg text-[#00ffd1]"><Activity size={14} /></div>
                            <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.4em] italic">Autonomous Orchestrator</span>
                        </div>
                        <div className="px-3 py-1 border border-indigo-500/30 bg-indigo-500/10 rounded-full flex items-center gap-2">
                            <Sparkles size={10} className="text-indigo-400" />
                            <span className="text-[8px] font-mono font-black text-indigo-400 uppercase tracking-widest">Self-Optimizing Live</span>
                        </div>
                    </div>
                    <h4 className="text-2xl font-syne font-black uppercase italic text-white tracking-tight">{selectedFlowTitle}</h4>
                </div>

                <div className="flex-1 space-y-12 relative z-10 pl-4">
                    {currentFlow.logic.map((node, i) => (
                        <div key={i} className="relative">
                            {i !== 0 && (
                                <div className="absolute -top-12 left-6 w-px h-12 bg-white/5 overflow-hidden">
                                    <div className={`w-full bg-gradient-to-b from-[#00ffd1] to-transparent transition-all duration-[1.8s] ease-linear ${
                                        activeNodeIndex !== null && activeNodeIndex >= i ? 'h-full animate-slide-down shadow-[0_0_15px_#00ffd1]' : 'h-0'
                                    }`} />
                                </div>
                            )}
                            <div className={`flex items-center gap-8 group transition-all duration-500 ${
                                activeNodeIndex === i ? 'scale-110' : ''
                            }`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 relative ${
                                    activeNodeIndex === i ? 'bg-[#00ffd1] border-[#00ffd1] text-black shadow-[0_0_30px_rgba(0,255,209,0.3)]' :
                                    node.label.includes('Self-Healing') ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400' :
                                    node.type === 'Condition' ? 'border-amber-500/20 bg-amber-500/5 text-amber-500' :
                                    node.type === 'Action' ? 'border-[#00ffd1]/10 bg-[#00ffd1]/5 text-[#00ffd1]' :
                                    'border-blue-500/20 bg-blue-500/5 text-blue-500'
                                }`}>
                                    {node.label.includes('Self-Healing') && (
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full animate-ping opacity-50" />
                                    )}
                                    {node.type === 'Condition' ? <Split size={20} /> : 
                                     node.type === 'Action' ? <Zap size={20} /> : <GitBranch size={20} />}
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${node.label.includes('Self-Healing') ? 'text-indigo-400' : 'text-white'}`}>{node.label}</span>
                                            {activeNodeIndex === i && <Loader2 size={10} className="text-[#00ffd1] animate-spin" />}
                                            {activeNodeIndex !== null && activeNodeIndex > i && <CheckCircle2 size={10} className="text-emerald-500" />}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter italic">Route: {node.next}</p>
                                        {node.label.includes('Self-Healing') && (
                                            <span className="text-[8px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded uppercase">Autonomous A/B Shift</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="pt-8 flex flex-col items-center justify-center opacity-10">
                        <AlertCircle size={24} className="mb-4" />
                        <p className="text-[9px] font-mono uppercase tracking-[0.4em]">Objective Met // Stream Terminated</p>
                    </div>
                </div>

                <div className="mt-auto p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center font-mono text-[9px] text-white/20 uppercase tracking-widest italic relative z-10">
                    <span>Active Clusters: 12</span>
                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-[#00ffd1] transition-all duration-[4.5s] ${isSimulating ? 'w-full' : 'w-0'}`} />
                    </div>
                    <span>Global Sync Active</span>
                </div>
           </div>
        </div>
        {/* NEURAL UTILITY HUB - SMALL PROBLEM SOLVERS */}
        <div className="col-span-12 mt-12">
            <div className="flex items-center gap-4 mb-8">
                <Sparkles size={20} className="text-[#00ffd1]" />
                <h2 className="text-xl font-syne font-black italic uppercase tracking-tighter text-white">Neural Utility Hub</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Reputation Multiplier", desc: "Toplu müşteri listesine AI tabanlı yorum taslakları gönderir ve Google puanınızı otonom yükseltir.", icon: MessageCircle, color: "text-emerald-400" },
                    { title: "Competitor Deflector", desc: "Rakip yorumlarındaki mutsuz müşterileri saptayıp size özel kampanya ile çeker.", icon: Shield, color: "text-red-400" },
                    { title: "SEO Neural Audit", desc: "50+ teknik noktada anlık boşluk tespiti ve otorite analizi.", icon: Globe, color: "text-blue-400" },
                    { title: "AI Content Scaler", desc: "Statik içeriği 12 farklı platform formatına otonom dönüştürür.", icon: Share2, color: "text-[#00ffd1]" },
                    { title: "Local Citation Sniper", desc: "İşletme bilgilerini tüm global rehberlerde saniyeler içinde senkronize eder.", icon: MapPin, color: "text-purple-400" },
                    { title: "Lead Quality Grader", desc: "Müşteri adaylarının niyet sinyallerini %98 doğrulukla puanlar.", icon: UserCheck, color: "text-amber-500" }
                ].map((util, i) => (
                    <div key={i} className="glass-panel p-8 group hover:border-[#00ffd1]/40 transition-all duration-500 bg-black/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <util.icon size={60} />
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${util.color}`}>
                            <util.icon size={20} />
                        </div>
                        <h4 className="text-sm font-black text-white uppercase italic mb-3 tracking-wider">{util.title}</h4>
                        <p className="text-[11px] text-white/40 leading-relaxed italic mb-8">{util.desc}</p>
                        <button 
                            onClick={() => toast(`${util.title} Initializing...`, "info")}
                            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest text-white/40 hover:bg-[#00ffd1] hover:text-black hover:border-[#00ffd1] transition-all"
                        >
                            Execute Micro-Service
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}



