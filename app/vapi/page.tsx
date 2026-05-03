"use client";
import { motion } from "framer-motion";
import { Mic, Terminal, Settings2, Play, Circle } from "lucide-react";

export default function VapiPage() {
  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-syne font-black tracking-tighter italic uppercase">AI Agents <span className="text-accent">Core</span></h1>
          <p className="text-white/20 font-mono text-[10px] mt-2 tracking-[0.4em]">VOICE_ENGINE_v4.5 // MACBOOK_AIR_LINK</p>
        </div>
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-3">
          <Circle className="h-3 w-3 text-accent fill-current animate-pulse" />
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-black">Neural_Active</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-panel p-12 min-h-[500px] relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Mic size={200} /></div>
          <div className="flex items-center justify-center gap-1.5 h-32 mb-12">
            {[...Array(40)].map((_, i) => (
              <motion.div key={i} animate={{ height: [20, 100, 40, 120, 20] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }} className="w-1.5 bg-gradient-to-t from-accent/20 to-accent rounded-full shadow-[0_0_20px_rgba(0,255,209,0.3)]" />
            ))}
          </div>
          <div className="bg-black/60 border border-white/10 rounded-3xl p-8 font-mono text-[11px] leading-loose">
            <p className="text-accent italic mb-2">// Anlık Transkript Akışı</p>
            <p className="text-white/60 mb-2">AI: Merhaba Melih, içerik dağıtım sistemin için YouTube Shorts paketlerini hazırladım.</p>
            <p className="text-white/20 animate-pulse">SİSTEM: Dinliyor...</p>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="glass-panel p-8 flex-1">
            <h3 className="text-[10px] font-mono text-white/30 uppercase mb-8 tracking-widest">Sistem Metrikleri</h3>
            {["Ses Gecikmesi: 85ms", "Sentez Kalitesi: 192kbps", "NLP Gücü: GPT-4o"].map(m => (
              <div key={m} className="p-4 mb-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-mono text-white/50">{m}</div>
            ))}
          </div>
          <button className="w-full py-6 bg-accent text-black font-black uppercase text-xs rounded-3xl shadow-[0_25px_50px_-10px_rgba(0,255,209,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
            <Play size={16} fill="currentColor" /> Sistemi Başlat
          </button>
        </div>
      </div>
    </div>
  );
}
