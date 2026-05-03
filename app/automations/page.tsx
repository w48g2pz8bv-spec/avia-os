"use client";
import { motion } from "framer-motion";
import { Zap, MessageSquare, Star, ArrowDown } from "lucide-react";

export default function AutomationsPage() {
  const steps = [
    { name: "Trigger", detail: "Yeni Müşteri Kaydı", icon: Zap, color: "#00ffd1" },
    { name: "Action", detail: "WhatsApp Hoşgeldin Mesajı", icon: MessageSquare, color: "#25D366" },
    { name: "Feedback", detail: "Google Yorum Talebi", icon: Star, color: "#ffcf00" }
  ];

  return (
    <div className="space-y-12">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-syne font-black tracking-tighter mb-4 italic uppercase">Neural <span className="text-accent">Workflows</span></h1>
        <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">Automate_Scale_Repeat // V1.0</p>
      </header>

      <div className="flex flex-col items-center gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-4 w-full max-w-xl">
            <motion.div whileHover={{ scale: 1.02 }} className="w-full glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex items-center gap-8 group">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 group-hover:border-accent/40 transition-colors">
                <step.icon className="h-6 w-6" style={{ color: step.color }} />
              </div>
              <div>
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{step.name}</span>
                <h3 className="text-white font-syne font-bold text-lg">{step.detail}</h3>
              </div>
            </motion.div>
            {i !== steps.length - 1 && <ArrowDown className="text-accent/20 h-6 w-6 animate-bounce" />}
          </div>
        ))}
      </div>
    </div>
  );
}
