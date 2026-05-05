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
import { motion, AnimatePresence } from "framer-motion";

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
    }
  ]);

  const currentFlow = workflows.find(f => f.title === selectedFlowTitle) || workflows[0];

  const addLog = (msg: string) => {
    setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    const loadWorkflows = async () => {
        if (!user || !supabase) return;
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
  }, [user, supabase]);

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLogs([]);
    addLog(`[SYSTEM] LISTENING FOR EVENT: ${currentFlow.trigger}`);
    addActivity(`Automation Triggered: ${currentFlow.title}`, 'system');
    
    let step = 0;
    const interval = setInterval(() => {
        if (step < currentFlow.logic.length) {
            setActiveNodeIndex(step);
            const node = currentFlow.logic[step];
            addLog(`[EXECUTING: ${node.type.toUpperCase()}] ${node.label}`);
            step++;
        } else {
            clearInterval(interval);
            setIsSimulating(false);
            setActiveNodeIndex(null);
            addLog(`[FLOW_COMPLETE] Logic stream finalized.`);
            toast("Automation Executed Successfully", "success");
        }
    }, 1500);
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000 pb-20">
      <PageHeader 
        title="Decision Tree Engine" 
        statusText={`Current Node: ${selectedFlowTitle} // Logic Stable`}
        action={
          <div className="flex gap-4">
            <button 
                onClick={() => setIsEditorOpen(true)}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all"
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
                    <p className="text-[10px] text-white/5 italic uppercase">Awaiting neural trigger...</p>
                ) : (
                    simulationLogs.map((log, i) => (
                        <p key={i} className="text-[10px] text-white/60">
                            <span className="text-[#00ffd1]">[{i}]</span> {log}
                        </p>
                    ))
                )}
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE LOGIC VISUALIZER */}
        <div className="col-span-12 lg:col-span-6">
           <div className="glass-panel h-full min-h-[600px] flex flex-col p-10 relative overflow-hidden bg-black/40">
                <div className="border-b border-white/5 pb-8 mb-12 relative z-10">
                    <h4 className="text-2xl font-syne font-black uppercase italic text-white tracking-tight">{selectedFlowTitle}</h4>
                </div>

                <div className="flex-1 space-y-12 relative z-10 pl-4">
                    {currentFlow.logic.map((node, i) => (
                        <div key={i} className="relative">
                            <div className={`flex items-center gap-8 transition-all duration-500 ${activeNodeIndex === i ? 'scale-105' : 'opacity-40'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${activeNodeIndex === i ? 'bg-[#00ffd1] border-[#00ffd1] text-black' : 'border-white/10 text-white/20'}`}>
                                    {node.type === 'Condition' ? <Split size={18} /> : <Zap size={18} />}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{node.label}</span>
                                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-tighter italic">Next: {node.next}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
