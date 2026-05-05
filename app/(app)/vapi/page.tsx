"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { 
  Plus, 
  Phone, 
  Activity, 
  Zap, 
  MessageSquare, 
  Terminal, 
  Mic, 
  Shield, 
  Settings2, 
  Sliders, 
  Brain, 
  Volume2, 
  Database,
  History,
  Lock,
  Send,
  Loader2,
  Trash2,
  Wand2
} from "lucide-react";
import VapiWaveform from "@/components/ui/vapi-waveform";
import { useToast } from "@/lib/toast-context";

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

export default function VapiPage() {
  const { toast } = useToast();
  const { selectedSector, addActivity, knowledgeBase, user, supabase, trackEvent } = useApp();
  const [selectedAgent, setSelectedAgent] = useState("Appointment Setter v4");
  const [activeTab, setActiveTab] = useState("console"); // console, config, voice
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [neuralLogs, setNeuralLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const agents = [
    { 
        name: "Appointment Setter v4", 
        role: "Inbound Lead Qualification",
        stats: { success: "94.2%", latency: "840ms", emotion: "Helpful" },
        config: {
            prompt: "You are a professional dental assistant named AIVA. Your goal is to book appointments for Dr. Smith's clinic. Be polite and efficient.",
            voice: "Jessica (Neural Pro)",
            speed: 1.1,
            pitch: 1.0
        }
    },
    { 
        name: "Review Optimizer", 
        role: "Post-Treatment Follow-up",
        stats: { success: "88.7%", latency: "1.1s", emotion: "Empathetic" },
        config: {
            prompt: "Call patients 24h after surgery. Ask about pain levels. If pain > 5, escalate to clinic. Otherwise, ask for a 5-star review.",
            voice: "Mark (Warm Neural)",
            speed: 1.0,
            pitch: 0.95
        }
    }
  ];

  const currentAgent = agents.find(a => a.name === selectedAgent) || agents[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, neuralLogs]);

  const addNeuralLog = (msg: string) => {
    setNeuralLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-5));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isProcessing) return;

    const userMsg = chatInput;
    setChatInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date().toLocaleTimeString() }]);
    setIsProcessing(true);
    
    addNeuralLog(`Querying Neural Brain...`);
    
    try {
        const res = await fetch('/api/vapi/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: userMsg, 
                context: knowledgeBase,
                agentName: selectedAgent
            })
        });
        
        const data = await res.json();
        const response = data.response || "Neural sync lost. Re-establishing link...";

        addNeuralLog(`Neural Match Success: Response Generated.`);
        setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date().toLocaleTimeString() }]);
        setIsProcessing(false);

        // MASTERFUL CONVERSION LOGIC
        const lowerContent = response.toLowerCase();
        if (lowerContent.includes('appointment') || lowerContent.includes('booked') || lowerContent.includes('randevu') || lowerContent.includes('kayıt')) {
            addActivity(`Voice Conversion: Appointment intent detected`, 'sync');
            trackEvent('voice_conversion', { agent: selectedAgent, response_sample: response.substring(0, 50) });
            
            if (user) {
                await supabase.from('leads').insert({
                    user_id: user.id,
                    name: `Voice Prospect [${new Date().toLocaleTimeString()}]`,
                    source: 'AI Voice Assistant',
                    intent: 'Scheduled via Conversation',
                    score: 96,
                    status: 'Qualified'
                });
                toast("Outcome Detected: Lead Synced to CRM", "success");
            }
        }

        // Text-to-Speech
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(response);
            utterance.rate = 1.0;
            utterance.lang = "tr-TR";
            window.speechSynthesis.speak(utterance);
        }
    } catch (error) {
        addNeuralLog(`ERROR: Neural Link Interrupted.`);
        setIsProcessing(false);
        toast("Connection Error", "error");
    }
  };

  const [whisperLogs, setWhisperLogs] = useState<string[]>([]);
  const [editingDefense, setEditingDefense] = useState<number | null>(null);

  const defenseProtocols = [
    { trigger: "Price Objection", defense: "Value Anchoring", strategy: "Sistemin kendini amorti etme süresine odaklan.", color: "red-500" },
    { trigger: "Trust/Credibility", defense: "Authority Injection", strategy: "Vaka analizlerini ve başarı hikayelerini devreye sok.", color: "blue-500" },
    { trigger: "Decision Delay", defense: "Scarcity Trigger", strategy: "Otonom slot doluluk oranını vurgulayarak aciliyet yarat.", color: "amber-500" }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isProcessing) return;

    const userMsg = chatInput;
    setChatInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date().toLocaleTimeString() }]);
    setIsProcessing(true);
    
    // Add specific "Whisper" reasoning based on the message
    const lowerMsg = userMsg.toLowerCase();
    if (lowerMsg.includes('pahalı') || lowerMsg.includes('fiyat')) {
        setWhisperLogs(prev => [`[REASONING] Price Objection detected. Activating 'Value Anchoring' protocol...`, ...prev]);
    } else {
        setWhisperLogs(prev => [`[REASONING] Analyzing prospect intent... Emotional mirroring level: 88%.`, ...prev]);
    }
    
    addNeuralLog(`Querying Neural Brain...`);
    
    try {
        const res = await fetch('/api/vapi/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: userMsg, 
                context: knowledgeBase,
                agentName: selectedAgent,
                defenseProtocols: defenseProtocols // SENDING DEFENSE LOGIC TO BRAIN
            })
        });
        
        const data = await res.json();
        const response = data.response || "Neural sync lost. Re-establishing link...";

        addNeuralLog(`Neural Match Success: Response Generated.`);
        setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date().toLocaleTimeString() }]);
        setIsProcessing(false);

        // MASTERFUL CONVERSION LOGIC
        if (response.toLowerCase().includes('randevu') || response.toLowerCase().includes('appointment')) {
            setWhisperLogs(prev => [`[STRATEGY] Soft-Close successful. Syncing to CRM...`, ...prev]);
            addActivity(`Voice Conversion: Appointment intent detected`, 'sync');
            if (user) {
                await supabase.from('leads').insert({
                    user_id: user.id,
                    name: `Voice Prospect [${new Date().toLocaleTimeString()}]`,
                    source: 'AI Voice Assistant',
                    intent: 'Scheduled via Conversation',
                    score: 96,
                    status: 'Qualified'
                });
                toast("Outcome Detected: Lead Synced to CRM", "success");
            }
        }
    } catch (error) {
        addNeuralLog(`ERROR: Neural Link Interrupted.`);
        setIsProcessing(false);
        toast("Connection Error", "error");
    }
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader 
        title="Neural Sales Architect" 
        statusText={`System: Vapi_Node_v5.0 // Brain: Connected // ROI Mode: Active`}
        action={
          <div className="flex gap-4">
             <div className="hidden md:flex items-center gap-6 px-6 border-r border-white/5 mr-4">
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Global Conversions</span>
                    <span className="text-sm font-black text-[#00ffd1]">₺1.4M+</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Avg. Close Rate</span>
                    <span className="text-sm font-black text-indigo-400">34.2%</span>
                </div>
             </div>
             <button 
                onClick={() => toast("Neural Link Established", "success")}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all shadow-[0_0_30px_rgba(0,255,209,0.2)]"
             >
                <Phone size={14} fill="black" /> Launch Live Agent
             </button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT: STRATEGIC CONTROLS */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* ACTIVE AGENT CLUSTER */}
          <div className="glass-panel p-6 space-y-6 bg-black/40">
            <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Active Sales Nodes</h2>
                <Plus size={14} className="text-[#00ffd1] cursor-pointer hover:scale-110 transition-all" />
            </div>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div 
                    key={agent.name}
                    onClick={() => { setSelectedAgent(agent.name); setMessages([]); }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedAgent === agent.name ? 'bg-[#00ffd1]/5 border-[#00ffd1]/40 shadow-[0_0_40px_rgba(0,255,209,0.05)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                >
                    {selectedAgent === agent.name && <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ffd1]/5 blur-2xl -mr-12 -mt-12" />}
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="space-y-1">
                            <span className={`text-sm font-black uppercase italic tracking-tight ${selectedAgent === agent.name ? 'text-[#00ffd1]' : 'text-white/60'}`}>{agent.name}</span>
                            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{agent.role}</p>
                        </div>
                        <div className={`p-2 rounded-lg ${selectedAgent === agent.name ? 'bg-[#00ffd1] text-black' : 'bg-white/5 text-white/20'}`}>
                            <Zap size={14} />
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEURAL DEFENSE MATRIX */}
          <div className="glass-panel p-8 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Shield size={18} className="text-red-500" />
                        <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.4em] uppercase italic">Neural Defense Matrix</h3>
                    </div>
                    <span className="text-[8px] font-mono text-red-500/60 border border-red-500/20 px-2 py-0.5 rounded-full uppercase animate-pulse">Defense Ready</span>
                </div>
                
                <div className="space-y-4">
                    {defenseProtocols.map((defense, i) => (
                        <div 
                            key={i} 
                            onClick={() => setEditingDefense(i)}
                            className="p-5 bg-black/60 rounded-2xl border border-white/5 hover:border-red-500/20 transition-all group cursor-pointer relative"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-[9px] font-black text-${defense.color} uppercase tracking-widest`}>{defense.trigger}</span>
                                <Wand2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40" />
                            </div>
                            <p className="text-[10px] font-bold text-white/80 mb-2">{defense.defense}</p>
                            <p className="text-[9px] font-mono text-white/30 italic leading-relaxed">"{defense.strategy}"</p>
                        </div>
                    ))}
                    <button className="w-full py-4 mt-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                        Inject New Logic Node
                    </button>
                </div>
          </div>

          {/* NEURAL WHISPER (HIDDEN REASONING) */}
          <div className="glass-panel p-8 bg-indigo-500/5 border-indigo-500/20">
                <div className="flex items-center gap-3 mb-6">
                    <Brain size={16} className="text-indigo-400" />
                    <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Neural Whisper Log</h3>
                </div>
                <div className="space-y-3 font-mono">
                    <div className="min-h-[150px] max-h-[150px] overflow-y-auto scrollbar-hide space-y-2">
                        {whisperLogs.length === 0 ? (
                            <p className="text-[8px] text-white/5 italic">Awaiting conversational logic events...</p>
                        ) : (
                            whisperLogs.map((log, i) => (
                                <div key={i} className="text-[8px] p-2 bg-black/40 border border-white/5 rounded-lg text-indigo-400/80 italic animate-in slide-in-from-left-2">
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
          </div>
        </div>

        {/* RIGHT: LIVE COMMAND CONSOLE */}
        <div className="col-span-12 lg:col-span-8 space-y-6 h-full flex flex-col">
           
           {/* CONVERSION PATHWAY */}
           <div className="glass-panel p-6 bg-black/60 border-white/5 flex items-center justify-between">
                {[
                    { id: 'disc', label: 'Discovery', status: 'done', icon: Brain },
                    { id: 'value', label: 'Value Prop', status: 'active', icon: Zap },
                    { id: 'obj', label: 'Defense', status: 'pending', icon: Shield },
                    { id: 'close', label: 'Closing', status: 'pending', icon: Rocket }
                ].map((step, i) => (
                    <div key={step.id} className="flex items-center gap-4 group">
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${step.status === 'done' ? 'bg-[#00ffd1] text-black border-[#00ffd1]' : step.status === 'active' ? 'bg-[#00ffd1]/20 text-[#00ffd1] border-[#00ffd1]/40 animate-pulse' : 'bg-white/5 text-white/10 border-white/5'}`}>
                                <step.icon size={18} />
                            </div>
                            <span className={`text-[8px] font-mono font-black uppercase tracking-widest ${step.status === 'active' ? 'text-[#00ffd1]' : 'text-white/20'}`}>{step.label}</span>
                        </div>
                        {i < 3 && <div className="w-12 h-px bg-white/5 group-hover:bg-white/10 transition-all mx-2" />}
                    </div>
                ))}
                <div className="h-10 w-px bg-white/5 mx-6" />
                <div className="flex-1 bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Next Strategic Move</p>
                        <p className="text-[10px] font-bold text-white italic">Confirming high-value intent and pushing for Commitment Node...</p>
                    </div>
                    <Activity size={14} className="text-[#00ffd1] animate-pulse" />
                </div>
           </div>

           <div className="glass-panel flex-1 min-h-[600px] flex flex-col overflow-hidden relative">
                {/* Workspace Tabs */}
                <div className="flex border-b border-white/5 bg-white/[0.02] relative z-20">
                    {[
                        { id: 'console', label: 'Live Simulation', icon: Terminal },
                        { id: 'campaigns', label: 'Batch Campaigns', icon: Activity },
                        { id: 'sim', label: 'Neural Playground', icon: Brain },
                        { id: 'config', label: 'Behavioral DNA', icon: Sliders }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-8 py-5 text-[10px] font-mono font-black uppercase tracking-widest transition-all border-r border-white/5 ${activeTab === tab.id ? 'bg-white/5 text-[#00ffd1] shadow-[inset_0_-2px_0_#00ffd1]' : 'text-white/20 hover:text-white'}`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 flex flex-col p-0 relative h-full bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px]">
                    {activeTab === 'console' && (
                        <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500">
                             <div className="flex-1 p-8 overflow-y-auto scrollbar-hide space-y-8" ref={scrollRef}>
                                 {messages.length === 0 && (
                                     <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-10">
                                         <Phone size={64} strokeWidth={0.5} className="animate-pulse" />
                                         <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-center max-w-xs leading-relaxed">Agent Lab Standby // Synchronize Link to Start</p>
                                     </div>
                                 )}
                                 {messages.map((msg, i) => (
                                     <div key={i} className={`flex gap-6 items-start animate-in slide-in-from-bottom-2 duration-500 ${msg.role === 'assistant' ? 'text-[#00ffd1]' : ''}`}>
                                         <div className="w-12 text-[10px] font-black uppercase mt-1 opacity-20">{msg.role === 'user' ? 'USER' : 'AIVA'}</div>
                                         <div className="flex-1 space-y-4">
                                             <div className={`p-6 rounded-[2rem] inline-block ${msg.role === 'assistant' ? 'bg-[#00ffd1]/5 border border-[#00ffd1]/20 text-white' : 'bg-white/5 border border-white/5 text-white/60 italic'}`}>
                                                <p className="text-sm leading-relaxed">"{msg.content}"</p>
                                             </div>
                                             {msg.role === 'assistant' && i === messages.length - 1 && (
                                                 <div className="p-6 bg-black/40 border border-white/5 rounded-[2.5rem] mt-4">
                                                     <VapiWaveform />
                                                     <div className="flex justify-between items-center mt-6">
                                                        <div className="flex gap-6">
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-mono text-white/20 uppercase">Intent Score</span>
                                                                <span className="text-xs font-black text-[#00ffd1]">High (92%)</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-mono text-white/20 uppercase">Mirroring</span>
                                                                <span className="text-xs font-black text-indigo-400">Elite Level</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-mono text-white/40 hover:text-white transition-all uppercase">Take Over</button>
                                                            <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-mono text-red-500 uppercase">Emergency Stop</button>
                                                        </div>
                                                     </div>
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                 ))}
                                 {isProcessing && (
                                     <div className="flex gap-6 items-start animate-pulse">
                                         <div className="w-12 text-[10px] font-black uppercase mt-1 text-[#00ffd1] opacity-40">AIVA</div>
                                         <div className="flex-1 flex items-center gap-3 text-white/20 italic font-mono text-xs">
                                             <Loader2 size={12} className="animate-spin text-[#00ffd1]" /> Neural Path-finding...
                                         </div>
                                     </div>
                                 )}
                             </div>
                             
                             <form onSubmit={handleSendMessage} className="p-8 border-t border-white/5 bg-black/80 relative z-10">
                                 <div className="relative group">
                                     <input 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder={`Enter prospect message to simulate...`}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-6 pl-10 pr-20 text-sm text-white focus:border-[#00ffd1]/40 focus:bg-white/[0.06] transition-all outline-none backdrop-blur-xl shadow-2xl"
                                     />
                                     <button 
                                        type="submit"
                                        disabled={!chatInput.trim() || isProcessing}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-[#00ffd1] text-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(0,255,209,0.3)]"
                                     >
                                         <Send size={18} />
                                     </button>
                                 </div>
                             </form>
                        </div>
                    )}

                    {activeTab === 'campaigns' && (
                        <div className="flex-1 p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto scrollbar-hide">
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-white italic">Neural Outbound Funnel</h3>
                                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">Simultaneous Batch Operation: Node_442</p>
                                </div>
                                <button className="px-8 py-3 bg-[#00ffd1] text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                                    Launch New Campaign
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Leads', val: '1,240', color: 'white' },
                                    { label: 'Live Calls', val: '42', color: '#00ffd1' },
                                    { label: 'Success (ROI)', val: '18%', color: 'indigo-400' },
                                    { label: 'Neural Wait', val: '0.4s', color: 'white/40' }
                                ].map((s, i) => (
                                    <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-2">
                                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{s.label}</p>
                                        <p className="text-2xl font-black italic" style={{ color: s.color }}>{s.val}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="glass-panel p-8 bg-black/40 border-white/5">
                                <table className="w-full text-left font-mono text-[10px]">
                                    <thead>
                                        <tr className="text-white/20 uppercase tracking-widest border-b border-white/5">
                                            <th className="pb-4 font-black">Lead Entity</th>
                                            <th className="pb-4 font-black">Call Duration</th>
                                            <th className="pb-4 font-black">Outcome Score</th>
                                            <th className="pb-4 font-black text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white/60">
                                        {[
                                            { name: "Global Dental Group", dur: "4m 12s", score: "96%", status: "CLOSED", color: "text-[#00ffd1]" },
                                            { name: "Metropolis Law", dur: "1m 45s", score: "12%", status: "FOLLOW_UP", color: "text-indigo-400" },
                                            { name: "SaaS Rocket Ltd", dur: "0m 00s", score: "0%", status: "QUEUED", color: "text-white/20" }
                                        ].map((lead, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                                                <td className="py-4 font-black text-white">{lead.name}</td>
                                                <td className="py-4">{lead.dur}</td>
                                                <td className="py-4">{lead.score}</td>
                                                <td className={`py-4 text-right font-black ${lead.color}`}>{lead.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sim' && (
                        <div className="flex-1 p-12 space-y-12 animate-in zoom-in duration-500 overflow-y-auto scrollbar-hide">
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter">Neural Stress Test Playground</h3>
                                <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Calibrate Defense protocols against simulated personas</p>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                {[
                                    { id: 'angry', label: 'Angry Skeptic', icon: Activity, color: 'red-500', desc: 'Price-focused, high resistance.' },
                                    { id: 'curious', label: 'Curious Researcher', icon: Brain, color: '#00ffd1', desc: 'Asks deep technical questions.' },
                                    { id: 'busy', label: 'Busy Executive', icon: Zap, color: 'indigo-500', desc: 'No time, wants the value prop in 30s.' }
                                ].map((persona) => (
                                    <div key={persona.id} className="glass-panel p-8 bg-black/40 border-white/5 hover:border-white/20 transition-all group cursor-pointer text-center space-y-6">
                                        <div className="relative mx-auto w-16 h-16 rounded-2xl border border-white/5 flex items-center justify-center group-hover:scale-110 transition-all">
                                            <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: persona.color }} />
                                            <persona.icon size={24} style={{ color: persona.color }} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-black text-white uppercase italic">{persona.label}</p>
                                            <p className="text-[10px] text-white/40 leading-relaxed">{persona.desc}</p>
                                        </div>
                                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:bg-white group-hover:text-black transition-all">
                                            Start Stress Test
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
                                        <Database size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-white">Advanced Persona Learning</p>
                                        <p className="text-[10px] font-mono text-white/40 italic">Train the agent using your actual past call recordings (CSV/Audio).</p>
                                    </div>
                                </div>
                                <button className="px-8 py-4 bg-indigo-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
                                    Upload Training Data
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'config' && (
                        <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 rounded-lg"><Brain size={14} className="text-indigo-400" /></div>
                                        <h4 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest italic">Behavioral DNA Protocol</h4>
                                    </div>
                                    <span className="text-[8px] font-mono text-white/10 italic">LLM_CLUSTER: GPT-4o-Turbo</span>
                                </div>
                                <textarea 
                                    className="w-full h-80 bg-black/40 border border-white/5 rounded-[2.5rem] p-10 text-xs text-white/60 leading-relaxed font-mono focus:border-[#00ffd1]/40 outline-none transition-all"
                                    defaultValue={currentAgent.config.prompt}
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <h5 className="text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
                                        <Database size={12} /> Live Knowledge Injectors
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {["Price_Matrix_v5", "Clinic_Availability", "Strategic_Objections"].map(doc => (
                                            <span key={doc} className="px-4 py-1.5 bg-[#00ffd1]/5 border border-[#00ffd1]/20 rounded-full text-[8px] text-[#00ffd1] font-mono font-black uppercase tracking-tighter">{doc}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] flex flex-col justify-center space-y-6">
                                    <h5 className="text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
                                        <Zap size={12} className="text-[#00ffd1]" /> Neural Action Pipeline
                                    </h5>
                                    <div className="space-y-4">
                                        {[
                                            { event: 'Email_Captured', action: 'Sync_to_HubSpot', status: 'Active' },
                                            { event: 'Appointment_Confirmed', action: 'Send_SMS_Template', status: 'Active' },
                                            { event: 'Price_Objection_Hit', action: 'Alert_Manager', status: 'Ready' }
                                        ].map((hook, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 group hover:border-[#00ffd1]/20 transition-all">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-mono text-white/40 uppercase italic">{hook.event}</p>
                                                    <p className="text-[9px] font-black text-white/80">{hook.action}</p>
                                                </div>
                                                <div className="h-1.5 w-1.5 rounded-full bg-[#00ffd1] animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 mt-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-mono text-white/20 uppercase tracking-widest hover:text-white transition-all">
                                        + Add Global Webhook
                                    </button>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Status Footer */}
                <div className="mt-auto p-8 border-t border-white/5 bg-[#050506] flex justify-between items-center font-mono text-[9px] text-white/20 uppercase italic tracking-widest relative z-20">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[#00ffd1] rounded-full animate-pulse" /> Neural_Sales_Engine: v5.2</span>
                        <div className="h-4 w-px bg-white/5" />
                        <span>Latency: 840ms</span>
                        <div className="h-4 w-px bg-white/5" />
                        <span className="text-[#00ffd1]/60">Outcome: Scheduled_Ready</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/10">
                        <History size={12} />
                        <span>Historical ROI: +₺84,500</span>
                    </div>
                </div>
           </div>
        </div>
      </div>

      {/* DEFENSE EDITOR MODAL (SIMULATED) */}
      {editingDefense !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="w-full max-w-lg bg-[#050506] border border-white/10 rounded-[2.5rem] p-10 space-y-8 relative shadow-[0_0_50px_rgba(255,0,0,0.1)]">
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Shield size={18} className="text-red-500" />
                        <h3 className="text-xs font-mono font-black text-white/60 uppercase tracking-widest">Logic Calibration</h3>
                      </div>
                      <button onClick={() => setEditingDefense(null)} className="text-white/20 hover:text-white transition-colors"><Plus className="rotate-45" size={24} /></button>
                  </div>
                  <div className="space-y-6">
                      <div className="space-y-3">
                          <label className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Trigger Scenario</label>
                          <input className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono" defaultValue={defenseProtocols[editingDefense].trigger} />
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Neural Strategy</label>
                          <textarea className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono resize-none" defaultValue={defenseProtocols[editingDefense].strategy} />
                      </div>
                  </div>
                  <button 
                    onClick={() => {
                        toast("Neural Logic Synchronized", "success");
                        setEditingDefense(null);
                    }}
                    className="w-full py-5 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Confirm Logic Injection
                  </button>
              </div>
          </div>
      )}


                    {activeTab === 'config' && (
                        <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 rounded-lg"><Brain size={14} className="text-indigo-400" /></div>
                                        <h4 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest italic">Core Behavioral Prompting</h4>
                                    </div>
                                    <span className="text-[8px] font-mono text-white/10 italic">MODEL_PROTOCOL: SALES_ELITE_v5</span>
                                </div>
                                <textarea 
                                    className="w-full h-80 bg-black/40 border border-white/5 rounded-[2.5rem] p-10 text-xs text-white/60 leading-relaxed font-mono focus:border-[#00ffd1]/40 outline-none transition-all shadow-inner"
                                    defaultValue={currentAgent.config.prompt}
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <h5 className="text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
                                        <Database size={12} /> Semantic Anchors
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {["Knowledge_Node_A", "Business_DNA_Sync", "Sales_Objection_Kits"].map(doc => (
                                            <span key={doc} className="px-4 py-1.5 bg-[#00ffd1]/5 border border-[#00ffd1]/20 rounded-full text-[8px] text-[#00ffd1] font-mono font-black uppercase">{doc}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] flex flex-col justify-center space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-mono text-white/40 italic"><span>Anti-Hallucination</span><span className="text-[#00ffd1] font-black">STRICT</span></div>
                                    <div className="flex justify-between items-center text-[10px] font-mono text-white/40 italic"><span>Closing Bias</span><span className="text-indigo-400 font-black">+45%</span></div>
                                    <div className="flex justify-between items-center text-[10px] font-mono text-white/40 italic"><span>Objection Defense</span><span className="text-red-500 font-black">REINFORCED</span></div>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'voice' && (
                        <div className="flex-1 flex flex-col p-12 space-y-12 animate-in zoom-in duration-500 overflow-y-auto scrollbar-hide">
                             {/* CALL ORCHESTRATION PIPELINE */}
                             <div className="w-full space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Zap size={18} className="text-[#00ffd1]" />
                                        <h3 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.4em] italic">Autonomous Outcome Orchestration</h3>
                                    </div>
                                    <span className="text-[8px] font-mono text-[#00ffd1]/60 border border-[#00ffd1]/20 px-3 py-1 rounded-full uppercase">End-to-End Logic Active</span>
                                </div>

                                <div className="grid grid-cols-4 gap-6">
                                    {[
                                        { label: 'Neural Scoring', value: '94/100', icon: Brain, color: 'indigo-400', desc: 'Intent & EQ match analysis' },
                                        { label: 'Instant SMS', value: 'SENT', icon: Send, color: 'emerald-400', desc: 'Booking confirmation link' },
                                        { label: 'CRM Sync', value: 'ACTIVE', icon: Database, color: 'amber-400', desc: 'HubSpot/Salesforce bridge' },
                                        { label: 'Cal. Lock', value: 'SECURED', icon: Lock, color: 'red-400', desc: 'Otonom slot reservation' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-[2rem] hover:border-white/10 transition-all group relative overflow-hidden">
                                            <div className={`absolute top-0 right-0 w-20 h-20 bg-${item.color}/5 blur-2xl -mr-10 -mt-10`} />
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div className={`p-3 bg-${item.color}/10 rounded-2xl text-${item.color}`}>
                                                    <item.icon size={20} />
                                                </div>
                                                <div className="h-2 w-2 rounded-full bg-[#00ffd1] animate-pulse" />
                                            </div>
                                            <div className="space-y-1 relative z-10">
                                                <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{item.label}</p>
                                                <p className={`text-sm font-black text-${item.color}`}>{item.value}</p>
                                                <p className="text-[9px] text-white/30 italic pt-2">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-12 pt-8">
                                 <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-mono text-white/20 uppercase tracking-widest block">Neural Voice Spectrum</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {["Jessica (Elite)", "Mark (Strategic)", "AIVA (Original)", "Custom_Node"].map(v => (
                                                <button key={v} className={`p-5 border rounded-2xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${v.includes('Jessica') ? 'bg-[#00ffd1] text-black border-[#00ffd1]' : 'bg-white/5 border-white/5 text-white/20 hover:text-white hover:border-white/10'}`}>{v}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex justify-between text-[10px] font-mono text-white/20 uppercase tracking-widest"><span>Neural Latency</span><span className="text-[#00ffd1]">840ms (Elite)</span></div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-indigo-500 to-[#00ffd1] w-[85%]" />
                                        </div>
                                    </div>
                                 </div>

                                 <div className="glass-panel p-8 bg-indigo-500/5 border-indigo-500/20 flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] animate-pulse" />
                                        <Volume2 size={48} className="text-indigo-400 relative z-10" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-[10px] font-mono font-black text-white/60 uppercase tracking-widest">Current Voice Clone</p>
                                        <p className="text-lg font-black text-white italic underline decoration-indigo-500/40 underline-offset-8">Jessica_Neural_v5.4</p>
                                    </div>
                                    <button className="px-10 py-4 bg-white text-black rounded-full font-black uppercase text-[9px] tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl">
                                        Test Acoustic Engine
                                    </button>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Status Dashboard Footer */}
                <div className="mt-auto p-8 border-t border-white/5 bg-[#050506] flex justify-between items-center font-mono text-[9px] text-white/20 uppercase italic tracking-widest relative z-20">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[#00ffd1] rounded-full animate-pulse shadow-[0_0_10px_#00ffd1]" /> Neural Engine: STABLE</span>
                        <div className="h-4 w-px bg-white/5" />
                        <span>Latency: {currentAgent.stats.latency}</span>
                        <div className="h-4 w-px bg-white/5" />
                        <span>Encryption: AES-256</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/10">
                        <History size={12} />
                        <span>Last Session ROI: +₺14,200</span>
                    </div>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
