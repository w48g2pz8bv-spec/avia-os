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
        trigger: "New Website Lead", 
        logic: [
            { type: "Condition", label: "Sector == 'Dental'", next: "Vapi Voice Call" },
            { type: "Action", label: "Neural NLP Qualify", next: "CRM Sync" },
            { type: "Logic", label: "If Score > 0.8", next: "Priority Alert" }
        ],
        stats: { exec: "1.2s", success: "98.2%", runs: "1,242" },
        status: "Active",
        category: "Growth"
    },
    { 
        title: "Reputation Sentiment Filter", 
        trigger: "Google/Yelp Review", 
        logic: [
            { type: "Condition", label: "Sentiment == 'Negative'", next: "Human Escalation" },
            { type: "Action", label: "Auto-Draft AI Reply", next: "Approval Queue" }
        ],
        stats: { exec: "840ms", success: "99.1%", runs: "452" },
        status: "Active",
        category: "Reputation"
    },
    { 
        title: "Appointment No-Show Recovery", 
        trigger: "CRM: Missed Appointment", 
        logic: [
            { type: "Condition", label: "No-Show Detected", next: "Wait 30min" },
            { type: "Action", label: "Vapi Re-Schedule Call", next: "CRM Update" },
            { type: "Logic", label: "If Rescheduled → Yes", next: "Confirmation SMS" }
        ],
        stats: { exec: "2.1s", success: "76.4%", runs: "89" },
        status: "Active",
        category: "Retention"
    },
    { 
        title: "5-Star Referral Engine", 
        trigger: "Review Rating ≥ 5", 
        logic: [
            { type: "Condition", label: "Rating == 5 Stars", next: "Referral Gate" },
            { type: "Action", label: "WhatsApp: Ask Referral", next: "Track Link" },
            { type: "Logic", label: "If Referred → Reward", next: "Loyalty Queue" }
        ],
        stats: { exec: "0.9s", success: "41.2%", runs: "204" },
        status: "Active",
        category: "Growth"
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
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Primary Trigger (Event)</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white/60 outline-none focus:border-[#00ffd1]/40 appearance-none">
                            <option>New Website Lead</option>
                            <option>Negative Review Received</option>
                            <option>Appointment Missed</option>
                            <option>Form Submission</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Neural Logic Steps</label>
                            <button className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest hover:underline">+ Add Step</button>
                        </div>
                        <div className="space-y-3">
                            {['Sentiment Check', 'Vapi Voice Qualification', 'CRM Record Create'].map((step, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-mono text-white/20">{i+1}</div>
                                    <span className="flex-1 text-xs font-black text-white/60 uppercase">{step}</span>
                                    <Settings2 size={14} className="text-white/10 group-hover:text-[#00ffd1] transition-colors cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5">
                        <button 
                            onClick={async () => {
                                toast("Neural Workflow Compiled", "success");
                                setIsEditorOpen(false);
                            }}
                            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#00ffd1] transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                        >
                            Deploy to Workforce
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
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest italic">Trigger: {flow.trigger}</p>
                    </div>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${flow.status === 'Active' ? 'bg-[#00ffd1] animate-pulse shadow-[0_0_10px_#00ffd1]' : 'bg-white/10'}`} />
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <div><p className="text-[8px] font-mono text-white/10 uppercase mb-1">Success</p><p className="text-xs font-black text-white">{flow.stats.success}</p></div>
                    <div><p className="text-[8px] font-mono text-white/10 uppercase mb-1">Avg Latency</p><p className="text-xs font-black text-[#00ffd1]">{flow.stats.exec}</p></div>
                    <div><p className="text-[8px] font-mono text-white/10 uppercase mb-1">Daily Runs</p><p className="text-xs font-black text-white">{flow.stats.runs}</p></div>
                </div>
              </div>
            ))}
          </div>

          {/* SIMULATION TERMINAL */}
          <div className="glass-panel p-6 bg-black/60 font-mono space-y-4">
            <div className="flex items-center gap-2 text-white/20 border-b border-white/5 pb-4">
                <Terminal size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Execution_Logs_v2.4</span>
            </div>
            <div className="space-y-2 min-h-[120px]">
                {simulationLogs.length === 0 ? (
                    <p className="text-[10px] text-white/5 italic italic uppercase">Awaiting flow trigger...</p>
                ) : (
                    simulationLogs.map((log, i) => (
                        <p key={i} className="text-[10px] text-white/40 animate-in slide-in-from-left-2 duration-300">
                            <span className="text-[#00ffd1]">▶</span> {log}
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
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-[#00ffd1]/10 rounded-lg text-[#00ffd1]"><Activity size={14} /></div>
                        <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.4em] italic">Visual_Logic_Engine</span>
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
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                                    activeNodeIndex === i ? 'bg-[#00ffd1] border-[#00ffd1] text-black shadow-[0_0_30px_rgba(0,255,209,0.3)]' :
                                    node.type === 'Condition' ? 'border-amber-500/20 bg-amber-500/5 text-amber-500' :
                                    node.type === 'Action' ? 'border-[#00ffd1]/10 bg-[#00ffd1]/5 text-[#00ffd1]' :
                                    'border-blue-500/20 bg-blue-500/5 text-blue-500'
                                }`}>
                                    {node.type === 'Condition' ? <Split size={20} /> : 
                                     node.type === 'Action' ? <Zap size={20} /> : <GitBranch size={20} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase text-white tracking-widest">{node.label}</span>
                                        {activeNodeIndex === i && <Loader2 size={10} className="text-[#00ffd1] animate-spin" />}
                                        {activeNodeIndex !== null && activeNodeIndex > i && <CheckCircle2 size={10} className="text-emerald-500" />}
                                    </div>
                                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter italic">Route: {node.next}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="pt-8 flex flex-col items-center justify-center opacity-10">
                        <AlertCircle size={24} className="mb-4" />
                        <p className="text-[9px] font-mono uppercase tracking-[0.4em]">End of Logic Stream</p>
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



