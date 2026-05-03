"use client";
import { motion } from "framer-motion";

export default function NeuralMap() {
  return (
    <section id="zeka" className="py-60 relative overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent" />
              <span className="text-[10px] font-mono text-accent tracking-[0.5em] uppercase">Global_Sync_Active</span>
            </div>
            <h2 className="font-syne text-7xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
              Global <br /> <span className="shimmer-text font-outline">Neural</span> <br /> Dağıtım.
            </h2>
            <p className="text-white/30 font-outfit text-xs max-w-sm leading-loose uppercase tracking-widest">
              Verileriniz saniyede 12ms gecikme ile küresel sinir ağlarına aktarılır. Tam senkronizasyon sağlandı.
            </p>
          </motion.div>

          {/* ChatGPT'yi Şaşırtacak Olan Teknik Panel */}
          <div className="relative glass-panel rounded-[3rem] p-16 min-h-[500px] border border-white/5 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  {["LATENCY: 12ms", "BUFFER: 0.0s", "NODES: 4,096"].map((text, i) => (
                    <div key={i} className="font-mono text-[8px] text-white/40 tracking-widest flex items-center gap-2">
                      <div className="h-1 w-1 bg-accent rounded-full" /> {text}
                    </div>
                  ))}
                </div>
                <div className="text-right font-mono text-[8px] text-accent/40 animate-pulse">
                  SYSTEM_ENCRYPTED_V4
                </div>
              </div>

              {/* Dinamik Çekirdek */}
              <div className="flex justify-center my-12">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-40 h-40 border border-dashed border-accent/20 rounded-full flex items-center justify-center p-8"
                >
                  <div className="w-full h-full border border-accent/40 rounded-full animate-ping opacity-20" />
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                {["NYC", "LON", "TKY"].map((city) => (
                  <div key={city} className="text-center font-mono text-[8px] text-white/20">
                    <div className="mb-1">{city}</div>
                    <div className="text-accent/60">CONNECTED</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
