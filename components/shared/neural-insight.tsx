"use client";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/app/(app)/app-context";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, ChevronRight, X, TrendingUp, AlertCircle, Lightbulb, Zap, Activity } from "lucide-react";

export default function NeuralInsight() {
  const pathname = usePathname();
  const { selectedSector, efficiencyStats, addActivity } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // Generate dynamic insights based on current context
  const activeInsight = useMemo(() => {
    const sector = selectedSector.label;

    if (pathname.includes('dashboard')) {
      return {
        id: 'dash',
        type: 'strategy',
        title: 'Neural Loop Optimization',
        content: `Efficiency is at ${efficiencyStats.successRate}%. In the ${sector} sector, we can gain 2.4% by refining the Agent reasoning logs.`,
        icon: Brain,
        color: 'text-[#00ffd1]'
      };
    }
    if (pathname.includes('builder')) {
      return {
        id: 'build',
        type: 'growth',
        title: 'Architectural Synergy',
        content: `Typical ${sector} landing pages convert 18% better with high-contrast CTAs. Should I adjust the global style DNA?`,
        icon: Lightbulb,
        color: 'text-blue-400'
      };
    }
    if (pathname.includes('sync')) {
      return {
        id: 'sync',
        type: 'alert',
        title: 'Propagation Safety',
        content: `System health is NOMINAL. Deploying now will hit peak traffic windows for ${sector} leads.`,
        icon: Zap,
        color: 'text-purple-400'
      };
    }
    return {
      id: 'gen',
      type: 'system',
      title: 'AIVA OS Standing By',
      content: `I am analyzing ${sector} trends. Ready to architect your next growth phase.`,
      icon: Sparkles,
      color: 'text-white/40'
    };
  }, [pathname, selectedSector, efficiencyStats]);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsThinking(true);
      setTimeout(() => setIsThinking(false), 2000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleExecute = () => {
    addActivity(`AI Strategy Executed: ${activeInsight.title}`, 'system');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-12 right-12 z-[200] w-[420px]"
        >
          <div className="glass-panel p-8 border-[#00ffd1]/20 shadow-[0_0_80px_rgba(0,0,255,0.2)] overflow-hidden relative group bg-black/80 backdrop-blur-3xl">
            {/* Animated Neural Pulse */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#00ffd1]/5 rounded-full blur-[80px] animate-pulse" />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`p-3 bg-white/5 rounded-2xl ${activeInsight.color} border border-white/10`}>
                    <activeInsight.icon size={20} className={isThinking ? 'animate-pulse' : ''} />
                  </div>
                  {isThinking && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ffd1] rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-mono font-black text-white/40 uppercase tracking-[0.4em]">Neural_Advisor</p>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest">{isThinking ? 'Thinking...' : 'Stable'}</span>
                  </div>
                  <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest mt-1">Intelligence_Layer_Active // {selectedSector.label}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/5 rounded-full text-white/10 hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <h3 className="text-xl font-syne font-black text-white uppercase tracking-tight italic flex items-center gap-3">
                  {activeInsight.title}
                  <Activity size={14} className="text-[#00ffd1] opacity-20" />
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-mono italic">
                  "{activeInsight.content}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/20 uppercase">Confidence</span>
                    <span className="text-[10px] font-mono text-[#00ffd1] font-black">94.2%</span>
                  </div>
                  <div className="h-8 w-px bg-white/5" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/20 uppercase">Impact</span>
                    <span className="text-[10px] font-mono text-blue-400 font-black">High</span>
                  </div>
                </div>
                <button
                  onClick={handleExecute}
                  className="bg-white/5 border border-white/10 hover:border-[#00ffd1]/40 px-5 py-3 rounded-2xl flex items-center gap-3 group transition-all"
                >
                  <span className="text-[10px] font-mono font-black text-white group-hover:text-[#00ffd1] uppercase tracking-widest">Execute Strategy</span>
                  <ChevronRight size={14} className="text-[#00ffd1] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Neural Matrix Decorative Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
