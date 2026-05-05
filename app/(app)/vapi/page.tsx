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
  Trash2
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
  const { knowledgeBase } = useApp();
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
    
    // Neural API Call
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
        toast("Voice Calibration Complete", "success");

        // Trigger Web Speech API (Text-to-Speech)
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(response);
            utterance.rate = 1.0;
            utterance.pitch = 1.1;
            utterance.lang = "tr-TR";
            window.speechSynthesis.speak(utterance);
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
        title="Agent Lab" 
        statusText={`Current Node: ${selectedAgent} // Operational`}
        action={
          <div className="flex gap-4">
             <button 
                onClick={() => { setMessages([]); setNeuralLogs([]); }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-mono text-white/40 hover:text-white transition-all"
             >
                <Trash2 size={14} /> Clear Session
             </button>
             <button 
                onClick={() => toast("Neural Link Established", "success")}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all"
             >
                <Phone size={14} fill="black" /> Initiate Live Test
             </button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT: AGENT REGISTRY & EMOTIONAL PROTOCOLS */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h2 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Neural Clusters</h2>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div 
                    key={agent.name}
                    onClick={() => { setSelectedAgent(agent.name); setMessages([]); }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer group ${selectedAgent === agent.name ? 'bg-[#00ffd1]/10 border-[#00ffd1]/40 shadow-[0_0_20px_rgba(255,255,209,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-sm font-bold uppercase tracking-tight ${selectedAgent === agent.name ? 'text-[#00ffd1]' : 'text-white/60'}`}>{agent.name}</span>
                        <Mic size={14} className={selectedAgent === agent.name ? 'text-[#00ffd1]' : 'text-white/10'} />
                    </div>
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{agent.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NEW: EMOTIONAL PROTOCOLS (EQ LAYER) */}
          <div className="glass-panel p-8 space-y-6 bg-[#00ffd1]/5 border-[#00ffd1]/20">
             <div className="flex items-center gap-3">
                <Brain size={18} className="text-[#00ffd1]" />
                <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Neural Persona Protocols</h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {[
                    { id: 'calm', label: 'Calm & Firm', desc: 'Crisis Management Mode', color: 'bg-blue-400' },
                    { id: 'empathy', label: 'Empathetic Soft', desc: 'Patient Support Mode', color: 'bg-[#00ffd1]' },
                    { id: 'sales', label: 'High-Energy Sales', desc: 'Conversion Optimization', color: 'bg-amber-500' }
                ].map((p) => (
                    <button 
                        key={p.id}
                        onClick={() => {
                            addNeuralLog(`Protocol Switch: ${p.label} Activated`);
                            toast(`Emotional Protocol: ${p.label}`, "info");
                        }}
                        className="flex flex-col gap-1 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#00ffd1]/40 transition-all text-left group"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-white/80 group-hover:text-white transition-colors">{p.label}</span>
                            <div className={`h-1.5 w-1.5 rounded-full ${p.color} animate-pulse`} />
                        </div>
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest italic">{p.desc}</span>
                    </button>
                ))}
             </div>
          </div>

          <div className="glass-panel p-8 space-y-6 bg-black/40 border-white/5">
             <div className="flex items-center gap-3">
                <Sliders size={16} className="text-[#00ffd1]" />
                <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Simulation Diagnostics</h3>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-white/40">
                        <span>EQ Alignment</span>
                        <span className="text-[#00ffd1]">98.2%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '98.2%' }}
                            className="h-full bg-[#00ffd1]" 
                        />
                    </div>
                </div>
                <div className="space-y-3 font-mono">
                    <p className="text-[8px] text-white/10 uppercase tracking-widest">Active Reasoning Logs</p>
                    <div className="space-y-2 min-h-[120px] max-h-[120px] overflow-y-auto scrollbar-hide">
                        {neuralLogs.length === 0 ? (
                            <p className="text-[9px] text-white/5 italic">Awaiting neural activity...</p>
                        ) : (
                            neuralLogs.map((log, i) => (
                                <p key={i} className="text-[9px] text-[#00ffd1]/40 animate-in slide-in-from-left-2 duration-300 italic">{log}</p>
                            ))
                        )}
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT: WORKSPACE (CONSOLE / CONFIG) */}
        <div className="col-span-12 lg:col-span-8">
           <div className="glass-panel h-full min-h-[750px] flex flex-col overflow-hidden relative">
                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-white/[0.02] relative z-20">
                    {[
                        { id: 'console', label: 'Live Simulator', icon: Terminal },
                        { id: 'config', label: 'Prompt Engineer', icon: Sliders },
                        { id: 'voice', label: 'Voice Lab', icon: Volume2 }
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

                <div className="flex-1 flex flex-col p-0 relative h-full">
                    {activeTab === 'console' && (
                        <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500">
                             <div className="flex-1 p-8 overflow-y-auto scrollbar-hide space-y-8" ref={scrollRef}>
                                 {messages.length === 0 && (
                                     <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-10">
                                         <MessageSquare size={48} />
                                         <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Awaiting Input to Begin Simulation</p>
                                     </div>
                                 )}
                                 {messages.map((msg, i) => (
                                     <div key={i} className={`flex gap-6 items-start animate-in slide-in-from-bottom-2 duration-500 ${msg.role === 'assistant' ? 'text-[#00ffd1]' : ''}`}>
                                         <div className="w-12 text-[10px] font-black uppercase mt-1 opacity-20">{msg.role === 'user' ? 'USER' : 'AIVA'}</div>
                                         <div className="flex-1 space-y-4">
                                             <p className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'text-white' : 'text-white/60 italic'}`}>"{msg.content}"</p>
                                             {msg.role === 'assistant' && i === messages.length - 1 && (
                                                 <div className="p-6 bg-[#00ffd1]/5 border border-[#00ffd1]/10 rounded-3xl">
                                                     <VapiWaveform />
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                 ))}
                                 {isProcessing && (
                                     <div className="flex gap-6 items-start animate-pulse">
                                         <div className="w-12 text-[10px] font-black uppercase mt-1 text-[#00ffd1] opacity-40">AIVA</div>
                                         <div className="flex-1 flex items-center gap-3 text-white/20 italic font-mono text-xs">
                                             <Loader2 size={12} className="animate-spin" /> Thinking...
                                         </div>
                                     </div>
                                 )}
                             </div>
                             
                             <form onSubmit={handleSendMessage} className="p-8 border-t border-white/5 bg-black/40">
                                 <div className="relative group">
                                     <input 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder={`Message ${selectedAgent}...`}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-8 pr-16 text-sm text-white focus:border-[#00ffd1]/40 focus:bg-white/[0.08] transition-all outline-none"
                                     />
                                     <button 
                                        type="submit"
                                        disabled={!chatInput.trim() || isProcessing}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#00ffd1] text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                                     >
                                         <Send size={16} />
                                     </button>
                                 </div>
                             </form>
                        </div>
                    )}

                    {activeTab === 'config' && (
                        <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-mono font-black text-[#00ffd1] uppercase tracking-widest italic">Prompt Engineering Core</h4>
                                    <span className="text-[8px] font-mono text-white/10 italic">LLM: GPT-4o-Turbo</span>
                                </div>
                                <textarea 
                                    className="w-full h-80 bg-black/40 border border-white/5 rounded-3xl p-8 text-xs text-white/80 leading-relaxed font-mono focus:border-[#00ffd1]/40 outline-none transition-all"
                                    defaultValue={currentAgent.config.prompt}
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                                    <h5 className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Semantic Context</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {["Price_List.pdf", "FAQ_v2.docx"].map(doc => (
                                            <span key={doc} className="px-3 py-1 bg-[#00ffd1]/5 border border-[#00ffd1]/20 rounded-full text-[8px] text-[#00ffd1] font-mono">{doc}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                                    <h5 className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Logic Filters</h5>
                                    <div className="flex justify-between items-center text-[10px] font-mono text-white/40 italic"><span>Anti-Hallucination</span><span className="text-[#00ffd1]">Active</span></div>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'voice' && (
                        <div className="flex flex-col items-center justify-center h-full p-8 space-y-12 animate-in zoom-in duration-500">
                             <div className="relative group">
                                <div className="absolute inset-0 bg-[#00ffd1]/10 blur-[120px] animate-pulse" />
                                <div className="w-56 h-56 rounded-full border border-[#00ffd1]/20 flex items-center justify-center relative bg-black shadow-[0_0_80px_rgba(0,255,209,0.05)]">
                                    <Volume2 size={64} strokeWidth={0.5} className="text-[#00ffd1]" />
                                </div>
                             </div>
                             <div className="w-full max-w-md space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Neural Voice Clone</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {["Jessica (Pro)", "Mark (Warm)", "AIVA (Native)", "Custom_Node"].map(v => (
                                            <button key={v} className={`p-4 border rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${v.includes('Jessica') ? 'bg-[#00ffd1] text-black' : 'bg-white/5 border-white/5 text-white/20 hover:text-white'}`}>{v}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6 pt-4">
                                    <div className="flex justify-between text-[10px] font-mono text-white/20 uppercase tracking-widest"><span>Neural Pitch</span><span>1.0x</span></div>
                                    <div className="h-1 w-full bg-white/5 rounded-full"><div className="h-full bg-[#00ffd1] w-1/2" /></div>
                                </div>
                             </div>
                             <button className="px-12 py-5 bg-[#00ffd1] text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(0,255,209,0.2)]">
                                Preview Calibration
                             </button>
                        </div>
                    )}
                </div>

                {/* Footer Footer Dashboard */}
                <div className="mt-auto p-6 border-t border-white/5 bg-[#050506]/80 flex justify-between items-center font-mono text-[9px] text-white/20 uppercase italic tracking-widest relative z-20">
                    <span>Neural_Engine_v4.5.1 // SECURE_SYNC</span>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><div className="h-1 w-1 bg-[#00ffd1] rounded-full" /> Latency: {currentAgent.stats.latency}</span>
                        <span className="flex items-center gap-2"><div className="h-1 w-1 bg-[#00ffd1] rounded-full" /> Success: {currentAgent.stats.success}</span>
                    </div>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}




