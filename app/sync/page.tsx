"use client";
import { motion } from "framer-motion";
import { Video, Camera, Music, Share2, Cpu, Zap } from "lucide-react";

export default function ContentPage() {
  const platforms = [
    { name: "YouTube", icon: Video, color: "#FF0000", val: "READY" },
    { name: "Instagram", icon: Camera, color: "#E4405F", val: "SYNC" },
    { name: "TikTok", icon: Music, color: "#00f2ea", val: "ACTIVE" }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-syne font-black tracking-tighter uppercase italic">Content <span className="text-accent">Distro</span></h1>
          <p className="text-white/20 font-mono text-[10px] mt-2 tracking-[0.6em]">CDS_PROTOCOL_v4.5 // GLOBAL_SYNC</p>
        </div>
        <div className="p-4 glass-panel flex items-center gap-4 border-accent/20">
          <Cpu className="text-accent animate-spin-slow" size={20} />
          <div className="text-right">
             <div className="text-[10px] font-mono text-white/40">GPU_LOAD</div>
             <div className="text-xs font-syne font-black text-accent">84%</div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {platforms.map((p, i) => (
          <div key={i} className="glass-panel p-10 group hover:border-accent/40 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p.icon className="h-10 w-10 mb-8 transition-transform group-hover:scale-110" style={{ color: p.color }} />
            <h3 className="text-lg font-syne font-bold text-white mb-2">{p.name}</h3>
            <span className="text-[9px] font-mono text-accent uppercase tracking-widest">{p.val}</span>
          </div>
        ))}
      </div>

      <div className="glass-panel p-12 bg-gradient-to-br from-accent/5 to-transparent relative overflow-hidden">
        <Zap className="absolute right-0 bottom-0 text-accent opacity-5 -mr-10 -mb-10" size={300} />
        <h3 className="text-sm font-syne font-bold uppercase tracking-widest text-white/80 mb-8 italic">Neural Dağıtım İşleme Hattı</h3>
        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
           <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} className="h-full bg-accent shadow-[0_0_15px_#00ffd1]" />
        </div>
        <p className="mt-6 text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] animate-pulse">Batch_Render_In_Progress: shorts_pack_may_03.mp4</p>
      </div>
    </div>
  );
}
