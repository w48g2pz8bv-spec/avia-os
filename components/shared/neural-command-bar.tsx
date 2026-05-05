"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Terminal, 
  Cpu, 
  Zap, 
  LayoutDashboard, 
  Radio, 
  Workflow, 
  Box, 
  BarChart3,
  Command,
  ChevronRight,
  Sparkles,
  BrainCircuit,
  MessageSquarePlus,
  Send,
  BookOpen,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/(app)/app-context";
import { useToast } from "@/lib/toast-context";

const ACTIONS = [
  { id: 'dash', label: 'Command Center', icon: LayoutDashboard, href: '/dashboard', category: 'Navigation' },
  { id: 'vapi', label: 'AI Voice Agents', icon: Radio, href: '/vapi', category: 'Navigation' },
  { id: 'auto', label: 'Automations', icon: Workflow, href: '/automations', category: 'Navigation' },
  { id: 'arch', label: 'Neural Architect', icon: Box, href: '/builder', category: 'Navigation' },
  { id: 'know', label: 'Knowledge Base', icon: BookOpen, href: '/knowledge', category: 'Intelligence' },
  { id: 'intel', label: 'Intelligence Audit', icon: BarChart3, href: '/analytics', category: 'Intelligence' },
  { id: 'sync', label: 'Force Neural Sync', icon: Cpu, category: 'System', shortcut: 'S' },
];

export default function NeuralCommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [injected, setInjected] = useState(false);
  const { addActivity, addKnowledge, selectedSector, isDbConnected } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const isTeachMode = useMemo(() => 
    query.startsWith('/') || query.toLowerCase().startsWith('teach') || query.toLowerCase().startsWith('öğret'), 
  [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback((action: typeof ACTIONS[0]) => {
    if (action.href) {
      router.push(action.href);
    }
    setIsOpen(false);
    setQuery("");
  }, [router]);

  const handleTeach = async () => {
    const knowledge = query.replace(/^\/|^teach\s*|^öğret\s*/i, '').trim();
    if (knowledge.length < 3) return;
    
    // Save to Supabase knowledge base with sector context
    await addKnowledge(knowledge, selectedSector.label);
    
    setInjected(true);
    toast(`Knowledge Injected to ${selectedSector.label} Cluster`, 'success');
    setTimeout(() => {
      setInjected(false);
      setIsOpen(false);
      setQuery("");
    }, 1200);
  };

  const filteredActions = ACTIONS.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[700px] z-[301]"
          >
            <div className={`glass-panel overflow-hidden border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-all duration-500 ${isTeachMode ? 'bg-[#00ffd1]/5' : 'bg-[#050506]/95'}`}>
              
              <div className="relative flex items-center p-8 border-b border-white/5">
                {isTeachMode ? (
                    <BrainCircuit className="absolute left-8 text-[#00ffd1] animate-pulse" size={22} />
                ) : (
                    <Search className="absolute left-8 text-white/20" size={20} />
                )}
                
                <input
                  autoFocus
                  placeholder={isTeachMode ? "Inject knowledge into AIVA..." : "Type a command or search..."}
                  className="w-full bg-transparent pl-14 pr-12 py-3 text-xl font-syne outline-none text-white placeholder:text-white/10 italic"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && isTeachMode && handleTeach()}
                />

                {isTeachMode ? (
                    <button 
                        onClick={handleTeach}
                        className="absolute right-8 p-2 bg-[#00ffd1] text-black rounded-lg hover:bg-white transition-all"
                    >
                        <Send size={16} />
                    </button>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                        <Command size={10} className="text-white/40" />
                        <span className="text-[10px] font-mono text-white/40 uppercase">K</span>
                    </div>
                )}
              </div>

              <div className="max-h-[450px] overflow-y-auto p-4 scrollbar-hide">
                {isTeachMode ? (
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-4 text-[#00ffd1]">
                            <BrainCircuit size={24} className="opacity-60" />
                            <h3 className="text-xs font-mono font-black uppercase tracking-[0.4em]">Training_Mode_Active</h3>
                        </div>
                        {injected ? (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-6 bg-[#00ffd1]/10 border border-[#00ffd1]/30 rounded-3xl flex items-center gap-4"
                            >
                                <CheckCircle2 size={24} className="text-[#00ffd1]" />
                                <div>
                                  <p className="text-sm font-black text-[#00ffd1] uppercase">Knowledge Injected!</p>
                                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Syncing to {selectedSector.label} knowledge cluster...</p>
                                </div>
                            </motion.div>
                        ) : (
                          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                              <p className="text-sm text-white/60 font-mono leading-relaxed">
                                  Teaching AIVA about the <span className="text-[#00ffd1] font-black">{selectedSector.label}</span> sector. 
                                  Information entered here will be <span className="text-white font-black">{isDbConnected ? 'saved to the neural database' : 'stored in session memory'}</span>.
                              </p>
                              <div className="flex items-center gap-3">
                                <div className={`h-1.5 w-1.5 rounded-full ${isDbConnected ? 'bg-[#00ffd1] animate-pulse' : 'bg-amber-500'}`} />
                                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                  {isDbConnected ? 'Database: Connected — Data will persist' : 'Session Mode — Configure Supabase to persist'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 italic">
                                  <Sparkles size={12} /> Press Enter or Send to Commit Injection
                              </div>
                          </div>
                        )}
                    </div>
                ) : filteredActions.length === 0 ? (
                  <div className="p-20 text-center space-y-4">
                    <Terminal size={48} className="mx-auto text-white/5" />
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] italic">No neural pathways found</p>
                  </div>
                ) : (
                  <div className="space-y-6 py-4">
                    {['Navigation', 'Intelligence', 'System'].map(category => {
                      const group = filteredActions.filter(a => a.category === category);
                      if (group.length === 0) return null;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <h3 className="px-6 py-2 text-[10px] font-mono font-black text-white/10 uppercase tracking-[0.4em]">{category}</h3>
                          {group.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleSelect(action)}
                              className="w-full flex items-center justify-between px-6 py-4 rounded-[2rem] hover:bg-white/[0.03] transition-all group"
                            >
                              <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/5 rounded-2xl text-white/20 group-hover:text-[#00ffd1] group-hover:bg-[#00ffd1]/10 transition-all border border-transparent group-hover:border-[#00ffd1]/20">
                                  <action.icon size={18} />
                                </div>
                                <span className="text-base font-black text-white/40 group-hover:text-white transition-colors uppercase italic tracking-tight">{action.label}</span>
                              </div>
                              <ChevronRight size={16} className="text-white/5 group-hover:text-[#00ffd1] transition-colors" />
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 bg-black/60 border-t border-white/5 flex justify-between items-center px-10">
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#00ffd1] animate-pulse" />
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest italic">AIVA Neural Command v1.0.8 // NOMINAL</p>
                 </div>
                 <div className="flex gap-6 text-[9px] font-mono text-white/10 uppercase tracking-widest">
                    <span>↑↓ Select</span>
                    <span>↵ Commit</span>
                    <span>ESC Exit</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
