"use client";
import { motion } from "framer-motion";
import { Activity, Zap, Shield, Database } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="relative px-6 py-32 bg-[#050506]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="font-syne mb-4 text-4xl font-black tracking-tighter text-white md:text-6xl">
            Neural Kontrol Merkezi.
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            Gerçek zamanlı büyüme verilerini izleyin
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Ana Dashboard Paneli */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="glass-panel lg:col-span-2 rounded-[3rem] p-10 border border-white/10"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex gap-4">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">CDS_PROTOCOL_V4</span>
            </div>
            
            <div className="grid gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">İçerik Dağıtım Akışı</h3>
                <div className="space-y-4">
                  {[75, 45, 90].map((val, i) => (
                    <div key={i} className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${val}%` }}
                        className="h-full bg-gradient-to-r from-[#8b6cff] to-[#00ffd1]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-spin-slow" />
                  <div className="absolute inset-4 rounded-full border-2 border-[#00ffd1]/20 border-t-[#00ffd1] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black text-white">98%</span>
                    <span className="text-[8px] font-bold text-white/30 tracking-widest uppercase">Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Yan İstatistik Paneli */}
          <div className="space-y-8">
            {[
              { icon: Zap, label: "Neural Speed", val: "12ms" },
              { icon: Shield, label: "Security", val: "Optimal" },
              { icon: Database, label: "Storage", val: "Cloud" }
            ].map((stat) => (
              <motion.div 
                key={stat.label}
                whileHover={{ x: 10 }}
                className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center gap-6"
              >
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-[#00ffd1]" />
                </div>
                <div>
                  <div className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
                  <div className="text-lg font-bold text-white">{stat.val}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}